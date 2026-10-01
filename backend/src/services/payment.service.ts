import crypto from "crypto";
import { queryOne, execute } from "../repositories/database.adapter.js";
import { ENV } from "../config/env.config.js";
import { generateRandomOrderNumber } from "../utils/crypto.utils.js";
import { emailService } from "./email.service.js";
import { notificationService } from "./notification.service.js";

const processedWebhooks = new Set<string>();

export const paymentService = {
  async createPaymentOrder(options: {
    orderId?: number;
    amount: number;
    currency?: string;
    userId: number;
    idempotencyKey?: string;
  }) {
    const { orderId, amount, currency = "INR", userId, idempotencyKey } = options;
    if (!amount || amount <= 0) {
      throw new Error("Invalid payment amount");
    }

    if (idempotencyKey) {
      const existing = await queryOne(
        "SELECT * FROM payments WHERE idempotencyKey = ?",
        [idempotencyKey]
      );
      if (existing) {
        return {
          success: true,
          isIdempotentReplay: true,
          razorpayOrderId: existing.gatewayOrderId,
          amount: Math.round(existing.amount * 100),
          currency: existing.currency,
          keyId: ENV.RAZORPAY_KEY_ID
        };
      }
    }

    const amountInPaise = Math.round(amount * 100);
    const razorpayOrderId = `order_${Date.now()}_${Math.random().toString(36).substring(2, 8)}`;
    const paymentNumber = generateRandomOrderNumber("PAY");

    await execute(
      "INSERT INTO payments (paymentNumber, orderId, userId, amount, currency, gateway, gatewayOrderId, status, idempotencyKey) VALUES (?, ?, ?, ?, ?, 'RAZORPAY', ?, 'CREATED', ?)",
      [paymentNumber, orderId || null, userId, amount, currency, razorpayOrderId, idempotencyKey || null]
    );

    return {
      success: true,
      razorpayOrderId,
      amount: amountInPaise,
      currency,
      keyId: ENV.RAZORPAY_KEY_ID,
      receipt: `RCPT-${orderId || Date.now()}`,
      paymentNumber
    };
  },

  async verifyPayment(options: {
    razorpayOrderId: string;
    razorpayPaymentId: string;
    razorpaySignature: string;
    orderId?: number;
  }) {
    const { razorpayOrderId, razorpayPaymentId, razorpaySignature, orderId } = options;

    if (!razorpayOrderId || !razorpayPaymentId) {
      throw new Error("Missing payment verification parameters");
    }

    // Verify cryptographic signature if secret is configured
    if (ENV.RAZORPAY_KEY_SECRET && razorpaySignature) {
      const expectedSignature = crypto
        .createHmac("sha256", ENV.RAZORPAY_KEY_SECRET)
        .update(`${razorpayOrderId}|${razorpayPaymentId}`)
        .digest("hex");

      if (expectedSignature !== razorpaySignature) {
        // Also allow demo signatures in dev
        if (ENV.NODE_ENV === "production") {
          throw new Error("Cryptographic payment signature mismatch");
        }
      }
    }

    // Update payment record in database
    await execute(
      "UPDATE payments SET gatewayPaymentId = ?, status = 'CAPTURED' WHERE gatewayOrderId = ?",
      [razorpayPaymentId, razorpayOrderId]
    );

    // If linked to an order, confirm order status and trigger notifications
    if (orderId) {
      await execute("UPDATE orders SET status = 'confirmed' WHERE id = ?", [orderId]);
      try {
        const order = await queryOne("SELECT * FROM orders WHERE id = ?", [orderId]);
        if (order) {
          let parsed: any = {};
          try { if (order.itemsJson) parsed = JSON.parse(order.itemsJson); } catch {}
          const userRow = await queryOne("SELECT name, email FROM users WHERE id = ?", [order.userId]);
          const targetEmail = parsed.customerEmail || userRow?.email;
          const targetName = parsed.customerName || userRow?.name || "Customer";

          if (targetEmail && targetEmail.includes("@")) {
            emailService.sendOrderConfirmationEmail({
              order: { ...order, ...parsed, paymentMethod: "Razorpay / UPI (Verified)" },
              customerEmail: targetEmail,
              customerName: targetName
            }).catch(err => console.warn("[PAYMENT RECEIPT EMAIL WARN]", err));
          }

          notificationService.triggerNotification({
            userId: order.userId,
            type: "PAYMENT_SUCCESS",
            category: "PAYMENTS",
            title: "Payment Verified",
            message: `Your payment for Order #${order.id} was confirmed successfully.`,
            actionUrl: "/my-orders",
            data: { orderId: order.id, paymentId: razorpayPaymentId }
          }).catch(() => {});
        }
      } catch (postPayErr) {
        console.warn("[POST-PAYMENT NOTIF WARN]", postPayErr);
      }
    }

    return {
      success: true,
      verified: true,
      status: "CAPTURED",
      message: "Payment successfully verified and order confirmed."
    };
  },

  async handleWebhook(body: any, signature?: string) {
    if (signature && ENV.RAZORPAY_WEBHOOK_SECRET) {
      const expected = crypto
        .createHmac("sha256", ENV.RAZORPAY_WEBHOOK_SECRET)
        .update(typeof body === "string" ? body : JSON.stringify(body))
        .digest("hex");

      if (expected !== signature) {
        throw new Error("Invalid webhook signature");
      }
    }

    const eventId = body?.event_id || body?.id;
    if (eventId && processedWebhooks.has(eventId)) {
      return { success: true, message: "Duplicate webhook event ignored" };
    }
    if (eventId) processedWebhooks.add(eventId);

    const event = body?.event;
    if (event === "payment.captured") {
      const paymentEntity = body.payload?.payment?.entity;
      const orderId = paymentEntity?.order_id;
      if (orderId) {
        await execute(
          "UPDATE payments SET status = 'CAPTURED', gatewayPaymentId = ? WHERE gatewayOrderId = ?",
          [paymentEntity.id, orderId]
        );
      }
    }

    return { success: true, received: true };
  }
};
