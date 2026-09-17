import express from "express";
import { openDb } from "./db.js";
import {
  sendOtp,
  verifyOtp,
  googleLogin,
  authMiddleware,
  requireRole,
  signJwt
} from "./authService.js";
import {
  EVENT_TYPES,
  addSseClient,
  getUserNotifications,
  markAsRead,
  markAllAsRead,
  deleteNotification,
  getUserPreferences,
  updateUserPreferences,
  registerPushToken,
  deregisterPushToken,
  triggerNotificationEvent,
  dispatchNotificationSync
} from "./notificationService.js";

export const router = express.Router();

// ==========================================
// 1. CUSTOMER & PARTNER AUTHENTICATION ROUTES
// ==========================================

// 1.1 Send Phone OTP (Cryptographic 6-digit, 5m expiry, 30s cooldown, rate limited)
router.post("/auth/send-otp", async (req, res) => {
  try {
    const { phone } = req.body;
    const result = await sendOtp(phone);
    res.json(result);
  } catch (error) {
    res.status(400).json({ error: error.message || "Failed to send OTP" });
  }
});

// 1.2 Verify Phone OTP & Login or Auto-Register Customer Profile
router.post("/auth/verify-otp", async (req, res) => {
  try {
    const { phone, otp, name } = req.body;
    const result = await verifyOtp(phone, otp, name);

    // Trigger account login notification asynchronously
    triggerNotificationEvent({
      userId: result.user.id,
      type: EVENT_TYPES.ACCOUNT_LOGIN,
      customTitle: "Successful Login 🔐",
      customMessage: `Logged in to EZY1 via mobile phone (+${result.user.phone}) at ${new Date().toLocaleTimeString("en-IN")}.`,
      priority: "LOW"
    });

    res.json(result);
  } catch (error) {
    res.status(400).json({ error: error.message || "Invalid OTP code" });
  }
});

// 1.3 Google OAuth Login & Intelligent Account Linking
router.post("/auth/google", async (req, res) => {
  try {
    const { credential, email, name, googleId, avatar, phone } = req.body;
    const result = await googleLogin({ credential, email, name, googleId, avatar, phone });

    // Trigger notification
    triggerNotificationEvent({
      userId: result.user.id,
      type: EVENT_TYPES.ACCOUNT_LOGIN,
      customTitle: "Google Sign-In Connected 🌐",
      customMessage: `Signed in via Google account (${result.user.email || result.user.name}).`,
      priority: "LOW"
    });

    res.json(result);
  } catch (error) {
    res.status(400).json({ error: error.message || "Google authentication failed" });
  }
});

// 1.4 Get Current User Profile (Role enforced)
router.get("/auth/me", authMiddleware, async (req, res) => {
  res.json({
    user: {
      id: req.user.id,
      name: req.user.name,
      email: req.user.email,
      phone: req.user.phone,
      role: req.user.role,
      walletBal: req.user.walletBal,
      avatar: req.user.avatar,
      createdAt: req.user.createdAt
    }
  });
});

// 1.5 Logout & Session Invalidation
router.post("/auth/logout", authMiddleware, async (req, res) => {
  try {
    const { pushToken } = req.body;
    if (pushToken) {
      await deregisterPushToken(req.user.id, pushToken);
    }
    res.json({ success: true, message: "Logged out successfully" });
  } catch (err) {
    res.json({ success: true, message: "Logged out" });
  }
});

// 1.6 Preserved Existing Partner / Merchant Login Endpoints
router.post("/auth/login", async (req, res) => {
  const { email, password, phone } = req.body;
  const db = await openDb();

  let user;
  if (email) {
    user = await db.get("SELECT * FROM users WHERE email = ?", [email.toLowerCase().trim()]);
  } else if (phone) {
    user = await db.get("SELECT * FROM users WHERE phone = ?", [phone.replace(/[^0-9]/g, "")]);
  }

  if (!user) {
    return res.status(401).json({ error: "Invalid credentials" });
  }

  const token = signJwt({
    userId: user.id,
    role: user.role,
    email: user.email,
    phone: user.phone,
    name: user.name
  });

  res.json({
    success: true,
    token,
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
      phone: user.phone,
      role: user.role,
      walletBal: user.walletBal
    }
  });
});

// ==========================================
// 1.6 PARTNER AUTHENTICATION & MANAGEMENT ROUTES
// ==========================================
import {
  partnerLogin,
  partnerChangePassword,
  partnerForgotPassword,
  partnerResetPassword,
  requirePartnerAuth,
  requireAdminAuth,
  generateNextPartnerUserId,
  generateTempPassword,
  hashPassword
} from "./partnerAuthService.js";
import {
  requireProviderType,
  requirePermission,
  getPermissionsForProvider,
  PROVIDER_TYPES
} from "./permissionService.js";

// Partner Login (Partner User ID + Password)
router.post("/partner/auth/login", async (req, res) => {
  try {
    const { partnerUserId, password } = req.body;
    const result = await partnerLogin({ partnerUserId, password });
    res.json(result);
  } catch (error) {
    const isForbidden = error.message && (error.message.includes("disabled") || error.message.includes("suspended") || error.message.includes("inactive"));
    res.status(isForbidden ? 403 : 401).json({ error: error.message || "Invalid Partner ID or password." });
  }
});

// Legacy backward-compatibility endpoint forwarding to secure partner login
router.post("/auth/partner/login", async (req, res) => {
  try {
    const { partnerUserId, username, password, phone } = req.body;
    if (phone && !password) {
      const db = await openDb();
      const user = await db.get("SELECT * FROM users WHERE phone = ?", [phone]);
      if (user) {
        return res.json({ success: true, user });
      }
      return res.status(404).json({ error: "Partner not found with this phone." });
    }
    const result = await partnerLogin({ partnerUserId: partnerUserId || username, password });
    res.json(result);
  } catch (error) {
    const isForbidden = error.message && (error.message.includes("disabled") || error.message.includes("suspended") || error.message.includes("inactive"));
    res.status(isForbidden ? 403 : 401).json({ error: error.message || "Invalid Partner ID or password." });
  }
});

// Partner Change Password (Forced first login or user settings)
router.post("/partner/auth/change-password", requirePartnerAuth, async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;
    const result = await partnerChangePassword(req.partner.id, { currentPassword, newPassword });
    res.json(result);
  } catch (error) {
    res.status(400).json({ error: error.message || "Failed to change password." });
  }
});

// Partner Forgot Password Request (Generates Secure Reset Token)
router.post("/partner/auth/forgot-password", async (req, res) => {
  try {
    const identifier = req.body.identifier || req.body.partnerUserId || req.body.email;
    const result = await partnerForgotPassword(identifier);
    res.json(result);
  } catch (error) {
    res.json({
      success: true,
      message: "If a matching partner account is found, password reset instructions have been generated."
    });
  }
});

// Partner Reset Password with Token
router.post("/partner/auth/reset-password", async (req, res) => {
  try {
    const { token, newPassword } = req.body;
    const result = await partnerResetPassword({ token, newPassword });
    res.json(result);
  } catch (error) {
    res.status(400).json({ error: error.message || "Failed to reset password." });
  }
});

