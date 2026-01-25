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
	var totalViews, totalVisitors, totalTimeSpent int64

	// all time stats of the author
	err := s.db.QueryRow(ctx, `
		SELECT 
			COALESCE(SUM(views), 0), 
			COALESCE(SUM(visitors), 0),
			COALESCE(SUM(time_spent_sec), 0)
		FROM monthly_stats
		WHERE author_id = $1
	`, req.AuthorId).Scan(&totalViews, &totalVisitors, &totalTimeSpent)

	if err != nil {
		return nil, err
	}

	// top 5 post
	rows, err := s.db.Query(ctx, `
		SELECT post_id, SUM(views) as v
		FROM monthly_stats
		WHERE author_id = $1
		GROUP BY post_id
		ORDER BY v DESC
		LIMIT 5
	`, req.AuthorId)

	var topPosts []*pb.TopPost
	if err != nil {
		return nil, err
	}
	defer rows.Close()
	for rows.Next() {
		p := &pb.TopPost{}
		if err := rows.Scan(&p.PostId, &p.Views); err != nil {
			return nil, err
		}
		topPosts = append(topPosts, p)
	}

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
