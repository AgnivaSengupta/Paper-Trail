package main

import (
	"context"
	"encoding/json"
	"log"
	"time"

	"github.com/AgnivaSengupta/analytics-engine/internal/queue"
	"github.com/gofiber/fiber/v2"
	"github.com/gofiber/fiber/v2/middleware/cors"

	// "github.com/gofiber/fiber/v2/middleware/logger"
	"github.com/gofiber/fiber/v2/middleware/recover"
)

type AnalyticsPayload struct {
	Events []AnalyticsEvent `json:"events"`
}

// type AnalyticsEvent struct {
// 	PostID    string `json:"post_id"`               // Maps "postId" -> PostID
// 	EventType string `json:"eventType"`            // "page_view", "scroll_depth", etc.
// 	Timestamp int64  `json:"timestamp"`            // Unix millisecond timestamp
// 	SessionID string `json:"session_id,omitempty"` // Recommended: Add this to frontend!

// 	// --- Context (Page View) ---
// 	Referrer  string `json:"referrer,omitempty"`
// 	UserAgent string `json:"userAgent,omitempty"` // Frontend sends this explicitly

// 	// --- Specific Metrics (Pointers allow null values) ---
// 	ScrollDepth *int `json:"depth_percentage,omitempty"` // For "scroll_depth"
// 	TimeSpent   *int `json:"duration_seconds,omitempty"` // For "heartbeat"

// 	// --- Enriched Data (Derived by Backend, not in JSON) ---
// 	IPAddress  string `json:"-"`
// 	GeoCountry string `json:"-"`
// 	GeoRegion  string `json:"-"`
// 	DeviceType string `json:"-"` // 'mobile', 'desktop'
// 	OS         string `json:"-"` // 'Android', 'Windows'
// }

type AnalyticsEvent struct {
	PostID string `json:"post_id"` // Changed from blog_id
	// Url       string `json:"url"`
	UserID    string `json:"user_id,omitempty"`
	AuthorID  string `json:"author_id,omitempty"`
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
	// initializing the redis client
	if err := queue.InitReddis(); err != nil {
		log.Fatalf("Could not connect to redis: %v", err)
	}
	defer queue.Client.Close()

	ctx, cancel := context.WithCancel(context.Background())
	defer cancel()
	queue.StartBatcher(ctx)

	// fiber app
	app := fiber.New(fiber.Config{
		AppName:   "Analytics_Ingestion_Engine",
		BodyLimit: 4 * 1024 * 1024,
	})

	// middleware
	// app.Use(logger.New())
	app.Use(recover.New())

	app.Use(cors.New(cors.Config{
		// AllowOrigins: "https://your-blog.com, http://localhost:5173",
		AllowOrigins: "*",
		AllowMethods: "GET,POST,OPTIONS",
		AllowHeaders: "Origin, Content-Type, Accept, User-Agent",
	}))

	// Routes
	app.Get("/health", func(c *fiber.Ctx) error {
		return c.SendString("OK")
	})

	app.Post("/api/ingest", handleIngest)

	log.Println("Ingestion Service running on port 8080")
	// Listen on 8080 to match your Dockerfile
	log.Fatal(app.Listen(":8080"))
}

func handleIngest(c *fiber.Ctx) error {

	var payload AnalyticsPayload

	if err := c.BodyParser(&payload); err != nil {
		return c.Status(fiber.StatusBadRequest).SendString("Invalid JSON")
	}

	if len(payload.Events) == 0 {
		return c.SendStatus(200)
	}

	// event := new(AnalyticsEvent)
	// var batch []AnalyticsEvent

	// if err := c.BodyParser(&batch); err != nil {
	// 	return c.Status(fiber.StatusBadRequest).SendString("Invalid JSON")
	// }

	// if len(batch) == 0 {
	// 	return c.SendStatus(200)
	// }

	clientIP := c.IP()
	userAgent := c.Get("User-Agent")
	serverTime := time.Now().Unix()

	// var values []interface{}

	// data, err := json.Marshal(event)
	// if err != nil {
	// 	return c.Status(fiber.StatusServiceUnavailable).SendString("Internal Error")
	// }

	queueCount := 0

	for i := range payload.Events {
		// Use a pointer so we modify the actual struct in the slice
		e := &payload.Events[i]

		// Enrichment: Fill in missing data
		if e.Timestamp == 0 {
			e.Timestamp = serverTime
		}
		if e.UserAgent == "" {
			e.UserAgent = userAgent
		}
		// IP is internal (not in JSON), so we always overwrite/set it
		e.IPAddress = clientIP

		// Marshal the single event to JSON string
		data, err := json.Marshal(e)
		if err != nil {
			log.Printf("Marshal error for event %d: %v", i, err)
			continue // Skip bad events, don't fail the whole batch
		}

		// 4. Send to Dynamic Batcher Channel (Non-blocking)
		select {
		case queue.EventChan <- data:
			queueCount++
			// Success
		default:
			// Channel full - dropping is better than crashing the API for ancalytics
			log.Println("Buffer full, dropping event")
		}
	}

	return c.Status(fiber.StatusAccepted).JSON(fiber.Map{
		"status": "queued",
		"count":  queueCount,
	})

}