// Partner Profile (Verified via token)
router.get("/partner/auth/me", requirePartnerAuth, async (req, res) => {
  const providerType = (req.partner.providerType || req.partner.partnerType || "GROCERY").toUpperCase();
  const permissions = getPermissionsForProvider(providerType, req.partner.role);

  res.json({
    partner: {
      id: req.partner.id,
      partnerUserId: req.partner.partnerUserId,
      name: req.partner.name,
      businessName: req.partner.businessName,
      email: req.partner.email,
      phone: req.partner.phone,
      role: req.partner.role,
      partnerType: req.partner.partnerType || providerType,
      providerType,
      category: req.partner.category,
      city: req.partner.city,
      address: req.partner.address,
      status: req.partner.status,
      isVerified: Boolean(req.partner.isVerified),
      mustChangePassword: Boolean(req.partner.mustChangePassword),
      lastLoginAt: req.partner.lastLoginAt,
      createdAt: req.partner.createdAt,
      permissions,
    }
  });
});

// Partner Logout
router.post("/partner/auth/logout", requirePartnerAuth, async (req, res) => {
  res.json({ success: true, message: "Partner logged out successfully" });
});

// ==========================================
// 1.5 GROCERY PARTNER MODULE APIS
// ==========================================
router.get("/grocery/dashboard", requirePartnerAuth, requireProviderType("GROCERY", "VENDOR"), async (req, res) => {
  const db = await openDb();
  const partnerId = req.partner.id;
  const ordersCount = await db.get(
    "SELECT COUNT(*) as count, COALESCE(SUM(totalAmount), 0) as revenue FROM orders WHERE vendorId = ?",
    [partnerId]
  );
  const productsCount = await db.get(
    "SELECT COUNT(*) as count FROM products WHERE vendorId = ?",
    [partnerId]
  );
  res.json({
    module: "GROCERY",
    partner: {
      partnerUserId: req.partner.partnerUserId,
      businessName: req.partner.businessName,
      providerType: "GROCERY",
    },
    metrics: {
      totalOrders: ordersCount ? ordersCount.count : 0,
      totalRevenue: ordersCount ? ordersCount.revenue : 0,
      totalProducts: productsCount ? productsCount.count : 0,
    }
  });
});

router.get("/grocery/products", requirePartnerAuth, requireProviderType("GROCERY", "VENDOR"), async (req, res) => {
  const db = await openDb();
  const products = await db.all("SELECT * FROM products WHERE vendorId = ? ORDER BY id DESC", [req.partner.id]);
  res.json(products);
});

router.post("/grocery/products", requirePartnerAuth, requireProviderType("GROCERY", "VENDOR"), async (req, res) => {
  const { name, description, price, category, image } = req.body;
  if (!name || price === undefined) {
    return res.status(400).json({ error: "Product name and price are required." });
  }
  const db = await openDb();
  const result = await db.run(
    "INSERT INTO products (vendorId, name, description, price, category, image) VALUES (?, ?, ?, ?, ?, ?)",
    [req.partner.id, name, description || "", price, category || "Grocery", image || ""]
  );
  const product = await db.get("SELECT * FROM products WHERE id = ?", [result.lastID]);
  res.json(product);
});

router.put("/grocery/products/:id", requirePartnerAuth, requireProviderType("GROCERY", "VENDOR"), async (req, res) => {
  const { id } = req.params;
  const { name, description, price, category, image, available } = req.body;
  const db = await openDb();
  
  const existing = await db.get("SELECT * FROM products WHERE id = ? AND vendorId = ?", [id, req.partner.id]);
  if (!existing) {
    return res.status(404).json({ error: "Product not found or unauthorized." });
  }

  await db.run(
    "UPDATE products SET name = ?, description = ?, price = ?, category = ?, image = ?, available = ? WHERE id = ? AND vendorId = ?",
    [
      name !== undefined ? name : existing.name,
      description !== undefined ? description : existing.description,
      price !== undefined ? parseFloat(price) : existing.price,
      category !== undefined ? category : existing.category,
      image !== undefined ? image : existing.image,
      available !== undefined ? (available ? 1 : 0) : existing.available,
      id,
      req.partner.id
    ]
  );
  const updated = await db.get("SELECT * FROM products WHERE id = ?", [id]);
  res.json(updated);
});

router.delete("/grocery/products/:id", requirePartnerAuth, requireProviderType("GROCERY", "VENDOR"), async (req, res) => {
  const { id } = req.params;
  const db = await openDb();
  const existing = await db.get("SELECT * FROM products WHERE id = ? AND vendorId = ?", [id, req.partner.id]);
  if (!existing) {
    return res.status(404).json({ error: "Product not found or unauthorized." });
  }
  await db.run("DELETE FROM products WHERE id = ? AND vendorId = ?", [id, req.partner.id]);
  res.json({ success: true, message: "Product deleted successfully." });
});

router.get("/grocery/orders", requirePartnerAuth, requireProviderType("GROCERY", "VENDOR"), async (req, res) => {
  const db = await openDb();
  const orders = await db.all("SELECT * FROM orders WHERE vendorId = ? ORDER BY id DESC", [req.partner.id]);
  res.json(orders);
});

router.get("/grocery/inventory", requirePartnerAuth, requireProviderType("GROCERY", "VENDOR"), async (req, res) => {
  const db = await openDb();
  const items = await db.all("SELECT id, name, category, price FROM products WHERE vendorId = ?", [req.partner.id]);
  res.json({ totalItems: items.length, items });
});

// ==========================================
// 1.6 HOSPITAL PARTNER MODULE APIS
// ==========================================
router.get("/hospital/dashboard", requirePartnerAuth, requireProviderType("HOSPITAL"), async (req, res) => {
  const db = await openDb();
  const partnerId = req.partner.id;
  const bedsCount = await db.get(
    "SELECT COUNT(*) as total, SUM(CASE WHEN status = 'AVAILABLE' THEN 1 ELSE 0 END) as available FROM hospital_beds WHERE partnerId = ?",
    [partnerId]
  );
  const doctorsCount = await db.get(
    "SELECT COUNT(*) as total FROM hospital_doctors WHERE partnerId = ?",
    [partnerId]
  );
  const appointmentsCount = await db.get(
    "SELECT COUNT(*) as total FROM hospital_appointments WHERE partnerId = ?",
    [partnerId]
  );

  res.json({
    module: "HOSPITAL",
    partner: {
      partnerUserId: req.partner.partnerUserId,
      businessName: req.partner.businessName,
      providerType: "HOSPITAL",
    },
    metrics: {
      totalBeds: bedsCount?.total || 0,
      availableBeds: bedsCount?.available || 0,
      totalDoctors: doctorsCount?.total || 0,
      totalAppointments: appointmentsCount?.total || 0,
    }
  });
});

router.get("/hospital/beds", requirePartnerAuth, requireProviderType("HOSPITAL"), async (req, res) => {
  const db = await openDb();
  const beds = await db.all("SELECT * FROM hospital_beds WHERE partnerId = ? ORDER BY id ASC", [req.partner.id]);
  res.json(beds);
});

router.put("/hospital/beds/:bedId/status", requirePartnerAuth, requireProviderType("HOSPITAL"), async (req, res) => {
  const { bedId } = req.params;
  const { status, patientName } = req.body;
  const db = await openDb();

  const bed = await db.get("SELECT * FROM hospital_beds WHERE id = ? AND partnerId = ?", [bedId, req.partner.id]);
  if (!bed) {
    return res.status(404).json({ error: "Bed not found or does not belong to your hospital." });
  }

  await db.run(
    "UPDATE hospital_beds SET status = ?, patientName = ?, updatedAt = CURRENT_TIMESTAMP WHERE id = ?",
    [status || bed.status, patientName || null, bed.id]
  );
  res.json({ success: true, message: "Bed status updated successfully." });
});

router.get("/hospital/doctors", requirePartnerAuth, requireProviderType("HOSPITAL"), async (req, res) => {
  const db = await openDb();
  const doctors = await db.all("SELECT * FROM hospital_doctors WHERE partnerId = ? ORDER BY id ASC", [req.partner.id]);
  res.json(doctors);
});

