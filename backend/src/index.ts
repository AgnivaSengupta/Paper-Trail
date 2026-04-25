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

// global middleware

app.use(
    cors({
        origin: process.env.FRONTEND_URL || "http://localhost:5173",
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
