import crypto from "crypto";
import { openDb } from "./db.js";
import { signJwt, verifyJwt } from "./authService.js";
import { getPermissionsForProvider } from "./permissionService.js";

const MAX_FAILED_ATTEMPTS = 5;
const LOCKOUT_DURATION_MS = 15 * 60 * 1000; // 15 minutes
const RESET_TOKEN_EXPIRY_MS = 15 * 60 * 1000; // 15 minutes

// PBKDF2 Password Hashing (100,000 iterations, SHA-512, 16-byte random salt)
export function hashPassword(password) {
  if (!password || typeof password !== "string") {
    throw new Error("Password must be a non-empty string");
  }
  const salt = crypto.randomBytes(16).toString("hex");
  const derivedKey = crypto.pbkdf2Sync(password, salt, 100000, 64, "sha512").toString("hex");
  return `${salt}:${derivedKey}`;
}

export function verifyPassword(password, storedHash) {
  if (!password || !storedHash || typeof storedHash !== "string") {
    return false;
  }
  const parts = storedHash.split(":");
  if (parts.length !== 2) return false;

  const [salt, originalHash] = parts;
  const derivedKey = crypto.pbkdf2Sync(password, salt, 100000, 64, "sha512").toString("hex");

  try {
    return crypto.timingSafeEqual(Buffer.from(derivedKey, "hex"), Buffer.from(originalHash, "hex"));
  } catch {
    return false;
  }
}

// Generate sequential unique Partner User ID (e.g., EZY-P-10001, EZY-P-10002)
export async function generateNextPartnerUserId() {
  const db = await openDb();
  const rows = await db.all("SELECT partnerUserId FROM partners WHERE partnerUserId LIKE 'EZY-P-%'");
  let maxNum = 10000;

  for (const row of rows) {
    const match = row.partnerUserId.match(/EZY-P-(\d+)/);
    if (match) {
      const num = parseInt(match[1], 10);
      if (num > maxNum) maxNum = num;
    }
  }

  return `EZY-P-${maxNum + 1}`;
}

// Generate Secure Temporary Password (e.g. Ezy@9xK2b7)
export function generateTempPassword() {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz23456789";
  let pass = "Ezy@";
  for (let i = 0; i < 6; i++) {
    pass += chars.charAt(crypto.randomInt(0, chars.length));
  }
  return pass;
}

// 1. Partner Login with Brute-Force Lockout & Credential Safety
export async function partnerLogin({ partnerUserId, password }) {
  const genericError = "Invalid Partner ID or password.";

  if (!partnerUserId || !password) {
    throw new Error(genericError);
  }

  const cleanId = partnerUserId.trim();
  const db = await openDb();
  const now = Date.now();

  // Find partner by Partner User ID (case-insensitive)
  const partner = await db.get(
    "SELECT * FROM partners WHERE UPPER(partnerUserId) = UPPER(?)",
    [cleanId]
  );

  if (!partner) {
    // Perform dummy hash to prevent timing attack enumeration
    verifyPassword(password, "0000000000000000:00000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000");
    throw new Error(genericError);
  }

  // Check Lockout
  if (partner.lockedUntil && partner.lockedUntil > now) {
    const minutesLeft = Math.ceil((partner.lockedUntil - now) / (60 * 1000));
    throw new Error(`Account temporarily locked due to multiple failed login attempts. Try again in ${minutesLeft} minute(s).`);
  }

  // Check Account Status
  if (partner.status === "SUSPENDED" || partner.status === "INACTIVE") {
    throw new Error("This partner account has been disabled. Please contact platform administration.");
  }

  // Verify Password
  const isValid = verifyPassword(password, partner.passwordHash);

  if (!isValid) {
    const newAttempts = (partner.failedAttempts || 0) + 1;
    let lockTimestamp = 0;

    if (newAttempts >= MAX_FAILED_ATTEMPTS) {
      lockTimestamp = now + LOCKOUT_DURATION_MS;
      await db.run(
        "UPDATE partners SET failedAttempts = ?, lockedUntil = ?, updatedAt = CURRENT_TIMESTAMP WHERE id = ?",
        [newAttempts, lockTimestamp, partner.id]
      );
      throw new Error("Account temporarily locked due to multiple failed login attempts. Try again in 15 minutes.");
    } else {
      await db.run(
        "UPDATE partners SET failedAttempts = ?, updatedAt = CURRENT_TIMESTAMP WHERE id = ?",
        [newAttempts, partner.id]
      );
      throw new Error(genericError);
    }
  }

  // On Successful Login: Reset failed attempts, update lastLoginAt
  await db.run(
    "UPDATE partners SET failedAttempts = 0, lockedUntil = 0, lastLoginAt = CURRENT_TIMESTAMP, updatedAt = CURRENT_TIMESTAMP WHERE id = ?",
    [partner.id]
  );

  // Generate JWT Token with Partner Claims
  const providerType = (partner.providerType || partner.partnerType || "GROCERY").toUpperCase();
  const permissions = getPermissionsForProvider(providerType, partner.role);

  const token = signJwt({
    partnerId: partner.id,
    partnerUserId: partner.partnerUserId,
    role: partner.role || "PARTNER",
    providerType,
    businessName: partner.businessName,
    mustChangePassword: Boolean(partner.mustChangePassword),
    isPartner: true,
  });

  return {
    success: true,
    token,
    partner: {
      id: partner.id,
      partnerUserId: partner.partnerUserId,
      name: partner.name,
      businessName: partner.businessName,
      email: partner.email,
      phone: partner.phone,
      role: partner.role,
      partnerType: partner.partnerType || providerType,
      providerType,
      category: partner.category,
      city: partner.city,
      status: partner.status,
      isVerified: Boolean(partner.isVerified),
      mustChangePassword: Boolean(partner.mustChangePassword),
      lastLoginAt: partner.lastLoginAt,
      permissions,
    },
  };
}

