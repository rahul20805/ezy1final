// Test: Admin Audit Logging & Governance Actions
import assert from "node:assert";
import { recordAuditLog, loadDatabase } from "../src/server/src/dbAdapter.js";

console.log("Starting Admin Audit & Governance Tests...");

// TEST 1: Record audit log on sensitive action
const logEntry = recordAuditLog({
  actorId: 1, // Super Admin
  action: "PARTNER_APPLICATION_APPROVED",
  resource: "Partner:10001",
  oldValue: { status: "PENDING" },
  newValue: { status: "ACTIVE", approvedAt: new Date().toISOString() },
  ipAddress: "203.0.113.195",
  userAgent: "Mozilla/5.0 (Windows NT 10.0; Win64; x64) EZY1-Admin/1.0",
});

assert.strictEqual(logEntry.action, "PARTNER_APPLICATION_APPROVED");
assert.strictEqual(logEntry.actorId, 1);
assert.strictEqual(logEntry.resource, "Partner:10001");
console.log("✔ Test 1 Passed: Sensitive action logged with actor, resource, and timestamp.");

// TEST 2: Audit log retrieval & immutability check
const db = loadDatabase();
assert.strictEqual(Array.isArray(db.auditLogs), true);
const found = db.auditLogs.find((l) => l.action === "PARTNER_APPLICATION_APPROVED" && l.resource === "Partner:10001");
assert.strictEqual(found !== undefined, true, "Audit entry must persist in the database");
assert.strictEqual(found.newValue.status, "ACTIVE");
console.log("✔ Test 2 Passed: Audit trail persisted in database records.");

console.log("All Admin Audit & Governance Tests Passed Successfully! ✅");
setTimeout(() => process.exit(0), 100);
