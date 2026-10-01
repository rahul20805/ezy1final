import { Request, Response, NextFunction } from "express";
import { authService } from "../services/auth.service.js";
import { AuthRequest } from "../types/index.js";
import { sendSuccess, sendError } from "../utils/response.utils.js";

export const authController = {
  async sendOtp(req: Request, res: Response, next: NextFunction) {
    try {
      const { phone } = req.body;
      const result = await authService.sendOtp(phone);
      sendSuccess(res, result);
    } catch (err: any) {
      sendError(res, err.message, 400);
    }
  },

  async verifyOtp(req: Request, res: Response, next: NextFunction) {
    try {
      const { phone, otp, name } = req.body;
      const result = await authService.verifyOtp(phone, otp, name);
      sendSuccess(res, result);
    } catch (err: any) {
      sendError(res, err.message, 400);
    }
  },

  async register(req: Request, res: Response, next: NextFunction) {
    try {
      const { name, username, password, phone, email } = req.body;
      const result = await authService.registerUser(name, username, password, phone, email);
      sendSuccess(res, result, "Account registered successfully", 201);
    } catch (err: any) {
      sendError(res, err.message, 400);
    }
  },

  async login(req: Request, res: Response, next: NextFunction) {
    try {
      const { username, password } = req.body;
      const result = await authService.loginWithPassword(username, password);
      sendSuccess(res, result);
    } catch (err: any) {
      sendError(res, err.message, 400);
    }
  },

  async checkUsername(req: Request, res: Response, next: NextFunction) {
    try {
      const username = String(req.query.username || "");
      const result = await authService.checkUsername(username);
      sendSuccess(res, result);
    } catch (err: any) {
      sendError(res, err.message, 400);
    }
  },

  async getMe(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      if (!req.user?.id) {
        sendError(res, "Unauthorized", 401);
        return;
      }
      const user = await authService.getUserById(req.user.id);
      sendSuccess(res, { user });
    } catch (err: any) {
      sendError(res, err.message, 400);
    }
  },

  async logout(req: Request, res: Response) {
    sendSuccess(res, { message: "Logged out successfully" });
  }
};
