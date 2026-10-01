import { app } from "./app.js";
import { ENV } from "./config/env.config.js";
import { getPrismaClient, getSqliteDb } from "./repositories/database.adapter.js";

async function bootstrap() {
  console.log("=================================================");
  console.log("🚀 EZY1 PRODUCTION TYPESCRIPT & NODE.JS BACKEND");
  console.log("=================================================");

  // Initialize DB connection
  try {
    const prisma = await getPrismaClient();
    if (prisma) {
      console.log("✅ Primary Database: PostgreSQL (Prisma ORM) ACTIVE");
    } else {
      await getSqliteDb();
      console.log("ℹ️  Primary Database: Embedded Transactional Engine ACTIVE (PostgreSQL ready)");
    }
  } catch (err: any) {
    console.error("⚠️  Database initialization warning:", err.message);
  }

  const server = app.listen(ENV.PORT, () => {
    console.log(`🌐 Server running at: http://localhost:${ENV.PORT}`);
    console.log(`🩺 Health Check: http://localhost:${ENV.PORT}/api/health`);
    console.log(`📦 Environment: ${ENV.NODE_ENV}`);
    console.log("=================================================\n");
  });

  // Graceful shutdown handling
  const shutdown = async (signal: string) => {
    console.log(`\n[Server] Received ${signal}. Starting graceful shutdown...`);
    server.close(async () => {
      console.log("[Server] HTTP server closed.");
      process.exit(0);
    });
  };

  process.on("SIGINT", () => shutdown("SIGINT"));
  process.on("SIGTERM", () => shutdown("SIGTERM"));
}

bootstrap().catch(err => {
  console.error("Fatal startup error:", err);
  process.exit(1);
});
