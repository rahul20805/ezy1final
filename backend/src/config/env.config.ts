import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// Load root and local .env files
dotenv.config({ path: path.resolve(__dirname, "../../.env") });
dotenv.config();

import fs from "fs";

function resolveDbPath(): string {
  const defaultPath = path.resolve(__dirname, "../../../src/server/database.sqlite");
  if (process.env.DB_PATH) {
    const customPath = path.isAbsolute(process.env.DB_PATH)
      ? process.env.DB_PATH
      : path.resolve(process.cwd(), process.env.DB_PATH);
    if (fs.existsSync(customPath)) return customPath;
    const projectPath = path.resolve(__dirname, "../..", process.env.DB_PATH);
    if (fs.existsSync(projectPath)) return projectPath;
  }
  return defaultPath;
}

export const ENV = {
  PORT: Number(process.env.PORT) || 3000,
  NODE_ENV: process.env.NODE_ENV || "development",
  isProduction: process.env.NODE_ENV === "production",
  DATABASE_URL: process.env.DATABASE_URL || "",
  DB_PATH: resolveDbPath(),
  JWT_SECRET: process.env.JWT_SECRET || "ezy1_production_jwt_secret_super_secure_key_2026_min32chars",
  SESSION_SECRET: process.env.SESSION_SECRET || "ezy1_session_encryption_key_2026",
  CORS_ORIGINS: process.env.CORS_ORIGINS ? process.env.CORS_ORIGINS.split(",") : [
    "https://ezy1.site",
    "https://partner.ezy1.site",
    "https://admin.ezy1.site",
    "http://localhost:5173",
    "http://127.0.0.1:5173",
    "http://localhost:3000",
    "http://127.0.0.1:3000"
  ],
  OTP_PROVIDER: process.env.OTP_PROVIDER || process.env.SMS_PROVIDER || "fast2sms",
  ENABLE_TEST_OTP: process.env.ENABLE_TEST_OTP === "true",
  RAZORPAY_KEY_ID: process.env.RAZORPAY_KEY_ID || process.env.VITE_RAZORPAY_KEY_ID || "rzp_test_ezy1_production_demo",
  RAZORPAY_KEY_SECRET: process.env.RAZORPAY_KEY_SECRET || "rzp_secret_ezy1_production_demo_2026",
  RAZORPAY_WEBHOOK_SECRET: process.env.RAZORPAY_WEBHOOK_SECRET || "rzp_webhook_secret_2026",
  SMTP_HOST: process.env.SMTP_HOST || "smtp-relay.brevo.com",
  SMTP_PORT: Number(process.env.SMTP_PORT) || 587,
  SMTP_USER: process.env.SMTP_USER || "",
  SMTP_PASS: process.env.SMTP_PASS || process.env.BREVO_SMTP_KEY || "",
  BREVO_API_KEY: process.env.BREVO_API_KEY || "",
  IMPROVX_API_KEY: process.env.IMPROVX_API_KEY || "",
  ADMIN_NOTIFICATION_EMAIL: process.env.ADMIN_NOTIFICATION_EMAIL || "admin@ezy1.site",
  OWNER_NOTIFICATION_EMAIL: process.env.OWNER_NOTIFICATION_EMAIL || "owner@ezy1.site",
  AWS_REGION: process.env.AWS_REGION || "ap-south-1",
  AWS_KYC_BUCKET: process.env.AWS_KYC_BUCKET || "ezy1-partner-kyc-private",
  AWS_PUBLIC_BUCKET: process.env.AWS_PUBLIC_BUCKET || "ezy1-public-media",
  CDN_BASE_URL: process.env.CDN_BASE_URL || "https://cdn.ezy1.site",
  REDIS_URL: process.env.REDIS_URL || "redis://localhost:6379",
  OPENAI_API_KEY: process.env.OPENAI_API_KEY || process.env.VITE_AI_API_KEY || "",
  OPENAI_MODEL: process.env.OPENAI_MODEL || "gpt-4o"
};
