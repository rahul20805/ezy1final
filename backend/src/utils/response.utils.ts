import { Response } from "express";
import { ApiResponse } from "../types/index.js";

export function sendSuccess<T = any>(
  res: Response,
  data?: T,
  message: string = "Operation successful",
  statusCode: number = 200
): Response {
  const payload: ApiResponse<T> = {
    success: true,
    message,
    ...(data !== undefined && { data }),
    ...(typeof data === "object" && data !== null && !Array.isArray(data) ? data : {})
  };
  return res.status(statusCode).json(payload);
}

export function sendError(
  res: Response,
  message: string = "An error occurred",
  statusCode: number = 400,
  code?: string
): Response {
  const payload: ApiResponse = {
    success: false,
    error: message,
    message,
    ...(code && { code })
  };
  return res.status(statusCode).json(payload);
}
