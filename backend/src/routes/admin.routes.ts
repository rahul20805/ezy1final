import { Router } from "express";
import { adminController } from "../controllers/admin.controller.js";
import { authenticateUser } from "../middleware/auth.middleware.js";
import { requireAdmin } from "../middleware/rbac.middleware.js";

export const adminRouter = Router();

// Enforce strict Admin authentication and RBAC for all administration endpoints
adminRouter.use(authenticateUser, requireAdmin);

adminRouter.get("/stats", adminController.getStats);
adminRouter.get("/users", adminController.getUsers);
adminRouter.put("/users/:id/status", adminController.updateUserStatus);
adminRouter.get("/partners", adminController.getPartners);
adminRouter.post("/partners", adminController.createPartner);
adminRouter.put("/partners/:id/status", adminController.updatePartnerStatus);
adminRouter.put("/partners/:id/verify", adminController.verifyPartner);
adminRouter.get("/audit-logs", adminController.getAuditLogs);
adminRouter.get("/marketing/stats", adminController.getMarketingStats);
adminRouter.get("/email/logs", adminController.getEmailLogs);
adminRouter.get("/email/feedbacks", adminController.getEmailFeedbacks);
adminRouter.post("/marketing/broadcast-email", adminController.broadcastEmail);
adminRouter.post("/marketing/broadcast-sms", adminController.broadcastSms);
adminRouter.post("/marketing/test-email", adminController.testEmail);
adminRouter.post("/marketing/test-sms", adminController.testSms);
