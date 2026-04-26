# PaperTrails — Blogging Platform

A full-stack blogging platform with a rich text editor, author dashboard, comments, and cloud media management.

## Screenshots

*Include your application screenshots here to demonstrate the UI/UX.*

| Feature | Preview |
|---------|---------|
| Dashboard | ![Dashboard](https://via.placeholder.com/800x450?text=Dashboard+Screenshot) |
| Editor | ![Editor](https://via.placeholder.com/800x450?text=Editor+Screenshot) |
| Blog Page | ![Blog](https://via.placeholder.com/800x450?text=Blog+Screenshot) |

---

## Architecture

The system is composed of two main services:

1. **Frontend**: A React 19 SPA built with Vite and Tailwind CSS 4.
2. **Backend API**: A Node.js/Express REST API handling content, auth, media, and comments.

> **Note**: A dedicated analytics engine is being developed in a separate repository and will be integrated in a future version via its REST API endpoints.

```
┌─────────────────────────────────────────────────────────┐
│                     Frontend (React)                    │
│     Vite · Tailwind CSS 4 · TipTap · Zustand · Axios   │
└──────────────────────┬──────────────────────────────────┘
                       │ REST
┌──────────────────────▼──────────────────────────────────┐
│                  Backend (Node.js / Express)             │
│   Better Auth · Mongoose · node-cron · express-rate-limit│
├────────────────┬───────────────────┬────────────────────┤
│   MongoDB      │  Cloudflare R2    │  (Analytics Engine │
│  (Content &    │  (Media storage   │   — coming soon)   │
│   Users)       │   via AWS S3 SDK) │                    │
└────────────────┴───────────────────┴────────────────────┘
```

---

## Tech Stack

### Frontend
| Category | Technology |
|----------|-----------|
| Framework | React 19 + Vite |
| Styling | Tailwind CSS 4, Framer Motion |
| State Management | Zustand |
| Rich Text Editor | TipTap 3 (headings, lists, code blocks, images, links, highlights) |
| Forms & Validation | React Hook Form + Zod |
| HTTP Client | Axios |
| Auth (client) | Better Auth client + `@react-oauth/google` |
| Charts | Recharts |
| Notifications | React Hot Toast |
| UI Primitives | Radix UI |

### Backend
| Category | Technology |
|----------|-----------|
| Runtime | Node.js + Express 5 |
| Language | TypeScript |
| Database | MongoDB via Mongoose |
| Authentication | Better Auth (email/password + Google OAuth) |
| Media Storage | Cloudflare R2 (AWS S3 SDK compatible) |
| Rate Limiting | `express-rate-limit` |
| Scheduled Jobs | `node-cron` (nightly orphaned media cleanup) |
| Email | Resend |

---

## Core Features

- **Rich Text Editor**: TipTap-powered block editor with headings, lists, code blocks, blockquotes, horizontal rules, links, text alignment, colour highlights, and cloud image uploads.
- **Authentication**: Email/password and Google OAuth via Better Auth. Sessions are managed with cookies.
- **Blog Management**: Create, read, update, and delete posts with draft/publish status, tags, cover images, and URL slugs.
- **Threaded Comments**: Nested comment system with ancestor-chain tracking for O(1) cascade deletes.
- **Author Inbox**: Authors receive a paginated inbox of top-level comments made on their posts.
- **Author Dashboard**: Aggregate statistics across all posts (views, likes, counts by status).
- **Cloud Media**: Presigned upload URLs for direct-to-R2 uploads; images are tracked as `pending` or `active` in MongoDB. A nightly cron job hard-deletes orphaned assets (pending for > 24 h) from both R2 and MongoDB.
- **Rate Limiting**: View and like endpoints are IP-rate-limited per-post (1 view/hour, 1 like/day) to prevent spam.
- **Search**: Full-text search over post titles and HTML content with ReDoS-safe regex escaping.

---

## Project Structure

```
.
├── backend/            # Node.js REST API
│   └── src/
│       ├── controllers/    # Route handlers
│       ├── models/         # Mongoose schemas (BlogPost, Comment, User, MediaAsset)
│       ├── routes/         # Express routers
│       ├── middleware/      # Auth guard (authMiddleware)
│       ├── lib/            # Better Auth setup
│       ├── utils/          # Slug generator, image extractor, R2 client
│       └── cron/           # Scheduled cleanup job
├── frontend/           # React SPA
│   └── src/
│       ├── pages/
│       │   ├── Admin/      # Dashboard, Editor, BlogPosts, Comments, Profile
│       │   └── Blog/       # Public blog listing & post view
│       ├── components/     # UI & TipTap editor components
│       ├── store/          # Zustand stores (auth, user, temp content)
│       ├── hooks/          # Custom React hooks
│       └── utils/          # API path constants, helpers
├── proto/              # Shared Protocol Buffers (reserved for analytics integration)
└── docker-compose.yml  # Runs backend + MongoDB
```

---

## API Endpoints

### Posts — `/api/post`
| Method | Path | Auth | Description |
|--------|------|------|-------------|
| `GET` | `/` | Public | List posts (supports `?status=published\|draft\|all&page=&limit=`) |
| `GET` | `/slugs/:slug` | Public | Get a single post by slug |
| `GET` | `/tag/:tag` | Public | Get posts by tag |
| `GET` | `/search?q=` | Public | Search posts (title + content) |
| `GET` | `/latest` | Public | Get the 8 most recent published posts |
| `GET` | `/byuser` | 🔒 | Get posts by the authenticated user |
| `POST` | `/` | 🔒 | Create a new post |
| `PUT` | `/:id` | 🔒 | Update a post (whitelisted fields only) |
| `DELETE` | `/:id` | 🔒 | Delete a post (cascades to comments) |
| `POST` | `/:id/view` | Public (rate-limited) | Increment view count (1/hr per IP) |
| `POST` | `/:id/like` | Public (rate-limited) | Increment like count (1/day per IP) |

### Comments — `/api/comments`
| Method | Path | Auth | Description |
|--------|------|------|-------------|
| `GET` | `/:postId` | Public | Get threaded comments for a post |
| `POST` | `/:postId` | 🔒 | Add a comment or reply to a post |
| `DELETE` | `/:commentId` | 🔒 | Delete a comment and all its descendants |
| `GET` | `/` | 🔒 | Get paginated author inbox (top-level comments on own posts) |

### Dashboard — `/api/dashboard-summary`
| Method | Path | Auth | Description |
|--------|------|------|-------------|
| `GET` | `/` | 🔒 | Aggregate stats (post counts, recent posts) |

### Auth — `/api/auth/*`
Handled entirely by **Better Auth** — provides email/password and Google OAuth flows, session management, and token refresh.

### Media — `/api`
| Method | Path | Auth | Description |
|--------|------|------|-------------|
| `POST` | `/upload` | 🔒 | Get a presigned R2 upload URL |

---

## Prerequisites

- **Node.js**: v20+
- **pnpm**: v10+
- **Docker & Docker Compose** (optional, for running MongoDB locally)
- A **MongoDB** instance (Atlas or local)
- A **Cloudflare R2** bucket (for media uploads)

---

## Getting Started

### 1. Backend

```bash
cd backend
pnpm install
```

Create a `.env` file (see [Environment Configuration](#environment-configuration) below), then:

```bash
pnpm run dev
```

**API Server**: `http://localhost:8000`

### 2. Frontend

```bash
cd frontend
pnpm install
pnpm run dev
```

**App**: `http://localhost:5173`

### 3. Docker (optional — MongoDB only)

```bash
docker-compose up -d
```

This starts a MongoDB instance on the default port. Update `MONGO_URL` in `backend/.env` accordingly.

---

## Environment Configuration

### Backend (`backend/.env`)

```env
# Server
PORT=8000
NODE_ENV=development

# MongoDB
MONGO_URL=mongodb+srv://<user>:<pass>@<cluster>.mongodb.net/?retryWrites=true&w=majority

# Better Auth
BETTER_AUTH_SECRET=<random-hex-secret>
BETTER_AUTH_URL=http://localhost:8000

# Google OAuth (via Better Auth)
OAUTH_CLIENT_ID=<google-client-id>
OAUTH_CLIENT_SECRET=<google-client-secret>

# Cloudflare R2
R2_BUCKET_NAME=<bucket-name>
R2_ACCOUNT_ID=<account-id>
R2_ACCESS_KEY_ID=<access-key>
R2_SECRET_ACCESS_KEY=<secret-key>
R2_DEVURL=https://<public-r2-url>

# Frontend (CORS)
FRONTEND_URL=http://localhost:5173

# Email (Resend)
RESEND_API_KEY=<resend-api-key>
```

---

## Security

- **Mass assignment protection**: `updatePost` only accepts a strict whitelist of fields (`title`, `content`, `coverImageUrl`, `tags`, `isDraft`).
- **Rate limiting**: View and like routes are gated with per-IP, per-post rate limiters.
- **ReDoS prevention**: Search input is escaped before being used in a MongoDB regex query.
- **Error hygiene**: Internal errors are logged server-side only; the client never receives raw error objects or stack traces.
- **Cascade deletes**: Deleting a post removes all of its comments. Deleting a comment removes all of its descendants (using the `ancestors` array index).