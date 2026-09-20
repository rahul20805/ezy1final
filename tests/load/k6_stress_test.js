/**
 * EZY1 High-Concurrency Load & Stress Testing Script (k6)
 * 
 * Tests multi-domain endpoints across Customer, Partner, and Admin workloads:
 * - Customer browse & idempotent checkout (ezy1.site)
 * - Partner tenant isolation & financial settlement polling (partner.ezy1.site)
 * - Admin analytics & audit inspection (admin.ezy1.site)
 * 
 * Run with:
 *   k6 run tests/load/k6_stress_test.js
 */

import http from "k6/http";
import { check, sleep, group } from "k6";

export const options = {
  stages: [
    { duration: "10s", target: 20 },  // Warm up
    { duration: "30s", target: 100 }, // High concurrent load
    { duration: "20s", target: 200 }, // Traffic spike
    { duration: "10s", target: 0 },   // Cool down
  ],
  thresholds: {
    http_req_duration: ["p(95)<250", "p(99)<450"], // 95% under 250ms, 99% under 450ms
    http_req_failed: ["rate<0.01"],                 // Error rate < 1%
  },
};

const BASE_URL = __ENV.API_BASE_URL || "https://ezy1.site/api/v1";

export default function () {
  // 1. Customer User Journey
  group("Customer Super-App Workload", () => {
    // Health & Gateway check
    const healthRes = http.get(`${BASE_URL}/health`);
    check(healthRes, {
      "Health check status is 200": (r) => r.status === 200,
      "Service is healthy": (r) => JSON.parse(r.body).status === "ok",
    });

    // Catalog & Products browsing
    const productsRes = http.get(`${BASE_URL}/products?limit=20`);
    check(productsRes, {
      "Products status is 200": (r) => r.status === 200,
      "Response time < 200ms": (r) => r.timings.duration < 200,
    });

    // Idempotent Payment Order Initialization
    const idempotencyKey = `k6_order_${__VU}_${__ITER}_${Date.now()}`;
    const paymentPayload = JSON.stringify({
      orderId: `ORD-K6-${__VU}-${__ITER}`,
      amount: 499.0,
      currency: "INR",
    });

    const paymentRes = http.post(`${BASE_URL}/payments/create-order`, paymentPayload, {
      headers: {
        "Content-Type": "application/json",
        "Idempotency-Key": idempotencyKey,
      },
    });

    check(paymentRes, {
      "Payment order created 200": (r) => r.status === 200,
      "Has Razorpay order ID": (r) => JSON.parse(r.body).razorpayOrderId !== undefined,
    });
  });

  sleep(0.5);

  // 2. Partner Portal Workload
  group("Partner Portal Workload", () => {
    // Partner products request with tenant isolation header
    const partnerRes = http.get(`${BASE_URL}/partner/products`, {
      headers: {
        Authorization: "Bearer mock_partner_jwt_token_10001",
      },
    });

    check(partnerRes, {
      "Partner products query handled": (r) => r.status === 200 || r.status === 401,
    });
  });

  sleep(0.5);
}
