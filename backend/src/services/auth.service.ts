import { query, queryOne, execute } from "../repositories/database.adapter.js";
import { hashPassword, verifyPassword, generateSecureOtp, hashOtp } from "../utils/crypto.utils.js";
import { signJwt } from "../utils/jwt.utils.js";
import { emailService } from "./email.service.js";

export const authService = {
  /**
   * Send Phone OTP
   */
  async sendOtp(phone: string) {
    if (!phone) throw new Error("Phone number is required");
    const cleanPhone = phone.replace(/[^0-9]/g, "").slice(-10);
    if (cleanPhone.length < 10) throw new Error("Invalid Indian mobile number (must be 10 digits)");

    const now = Date.now();
    const existingOtp = await queryOne(
      "SELECT * FROM otps WHERE phone = ? AND purpose = 'PHONE_AUTH' ORDER BY id DESC LIMIT 1",
      [cleanPhone]
    );

    // Cooldown check: 30 seconds
    if (existingOtp && now - Number(existingOtp.lastSentAt) < 30000) {
      const waitSeconds = Math.ceil((30000 - (now - Number(existingOtp.lastSentAt))) / 1000);
      throw new Error(`Please wait ${waitSeconds}s before requesting a new OTP`);
    }

    const plainOtp = generateSecureOtp(6);
    const otpH = hashOtp(plainOtp);
    const expiresAt = now + 5 * 60 * 1000; // 5 minutes

    await execute(
      "INSERT INTO otps (phone, purpose, otpHash, plainOtp, expiresAt, lastSentAt, attempts, verified) VALUES (?, 'PHONE_AUTH', ?, ?, ?, ?, 0, 0)",
      [cleanPhone, otpH, plainOtp, expiresAt, now]
    );

    return {
      success: true,
      message: `Verification code generated for +91-${cleanPhone}`,
      cooldownSeconds: 30,
      expiresInSeconds: 300
    };
  },

  /**
   * Verify Phone OTP
   */
  async verifyOtp(phone: string, otp: string, name?: string) {
    if (!phone || !otp) throw new Error("Phone number and OTP code are required");
    const cleanPhone = phone.replace(/[^0-9]/g, "").slice(-10);

    const record = await queryOne(
      "SELECT * FROM otps WHERE phone = ? AND purpose = 'PHONE_AUTH' AND verified = 0 ORDER BY id DESC LIMIT 1",
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
    if (inputHash !== record.otpHash) {
      await execute("UPDATE otps SET attempts = attempts + 1 WHERE id = ?", [record.id]);
      throw new Error("Incorrect verification code. Please enter the 6-digit code received.");
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
        "INSERT INTO users (name, username, email, phone, role, status, phoneVerified, walletBal) VALUES (?, ?, ?, ?, 'CUSTOMER', 'ACTIVE', 1, 0.0)",
        [defaultName, defaultUsername, defaultEmail, cleanPhone]
      );
      user = await queryOne("SELECT * FROM users WHERE id = ?", [res.lastID]);
    } else {
      await execute("UPDATE users SET phoneVerified = 1, lastLoginAt = CURRENT_TIMESTAMP WHERE id = ?", [user.id]);
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

  /**
   * Send Email OTP (for Email Verification or Password Reset)
   */
  async sendEmailOtp(email: string, purpose: "EMAIL_VERIFICATION" | "PASSWORD_RESET", name?: string) {
    if (!email || !email.includes("@")) throw new Error("Valid email address is required");
    const cleanEmail = email.trim().toLowerCase();

    const now = Date.now();
    const existingOtp = await queryOne(
      "SELECT * FROM otps WHERE email = ? AND purpose = ? ORDER BY id DESC LIMIT 1",
      [cleanEmail, purpose]
    );

    // Cooldown check: 30 seconds
    if (existingOtp && now - Number(existingOtp.lastSentAt) < 30000) {
      const waitSeconds = Math.ceil((30000 - (now - Number(existingOtp.lastSentAt))) / 1000);
      throw new Error(`Please wait ${waitSeconds}s before requesting a new code`);
    }

    const plainOtp = generateSecureOtp(6);
    const otpH = hashOtp(plainOtp);
    const expiresAt = now + 5 * 60 * 1000; // 5 minutes

    await execute(
      "INSERT INTO otps (phone, email, purpose, otpHash, plainOtp, expiresAt, lastSentAt, attempts, verified) VALUES (?, ?, ?, ?, ?, ?, ?, 0, 0)",
      [cleanEmail, cleanEmail, purpose, otpH, plainOtp, expiresAt, now]
    );

    // Dispatch real email via Brevo / SMTP
    if (purpose === "EMAIL_VERIFICATION") {
      await emailService.sendEmailVerificationOtp(cleanEmail, plainOtp, name);
    } else if (purpose === "PASSWORD_RESET") {
      await emailService.sendPasswordResetEmail(cleanEmail, plainOtp, name);
    }

    return {
      success: true,
      message: `Verification code sent to ${cleanEmail}`,
      cooldownSeconds: 30,
      expiresInSeconds: 300
    };
  },

  /**
   * Verify Email Verification OTP
   */
  async verifyEmailOtp(email: string, otp: string) {
    if (!email || !otp) throw new Error("Email and verification code are required");
    const cleanEmail = email.trim().toLowerCase();

    const record = await queryOne(
      "SELECT * FROM otps WHERE email = ? AND purpose = 'EMAIL_VERIFICATION' AND verified = 0 ORDER BY id DESC LIMIT 1",
      [cleanEmail]
    );

    if (!record) {
      throw new Error("No active verification code found for this email. Please request a new code.");
    }

    if (Date.now() > Number(record.expiresAt)) {
      throw new Error("Verification code has expired. Please request a new code.");
    }

    if (record.attempts >= 5) {
      throw new Error("Too many failed attempts. This code has been invalidated.");
    }

    const inputHash = hashOtp(otp.trim());
    if (inputHash !== record.otpHash) {
      await execute("UPDATE otps SET attempts = attempts + 1 WHERE id = ?", [record.id]);
      throw new Error("Incorrect verification code. Please check your email and try again.");
    }

    // Mark OTP as verified
    await execute("UPDATE otps SET verified = 1 WHERE id = ?", [record.id]);

    // Update user record
    await execute("UPDATE users SET emailVerified = 1, status = 'ACTIVE' WHERE email = ?", [cleanEmail]);
    const user = await queryOne("SELECT * FROM users WHERE email = ?", [cleanEmail]);

    if (!user) {
      return { success: true, message: "Email verified successfully" };
    }

    const token = signJwt({
      id: user.id,
      name: user.name,
      username: user.username,
      email: user.email,
      phone: user.phone,
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
        email: user.email,
        phone: user.phone,
        role: user.role,
        walletBal: user.walletBal || 0,
        avatar: user.avatar
      },
      message: "Email verified successfully. Welcome to EZY1!"
    };
  },

  /**
   * Register User (Account created once, stored permanently in PostgreSQL / database)
   */
  async registerUser(name: string, username: string, password: string, phone?: string, email?: string) {
    if (!name || !name.trim()) throw new Error("Full name is required");
    if (!username || !username.trim()) throw new Error("Username is required");
    if (!password || password.length < 6) throw new Error("Password must be at least 6 characters");

    const cleanUsername = username.trim().toLowerCase();
    const cleanEmail = email ? email.trim().toLowerCase() : null;
    const cleanPhone = phone ? phone.replace(/[^0-9]/g, "").slice(-10) : null;

    if (cleanEmail && !cleanEmail.includes("@")) {
      throw new Error("Invalid email address format");
    }
    if (cleanPhone && cleanPhone.length < 10) {
      throw new Error("Invalid phone number (must be 10 digits)");
    }

    // Check existing account
    const existing = await queryOne(
      "SELECT id, username, email, phone FROM users WHERE username = ? OR (email IS NOT NULL AND email = ?) OR (phone IS NOT NULL AND phone = ?)",
      [cleanUsername, cleanEmail || "", cleanPhone || ""]
    );

    if (existing) {
      if (existing.username === cleanUsername) throw new Error("Username is already taken");
      if (cleanEmail && existing.email === cleanEmail) throw new Error("An account with this email address already exists. Please sign in.");
      if (cleanPhone && existing.phone === cleanPhone) throw new Error("An account with this mobile number already exists. Please sign in.");
      throw new Error("Account details already in use. Please sign in.");
    }

    const passwordH = hashPassword(password);
    const res = await execute(
      "INSERT INTO users (name, username, passwordHash, phone, email, role, status, emailVerified, phoneVerified, walletBal) VALUES (?, ?, ?, ?, ?, 'CUSTOMER', 'ACTIVE', 0, 0, 0.0)",
      [name.trim(), cleanUsername, passwordH, cleanPhone, cleanEmail]
    );

    const user = await queryOne("SELECT * FROM users WHERE id = ?", [res.lastID]);

    // If real email was provided, generate secure OTP and dispatch real email verification
    if (cleanEmail) {
      try {
        await this.sendEmailOtp(cleanEmail, "EMAIL_VERIFICATION", name.trim());
      } catch (emailErr: any) {
        console.warn("[AUTH REGISTER] Email dispatch notice:", emailErr.message);
      }
    }

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
      message: cleanEmail ? "Account registered! A verification code has been sent to your email." : "Account registered successfully"
    };
  },

  /**
   * Login with Identifier (Username / Email / Mobile) and Password
   */
  async loginWithPassword(identifier: string, password: string) {
    if (!identifier || !password) throw new Error("Username/Email/Phone and password are required");
    const cleanId = identifier.trim().toLowerCase();
    const cleanPhone = identifier.replace(/[^0-9]/g, "").slice(-10);

    const user = await queryOne(
      "SELECT * FROM users WHERE username = ? OR email = ? OR (phone IS NOT NULL AND phone = ?)",
      [cleanId, cleanId, cleanPhone || cleanId]
    );

    if (!user || !user.passwordHash || !verifyPassword(password, user.passwordHash)) {
      throw new Error("Invalid username/email or password");
    }

    if (user.status === "SUSPENDED" || user.status === "DEACTIVATED") {
      throw new Error("Your account has been deactivated. Please contact support.");
    }

    // Update lastLoginAt
    await execute("UPDATE users SET lastLoginAt = CURRENT_TIMESTAMP WHERE id = ?", [user.id]);

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

  /**
   * Forgot Password - Step 1: Send Password Reset OTP
   * Protects against account enumeration by always returning generic message.
   */
  async forgotPassword(email: string) {
    if (!email || !email.includes("@")) throw new Error("Valid email address is required");
    const cleanEmail = email.trim().toLowerCase();

    // Check if user exists internally
    const user = await queryOne("SELECT id, name, email FROM users WHERE email = ?", [cleanEmail]);

    if (user) {
      try {
        await this.sendEmailOtp(cleanEmail, "PASSWORD_RESET", user.name);
      } catch (err: any) {
        console.warn("[FORGOT PASSWORD NOTICE]", err.message);
      }
    }

    // Anti-enumeration: Safe generic message
    return {
      success: true,
      message: "If an account exists for this email address, a password recovery verification code has been sent."
    };
  },

  /**
   * Forgot Password - Step 2: Verify Reset OTP Code
   */
  async verifyResetOtp(email: string, otp: string) {
    if (!email || !otp) throw new Error("Email and reset verification code are required");
    const cleanEmail = email.trim().toLowerCase();

    const record = await queryOne(
      "SELECT * FROM otps WHERE email = ? AND purpose = 'PASSWORD_RESET' AND verified = 0 ORDER BY id DESC LIMIT 1",
      [cleanEmail]
    );

    if (!record) {
      throw new Error("No active password recovery request found for this email. Please request a new code.");
    }

    if (Date.now() > Number(record.expiresAt)) {
      throw new Error("Password recovery code has expired. Please request a new code.");
    }

    if (record.attempts >= 5) {
      throw new Error("Too many failed attempts. This recovery code has been invalidated.");
    }

    const inputHash = hashOtp(otp.trim());
    if (inputHash !== record.otpHash) {
      await execute("UPDATE otps SET attempts = attempts + 1 WHERE id = ?", [record.id]);
      throw new Error("Incorrect recovery code. Please check your email and try again.");
    }

    return {
      success: true,
      message: "Recovery code verified. You may now set your new password."
    };
  },

  /**
   * Forgot Password - Step 3: Set New Password on EXISTING User Record
   */
  async resetPassword(email: string, otp: string, newPassword: string) {
    if (!email || !otp || !newPassword) throw new Error("Email, verification code, and new password are required");
    if (newPassword.length < 6) throw new Error("New password must be at least 6 characters");

    const cleanEmail = email.trim().toLowerCase();

    const record = await queryOne(
      "SELECT * FROM otps WHERE email = ? AND purpose = 'PASSWORD_RESET' AND verified = 0 ORDER BY id DESC LIMIT 1",
      [cleanEmail]
    );

    if (!record) {
      throw new Error("No active password recovery code found for this email. Please request a new code.");
    }

    if (Date.now() > Number(record.expiresAt)) {
      throw new Error("Password recovery code has expired. Please request a new code.");
    }

    if (record.attempts >= 5) {
      throw new Error("Too many failed attempts. This recovery code has been invalidated.");
    }

    const inputHash = hashOtp(otp.trim());
    if (inputHash !== record.otpHash) {
      await execute("UPDATE otps SET attempts = attempts + 1 WHERE id = ?", [record.id]);
      throw new Error("Incorrect recovery code.");
    }

    // Invalidate the OTP
    await execute("UPDATE otps SET verified = 1 WHERE id = ?", [record.id]);

    // Find the EXISTING user record
    const user = await queryOne("SELECT * FROM users WHERE email = ?", [cleanEmail]);
    if (!user) {
      throw new Error("User account not found");
    }

    // Update password hash on existing user record — preserving user ID, orders, addresses, bookings, history
    const newPasswordH = hashPassword(newPassword);
    await execute(
      "UPDATE users SET passwordHash = ? WHERE id = ?",
      [newPasswordH, user.id]
    );

    return {
      success: true,
      message: "Password updated successfully! You can now log in with your new password."
    };
  },

  /**
   * Check Username Availability
   */
  async checkUsername(username: string) {
    if (!username) return { available: false };
    const user = await queryOne("SELECT id FROM users WHERE username = ?", [username.trim().toLowerCase()]);
    return { available: !user, message: user ? "Username is already taken" : "Username is available" };
  },

  /**
   * Get User by ID
   */
  async getUserById(id: number) {
    return queryOne("SELECT id, name, username, email, phone, role, walletBal, avatar, status, emailVerified, phoneVerified, createdAt FROM users WHERE id = ?", [id]);
  }
};