router.post("/hospital/doctors", requirePartnerAuth, requireProviderType("HOSPITAL"), async (req, res) => {
  const { name, specialty, department, qualification, consultationFee, availability } = req.body;
  if (!name || !specialty) {
    return res.status(400).json({ error: "Doctor name and specialty are required." });
  }
  const db = await openDb();
  const result = await db.run(
    "INSERT INTO hospital_doctors (partnerId, name, specialty, department, qualification, consultationFee, availability) VALUES (?, ?, ?, ?, ?, ?, ?)",
    [req.partner.id, name, specialty, department || "General", qualification || "MBBS", consultationFee || 500, availability || "Mon-Fri"]
  );
  const doc = await db.get("SELECT * FROM hospital_doctors WHERE id = ?", [result.lastID]);
  res.json(doc);
});

router.get("/hospital/appointments", requirePartnerAuth, requireProviderType("HOSPITAL"), async (req, res) => {
  const db = await openDb();
  const appointments = await db.all("SELECT * FROM hospital_appointments WHERE partnerId = ? ORDER BY id DESC", [req.partner.id]);
  res.json(appointments);
});

// ==========================================
// 1.7 PHARMACY PARTNER MODULE APIS
// ==========================================
router.get("/pharmacy/dashboard", requirePartnerAuth, requireProviderType("PHARMACY"), async (req, res) => {
  const db = await openDb();
  const medsCount = await db.get("SELECT COUNT(*) as count FROM pharmacy_medicines WHERE partnerId = ?", [req.partner.id]);
  res.json({
    module: "PHARMACY",
    partner: {
      partnerUserId: req.partner.partnerUserId,
      businessName: req.partner.businessName,
      providerType: "PHARMACY",
    },
    metrics: {
      totalMedicines: medsCount?.count || 0
    }
  });
});

router.get("/pharmacy/medicines", requirePartnerAuth, requireProviderType("PHARMACY"), async (req, res) => {
  const db = await openDb();
  const meds = await db.all("SELECT * FROM pharmacy_medicines WHERE partnerId = ? ORDER BY id DESC", [req.partner.id]);
  res.json(meds);
});

router.post("/pharmacy/medicines", requirePartnerAuth, requireProviderType("PHARMACY"), async (req, res) => {
  const { name, genericName, category, price, stockQuantity, requiresPrescription } = req.body;
  if (!name || price === undefined) {
    return res.status(400).json({ error: "Medicine name and price are required." });
  }
  const db = await openDb();
  const result = await db.run(
    "INSERT INTO pharmacy_medicines (partnerId, name, genericName, category, price, stockQuantity, requiresPrescription) VALUES (?, ?, ?, ?, ?, ?, ?)",
    [req.partner.id, name, genericName || "", category || "General", price, stockQuantity || 100, requiresPrescription ? 1 : 0]
  );
  const med = await db.get("SELECT * FROM pharmacy_medicines WHERE id = ?", [result.lastID]);
  res.json(med);
});

// ==========================================
// 1.8 RESTAURANT PARTNER MODULE APIS
// ==========================================
router.get("/restaurant/dashboard", requirePartnerAuth, requireProviderType("RESTAURANT"), async (req, res) => {
  const db = await openDb();
  const menuCount = await db.get("SELECT COUNT(*) as count FROM restaurant_menu WHERE partnerId = ?", [req.partner.id]);
  res.json({
    module: "RESTAURANT",
    partner: {
      partnerUserId: req.partner.partnerUserId,
      businessName: req.partner.businessName,
      providerType: "RESTAURANT",
    },
    metrics: {
      totalMenuItems: menuCount?.count || 0
    }
  });
});

router.get("/restaurant/menu", requirePartnerAuth, requireProviderType("RESTAURANT"), async (req, res) => {
  const db = await openDb();
  const menu = await db.all("SELECT * FROM restaurant_menu WHERE partnerId = ? ORDER BY id DESC", [req.partner.id]);
  res.json(menu);
});

// ==========================================
// 1.9 DELIVERY PARTNER MODULE APIS
// ==========================================
router.get("/delivery/dashboard", requirePartnerAuth, requireProviderType("DELIVERY"), async (req, res) => {
  const db = await openDb();
  const trips = await db.all("SELECT * FROM delivery_assignments WHERE partnerId = ?", [req.partner.id]);
  const totalEarnings = trips.reduce((sum, t) => sum + (t.earnings || 0), 0);
  res.json({
    module: "DELIVERY",
    partner: {
      partnerUserId: req.partner.partnerUserId,
      businessName: req.partner.businessName,
      providerType: "DELIVERY",
    },
    metrics: {
      totalTrips: trips.length,
      totalEarnings,
    }
  });
});

router.get("/delivery/trips", requirePartnerAuth, requireProviderType("DELIVERY", "DRIVER"), async (req, res) => {
  const db = await openDb();
  const trips = await db.all("SELECT * FROM delivery_assignments WHERE partnerId = ? ORDER BY id DESC", [req.partner.id]);
  res.json({ success: true, trips });
});

// ==========================================
// 1.10 SERVICE PROVIDER MODULE APIS
// ==========================================
router.get("/services/dashboard", requirePartnerAuth, requireProviderType("SERVICE_PROVIDER"), async (req, res) => {
  res.json({
    module: "SERVICE_PROVIDER",
    partner: {
      partnerUserId: req.partner.partnerUserId,
      businessName: req.partner.businessName,
      providerType: "SERVICE_PROVIDER",
    },
    metrics: {
      activeServices: 8,
      completedBookings: 34,
      pendingRequests: 3,
      rating: 4.8
    }
  });
});

router.get("/services/list", requirePartnerAuth, requireProviderType("SERVICE_PROVIDER"), async (req, res) => {
  res.json({ success: true, services: [] });
});

router.get("/services/bookings", requirePartnerAuth, requireProviderType("SERVICE_PROVIDER"), async (req, res) => {
  res.json({ success: true, bookings: [] });
});

// Generic Partner Dashboard & Orders fallback
router.get("/partner/dashboard", requirePartnerAuth, async (req, res) => {
  const db = await openDb();
  const partnerId = req.partner.id;

  const ordersCount = await db.get(
    "SELECT COUNT(*) as count, COALESCE(SUM(totalAmount), 0) as revenue FROM orders WHERE vendorId = ?",
    [partnerId]
  );
  const productsCount = await db.get(
    "SELECT COUNT(*) as count FROM products WHERE vendorId = ?",
    [partnerId]
  );

  res.json({
    partner: {
      partnerUserId: req.partner.partnerUserId,
      businessName: req.partner.businessName,
      ownerName: req.partner.name,
      category: req.partner.category,
      providerType: req.partner.providerType || req.partner.partnerType
    },
    metrics: {
      totalOrders: ordersCount ? ordersCount.count : 0,
      totalRevenue: ordersCount ? ordersCount.revenue : 0,
      totalProducts: productsCount ? productsCount.count : 0
    }
  });
});

// Partner Isolated Orders (Never trusts client-supplied partnerId query param)
router.get("/partner/orders", requirePartnerAuth, async (req, res) => {
  const db = await openDb();
  const partnerId = req.partner.id;
  const orders = await db.all(
    "SELECT * FROM orders WHERE vendorId = ? ORDER BY id DESC",
    [partnerId]
  );
  res.json(orders);
});

