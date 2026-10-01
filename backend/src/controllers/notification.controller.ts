import { Request, Response } from "express";
import { notificationService } from "../services/notification.service.js";
import { AuthRequest } from "../types/index.js";
import { sendSuccess, sendError } from "../utils/response.utils.js";

export const notificationController = {
  async getNotifications(req: AuthRequest, res: Response) {
    try {
      const userId = req.user?.id || 1;
      const { limit, offset } = req.query;
      const data = await notificationService.getUserNotifications(
        userId,
        limit ? Number(limit) : 50,
        offset ? Number(offset) : 0
      );
      res.json(data);
    } catch (err: any) {
      sendError(res, err.message, 400);
    }
  },

  async markAsRead(req: AuthRequest, res: Response) {
    try {
      const userId = req.user?.id || 1;
      const id = Number(req.params.id);
      const result = await notificationService.markAsRead(id, userId);
      res.json(result);
    } catch (err: any) {
      sendError(res, err.message, 400);
    }
  },

  async markAllAsRead(req: AuthRequest, res: Response) {
    try {
      const userId = req.user?.id || 1;
      const result = await notificationService.markAllAsRead(userId);
      res.json(result);
    } catch (err: any) {
      sendError(res, err.message, 400);
    }
  },

  async deleteNotification(req: AuthRequest, res: Response) {
    try {
      const userId = req.user?.id || 1;
      const id = Number(req.params.id);
      const result = await notificationService.deleteNotification(id, userId);
      res.json(result);
    } catch (err: any) {
      sendError(res, err.message, 400);
    }
  },

  async getPreferences(req: AuthRequest, res: Response) {
    try {
      const userId = req.user?.id || 1;
      const prefs = await notificationService.getUserPreferences(userId);
      res.json(prefs);
    } catch (err: any) {
      sendError(res, err.message, 400);
    }
  },

  async updatePreferences(req: AuthRequest, res: Response) {
    try {
      const userId = req.user?.id || 1;
      const prefs = await notificationService.updateUserPreferences(userId, req.body);
      res.json(prefs);
    } catch (err: any) {
      sendError(res, err.message, 400);
    }
  },

  async subscribeStream(req: AuthRequest, res: Response) {
    const userId = req.user?.id || Number(req.query.userId) || 1;

    res.writeHead(200, {
      "Content-Type": "text/event-stream",
      "Cache-Control": "no-cache",
      Connection: "keep-alive"
    });

    res.write("data: {\"status\":\"connected\"}\n\n");
    notificationService.addSseClient(userId, res);
  },

  async triggerTestEvent(req: AuthRequest, res: Response) {
    try {
      const userId = req.user?.id || 1;
      const { title, message, type } = req.body;
      const result = await notificationService.triggerNotification({
        userId,
        type: type || "TEST",
        title: title || "Test Notification 🔔",
        message: message || "This is a real-time test alert from EZY1 platform."
      });
      sendSuccess(res, result);
    } catch (err: any) {
      sendError(res, err.message, 400);
    }
  }
};
