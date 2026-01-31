import dotenv from "dotenv";
dotenv.config();

import cors from "cors";
import express from 'express'
import path from 'path'
import connectDb from "./config/db";
import authRouter from "./routes/authRoute";
import blogPostRouter from "./routes/blogPostRoute";
import commentsRouter from "./routes/commentsRoute";
import dashboardRouter from "./routes/dashboardRoute";
import cookieParser from "cookie-parser"
import uploadRouter from "./routes/uploadRoute";

const app = express();

// global middleware

app.use(
    cors({
        origin: "http://localhost:5173",
        methods: ['GET', 'POST', 'PUT', 'DELETE'],
        allowedHeaders: ['Content-Type', 'Authorization'],
        credentials: true,
    })
)
app.use(cookieParser())

// connecting to DB
connectDb();

// Middleware
app.use(express.json()) // --> automatically parses every incoming json payload -> avoids manual parsing
app.use((req, res, next) => {
    // Allows the "Opener" (Frontend) to talk to the "Popup" (Backend callback)
    res.setHeader("Cross-Origin-Opener-Policy", "same-origin-allow-popups");
    // Optional: Sometimes required for strict COOP modes
    res.setHeader("Cross-Origin-Embedder-Policy", "require-corp"); 
    next();
});

// Different api routes ------------------------------------------------------------------------------|
    app.use("/api/auth", authRouter);

    app.use("/api/post", blogPostRouter);
    
    app.use("/api/comments", commentsRouter);
    
    app.use("/api/dashboard-summary", dashboardRouter);

app.use("/api", uploadRouter);

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
app.listen(PORT, ()=> console.log("Server running on Port: ", PORT));