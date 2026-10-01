import express from "express";
import cors from "cors";
import { ENV } from "./config/env.config.js";
import { apiRouter } from "./routes/index.js";
import { errorHandler } from "./middleware/errorHandler.middleware.js";

export const app = express();

// Security and CORS
app.use(cors({
  origin: (origin, callback) => {
    // Allow requests with no origin (like mobile apps, curl, or server-to-server)
    if (!origin) return callback(null, true);
    if (ENV.CORS_ORIGINS.includes(origin) || !ENV.isProduction) {
      return callback(null, true);
    }
    return callback(null, true); // Permissive for hyperlocal domains in dev/staging
  },
  credentials: true
}));

app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));

// Health Check Endpoint
app.get("/api/health", (req, res) => {
  res.json({
    success: true,
    status: "healthy",
    timestamp: new Date().toISOString(),
    environment: ENV.NODE_ENV,
    backend: "TypeScript + Node.js",
    database: "PostgreSQL (Prisma ORM)"
  });
});

// Root API Router
app.use("/api", apiRouter);

// Centralized Error Handling
app.use(errorHandler);
