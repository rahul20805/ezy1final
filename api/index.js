import crypto from "crypto";
import { getAuthUser, hashPassword, signJwt, verifyJwt, verifyPassword } from "./auth.js";
import { reverseGeocode, searchAddress } from "./location.js";
import { dispatchOtpSms } from "../src/server/src/smsProvider.js";
import {
  bulkUpdateVendors,
  createOrder,
  createPartnerApplication,
  createProduct,
  createService,
  createUser,
  createVendor,
  deleteProduct,
  deleteService,
  findUserByEmail,
  findUserById,
  findUserByPhone,
  findOrCreateUserByPhone,
  findUserByUsername,
  recordOtp,
  getLatestOtp,
  incrementOtpAttempts,
  markOtpVerified,
  getAdminStats,
  getCategories,
  getChangeLogs,
  getChangeLogsByVendorId,
  getOrders,
  getPartnerApplications,
  getProductById,
  getProducts,
  getServiceById,
  getServices,
  getVendorById,
  getVendors,
  recordChangeLog,
  updateOrderStatus,
  updatePartnerApplicationStatus,
  updateProduct,
  updateService,
  updateVendor,
  // Partner & Provider Operations
  findPartnerByUserId,
  getPartnerById,
  updatePartnerPassword,
  recordPartnerLogin,
  getPartners,
  getGroceryDashboard,
  getGroceryProducts,
  createGroceryProduct,
  updateGroceryProduct,
  deleteGroceryProduct,
  getGroceryOrders,
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
    // LOCATION, GEOCODING & REVERSE LOOKUP (Zero Mock)
    // ----------------------------------------------------
    if (pathname === "/location/reverse" && method === "GET") {
      const { lat, lng } = query;
      if (!lat || !lng) {
        return sendJson(res, 400, {
          success: false,
          error: "Latitude and longitude query parameters are required.",
          code: "MISSING_COORDINATES",
        });
      }
      try {
        const location = await reverseGeocode(lat, lng);
        return sendJson(res, 200, { success: true, location });
      } catch (err) {
        console.error("Reverse geocoding error:", err.message);
        return sendJson(res, 500, {
          success: false,
          error: err.message || "Failed to reverse geocode coordinates.",
          code: "GEOCODE_FAILED",
        });
      }
    }

    if (pathname === "/location/search" && method === "GET") {
      const { query: q, q: queryAlias } = query;
      const searchQuery = q || queryAlias || "";
      if (!searchQuery) {
        return sendJson(res, 200, { success: true, results: [] });
      }
      try {
        const results = await searchAddress(searchQuery);
        return sendJson(res, 200, { success: true, results });
      } catch (err) {
        console.error("Address search error:", err.message);
        return sendJson(res, 500, {
          success: false,
          error: err.message || "Failed to search addresses.",
          code: "SEARCH_FAILED",
        });
      }
    }

    // ----------------------------------------------------
    // UNIFIED SEARCH ENGINE (MULTI-ENTITY SEARCH, EXACT MATCH, SORTING)
    // ----------------------------------------------------
    if (pathname === "/search" && method === "GET") {
      const q = (query.q || query.query || "").trim();
      const category = (query.category || "all").toLowerCase();
      const sort = (query.sort || "relevant").toLowerCase();
      const qLower = q.toLowerCase();

      // 1. Products & Groceries
      let productsList = [];
      try {
        const allProducts = getProducts({ limit: 100 });
        const items = Array.isArray(allProducts) ? allProducts : (allProducts.items || []);
        productsList = items.map((p) => ({
          id: p.id,
          name: p.name,
          description: p.description || "",
          price: Number(p.price) || 0,
          mrp: Number(p.mrp) || Number(p.price) || 0,
          category: p.category || "General",
          image: (Array.isArray(p.images) && p.images[0]) ? p.images[0] : (p.image || "https://images.unsplash.com/photo-1542838132-92c53300491e?w=300"),
          rating: Number(p.rating) || 4.5,
          vendorId: p.vendorId || 1,
          inStock: p.inStock !== false,
          unit: p.unit || "1 unit",
          type: "product",
        }));
      } catch (e) {
        console.error("Failed to query products for search", e);
      }

      // 2. Doctors
      let doctorsList = [];
      try {
        const healthcare = getVendors({ limit: 100, category: "Healthcare" });
        const items = Array.isArray(healthcare) ? healthcare : (healthcare.items || []);
        doctorsList = items.map((v) => ({
          id: v.id,
          name: v.doctorName || v.ownerName || v.businessName,
          specialty: v.specialization || (v.departments ? v.departments.split(",")[0].trim() : "General Physician"),
          hospital: v.businessName,
          city: v.city || "Bengaluru",
          fee: Number(v.consultationFee) || 500,
          rating: Number(v.rating) || 4.8,
          experience: v.experienceYears || 10,
          available: v.available !== false,
          phone: v.phone || "+91 98765 43210",
          type: "doctor",
        }));
      } catch (e) {
        console.error("Failed to query doctors for search", e);
      }

      // 3. Hospitals & Emergency Beds
      let hospitalsList = [];
      try {
        const healthcare = getVendors({ limit: 100, category: "Healthcare" });
        const items = Array.isArray(healthcare) ? healthcare : (healthcare.items || []);
        hospitalsList = items.map((h) => ({
          id: h.id,
          name: h.businessName,
          address: h.address || (h.city ? `${h.city}, Karnataka` : "Bengaluru"),
          city: h.city || "Bengaluru",
          totalBeds: h.totalBeds || 120,
          availableBeds: h.availableBeds || { general: 15, icu: 4, oxygen: 8 },
          icuBedsAvailable: h.icuBedsAvailable || 4,
          phone: h.emergencyPhone || h.phone || "+91 80 2345 6789",
          rating: Number(h.rating) || 4.7,
          departments: h.departments ? h.departments.split(",").map((d) => d.trim()) : ["Emergency", "ICU", "Cardiology"],
          type: "hospital",
        }));
      } catch (e) {
        console.error("Failed to query hospitals for search", e);
      }

      // 4. Services & Technicians
      let servicesList = [];
      try {
        const services = getServices({ limit: 100 });
        const items = Array.isArray(services) ? services : (services.items || []);
        servicesList = items.map((s) => ({
          id: s.id,
          name: s.name,
          category: s.category || "Home Services",
          description: s.description || "",
          price: Number(s.price) || 299,
          pricePerHour: Number(s.price) || 299,
          rating: Number(s.rating) || 4.8,
          providerName: s.providerName || "Verified Professional",
          type: "service",
        }));
      } catch (e) {
        console.error("Failed to query services for search", e);
      }

      // 5. Shops & Partners
      let shopsList = [];
      try {
        const vendors = getVendors({ limit: 100 });
        const items = Array.isArray(vendors) ? vendors : (vendors.items || []);
        shopsList = items.map((v) => ({
          id: v.id,
          name: v.businessName,
          category: v.category || "Retail",
          city: v.city || "Bengaluru",
          address: v.address || "",
          rating: Number(v.rating) || 4.6,
          phone: v.phone || "",
          type: "shop",
        }));
      } catch (e) {
        console.error("Failed to query shops for search", e);
      }

      // Exact-match and relevance scorer
      function filterAndScore(items, textGetter) {
        if (!qLower) return items.map((item) => ({ item, score: 1 }));
        const scored = [];
        for (const item of items) {
          const text = textGetter(item).toLowerCase();
          if (text === qLower) {
            scored.push({ item, score: 100 }); // Exact match
          } else if (text.startsWith(qLower)) {
            scored.push({ item, score: 75 }); // Starts with query
          } else if (text.includes(qLower)) {
            scored.push({ item, score: 50 }); // Contains substring
          } else {
            const words = qLower.split(/\s+/).filter(Boolean);
            const matches = words.filter((w) => text.includes(w)).length;
            if (matches > 0) {
              scored.push({ item, score: matches * 10 });
            }
          }
        }
        return scored;
      }

      let scoredProducts = filterAndScore(productsList, (p) => `${p.name} ${p.description} ${p.category}`);
      let scoredDoctors = filterAndScore(doctorsList, (d) => `${d.name} ${d.specialty} ${d.hospital} ${d.city}`);
      let scoredHospitals = filterAndScore(hospitalsList, (h) => `${h.name} ${h.address} ${(h.departments || []).join(" ")}`);
      let scoredServices = filterAndScore(servicesList, (s) => `${s.name} ${s.category} ${s.description}`);
      let scoredShops = filterAndScore(shopsList, (sh) => `${sh.name} ${sh.category} ${sh.city}`);

      function applySort(scoredList, priceGetter, ratingGetter, nameGetter) {
        let list = [...scoredList];
        if (sort === "price_asc") {
          list.sort((a, b) => (priceGetter(a.item) || 0) - (priceGetter(b.item) || 0));
        } else if (sort === "price_desc") {
          list.sort((a, b) => (priceGetter(b.item) || 0) - (priceGetter(a.item) || 0));
        } else if (sort === "rating") {
          list.sort((a, b) => (ratingGetter(b.item) || 0) - (ratingGetter(a.item) || 0));
        } else if (sort === "name_asc") {
          list.sort((a, b) => nameGetter(a.item).localeCompare(nameGetter(b.item)));
        } else {
          // Default: highest relevance score first
          list.sort((a, b) => b.score - a.score);
        }
        return list.map((entry) => entry.item);
      }

      const sortedProducts = applySort(scoredProducts, (p) => p.price, (p) => p.rating, (p) => p.name);
      const sortedDoctors = applySort(scoredDoctors, (d) => d.fee, (d) => d.rating, (d) => d.name);
      const sortedHospitals = applySort(scoredHospitals, () => 0, (h) => h.rating, (h) => h.name);
      const sortedServices = applySort(scoredServices, (s) => s.price, (s) => s.rating, (s) => s.name);
      const sortedShops = applySort(scoredShops, () => 0, (sh) => sh.rating, (sh) => sh.name);

      const totalCount = sortedProducts.length + sortedDoctors.length + sortedHospitals.length + sortedServices.length + sortedShops.length;

      return sendJson(res, 200, {
        success: true,
        query: q,
        sort,
        category,
        total: totalCount,
        results: {
          products: sortedProducts,
          doctors: sortedDoctors,
          hospitals: sortedHospitals,
          services: sortedServices,
          shops: sortedShops,
        },
      });
    }
    // ----------------------------------------------------

    // 2.1 Send Real Phone OTP
    if (pathname === "/auth/send-otp" && method === "POST") {
      const body = await parseBody(req);
      const { phone } = body;

      if (!phone || typeof phone !== "string") {
        return sendJson(res, 400, { success: false, error: "Please enter a valid mobile phone number." });
      }

      const digits = phone.replace(/[^0-9]/g, "");
      const tenDigit = digits.slice(-10);
      if (tenDigit.length !== 10) {
        return sendJson(res, 400, { success: false, error: "Please enter a valid 10-digit mobile number." });
      }

      // Check 30s resend cooldown
      const existing = getLatestOtp(tenDigit);
      if (existing && existing.verified === 0) {
        const timeSince = (Date.now() - existing.lastSentAt) / 1000;
        if (timeSince < 30) {
          const waitRemaining = Math.ceil(30 - timeSince);
          return sendJson(res, 400, {
            success: false,
            error: `Please wait ${waitRemaining}s before requesting a new OTP.`,
            cooldownSeconds: waitRemaining,
          });
        }
      }

      // Generate secure 6-digit numeric OTP
      const isTestEnv = process.env.NODE_ENV === "test" && process.env.ENABLE_TEST_OTP === "true";
      const otp = isTestEnv ? "123456" : String(crypto.randomInt(100000, 999999));
      const otpSecret = process.env.OTP_HMAC_SECRET || process.env.JWT_SECRET || "ezy1_otp_hmac_secret_sha256";
      const otpHash = crypto.createHmac("sha256", otpSecret).update(`${tenDigit}:${otp}`).digest("hex");
      const expiresAt = Date.now() + 5 * 60 * 1000; // 5 minutes

      recordOtp({ phone: tenDigit, otpHash, expiresAt });

      try {
        const smsResult = await dispatchOtpSms({ phone: tenDigit, otp });
        return sendJson(res, 200, {
          success: true,
          message: "OTP sent successfully to your phone number",
          cooldownSeconds: 30,
          expiresInSeconds: 300,
          provider: smsResult.provider,
        });
      } catch (err) {
        console.error("SMS Gateway error:", err);
        return sendJson(res, err.statusCode || 503, {
          success: false,
          error: err.message || "Failed to deliver SMS. Please check mobile number or try again later.",
        });
      }
    }

    // 2.2 Verify Real Phone OTP & Auto-Register / Login Customer
    if (pathname === "/auth/verify-otp" && method === "POST") {
      const body = await parseBody(req);
      const { phone, otp, name } = body;

      if (!phone || !otp) {
        return sendJson(res, 400, { success: false, error: "Phone number and OTP code are required." });
      }

      const digits = phone.replace(/[^0-9]/g, "").slice(-10);
      const latest = getLatestOtp(digits);

      if (!latest || latest.verified !== 0) {
        return sendJson(res, 400, { success: false, error: "No active OTP found. Please request a new OTP." });
      }

      if (Date.now() > latest.expiresAt) {
        return sendJson(res, 400, { success: false, error: "This OTP code has expired. Please request a new code." });
      }

      if ((latest.attempts || 0) >= 5) {
        return sendJson(res, 400, { success: false, error: "Too many failed attempts. Please request a new OTP." });
      }

      const otpSecret = process.env.OTP_HMAC_SECRET || process.env.JWT_SECRET || "ezy1_otp_hmac_secret_sha256";
      const candidateHash = crypto.createHmac("sha256", otpSecret).update(`${digits}:${String(otp).trim()}`).digest("hex");

      const match = crypto.timingSafeEqual(Buffer.from(candidateHash, "hex"), Buffer.from(latest.otpHash, "hex"));

      if (!match) {
        incrementOtpAttempts(latest.id);
        const attemptsLeft = 5 - (latest.attempts + 1);
        return sendJson(res, 400, {
          success: false,
          error: `Incorrect OTP code. ${attemptsLeft > 0 ? `${attemptsLeft} attempt(s) remaining.` : "Please request a new code."}`,
        });
      }

      // Mark OTP consumed
      markOtpVerified(latest.id);

      // Authenticate or create user
      const user = findOrCreateUserByPhone(digits, name);
      const token = signJwt({
        id: user.id,
        phone: user.phone,
        role: user.role || "CUSTOMER",
        vendorId: user.vendorId || 0,
      });

      return sendJson(res, 200, {
        success: true,
        token,
        user: {
          id: user.id,
          name: user.name,
          phone: user.phone,
          email: user.email,
          role: user.role || "CUSTOMER",
          walletBal: user.walletBal || 0,
          avatar: user.avatar || null,
        },
      });
    }

    // ----------------------------------------------------
    // 2.3 PAYMENTS & RAZORPAY INTEGRATION
    // ----------------------------------------------------
    if (pathname === "/payments/create-razorpay-order" && method === "POST") {
      const body = await parseBody(req);
      const { amount, currency = "INR", receipt = `rcpt_${Date.now()}`, notes = {} } = body;
      const keyId = process.env.RAZORPAY_KEY_ID || process.env.VITE_PAYMENT_KEY_ID;
      const keySecret = process.env.RAZORPAY_KEY_SECRET || process.env.VITE_PAYMENT_SECRET;

      if (!keyId || !keySecret) {
        return sendJson(res, 503, {
          success: false,
          error: "Razorpay credentials not configured. Please set RAZORPAY_KEY_ID and RAZORPAY_KEY_SECRET.",
        });
      }

      const auth = Buffer.from(`${keyId}:${keySecret}`).toString("base64");
      const amountInPaise = Math.round(Number(amount) * 100);

      const rzpRes = await fetch("https://api.razorpay.com/v1/orders", {
        method: "POST",
        headers: {
          Authorization: `Basic ${auth}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          amount: amountInPaise,
          currency,
          receipt,
          notes,
        }),
      });

      const rzpData = await rzpRes.json();
      if (!rzpRes.ok) {
        return sendJson(res, rzpRes.status, {
          success: false,
          error: rzpData.error?.description || "Razorpay order creation failed",
        });
      }

      return sendJson(res, 200, {
        success: true,
        orderId: rzpData.id,
        amount: rzpData.amount,
        currency: rzpData.currency,
        keyId,
      });
    }

    if (pathname === "/payments/verify" && method === "POST") {
      const body = await parseBody(req);
      const { razorpay_order_id, razorpay_payment_id, razorpay_signature, orderId } = body;
      const keySecret = process.env.RAZORPAY_KEY_SECRET || process.env.VITE_PAYMENT_SECRET;

      if (!keySecret) {
        return sendJson(res, 503, { success: false, error: "Razorpay secret not configured." });
      }

      const generatedSignature = crypto
        .createHmac("sha256", keySecret)
        .update(`${razorpay_order_id}|${razorpay_payment_id}`)
        .digest("hex");

      if (generatedSignature !== razorpay_signature) {
        return sendJson(res, 400, { success: false, error: "Invalid payment signature verification failed." });
      }

      if (orderId) {
        updateOrderStatus(orderId, "CONFIRMED");
      }

      return sendJson(res, 200, {
        success: true,
        message: "Payment verified successfully",
        paymentId: razorpay_payment_id,
      });
    }

    // ----------------------------------------------------
    // 2.4 AI CONCIERGE ASSISTANT (OPENAI ENGINE)
    // ----------------------------------------------------
    if (pathname === "/ai/assistant" && method === "POST") {
      const body = await parseBody(req);
      const { message, history = [] } = body;
      const apiKey = process.env.OPENAI_API_KEY || process.env.VITE_AI_API_KEY;
      const model = process.env.OPENAI_MODEL || process.env.VITE_AI_MODEL || "gpt-4o";

      if (!apiKey) {
        return sendJson(res, 503, {
          success: false,
          error: "OpenAI API Key not configured. Please set OPENAI_API_KEY in environment settings.",
        });
      }

      if (!message) {
        return sendJson(res, 400, { success: false, error: "Message is required." });
      }

      const systemPrompt = `You are the friendly, intelligent AI concierge for EZY1 (Everything You Need, One Platform - https://ezy1.site).
EZY1 offers:
1. Quick Commerce & Grocery delivery (Sharma Kirana, Fresh Veggies, Fruits, Sweets, Cafe, Paan, Sexual Wellness).
2. Healthcare: Hospitals, Doctor Appointments, Bed Availability, Home Healthcare & Diagnostics.
3. Transport: Share Ride, Parcel Courier, Bus Tickets, Travel Booking & Stays/Hotels.
4. Merchant & Partner Ecosystem: Dedicated portals for Groceries, Restaurants, Hospitals, Pharmacies, and Service Providers.
Be helpful, concise, courteous, and provide accurate navigation instructions to customers.`;

      const messages = [
        { role: "system", content: systemPrompt },
        ...history.slice(-6),
        { role: "user", content: message },
      ];

      const openaiRes = await fetch("https://api.openai.com/v1/chat/completions", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${apiKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model,
          messages,
          temperature: 0.7,
          max_tokens: 500,
        }),
      });

      const openaiData = await openaiRes.json();
      if (!openaiRes.ok) {
        return sendJson(res, openaiRes.status, {
          success: false,
          error: openaiData.error?.message || "OpenAI completion failed",
        });
      }

      const reply = openaiData.choices?.[0]?.message?.content || "How else may I help you on EZY1?";
      return sendJson(res, 200, {
        success: true,
        reply,
        model: openaiData.model,
      });
    }

    // ----------------------------------------------------
    // 2.5 PARTNER PORTAL CREDENTIAL LOGIN
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

    // Partner Audit / Change History
    const vendorChangesMatch = pathname.match(/^\/vendors\/(\d+)\/changes$/);
    if (vendorChangesMatch && method === "GET") {
      const vendorId = Number(vendorChangesMatch[1]);
      const authUser = getAuthUser(req);
      if (!authUser) {
        return sendJson(res, 401, { success: false, error: "Authentication required to view change history.", code: "UNAUTHORIZED" });
      }

      const isOwner = Number(authUser.vendorId) === vendorId;
      const isAdmin = authUser.role === "super_owner" || authUser.role === "SUPER_ADMIN" || authUser.role === "ADMIN";
      if (!isOwner && !isAdmin) {
        return sendJson(res, 403, { success: false, error: "Forbidden: You can only view your own partner change history.", code: "FORBIDDEN" });
      }

      const logs = getChangeLogsByVendorId(vendorId);
      return sendJson(res, 200, { success: true, changes: logs });
    }

    if (pathname === "/admin/changes" && method === "GET") {
      const authUser = getAuthUser(req);
      if (!authUser || (authUser.role !== "super_owner" && authUser.role !== "SUPER_ADMIN" && authUser.role !== "ADMIN")) {
        return sendJson(res, 403, { success: false, error: "Forbidden: Admin access required.", code: "FORBIDDEN" });
      }
      const logs = getChangeLogs(query);
      return sendJson(res, 200, { success: true, changes: logs });
    }

    // Lightweight Dashboard Aggregate Stats (Requirement 10: precomputed, no heavy table dumps)
    if (pathname === "/admin/stats" && method === "GET") {
      const authUser = getAuthUser(req);
      if (!authUser || (authUser.role !== "super_owner" && authUser.role !== "SUPER_ADMIN" && authUser.role !== "ADMIN")) {
        return sendJson(res, 403, { success: false, error: "Forbidden: Admin access required.", code: "FORBIDDEN" });
      }
      const stats = getAdminStats();
      return sendJson(res, 200, { success: true, ...stats });
    }

    // Server-Side Bulk Operations (Requirement 7: batch limit 100, partial failure reporting, audit trail)
    if (pathname === "/admin/vendors/bulk-action" && method === "POST") {
      const authUser = getAuthUser(req);
      if (!authUser || (authUser.role !== "super_owner" && authUser.role !== "SUPER_ADMIN" && authUser.role !== "ADMIN")) {
        return sendJson(res, 403, { success: false, error: "Forbidden: Admin access required.", code: "FORBIDDEN" });
      }
      const body = await parseBody(req);
      const { vendorIds, action } = body;
      if (!vendorIds || !Array.isArray(vendorIds) || !action) {
        return sendJson(res, 400, {
          success: false,
          error: "vendorIds array and action string are required.",
          code: "INVALID_INPUT",
        });
      }
      const result = bulkUpdateVendors(vendorIds, action, authUser);
      return sendJson(res, 200, { success: true, ...result });
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
        const isAdmin = authUser.role === "super_owner" || authUser.role === "SUPER_ADMIN" || authUser.role === "ADMIN";

        if (!isOwner && !isAdmin) {
          return sendJson(res, 403, {
            success: false,
            error: "Forbidden: You are not authorized to edit this vendor profile.",
            code: "FORBIDDEN",
          });
        }

        const body = await parseBody(req);
        const updated = updateVendor(vendorId, body, authUser);
        if (!updated) {
          return sendJson(res, 404, { success: false, error: "Vendor not found." });
        }

        return sendJson(res, 200, {
          success: true,
          message: "Changes saved successfully.",
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

    if (pathname === "/services" && method === "POST") {
      const authUser = getAuthUser(req);
      if (!authUser) return sendJson(res, 401, { success: false, error: "Authentication required.", code: "UNAUTHORIZED" });

      const body = await parseBody(req);
      const targetVendorId = Number(body.vendorId || authUser.vendorId);
      const isOwner = Number(authUser.vendorId) === targetVendorId;
      const isAdmin = authUser.role === "super_owner" || authUser.role === "SUPER_ADMIN" || authUser.role === "ADMIN";

      if (!isOwner && !isAdmin) {
        return sendJson(res, 403, { success: false, error: "Unauthorized to add services for this vendor." });
      }

      const service = createService({ ...body, vendorId: targetVendorId });
      return sendJson(res, 201, { success: true, service });
    }

    const serviceMatch = pathname.match(/^\/services\/(\d+)$/);
    if (serviceMatch) {
      const serviceId = Number(serviceMatch[1]);

      if (method === "GET") {
        const service = getServiceById(serviceId);
        if (!service) return sendJson(res, 404, { success: false, error: "Service not found." });
        return sendJson(res, 200, service);
      }

      if (method === "PUT") {
        const authUser = getAuthUser(req);
        if (!authUser) return sendJson(res, 401, { success: false, error: "Authentication required." });

        const existing = getServiceById(serviceId);
        if (!existing) return sendJson(res, 404, { success: false, error: "Service not found." });

        const isOwner = Number(authUser.vendorId) === Number(existing.vendorId);
        const isAdmin = authUser.role === "super_owner" || authUser.role === "SUPER_ADMIN" || authUser.role === "ADMIN";

        if (!isOwner && !isAdmin) {
          return sendJson(res, 403, { success: false, error: "Unauthorized to edit this service." });
        }

        const body = await parseBody(req);
        const updated = updateService(serviceId, body);
        return sendJson(res, 200, { success: true, service: updated });
      }

      if (method === "DELETE") {
        const authUser = getAuthUser(req);
        if (!authUser) return sendJson(res, 401, { success: false, error: "Authentication required." });

        const existing = getServiceById(serviceId);
        if (!existing) return sendJson(res, 404, { success: false, error: "Service not found." });

        const isOwner = Number(authUser.vendorId) === Number(existing.vendorId);
        const isAdmin = authUser.role === "super_owner" || authUser.role === "SUPER_ADMIN" || authUser.role === "ADMIN";

        if (!isOwner && !isAdmin) {
          return sendJson(res, 403, { success: false, error: "Unauthorized to delete this service." });
        }

        deleteService(serviceId);
        return sendJson(res, 200, { success: true, message: "Service removed successfully." });
      }
    }

    // Public Directory Endpoints (Searchable, Filterable, Paginated)
    if (pathname === "/hospitals" && method === "GET") {
      const allHospitals = getVendors({ ...query, category: "Healthcare" });
      return sendJson(res, 200, allHospitals);
    }

    if (pathname === "/doctors" && method === "GET") {
      const healthcare = getVendors({ ...query, category: "Healthcare" });
      const items = Array.isArray(healthcare) ? healthcare : (healthcare.items || []);
      const doctorsList = items.map((v) => ({
        id: v.id,
        name: v.doctorName || v.ownerName,
        specialty: v.specialization || (v.departments ? v.departments.split(",")[0].trim() : "General Physician"),
        hospital: v.businessName,
        city: v.city,
        rating: v.rating,
        experience: v.experienceYears || 10,
        fee: v.consultationFee || 400,
        available: v.available !== false,
        phone: v.phone,
        timings: v.timings || v.openingHours,
        totalBeds: v.totalBeds,
        availableBeds: v.availableBeds,
        icuBedsAvailable: v.icuBedsAvailable,
        emergencyPhone: v.emergencyPhone,
        hasEmergency24x7: v.hasEmergency24x7,
      }));
      if (!Array.isArray(healthcare) && healthcare.pagination) {
        return sendJson(res, 200, { items: doctorsList, pagination: healthcare.pagination });
      }
      return sendJson(res, 200, doctorsList);
    }

    if (pathname === "/transport" && method === "GET") {
      const transport = getVendors({ ...query, category: "Transport" });
      return sendJson(res, 200, transport);
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

    // ----------------------------------------------------
    // 8. PARTNER AUTHENTICATION & SESSIONS
    // ----------------------------------------------------
    if ((pathname === "/partner/auth/login" || pathname === "/auth/partner/login") && method === "POST") {
      const body = await parseBody(req);
      const identifier = body.partnerUserId || body.username || body.userId || body.email || body.phone;
      const password = body.password;

      if (!identifier || !password) {
        return sendJson(res, 400, {
          success: false,
          error: "Partner ID / Username and password are required.",
          code: "MISSING_CREDENTIALS",
        });
      }

      const partner = findPartnerByUserId(identifier);
      if (!partner) {
        return sendJson(res, 401, {
          success: false,
          error: "Invalid Partner ID or password.",
          code: "INVALID_CREDENTIALS",
        });
      }

      const isPasswordValid =
        verifyPassword(password, partner.passwordHash) ||
        (partner.plainFallback && partner.plainFallback === password);

      if (!isPasswordValid) {
        return sendJson(res, 401, {
          success: false,
          error: "Invalid Partner ID or password.",
          code: "INVALID_CREDENTIALS",
        });
      }

      if (partner.status === "SUSPENDED" || partner.status === "INACTIVE") {
        return sendJson(res, 403, {
          success: false,
          error: "Account is suspended or inactive. Please contact support.",
          code: "ACCOUNT_DISABLED",
        });
      }

      recordPartnerLogin(partner.id);

      const token = signJwt({
        id: partner.id,
        partnerUserId: partner.partnerUserId,
        role: partner.role,
        providerType: partner.providerType || partner.partnerType,
        partnerType: partner.partnerType || partner.providerType,
        vendorId: partner.vendorId,
        name: partner.name,
        email: partner.email,
      });

      const { passwordHash, plainFallback, ...safePartner } = partner;
      return sendJson(res, 200, {
        success: true,
        token,
        partner: safePartner,
      });
    }

    if ((pathname === "/partner/auth/me" || pathname === "/auth/partner/me") && method === "GET") {
      const authUser = getAuthUser(req);
      if (!authUser) {
        return sendJson(res, 401, {
          success: false,
          error: "Authentication required.",
          code: "UNAUTHORIZED",
        });
      }

      const partner = getPartnerById(authUser.id) || findPartnerByUserId(authUser.partnerUserId);
      if (!partner) {
        return sendJson(res, 404, {
          success: false,
          error: "Partner profile not found.",
          code: "PARTNER_NOT_FOUND",
        });
      }

      const { passwordHash, plainFallback, ...safePartner } = partner;
      return sendJson(res, 200, {
        success: true,
        partner: safePartner,
      });
    }

    if (pathname === "/partner/auth/change-password" && method === "POST") {
      const authUser = getAuthUser(req);
      if (!authUser) {
        return sendJson(res, 401, { success: false, error: "Authentication required." });
      }

      const body = await parseBody(req);
      const { currentPassword, newPassword } = body;

      if (!currentPassword || !newPassword) {
        return sendJson(res, 400, { success: false, error: "Current and new password are required." });
      }

      if (newPassword.length < 6) {
        return sendJson(res, 400, { success: false, error: "New password must be at least 6 characters long." });
      }

      const partner = getPartnerById(authUser.id);
      if (!partner) {
        return sendJson(res, 404, { success: false, error: "Partner not found." });
      }

      const isCurrentValid =
        verifyPassword(currentPassword, partner.passwordHash) ||
        (partner.plainFallback && partner.plainFallback === currentPassword);

      if (!isCurrentValid) {
        return sendJson(res, 400, { success: false, error: "Current password does not match." });
      }

      const newHash = hashPassword(newPassword);
      updatePartnerPassword(partner.id, newHash);

      return sendJson(res, 200, {
        success: true,
        message: "Password updated successfully.",
      });
    }

    if (pathname === "/partner/auth/forgot-password" && method === "POST") {
      const body = await parseBody(req);
      const identifier = body.identifier || body.email || body.phone || body.partnerUserId;
      const partner = findPartnerByUserId(identifier);
      
      const resetToken = partner ? signJwt({ id: partner.id, purpose: "reset_password" }, 3600) : null;
      return sendJson(res, 200, {
        success: true,
        message: "If an account exists, a reset instruction or token has been generated.",
        resetToken: resetToken || undefined,
      });
    }

    if (pathname === "/partner/auth/reset-password" && method === "POST") {
      const body = await parseBody(req);
      const { token, newPassword } = body;

      if (!token || !newPassword) {
        return sendJson(res, 400, { success: false, error: "Reset token and new password are required." });
      }

      const decoded = verifyJwt(token);
      if (!decoded || !decoded.id) {
        return sendJson(res, 400, { success: false, error: "Invalid or expired reset token." });
      }

      const newHash = hashPassword(newPassword);
      const updated = updatePartnerPassword(decoded.id, newHash);
      if (!updated) {
        return sendJson(res, 404, { success: false, error: "Partner not found." });
      }

      return sendJson(res, 200, {
        success: true,
        message: "Password reset successfully. You can now log in.",
      });
    }

    if (pathname === "/partner/auth/logout" && method === "POST") {
      return sendJson(res, 200, {
        success: true,
        message: "Logged out successfully.",
      });
    }

    if (pathname === "/partners" && method === "GET") {
      return sendJson(res, 200, {
        success: true,
        partners: getPartners(),
      });
    }

    // ----------------------------------------------------
    // 9. GROCERY & PROVIDER DASHBOARD API
    // ----------------------------------------------------
    if (pathname === "/grocery/dashboard" && method === "GET") {
      const authUser = getAuthUser(req);
      const partnerId = authUser?.id || 1;
      const dashboard = getGroceryDashboard(partnerId);
      return sendJson(res, 200, dashboard);
    }

    if (pathname === "/grocery/products" && method === "GET") {
      const authUser = getAuthUser(req);
      const partnerId = authUser?.id || 1;
      const products = getGroceryProducts(partnerId);
      return sendJson(res, 200, products);
    }

    if (pathname === "/grocery/products" && method === "POST") {
      const authUser = getAuthUser(req);
      const partnerId = authUser?.id || 1;
      const body = await parseBody(req);
      const product = createGroceryProduct(partnerId, body);
      return sendJson(res, 201, product);
    }

    const groceryProductMatch = pathname.match(/^\/grocery\/products\/(\d+)$/);
    if (groceryProductMatch && method === "PUT") {
      const prodId = Number(groceryProductMatch[1]);
      const authUser = getAuthUser(req);
      const partnerId = authUser?.id || 1;
      const body = await parseBody(req);
      const updated = updateGroceryProduct(prodId, partnerId, body);
      if (!updated) return sendJson(res, 404, { success: false, error: "Product not found." });
      return sendJson(res, 200, updated);
    }

    if (groceryProductMatch && method === "DELETE") {
      const prodId = Number(groceryProductMatch[1]);
      const authUser = getAuthUser(req);
      const partnerId = authUser?.id || 1;
      const deleted = deleteGroceryProduct(prodId, partnerId);
      if (!deleted) return sendJson(res, 404, { success: false, error: "Product not found." });
      return sendJson(res, 200, { success: true, message: "Product deleted successfully." });
    }

    if (pathname === "/grocery/orders" && method === "GET") {
      const authUser = getAuthUser(req);
      const partnerId = authUser?.id || 1;
      const orders = getGroceryOrders(partnerId);
      return sendJson(res, 200, orders);
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
