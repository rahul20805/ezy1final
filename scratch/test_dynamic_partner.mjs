import assert from "assert";
import handler from "../api/index.js";
import { signJwt } from "../api/auth.js";

function createMockReqRes({ method = "GET", url = "/", headers = {}, body = null }) {
  const req = {
    method,
    url,
    headers: { host: "localhost", ...headers },
    body,
  };

  let statusCode = 200;
  const responseHeaders = {};
  let responseData = "";

  const res = {
    setHeader(k, v) {
      responseHeaders[k.toLowerCase()] = v;
    },
    get statusCode() {
      return statusCode;
    },
    set statusCode(code) {
      statusCode = code;
    },
    end(chunk) {
      if (chunk) responseData += chunk;
    },
  };

  const execute = async () => {
    await handler(req, res);
    let parsed = null;
    try {
      parsed = JSON.parse(responseData);
    } catch {
      parsed = responseData;
    }
    return { status: statusCode, headers: responseHeaders, data: parsed };
  };

  return { req, res, execute };
}

async function runTests() {
  console.log("=== RUNNING DYNAMIC PARTNER & AUDIT LOG TESTS ===");

  // 1. Tokens for testing
  const partner1Token = signJwt({ id: 2, username: "sharma_grocery", role: "partner", vendorId: 1 });
  const partner2Token = signJwt({ id: 3, username: "nair_pharma", role: "partner", vendorId: 2 });
  const doctorToken = signJwt({ id: 6, username: "dr_priya", role: "partner", vendorId: 6 });
  const adminToken = signJwt({ id: 1, username: "admin", role: "super_owner", vendorId: 0 });

  // 2. Partner 1 edits their own business information
  console.log("Test 1: Partner 1 updates businessName and phone...");
  const updateP1 = await createMockReqRes({
    method: "PUT",
    url: "/api/vendors/1",
    headers: { authorization: `Bearer ${partner1Token}`, "content-type": "application/json" },
    body: {
      businessName: "Sharma Supermart & Provisions",
      phone: "9876500000",
      description: "Organic groceries, daily dairy essentials and premium pulses."
    },
  }).execute();

  assert.strictEqual(updateP1.status, 200, "Partner 1 update should succeed");
  assert.strictEqual(updateP1.data.vendor.businessName, "Sharma Supermart & Provisions");
  assert.strictEqual(updateP1.data.vendor.phone, "9876500000");
  assert.strictEqual(updateP1.data.message, "Changes saved successfully.");
  console.log("✓ Partner 1 updated successfully with real confirmation.");

  // 3. Verify Change History for Partner 1
  console.log("Test 2: Check change history for Partner 1...");
  const historyP1 = await createMockReqRes({
    method: "GET",
    url: "/api/vendors/1/changes",
    headers: { authorization: `Bearer ${partner1Token}` },
  }).execute();

  assert.strictEqual(historyP1.status, 200, "Change history should return 200");
  assert.ok(Array.isArray(historyP1.data.changes), "Changes should be an array");
  const nameChange = historyP1.data.changes.find(c => c.fieldChanged === "businessName");
  assert.ok(nameChange, "Change history must record businessName change");
  assert.strictEqual(nameChange.newValue, "Sharma Supermart & Provisions");
  console.log(`✓ Change history captured: ${nameChange.fieldChanged} changed from "${nameChange.previousValue}" to "${nameChange.newValue}"`);

  // 4. Anti-IDOR Test: Partner 1 attempts to modify Partner 2's vendor ID
  console.log("Test 3: Anti-IDOR: Partner 1 attempts to edit Partner 2 (ID: 2)...");
  const idorAttack = await createMockReqRes({
    method: "PUT",
    url: "/api/vendors/2",
    headers: { authorization: `Bearer ${partner1Token}`, "content-type": "application/json" },
    body: { businessName: "Hacked by Partner 1" },
  }).execute();

  assert.strictEqual(idorAttack.status, 403, "Anti-IDOR must reject unauthorized edit with 403");
  console.log("✓ Anti-IDOR check passed: 403 Forbidden returned.");

  // 5. Anti-IDOR on changes log: Partner 1 attempts to view Partner 2's changes
  console.log("Test 4: Anti-IDOR on changes log: Partner 1 attempts to view Partner 2's audit...");
  const idorAudit = await createMockReqRes({
    method: "GET",
    url: "/api/vendors/2/changes",
    headers: { authorization: `Bearer ${partner1Token}` },
  }).execute();

  assert.strictEqual(idorAudit.status, 403, "Anti-IDOR must protect audit logs with 403");
  console.log("✓ Audit log Anti-IDOR check passed: 403 Forbidden returned.");

  // 6. Field-level permission test: Partner attempts to grant themselves verified = true or modify rating
  console.log("Test 5: Field-level permissions: Partner attempts to alter verified and rating...");
  const permissionTest = await createMockReqRes({
    method: "PUT",
    url: "/api/vendors/1",
    headers: { authorization: `Bearer ${partner1Token}`, "content-type": "application/json" },
    body: {
      rating: 5.0,
      verified: false,
      totalOrders: 999999
    },
  }).execute();

  assert.strictEqual(permissionTest.status, 200);
  // Re-fetch vendor 1 to ensure rating and verified were untouched
  const fetchP1 = await createMockReqRes({ method: "GET", url: "/api/vendors/1" }).execute();
  assert.strictEqual(fetchP1.data.rating, 4.8, "Partner should not be able to edit rating");
  assert.strictEqual(fetchP1.data.verified, true, "Partner should not be able to edit verified status");
  assert.strictEqual(fetchP1.data.totalOrders, 340, "Partner should not be able to spoof totalOrders");
  console.log("✓ Field-level permissions enforced: restricted fields ignored for partner.");

  // 7. Polymorphic Partner: Doctor updating consultationFee and specialization
  console.log("Test 6: Polymorphic Doctor partner updating consultationFee and specialization...");
  const doctorUpdate = await createMockReqRes({
    method: "PUT",
    url: "/api/vendors/6",
    headers: { authorization: `Bearer ${doctorToken}`, "content-type": "application/json" },
    body: {
      consultationFee: 450,
      specialization: "Senior Consultant - General & Preventive Medicine",
      timings: "08:30 AM - 01:30 PM, 05:00 PM - 09:00 PM"
    },
  }).execute();

  assert.strictEqual(doctorUpdate.status, 200);
  assert.strictEqual(doctorUpdate.data.vendor.consultationFee, 450);
  assert.strictEqual(doctorUpdate.data.vendor.specialization, "Senior Consultant - General & Preventive Medicine");
  console.log("✓ Doctor partner updated consultation fee to ₹450.");

  // 8. Public Doctor Directory reflects Doctor update
  console.log("Test 7: Verify /api/doctors returns updated consultationFee and specialization...");
  const docDir = await createMockReqRes({ method: "GET", url: "/api/doctors" }).execute();
  const drPriya = docDir.data.find(d => Number(d.id) === 6);
  assert.ok(drPriya, "Dr. Priya should be in public doctors directory");
  assert.strictEqual(drPriya.fee, 450, "Public directory must reflect updated consultationFee");
  assert.strictEqual(drPriya.specialty, "Senior Consultant - General & Preventive Medicine");
  console.log("✓ Public doctor directory immediately reflects updated partner data!");

  // 9. Services CRUD for Service Partner
  console.log("Test 8: Services CRUD for Partner 3 (Suresh Services)...");
  const sureshToken = signJwt({ id: 4, username: "suresh_services", role: "partner", vendorId: 3 });
  
  // Add service
  const addService = await createMockReqRes({
    method: "POST",
    url: "/api/services",
    headers: { authorization: `Bearer ${sureshToken}`, "content-type": "application/json" },
    body: {
      name: "Emergency Inverter & Battery Wiring",
      price: 499,
      description: "Urgent wiring fix and battery health checkup within 60 mins."
    },
  }).execute();
  assert.strictEqual(addService.status, 201, "Service creation should return 201");
  const newServiceId = addService.data.service.id;

  // Edit service
  const editService = await createMockReqRes({
    method: "PUT",
    url: `/api/services/${newServiceId}`,
    headers: { authorization: `Bearer ${sureshToken}`, "content-type": "application/json" },
    body: { price: 549 },
  }).execute();
  assert.strictEqual(editService.status, 200);
  assert.strictEqual(editService.data.service.price, 549);

  // Verify public services API
  const getServices = await createMockReqRes({ method: "GET", url: "/api/services?vendorId=3" }).execute();
  const found = getServices.data.find(s => s.id === newServiceId);
  assert.ok(found, "Newly added service must appear in public services API");
  assert.strictEqual(found.price, 549);
  console.log("✓ Services CRUD works seamlessly with live persistence.");

  console.log("\nALL BACKEND DYNAMIC PARTNER & AUDIT TESTS PASSED SUCCESSFULLY! 🎉\n");
}

runTests().catch(err => {
  console.error("Test failure:", err);
  process.exit(1);
});
