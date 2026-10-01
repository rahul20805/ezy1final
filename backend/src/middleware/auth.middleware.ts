import { Response, NextFunction } from "express";
import { AuthRequest } from "../types/index.js";
import { verifyJwt } from "../utils/jwt.utils.js";
import { sendError } from "../utils/response.utils.js";

export function authenticateUser(req: AuthRequest, res: Response, next: NextFunction): void {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    sendError(res, "Authorization token required", 401, "UNAUTHORIZED");
    return;
  }

  const token = authHeader.split(" ")[1];
  const decoded = verifyJwt<any>(token);
  if (!decoded || !decoded.id) {
    sendError(res, "Invalid or expired token", 401, "TOKEN_EXPIRED");
    return;
  }

  req.user = {
    id: decoded.id,
    name: decoded.name || "Customer",
    email: decoded.email,
    phone: decoded.phone,
    role: decoded.role || "CUSTOMER",
    walletBal: decoded.walletBal || 0,
    avatar: decoded.avatar
  };

  next();
}

export function authenticatePartner(req: AuthRequest, res: Response, next: NextFunction): void {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    sendError(res, "Authentication required. Please log in.", 401, "UNAUTHORIZED");
    return;
  }

  const token = authHeader.split(" ")[1];
  const decoded = verifyJwt<any>(token);
  if (!decoded || (!decoded.partnerUserId && !decoded.id)) {
    sendError(res, "Invalid or expired partner session. Please log in again.", 401, "TOKEN_EXPIRED");
    return;
  }

  req.partner = {
    id: decoded.id || decoded.partnerId,
    partnerUserId: decoded.partnerUserId,
    businessName: decoded.businessName || "Partner",
    ownerName: decoded.ownerName || decoded.name || "Partner Owner",
    category: decoded.category || "General",
    providerType: decoded.providerType || decoded.partnerType || "GROCERY",
    role: decoded.role || "PARTNER",
    phone: decoded.phone || "",
    email: decoded.email || "",
    city: decoded.city || "",
    status: decoded.status || "ACTIVE",
    isVerified: decoded.isVerified ?? true,
    mustChangePassword: Boolean(decoded.mustChangePassword),
    permissions: decoded.permissions
  };

  next();
}

export function optionalAuth(req: AuthRequest, res: Response, next: NextFunction): void {
  const authHeader = req.headers.authorization;
  if (authHeader && authHeader.startsWith("Bearer ")) {
    const token = authHeader.split(" ")[1];
    const decoded = verifyJwt<any>(token);
    if (decoded && decoded.id) {
      req.user = {
        id: decoded.id,
        name: decoded.name,
        email: decoded.email,
        phone: decoded.phone,
        role: decoded.role || "CUSTOMER"
      };
    }
  }
  next();
}
