package main

import (
	"context"
	"log"
	"os"
	"os/signal"
	"syscall"
	"time"

	"github.com/jackc/pgx/v5/pgxpool"
	"github.com/robfig/cron/v3"
)

func main() {
	dbUrl := os.Getenv("DB_DSN")
	dbPool, err := pgxpool.New(context.Background(), dbUrl)
	if err != nil {
		log.Fatal(err)
	}
	defer dbPool.Close()

	initSchema(dbPool)

	// cron job
	c := cron.New()

	// c.AddFunc("*/ * * * *", func() {
	// 	log.Println("Running Aggregation Job...")
	// 	runAggregation(dbPool)
	// })

	// --- A. AGGREGATION JOBS (The "Rollup") ---

	// 1. Hourly: Every minute
	// Reads RAW -> Writes HOURLY
	c.AddFunc("*/1 * * * *", func() {
		log.Println("🔄 Aggregating Hourly...")
		updateHourly(dbPool)
	})

	// 2. Daily/Monthly: Every 30 min (at minute 5 and 35)
	// Reads Hourly -> Writes DAILY (Rollup)
	c.AddFunc("5,35 * * * *", func() {
		log.Println("📅 Aggregating...")
		updateDaily(dbPool)
		// updateMonthly(dbPool)
	})
	

	// 3. Monthly & Yearly: Once an hour (at minute 0)
	// Reads DAILY -> Writes MONTHLY
	c.AddFunc("0 * * * *", func() {
		log.Println("🗓️ Aggregating Monthly and Yearly...")
		updateMonthly(dbPool)
		updateYearly(dbPool)
	})

	// YEARLY: Once a day(at 1:00 am)
	c.AddFunc("0 1 * * *", func() {
        log.Println("🗓️ Aggregating Yearly...")
        updateYearly(dbPool)
    })
	
	// c.Start()
	// log.Println("Cron service started....")
	// select {}

	// --- B. CLEANUP JOB  ---

	// Runs every hour.
	// Deletes raw events older than 24 hours.
	c.AddFunc("45 * * * *", func() {
		log.Println("🧹 Cleaning Raw DB (Retention Policy)...")
		cleanupRawData(dbPool)
	})

	c.Start()
	log.Println("⏰ Cron Service with Retention Policy Started")

	// Block forever
	sig := make(chan os.Signal, 1)
	signal.Notify(sig, syscall.SIGINT, syscall.SIGTERM)
	<-sig
}

func runAggregation(db *pgxpool.Pool) {

}

func initSchema(db *pgxpool.Pool) {
	queries := []string{
		
		`CREATE INDEX IF NOT EXISTS idx_analytics_events_time ON analytics_events (event_time);`,
		
		// 1. Hourly Stats Table
		`CREATE TABLE IF NOT EXISTS hourly_stats (
				time_bucket TIMESTAMPTZ NOT NULL,
				post_id     TEXT NOT NULL,
				author_id   TEXT NOT NULL,
				views       BIGINT DEFAULT 0,
				visitors    BIGINT DEFAULT 0,
				time_spent_sec BIGINT DEFAULT 0,
				PRIMARY KEY (post_id, time_bucket)
			);`,
		// Index for "Last 24 Hours" dashboard charts
		`CREATE INDEX IF NOT EXISTS idx_hourly_time ON hourly_stats (post_id, time_bucket DESC);`,

		// 2. Daily Stats Table
		`CREATE TABLE IF NOT EXISTS daily_stats (
				day         DATE NOT NULL,
				post_id     TEXT NOT NULL,
				author_id   TEXT NOT NULL,
				views       BIGINT DEFAULT 0,
				visitors    BIGINT DEFAULT 0,
				time_spent_sec BIGINT DEFAULT 0,
				PRIMARY KEY (post_id, day)
			);`,
		// Index for "Last 30 Days" dashboard charts
		`CREATE INDEX IF NOT EXISTS idx_daily_time ON daily_stats (post_id, day DESC);`,

		// 3. Monthly Stats Table
		`CREATE TABLE IF NOT EXISTS monthly_stats (
				month       DATE NOT NULL,
				post_id     TEXT NOT NULL,
				author_id   TEXT NOT NULL,
				views       BIGINT DEFAULT 0,
				visitors    BIGINT DEFAULT 0,
				time_spent_sec BIGINT DEFAULT 0,
				PRIMARY KEY (post_id, month)
			);`,
		// Index for "All Time" charts
		`CREATE INDEX IF NOT EXISTS idx_monthly_time ON monthly_stats (post_id, month DESC);`,

		// 4. Yearly Stats Table
		`CREATE TABLE IF NOT EXISTS yearly_stats (
				year        DATE NOT NULL,
				post_id     TEXT NOT NULL,
				author_id   TEXT NOT NULL,
				views       BIGINT DEFAULT 0,
				visitors    BIGINT DEFAULT 0,
				time_spent_sec BIGINT DEFAULT 0,
				PRIMARY KEY (post_id, year)
			);`,
		`CREATE INDEX IF NOT EXISTS idx_yearly_time ON yearly_stats (post_id, year DESC);`,
	}

	ctx := context.Background()
	for _, q := range queries {
		timeoutCtx, cancel := context.WithTimeout(ctx, 5*time.Second)
		_, err := db.Exec(timeoutCtx, q)
		cancel()

		if err != nil {
			log.Printf("Schema Init Warning: %v", err)
		}
	}

	log.Println("✅ Aggregation Schema initialized")
}

