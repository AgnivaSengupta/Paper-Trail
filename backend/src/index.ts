import dotenv from "dotenv";
dotenv.config();

import cors from "cors";
import express from 'express'
// import path from 'path'
import connectDb from "./config/db";
// import authRouter from "./routes/authRoute";
import blogPostRouter from "./routes/blogPostRoute";
import commentsRouter from "./routes/commentsRoute";
import dashboardRouter from "./routes/dashboardRoute";
import cookieParser from "cookie-parser"
import uploadRouter from "./routes/uploadRoute";
import { toNodeHandler } from "better-auth/node";
import { auth } from "./lib/auth";
import authRouter from "./routes/authRoute";

const app = express();

app.set("trust proxy", 1);

const normalizeOrigin = (value?: string | null) => {
    if (!value) return null;

    try {
        return new URL(value).origin;
    } catch {
        return null;
    }
}

const configuredFrontendOrigin = normalizeOrigin(process.env.FRONTEND_URL);
const configuredFrontendHost = configuredFrontendOrigin ? new URL(configuredFrontendOrigin).hostname : null;
const vercelProjectPrefix = configuredFrontendHost?.endsWith(".vercel.app")
    ? configuredFrontendHost.replace(".vercel.app", "")
    : null;

const allowedOrigins = new Set(
    [
        "http://localhost:5173",
        configuredFrontendOrigin,
        "https://papertrails.agniva.dev",
        ...(
            process.env.CORS_ALLOWED_ORIGINS
                ?.split(",")
                .map((origin) => normalizeOrigin(origin))
                .filter((origin): origin is string => Boolean(origin)) ?? []
        ),
    ].filter((origin): origin is string => Boolean(origin))
);

const isAllowedOrigin = (origin?: string | null) => {
    if (!origin) return true;
    if (allowedOrigins.has(origin)) return true;

    if (vercelProjectPrefix) {
        const previewPattern = new RegExp(
            `^https://${vercelProjectPrefix}(?:-[a-z0-9-]+)?\\.vercel\\.app$`,
            "i",
        );
        return previewPattern.test(origin);
    }

    return false;
};

// global middleware
const corsOriginDelegate = (
    origin: string | undefined,
    callback: (err: Error | null, allow?: boolean) => void,
) => {
    if (isAllowedOrigin(origin)) {
        callback(null, true);
        return;
    }

    callback(new Error(`CORS blocked for origin: ${origin}`), false);
};

app.use(
    cors({
        origin: corsOriginDelegate,
        methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
        allowedHeaders: ['Content-Type', 'Authorization', 'Accept'],
        credentials: true,
        preflightContinue: false,
        optionsSuccessStatus: 204,
    })
)

app.all("/api/auth/*splat", toNodeHandler(auth));


// Body parsers — must be registered BEFORE cookieParser and routes
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(cookieParser())

import { cleanupMediaJob } from "./cron/cleanupMedia";

// Start cron jobs
cleanupMediaJob.start();

// Connect to DB
connectDb();

// Different api routes ------------------------------------------------------------------------------|
// app.use("/api/auth", authRouter);

app.use("/api/post", blogPostRouter);

app.use("/api/comments", commentsRouter);

app.use("/api/dashboard-summary", dashboardRouter);

app.use("/api", uploadRouter);

app.use("/api/user", authRouter);

// Health check endpoint
app.get('/api/health', (req, res) => {
    res.status(200).json({
        status: 'healthy',
        timestamp: new Date().toISOString(),
        uptime: process.uptime(),
        port: process.env.PORT || 8000
    });
});

const PORT = process.env.PORT || 8000
app.listen(PORT, () => console.log("Server running on Port: ", PORT));
