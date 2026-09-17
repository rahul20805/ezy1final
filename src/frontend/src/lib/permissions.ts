/**
 * EZY1 Provider Types, Permission Definitions, and RBAC Helpers
 */

export type ProviderType =
  | "GROCERY"
  | "HOSPITAL"
  | "PHARMACY"
  | "RESTAURANT"
  | "DELIVERY"
  | "SERVICE_PROVIDER"
  | "ADMIN"
  | string;

export const PROVIDER_LABELS: Record<string, string> = {
  OWNER: "Platform Master Owner",
  SUPER_OWNER: "Platform Master Owner",
  GROCERY: "Grocery & Retail Partner",
  VENDOR: "Grocery & Retail Partner",
  HOSPITAL: "Hospital & Healthcare Partner",
  PHARMACY: "Pharmacy Partner",
  RESTAURANT: "Restaurant & Food Partner",
  DELIVERY: "Delivery Fleet Partner",
  DRIVER: "Delivery Fleet Partner",
  SERVICE_PROVIDER: "Home & Professional Services Partner",
  ADMIN: "Platform Administrator",
};

export const PROVIDER_DEFAULT_DASHBOARDS: Record<string, string> = {
  OWNER: "/owner",
  SUPER_OWNER: "/owner",
  GROCERY: "/partner-dashboard",
  VENDOR: "/partner-dashboard",
  FRUIT: "/partner-dashboard",
  VEGETABLE: "/partner-dashboard",
  KIRANA: "/partner-dashboard",
  HOSPITAL: "/partner-dashboard",
  CLINIC: "/partner-dashboard",
  HEALTHCARE: "/partner-dashboard",
  PHARMACY: "/partner-dashboard",
  CHEMIST: "/partner-dashboard",
  MEDICAL: "/partner-dashboard",
  RESTAURANT: "/partner-dashboard",
  FOOD: "/partner-dashboard",
  CAFE: "/partner-dashboard",
  DELIVERY: "/partner-dashboard",
  DRIVER: "/partner-dashboard",
  LOGISTICS: "/partner-dashboard",
  SERVICE_PROVIDER: "/partner-dashboard",
  SERVICES: "/partner-dashboard",
  HOME_SERVICES: "/partner-dashboard",
  ADMIN: "/admin",
};

/**
 * Checks if a partner is authorized for a given set of allowed provider types
 */
export function hasProviderAccess(
  partner: { role?: string; providerType?: string; partnerType?: string } | null,
  allowedTypes: string[]
): boolean {
  if (!partner) return false;

  const role = (partner.role || "").toUpperCase();
  if (role === "ADMIN" || role === "SUPER_ADMIN" || role === "SUPER_OWNER" || role === "OWNER") {
    return true; // Admins and Owners have platform-wide access
  }

  const currentType = (partner.providerType || partner.partnerType || "GROCERY").toUpperCase();
  const normalizedAllowed = allowedTypes.map((t) => t.toUpperCase());

  // Handle aliases
  if (normalizedAllowed.includes("GROCERY") && currentType === "VENDOR") return true;
  if (normalizedAllowed.includes("DELIVERY") && currentType === "DRIVER") return true;

  return normalizedAllowed.includes(currentType);
}

/**
 * Returns user-friendly provider label
 */
export function getProviderLabel(providerType?: string): string {
  const normalized = (providerType || "GROCERY").toUpperCase();
  return PROVIDER_LABELS[normalized] || `${normalized} Partner`;
}

/**
 * Returns primary dashboard URL for provider type
 */
export function getProviderDashboardUrl(providerType?: string): string {
  const normalized = (providerType || "GROCERY").toUpperCase();
  return PROVIDER_DEFAULT_DASHBOARDS[normalized] || "/owner";
}

