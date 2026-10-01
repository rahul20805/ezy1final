import jwt from "jsonwebtoken";
import { ENV } from "../config/env.config.js";

export function signJwt(payload: object, expiresIn: string | number = "7d"): string {
  return jwt.sign(payload, ENV.JWT_SECRET, { expiresIn } as any);
}

export function verifyJwt<T = any>(token: string): T | null {
  try {
    return jwt.verify(token, ENV.JWT_SECRET) as T;
  } catch {
    return null;
  }
}