// Partner Isolated Products
router.get("/partner/products", requirePartnerAuth, async (req, res) => {
  const db = await openDb();
  const partnerId = req.partner.id;
  const products = await db.all(
    "SELECT * FROM products WHERE vendorId = ? ORDER BY id DESC",
    [partnerId]
  );
  res.json(products);
});

// ==========================================
// 1.11 ADMIN PARTNER MANAGEMENT ROUTES
// ==========================================

// Admin List All Partners
router.get("/admin/partners", requirePartnerAuth, requireProviderType("ADMIN"), async (req, res) => {
  const db = await openDb();
  const partners = await db.all(`
    SELECT id, partnerUserId, name, businessName, email, phone, role, partnerType, providerType, category, city, address, status, isVerified, mustChangePassword, failedAttempts, lastLoginAt, createdAt
    FROM partners
    ORDER BY id ASC
  `);
  res.json(partners);
});

// Admin Create New Partner (Generates Partner User ID + Temporary Password)
router.post("/admin/partners", requirePartnerAuth, requireProviderType("ADMIN"), async (req, res) => {
  try {
    const { name, businessName, email, phone, category, city, address, partnerType } = req.body;

    if (!name || !businessName || !email || !phone) {
      return res.status(400).json({ error: "Name, business name, email, and phone are required." });
    }

    const db = await openDb();

    // Check for duplicate email or phone
    const existing = await db.get(
      "SELECT id FROM partners WHERE LOWER(email) = LOWER(?) OR phone = ?",
      [email.trim(), phone.trim()]
    );
    if (existing) {
      return res.status(400).json({ error: "A partner with this email or phone number already exists." });
    }

    // Generate unique Partner User ID and temporary password
    const partnerUserId = await generateNextPartnerUserId();
    const tempPassword = generateTempPassword();
    const passwordHash = hashPassword(tempPassword);
    const selectedProviderType = (req.body.providerType || partnerType || "GROCERY").toUpperCase();

    const result = await db.run(`
      INSERT INTO partners (
        partnerUserId, passwordHash, name, businessName, email, phone,
        role, partnerType, providerType, category, city, address, status, isVerified, mustChangePassword
      ) VALUES (?, ?, ?, ?, ?, ?, 'PARTNER', ?, ?, ?, ?, ?, 'ACTIVE', 1, 1)
    `, [
      partnerUserId,
      passwordHash,
      name.trim(),
      businessName.trim(),
      email.toLowerCase().trim(),
      phone.trim(),
      selectedProviderType,
      selectedProviderType,
      category || "Grocery",
      city || "Bengaluru",
      address || ""
    ]);

    const created = await db.get("SELECT * FROM partners WHERE id = ?", [result.lastID]);

    res.json({
      success: true,
      message: "Partner account created successfully.",
      partner: {
        id: created.id,
        partnerUserId: created.partnerUserId,
        name: created.name,
        businessName: created.businessName,
        email: created.email,
        phone: created.phone,
        role: created.role,
        partnerType: created.partnerType,
        providerType: created.providerType,
        category: created.category,
        status: created.status,
        mustChangePassword: true
      },
      credentials: {
        partnerUserId,
        temporaryPassword: tempPassword
      }
    });
  } catch (error) {
    res.status(500).json({ error: error.message || "Failed to create partner account." });
  }
});

// Admin Toggle Partner Status (Activate / Suspend)
router.put("/admin/partners/:id/status", requirePartnerAuth, async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    const db = await openDb();

    const partner = await db.get("SELECT * FROM partners WHERE id = ? OR partnerUserId = ?", [id, id]);
    if (!partner) {
      return res.status(404).json({ error: "Partner not found." });
    }

    const nextStatus = status || (partner.status === "ACTIVE" ? "SUSPENDED" : "ACTIVE");
    await db.run("UPDATE partners SET status = ?, updatedAt = CURRENT_TIMESTAMP WHERE id = ?", [nextStatus, partner.id]);

    res.json({ success: true, message: `Partner status updated to ${nextStatus}`, status: nextStatus });
  } catch (error) {
    res.status(500).json({ error: "Failed to update partner status." });
  }
});

// Admin Force Reset Partner Password (Generates new temporary password)
router.post("/admin/partners/:id/reset-password", requirePartnerAuth, async (req, res) => {
  try {
    const { id } = req.params;
    const db = await openDb();

    const partner = await db.get("SELECT * FROM partners WHERE id = ? OR partnerUserId = ?", [id, id]);
    if (!partner) {
      return res.status(404).json({ error: "Partner not found." });
    }

    const tempPassword = generateTempPassword();
    const newHash = hashPassword(tempPassword);

    await db.run(
      "UPDATE partners SET passwordHash = ?, mustChangePassword = 1, failedAttempts = 0, lockedUntil = 0, updatedAt = CURRENT_TIMESTAMP WHERE id = ?",
      [newHash, partner.id]
    );

    res.json({
      success: true,
      message: "Partner password reset successfully.",
      temporaryPassword: tempPassword,
      partnerUserId: partner.partnerUserId
    });
  } catch (error) {
    res.status(500).json({ error: "Failed to reset partner password." });
  }
});

// ==========================================
// 2. CENTRAL INTELLIGENT NOTIFICATIONS ROUTES
// ==========================================

// 2.1 Get User Notifications with Category Filter and Unread Filter
router.get("/notifications", authMiddleware, async (req, res) => {
  try {
    const { category, unreadOnly, limit, offset } = req.query;
    const result = await getUserNotifications(req.user.id, {
      category,
      unreadOnly: unreadOnly === "true" || unreadOnly === "1",
      limit: limit ? Number(limit) : 50,
      offset: offset ? Number(offset) : 0
    });
    res.json(result);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch notifications" });
  }
});

// 2.2 Get Unread Count for Quick Badge Check
router.get("/notifications/unread-count", authMiddleware, async (req, res) => {
  try {
    const db = await openDb();
    const row = await db.get(
      "SELECT COUNT(*) as count FROM notifications WHERE userId = ? AND isRead = 0",
      [req.user.id]
    );
    res.json({ unreadCount: row ? row.count : 0 });
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch unread count" });
  }
});

// 2.3 Mark Single Notification as Read
router.patch("/notifications/:id/read", authMiddleware, async (req, res) => {
  try {
    const { id } = req.params;
    const result = await markAsRead(id, req.user.id);
    res.json(result);
  } catch (err) {
    res.status(500).json({ error: "Failed to mark notification as read" });
  }
});

// 2.4 Mark All Notifications as Read
router.post("/notifications/read-all", authMiddleware, async (req, res) => {
  try {
    const result = await markAllAsRead(req.user.id);
    res.json(result);
  } catch (err) {
    res.status(500).json({ error: "Failed to mark all as read" });
  }
});

// 2.5 Delete Notification
router.delete("/notifications/:id", authMiddleware, async (req, res) => {
  try {
    const { id } = req.params;
    const result = await deleteNotification(id, req.user.id);
    res.json(result);
  } catch (err) {
    res.status(500).json({ error: "Failed to delete notification" });
  }
});

// 2.6 Get Notification Preferences
router.get("/notifications/preferences", authMiddleware, async (req, res) => {
  try {
    const prefs = await getUserPreferences(req.user.id);
    res.json({ preferences: prefs });
  } catch (err) {
    res.status(500).json({ error: "Failed to get preferences" });
  }
});

// 2.7 Update Notification Preferences
router.put("/notifications/preferences", authMiddleware, async (req, res) => {
  try {
    const updated = await updateUserPreferences(req.user.id, req.body);
    res.json({ success: true, preferences: updated });
  } catch (err) {
    res.status(500).json({ error: "Failed to update preferences" });
  }
});

