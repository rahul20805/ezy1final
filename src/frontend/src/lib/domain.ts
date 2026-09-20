/**
 * Domain & Subdomain Routing Configuration for EZY1 Ecosystem
 * 
 * Domain Architecture:
 * - ezy1.site          => Customer / User Platform (Super App)
 * - partner.ezy1.site  => Partner Portal (Login, Onboarding, Dashboards)
 * - admin.ezy1.site    => Admin / CMS Portal
 */

export type SubdomainType = "customer" | "partner" | "admin";

export const DOMAINS = {
  main: "https://ezy1.site",
  partner: "https://partner.ezy1.site",
  admin: "https://admin.ezy1.site",
  navaein: "https://navaein.ezy1.site",
} as const;

/**
 * Detects current active subdomain based on window.location.hostname
 * Supports production domains as well as local dev overrides (e.g. ?subdomain=partner, ?subdomain=admin)
 */
export function getSubdomain(): SubdomainType {
  if (typeof window === "undefined") return "customer";

  // Check query parameter override for testing in dev or demo
  const searchParams = new URLSearchParams(window.location.search);
  const override = searchParams.get("subdomain")?.toLowerCase();
  if (override === "partner" || override === "admin" || override === "customer") {
    return override as SubdomainType;
  }

  const hostname = window.location.hostname.toLowerCase();

  // Partner portal: partner.ezy1.site, partner.localhost, partner.127.0.0.1.nip.io
  if (hostname.startsWith("partner.") || hostname === "partner.ezy1.site") {
    return "partner";
  }

  // Admin portal: admin.ezy1.site, admin.localhost, admin.127.0.0.1.nip.io
  if (hostname.startsWith("admin.") || hostname === "admin.ezy1.site") {
    return "admin";
  }

  // Default: customer platform (ezy1.site, www.ezy1.site, localhost)
  return "customer";
}

/**
 * Generates the proper URL for Partner Login / Partner Portal
 * In production: links to https://partner.ezy1.site
 * In local development (localhost / 127.0.0.1): links to relative path or preserves localhost
 */
export function getPartnerPortalUrl(path: string = "/"): string {
  if (typeof window !== "undefined") {
    const hostname = window.location.hostname.toLowerCase();
    // In local development, allow staying within same port if not using subdomains
    if (hostname === "localhost" || hostname === "127.0.0.1") {
      const cleanPath = path === "/" ? "/partner-login" : path;
      return cleanPath;
    }
    // If already on partner.ezy1.site
    if (hostname.startsWith("partner.")) {
      return path;
    }
  }
  const cleanPath = path === "/" ? "" : (path.startsWith("/") ? path : `/${path}`);
  return `${DOMAINS.partner}${cleanPath}`;
}

/**
 * Generates the proper URL for Admin / CMS Portal
 * In production: links to https://admin.ezy1.site
 * In local development: links to relative /admin
 */
export function getAdminPortalUrl(path: string = "/"): string {
  if (typeof window !== "undefined") {
    const hostname = window.location.hostname.toLowerCase();
    if (hostname === "localhost" || hostname === "127.0.0.1") {
      const cleanPath = path === "/" ? "/admin" : path;
      return cleanPath;
    }
    if (hostname.startsWith("admin.")) {
      return path;
    }
  }
  const cleanPath = path === "/" ? "" : (path.startsWith("/") ? path : `/${path}`);
  return `${DOMAINS.admin}${cleanPath}`;
}

/**
 * Generates the proper URL for Customer / User Platform
 * In production: links to https://ezy1.site
 * In local development: links to relative path
 */
export function getCustomerPlatformUrl(path: string = "/"): string {
  if (typeof window !== "undefined") {
    const hostname = window.location.hostname.toLowerCase();
    if (hostname === "localhost" || hostname === "127.0.0.1") {
      return path;
    }
    if (!hostname.startsWith("partner.") && !hostname.startsWith("admin.")) {
      return path;
    }
  }
  const cleanPath = path === "/" ? "" : (path.startsWith("/") ? path : `/${path}`);
  return `${DOMAINS.main}${cleanPath}`;
}
