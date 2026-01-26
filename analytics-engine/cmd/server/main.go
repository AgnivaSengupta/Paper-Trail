package main

import (
	"context"
	"fmt"
	"log"
	"net"
	"os"

	"github.com/AgnivaSengupta/analytics-engine/pb"
	"github.com/jackc/pgx/v5/pgxpool"
	"google.golang.org/grpc"
)

type server struct {
	pb.UnimplementedAnalyticsServiceServer
	db *pgxpool.Pool
}

// ---------------------------------------------------------------------------------------------------------------
// POST DASHBOARD
// ---------------------------------------------------------------------------------------------------------------
func (s *server) GetPostStats(ctx context.Context, req *pb.PostStatsRequest) (*pb.PostStatsResponse, error) {
	var totalViews, totalVisitors int64
	var totalTimeSpent int64
	var chartData []*pb.TimeSeriesPoint

	switch req.TimeRange {
	case "24h":
		// Query from raw table
		err := s.db.QueryRow(ctx, `
			SELECT
				COUNT(*) as views,
				COUNT(DISTINCT user_id) as visitors,
				COALESCE(SUM(time_spent_sec), 0) as time_spent
			FROM analytics_events
			WHERE post_id = $1 AND event_type = 'page_view'
		`, req.PostId).Scan(&totalViews, &totalVisitors, &totalTimeSpent)
		if err != nil {
			return nil, err
		}

		// Fetching chart data
		rows, err := s.db.Query(ctx, `
			SELECT DATE_TRUNC('hour', event_time) as ts, COUNT(*)
			FROM analytics_events
			WHERE post_id = $1
			AND event_time > NOW() - INTERVAL '24 hours'
			GROUP BY 1 ORDER BY 1
		`, req.PostId)
		if err != nil {
			return nil, err
		}

		defer rows.Close()
		for rows.Next() {
			var p pb.TimeSeriesPoint
			rows.Scan(&p.Timestamp, &p.Views)
			chartData = append(chartData, &p)
		}

	case "7d", "30d":
		interval := "7 days"
		if req.TimeRange == "30d" {
			interval = "30 days"
		}

		err := s.db.QueryRow(ctx, fmt.Sprintf(`
			SELECT COALESCE(SUM(views), 0),
				COALESCE(SUM(visitors), 0),
				COALESCE(SUM(time_spent_sec), 0)
			FROM daily_stats
			WHERE post_id = $1 AND day > NOW() - INTERVAL '%s'
		`, interval), req.PostId).Scan(&totalViews, &totalVisitors, &totalTimeSpent)
		if err != nil {
			return nil, err
		}

		rows, err := s.db.Query(ctx, fmt.Sprintf(`
			SELECT to_char(day, 'YYYY-MM-DD'), views
			FROM daily_stats
			WHERE post_id = $1 AND day > NOW() - INTERVAL '%s'
			ORDER BY day ASC
		`, interval), req.PostId)
		if err != nil {
			return nil, err
		}

		defer rows.Close()
		for rows.Next() {
			var p pb.TimeSeriesPoint
			rows.Scan(&p.Timestamp, &p.Views)
			chartData = append(chartData, &p)
		}
	}

	// Calculate Average Time
	avgTime := 0.0
	if totalVisitors > 0 {
		avgTime = float64(totalTimeSpent) / float64(totalVisitors)
	}

	return &pb.PostStatsResponse{
		Views:          totalViews,
		UniqueVisitors: totalVisitors,
		AvgReadTimeSec: avgTime,
		ChartData:      chartData,
	}, nil
}

// -----------------------------------------------------------------------------------------------------------
// AUTHOR DASHBOARD
// -----------------------------------------------------------------------------------------------------------

