import { Router } from "express";
import { partnerController } from "../controllers/partner.controller.js";
import { authenticatePartner } from "../middleware/auth.middleware.js";

export const partnerRouter = Router();

// Partner Auth
partnerRouter.post("/auth/login", partnerController.login);
partnerRouter.get("/auth/me", authenticatePartner, partnerController.getMe);
partnerRouter.post("/auth/change-password", authenticatePartner, partnerController.changePassword);
partnerRouter.post("/auth/forgot-password", partnerController.forgotPassword);
partnerRouter.post("/auth/reset-password", partnerController.resetPassword);
partnerRouter.post("/auth/logout", authenticatePartner, partnerController.logout);

// Partner Portal Management
partnerRouter.get("/dashboard", authenticatePartner, partnerController.getDashboard);
partnerRouter.get("/orders", authenticatePartner, (req, res) => {
  res.json([]);
});
partnerRouter.get("/products", authenticatePartner, partnerController.getProducts);
partnerRouter.post("/products", authenticatePartner, partnerController.createProduct);
partnerRouter.put("/products/:id", authenticatePartner, partnerController.updateProduct);
partnerRouter.delete("/products/:id", authenticatePartner, partnerController.deleteProduct);

// Grocery specific endpoints
partnerRouter.get("/grocery/dashboard", authenticatePartner, partnerController.getDashboard);
partnerRouter.get("/grocery/products", authenticatePartner, partnerController.getProducts);
partnerRouter.post("/grocery/products", authenticatePartner, partnerController.createProduct);
partnerRouter.put("/grocery/products/:id", authenticatePartner, partnerController.updateProduct);
partnerRouter.delete("/grocery/products/:id", authenticatePartner, partnerController.deleteProduct);