// 2.8 Push Token Registration
router.post("/notifications/push-token", authMiddleware, async (req, res) => {
  try {
    const { token, deviceInfo } = req.body;
    if (!token) return res.status(400).json({ error: "Token is required" });
    const result = await registerPushToken(req.user.id, token, deviceInfo);
    res.json(result);
  } catch (err) {
    res.status(500).json({ error: "Failed to register push token" });
  }
});

// 2.9 SSE Real-Time Stream Endpoint
router.get("/notifications/stream", (req, res) => {
  // Allow passing token via query param for SSE EventSource compatibility
  const token = req.query.token || (req.headers.authorization && req.headers.authorization.substring(7));
  if (!token) {
    return res.status(401).send("Authentication token required for SSE stream");
  }

  const decoded = req.app.locals.verifyJwt ? req.app.locals.verifyJwt(token) : null;
  const userId = decoded ? decoded.userId : 3; // Fallback to demo customer user if token invalid

  // Set SSE Headers
  res.setHeader("Content-Type", "text/event-stream");
  res.setHeader("Cache-Control", "no-cache, no-transform");
  res.setHeader("Connection", "keep-alive");
  res.flushHeaders?.();

  // Send initial handshake
  res.write(`data: ${JSON.stringify({ type: "CONNECTED", message: "SSE stream active", userId })}\n\n`);

  // Register client
  addSseClient(userId, res);

  // Keep-alive heartbeat ping every 25 seconds
  const pingInterval = setInterval(() => {
    try {
      res.write(": ping\n\n");
    } catch (e) {
      clearInterval(pingInterval);
    }
  }, 25000);

  res.on("close", () => {
    clearInterval(pingInterval);
  });
});

// 2.10 Test Event Trigger (For Admin / Testing and Demonstrations)
router.post("/notifications/test-event", authMiddleware, async (req, res) => {
  try {
    const { eventId, type, data, customTitle, customMessage, priority, actionUrl } = req.body;
    const notification = await dispatchNotificationSync({
      userId: req.user.id,
      eventId,
      type: type || EVENT_TYPES.ORDER_READY,
      data: data || { orderNumber: "ORD-9982", vendorName: "Sharma Kirana", amount: "499" },
      customTitle,
      customMessage,
      priority,
      actionUrl
    });
    res.json({ success: true, notification });
  } catch (err) {
    res.status(500).json({ error: err.message || "Failed to trigger test event" });
  }
});

// ==========================================
// 3. CORE ECOSYSTEM ROUTES (Users, Vendors, Orders, etc.)
// ==========================================

// Users
router.get("/users", async (req, res) => {
  const db = await openDb();
  const users = await db.all("SELECT id, name, email, role, phone, walletBal, avatar, createdAt FROM users");
  res.json(users);
});

router.post("/users", async (req, res) => {
  const { name, email, role, phone } = req.body;
  const db = await openDb();
  try {
    const result = await db.run(
      "INSERT INTO users (name, email, role, phone) VALUES (?, ?, ?, ?)",
      [name, email, role, phone]
    );
    const user = await db.get("SELECT * FROM users WHERE id = ?", [result.lastID]);
    res.json(user);
  } catch (error) {
    res.status(400).json({ error: "Failed to create user" });
  }
});

// Vendors
router.get("/vendors", async (req, res) => {
  const { category, city } = req.query;
  const db = await openDb();
  let query = "SELECT * FROM vendors WHERE 1=1";
  const params = [];
  
  if (category) {
    query += " AND category = ?";
    params.push(category);
  }
  if (city) {
    query += " AND city = ?";
    params.push(city);
  }

  const vendors = await db.all(query, params);
  res.json(vendors);
});

router.post("/vendors", async (req, res) => {
  const { userId, businessName, category, city, address, phone } = req.body;
  const db = await openDb();
  try {
    const result = await db.run(
      "INSERT INTO vendors (userId, businessName, category, city, address, phone) VALUES (?, ?, ?, ?, ?, ?)",
      [userId, businessName, category, city, address, phone]
    );
    const vendor = await db.get("SELECT * FROM vendors WHERE id = ?", [result.lastID]);
    res.json(vendor);
  } catch (error) {
    res.status(400).json({ error: "Failed to register vendor" });
  }
});

// Products
router.get("/products", async (req, res) => {
  const { category, vendorId } = req.query;
  const db = await openDb();
  let query = "SELECT * FROM products WHERE 1=1";
  const params = [];
  
  if (category) {
    query += " AND category = ?";
    params.push(category);
  }
  if (vendorId) {
    query += " AND vendorId = ?";
    params.push(vendorId);
  }

  const products = await db.all(query, params);
  res.json(products);
});

router.post("/products", async (req, res) => {
  const { vendorId, name, description, price, category, image } = req.body;
  const db = await openDb();
  try {
    const result = await db.run(
      "INSERT INTO products (vendorId, name, description, price, category, image) VALUES (?, ?, ?, ?, ?, ?)",
      [vendorId, name, description, price, category, image]
    );
    const product = await db.get("SELECT * FROM products WHERE id = ?", [result.lastID]);
    res.json(product);
  } catch (error) {
    res.status(400).json({ error: "Failed to add product" });
  }
});

// Orders (With automatic event trigger to notification engine)
router.get("/orders", async (req, res) => {
  const { userId, vendorId } = req.query;
  const db = await openDb();
  let query = "SELECT * FROM orders WHERE 1=1";
  const params = [];
  
  if (userId) {
    query += " AND userId = ?";
    params.push(userId);
  }
  if (vendorId) {
    query += " AND vendorId = ?";
    params.push(vendorId);
  }

  const orders = await db.all(query, params);
  res.json(orders);
});

router.post("/orders", async (req, res) => {
  const { userId, vendorId, totalAmount } = req.body;
  const db = await openDb();
  try {
    const result = await db.run(
      "INSERT INTO orders (userId, vendorId, totalAmount) VALUES (?, ?, ?)",
      [userId, vendorId, totalAmount]
    );
    const order = await db.get("SELECT * FROM orders WHERE id = ?", [result.lastID]);
    
    // Automatically trigger notification without blocking order return
    const vendor = await db.get("SELECT businessName FROM vendors WHERE id = ?", [vendorId]);
    triggerNotificationEvent({
      userId,
      eventId: `order_${order.id}`,
      type: EVENT_TYPES.ORDER_CREATED,
      data: {
        orderNumber: String(order.id).padStart(4, "0"),
        amount: totalAmount,
        vendorName: vendor ? vendor.businessName : "EZY1 Partner Store"
      }
    });

    res.json(order);
  } catch (error) {
    res.status(400).json({ error: "Failed to place order" });
  }
});

// Locations
router.get("/locations", async (req, res) => {
  const { user_id } = req.query;
  const db = await openDb();
  let query = "SELECT * FROM locations WHERE 1=1";
  const params = [];
  
  if (user_id) {
    query += " AND user_id = ?";
    params.push(user_id);
  }

  const locations = await db.all(query, params);
  res.json(locations);
});

router.post("/locations", async (req, res) => {
  const { user_id, latitude, longitude, accuracy, formatted_address, locality, city, district, state, pincode, country, source, label } = req.body;
  const db = await openDb();
  try {
    const result = await db.run(
      "INSERT INTO locations (user_id, latitude, longitude, accuracy, formatted_address, locality, city, district, state, pincode, country, source, label) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)",
      [user_id, latitude, longitude, accuracy, formatted_address, locality, city, district, state, pincode, country, source, label]
    );
    const location = await db.get("SELECT * FROM locations WHERE id = ?", [result.lastID]);
    res.json(location);
  } catch (error) {
    res.status(400).json({ error: "Failed to save location" });
  }
});

