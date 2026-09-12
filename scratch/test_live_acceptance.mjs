import assert from "assert";

const BASE_URL = "https://ezy1.site";

async function runLiveAcceptance() {
  console.log(`\n============================================================`);
  console.log(`RUNNING PRODUCTION LIVE ACCEPTANCE TEST AGAINST ${BASE_URL}`);
  console.log(`============================================================\n`);

  // 1. Health check
  console.log("Step 1: Checking API Health...");
  const healthRes = await fetch(`${BASE_URL}/api/health`);
  assert.strictEqual(healthRes.status, 200, "Health check must return 200");
  const health = await healthRes.json();
  console.log(`✓ Live API is Healthy: status="${health.status}", uptime=${Math.round(health.uptime)}s\n`);

  // 2. Authenticate as Partner A (Sharma Kirana Store, vendorId: 1)
  console.log("Step 2: Authenticating as Partner A (sharma_grocery)...");
  const loginRes = await fetch(`${BASE_URL}/api/auth/partner/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ username: "sharma_grocery", password: "partner123" }),
  });
  assert.strictEqual(loginRes.status, 200, "Partner login must return 200");
  const loginData = await loginRes.json();
  assert.ok(loginData.token, "JWT Token must be returned");
  const partner1Token = loginData.token;
  console.log(`✓ Logged in as: ${loginData.user.name} (Role: ${loginData.user.role}, Vendor ID: ${loginData.user.vendorId})\n`);

  // 3. Record Original Values
  console.log("Step 3: Fetching current partner profile from production database...");
  const getOrig = await fetch(`${BASE_URL}/api/vendors/1`);
  assert.strictEqual(getOrig.status, 200);
  const origVendor = await getOrig.json();
  console.log(`  Original Name: "${origVendor.businessName}"`);
  console.log(`  Original Phone: "${origVendor.phone}"`);
  console.log(`  Original Opening Hours: "${origVendor.openingHours}"\n`);

  // 4. Partner A Updates Information
  console.log("Step 4: Partner A changes business name, description, phone, hours, and radius via Partner API...");
  const updatePayload = {
    businessName: "Sharma Supermart & Provisions",
    description: "Daily fresh organic groceries, whole wheat grains, and household provisions.",
    phone: "9876543219",
    openingHours: "06:30 AM - 10:30 PM",
    deliveryRadiusKm: 14,
  };

  const updateRes = await fetch(`${BASE_URL}/api/vendors/1`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${partner1Token}`,
    },
    body: JSON.stringify(updatePayload),
  });

  assert.strictEqual(updateRes.status, 200, "Update must return 200 OK");
  const updateResult = await updateRes.json();
  assert.strictEqual(updateResult.success, true);
  assert.strictEqual(updateResult.message, "Changes saved successfully.");
  assert.strictEqual(updateResult.vendor.businessName, "Sharma Supermart & Provisions");
  assert.strictEqual(updateResult.vendor.phone, "9876543219");
  console.log(`✓ Server confirmed: "${updateResult.message}"`);
  console.log(`  Updated Name: "${updateResult.vendor.businessName}"`);
  console.log(`  Updated Phone: "${updateResult.vendor.phone}"\n`);

  // 5. Verify Database Single Source of Truth
  console.log("Step 5: Verifying database persistence via GET /api/vendors/1...");
  const verifyDb = await fetch(`${BASE_URL}/api/vendors/1`);
  assert.strictEqual(verifyDb.status, 200);
  const currentDb = await verifyDb.json();
  assert.strictEqual(currentDb.businessName, "Sharma Supermart & Provisions");
  assert.strictEqual(currentDb.phone, "9876543219");
  assert.strictEqual(currentDb.openingHours, "06:30 AM - 10:30 PM");
  assert.strictEqual(currentDb.deliveryRadiusKm, 14);
  console.log("✓ Database single source of truth confirmed with updated values.\n");

  // 6. Verify Change Audit History
  console.log("Step 6: Verifying audit change tracking via GET /api/vendors/1/changes...");
  const changesRes = await fetch(`${BASE_URL}/api/vendors/1/changes`, {
    headers: { Authorization: `Bearer ${partner1Token}` },
  });
  assert.strictEqual(changesRes.status, 200, "Audit logs must return 200");
  const changesData = await changesRes.json();
  assert.ok(Array.isArray(changesData.changes), "Changes must be an array");
  console.log(`✓ Audit log retrieved (${changesData.changes.length} records found):`);
  changesData.changes.slice(0, 3).forEach((c) => {
    console.log(`  • [${c.fieldChanged}]: "${c.previousValue}" → "${c.newValue}" (${c.status})`);
  });
  console.log();

  // 7. Anti-IDOR Test (Requirement 13 & 28)
  console.log("Step 7: Security Test (Anti-IDOR): Partner 1 attempts to modify Partner 2...");
  const idorRes = await fetch(`${BASE_URL}/api/vendors/2`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${partner1Token}`,
    },
    body: JSON.stringify({ businessName: "Compromised By Partner 1" }),
  });
  assert.strictEqual(idorRes.status, 403, "Must return HTTP 403 Forbidden");
  const idorErr = await idorRes.json();
  assert.strictEqual(idorErr.code, "FORBIDDEN");
  console.log(`✓ Anti-IDOR enforced server-side: HTTP 403 "${idorErr.error}"\n`);

  // 8. Field-Level Permissions (Requirement 18)
  console.log("Step 8: Security Test: Partner attempts to alter restricted fields (verified, rating, totalOrders)...");
  const restrictedRes = await fetch(`${BASE_URL}/api/vendors/1`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${partner1Token}`,
    },
    body: JSON.stringify({ rating: 5.0, verified: false, totalOrders: 999999 }),
  });
  assert.strictEqual(restrictedRes.status, 200);
  const verifyRestricted = await fetch(`${BASE_URL}/api/vendors/1`).then((r) => r.json());
  assert.strictEqual(verifyRestricted.rating, 4.8, "Rating must NOT be modified by partner");
  assert.strictEqual(verifyRestricted.verified, true, "Verified status must NOT be modified by partner");
  assert.strictEqual(verifyRestricted.totalOrders, 340, "Total orders must NOT be spoofed by partner");
  console.log("✓ Field-level permissions verified: restricted fields ignored for partner updates.\n");

  // 9. Polymorphic Partner: Doctor Consultation Update
  console.log("Step 9: Polymorphic Partner Test: Doctor updates consultation fee and specialty...");
  const docLogin = await fetch(`${BASE_URL}/api/auth/partner/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ username: "dr_priya", password: "partner123" }),
  }).then((r) => r.json());

  assert.ok(docLogin.token, "Doctor login must succeed");

  const docUpdate = await fetch(`${BASE_URL}/api/vendors/6`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${docLogin.token}`,
    },
    body: JSON.stringify({
      consultationFee: 450,
      specialization: "Senior General Physician & Family Medicine",
      timings: "08:30 AM - 01:00 PM, 05:00 PM - 09:00 PM",
    }),
  }).then((r) => r.json());

  assert.strictEqual(docUpdate.success, true);
  assert.strictEqual(docUpdate.vendor.consultationFee, 450);
  console.log(`✓ Doctor consultation fee updated to ₹${docUpdate.vendor.consultationFee}`);

  // Check public customer doctors API
  console.log("  Verifying public customer doctors directory /api/doctors...");
  const docDir = await fetch(`${BASE_URL}/api/doctors`).then((r) => r.json());
  const drPriya = docDir.find((d) => Number(d.id) === 6);
  assert.ok(drPriya, "Doctor must appear in public doctors API");
  assert.strictEqual(drPriya.fee, 450, "Customer view must display updated fee of ₹450");
  assert.strictEqual(drPriya.specialty, "Senior General Physician & Family Medicine");
  console.log(`✓ Customer API immediately displays updated doctor fee (₹${drPriya.fee}) and specialty without code redeployment!\n`);

  // 10. Polymorphic Partner: Hospital Bed Tracking Update
  console.log("Step 10: Polymorphic Partner Test: Hospital updates available beds and ICU count...");
  const adminLogin = await fetch(`${BASE_URL}/api/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ username: "admin", password: "admin123" }),
  }).then((r) => r.json());

  const hospUpdate = await fetch(`${BASE_URL}/api/vendors/5`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${adminLogin.token}`,
    },
    body: JSON.stringify({
      availableBeds: 52,
      icuBedsAvailable: 14,
    }),
  }).then((r) => r.json());

  assert.strictEqual(hospUpdate.success, true);
  assert.strictEqual(hospUpdate.vendor.availableBeds, 52);

  // Check public hospitals directory
  console.log("  Verifying public customer hospitals directory /api/hospitals...");
  const hospDir = await fetch(`${BASE_URL}/api/hospitals`).then((r) => r.json());
  const manipal = hospDir.find((h) => Number(h.id) === 5);
  assert.ok(manipal, "Hospital must appear in public hospitals API");
  assert.strictEqual(manipal.availableBeds, 52, "Customer view must display 52 available beds");
  assert.strictEqual(manipal.icuBedsAvailable, 14, "Customer view must display 14 available ICU beds");
  console.log(`✓ Customer API immediately displays updated hospital beds (${manipal.availableBeds} beds, ${manipal.icuBedsAvailable} ICU) without code redeployment!\n`);

  // 11. Refresh & Logout/Login Test (Requirements 10 & 11)
  console.log("Step 11: Refresh & Re-login Persistence Test...");
  const relogin = await fetch(`${BASE_URL}/api/auth/partner/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ username: "sharma_grocery", password: "partner123" }),
  }).then((r) => r.json());

  assert.ok(relogin.token);
  const finalProfile = await fetch(`${BASE_URL}/api/vendors/1`).then((r) => r.json());
  assert.strictEqual(finalProfile.businessName, "Sharma Supermart & Provisions");
  assert.strictEqual(finalProfile.phone, "9876543219");
  assert.strictEqual(finalProfile.openingHours, "06:30 AM - 10:30 PM");
  console.log("✓ Refresh and Re-login test passed: Authoritative data persists in database across sessions.\n");

  console.log("============================================================");
  console.log("ALL PRODUCTION ACCEPTANCE TESTS PASSED ON https://ezy1.site! 🎉");
  console.log("============================================================\n");
}

runLiveAcceptance().catch((err) => {
  console.error("\n❌ LIVE TEST FAILED:", err);
  process.exit(1);
});
