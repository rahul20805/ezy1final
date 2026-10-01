import { Response, NextFunction } from "express";
import { AuthRequest } from "../types/index.js";
import { sendError } from "../utils/response.utils.js";

export function requireRole(allowedRoles: string[]) {
  return (req: AuthRequest, res: Response, next: NextFunction): void => {
    const role = (req.user?.role || req.partner?.role || "").toUpperCase();
    const uppercaseAllowed = allowedRoles.map(r => r.toUpperCase());

    // Super Admin and Master Owner have universal bypass
    if (role === "SUPER_ADMIN" || role === "SUPER_OWNER" || role === "OWNER") {
      return next();
    }

    if (!uppercaseAllowed.includes(role)) {
      sendError(res, "Access forbidden: insufficient permissions", 403, "FORBIDDEN");
      return;
    }

    next();
  };
}

export function requireAdmin(req: AuthRequest, res: Response, next: NextFunction): void {
  const role = (req.user?.role || req.partner?.role || "").toUpperCase();
  const pt = (req.partner?.providerType || "").toUpperCase();
  if (role === "ADMIN" || role === "SUPER_ADMIN" || pt === "ADMIN") {
    return next();
  }
  sendError(res, "Administrative authorization required. Access restricted.", 403, "ADMIN_REQUIRED");
}

export function requireOwner(req: AuthRequest, res: Response, next: NextFunction): void {
  const role = (req.user?.role || req.partner?.role || "").toUpperCase();
  const pt = (req.partner?.providerType || "").toUpperCase();
  if (role === "OWNER" || role === "SUPER_OWNER" || pt === "OWNER") {
    return next();
  }
  sendError(res, "Master Platform Owner authorization required. Access restricted.", 403, "OWNER_REQUIRED");
}

export function requirePartnerType(allowedTypes: string[]) {
  return (req: AuthRequest, res: Response, next: NextFunction): void => {
    if (!req.partner) {
      sendError(res, "Partner authentication required", 401, "UNAUTHORIZED");
      return;
    }

    const role = (req.partner.role || "").toUpperCase();
    if (role === "SUPER_ADMIN" || role === "SUPER_OWNER" || role === "OWNER") {
      return next();
    }

    const pt = (req.partner.providerType || "").toUpperCase();
    const uppercaseAllowed = allowedTypes.map(t => t.toUpperCase());

    // Check vertical aliases
    if (
      uppercaseAllowed.includes("GROCERY") &&
      (pt === "VENDOR" || pt === "KIRANA" || pt === "FRUIT" || pt === "VEGETABLE")
    ) {
      return next();
    }
    if (
      uppercaseAllowed.includes("DELIVERY") &&
      (pt === "DRIVER" || pt === "LOGISTICS")
    ) {
      return next();
    }
    if (
      uppercaseAllowed.includes("RESTAURANT") &&
      (pt === "FOOD" || pt === "CAFE")
    ) {
      return next();
    }
    if (
      uppercaseAllowed.includes("PHARMACY") &&
      (pt === "CHEMIST" || pt === "MEDICAL")
    ) {
      return next();
    }
    if (
      uppercaseAllowed.includes("HOSPITAL") &&
      (pt === "CLINIC" || pt === "HEALTHCARE")
    ) {
      return next();
    }
    if (
      uppercaseAllowed.includes("SERVICE_PROVIDER") &&
      (pt === "SERVICES" || pt === "HOME_SERVICES")
    ) {
      return next();
    }

    if (!uppercaseAllowed.includes(pt)) {
      sendError(
        res,
        `Access forbidden: this endpoint is exclusively for ${allowedTypes.join("/")} partners.`,
        403,
        "FORBIDDEN_PROVIDER_TYPE"
      );
      return;
    }

    next();
  };
}
