import { Request, Response, NextFunction } from "express";
import { partnerService } from "../services/partner.service.js";
import { AuthRequest } from "../types/index.js";
import { sendSuccess, sendError } from "../utils/response.utils.js";

export const partnerController = {
  async login(req: Request, res: Response) {
    try {
      const { partnerUserId, password } = req.body;
      const result = await partnerService.login(partnerUserId, password);
      sendSuccess(res, result);
    } catch (err: any) {
      sendError(res, err.message, err.statusCode || 401);
    }
  },

  async getMe(req: AuthRequest, res: Response) {
    try {
      const partnerId = req.partner?.id;
      if (!partnerId) {
        sendError(res, "Authentication required", 401);
        return;
      }
      const partner = await partnerService.getProfile(partnerId);
      sendSuccess(res, { partner });
    } catch (err: any) {
      sendError(res, err.message, 400);
    }
  },

  async changePassword(req: AuthRequest, res: Response) {
    try {
      const partnerId = req.partner?.id;
      if (!partnerId) {
        sendError(res, "Authentication required", 401);
        return;
      }
      const { currentPassword, newPassword } = req.body;
      const result = await partnerService.changePassword(partnerId, currentPassword, newPassword);
      sendSuccess(res, result);
    } catch (err: any) {
      sendError(res, err.message, 400);
    }
  },

  async forgotPassword(req: Request, res: Response) {
    try {
      const { partnerUserId, email } = req.body;
      const result = await partnerService.forgotPassword(partnerUserId || email);
      sendSuccess(res, result);
    } catch (err: any) {
      sendError(res, err.message, 400);
    }
  },

  async resetPassword(req: Request, res: Response) {
    try {
      const { token, newPassword } = req.body;
      const result = await partnerService.resetPassword(token, newPassword);
      sendSuccess(res, result);
    } catch (err: any) {
      sendError(res, err.message, 400);
    }
  },

  async logout(req: Request, res: Response) {
    sendSuccess(res, { message: "Partner logged out successfully" });
  },

  async getDashboard(req: AuthRequest, res: Response) {
    try {
      const partnerId = req.partner?.id;
      if (!partnerId) {
        sendError(res, "Authentication required", 401);
        return;
      }
      const data = await partnerService.getDashboard(partnerId);
      res.json({
        success: true,
        partner: {
          ...data.partner,
          partnerUserId: req.partner?.partnerUserId || data.partner.partnerUserId
        },
        stats: data.stats,
        recentOrders: data.recentOrders,
        products: data.products
      });
    } catch (err: any) {
      sendError(res, err.message, 400);
    }
  },

  async getProducts(req: AuthRequest, res: Response) {
    try {
      const partnerId = req.partner?.id;
      if (!partnerId) {
        sendError(res, "Authentication required", 401);
        return;
      }
      const products = await partnerService.getProducts(partnerId);
      sendSuccess(res, products);
    } catch (err: any) {
      sendError(res, err.message, 400);
    }
  },

  async createProduct(req: AuthRequest, res: Response) {
    try {
      const partnerId = req.partner?.id;
      if (!partnerId) {
        sendError(res, "Authentication required", 401);
        return;
      }
      const product = await partnerService.createProduct(partnerId, req.body);
      sendSuccess(res, product, "Product created successfully", 201);
    } catch (err: any) {
      sendError(res, err.message, 400);
    }
  },

  async updateProduct(req: AuthRequest, res: Response) {
    try {
      const partnerId = req.partner?.id;
      if (!partnerId) {
        sendError(res, "Authentication required", 401);
        return;
      }
      const productId = Number(req.params.id);
      const product = await partnerService.updateProduct(partnerId, productId, req.body);
      sendSuccess(res, product, "Product updated successfully");
    } catch (err: any) {
      sendError(res, err.message, 400);
    }
  },

  async deleteProduct(req: AuthRequest, res: Response) {
    try {
      const partnerId = req.partner?.id;
      if (!partnerId) {
        sendError(res, "Authentication required", 401);
        return;
      }
      const productId = Number(req.params.id);
      const result = await partnerService.deleteProduct(partnerId, productId);
      sendSuccess(res, result);
    } catch (err: any) {
      sendError(res, err.message, 400);
    }
  }
};
