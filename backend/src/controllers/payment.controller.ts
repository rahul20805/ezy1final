import { Request, Response } from "express";
import { paymentService } from "../services/payment.service.js";
import { AuthRequest } from "../types/index.js";
import { sendSuccess, sendError } from "../utils/response.utils.js";

export const paymentController = {
  async createPaymentOrder(req: AuthRequest, res: Response) {
    try {
      const userId = req.user?.id || req.body.userId || 1;
      const { orderId, amount, currency, idempotencyKey } = req.body;
      const result = await paymentService.createPaymentOrder({
        orderId,
        amount: Number(amount),
        currency,
        userId,
        idempotencyKey
      });
      res.json(result);
    } catch (err: any) {
      sendError(res, err.message, 400);
    }
  },

  async verifyPayment(req: Request, res: Response) {
    try {
      const { razorpay_order_id, razorpay_payment_id, razorpay_signature, orderId } = req.body;
      const result = await paymentService.verifyPayment({
        razorpayOrderId: razorpay_order_id || req.body.razorpayOrderId,
        razorpayPaymentId: razorpay_payment_id || req.body.razorpayPaymentId,
        razorpaySignature: razorpay_signature || req.body.razorpaySignature,
        orderId: orderId ? Number(orderId) : undefined
      });
      res.json(result);
    } catch (err: any) {
      sendError(res, err.message, 400);
    }
  },

  async handleWebhook(req: Request, res: Response) {
    try {
      const signature = req.headers["x-razorpay-signature"] as string | undefined;
      const result = await paymentService.handleWebhook(req.body, signature);
      res.json(result);
    } catch (err: any) {
      sendError(res, err.message, 400);
    }
  }
};
