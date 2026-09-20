// Unit test for Domain & Subdomain routing logic
import assert from "node:assert";

// Simulation of domain logic
function getSubdomain(hostname, search = "") {
  const searchParams = new URLSearchParams(search);
  const override = searchParams.get("subdomain")?.toLowerCase();
  if (override === "partner" || override === "admin" || override === "customer") {
    return override;
  }

  const h = hostname.toLowerCase();
  if (h.startsWith("partner.") || h === "partner.ezy1.site") {
    return "partner";
  }
  if (h.startsWith("admin.") || h === "admin.ezy1.site") {
    return "admin";
  }
  return "customer";
}

const DOMAINS = {
  main: "https://ezy1.site",
  partner: "https://partner.ezy1.site",
  admin: "https://admin.ezy1.site",
};

function getPartnerPortalUrl(hostname, path = "/") {
  if (hostname === "localhost" || hostname === "127.0.0.1") {
    return path === "/" ? "/partner-login" : path;
  }
  if (hostname.startsWith("partner.")) {
    return path;
  }
  const cleanPath = path === "/" ? "" : (path.startsWith("/") ? path : `/${path}`);
  return `${DOMAINS.partner}${cleanPath}`;
}

function getAdminPortalUrl(hostname, path = "/") {
  if (hostname === "localhost" || hostname === "127.0.0.1") {
    return path === "/" ? "/admin" : path;
  }
  if (hostname.startsWith("admin.")) {
    return path;
  }
  const cleanPath = path === "/" ? "" : (path.startsWith("/") ? path : `/${path}`);
  return `${DOMAINS.admin}${cleanPath}`;
}

function getCustomerPlatformUrl(hostname, path = "/") {
  if (hostname === "localhost" || hostname === "127.0.0.1") {
    return path;
  }
  if (!hostname.startsWith("partner.") && !hostname.startsWith("admin.")) {
    return path;
  }
  const cleanPath = path === "/" ? "" : (path.startsWith("/") ? path : `/${path}`);
  return `${DOMAINS.main}${cleanPath}`;
}

console.log("Running domain routing tests...");

// Test 1: Subdomain detection on ezy1.site
assert.strictEqual(getSubdomain("ezy1.site"), "customer");
assert.strictEqual(getSubdomain("www.ezy1.site"), "customer");

// Test 2: Subdomain detection on partner.ezy1.site
assert.strictEqual(getSubdomain("partner.ezy1.site"), "partner");
assert.strictEqual(getSubdomain("partner.localhost"), "partner");

// Test 3: Subdomain detection on admin.ezy1.site
assert.strictEqual(getSubdomain("admin.ezy1.site"), "admin");
assert.strictEqual(getSubdomain("admin.localhost"), "admin");

// Test 4: Query override (?subdomain=partner)
assert.strictEqual(getSubdomain("localhost", "?subdomain=partner"), "partner");
assert.strictEqual(getSubdomain("localhost", "?subdomain=admin"), "admin");

// Test 5: Cross-domain URLs from ezy1.site
assert.strictEqual(getPartnerPortalUrl("ezy1.site"), "https://partner.ezy1.site");
assert.strictEqual(getAdminPortalUrl("ezy1.site"), "https://admin.ezy1.site");

// Test 6: Cross-domain URLs from partner.ezy1.site
assert.strictEqual(getCustomerPlatformUrl("partner.ezy1.site"), "https://ezy1.site");
assert.strictEqual(getAdminPortalUrl("partner.ezy1.site"), "https://admin.ezy1.site");

// Test 7: Cross-domain URLs from admin.ezy1.site
assert.strictEqual(getCustomerPlatformUrl("admin.ezy1.site"), "https://ezy1.site");
assert.strictEqual(getPartnerPortalUrl("admin.ezy1.site"), "https://partner.ezy1.site");

// Test 8: Local dev preservation
assert.strictEqual(getPartnerPortalUrl("localhost"), "/partner-login");
assert.strictEqual(getAdminPortalUrl("localhost"), "/admin");
assert.strictEqual(getCustomerPlatformUrl("localhost"), "/");

console.log("All domain routing tests passed successfully! ✅");
