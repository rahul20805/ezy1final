/**
 * EZY1 Centralized Provider-Specific Role-Based Access Control (RBAC) & Permission Engine
 */

export const PROVIDER_TYPES = {
  ADMIN: "ADMIN",
  GROCERY: "GROCERY",
  HOSPITAL: "HOSPITAL",
  PHARMACY: "PHARMACY",
  RESTAURANT: "RESTAURANT",
  DELIVERY: "DELIVERY",
  SERVICE_PROVIDER: "SERVICE_PROVIDER",
};

export const PROVIDER_PERMISSIONS = {
  GROCERY: [
    "grocery.dashboard.view",
    "grocery.products.view",
    "grocery.products.create",
    "grocery.products.update",
    "grocery.products.delete",
    "grocery.inventory.view",
    "grocery.inventory.update",
    "grocery.orders.view",
    "grocery.orders.manage",
    "grocery.offers.manage",
    "grocery.analytics.view",
    "grocery.notifications.view",
    "grocery.profile.manage",
  ],
  HOSPITAL: [
    "hospital.dashboard.view",
    "hospital.profile.manage",
    "hospital.departments.manage",
    "hospital.doctors.view",
    "hospital.doctors.create",
    "hospital.doctors.update",
    "hospital.doctors.delete",
    "hospital.beds.view",
    "hospital.beds.manage",
    "hospital.appointments.view",
    "hospital.appointments.manage",
    "hospital.analytics.view",
    "hospital.notifications.view",
    "hospital.settings.manage",
  ],
  PHARMACY: [
    "pharmacy.dashboard.view",
    "pharmacy.medicines.view",
    "pharmacy.medicines.create",
    "pharmacy.medicines.update",
    "pharmacy.medicines.delete",
    "pharmacy.prescriptions.view",
    "pharmacy.inventory.view",
    "pharmacy.inventory.update",
    "pharmacy.orders.view",
    "pharmacy.orders.manage",
    "pharmacy.analytics.view",
    "pharmacy.notifications.view",
    "pharmacy.profile.manage",
  ],
  RESTAURANT: [
    "restaurant.dashboard.view",
    "restaurant.menu.view",
    "restaurant.menu.create",
    "restaurant.menu.update",
    "restaurant.menu.delete",
    "restaurant.orders.view",
    "restaurant.orders.manage",
    "restaurant.tables.view",
    "restaurant.analytics.view",
    "restaurant.notifications.view",
    "restaurant.profile.manage",
  ],
  DELIVERY: [
    "delivery.dashboard.view",
    "delivery.orders.view",
    "delivery.orders.manage",
    "delivery.tracking.view",
    "delivery.earnings.view",
    "delivery.history.view",
    "delivery.notifications.view",
    "delivery.profile.manage",
  ],
  SERVICE_PROVIDER: [
    "services.dashboard.view",
    "services.list.view",
    "services.list.create",
    "services.list.update",
    "services.bookings.view",
    "services.bookings.manage",
    "services.analytics.view",
    "services.notifications.view",
    "services.profile.manage",
  ],
  ADMIN: [
    "*", // Wildcard all access
  ],
};

/**
 * Returns permissions array for a given provider type and role
 */
export function getPermissionsForProvider(providerType, role) {
  if (role === "ADMIN" || role === "super_owner" || role === "SUPER_ADMIN" || providerType === "ADMIN") {
    // Return all permissions across all domains
    const all = new Set();
    Object.values(PROVIDER_PERMISSIONS).forEach((perms) => {
      perms.forEach((p) => all.add(p));
    });
    return Array.from(all);
  }

  const normalized = (providerType || "GROCERY").toUpperCase();
  return PROVIDER_PERMISSIONS[normalized] || PROVIDER_PERMISSIONS.GROCERY;
}

/**
 * Middleware: Enforces that the authenticated partner has one of the allowed provider types
 */
export function requireProviderType(...allowedProviderTypes) {
  return (req, res, next) => {
    if (!req.partner) {
      return res.status(401).json({ error: "Partner authentication required" });
    }

    const role = (req.partner.role || "").toUpperCase();
    if (role === "ADMIN" || role === "SUPER_ADMIN" || role === "SUPER_OWNER") {
      return next(); // Admins have platform-wide access
    }

    const partnerProviderType = (req.partner.providerType || req.partner.partnerType || "GROCERY").toUpperCase();
    const upperAllowed = allowedProviderTypes.map((t) => t.toUpperCase());

    if (!upperAllowed.includes(partnerProviderType)) {
      return res.status(403).json({
        error: `Access Restricted: Your partner account is registered as ${partnerProviderType} and is not authorized to access ${upperAllowed.join("/")} modules.`,
        code: "PROVIDER_TYPE_FORBIDDEN",
        registeredProviderType: partnerProviderType,
        requiredProviderTypes: upperAllowed,
      });
    }

    next();
  };
}

/**
 * Middleware: Enforces that the authenticated partner has a specific permission key
 */
export function requirePermission(permissionKey) {
  return (req, res, next) => {
    if (!req.partner) {
      return res.status(401).json({ error: "Partner authentication required" });
    }

    const role = (req.partner.role || "").toUpperCase();
    if (role === "ADMIN" || role === "SUPER_ADMIN" || role === "SUPER_OWNER") {
      return next();
    }

    const perms = getPermissionsForProvider(req.partner.providerType, req.partner.role);
    if (!perms.includes("*") && !perms.includes(permissionKey)) {
      return res.status(403).json({
        error: `Access Denied: Missing required permission "${permissionKey}".`,
        code: "PERMISSION_DENIED",
        missingPermission: permissionKey,
      });
    }

    next();
  };
}
