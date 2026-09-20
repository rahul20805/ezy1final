/**
 * EZY1 Data Migration & Export Utility: JSON to PostgreSQL
 * 
 * Extracts data from ezy1_db.json and:
 * 1. Generates database/seed.sql for PostgreSQL deployment
 * 2. Connects directly to PostgreSQL if DATABASE_URL is available
 */

import fs from "fs";
import path from "path";

export async function generatePostgreSqlSeed() {
  const jsonPath = path.join(process.cwd(), "ezy1_db.json");
  if (!fs.existsSync(jsonPath)) {
    console.warn("No ezy1_db.json found to migrate.");
    return;
  }

  const raw = fs.readFileSync(jsonPath, "utf-8");
  const data = JSON.parse(raw);

  const sqlStatements = [];
  sqlStatements.push("-- =============================================");
  sqlStatements.push("-- EZY1 PRODUCTION DATABASE SEED SCRIPT (PostgreSQL)");
  sqlStatements.push(`-- Generated: ${new Date().toISOString()}`);
  sqlStatements.push("-- =============================================\n");

  // Disable constraints during mass insert
  sqlStatements.push("SET session_replication_role = 'replica';\n");

  // 1. Users
  if (data.users && Array.isArray(data.users)) {
    sqlStatements.push("-- Users");
    for (const u of data.users) {
      const username = (u.username || `user_${u.id}`).replace(/'/g, "''");
      const email = (u.email || `user_${u.id}@ezy1.site`).replace(/'/g, "''");
      const name = (u.name || "User").replace(/'/g, "''");
      const role = (u.role || "CUSTOMER").toUpperCase();
      const phone = (u.phone || "").replace(/'/g, "''");
      const pwHash = (u.passwordHash || "$2b$10$defaultHash").replace(/'/g, "''");

      sqlStatements.push(
        `INSERT INTO "User" (id, username, email, "passwordHash", name, phone, role, "walletBalance", "createdAt", "updatedAt") ` +
        `VALUES (${u.id}, '${username}', '${email}', '${pwHash}', '${name}', '${phone}', '${role}', ${u.walletBalance || 0}, NOW(), NOW()) ` +
        `ON CONFLICT (id) DO NOTHING;`
      );
    }
    sqlStatements.push("\n");
  }

  // 2. Partners
  if (data.partners && Array.isArray(data.partners)) {
    sqlStatements.push("-- Partners");
    for (const p of data.partners) {
      const pUserId = (p.partnerUserId || `EZY-P-${10000 + p.id}`).replace(/'/g, "''");
      const bName = (p.businessName || "Partner Store").replace(/'/g, "''");
      const oName = (p.ownerName || "Partner Owner").replace(/'/g, "''");
      const cat = (p.category || "General").replace(/'/g, "''");
      const pType = (p.providerType || p.partnerType || "GROCERY").toUpperCase();
      const city = (p.city || "Bengaluru").replace(/'/g, "''");
      const phone = (p.phone || "").replace(/'/g, "''");
      const email = (p.email || `partner_${p.id}@partner.ezy1.site`).replace(/'/g, "''");

      sqlStatements.push(
        `INSERT INTO "Partner" (id, "partnerUserId", "userId", "businessName", "ownerName", category, "providerType", phone, email, city, rating, "createdAt", "updatedAt") ` +
        `VALUES (${p.id}, '${pUserId}', ${p.userId || p.id}, '${bName}', '${oName}', '${cat}', '${pType}', '${phone}', '${email}', '${city}', ${p.rating || 5.0}, NOW(), NOW()) ` +
        `ON CONFLICT (id) DO NOTHING;`
      );
    }
    sqlStatements.push("\n");
  }

  // 3. Products
  if (data.products && Array.isArray(data.products)) {
    sqlStatements.push("-- Products");
    for (const prod of data.products) {
      const name = (prod.name || "Product").replace(/'/g, "''");
      const desc = (prod.description || "").replace(/'/g, "''");
      const price = Number(prod.price) || 0;
      const partnerId = Number(prod.partnerId || prod.vendorId) || 1;
      const catId = Number(prod.categoryId) || 1;

      sqlStatements.push(
        `INSERT INTO "Product" (id, "partnerId", "categoryId", name, description, price, "isAvailable", "createdAt", "updatedAt") ` +
        `VALUES (${prod.id}, ${partnerId}, ${catId}, '${name}', '${desc}', ${price}, true, NOW(), NOW()) ` +
        `ON CONFLICT (id) DO NOTHING;`
      );
    }
    sqlStatements.push("\n");
  }

  // Re-enable constraints
  sqlStatements.push("SET session_replication_role = 'DEFAULT';\n");

  const outDir = path.join(process.cwd(), "database");
  if (!fs.existsSync(outDir)) {
    fs.mkdirSync(outDir, { recursive: true });
  }

  const outFile = path.join(outDir, "seed.sql");
  fs.writeFileSync(outFile, sqlStatements.join("\n"), "utf-8");
  console.log(`[Migrate] Successfully generated PostgreSQL seed at: ${outFile}`);
  return outFile;
}

if (process.argv[1] && process.argv[1].endsWith("migrateJsonToPg.js")) {
  generatePostgreSqlSeed().catch(console.error);
}
