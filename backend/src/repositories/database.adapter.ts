import { PrismaClient } from "@prisma/client";
import sqlite3 from "sqlite3";
import { open, Database } from "sqlite";
import fs from "fs";
import path from "path";
import { ENV } from "../config/env.config.js";

let prisma: PrismaClient | null = null;
let sqliteDb: Database | null = null;
let isPostgresActive = false;

export async function getPrismaClient(): Promise<PrismaClient | null> {
  if (prisma) return prisma;
  if (ENV.DATABASE_URL && (ENV.DATABASE_URL.startsWith("postgresql://") || ENV.DATABASE_URL.startsWith("postgres://"))) {
    try {
      prisma = new PrismaClient({
        datasources: {
          db: { url: ENV.DATABASE_URL }
        }
      });
      await prisma.$connect();
      isPostgresActive = true;
      console.log("[DB] Connected to PostgreSQL database via Prisma ORM.");
      return prisma;
    } catch (err: any) {
      console.warn("[DB] PostgreSQL connection failed, falling back to embedded engine:", err.message);
      prisma = null;
      isPostgresActive = false;
    }
  }
  return null;
}

export async function getSqliteDb(): Promise<Database> {
  if (sqliteDb) return sqliteDb;
  const dbFile = ENV.DB_PATH;
  const dir = path.dirname(dbFile);
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }

  sqliteDb = await open({
    filename: dbFile,
    driver: sqlite3.Database
  });

  await initSqliteSchema(sqliteDb);
  return sqliteDb;
}

