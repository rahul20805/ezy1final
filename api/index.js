import { getAuthUser, hashPassword, signJwt, verifyPassword } from "./auth.js";
import {
  createOrder,
  createPartnerApplication,
  createProduct,
  createUser,
  createVendor,
  deleteProduct,
  findUserByEmail,
  findUserById,
  findUserByUsername,
  getCategories,
  getOrders,
  getPartnerApplications,
  getProductById,
  getProducts,
  getServices,
  getVendorById,
  getVendors,
  updateOrderStatus,
  updatePartnerApplicationStatus,
  updateProduct,
  updateVendor,
} from "./db.js";

// Helper to set CORS headers
function setCorsHeaders(req, res) {
  const origin = req.headers.origin || "*";
  res.setHeader("Access-Control-Allow-Origin", origin);
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization, X-Requested-With");
  res.setHeader("Access-Control-Allow-Credentials", "true");
}

// Helper to parse JSON body across standard Node and Vercel Serverless
async function parseBody(req) {
  let raw = null;
  try {
    raw = req.body;
  } catch (err) {
    console.warn("Vercel req.body getter caught invalid JSON:", err.message);
    return {};
  }

  if (raw !== undefined && raw !== null) {
    if (typeof raw === "object") return raw;
    if (typeof raw === "string") {
      try {
        return JSON.parse(raw);
      } catch {
        return {};
      }
    }
    if (Buffer.isBuffer(raw)) {
      try {
        return JSON.parse(raw.toString("utf-8"));
      } catch {
        return {};
      }
    }
  }

  if (req.readableEnded) {
    return {};
  }

  return new Promise((resolve) => {
    let data = "";
    req.on("data", (chunk) => {
      data += chunk;
    });
    req.on("end", () => {
      try {
        resolve(data ? JSON.parse(data) : {});
      } catch {
        resolve({});
      }
    });
    req.on("error", () => resolve({}));
  });
}

// Helper for standard JSON response
function sendJson(res, statusCode, payload) {
  res.statusCode = statusCode;
  res.setHeader("Content-Type", "application/json; charset=utf-8");
  res.end(JSON.stringify(payload));
}

