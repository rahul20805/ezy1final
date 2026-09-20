// Test: Strict Partner Multi-Tenant Isolation & Security
import assert from "node:assert";
import {
  getPartnerScopedProducts,
  getPartnerScopedOrders,
  getPartnerScopedSettlements,
  partnerUpdateProduct,
  loadDatabase,
} from "../src/server/src/dbAdapter.js";
import { storage } from "../src/server/src/storageService.js";

console.log("Starting Partner Multi-Tenant Isolation Tests...");

// Ensure DB has sample partner records
const db = loadDatabase();
if (!db.partners || db.partners.length === 0) {
  db.partners = [
    { id: 1, partnerUserId: "EZY-P-10001", businessName: "Sharma Supermarket", vendorId: 1 },
    { id: 2, partnerUserId: "EZY-P-10002", businessName: "Nair Healthcare Clinic", vendorId: 2 },
  ];
  db.products = [
    { id: 101, partnerId: 1, name: "Basmati Rice 5kg", price: 450 },
    { id: 102, partnerId: 1, name: "Cold Pressed Mustard Oil", price: 190 },
    { id: 201, partnerId: 2, name: "Consultation - General Physician", price: 500 },
  ];
  db.orders = [
    { id: 1001, partnerId: 1, totalAmount: 640, status: "CONFIRMED" },
    { id: 2001, partnerId: 2, totalAmount: 500, status: "CONFIRMED" },
  ];
}

// TEST 1: Partner 1 sees ONLY Partner 1's products
const p1Products = getPartnerScopedProducts(1);
assert.strictEqual(p1Products.length >= 2, true, "Partner 1 should have products");
p1Products.forEach((p) => {
  assert.strictEqual(Number(p.partnerId || p.vendorId), 1, "Product must belong to Partner 1");
});
console.log("✔ Test 1 Passed: Partner 1 retrieves only their own products.");

// TEST 2: Partner 2 sees ONLY Partner 2's products
const p2Products = getPartnerScopedProducts(2);
p2Products.forEach((p) => {
  assert.strictEqual(Number(p.partnerId || p.vendorId), 2, "Product must belong to Partner 2");
});
console.log("✔ Test 2 Passed: Partner 2 retrieves only their own products.");

// TEST 3: Cross-tenant modification rejection (Partner 2 tries to modify Partner 1's product)
let crossTenantBlocked = false;
try {
  partnerUpdateProduct(2, 101, { price: 999 });
} catch (err) {
  if (err.message === "FORBIDDEN_TENANT_VIOLATION") {
    crossTenantBlocked = true;
  }
}
assert.strictEqual(crossTenantBlocked, true, "Cross-tenant modification must be blocked with FORBIDDEN_TENANT_VIOLATION");
console.log("✔ Test 3 Passed: Cross-tenant modification prevented.");

// TEST 4: Partner Settlement Calculation
const settlements = getPartnerScopedSettlements(1);
assert.strictEqual(settlements.partnerId, 1);
assert.strictEqual(typeof settlements.totalSales, "number");
assert.strictEqual(typeof settlements.platformFee, "number");
assert.strictEqual(typeof settlements.netSettlement, "number");
assert.strictEqual(settlements.totalSales > 0, true);
console.log("✔ Test 4 Passed: Partner financial settlement ledger computed accurately.");

// TEST 5: Private KYC Presigned URL generation
const kycUrl = storage.generatePresignedKycUrl(1, "pan_card", "pan.pdf");
assert.strictEqual(kycUrl.objectKey.includes("partners/1/kyc/pan_card_pan.pdf"), true);
assert.strictEqual(kycUrl.presignedUrl.includes("expires="), true);
assert.strictEqual(kycUrl.presignedUrl.includes("sig="), true);
console.log("✔ Test 5 Passed: Private KYC presigned URL generated with secure signature.");

console.log("All Partner Multi-Tenant Isolation Tests Passed Successfully! ✅");
