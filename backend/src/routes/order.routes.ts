import { Router } from "express";
import { orderController } from "../controllers/order.controller.js";
import { optionalAuth } from "../middleware/auth.middleware.js";

export const orderRouter = Router();

orderRouter.post("/orders", optionalAuth, orderController.createOrder);
orderRouter.get("/orders", optionalAuth, orderController.getOrders);
orderRouter.get("/orders/:id", optionalAuth, orderController.getOrderById);
orderRouter.put("/orders/:id/status", optionalAuth, orderController.updateOrderStatus);
