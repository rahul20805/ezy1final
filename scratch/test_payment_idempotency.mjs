// Test: Payment Idempotency, Razorpay Webhook HMAC & Replay Protection
import assert from "node:assert";
import crypto from "crypto";
import { paymentService } from "../src/server/src/paymentService.js";

console.log("Starting Payment Idempotency & Security Tests...");

// TEST 1: Initial Payment Order creation
const idempotencyKey = `idem_${Date.now()}_${Math.random()}`;
const order1 = await paymentService.createPaymentOrder({
  orderId: "ORD-99901",
  amount: 1450.0,
  currency: "INR",
  userId: 42,
  idempotencyKey,
});

assert.strictEqual(order1.success, true);
assert.strictEqual(order1.amount, 145000); // 1450 in paise
assert.strictEqual(order1.currency, "INR");
assert.strictEqual(typeof order1.razorpayOrderId, "string");
console.log("✔ Test 1 Passed: Payment order created successfully with Razorpay order ID.");

// TEST 2: Idempotent Replay (Same idempotencyKey)
const order2 = await paymentService.createPaymentOrder({
  orderId: "ORD-99901",
  amount: 1450.0,
  currency: "INR",
  userId: 42,
  idempotencyKey,
});

assert.strictEqual(order2.success, true);
assert.strictEqual(order2.isIdempotentReplay, true, "Should flag as idempotent replay");
assert.strictEqual(order2.razorpayOrderId, order1.razorpayOrderId, "Order ID must match exactly");
console.log("✔ Test 2 Passed: Repeated request with same idempotency key returned cached transaction without re-creating.");

// TEST 3: Webhook HMAC-SHA256 Verification
const webhookSecret = process.env.RAZORPAY_WEBHOOK_SECRET || "rzp_webhook_secret_2026";
const samplePayload = JSON.stringify({
  event: "payment.captured",
  payload: {
    payment: {
      entity: {
        id: "pay_123456789",
        amount: 145000,
        currency: "INR",
        notes: { orderId: "ORD-99901", partnerId: 1 },
      },
    },
  },
});

const validSignature = crypto
  .createHmac("sha256", webhookSecret)
  .update(samplePayload)
  .digest("hex");

const isSigValid = paymentService.verifyWebhookSignature(samplePayload, validSignature);
assert.strictEqual(isSigValid, true, "Valid HMAC signature must verify successfully");

const isBadSigValid = paymentService.verifyWebhookSignature(samplePayload, "tampered_signature_123");
assert.strictEqual(isBadSigValid, false, "Tampered signature must be rejected");
console.log("✔ Test 3 Passed: Razorpay HMAC-SHA256 signature verification functions securely.");

// TEST 4: Webhook Replay Protection
const webhookResult1 = await paymentService.processWebhookEvent({
  eventId: "evt_test_unique_001",
  eventType: "payment.captured",
  payload: JSON.parse(samplePayload).payload,
  signature: validSignature,
  rawBody: samplePayload,
});
assert.strictEqual(webhookResult1.status, "PROCESSED");

const webhookResult2 = await paymentService.processWebhookEvent({
  eventId: "evt_test_unique_001",
  eventType: "payment.captured",
  payload: JSON.parse(samplePayload).payload,
  signature: validSignature,
  rawBody: samplePayload,
});
assert.strictEqual(webhookResult2.message, "ALREADY_PROCESSED", "Duplicate webhook event must be ignored");
console.log("✔ Test 4 Passed: Webhook replay attack rejected gracefully.");

console.log("All Payment Idempotency & Security Tests Passed Successfully! ✅");
setTimeout(() => process.exit(0), 200);
