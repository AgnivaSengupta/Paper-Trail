# Modern Blogging Platform with Real-time Analytics

A full-stack, microservices-based blogging platform featuring a rich text editor, comprehensive dashboard, and a dedicated high-performance analytics engine.

## Screenshots

*Include your application screenshots here to demonstrate the UI/UX.*

| Feature | Preview |
|---------|---------|
| Dashboard | ![Dashboard](https://via.placeholder.com/800x450?text=Dashboard+Screenshot) |
| Editor | ![Editor](https://via.placeholder.com/800x450?text=Editor+Screenshot) |
| Analytics | ![Analytics](https://via.placeholder.com/800x450?text=Analytics+Screenshot) |

## Architecture

The system consists of three main components:

1.  **Frontend**: A responsive React application built with Vite, TailwindCSS, and Framer Motion.
2.  **Backend API**: A Node.js/Express service handling blog content, and file management.
3.  **Analytics Engine**: A set of Go microservices that ingest, process, and serve traffic data via gRPC.

```mermaid
graph TD
    Client[Frontend Client] -->|REST| Backend[Node.js Backend]
    Client -->|Ingest API| AnalyticsAPI[Analytics Ingestion API]
    
    subgraph "Backend Services"
        Backend -->|Mongoose| Mongo[(MongoDB)]
        Backend -->|gRPC| AnalyticsServer[Analytics Read Server]
        Backend -->|AWS SDK| R2[(Cloud Storage)]
    end

    subgraph "Analytics Engine (Go)"
        AnalyticsAPI -->|Write| Redis[(Redis Queue)]
        Redis -->|Read| Worker[Go Worker]
        Worker -->|Batch Insert| Postgres[(PostgreSQL)]
        Cron[Cron Service] -->|Aggregate| Postgres
        AnalyticsServer -->|Read| Postgres
    end
```

### System Flow
*   **Frontend Client**: Communicates via REST for content and uses a specialized Ingest API for tracking.
*   **Backend Services**: Integrates MongoDB for persistence, gRPC for analytics retrieval, and Cloudflare R2 for media storage.
*   **Analytics Engine**: Utilizes a Redis-backed queue for high-throughput ingestion, processed by Go workers into a PostgreSQL database.

## Tech Stack

### Frontend
*   **Framework**: React 19 + Vite
*   **Styling**: Tailwind CSS 4, Framer Motion
*   **State Management**: Zustand
*   **Editor**: TipTap (Rich text editing)
*   **Visuals**: Recharts (Analytics charts), Lucide React (Icons)

### Backend
*   **Runtime**: Node.js + Express
*   **Database**: MongoDB (Mongoose)
*   **Authentication**: Google OAuth 2.0, JWT
*   **Communication**: gRPC (Client), REST
*   **Services**: AWS SDK (S3/R2 compatible)

### Analytics Engine
*   **Language**: Go (Golang)
*   **Database**: PostgreSQL
*   **Queue**: Redis
*   **Protocol**: gRPC (Server), HTTP (Ingestion)
*   **Infrastructure**: Docker Compose

## Prerequisites

*   **Node.js**: v20+
*   **Go**: v1.22+
*   **Docker & Docker Compose**
*   **pnpm** (preferred package manager)

## Getting Started

### 1. Analytics Engine (Infrastructure)

The analytics engine manages the PostgreSQL and Redis instances required for the entire system.

```bash
cd analytics-engine
docker-compose up -d --build
```
*   **Ingestion API**: `http://localhost:8080`
*   **gRPC Server**: `localhost:50051`

### 2. Backend Service

```bash
cd backend
pnpm install
pnpm run proto:gen
pnpm run dev
```
*   **API Server**: `http://localhost:3000`

### 3. Frontend Client

```bash
cd frontend
pnpm install
pnpm run dev
```
*   **App**: `http://localhost:5173`

## Environment Configuration

### Backend (`backend/.env`)
```env
PORT=3000
MONGO_URI=mongodb+srv://...
JWT_SECRET=your_secret
GOOGLE_CLIENT_ID=...
GOOGLE_CLIENT_SECRET=...
R2_ACCESS_KEY_ID=...
R2_SECRET_ACCESS_KEY=...
ANALYTICS_GRPC_TARGET=localhost:50051
```

### Analytics (`analytics-engine/.env`)
```env
DB_DSN=postgresql://user:pass@host:5432/dbname
REDIS_DSN=redis://localhost:6379
```

## Core Features

*   **Rich Content Editor**: Block-based editing with formatting, code blocks, and image uploads.
*   **Traffic Analytics**: Tracking of views, unique visitors, and read time.
*   **Google Authentication**: Secure login integration via Google OAuth.
*   **Author Dashboard**: Detailed performance metrics for published content.
*   **Cloud Media Storage**: Images stored and served via S3-compatible R2 storage.

## Project Structure

```
.
├── analytics-engine/   # Go microservices for traffic tracking
├── backend/            # Node.js REST API & gRPC client
├── frontend/           # React SPA 
└── proto/              # Shared Protocol Buffers definitions
```