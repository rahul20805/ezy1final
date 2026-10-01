import sqlite3 from "../backend/node_modules/sqlite3/lib/sqlite3.js";
import { open } from "../backend/node_modules/sqlite/build/index.js";
import fs from "fs";
import path from "path";

async function inspectDb(label, filePath) {
  const fullPath = path.resolve(filePath);
  if (!fs.existsSync(fullPath)) {
    console.log(`${label}: NOT FOUND (${fullPath})`);
    return;
  }
  const stat = fs.statSync(fullPath);
  console.log(`\n========================================`);
  console.log(`${label}: ${fullPath} (${stat.size} bytes)`);
  console.log(`========================================`);

  try {
    const db = await open({
      filename: fullPath,
      driver: sqlite3.Database
    });

    const tables = await db.all("SELECT name FROM sqlite_master WHERE type='table' AND name NOT LIKE 'sqlite_%'");
    console.log(`Total Tables: ${tables.length}`);
    for (const t of tables) {
      try {
        const countRow = await db.get(`SELECT COUNT(*) as cnt FROM "${t.name}"`);
        console.log(`  - ${t.name.padEnd(25)} : ${countRow.cnt} rows`);
      } catch (err) {
        console.log(`  - ${t.name.padEnd(25)} : ERROR reading count (${err.message})`);
      }
    }
    await db.close();
  } catch (err) {
    console.error(`Failed to inspect ${label}:`, err.message);
  }
}

async function inspectJson(label, filePath) {
  const fullPath = path.resolve(filePath);
  if (!fs.existsSync(fullPath)) {
    console.log(`${label}: NOT FOUND`);
    return;
  }
  const stat = fs.statSync(fullPath);
  console.log(`\n========================================`);
  console.log(`${label}: ${fullPath} (${stat.size} bytes)`);
  console.log(`========================================`);
  try {
    const raw = fs.readFileSync(fullPath, "utf8");
    const data = JSON.parse(raw);
    for (const [key, val] of Object.entries(data)) {
      if (Array.isArray(val)) {
        console.log(`  - ${key.padEnd(25)} : ${val.length} items`);
      } else if (val && typeof val === "object") {
        console.log(`  - ${key.padEnd(25)} : object (${Object.keys(val).length} keys)`);
      }
    }
  } catch (err) {
    console.error(`Failed to read JSON:`, err.message);
  }
}

async function run() {
  await inspectDb("Project Server SQLite", "src/server/database.sqlite");
  await inspectDb("Root Src Server SQLite", "../src/server/database.sqlite");
  await inspectJson("Project ezy1_db.json", "ezy1_db.json");
}

run();