// --- LOGIC FUNCTIONS ---

// 1. Hourly Aggregation
func updateHourly(db *pgxpool.Pool) {
	// Source: Raw Events
	// We scan only the current hour's data from the raw table
	sql := `
		INSERT INTO hourly_stats (time_bucket, post_id, author_id, views, visitors, time_spent_sec)
		SELECT
			DATE_TRUNC('hour', event_time) as bucket,
			post_id,
			author_id,
			COUNT(*) FILTER (WHERE event_type = 'page_view') as views,
			COUNT(DISTINCT user_id) as visitors,
			COALESCE(SUM(time_spent_sec), 0) as time_spent_sec
		FROM analytics_events
		WHERE event_time >= DATE_TRUNC('hour', NOW() - INTERVAL '2 hour')
		GROUP BY 1, 2, 3
		ON CONFLICT (post_id, time_bucket)
		DO UPDATE SET 
			views = EXCLUDED.views,
			visitors = EXCLUDED.visitors, 
			time_spent_sec = EXCLUDED.time_spent_sec;
	`
	exec(db, sql)
}

// 2. Daily Aggregation
func updateDaily(db *pgxpool.Pool) {
	// Source: Hourly Stats (Fast!)
	// We sum up the 24 hourly buckets to get the day total
	sql := `
		INSERT INTO daily_stats (day, post_id, author_id, views, visitors, time_spent_sec)
		SELECT
            DATE_TRUNC('day', time_bucket)::DATE as day,
            post_id,
			author_id,
			SUM(views) as views,
			SUM(visitors) as visitors,
			SUM(time_spent_sec) as time_spent_sec
        FROM hourly_stats
        WHERE time_bucket >= DATE_TRUNC('day', NOW() - INTERVAL '1 day')
        GROUP BY 1, 2, 3
        ON CONFLICT (post_id, day)
        DO UPDATE SET 
            views = EXCLUDED.views, 
            visitors = EXCLUDED.visitors,
            time_spent_sec = EXCLUDED.time_spent_sec;
	`
	exec(db, sql)
}

// 3. Monthly Aggregation
func updateMonthly(db *pgxpool.Pool) {
	// Source: Daily Stats
	sql := `
		INSERT INTO monthly_stats (month, post_id, author_id, views, visitors, time_spent_sec)
		SELECT
			DATE_TRUNC('month', day)::DATE as month,
			post_id,
			author_id,
			SUM(views) as views,
			SUM(visitors) as visitors,
			SUM(time_spent_sec) as time_spent_sec
		FROM daily_stats
		WHERE day >= DATE_TRUNC('month', NOW() - INTERVAL '1 month')
		GROUP BY 1, 2, 3
		ON CONFLICT (post_id, month)
		DO UPDATE SET 
			views = EXCLUDED.views, 
			visitors = EXCLUDED.visitors,
			time_spent_sec = EXCLUDED.time_spent_sec;
	`
	exec(db, sql)
}

// 4. Yearly Aggregation (Matches your diagram)
func updateYearly(db *pgxpool.Pool) {
	// Source: Monthly Stats
	sql := `
		INSERT INTO yearly_stats (year, post_id, author_id, views, visitors, time_spent_sec)
		SELECT
			DATE_TRUNC('year', month)::DATE as year,
			post_id,
			author_id,
			SUM(views) as views,
			SUM(visitors) as visitors,
			SUM(time_spent_sec) as time_spent_sec
		FROM monthly_stats
		WHERE month >= DATE_TRUNC('year', NOW() - INTERVAL '1 year')
		GROUP BY 1, 2, 3
		ON CONFLICT (post_id, year)
		DO UPDATE SET views = EXCLUDED.views, visitors = EXCLUDED.visitors, time_spent_sec = EXCLUDED.time_spent_sec;
	`
	exec(db, sql)
}

// 5. THE CLEANER (Retention Policy)
func cleanupRawData(db *pgxpool.Pool) {
	// Deletes any raw event older than 24 hours.
	// This keeps your Raw DB table small and fast.
	sql := `
		DELETE FROM analytics_events
		WHERE event_time < NOW() - INTERVAL '24 hours';
	`
	exec(db, sql)
}

func exec(db *pgxpool.Pool, sql string) {
	ctx, cancel := context.WithTimeout(context.Background(), 2*time.Minute)
	defer cancel()
	_, err := db.Exec(ctx, sql)
	if err != nil {
		log.Printf("❌ Error: %v", err)
	}
}