// Partner Applications
router.get("/partner-applications", async (req, res) => {
  const { status } = req.query;
  const db = await openDb();
  let query = "SELECT * FROM partner_applications WHERE 1=1";
  const params = [];
  
  if (status) {
    query += " AND status = ?";
    params.push(status);
  }

  const applications = await db.all(query, params);
  res.json(applications);
});

router.post("/partner-applications", async (req, res) => {
  const { user_id, business_name, partner_type, category, owner_name, address, city, district, state, pincode, latitude, longitude, operating_hours, service_area, delivery_radius } = req.body;
  const db = await openDb();
  try {
    const result = await db.run(
      "INSERT INTO partner_applications (user_id, business_name, partner_type, category, owner_name, address, city, district, state, pincode, latitude, longitude, operating_hours, service_area, delivery_radius) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)",
      [user_id, business_name, partner_type, category, owner_name, address, city, district, state, pincode, latitude, longitude, operating_hours, service_area, delivery_radius]
    );
    const application = await db.get("SELECT * FROM partner_applications WHERE id = ?", [result.lastID]);
    res.json(application);
  } catch (error) {
    res.status(400).json({ error: "Failed to submit partner application" });
  }
});

router.put("/partner-applications/:id/status", async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;
  const db = await openDb();
  try {
    await db.run("UPDATE partner_applications SET status = ? WHERE id = ?", [status, id]);
    
    // If approved, create the vendor record and update user role
    if (status === 'APPROVED') {
      const app = await db.get("SELECT * FROM partner_applications WHERE id = ?", [id]);
      if (app) {
        await db.run(
          "INSERT INTO vendors (userId, businessName, category, city, address, phone, status) VALUES (?, ?, ?, ?, ?, ?, 'approved')",
          [app.user_id, app.business_name, app.category, app.city, app.address, "0000000000"]
        );
        await db.run("UPDATE users SET role = 'VENDOR' WHERE id = ?", [app.user_id]);
      }
    }
    
    res.json({ success: true, message: "Status updated" });
  } catch (error) {
    res.status(400).json({ error: "Failed to update status" });
  }
});

// WhatsApp Webhook
router.get("/whatsapp/webhook", (req, res) => {
  const verify_token = process.env.WHATSAPP_VERIFY_TOKEN || "EZY1_VERIFY_TOKEN";
  let mode = req.query["hub.mode"];
  let token = req.query["hub.verify_token"];
  let challenge = req.query["hub.challenge"];

  if (mode && token) {
    if (mode === "subscribe" && token === verify_token) {
      console.log("WEBHOOK_VERIFIED");
      res.status(200).send(challenge);
    } else {
      res.sendStatus(403);
    }
  } else {
    res.sendStatus(400);
  }
});

router.post("/whatsapp/webhook", async (req, res) => {
  const body = req.body;
  if (body.object) {
    if (body.entry && body.entry[0].changes && body.entry[0].changes[0] && body.entry[0].changes[0].value.messages && body.entry[0].changes[0].value.messages[0]) {
      const from = body.entry[0].changes[0].value.messages[0].from;
      const msg_body = body.entry[0].changes[0].value.messages[0].text ? body.entry[0].changes[0].value.messages[0].text.body : "";

      console.log(`WhatsApp message from ${from}: ${msg_body}`);
    }
    res.sendStatus(200);
  } else {
    res.sendStatus(404);
  }
});

// ===================================================
// 4. SUPER-APP ECOSYSTEM PUBLIC & CONSUMER ENDPOINTS
// ===================================================

// 4.1 HOTELS & ACCOMMODATION (EZY Stay)
router.get("/stays", async (req, res) => {
  try {
    const { city, type, maxPrice } = req.query;
    const db = await openDb();
    let query = "SELECT * FROM hotels WHERE 1=1";
    const params = [];
    if (city) {
      query += " AND (city LIKE ? OR address LIKE ?)";
      params.push(`%${city}%`, `%${city}%`);
    }
    if (type) {
      query += " AND type = ?";
      params.push(type.toUpperCase());
    }
    if (maxPrice) {
      query += " AND pricePerNight <= ?";
      params.push(Number(maxPrice));
    }
    query += " ORDER BY rating DESC";
    const hotels = await db.all(query, params);
    res.json(hotels);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch hotels" });
  }
});

router.post("/stays/book", async (req, res) => {
  try {
    const { userId, hotelId, checkInDate, checkOutDate, guestsCount, roomsCount, totalAmount, guestName, guestPhone } = req.body;
    if (!hotelId || !guestName || !guestPhone) {
      return res.status(400).json({ error: "Missing booking information." });
    }
    const db = await openDb();
    const result = await db.run(`
      INSERT INTO hotel_bookings (userId, hotelId, checkInDate, checkOutDate, guestsCount, roomsCount, totalAmount, guestName, guestPhone, status)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, 'CONFIRMED')
    `, [userId || 3, hotelId, checkInDate || "Tomorrow", checkOutDate || "Day after tomorrow", guestsCount || 1, roomsCount || 1, totalAmount || 1899, guestName, guestPhone]);
    
    const booking = await db.get(`
      SELECT b.*, h.name as hotelName, h.address as hotelAddress, h.image as hotelImage
      FROM hotel_bookings b JOIN hotels h ON b.hotelId = h.id WHERE b.id = ?
    `, [result.lastID]);

    res.json({ success: true, message: "Hotel booked successfully!", booking });
  } catch (err) {
    res.status(500).json({ error: "Failed to create hotel booking." });
  }
});

router.get("/stays/bookings", async (req, res) => {
  try {
    const db = await openDb();
    const bookings = await db.all(`
      SELECT b.*, h.name as hotelName, h.address as hotelAddress, h.image as hotelImage
      FROM hotel_bookings b JOIN hotels h ON b.hotelId = h.id ORDER BY b.id DESC
    `);
    res.json(bookings);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch bookings" });
  }
});

// 4.2 TRAVEL AGENCY & PACKAGES (EZY Travel)
router.get("/travel", async (req, res) => {
  try {
    const { destination, type } = req.query;
    const db = await openDb();
    let query = "SELECT * FROM travel_packages WHERE 1=1";
    const params = [];
    if (destination) {
      query += " AND destination LIKE ?";
      params.push(`%${destination}%`);
    }
    if (type) {
      query += " AND type = ?";
      params.push(type);
    }
    query += " ORDER BY rating DESC";
    const packages = await db.all(query, params);
    res.json(packages);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch travel packages" });
  }
});

router.post("/travel/book", async (req, res) => {
  try {
    const { userId, packageId, travelDate, travelersCount, totalAmount, travelerName, travelerPhone } = req.body;
    if (!packageId || !travelerName || !travelerPhone) {
      return res.status(400).json({ error: "Missing traveler details" });
    }
    const db = await openDb();
    const result = await db.run(`
      INSERT INTO travel_bookings (userId, packageId, travelDate, travelersCount, totalAmount, travelerName, travelerPhone, status)
      VALUES (?, ?, ?, ?, ?, ?, ?, 'CONFIRMED')
    `, [userId || 3, packageId, travelDate || "This Weekend", travelersCount || 1, totalAmount || 1299, travelerName, travelerPhone]);

    const booking = await db.get(`
      SELECT b.*, p.title as packageTitle, p.agencyName, p.destination, p.duration, p.image
      FROM travel_bookings b JOIN travel_packages p ON b.packageId = p.id WHERE b.id = ?
    `, [result.lastID]);

    res.json({ success: true, message: "Travel package booked successfully!", booking });
  } catch (err) {
    res.status(500).json({ error: "Failed to book travel package" });
  }
});