func (s *server) GetAuthorStats(ctx context.Context, req *pb.AuthorStatsRequest) (*pb.AuthorStatsResponse, error) {
	//var totalViews, totalVisitors, totalTimeSpent int64
	var histViews, liveViews int64
	var histVisitors, liveVisitors int64 // Note: Summing visitors is approximate
	var histTime, liveTime int64
	var topPosts []*pb.TopPost

	fmt.Println(req)
	fmt.Printf("➡️ Received Author Stats Req: AuthorID=%s Range=%s\n", req.AuthorId, req.TimeRange)
	// all time stats of the author
	// err := s.db.QueryRow(ctx, `
	// 	SELECT
	// 		COALESCE(SUM(views), 0),
	// 		COALESCE(SUM(visitors), 0),
	// 		COALESCE(SUM(time_spent_sec), 0)
	// 	FROM monthly_stats
	// 	WHERE author_id = $1
	// `, req.AuthorId).Scan(&totalViews, &totalVisitors, &totalTimeSpent)

	// if err != nil {
	// 	return nil, err
	// }


	// A. Fetch LIVE Delta (Since Midnight Today) - Super Fast with Index
	err := s.db.QueryRow(ctx, `
		SELECT
			COUNT(*),
			COUNT(DISTINCT user_id),
			COALESCE(SUM(time_spent_sec), 0)
		FROM analytics_events
		WHERE author_id = $1 AND event_time >= CURRENT_DATE
		AND event_type = 'page_view'
	`, req.AuthorId).Scan(&liveViews, &liveVisitors, &liveTime)
	if err != nil {
		return nil, fmt.Errorf("live delta failed: %w", err)
	}

	// B. Fetch HISTORY (Before Today)
	var intervalDate string

	switch req.TimeRange {
	case "24h":
		// Special case: 24h just looks at raw data entirely usually,
		// but to keep hybrid logic simple, we can just say history is 0
		// or query hourly_stats for yesterday.
		// For simplicity/accuracy on 24h, let's just do a direct RAW query for the last 24h
		// and overwrite the "Live Delta" variables.
		err := s.db.QueryRow(ctx, `
			SELECT
				COUNT(*),
				COUNT(DISTINCT user_id),
				COALESCE(SUM(time_spent_sec), 0)
			FROM analytics_events
			WHERE author_id = $1 AND event_time > NOW() - INTERVAL '24 hours'
			AND event_type = 'page_view'
		`, req.AuthorId).Scan(&liveViews, &liveVisitors, &liveTime)
		if err != nil { return nil, err }

		histViews, histVisitors, histTime = 0, 0, 0

	case "7d":
		intervalDate = "NOW() - INTERVAL '7 days'"
	case "30d":
		intervalDate = "NOW() - INTERVAL '30 days'"
	default:
		// All Time (default)
		intervalDate = "'1970-01-01'"
	}

	// If not 24h, fetch the history from Aggregated Tables
	if req.TimeRange != "24h" {
		err = s.db.QueryRow(ctx, fmt.Sprintf(`
			SELECT
				COALESCE(SUM(views), 0),
				COALESCE(SUM(visitors), 0),
				COALESCE(SUM(time_spent_sec), 0)
			FROM daily_stats
			WHERE author_id = $1
			AND day >= %s
			AND day < CURRENT_DATE -- Strict cutoff before today
		`, intervalDate), req.AuthorId).Scan(&histViews, &histVisitors, &histTime)
		if err != nil {
			return nil, fmt.Errorf("history fetch failed: %w", err)
		}
	}
	
	
	// 2. COMBINE STATS
	totalViews := histViews + liveViews
	totalVisitors := histVisitors + liveVisitors // Approx for unique visitors
	totalTimeSpent := histTime + liveTime

	// 3. FETCH TOP POSTS (Hybrid is hard here, so we usually just query Aggregated for speed)
	// Ideally, you query daily_stats for the range.
	// For "24h", we query raw.
	
	if req.TimeRange == "24h" {
		// Top posts from RAW
		rows, err := s.db.Query(ctx, `
			SELECT post_id, COUNT(*) as v
			FROM analytics_events
			WHERE author_id = $1 AND event_time > NOW() - INTERVAL '24 hours' AND event_type = 'page_view'
			GROUP BY post_id ORDER BY v DESC LIMIT 5
		`, req.AuthorId)
		if err != nil { return nil, err }
		defer rows.Close()
		for rows.Next() {
			p := &pb.TopPost{}
			rows.Scan(&p.PostId, &p.Views)
			topPosts = append(topPosts, p)
		}
	} else {
		// Top posts from AGGREGATED (History)
		// Note: This misses "Today's" views in the top post calculation, 
		// but that is usually an acceptable trade-off for dashboard speed.
		rows, err := s.db.Query(ctx, fmt.Sprintf(`
			SELECT post_id, SUM(views) as v
			FROM daily_stats
			WHERE author_id = $1 AND day >= %s
			GROUP BY post_id ORDER BY v DESC LIMIT 5
		`, intervalDate), req.AuthorId)
		if err != nil { return nil, err }
		defer rows.Close()
		for rows.Next() {
			p := &pb.TopPost{}
			rows.Scan(&p.PostId, &p.Views)
			topPosts = append(topPosts, p)
		}
	}
	
	// top 5 post
	// rows, err := s.db.Query(ctx, `
	// 	SELECT post_id, SUM(views) as v
	// 	FROM monthly_stats
	// 	WHERE author_id = $1
	// 	GROUP BY post_id
	// 	ORDER BY v DESC
	// 	LIMIT 5
	// `, req.AuthorId)

	// if err != nil {
	// 	return nil, err
	// }
	// defer rows.Close()
	// for rows.Next() {
	// 	p := &pb.TopPost{}
	// 	if err := rows.Scan(&p.PostId, &p.Views); err != nil {
	// 		return nil, err
	// 	}
	// 	topPosts = append(topPosts, p)
	// }

	avgTime := 0.0
	if totalVisitors > 0 {
		avgTime = float64(totalTimeSpent) / float64(totalVisitors)
	}

	return &pb.AuthorStatsResponse{
		TotalViews:         totalViews,
		TotalVisitors:      totalVisitors,
		OverallAvgReadTime: avgTime,
		TopPosts:           topPosts,
	}, nil
}

func main() {
	dbUrl := os.Getenv("DB_DSN")
	fmt.Printf("🔗 Using database URL: %s\n", dbUrl)
	if dbUrl == "" {
		dbUrl = "postgres://user:pass@localhost:5432/analytics"
		fmt.Printf("⚠️  Using fallback database URL: %s\n", dbUrl)
	}

	dbPool, err := pgxpool.New(context.Background(), dbUrl)
	if err != nil {
		log.Fatal(err)
	}
	defer dbPool.Close()

	lis, err := net.Listen("tcp", "0.0.0.0:50051")
	if err != nil {
		log.Fatalf("Failed to listen %v", err)
	}

	s := grpc.NewServer()
	pb.RegisterAnalyticsServiceServer(s, &server{db: dbPool})

	log.Printf("📊 Reader Dashboard Service listening on :50051")
	if err := s.Serve(lis); err != nil {
		log.Fatalf("failed to serve: %v", err)
	}

}
