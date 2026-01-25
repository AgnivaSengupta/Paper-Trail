package main

import (
	"context"
	"encoding/json"
	"fmt"
	"log"
	"os"
	"os/signal"
	"syscall"
	"time"

	"github.com/AgnivaSengupta/analytics-engine/internal/queue"
	"github.com/jackc/pgx/v5"
	"github.com/jackc/pgx/v5/pgxpool"
	"github.com/mssola/user_agent"
)

type AnalyticsEvent struct {
	PostID string `json:"post_id"` // Changed from blog_id
	// Url       string `json:"url"`
	UserID    string `json:"user_id,omitempty"`
	AUTHORID  string `json:"author_id,omitempty"`
	EventType string `json:"eventType"`
	Timestamp int64  `json:"timestamp"` // Changed from time.Time to int64
	Referrer  string `json:"referrer,omitempty"`
	UserAgent string `json:"userAgent,omitempty"`
	IPAddress string `json:"ip_address"` // Populated by API enrichment

	// Metrics (Pointers to handle nulls)
	ScrollDepth *int `json:"depth_percentage,omitempty"`
	TimeSpent   *int `json:"duration_seconds,omitempty"`

	// Enriched Data (from API)
	GeoCountry string `json:"geo_country,omitempty"`
	GeoRegion  string `json:"geo_region,omitempty"`
	DeviceType string `json:"device_type,omitempty"`
	OS         string `json:"os_name,omitempty"`
}

func main() {

	fmt.Println("DEBUG: Dumping Environment Variables...")
	fmt.Printf("DEBUG: REDIS_DSN='%s'\n", os.Getenv("REDIS_DSN"))
	fmt.Printf("DEBUG: DB_DSN='%s'\n", os.Getenv("DB_DSN"))

	if err := queue.InitReddis(); err != nil {
		log.Fatalf("Failed to init Redis: %v", err)
	}

	dbUrl := os.Getenv("DB_DSN")
	if dbUrl == "" {
		dbUrl = "postgres://user:password@localhost:5432/analytics"
	}

	dbPool, err := pgxpool.New(context.Background(), dbUrl)
	if err != nil {
		log.Fatalf("Unable to connect to database: %v", err)
	}
	defer dbPool.Close()

	queries := []string{

		`CREATE TABLE IF NOT EXISTS analytics_events (
			id BIGSERIAL PRIMARY KEY,

		    -- 1. Core Event Data
		    post_id VARCHAR(50) NOT NULL,
		    event_type VARCHAR(50) NOT NULL,  -- 'page_view', 'scroll_depth', 'heartbeat'
		    event_time TIMESTAMPTZ NOT NULL,  -- Converted from your int64 timestamp

		    -- 2. User Context
			user_id VARCHAR(100),
			author_id VARCHAR(100),
		    referrer TEXT,
		    user_agent TEXT,                  -- Store the raw string for debugging
		    ip_address INET,                  -- Store IP efficiently

		    -- 3. Derived Dimensions (The "Enriched" data)
		    geo_country CHAR(2),              -- 'US', 'IN'
		    geo_region VARCHAR(100),          -- 'California', 'West Bengal'
		    device_type VARCHAR(20),          -- 'mobile', 'desktop'
		    os_name VARCHAR(50),              -- 'Windows 10', 'Android'

		    -- 4. Metrics (Nullable)
		    scroll_depth_percent INT,         -- NULL for page_view
		    time_spent_sec INT,               -- NULL for page_view

		    created_at TIMESTAMPTZ DEFAULT NOW()
		);`,

		`CREATE UNIQUE INDEX IF NOT EXISTS idx_unique_event ON analytics_events (post_id, user_id, event_time);`,

		`CREATE INDEX IF NOT EXISTS idx_lookup ON analytics_events (post_id, event_time DESC)`,
	}

	for _, q := range queries {
		_, err = dbPool.Exec(context.Background(), q)
		if err != nil {
			log.Fatalf("Schema warning: %v", err)
		}
	}

	log.Println("🚀 Worker started. Listening for events...")

	// 4. Start Processing Loop
	processQueue(dbPool)
}

