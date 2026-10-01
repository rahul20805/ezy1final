import crypto from "crypto";

/**
 * PBKDF2 Password Hashing with SHA-512 and random 16-byte salt
 * 100,000 iterations for production-grade security
 */
export function hashPassword(password: string): string {
  if (!password || typeof password !== "string") {
    throw new Error("Password must be a non-empty string");
  }
  const salt = crypto.randomBytes(16).toString("hex");
  const derivedKey = crypto.pbkdf2Sync(password, salt, 100000, 64, "sha512").toString("hex");
  return `${salt}:${derivedKey}`;
}

export function verifyPassword(password: string, storedHash?: string | null): boolean {
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

export function generateSecureOtp(length: number = 6): string {
  let otp = "";
  for (let i = 0; i < length; i++) {
    otp += crypto.randomInt(0, 10).toString();
  }
  return otp;
}

export function hashOtp(otp: string): string {
  return crypto.createHash("sha256").update(otp).digest("hex");
}

export function generateToken(length: number = 32): string {
  return crypto.randomBytes(length).toString("hex");
}

export function generateRandomOrderNumber(prefix: string = "ORD"): string {
  const year = new Date().getFullYear();
  const rand = Math.floor(100000 + Math.random() * 900000);
  return `${prefix}-${year}-${rand}`;
}
