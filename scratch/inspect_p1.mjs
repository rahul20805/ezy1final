import sqlite3 from "../backend/node_modules/sqlite3/lib/sqlite3.js";
import { open } from "../backend/node_modules/sqlite/build/index.js";
import path from "path";

const db = await open({
  filename: "../src/server/database.sqlite",
  driver: sqlite3.Database
});

const partner = await db.get("SELECT * FROM partners WHERE partnerUserId = 'EZY-P-10001'");
console.log("Partner EZY-P-10001:", partner);

const allPartners = await db.all("SELECT id, partnerUserId, businessName FROM partners");
console.log("All partners:", allPartners);
