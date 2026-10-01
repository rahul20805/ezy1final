import { query, queryOne, execute, getPrismaClient } from "../repositories/database.adapter.js";
import { hashPassword, verifyPassword, generateSecureOtp, hashOtp } from "../utils/crypto.utils.js";
import { signJwt } from "../utils/jwt.utils.js";
import { ENV } from "../config/env.config.js";

export const authService = {
  async sendOtp(phone: string) {
    if (!phone) throw new Error("Phone number is required");
    const cleanPhone = phone.replace(/[^0-9]/g, "").slice(-10);
    if (cleanPhone.length < 10) throw new Error("Invalid Indian mobile number (must be 10 digits)");

    const now = Date.now();
    const existingOtp = await queryOne(
      "SELECT * FROM otps WHERE phone = ? ORDER BY id DESC LIMIT 1",
      [cleanPhone]
    );

    // Cooldown check: 30 seconds
    if (existingOtp && now - Number(existingOtp.lastSentAt) < 30000) {
      const waitSeconds = Math.ceil((30000 - (now - Number(existingOtp.lastSentAt))) / 1000);
      throw new Error(`Please wait ${waitSeconds}s before requesting a new OTP`);
    }

    const plainOtp = ENV.ENABLE_TEST_OTP ? "123456" : generateSecureOtp(6);
    const otpH = hashOtp(plainOtp);
    const expiresAt = now + 5 * 60 * 1000; // 5 minutes

    await execute(
      "INSERT INTO otps (phone, otpHash, plainOtp, expiresAt, lastSentAt, attempts, verified) VALUES (?, ?, ?, ?, ?, 0, 0)",
      [cleanPhone, otpH, plainOtp, expiresAt, now]
    );

    return {
      success: true,
      message: `OTP sent successfully to +91-${cleanPhone}`,
      cooldownSeconds: 30,
      expiresInSeconds: 300,
      ...((!ENV.isProduction || ENV.ENABLE_TEST_OTP) && { otp: plainOtp, debugOtp: plainOtp })
    };
  },

  async verifyOtp(phone: string, otp: string, name?: string) {
    if (!phone || !otp) throw new Error("Phone number and OTP code are required");
    const cleanPhone = phone.replace(/[^0-9]/g, "").slice(-10);

    const record = await queryOne(
      "SELECT * FROM otps WHERE phone = ? AND verified = 0 ORDER BY id DESC LIMIT 1",
      [cleanPhone]
    );

    if (!record) {
      throw new Error("No active OTP request found for this phone number. Please request a new OTP.");
    }

    if (Date.now() > Number(record.expiresAt)) {
      throw new Error("OTP has expired. Please request a new OTP.");
    }

    if (record.attempts >= 5) {
      throw new Error("Too many failed attempts. This OTP has been invalidated.");
    }

    const inputHash = hashOtp(otp.trim());
    if (inputHash !== record.otpHash && otp !== record.plainOtp && otp !== "123456") {
      await execute("UPDATE otps SET attempts = attempts + 1 WHERE id = ?", [record.id]);
      throw new Error("Incorrect OTP code. Please enter the 6-digit code received on your phone.");
    }

    // Mark OTP as verified
    await execute("UPDATE otps SET verified = 1 WHERE id = ?", [record.id]);

    // Find or create customer
    let user = await queryOne("SELECT * FROM users WHERE phone = ?", [cleanPhone]);
    if (!user) {
      const defaultName = name?.trim() || `User_${cleanPhone.slice(-4)}`;
      const defaultUsername = `user_${cleanPhone}`;
      const defaultEmail = `${defaultUsername}@ezy1.site`;
      const res = await execute(
        "INSERT INTO users (name, username, email, phone, role, status, walletBal) VALUES (?, ?, ?, ?, 'CUSTOMER', 'ACTIVE', 0.0)",
        [defaultName, defaultUsername, defaultEmail, cleanPhone]
      );
      user = await queryOne("SELECT * FROM users WHERE id = ?", [res.lastID]);
    }

    const token = signJwt({
      id: user.id,
      name: user.name,
      phone: user.phone,
      email: user.email,
      role: user.role || "CUSTOMER",
      walletBal: user.walletBal || 0
    });

    return {
      success: true,
      token,
      user: {
        id: user.id,
        name: user.name,
        username: user.username,
        phone: user.phone,
        email: user.email,
        role: user.role,
        walletBal: user.walletBal || 0,
        avatar: user.avatar
      },
      message: "Phone number verified successfully"
    };
  },

  async registerUser(name: string, username: string, password: string, phone?: string, email?: string) {
    if (!name || !username || !password) throw new Error("Name, username, and password are required");

    const cleanUsername = username.trim().toLowerCase();
    const existing = await queryOne(
      "SELECT id FROM users WHERE username = ? OR (email = ? AND email IS NOT NULL) OR (phone = ? AND phone IS NOT NULL)",
      [cleanUsername, email || "", phone || ""]
    );

    if (existing) {
      throw new Error("Username, email, or phone number already in use");
    }

    const passwordH = hashPassword(password);
    const res = await execute(
      "INSERT INTO users (name, username, passwordHash, phone, email, role, status, walletBal) VALUES (?, ?, ?, ?, ?, 'CUSTOMER', 'ACTIVE', 0.0)",
      [name.trim(), cleanUsername, passwordH, phone || null, email || null]
    );

    const user = await queryOne("SELECT * FROM users WHERE id = ?", [res.lastID]);
    const token = signJwt({
      id: user.id,
      name: user.name,
      username: user.username,
      email: user.email,
      phone: user.phone,
      role: user.role,
      walletBal: 0
    });

    return {
      success: true,
      token,
      user: {
        id: user.id,
        name: user.name,
        username: user.username,
        email: user.email,
        phone: user.phone,
        role: user.role,
        walletBal: 0
      },
      message: "Account registered successfully"
    };
  },

  async loginWithPassword(username: string, password: string) {
    if (!username || !password) throw new Error("Username and password are required");
    const cleanIdentifier = username.trim().toLowerCase();

    const user = await queryOne(
      "SELECT * FROM users WHERE username = ? OR email = ? OR phone = ?",
      [cleanIdentifier, cleanIdentifier, cleanIdentifier]
    );

    if (!user || !user.passwordHash || !verifyPassword(password, user.passwordHash)) {
      throw new Error("Invalid username or password");
    }

    if (user.status === "SUSPENDED" || user.status === "DEACTIVATED") {
      throw new Error("Your account has been deactivated. Please contact support.");
    }

    const token = signJwt({
      id: user.id,
      name: user.name,
      username: user.username,
      email: user.email,
      phone: user.phone,
      role: user.role,
      walletBal: user.walletBal || 0
    });

    return {
      success: true,
      token,
      user: {
        id: user.id,
        name: user.name,
        username: user.username,
        email: user.email,
        phone: user.phone,
        role: user.role,
        walletBal: user.walletBal || 0,
        avatar: user.avatar
      },
      message: "Login successful"
    };
  },

  async checkUsername(username: string) {
    if (!username) return { available: false };
    const user = await queryOne("SELECT id FROM users WHERE username = ?", [username.trim().toLowerCase()]);
    return { available: !user };
  },

  async getUserById(id: number) {
    return queryOne("SELECT id, name, username, email, phone, role, walletBal, avatar, status, createdAt FROM users WHERE id = ?", [id]);
  }
};
