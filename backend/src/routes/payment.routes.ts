import { Router } from "express";
import { paymentController } from "../controllers/payment.controller.js";
import { optionalAuth } from "../middleware/auth.middleware.js";

export const paymentRouter = Router();

paymentRouter.post("/create-order", optionalAuth, paymentController.createPaymentOrder);
paymentRouter.post("/verify", paymentController.verifyPayment);
paymentRouter.post("/webhook", paymentController.handleWebhook);