func processQueue(db *pgxpool.Pool) {
	batchSize := 500
	batchTimeout := 5 * time.Second

	var batch []AnalyticsEvent
	ticker := time.NewTicker(batchTimeout)
	defer ticker.Stop()

	ctx := context.Background()

	// Graceful Shutdown handling
	sigChan := make(chan os.Signal, 1)
	signal.Notify(sigChan, syscall.SIGINT, syscall.SIGTERM)

	for {
		select {
		case <-sigChan:
			log.Println("Shutting down worker...")
			if len(batch) > 0 {
				flushToDB(db, batch)
			}
			return

		case <-ticker.C:
			// Time trigger: Flush if we have anything pending
			if len(batch) > 0 {
				fmt.Printf("⏱️ Timeout reached. Flushing %d events.\n", len(batch))
				flushToDB(db, batch)
				batch = nil // Reset
			}

		default:
			// Fetch from Redis (Blocking Pop with 1s timeout to allow loop to check ticker)
			// We use BLPOP to wait efficiently without burning CPU
			result, err := queue.Client.BLPop(ctx, 1*time.Second, "analytics_queue").Result()

			if err != nil {
				// Redis Timeout (no data) is not a fatal error, just loop again
				continue
			}

			// Parse Data (result[1] contains the JSON payload)
			var event AnalyticsEvent
			if err := json.Unmarshal([]byte(result[1]), &event); err != nil {
				log.Printf("❌ Bad JSON: %v", err)
				continue
			}

			batch = append(batch, event)

			// Size trigger: Flush if full
			if len(batch) >= batchSize {
				fmt.Printf("📦 Batch full. Flushing %d events.\n", len(batch))
				flushToDB(db, batch)
				batch = nil // Reset
			}
		}
	}
}

func flushToDB(db *pgxpool.Pool, batch []AnalyticsEvent) {

	pgxBatch := &pgx.Batch{}

	for _, e := range batch {

		ua := user_agent.New(e.UserAgent)

		e.OS = ua.OSInfo().Name
		if e.OS == "" {
			e.OS = "Unknown"
		}

		e.DeviceType = "desktop"
		if ua.Mobile() {
			e.DeviceType = "mobile"
		}

		if e.IPAddress == "127.0.0.1" || e.IPAddress == "::1" {
			e.GeoCountry = "Local"
			e.GeoRegion = "Localhost"
		} else {
			e.GeoCountry = "XX" // Placeholder
			e.GeoRegion = "Unknown"
		}

		// Normalize UserID for the Unique Constraint
		uid := e.UserID
		if uid == "" {
			uid = "anon"
		}

		var ip interface{} = e.IPAddress
		if e.IPAddress == "" {
			ip = nil
		}

		eventTime := time.Unix(e.Timestamp/1000, 0)
		if e.Timestamp == 0 {
			eventTime = time.Now()
		}

		query := `
		INSERT INTO analytics_events
					(post_id, event_type, event_time, user_id, referrer, user_agent, ip_address,
					 geo_country, geo_region, device_type, os_name, scroll_depth_percent, author_id, time_spent_sec)
					VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14)
					`

		// pgxBatch.Queue(query, e.Timestamp, e.BlogID, e.Url, uid, e.EventType, e.UserAgent, e.IPAddress)

		pgxBatch.Queue(query,
			e.PostID, e.EventType, eventTime, uid, e.Referrer, e.UserAgent, ip,
			e.GeoCountry, e.GeoRegion, e.DeviceType, e.OS, e.ScrollDepth, e.AUTHORID, e.TimeSpent,
		)
	}

	br := db.SendBatch(context.Background(), pgxBatch)
	defer br.Close()

	_, err := br.Exec()
	if err != nil {
		log.Printf("❌ Failed to insert batch: %v", err)
		// Nuance: In production, you would push these back to a "Dead Letter Queue" in Redis
	} else {
		log.Printf("✅ Synced %d events to Postgres", len(batch))
	}
}
