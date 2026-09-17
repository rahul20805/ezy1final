import express from "express";
import cors from "cors";
import { initDb, openDb } from "./src/db.js";
import { router } from "./src/routes.js";
import { verifyJwt } from "./src/authService.js";

async function runTests() {
  console.log("\n========================================================");
  console.log("🚀 EZY1 PRODUCTION AUTH & NOTIFICATION SYSTEM TEST SUITE");
  console.log("========================================================\n");

  process.env.NODE_ENV = "test";
  process.env.ENABLE_TEST_OTP = "true";

  // 1. Initialize Test Express App
  const app = express();
  app.locals.verifyJwt = verifyJwt;
  app.use(cors());
  app.use(express.json());
  app.use("/api", router);

  await initDb();
  const db = await openDb();
  await db.run("DELETE FROM otps");
  await db.run("DELETE FROM notifications WHERE eventId LIKE 'evt_%'");

  const server = app.listen(4999, () => {
    console.log("✅ Test Server listening on http://127.0.0.1:4999");
  });

  const BASE_URL = "http://127.0.0.1:4999/api";

  let testPassed = 0;
  let testFailed = 0;

  function assert(condition, message) {
    if (condition) {
      console.log(`  ✅ PASS: ${message}`);
      testPassed++;
    } else {
      console.error(`  ❌ FAIL: ${message}`);
      testFailed++;
    }
  }

  try {
    // ----------------------------------------------------
    // TEST GROUP 1: Customer Phone OTP Authentication
    // ----------------------------------------------------
    console.log("\n--- [1] Customer Mobile Phone OTP Flow ---");

    // 1.1 Send OTP to test phone
    const sendRes = await fetch(`${BASE_URL}/auth/send-otp`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ phone: "9876543210" }),
    });
    const sendData = await sendRes.json();
    assert(sendData.success === true, "Send OTP returns success = true");
    assert(sendData.cooldownSeconds === 30, "Enforces 30s resend cooldown");

    // 1.2 Test 30s cooldown rejection
    const cooldownRes = await fetch(`${BASE_URL}/auth/send-otp`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ phone: "9876543210" }),
    });
    const cooldownData = await cooldownRes.json();
    assert(cooldownRes.status === 400 && cooldownData.error.includes("wait"), "Rejects immediate resend within 30s cooldown");

    // 1.3 Test Invalid OTP attempt
    const invalidOtpRes = await fetch(`${BASE_URL}/auth/verify-otp`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ phone: "9876543210", otp: "000000" }),
    });
    const invalidOtpData = await invalidOtpRes.json();
    assert(invalidOtpRes.status === 400 && invalidOtpData.error.includes("Incorrect OTP"), "Rejects incorrect OTP with attempt countdown");

    // 1.4 Test Correct OTP Verification
    const validOtpRes = await fetch(`${BASE_URL}/auth/verify-otp`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ phone: "9876543210", otp: "123456", name: "Rahul Sharma" }),
    });
    const validOtpData = await validOtpRes.json();
    if (!validOtpData.success) {
      console.error("DEBUG validOtpData error:", validOtpData);
    }
    assert(validOtpData.success === true && !!validOtpData.token, "Verifies correct OTP and issues JWT token");
    assert(validOtpData.user?.role === "CUSTOMER", "User profile has strictly role = 'CUSTOMER'");

    const customerToken = validOtpData.token;
    const customerUserId = validOtpData.user.id;

    // ----------------------------------------------------
    // TEST GROUP 2: Google OAuth & Intelligent Account Linking
    // ----------------------------------------------------
    console.log("\n--- [2] Google OAuth & Intelligent Account Linking ---");

    // 2.1 Google OAuth with matching phone/email
    const googleRes = await fetch(`${BASE_URL}/auth/google`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email: "customer@ezy1.com",
        name: "Rahul Sharma",
        googleId: "gid_992149",
        avatar: "https://example.com/avatar.png",
      }),
    });
    const googleData = await googleRes.json();
    assert(googleData.success === true && !!googleData.token, "Google OAuth succeeds and issues JWT");
    assert(googleData.user.role === "CUSTOMER", "Google OAuth user has strictly role = 'CUSTOMER'");

    // 2.2 Profile check with JWT (/auth/me)
    const meRes = await fetch(`${BASE_URL}/auth/me`, {
      headers: { Authorization: `Bearer ${customerToken}` },
    });
    const meData = await meRes.json();
    assert(meData.user.phone === "9876543210", "Profile endpoint (/auth/me) returns authenticated customer details");

    // ----------------------------------------------------
    // TEST GROUP 3: Central Intelligent Notification Engine
    // ----------------------------------------------------
    console.log("\n--- [3] Central Intelligent Notification Engine ---");

    // 3.1 Trigger Order Dispatched event
    const orderEvtRes = await fetch(`${BASE_URL}/notifications/test-event`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${customerToken}`,
      },
      body: JSON.stringify({
        type: "DELIVERY_STARTED",
        data: {
          orderNumber: "ORD-5541",
          partnerName: "Vikram Singh",
          eta: "12 mins",
        },
      }),
    });
    const orderEvtData = await orderEvtRes.json();
    assert(orderEvtData.success === true, "Dispatched DELIVERY_STARTED notification with dynamic template rendering");
    assert(orderEvtData.notification.category === "delivery", "Auto-categorized under 'delivery'");

    // 3.2 Trigger Critical Delivery Nearby event
    const critEvtRes = await fetch(`${BASE_URL}/notifications/test-event`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${customerToken}`,
      },
      body: JSON.stringify({
        type: "DELIVERY_NEARBY",
        data: {
          partnerName: "Vikram Singh",
          orderNumber: "ORD-5541",
        },
      }),
    });
    const critEvtData = await critEvtRes.json();
    assert(critEvtData.notification.priority === "CRITICAL", "Assigned CRITICAL priority for DELIVERY_NEARBY");

    // 3.3 Anti-Spam & Deduplication Idempotency Check
    const dupEventId = "evt_dedup_test_999";
    await fetch(`${BASE_URL}/notifications/test-event`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${customerToken}`,
      },
      body: JSON.stringify({
        type: "ORDER_CREATED",
        eventId: dupEventId,
        customTitle: "Original Order",
      }),
    });

    const dup2Res = await fetch(`${BASE_URL}/notifications/test-event`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${customerToken}`,
      },
      body: JSON.stringify({
        type: "ORDER_CREATED",
        eventId: dupEventId,
        customTitle: "Duplicate Order",
      }),
    });
    const dup2Data = await dup2Res.json();
    assert(dup2Data.notification === null, "Deduplication guard successfully suppressed duplicate event ID");

    // 3.4 Fetch User Notifications and Unread Count
    const listRes = await fetch(`${BASE_URL}/notifications`, {
      headers: { Authorization: `Bearer ${customerToken}` },
    });
    const listData = await listRes.json();
    assert(listData.notifications.length > 0, "Fetched user notifications list");
    assert(listData.unreadCount > 0, `Unread count retrieved correctly (${listData.unreadCount})`);

    // 3.5 Mark Single Notification as Read
    const targetNotif = listData.notifications[0];
    const markReadRes = await fetch(`${BASE_URL}/notifications/${targetNotif.id}/read`, {
      method: "PATCH",
      headers: { Authorization: `Bearer ${customerToken}` },
    });
    const markReadData = await markReadRes.json();
    assert(markReadData.success === true, `Marked notification #${targetNotif.id} as read`);

    // 3.6 Mark All Notifications as Read
    const markAllRes = await fetch(`${BASE_URL}/notifications/read-all`, {
      method: "POST",
      headers: { Authorization: `Bearer ${customerToken}` },
    });
    const markAllData = await markAllRes.json();
    assert(markAllData.success === true, "Marked all notifications as read");

    // 3.7 Preferences Fetch & Update
    const prefGetRes = await fetch(`${BASE_URL}/notifications/preferences`, {
      headers: { Authorization: `Bearer ${customerToken}` },
    });
    const prefGetData = await prefGetRes.json();
    assert(prefGetData.preferences !== undefined, "Retrieved user notification preferences");

    const prefUpdateRes = await fetch(`${BASE_URL}/notifications/preferences`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${customerToken}`,
      },
      body: JSON.stringify({ offers: 0, bus: 1 }),
    });
    const prefUpdateData = await prefUpdateRes.json();
    assert(prefUpdateData.preferences.offers === 0, "Updated preference: Disabled promotional offers");

    // 3.8 Marketing Opt-Out Suppression Check
    const promoRes = await fetch(`${BASE_URL}/notifications/test-event`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${customerToken}`,
      },
      body: JSON.stringify({
        type: "COUPON_AVAILABLE",
        data: { couponCode: "SUPER50", discountText: "50% off" },
      }),
    });
    const promoData = await promoRes.json();
    assert(promoData.notification === null, "Notification engine suppressed promotional coupon per user opt-out preference");

    // 3.9 Delete Notification
    const delRes = await fetch(`${BASE_URL}/notifications/${targetNotif.id}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${customerToken}` },
    });
    const delData = await delRes.json();
    assert(delData.success === true, `Deleted notification #${targetNotif.id}`);

    // ----------------------------------------------------
    // TEST GROUP 4: Core Resilience & Partner Safety
    // ----------------------------------------------------
    console.log("\n--- [4] Core Order Resilience & Partner Isolation ---");

    // 4.1 Order Creation automatically queues notification without blocking
    const orderCreateRes = await fetch(`${BASE_URL}/orders`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        userId: customerUserId,
        vendorId: 1,
        totalAmount: 399.0,
      }),
    });
    const orderCreateData = await orderCreateRes.json();
    assert(orderCreateData.id !== undefined, "Order placed successfully with non-blocking notification trigger");

    // 4.2 Partner login preservation check
    const partnerLoginRes = await fetch(`${BASE_URL}/auth/partner/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ phone: "8888888888" }),
    });
    const partnerLoginData = await partnerLoginRes.json();
    assert(partnerLoginData.success === true && partnerLoginData.user.role === "VENDOR", "Existing partner/vendor login preserved");
  } catch (err) {
    console.error("Test execution error:", err);
    testFailed++;
  } finally {
    server.close();
    console.log("\n========================================================");
    console.log(`📊 TEST RESULTS: ${testPassed} PASSED, ${testFailed} FAILED`);
    console.log("========================================================\n");
    process.exit(testFailed > 0 ? 1 : 0);
  }
}

runTests();