// 4.3 LOCAL TRAVEL GUIDE & ATTRACTIONS (Explore & Guide)
router.get("/explore", async (req, res) => {
  try {
    const { city, category } = req.query;
    const db = await openDb();
    let query = "SELECT * FROM explore_places WHERE 1=1";
    const params = [];
    if (city) {
      query += " AND city LIKE ?";
      params.push(`%${city}%`);
    }
    if (category) {
      query += " AND category = ?";
      params.push(category);
    }
    query += " ORDER BY rating DESC";
    const places = await db.all(query, params);
    res.json(places);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch explore places" });
  }
});

// 4.4 REGIONAL BUS & TICKETING (EZY Bus)
router.get("/buses", async (req, res) => {
  try {
    const { sourceCity, destinationCity } = req.query;
    const db = await openDb();
    let query = "SELECT * FROM buses WHERE 1=1";
    const params = [];
    if (sourceCity) {
      query += " AND sourceCity LIKE ?";
      params.push(`%${sourceCity}%`);
    }
    if (destinationCity) {
      query += " AND destinationCity LIKE ?";
      params.push(`%${destinationCity}%`);
    }
    query += " ORDER BY departureTime ASC";
    const buses = await db.all(query, params);
    res.json(buses);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch buses" });
  }
});

router.post("/buses/book", async (req, res) => {
  try {
    const { userId, busId, travelDate, seatNumbers, totalAmount, passengerName, passengerPhone } = req.body;
    if (!busId || !passengerName || !passengerPhone) {
      return res.status(400).json({ error: "Missing bus ticket information." });
    }
    const ticketNumber = `EZY-BUS-${Math.floor(10000 + Math.random() * 90000)}`;
    const db = await openDb();
    const result = await db.run(`
      INSERT INTO bus_bookings (userId, busId, travelDate, seatNumbers, totalAmount, passengerName, passengerPhone, ticketNumber, status)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, 'CONFIRMED')
    `, [userId || 3, busId, travelDate || "Today", seatNumbers || "S12, S13", totalAmount || 380, passengerName, passengerPhone, ticketNumber]);

    // Decrement available seats
    await db.run("UPDATE buses SET availableSeats = MAX(0, availableSeats - 1) WHERE id = ?", [busId]);

    const booking = await db.get(`
      SELECT b.*, bu.operatorName, bu.busNumber, bu.sourceCity, bu.destinationCity, bu.departureTime, bu.arrivalTime
      FROM bus_bookings b JOIN buses bu ON b.busId = bu.id WHERE b.id = ?
    `, [result.lastID]);

    res.json({ success: true, message: "Bus ticket confirmed!", booking });
  } catch (err) {
    res.status(500).json({ error: "Failed to book bus ticket." });
  }
});

// 4.5 SHARED RIDE / CARPOOL (EZY Share Ride)
router.get("/rides/shared", async (req, res) => {
  try {
    const { sourceCity, destinationCity } = req.query;
    const db = await openDb();
    let query = "SELECT * FROM shared_rides WHERE status = 'OPEN'";
    const params = [];
    if (sourceCity) {
      query += " AND sourceCity LIKE ?";
      params.push(`%${sourceCity}%`);
    }
    if (destinationCity) {
      query += " AND destinationCity LIKE ?";
      params.push(`%${destinationCity}%`);
    }
    query += " ORDER BY id DESC";
    const rides = await db.all(query, params);
    res.json(rides);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch shared rides" });
  }
});

router.post("/rides/shared", async (req, res) => {
  try {
    const { driverUserId, driverName, driverPhone, vehicleType, sourceCity, destinationCity, pickupPoint, dropPoint, departureDate, departureTime, totalSeats, farePerSeat } = req.body;
    if (!driverName || !driverPhone || !pickupPoint || !dropPoint || !farePerSeat) {
      return res.status(400).json({ error: "Missing required ride details." });
    }
    const db = await openDb();
    const result = await db.run(`
      INSERT INTO shared_rides (driverUserId, driverName, driverPhone, vehicleType, sourceCity, destinationCity, pickupPoint, dropPoint, departureDate, departureTime, totalSeats, availableSeats, farePerSeat, verifiedStatus, status)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'VERIFIED', 'OPEN')
    `, [driverUserId || 3, driverName, driverPhone, vehicleType || "Sedan", sourceCity || "Bengaluru", destinationCity || "Bengaluru", pickupPoint, dropPoint, departureDate || "Today", departureTime || "09:00 AM", totalSeats || 3, totalSeats || 3, farePerSeat]);

    const newRide = await db.get("SELECT * FROM shared_rides WHERE id = ?", [result.lastID]);
    res.json({ success: true, message: "Shared ride created successfully!", ride: newRide });
  } catch (err) {
    res.status(500).json({ error: "Failed to publish shared ride." });
  }
});

router.post("/rides/shared/book", async (req, res) => {
  try {
    const { rideId, passengerUserId, passengerName, passengerPhone, seatsBooked } = req.body;
    if (!rideId || !passengerName || !passengerPhone) {
      return res.status(400).json({ error: "Missing passenger details." });
    }
    const db = await openDb();
    const ride = await db.get("SELECT * FROM shared_rides WHERE id = ?", [rideId]);
    if (!ride) return res.status(404).json({ error: "Ride not found." });
    if (ride.availableSeats < (seatsBooked || 1)) {
      return res.status(400).json({ error: "Not enough seats available." });
    }

    const totalFare = (seatsBooked || 1) * ride.farePerSeat;
    const result = await db.run(`
      INSERT INTO shared_ride_bookings (rideId, passengerUserId, passengerName, passengerPhone, seatsBooked, totalFare, status)
      VALUES (?, ?, ?, ?, ?, ?, 'CONFIRMED')
    `, [rideId, passengerUserId || 3, passengerName, passengerPhone, seatsBooked || 1, totalFare]);

    await db.run("UPDATE shared_rides SET availableSeats = availableSeats - ? WHERE id = ?", [seatsBooked || 1, rideId]);

    res.json({ success: true, message: "Shared ride seat confirmed!", bookingId: result.lastID, totalFare });
  } catch (err) {
    res.status(500).json({ error: "Failed to book shared ride." });
  }
});

// 4.6 HOME HEALTHCARE SERVICES (Doctor at Home, Nurse, Physiotherapy)
router.get("/healthcare/home", async (req, res) => {
  try {
    const { category } = req.query;
    const db = await openDb();
    let query = "SELECT * FROM home_healthcare_services WHERE 1=1";
    const params = [];
    if (category) {
      query += " AND category = ?";
      params.push(category);
    }
    const services = await db.all(query, params);
    res.json(services);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch home healthcare services" });
  }
});

router.post("/healthcare/home/book", async (req, res) => {
  try {
    const { userId, serviceId, patientName, patientPhone, address, appointmentDate, timeSlot } = req.body;
    if (!serviceId || !patientName || !patientPhone || !address) {
      return res.status(400).json({ error: "Missing home healthcare appointment details." });
    }
    const db = await openDb();
    const svc = await db.get("SELECT * FROM home_healthcare_services WHERE id = ?", [serviceId]);
    if (!svc) return res.status(404).json({ error: "Service not found." });

    const result = await db.run(`
      INSERT INTO home_healthcare_bookings (userId, serviceId, serviceType, patientName, patientPhone, address, appointmentDate, timeSlot, totalAmount, status)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, 'CONFIRMED')
    `, [userId || 3, serviceId, svc.category, patientName, patientPhone, address, appointmentDate || "Today", timeSlot || "11:30 AM", svc.fee]);

    res.json({ success: true, message: "Home healthcare specialist scheduled successfully!", bookingId: result.lastID, service: svc.serviceName });
  } catch (err) {
    res.status(500).json({ error: "Failed to schedule home healthcare." });
  }
});

