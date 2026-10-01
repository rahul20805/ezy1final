import { query, queryOne, execute } from "../repositories/database.adapter.js";
import { hashPassword, verifyPassword, generateToken } from "../utils/crypto.utils.js";
import { signJwt } from "../utils/jwt.utils.js";

const MAX_FAILED_ATTEMPTS = 5;
const LOCKOUT_DURATION_MS = 15 * 60 * 1000;

export const partnerService = {
  async login(partnerUserId: string, password: string) {
    if (!partnerUserId || !password) {
      throw new Error("Partner User ID and password are required");
    }

    const cleanId = partnerUserId.trim();
    const partner = await queryOne(
      "SELECT * FROM partners WHERE partnerUserId = ? OR email = ? OR phone = ?",
      [cleanId, cleanId, cleanId]
    );

    // Anti-enumeration: Generic error message
    if (!partner) {
      throw new Error("Invalid Partner ID or password.");
    }

    // Account lockout check
    if (partner.lockedUntil && Date.now() < Number(partner.lockedUntil)) {
      const waitMins = Math.ceil((Number(partner.lockedUntil) - Date.now()) / 60000);
      throw new Error(`Account temporarily locked due to failed attempts. Try again in ${waitMins} minute(s).`);
    }

    // Active status check
    if (partner.status && partner.status.toUpperCase() !== "ACTIVE") {
      const err: any = new Error("This partner account has been disabled. Please contact platform administration.");
      err.statusCode = 403;
      throw err;
    }

    // Verify Password
    const isValid = verifyPassword(password, partner.passwordHash);
    if (!isValid) {
      const failedAttempts = (partner.failedAttempts || 0) + 1;
      let lockUntil: number | null = null;
      if (failedAttempts >= MAX_FAILED_ATTEMPTS) {
        lockUntil = Date.now() + LOCKOUT_DURATION_MS;
      }

      await execute(
        "UPDATE partners SET failedAttempts = ?, lockedUntil = ? WHERE id = ?",
        [failedAttempts, lockUntil, partner.id]
      );

      throw new Error("Invalid Partner ID or password.");
    }

    // Reset failed attempts on success
    await execute(
      "UPDATE partners SET failedAttempts = 0, lockedUntil = NULL, lastLoginAt = CURRENT_TIMESTAMP WHERE id = ?",
      [partner.id]
    );

    const token = signJwt({
      id: partner.id,
      partnerId: partner.id,
      partnerUserId: partner.partnerUserId,
      businessName: partner.businessName,
      ownerName: partner.name || partner.ownerName,
      category: partner.category || "Grocery",
      providerType: partner.providerType || partner.partnerType || "GROCERY",
      role: partner.role || "PARTNER",
      phone: partner.phone,
      email: partner.email,
      city: partner.city,
      status: partner.status,
      isVerified: Boolean(partner.isVerified),
      mustChangePassword: Boolean(partner.mustChangePassword)
    });

    return {
      success: true,
      token,
      partner: {
        id: partner.id,
        partnerUserId: partner.partnerUserId,
        businessName: partner.businessName,
        name: partner.name || partner.ownerName,
        category: partner.category,
        providerType: partner.providerType || partner.partnerType || "GROCERY",
        role: partner.role || "PARTNER",
        phone: partner.phone,
        email: partner.email,
        city: partner.city,
        status: partner.status,
        isVerified: Boolean(partner.isVerified),
        mustChangePassword: Boolean(partner.mustChangePassword),
        lastLoginAt: partner.lastLoginAt
      }
    };
  },

  async getProfile(partnerId: number) {
    const partner = await queryOne("SELECT * FROM partners WHERE id = ?", [partnerId]);
    if (!partner) throw new Error("Partner account not found");
    return {
      id: partner.id,
      partnerUserId: partner.partnerUserId,
      businessName: partner.businessName,
      name: partner.name || partner.ownerName,
      ownerName: partner.ownerName || partner.name,
      category: partner.category,
      providerType: partner.providerType || partner.partnerType || "GROCERY",
      role: partner.role || "PARTNER",
      phone: partner.phone,
      email: partner.email,
      city: partner.city,
      address: partner.address,
      status: partner.status,
      isVerified: Boolean(partner.isVerified),
      mustChangePassword: Boolean(partner.mustChangePassword),
      lastLoginAt: partner.lastLoginAt
    };
  },

  async changePassword(partnerId: number, currentPw: string, newPw: string) {
    if (!currentPw || !newPw) throw new Error("Current and new passwords are required");
    if (newPw.length < 8) throw new Error("New password must be at least 8 characters long");

    const partner = await queryOne("SELECT * FROM partners WHERE id = ?", [partnerId]);
    if (!partner) throw new Error("Partner not found");

    if (!verifyPassword(currentPw, partner.passwordHash)) {
      throw new Error("Incorrect current password");
    }

    const newHash = hashPassword(newPw);
    await execute(
      "UPDATE partners SET passwordHash = ?, mustChangePassword = 0, updatedAt = CURRENT_TIMESTAMP WHERE id = ?",
      [newHash, partnerId]
    );

    return { success: true, message: "Password updated successfully" };
  },

  async forgotPassword(identifier: string) {
    if (!identifier) throw new Error("Partner ID or email is required");
    const clean = identifier.trim();

    const partner = await queryOne(
      "SELECT id, email, phone FROM partners WHERE partnerUserId = ? OR email = ?",
      [clean, clean]
    );

    if (!partner) {
      // Safe response without leaking
      return { success: true, message: "If the Partner ID exists, reset instructions have been issued." };
    }

    const resetToken = generateToken(32);
    const tokenHash = hashPassword(resetToken);
    const expiresAt = Date.now() + 15 * 60 * 1000; // 15 mins

    await execute(
      "INSERT INTO partner_password_resets (partnerId, tokenHash, expiresAt, used) VALUES (?, ?, ?, 0)",
      [partner.id, tokenHash, expiresAt]
    );

    return {
      success: true,
      message: "Password reset token generated (valid for 15 minutes)",
      resetToken // in production sent via SMS/Email
    };
  },

  async resetPassword(token: string, newPw: string) {
    if (!token || !newPw) throw new Error("Token and new password are required");
    if (newPw.length < 8) throw new Error("New password must be at least 8 characters long");

    const now = Date.now();
    const resets = await query(
      "SELECT * FROM partner_password_resets WHERE used = 0 AND expiresAt > ?",
      [now]
    );

    let matchingReset: any = null;
    for (const r of resets) {
      if (verifyPassword(token, r.tokenHash)) {
        matchingReset = r;
        break;
      }
    }

    if (!matchingReset) {
      throw new Error("Invalid or expired password reset token.");
    }

    const newHash = hashPassword(newPw);
    await execute("UPDATE partners SET passwordHash = ?, mustChangePassword = 0 WHERE id = ?", [newHash, matchingReset.partnerId]);
    await execute("UPDATE partner_password_resets SET used = 1 WHERE id = ?", [matchingReset.id]);

    return { success: true, message: "Password has been reset successfully. Please log in with your new password." };
  },

  async getDashboard(partnerId: number) {
    const partner = await queryOne("SELECT * FROM partners WHERE id = ?", [partnerId]);
    if (!partner) throw new Error("Partner not found");

    const orders = await query("SELECT * FROM orders WHERE vendorId = ? ORDER BY id DESC LIMIT 50", [partnerId]);
    const products = await query("SELECT * FROM products WHERE vendorId = ?", [partnerId]);

    const totalRevenue = orders.reduce((sum, o) => sum + (Number(o.totalAmount) || 0), 0);
    const pendingOrders = orders.filter(o => o.status === "pending" || o.status === "PENDING").length;

    return {
      partner: {
        id: partner.id,
        partnerUserId: partner.partnerUserId,
        businessName: partner.businessName,
        category: partner.category,
        status: partner.status
      },
      stats: {
        totalOrders: orders.length,
        pendingOrders,
        totalProducts: products.length,
        totalRevenue
      },
      recentOrders: orders.slice(0, 10),
      products
    };
  },

  async getProducts(partnerId: number) {
    return query("SELECT * FROM products WHERE vendorId = ? ORDER BY id DESC", [partnerId]);
  },

  async createProduct(partnerId: number, data: any) {
    const { name, description, price, category, available, image } = data;
    if (!name || price === undefined) throw new Error("Product name and price are required");

    const res = await execute(
      "INSERT INTO products (vendorId, name, description, price, category, available, image) VALUES (?, ?, ?, ?, ?, ?, ?)",
      [partnerId, name.trim(), description || "", Number(price), category || "General", available ?? 1, image || ""]
    );

    return queryOne("SELECT * FROM products WHERE id = ?", [res.lastID]);
  },

  async updateProduct(partnerId: number, productId: number, data: any) {
    const existing = await queryOne("SELECT * FROM products WHERE id = ? AND vendorId = ?", [productId, partnerId]);
    if (!existing) throw new Error("Product not found or access denied");

    const name = data.name !== undefined ? data.name : existing.name;
    const description = data.description !== undefined ? data.description : existing.description;
    const price = data.price !== undefined ? Number(data.price) : existing.price;
    const category = data.category !== undefined ? data.category : existing.category;
    const available = data.available !== undefined ? (data.available ? 1 : 0) : existing.available;
    const image = data.image !== undefined ? data.image : existing.image;

    await execute(
      "UPDATE products SET name = ?, description = ?, price = ?, category = ?, available = ?, image = ? WHERE id = ? AND vendorId = ?",
      [name, description, price, category, available, image, productId, partnerId]
    );

    return queryOne("SELECT * FROM products WHERE id = ?", [productId]);
  },

  async deleteProduct(partnerId: number, productId: number) {
    const existing = await queryOne("SELECT id FROM products WHERE id = ? AND vendorId = ?", [productId, partnerId]);
    if (!existing) throw new Error("Product not found or access denied");

    await execute("DELETE FROM products WHERE id = ? AND vendorId = ?", [productId, partnerId]);
    return { success: true, message: "Product deleted successfully" };
  }
};
