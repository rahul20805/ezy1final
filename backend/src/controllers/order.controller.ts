import { Request, Response } from "express";
import { orderService } from "../services/order.service.js";
import { AuthRequest } from "../types/index.js";
import { sendSuccess, sendError } from "../utils/response.utils.js";

export const orderController = {
  async createOrder(req: AuthRequest, res: Response) {
    try {
      const userId = req.user?.id || req.body.userId || 1;
      const order = await orderService.createOrder(userId, req.body);
      sendSuccess(res, order, "Order placed successfully", 201);
    } catch (err: any) {
      sendError(res, err.message, 400);
    }
  },

  async getOrders(req: AuthRequest, res: Response) {
    try {
      const { vendorId, status } = req.query;
      const userId = req.user?.role === "ADMIN" || req.user?.role === "OWNER"
        ? (req.query.userId ? Number(req.query.userId) : undefined)
        : req.user?.id;

      const orders = await orderService.getOrders({
        userId,
        vendorId: vendorId ? Number(vendorId) : undefined,
        status: status ? String(status) : undefined
      });
      res.json(orders);
    } catch (err: any) {
      sendError(res, err.message, 400);
    }
  },

  async getOrderById(req: AuthRequest, res: Response) {
    try {
      const id = Number(req.params.id);
      const userId = req.user?.role === "ADMIN" || req.user?.role === "OWNER" ? undefined : req.user?.id;
      const order = await orderService.getOrderById(id, userId);
      res.json(order);
    } catch (err: any) {
      sendError(res, err.message, 404);
    }
  },

  async updateOrderStatus(req: AuthRequest, res: Response) {
    try {
      const id = Number(req.params.id);
      const { status } = req.body;
      const actorId = req.user?.id || req.partner?.id;
      const order = await orderService.updateOrderStatus(id, status, actorId);
      sendSuccess(res, order, "Order status updated successfully");
    } catch (err: any) {
      sendError(res, err.message, 400);
    }
  }
};
