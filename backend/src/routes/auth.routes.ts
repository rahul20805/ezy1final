import { Router } from "express";
import { authController } from "../controllers/auth.controller.js";
import { authenticateUser } from "../middleware/auth.middleware.js";

export const authRouter = Router();

authRouter.post("/send-otp", authController.sendOtp);
authRouter.post("/verify-otp", authController.verifyOtp);
authRouter.post("/register", authController.register);
authRouter.post("/login", authController.login);
authRouter.get("/check-username", authController.checkUsername);
authRouter.get("/me", authenticateUser, authController.getMe);
authRouter.post("/logout", authController.logout);