export default async function handler(req, res) {
  setCorsHeaders(req, res);

  if (req.method === "OPTIONS") {
    res.statusCode = 204;
    res.end();
    return;
  }

  // Parse URL and path
  const urlObj = new URL(req.url, `http://${req.headers.host || "localhost"}`);
  let pathname = urlObj.pathname;
  
  // Normalize pathname to strip /api prefix if present
  if (pathname.startsWith("/api/")) {
    pathname = pathname.replace("/api", "");
  } else if (pathname === "/api") {
    pathname = "/";
  }

  const query = Object.fromEntries(urlObj.searchParams.entries());
  const method = req.method.toUpperCase();

  try {
    // ----------------------------------------------------
    // 1. HEALTH CHECK & STATUS
    // ----------------------------------------------------
    if (pathname === "/health" && method === "GET") {
      return sendJson(res, 200, {
        status: "ok",
        service: "Ezy1 Production API Engine",
        uptime: process.uptime(),
        timestamp: new Date().toISOString(),
      });
    }

    // ----------------------------------------------------
    // 2. AUTHENTICATION & PARTNER PORTAL ACCESS
    // ----------------------------------------------------
    if ((pathname === "/auth/login" || pathname === "/auth/partner/login") && method === "POST") {
      const body = await parseBody(req);
      const { username, password } = body;

      if (!username || !password) {
        return sendJson(res, 400, {
          success: false,
          error: "Please provide both Partner ID / Username and Password.",
          code: "MISSING_CREDENTIALS",
        });
      }

      const user = findUserByUsername(username) || findUserByEmail(username);
      if (!user) {
        return sendJson(res, 401, {
          success: false,
          error: "Invalid Partner ID or Password.",
          code: "INVALID_CREDENTIALS",
        });
      }

      const isMatch = verifyPassword(password, user.passwordHash);
      if (!isMatch) {
        return sendJson(res, 401, {
          success: false,
          error: "Invalid Partner ID or Password.",
          code: "INVALID_CREDENTIALS",
        });
      }

      if (user.status === "suspended") {
        return sendJson(res, 403, {
          success: false,
          error: "This partner account has been suspended. Please contact platform administration.",
          code: "ACCOUNT_SUSPENDED",
        });
      }

      const vendor = user.vendorId ? getVendorById(user.vendorId) : null;
      const token = signJwt({
        id: user.id,
        username: user.username,
        role: user.role,
        vendorId: user.vendorId || 0,
      });

      return sendJson(res, 200, {
        success: true,
        token,
        user: {
          id: user.id,
          username: user.username,
          name: user.name,
          email: user.email,
          role: user.role,
          vendorId: user.vendorId,
          vendor,
        },
      });
    }

    if (pathname === "/auth/me" && method === "GET") {
      const authUser = getAuthUser(req);
      if (!authUser) {
        return sendJson(res, 401, {
          success: false,
          error: "Authorization required. Please log in.",
          code: "UNAUTHORIZED",
        });
      }

      const user = findUserById(authUser.id);
      if (!user) {
        return sendJson(res, 404, { success: false, error: "User profile not found." });
      }

      const vendor = user.vendorId ? getVendorById(user.vendorId) : null;
      return sendJson(res, 200, {
        success: true,
        user: {
          id: user.id,
          username: user.username,
          name: user.name,
          email: user.email,
          role: user.role,
          vendorId: user.vendorId,
          vendor,
        },
      });
    }

    // ----------------------------------------------------
    // 3. VENDORS / PARTNERS DIRECTORY & EDITING
    // ----------------------------------------------------
    if (pathname === "/vendors" && method === "GET") {
      const vendors = getVendors(query);
      return sendJson(res, 200, vendors);
    }

    const vendorMatch = pathname.match(/^\/vendors\/(\d+)$/);
    if (vendorMatch) {
      const vendorId = Number(vendorMatch[1]);

      if (method === "GET") {
        const vendor = getVendorById(vendorId);
        if (!vendor) {
          return sendJson(res, 404, { success: false, error: "Vendor not found." });
        }
        return sendJson(res, 200, vendor);
      }

      if (method === "PUT") {
        const authUser = getAuthUser(req);
        if (!authUser) {
          return sendJson(res, 401, {
            success: false,
            error: "Authentication required to update vendor profile.",
            code: "UNAUTHORIZED",
          });
        }

        // Authorization check (Anti-IDOR): must be the vendor owner or super admin
        const isOwner = Number(authUser.vendorId) === vendorId;
        const isAdmin = authUser.role === "super_owner" || authUser.role === "ADMIN";

        if (!isOwner && !isAdmin) {
          return sendJson(res, 403, {
            success: false,
            error: "Forbidden: You are not authorized to edit this vendor profile.",
            code: "FORBIDDEN",
          });
        }

        const body = await parseBody(req);
        const updated = updateVendor(vendorId, body);
        if (!updated) {
          return sendJson(res, 404, { success: false, error: "Vendor not found." });
        }

        return sendJson(res, 200, {
          success: true,
          message: "Partner profile updated successfully.",
          vendor: updated,
        });
      }
    }

    // ----------------------------------------------------
    // 4. PRODUCTS MANAGEMENT
    // ----------------------------------------------------
    if (pathname === "/products" && method === "GET") {
      const products = getProducts(query);
      return sendJson(res, 200, products);
    }

    if (pathname === "/products" && method === "POST") {
      const authUser = getAuthUser(req);
      if (!authUser) {
        return sendJson(res, 401, { success: false, error: "Authentication required.", code: "UNAUTHORIZED" });
      }

      const body = await parseBody(req);
      const targetVendorId = Number(body.vendorId || authUser.vendorId);

      // Verify permission
      if (authUser.vendorId !== targetVendorId && authUser.role !== "super_owner") {
        return sendJson(res, 403, { success: false, error: "Unauthorized to add products for this vendor." });
      }

      const product = createProduct({ ...body, vendorId: targetVendorId });
      return sendJson(res, 201, { success: true, product });
    }

    const productMatch = pathname.match(/^\/products\/(\d+)$/);
    if (productMatch) {
      const productId = Number(productMatch[1]);

      if (method === "GET") {
        const product = getProductById(productId);
        if (!product) return sendJson(res, 404, { success: false, error: "Product not found." });
        return sendJson(res, 200, product);
      }

      if (method === "PUT") {
        const authUser = getAuthUser(req);
        if (!authUser) return sendJson(res, 401, { success: false, error: "Authentication required." });

        const existing = getProductById(productId);
        if (!existing) return sendJson(res, 404, { success: false, error: "Product not found." });

        if (existing.vendorId !== authUser.vendorId && authUser.role !== "super_owner") {
          return sendJson(res, 403, { success: false, error: "Unauthorized to edit this product." });
        }

        const body = await parseBody(req);
        const updated = updateProduct(productId, body);
        return sendJson(res, 200, { success: true, product: updated });
      }

      if (method === "DELETE") {
        const authUser = getAuthUser(req);
        if (!authUser) return sendJson(res, 401, { success: false, error: "Authentication required." });

        const existing = getProductById(productId);
        if (!existing) return sendJson(res, 404, { success: false, error: "Product not found." });

        if (existing.vendorId !== authUser.vendorId && authUser.role !== "super_owner") {
          return sendJson(res, 403, { success: false, error: "Unauthorized to delete this product." });
        }

        deleteProduct(productId);
        return sendJson(res, 200, { success: true, message: "Product removed." });
      }
    }

    // ----------------------------------------------------
    // 5. SERVICES & CATEGORIES
    // ----------------------------------------------------
    if (pathname === "/services" && method === "GET") {
      const services = getServices(query);
      return sendJson(res, 200, services);
    }

    if (pathname === "/categories" && method === "GET") {
      const categories = getCategories();
      return sendJson(res, 200, categories);
    }

    // ----------------------------------------------------
    // 6. ORDERS MANAGEMENT
    // ----------------------------------------------------
    if (pathname === "/orders" && method === "GET") {
      const orders = getOrders(query);
      return sendJson(res, 200, orders);
    }

    if (pathname === "/orders" && method === "POST") {
      const body = await parseBody(req);
      const newOrder = createOrder(body);
      return sendJson(res, 201, { success: true, order: newOrder });
    }

    const orderStatusMatch = pathname.match(/^\/orders\/(\d+)\/status$/);
    if (orderStatusMatch && method === "PUT") {
      const orderId = Number(orderStatusMatch[1]);
      const body = await parseBody(req);
      const updated = updateOrderStatus(orderId, body.status);
      if (!updated) return sendJson(res, 404, { success: false, error: "Order not found." });
      return sendJson(res, 200, { success: true, order: updated });
    }

    // ----------------------------------------------------
    // 7. PARTNER ONBOARDING & APPLICATIONS
    // ----------------------------------------------------
    if (pathname === "/partner-applications" && method === "GET") {
      const applications = getPartnerApplications(query);
      return sendJson(res, 200, applications);
    }

    if (pathname === "/partner-applications" && method === "POST") {
      const body = await parseBody(req);
      const businessName = body.businessName || body.business_name;
      const email = body.email;
      const phone = body.phone;
      const ownerName = body.ownerName || body.owner_name || "Applicant";
      const category = body.category || "Grocery";
      const partnerType = body.partnerType || body.partner_type || "shop_owner";
      const address = body.address || "";
      const city = body.city || "";
      const operatingHours = body.operatingHours || body.operating_hours || "09:00 AM - 09:00 PM";
      const deliveryRadius = Number(body.deliveryRadius || body.delivery_radius) || 5;

      if (!businessName || !email || !phone) {
        return sendJson(res, 400, {
          success: false,
          error: "Business Name, Email, and Phone are required for partner onboarding.",
        });
      }

      const application = createPartnerApplication({
        businessName,
        email,
        phone,
        ownerName,
        category,
        partnerType,
        address,
        city,
        operatingHours,
        deliveryRadius,
      });

      return sendJson(res, 201, {
        success: true,
        id: application.id,
        application,
        message: "Application submitted successfully. Our onboarding team is reviewing your profile.",
      });
    }

    const appStatusMatch = pathname.match(/^\/partner-applications\/(\d+)\/status$/);
    if (appStatusMatch && method === "PUT") {
      const appId = Number(appStatusMatch[1]);
      const body = await parseBody(req);
      const updated = updatePartnerApplicationStatus(appId, body.status);
      if (!updated) return sendJson(res, 404, { success: false, error: "Application not found." });
      return sendJson(res, 200, { success: true, application: updated });
    }

    // Route not found
    return sendJson(res, 404, {
      success: false,
      error: `API route '${method} ${pathname}' not found.`,
      code: "ROUTE_NOT_FOUND",
    });
  } catch (error) {
    console.error("Unhandled API Error:", error);
    return sendJson(res, 500, {
      success: false,
      error: "Unable to process your request right now. Please try again.",
      code: "INTERNAL_SERVER_ERROR",
    });
  }
}
