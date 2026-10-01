import { Router } from "express";
import { authController } from "../controllers/auth.controller.js";
import { authenticateUser } from "../middleware/auth.middleware.js";

export const authRouter = Router();

// Phone OTP
authRouter.post("/send-otp", authController.sendOtp);
authRouter.post("/verify-otp", authController.verifyOtp);

// Email OTP & Verification
authRouter.post("/send-email-otp", authController.sendEmailOtp);
authRouter.post("/verify-email-otp", authController.verifyEmailOtp);

// Forgot Password Recovery Flow
authRouter.post("/forgot-password", authController.forgotPassword);
authRouter.post("/verify-reset-otp", authController.verifyResetOtp);
authRouter.post("/reset-password", authController.resetPassword);

// Registration & Direct Password Login
authRouter.post("/register", authController.register);
authRouter.post("/login", authController.login);
authRouter.get("/check-username", authController.checkUsername);

// Protected Auth Profile & Logout
authRouter.get("/me", authenticateUser, authController.getMe);
authRouter.post("/logout", authController.logout);