async function initSqliteSchema(db: Database) {
  await db.exec(`
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      username TEXT UNIQUE,
      email TEXT UNIQUE,
      phone TEXT UNIQUE,
      passwordHash TEXT,
      role TEXT DEFAULT 'CUSTOMER',
      walletBal REAL DEFAULT 0.0,
      googleId TEXT,
      avatar TEXT,
      status TEXT DEFAULT 'ACTIVE',
      createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
      updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS otps (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      phone TEXT NOT NULL,
      otpHash TEXT NOT NULL,
      plainOtp TEXT,
      expiresAt INTEGER NOT NULL,
      attempts INTEGER DEFAULT 0,
      lastSentAt INTEGER NOT NULL,
      verified INTEGER DEFAULT 0,
      createdAt DATETIME DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS notifications (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      userId INTEGER NOT NULL,
      eventId TEXT,
      type TEXT NOT NULL,
      category TEXT NOT NULL,
      title TEXT NOT NULL,
      message TEXT NOT NULL,
      priority TEXT DEFAULT 'NORMAL',
      data TEXT,
      actionUrl TEXT,
      isRead INTEGER DEFAULT 0,
      readAt DATETIME,
      channel TEXT DEFAULT 'IN_APP',
      createdAt DATETIME DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS notification_preferences (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      userId INTEGER NOT NULL UNIQUE,
      orders INTEGER DEFAULT 1,
      delivery INTEGER DEFAULT 1,
      bookings INTEGER DEFAULT 1,
      bus INTEGER DEFAULT 1,
      doctor INTEGER DEFAULT 1,
      hospital INTEGER DEFAULT 1,
      services INTEGER DEFAULT 1,
      offers INTEGER DEFAULT 1,
      announcements INTEGER DEFAULT 1,
      pushEnabled INTEGER DEFAULT 1,
      smsEnabled INTEGER DEFAULT 1,
      emailEnabled INTEGER DEFAULT 1,
      updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS push_tokens (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      userId INTEGER NOT NULL,
      token TEXT NOT NULL UNIQUE,
      deviceInfo TEXT,
      createdAt DATETIME DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS vendors (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      userId INTEGER NOT NULL,
      businessName TEXT NOT NULL,
      category TEXT NOT NULL,
      status TEXT DEFAULT 'approved',
      city TEXT NOT NULL,
      address TEXT NOT NULL,
      phone TEXT NOT NULL,
      rating REAL DEFAULT 5.0,
      createdAt DATETIME DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS products (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      vendorId INTEGER NOT NULL,
      name TEXT NOT NULL,
      description TEXT,
      price REAL NOT NULL,
      available BOOLEAN DEFAULT 1,
      category TEXT NOT NULL,
      image TEXT,
      createdAt DATETIME DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS orders (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      userId INTEGER NOT NULL,
      vendorId INTEGER NOT NULL,
      status TEXT DEFAULT 'pending',
      totalAmount REAL NOT NULL,
      orderSource TEXT DEFAULT 'WEB',
      itemsJson TEXT,
      createdAt DATETIME DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS partners (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      partnerUserId TEXT UNIQUE NOT NULL,
      passwordHash TEXT NOT NULL,
      name TEXT NOT NULL,
      businessName TEXT NOT NULL,
      email TEXT UNIQUE NOT NULL,
      phone TEXT UNIQUE NOT NULL,
      role TEXT DEFAULT 'PARTNER',
      partnerType TEXT DEFAULT 'GROCERY',
      providerType TEXT DEFAULT 'GROCERY',
      category TEXT DEFAULT 'Grocery',
      city TEXT NOT NULL,
      address TEXT,
      status TEXT DEFAULT 'ACTIVE',
      isVerified INTEGER DEFAULT 1,
      mustChangePassword INTEGER DEFAULT 0,
      failedAttempts INTEGER DEFAULT 0,
      lockedUntil INTEGER DEFAULT 0,
      lastLoginAt DATETIME,
      createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
      updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS partner_password_resets (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      partnerId INTEGER NOT NULL,
      tokenHash TEXT NOT NULL UNIQUE,
      expiresAt INTEGER NOT NULL,
      used INTEGER DEFAULT 0,
      createdAt DATETIME DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS payments (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      paymentNumber TEXT UNIQUE NOT NULL,
      orderId INTEGER,
      userId INTEGER NOT NULL,
      amount REAL NOT NULL,
      currency TEXT DEFAULT 'INR',
      gateway TEXT DEFAULT 'RAZORPAY',
      gatewayOrderId TEXT,
      gatewayPaymentId TEXT,
      status TEXT DEFAULT 'CREATED',
      idempotencyKey TEXT UNIQUE,
      createdAt DATETIME DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS audit_logs (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      actorId INTEGER,
      action TEXT NOT NULL,
      resource TEXT NOT NULL,
      oldValue TEXT,
      newValue TEXT,
      createdAt DATETIME DEFAULT CURRENT_TIMESTAMP
    );
  `);

  try {
    await db.exec("ALTER TABLE orders ADD COLUMN itemsJson TEXT;");
  } catch {}
  try {
    await db.exec("ALTER TABLE orders ADD COLUMN orderSource TEXT DEFAULT 'WEB';");
  } catch {}
  try {
    await db.exec("ALTER TABLE payments ADD COLUMN idempotencyKey TEXT;");
  } catch {}

  // Seed Default Partners if not existing
  const { hashPassword: hashPw } = await import("../utils/crypto.utils.js");
  const seedPartners = [
    { partnerUserId: 'EZY-P-10000', pw: 'Owner@2026!', name: 'Platform Master Owner', bName: 'EZY1 Master Ownership & Holdings', email: 'owner@ezy1.site', phone: '9876543200', role: 'OWNER', pType: 'OWNER', cat: 'Master', city: 'Bengaluru', addr: 'EZY1 Tower, Bengaluru' },
    { partnerUserId: 'EZY-P-10001', pw: 'Admin@2026!', name: 'Alka & Rahul Yadav', bName: 'EZY1 Platform Headquarters', email: 'admin@ezy1.in', phone: '9876543210', role: 'ADMIN', pType: 'ADMIN', cat: 'All', city: 'Bengaluru', addr: 'HQ Tech Park' },
    { partnerUserId: 'EZY-P-10002', pw: 'Sharma@2026!', name: 'Ramesh Sharma', bName: 'Sharma Kirana Store', email: 'sharma.kirana@partner.ezy1.in', phone: '9876543211', role: 'PARTNER', pType: 'GROCERY', cat: 'Grocery', city: 'Mumbai', addr: '123 Market Rd' },
    { partnerUserId: 'EZY-P-10003', pw: 'Nair@2026!', name: 'Krishnan Nair', bName: 'Nair Ayurveda & Pharma', email: 'nair.pharma@partner.ezy1.in', phone: '9876543212', role: 'PARTNER', pType: 'PHARMACY', cat: 'Pharmacy', city: 'Thiruvananthapuram', addr: '45 Temple St' },
    { partnerUserId: 'EZY-P-10004', pw: 'Suresh@2026!', name: 'Suresh Sharma', bName: 'Suresh Electricals & Fixes', email: 'suresh.services@partner.ezy1.in', phone: '9876543213', role: 'PARTNER', pType: 'SERVICE_PROVIDER', cat: 'Services', city: 'Bengaluru', addr: '77 MG Rd' },
    { partnerUserId: 'EZY-P-10005', pw: 'Rajesh@2026!', name: 'Rajesh Kumar', bName: 'Rajesh Fleet & Logistics', email: 'rajesh.transport@partner.ezy1.in', phone: '9876543214', role: 'PARTNER', pType: 'DELIVERY', cat: 'Transport', city: 'Delhi', addr: '99 Ring Rd' },
    { partnerUserId: 'EZY-P-10006', pw: 'Hospital@2026!', name: 'Dr. Ananya Roy', bName: 'City Care Multispecialty Hospital', email: 'citycare.hospital@partner.ezy1.in', phone: '9876543215', role: 'PARTNER', pType: 'HOSPITAL', cat: 'Healthcare', city: 'Bengaluru', addr: '12 Indiranagar' },
    { partnerUserId: 'EZY-P-10007', pw: 'Restaurant@2026!', name: 'Chef Farhan Qureshi', bName: 'Royal Biryani & Curries', email: 'royal.biryani@partner.ezy1.in', phone: '9876543216', role: 'PARTNER', pType: 'RESTAURANT', cat: 'Food', city: 'Hyderabad', addr: '88 Banjara Hills' }
  ];

  for (const p of seedPartners) {
    const existing = await db.get("SELECT id FROM partners WHERE partnerUserId = ?", [p.partnerUserId]);
    const pwH = hashPw(p.pw);
    if (!existing) {
      await db.run(
        `INSERT INTO partners (partnerUserId, passwordHash, name, businessName, email, phone, role, partnerType, providerType, category, city, address, status, isVerified, mustChangePassword)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'ACTIVE', 1, 0)`,
        [p.partnerUserId, pwH, p.name, p.bName, p.email, p.phone, p.role, p.pType, p.pType, p.cat, p.city, p.addr]
      );
    }
  }
}

export async function query<T = any>(sql: string, params: any[] = []): Promise<T[]> {
  const db = await getSqliteDb();
  return db.all(sql, params);
}

export async function queryOne<T = any>(sql: string, params: any[] = []): Promise<T | undefined> {
  const db = await getSqliteDb();
  return db.get(sql, params);
}

export async function execute(sql: string, params: any[] = []): Promise<any> {
  const db = await getSqliteDb();
  return db.run(sql, params);
}
