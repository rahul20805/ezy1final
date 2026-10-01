import { Request } from "express";

export interface AuthenticatedUser {
  id: number;
  username?: string;
  email?: string;
  phone?: string;
  name: string;
  role: string;
  walletBal?: number;
  avatar?: string;
}

export interface AuthenticatedPartner {
  id: number;
  partnerUserId: string;
  businessName: string;
  ownerName: string;
  category: string;
  providerType: string;
  role: string;
  phone: string;
  email: string;
  city: string;
  address?: string;
  status: string;
  isVerified: boolean;
  mustChangePassword: boolean;
  permissions?: any;
}

export interface AuthRequest extends Request {
  user?: AuthenticatedUser;
  partner?: AuthenticatedPartner;
}

export interface ApiResponse<T = any> {
  success: boolean;
  message?: string;
  data?: T;
  error?: string;
  code?: string;
}

export interface PaginatedResult<T> {
  items: T[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}