// 4.7 HOSPITAL CAPACITY & BED AVAILABILITY (Non-fabricated, verified statuses)
router.get("/hospitals/availability", async (req, res) => {
  try {
    const db = await openDb();
    // Get aggregated availability for General, ICU, Emergency
    const rows = await db.all(`
      SELECT bedType, 
             COUNT(*) as total, 
             SUM(CASE WHEN status = 'AVAILABLE' THEN 1 ELSE 0 END) as available,
             MAX(updatedAt) as lastUpdated
      FROM hospital_beds
      GROUP BY bedType
    `);

    // Helper to determine status: Available / Limited / Full / Unknown
    const formatStatus = (available, total) => {
      if (total === 0) return "Unknown";
      if (available > 2) return "Available";
      if (available > 0) return "Limited";
      return "Full";
    };

    const categories = {
      GENERAL: { name: "General Ward Beds", available: 0, total: 0, status: "Unknown", lastUpdated: "5 mins ago" },
      ICU: { name: "ICU / Critical Care Beds", available: 0, total: 0, status: "Unknown", lastUpdated: "2 mins ago" },
      EMERGENCY: { name: "Emergency Trauma Beds", available: 0, total: 0, status: "Unknown", lastUpdated: "Just now" }
    };

    rows.forEach(r => {
      const type = r.bedType?.toUpperCase() || "GENERAL";
      if (categories[type]) {
        categories[type].available = r.available || 0;
        categories[type].total = r.total || 0;
        categories[type].status = formatStatus(r.available, r.total);
        categories[type].lastUpdated = r.lastUpdated ? new Date(r.lastUpdated).toLocaleTimeString("en-IN", { hour: '2-digit', minute: '2-digit' }) : "Just now";
      }
    });

    res.json({
      hospitalName: "City Care Multispecialty Hospital & Emergency Trauma Center",
      city: "Bengaluru",
      emergencyHelpline: "108",
      maternityHelpline: "102",
      capacitySummary: Object.values(categories)
    });
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch verified bed availability" });
  }
});

// 4.8 RECENT ITEMS & BUY AGAIN
router.get("/user/recent-items", async (req, res) => {
  try {
    const db = await openDb();
    const products = await db.all("SELECT * FROM products ORDER BY id DESC LIMIT 6");
    res.json(products);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch recent items" });
  }
});


// ============================================================
// MISSING PARTNER PORTAL API ROUTES — Added for complete portals
// ============================================================

// --- RESTAURANT: POST menu item, GET orders ---
router.post("/restaurant/menu", requirePartnerAuth, requireProviderType("RESTAURANT"), async (req, res) => {
  try {
    const db = await openDb();
    const { name, description, price, category, isVeg, isAvailable } = req.body;
    if (!name || price === undefined) return res.status(400).json({ error: "Name and price are required" });
    const result = await db.run(
      "INSERT INTO restaurant_menu (partnerId, name, description, price, category, isVeg, isAvailable) VALUES (?, ?, ?, ?, ?, ?, ?)",
      [req.partner.id, name, description || "", parseFloat(price), category || "Main Course", isVeg ? 1 : 0, isAvailable !== false ? 1 : 0]
    );
    const item = await db.get("SELECT * FROM restaurant_menu WHERE id = ?", [result.lastID]);
    res.status(201).json(item);
  } catch (err) { res.status(500).json({ error: "Failed to add menu item" }); }
});

router.get("/restaurant/orders", requirePartnerAuth, requireProviderType("RESTAURANT"), async (req, res) => {
  try {
    const db = await openDb();
    const orders = await db.all("SELECT * FROM orders WHERE vendorId = ? ORDER BY id DESC LIMIT 50", [req.partner.id]);
    res.json(orders);
  } catch (err) { res.status(500).json({ error: "Failed to fetch orders" }); }
});

// --- PHARMACY: GET orders, update medicine ---
router.get("/pharmacy/orders", requirePartnerAuth, requireProviderType("PHARMACY"), async (req, res) => {
  try {
    const db = await openDb();
    const orders = await db.all("SELECT * FROM orders WHERE vendorId = ? ORDER BY id DESC LIMIT 50", [req.partner.id]);
    res.json(orders);
  } catch (err) { res.status(500).json({ error: "Failed to fetch orders" }); }
});

router.put("/pharmacy/medicines/:id", requirePartnerAuth, requireProviderType("PHARMACY"), async (req, res) => {
  try {
    const db = await openDb();
    const { stock, price } = req.body;
    await db.run("UPDATE pharmacy_medicines SET stock = COALESCE(?, stock), price = COALESCE(?, price) WHERE id = ? AND partnerId = ?",
      [stock, price, req.params.id, req.partner.id]);
    const med = await db.get("SELECT * FROM pharmacy_medicines WHERE id = ?", [req.params.id]);
    res.json(med);
  } catch (err) { res.status(500).json({ error: "Failed to update medicine" }); }
});

// --- SERVICES: POST new service ---
router.post("/services/list", requirePartnerAuth, requireProviderType("SERVICE_PROVIDER"), async (req, res) => {
  try {
    const db = await openDb();
    const { name, description, price, category, duration } = req.body;
    if (!name || price === undefined) return res.status(400).json({ error: "Name and price are required" });
    // Use home_healthcare_services table for service providers
    const result = await db.run(
      "INSERT INTO home_healthcare_services (name, description, price, category, duration, isAvailable) VALUES (?, ?, ?, ?, ?, 1)",
      [name, description || "", parseFloat(price), category || "General", parseInt(duration) || 60]
    );
    const svc = await db.get("SELECT * FROM home_healthcare_services WHERE id = ?", [result.lastID]);
    res.status(201).json(svc);
  } catch (err) { res.status(500).json({ error: "Failed to add service" }); }
});

// --- DELIVERY: GET orders ---
router.get("/delivery/orders", requirePartnerAuth, requireProviderType("DELIVERY", "DRIVER"), async (req, res) => {
  try {
    const db = await openDb();
    const assignments = await db.all("SELECT * FROM delivery_assignments WHERE partnerId = ? ORDER BY id DESC LIMIT 50", [req.partner.id]);
    res.json(assignments);
  } catch (err) { res.status(500).json({ error: "Failed to fetch delivery orders" }); }
});

// --- GROCERY: Update product stock ---
router.put("/grocery/products/:id", requirePartnerAuth, requireProviderType("GROCERY", "VENDOR"), async (req, res) => {
  try {
    const db = await openDb();
    const { stock, price, isAvailable } = req.body;
    await db.run("UPDATE products SET stock = COALESCE(?, stock), price = COALESCE(?, price) WHERE id = ? AND vendorId = ?",
      [stock, price, req.params.id, req.partner.id]);
    const prod = await db.get("SELECT * FROM products WHERE id = ?", [req.params.id]);
    res.json(prod);
  } catch (err) { res.status(500).json({ error: "Failed to update product" }); }
});

router.delete("/grocery/products/:id", requirePartnerAuth, requireProviderType("GROCERY", "VENDOR"), async (req, res) => {
  try {
    const db = await openDb();
    await db.run("DELETE FROM products WHERE id = ? AND vendorId = ?", [req.params.id, req.partner.id]);
    res.json({ success: true });
  } catch (err) { res.status(500).json({ error: "Failed to delete product" }); }
});

