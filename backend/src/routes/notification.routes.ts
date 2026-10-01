import { Router } from "express";
import { notificationController } from "../controllers/notification.controller.js";
import { optionalAuth } from "../middleware/auth.middleware.js";

export const notificationRouter = Router();

notificationRouter.get("/", optionalAuth, notificationController.getNotifications);
notificationRouter.get("/preferences", optionalAuth, notificationController.getPreferences);
notificationRouter.put("/preferences", optionalAuth, notificationController.updatePreferences);
notificationRouter.get("/stream", optionalAuth, notificationController.subscribeStream);
notificationRouter.post("/test-event", optionalAuth, notificationController.triggerTestEvent);
notificationRouter.post("/read-all", optionalAuth, notificationController.markAllAsRead);
notificationRouter.post("/:id/read", optionalAuth, notificationController.markAsRead);
notificationRouter.delete("/:id", optionalAuth, notificationController.deleteNotification);