// 2. Change Password (For Forced First Login or Partner Settings)
export async function partnerChangePassword(partnerId, { currentPassword, newPassword }) {
  if (!newPassword || newPassword.length < 8) {
    throw new Error("New password must be at least 8 characters long.");
  }

  const db = await openDb();
  const partner = await db.get("SELECT * FROM partners WHERE id = ?", [partnerId]);

  if (!partner) {
    throw new Error("Partner account not found.");
  }

  // If partner is not on forced temporary change, verify current password
  if (!partner.mustChangePassword) {
    if (!currentPassword || !verifyPassword(currentPassword, partner.passwordHash)) {
      throw new Error("Current password is incorrect.");
    }
  }

  const newHash = hashPassword(newPassword);
  await db.run(
    "UPDATE partners SET passwordHash = ?, mustChangePassword = 0, failedAttempts = 0, lockedUntil = 0, updatedAt = CURRENT_TIMESTAMP WHERE id = ?",
    [newHash, partnerId]
  );

  return {
    success: true,
    message: "Password changed successfully.",
  };
}

// 3. Forgot Password Request (Generates Secure Single-Use Token)
export async function partnerForgotPassword(identifier) {
  const genericResponse = {
    success: true,
    message: "If a matching partner account is found, password reset instructions have been generated.",
  };

  if (!identifier || typeof identifier !== "string") {
    return genericResponse;
  }

  const clean = identifier.trim();
  const db = await openDb();

  const partner = await db.get(
    "SELECT id, email, partnerUserId FROM partners WHERE UPPER(partnerUserId) = UPPER(?) OR LOWER(email) = LOWER(?)",
    [clean, clean]
  );

  if (!partner) {
    return genericResponse;
  }

  // Generate single-use 64-char crypto token
  const rawToken = crypto.randomBytes(32).toString("hex");
  const tokenHash = crypto.createHash("sha256").update(rawToken).digest("hex");
  const expiresAt = Date.now() + RESET_TOKEN_EXPIRY_MS;

  // Invalidate any existing unused reset tokens for this partner
  await db.run("UPDATE partner_password_resets SET used = 1 WHERE partnerId = ?", [partner.id]);

  await db.run(
    "INSERT INTO partner_password_resets (partnerId, tokenHash, expiresAt, used) VALUES (?, ?, ?, 0)",
    [partner.id, tokenHash, expiresAt]
  );

  console.log(`[PARTNER AUTH] Password reset token generated for ${partner.partnerUserId}: ${rawToken}`);

  return {
    ...genericResponse,
    resetToken: rawToken, // Provided for easy client-side reset workflow / testing
  };
}

// 4. Reset Password with Token
export async function partnerResetPassword({ token, newPassword }) {
  if (!token || !newPassword) {
    throw new Error("Reset token and new password are required.");
  }

  if (newPassword.length < 8) {
    throw new Error("New password must be at least 8 characters long.");
  }

  const db = await openDb();
  const tokenHash = crypto.createHash("sha256").update(token.trim()).digest("hex");
  const now = Date.now();

  const record = await db.get(
    "SELECT * FROM partner_password_resets WHERE tokenHash = ? AND used = 0",
    [tokenHash]
  );

  if (!record) {
    throw new Error("Invalid or already used password reset link.");
  }

  if (now > record.expiresAt) {
    throw new Error("Password reset link has expired. Please request a new one.");
  }

  // Mark token as used
  await db.run("UPDATE partner_password_resets SET used = 1 WHERE id = ?", [record.id]);

  // Update partner's password
  const newHash = hashPassword(newPassword);
  await db.run(
    "UPDATE partners SET passwordHash = ?, mustChangePassword = 0, failedAttempts = 0, lockedUntil = 0, updatedAt = CURRENT_TIMESTAMP WHERE id = ?",
    [newHash, record.partnerId]
  );

  return {
    success: true,
    message: "Password reset successful. You can now login with your new password.",
  };
}

// 5. Partner Auth Middleware
export async function requirePartnerAuth(req, res, next) {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ error: "Partner authentication required" });
  }

  const token = authHeader.substring(7);
  const decoded = verifyJwt(token);

  if (!decoded || (!decoded.partnerId && decoded.role === "CUSTOMER")) {
    return res.status(401).json({ error: "Invalid or expired partner authentication token" });
  }

  const db = await openDb();
  let partner = null;

  if (decoded.partnerId) {
    partner = await db.get("SELECT * FROM partners WHERE id = ?", [decoded.partnerId]);
  } else if (decoded.role === "ADMIN" || decoded.role === "super_owner") {
    // Master admin access
    partner = await db.get("SELECT * FROM partners WHERE role IN ('ADMIN', 'super_owner') LIMIT 1");
  }

  if (!partner) {
    return res.status(401).json({ error: "Partner account not found or session revoked" });
  }

  if (partner.status === "SUSPENDED" || partner.status === "INACTIVE") {
    return res.status(403).json({ error: "This partner account has been disabled by administration" });
  }

  req.partner = partner;
  next();
}

// 6. Admin Only Middleware
export async function requireAdminAuth(req, res, next) {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ error: "Admin authentication required" });
  }

  const token = authHeader.substring(7);
  const decoded = verifyJwt(token);

  if (!decoded) {
    return res.status(401).json({ error: "Invalid or expired authentication token" });
  }

  const role = (decoded.role || "").toUpperCase();
  if (role !== "ADMIN" && role !== "SUPER_OWNER" && role !== "SUPER_ADMIN") {
    return res.status(403).json({ error: "Access denied. Admin authorization required." });
  }

  next();
}
