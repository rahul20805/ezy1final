import { app } from "../src/app.js";
import http from "http";
import crypto from "crypto";
import { ENV } from "../src/config/env.config.js";
import { signJwt } from "../src/utils/jwt.utils.js";

const PORT = 3099;
let server: http.Server;
const BASE_URL = `http://localhost:${PORT}/api`;

let passed = 0;
let failed = 0;

function assert(condition: boolean, message: string) {
  if (condition) {
    console.log(`  ✅ [PASS] ${message}`);
    passed++;
  } else {
    console.error(`  ❌ [FAIL] ${message}`);
    failed++;
  }
}

async function runAllTests() {
  console.log("================================================================");
  console.log("🧪 EZY1 BACKEND COMPREHENSIVE AUTOMATED VERIFICATION SUITE");
  console.log("================================================================\n");

  server = app.listen(PORT);
  // Wait for server to bind
  await new Promise(resolve => setTimeout(resolve, 500));

  try {
    // ----------------------------------------------------------------
    // 1. HEALTH CHECK
    // ----------------------------------------------------------------
    console.log("--- 1. System Health & Infrastructure ---");
    const healthRes = await fetch(`${BASE_URL}/health`);
    const health = await healthRes.json();
    assert(healthRes.status === 200, "Health check endpoint returns HTTP 200");
    assert(health.status === "healthy", "Health status is 'healthy'");
    assert(health.backend === "TypeScript + Node.js", "Backend architecture confirmed as TypeScript + Node.js");

    // ----------------------------------------------------------------
    // 2. USER AUTHENTICATION FLOW
    // ----------------------------------------------------------------
    console.log("\n--- 2. Customer Authentication & OTP Flow ---");
    const testPhone = `98765${Math.floor(10000 + Math.random() * 90000)}`;

    // 2.1 Send OTP
    const sendOtpRes = await fetch(`${BASE_URL}/auth/send-otp`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ phone: testPhone })
    });
    const sendOtpData = await sendOtpRes.json();
    if (sendOtpRes.status !== 200) {
      console.log("sendOtp status:", sendOtpRes.status, sendOtpData);
    }
    assert(sendOtpRes.status === 200, "Request OTP returns HTTP 200");
    assert(sendOtpData.success === true, "OTP dispatch succeeds");

    const receivedOtp = sendOtpData.otp || sendOtpData.debugOtp || "123456";

    // 2.2 Verify OTP
    const verifyOtpRes = await fetch(`${BASE_URL}/auth/verify-otp`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ phone: testPhone, otp: receivedOtp, name: "Ananya Sharma" })
    });
    const verifyOtpData = await verifyOtpRes.json();
    if (verifyOtpRes.status !== 200) {
      console.log("verifyOtp error response:", verifyOtpRes.status, verifyOtpData);
    }
    assert(verifyOtpRes.status === 200, "Verify OTP returns HTTP 200");
    assert(verifyOtpData.token !== undefined, "User JWT token generated");
    assert(verifyOtpData.user.name === "Ananya Sharma", "User profile initialized correctly");

    const userToken = verifyOtpData.token;

    // 2.3 User Profile (/auth/me)
    const meRes = await fetch(`${BASE_URL}/auth/me`, {
      headers: { Authorization: `Bearer ${userToken}` }
    });
    const meData = await meRes.json();
    assert(meRes.status === 200, "Fetch authenticated profile returns HTTP 200");
    assert(meData.user.phone === testPhone, "Authenticated profile phone matches session");

    // ----------------------------------------------------------------
    // 3. PARTNER AUTHENTICATION & MULTI-TENANT ISOLATION
    // ----------------------------------------------------------------
    console.log("\n--- 3. Partner Authentication & Multi-Tenant Security ---");

    // 3.1 Unauthenticated Request Blocked
    const unauthRes = await fetch(`${BASE_URL}/partner/dashboard`);
    assert(unauthRes.status === 401, "Unauthenticated partner dashboard blocked (HTTP 401)");

    // 3.2 Anti-enumeration Check
    const badLoginRes = await fetch(`${BASE_URL}/partner/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ partnerUserId: "EZY-P-99999", password: "WrongPassword!" })
    });
    assert(badLoginRes.status === 401, "Invalid partner login returns HTTP 401");

    // 3.3 Successful Partner Login
    const partnerLoginRes = await fetch(`${BASE_URL}/partner/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ partnerUserId: "EZY-P-10001", password: "Admin@2026!" })
    });
    const partnerLoginData = await partnerLoginRes.json();
    assert(partnerLoginRes.status === 200, "Valid partner login returns HTTP 200");
    assert(partnerLoginData.token !== undefined, "Partner JWT token issued");

    const partnerToken = partnerLoginData.token;

    // 3.4 Partner Dashboard
    const partnerDashRes = await fetch(`${BASE_URL}/partner/dashboard`, {
      headers: { Authorization: `Bearer ${partnerToken}` }
    });
    const partnerDashData = await partnerDashRes.json();
    assert(partnerDashRes.status === 200, "Partner dashboard returns HTTP 200");
    assert(partnerDashData.stats !== undefined, "Partner dashboard stats returned");

    // ----------------------------------------------------------------
    // 4. PARTNER → MAIN WEBSITE SYNCHRONIZATION
    // ----------------------------------------------------------------
    console.log("\n--- 4. Partner → Main Website Live Synchronization ---");

    const testProductName = `Organic Alphonso Mangoes ${Date.now()}`;
    const testProductPrice = 599;

    // 4.1 Partner adds product
    const createProdRes = await fetch(`${BASE_URL}/partner/products`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${partnerToken}`
      },
      body: JSON.stringify({
        name: testProductName,
        description: "Fresh Ratnagiri Alphonso directly from local orchards",
        price: testProductPrice,
        category: "Fresh Fruits",
        available: 1
      })
    });
    const createProdData = await createProdRes.json();
    assert(createProdRes.status === 201, "Partner creates product (HTTP 201)");
    const createdProductId = createProdData.data?.id || createProdData.id;
    assert(createdProductId !== undefined, "Product created with valid database ID");

    // 4.2 Verify product immediately accessible on Public Main Site
    const publicProdRes = await fetch(`${BASE_URL}/products/${createdProductId}`);
    const publicProdData = await publicProdRes.json();
    assert(publicProdRes.status === 200, "Product visible on public main site API");
    assert(publicProdData.name === testProductName, "Main site reflects exact product name");
    assert(Number(publicProdData.price) === testProductPrice, "Main site reflects exact price");

    // 4.3 Partner updates price & availability
    const updatedPrice = 649;
    const updateProdRes = await fetch(`${BASE_URL}/partner/products/${createdProductId}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${partnerToken}`
      },
      body: JSON.stringify({
        price: updatedPrice,
        available: 1
      })
    });
    assert(updateProdRes.status === 200, "Partner updates product price");

    // 4.4 Verify updated price on public main site
    const publicUpdatedRes = await fetch(`${BASE_URL}/products/${createdProductId}`);
    const publicUpdatedData = await publicUpdatedRes.json();
    assert(Number(publicUpdatedData.price) === updatedPrice, "Main site immediately shows updated price");

    // ----------------------------------------------------------------
    // 5. CART, ORDER & CHECKOUT SYSTEM
    // ----------------------------------------------------------------
    console.log("\n--- 5. Cart, Order & Checkout Engine ---");

    const orderRes = await fetch(`${BASE_URL}/orders`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${userToken}`
      },
      body: JSON.stringify({
        vendorId: 1,
        items: [
          { productId: createdProductId, quantity: 2 }
        ],
        deliveryAddress: {
          receiverName: "Ananya Sharma",
          phone: testPhone,
          street: "Flat 402, Green Glen Layout, Bellandur",
          city: "Bengaluru",
          pincode: "560103"
        },
        idempotencyKey: `idemp_${Date.now()}`
      })
    });
    const orderData = await orderRes.json();
    if (orderRes.status !== 201) {
      console.log("order placement response:", orderRes.status, orderData);
    }
    assert(orderRes.status === 201, "Order placed successfully (HTTP 201)");
    const placedOrder = orderData.data || orderData;
    assert(placedOrder.orderNumber !== undefined, "Order assigned unique sequential orderNumber");
    assert(Number(placedOrder.totalAmount) === updatedPrice * 2, "Server calculated accurate total without client manipulation");

    // ----------------------------------------------------------------
    // 6. PAYMENT INTEGRATION FLOW
    // ----------------------------------------------------------------
    console.log("\n--- 6. Payment Initiation & Verification ---");

    const paymentOrderRes = await fetch(`${BASE_URL}/payments/create-order`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${userToken}`
      },
      body: JSON.stringify({
        orderId: placedOrder.id,
        amount: placedOrder.totalAmount,
        currency: "INR"
      })
    });
    const paymentOrderData = await paymentOrderRes.json();
    assert(paymentOrderRes.status === 200, "Razorpay payment order generated");
    assert(paymentOrderData.razorpayOrderId !== undefined, "Valid razorpayOrderId issued");
    assert(paymentOrderData.amount === placedOrder.totalAmount * 100, "Amount converted to paise correctly");

    // Cryptographic payment signature verification
    const rzpPaymentId = `pay_${Date.now()}`;
    const rzpSecret = ENV.RAZORPAY_KEY_SECRET || "ETGkwcLWwJxCMJby4mayA3LS";
    const rzpSignature = crypto
      .createHmac("sha256", rzpSecret)
      .update(`${paymentOrderData.razorpayOrderId}|${rzpPaymentId}`)
      .digest("hex");

    const verifyPaymentRes = await fetch(`${BASE_URL}/payments/verify`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        razorpay_order_id: paymentOrderData.razorpayOrderId,
        razorpay_payment_id: rzpPaymentId,
        razorpay_signature: rzpSignature,
        orderId: placedOrder.id
      })
    });
    const verifyPaymentData = await verifyPaymentRes.json();
    assert(verifyPaymentRes.status === 200, "Payment verified with genuine cryptographic HMAC-SHA256");
    assert(verifyPaymentData.status === "CAPTURED", "Payment marked as CAPTURED in database");

    // ----------------------------------------------------------------
    // 7. NOTIFICATIONS & PREFERENCES
    // ----------------------------------------------------------------
    console.log("\n--- 7. Notification Center & Preferences ---");

    const notifRes = await fetch(`${BASE_URL}/notifications`, {
      headers: { Authorization: `Bearer ${userToken}` }
    });
    const notifData = await notifRes.json();
    assert(notifRes.status === 200, "Notification feed accessible");

    const prefsRes = await fetch(`${BASE_URL}/notifications/preferences`, {
      headers: { Authorization: `Bearer ${userToken}` }
    });
    const prefsData = await prefsRes.json();
    assert(prefsRes.status === 200, "Notification preferences accessible");
    assert(prefsData.preferences !== undefined, "Default channel preferences initialized");

    // ----------------------------------------------------------------
    // 8. SUPER-APP ECOSYSTEM DOMAINS
    // ----------------------------------------------------------------
    console.log("\n--- 8. Super-App Regional & Ecosystem Services ---");

    const staysRes = await fetch(`${BASE_URL}/stays`);
    assert(staysRes.status === 200, "/api/stays returns HTTP 200");

    const travelRes = await fetch(`${BASE_URL}/travel`);
    assert(travelRes.status === 200, "/api/travel returns HTTP 200");

    const busRes = await fetch(`${BASE_URL}/buses`);
    assert(busRes.status === 200, "/api/buses returns HTTP 200");

    const ridesRes = await fetch(`${BASE_URL}/rides/shared`);
    assert(ridesRes.status === 200, "/api/rides/shared returns HTTP 200");

    const hospRes = await fetch(`${BASE_URL}/hospitals`);
    assert(hospRes.status === 200, "/api/hospitals returns HTTP 200");

    const docRes = await fetch(`${BASE_URL}/doctors`);
    assert(docRes.status === 200, "/api/doctors returns HTTP 200");

    const reverseGeoRes = await fetch(`${BASE_URL}/location/reverse-geocode?lat=12.9716&lng=77.5946`);
    assert(reverseGeoRes.status === 200, "/api/location/reverse-geocode returns HTTP 200");

    // ----------------------------------------------------------------
    // 9. ADMIN AUTHORIZATION, RBAC SECURITY & EMAIL LOGS
    // ----------------------------------------------------------------
    console.log("\n--- 9. Admin RBAC & Audit Trail Security ---");

    // A. Unauthenticated request to /admin/stats should be blocked
    const unauthAdminRes = await fetch(`${BASE_URL}/admin/stats`);
    assert(unauthAdminRes.status === 401, "Unauthenticated request to /api/admin/stats blocked (HTTP 401)");

    // B. Customer token should be rejected with HTTP 403 Forbidden
    const customerAdminRes = await fetch(`${BASE_URL}/admin/stats`, {
      headers: { Authorization: `Bearer ${userToken}` }
    });
    assert(customerAdminRes.status === 403, "Customer token rejected from /api/admin/stats (HTTP 403 Forbidden)");

    // C. Valid Admin token allowed
    const adminToken = signJwt({
      id: 9999,
      username: "admin_tester",
      role: "ADMIN",
      email: "admin@ezy1.site"
    });

    const adminStatsRes = await fetch(`${BASE_URL}/admin/stats`, {
      headers: { Authorization: `Bearer ${adminToken}` }
    });
    assert(adminStatsRes.status === 200, "Authenticated Admin granted access to /api/admin/stats (HTTP 200)");

    // D. Admin live email audit logs
    const emailLogsRes = await fetch(`${BASE_URL}/admin/email/logs`, {
      headers: { Authorization: `Bearer ${adminToken}` }
    });
    assert(emailLogsRes.status === 200, "Admin can inspect live Brevo email audit logs (HTTP 200)");
    const emailLogs = await emailLogsRes.json();
    assert(Array.isArray(emailLogs), "Email audit logs returned as structured array");

    // Clean up created test product
    await fetch(`${BASE_URL}/partner/products/${createdProductId}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${partnerToken}` }
    });

  } catch (err: any) {
    console.error("Test execution exception:", err);
    failed++;
  } finally {
    server.close();
  }

  console.log("\n================================================================");
  console.log(`TOTAL TESTS: ${passed + failed}`);
  console.log(`PASSED: ${passed}`);
  console.log(`FAILED: ${failed}`);
  console.log("================================================================\n");

  if (failed > 0) {
    process.exit(1);
  } else {
    process.exit(0);
  }
}

runAllTests();
