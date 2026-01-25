package queue

import (
	"context"
	"log"
	"time"
)

const (
	BatchSize    = 500
	PushInterval = 100 * time.Millisecond
	BufferLimit  = 10000
)

var EventChan chan []byte

func StartBatcher(ctx context.Context) {
	EventChan = make(chan []byte, BufferLimit)

	go func() {
		log.Println("Batcher started..")

		var batch []interface{}
		ticker := time.NewTicker(PushInterval)
		defer ticker.Stop()

		for {
			select {
			case event := <-EventChan:
				batch = append(batch, event)

				if len(batch) >= BatchSize {
					flushToRedis(batch)
					batch = nil
				}

			case <-ticker.C:
				// 3. If time is up, push whatever we have
				if len(batch) > 0 {
					flushToRedis(batch)
					batch = nil // Clear batch
				}

			case <-ctx.Done():
				// Graceful shutdown: Flush remaining items
				if len(batch) > 0 {
					flushToRedis(batch)
				}
				return
			}
		}
	}()
}

func flushToRedis(batch []interface{}) {
	ctx, cancel := context.WithTimeout(context.Background(), 5*time.Second)
	defer cancel()

	// Variadic Push: O(1) Network Call for N items
	err := Client.RPush(ctx, "analytics_queue", batch...).Err()
	if err != nil {
		log.Printf("❌ Failed to flush batch to Redis: %v", err)
		// In production, you might retry or log to a backup file
	}
}
