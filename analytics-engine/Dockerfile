# Stage 1: Build
FROM golang:1.24-alpine AS builder
WORKDIR /app

# 1. CRITICAL: Force AMD64 Linux build
# This ensures the binary runs on the standard Linux container, regardless of your Windows host
ENV CGO_ENABLED=0 
ENV GOOS=linux
ENV GOARCH=amd64

COPY go.mod go.sum ./
RUN go mod download
COPY . .

# Build API
RUN go build -ldflags="-s -w" -o /bin/api ./cmd/api
# Build Worker
RUN go build -ldflags="-s -w" -o /bin/worker ./cmd/worker
# Build Cron
RUN go build -ldflags="-s -w" -o /bin/cron ./cmd/cron

# 2. Build Server
# (Removed unnecessary flags like -installsuffix cgo, CGO_ENABLED=0 handles this)
RUN go build -ldflags="-s -w" -o /bin/server ./cmd/server

# 3. CRITICAL: Force permissions
RUN chmod +x /bin/server /bin/api /bin/worker /bin/cron

# Stage 2: Final API Image
FROM alpine:latest AS api
WORKDIR /root/
RUN apk --no-cache add ca-certificates
COPY --from=builder /bin/api .
CMD ["./api"]

# Stage 3: Final Worker Image
FROM alpine:latest AS worker
WORKDIR /root/
RUN apk --no-cache add ca-certificates
COPY --from=builder /bin/worker .
CMD ["./worker"]

# Stage 4: Final CRON Image
FROM alpine:latest AS cron
WORKDIR /root/
RUN apk --no-cache add ca-certificates
COPY --from=builder /bin/cron .
CMD ["./cron"]

# Stage 5: Final gRPC Server Image
# CHANGED: Reverted to alpine:latest for consistency and size.
# If Stage 1 builds a static binary (CGO=0), you do NOT need the heavy 'golang' image here.
FROM alpine:latest AS server
WORKDIR /root/
RUN apk --no-cache add ca-certificates

# Copy the binary
COPY --from=builder /bin/server .

# Double check permissions (Safety)
RUN chmod +x ./server

EXPOSE 50051
CMD ["./server"]