import { create } from "zustand";

export type AdminRole = "super_admin" | "admin" | "manager" | "editor" | "viewer" | string;

export interface PartnerAccount {
  id: number | string;
  partnerUserId: string; // e.g. "EZY-P-10001"
  businessName: string;
  ownerName: string;
  name?: string;
  category: string;
  role: string;
  partnerType?: string;
  providerType?: string;
  phone: string;
  email: string;
  city: string;
  address?: string;
  status: "ACTIVE" | "SUSPENDED" | "INACTIVE" | "active" | "suspended" | "pending";
  isVerified?: boolean;
  mustChangePassword?: boolean;
  lastLoginAt?: string;
  vendorId?: number;
  permissions?: any;
  password?: string;
}

interface PartnerAuthState {
  token: string | null;
  currentPartner: PartnerAccount | null;
  partners: PartnerAccount[];
  isAuthenticated: boolean;
  isLoading: boolean;

  login: (partnerUserId: string, password: string) => Promise<{ success: boolean; mustChangePassword?: boolean; error?: string }>;
  changePassword: (currentPassword: string, newPassword: string) => Promise<{ success: boolean; error?: string }>;
  forgotPassword: (identifier: string) => Promise<{ success: boolean; message?: string; resetToken?: string; error?: string }>;
  resetPassword: (token: string, newPassword: string) => Promise<{ success: boolean; error?: string }>;
  fetchMe: () => Promise<PartnerAccount | null>;
  logout: () => void;
  fetchPartners: () => Promise<void>;
  addPartner: (partner: any) => Promise<any>;
  updatePartner: (id: string | number, updates: any) => Promise<any>;
  deletePartner: (id: string | number) => Promise<any>;
  resetPartnersToDefault: () => void;
}

const PARTNER_TOKEN_KEY = "ezy1_partner_token";

export function getPartnerToken(): string | null {
  if (typeof window === "undefined") return null;
  return sessionStorage.getItem(PARTNER_TOKEN_KEY) || localStorage.getItem(PARTNER_TOKEN_KEY);
}

export function setPartnerToken(token: string): void {
  if (typeof window === "undefined") return;
  sessionStorage.setItem(PARTNER_TOKEN_KEY, token);
  localStorage.setItem(PARTNER_TOKEN_KEY, token);
}

export function clearPartnerToken(): void {
  if (typeof window === "undefined") return;
  sessionStorage.removeItem(PARTNER_TOKEN_KEY);
  localStorage.removeItem(PARTNER_TOKEN_KEY);
  localStorage.removeItem("ezy1_token");
  localStorage.removeItem("token");
}

export const usePartnerAuth = create<PartnerAuthState>((set, get) => ({
  token: getPartnerToken(),
  currentPartner: null, // Strictly null by default — NO AUTOMATIC LOGIN
  isAuthenticated: false,
  isLoading: false,

  login: async (partnerUserId: string, password: string) => {
    set({ isLoading: true });
    try {
      const res = await fetch("/api/partner/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          partnerUserId: partnerUserId.trim(),
          password: password.trim(),
        }),
      });

      const data = await res.json();
      set({ isLoading: false });

      if (!res.ok || !data.success || !data.token) {
        return {
          success: false,
          error: data.error || "Invalid Partner ID or password.",
        };
      }

      setPartnerToken(data.token);

      const partnerData: PartnerAccount = {
        id: data.partner.id,
        partnerUserId: data.partner.partnerUserId,
        businessName: data.partner.businessName,
        ownerName: data.partner.name,
        category: data.partner.category || "Grocery",
        role: data.partner.role || "PARTNER",
        partnerType: data.partner.partnerType || data.partner.providerType || "GROCERY",
        providerType: data.partner.providerType || data.partner.partnerType || "GROCERY",
        phone: data.partner.phone || "",
        email: data.partner.email || "",
        city: data.partner.city || "",
        status: data.partner.status || "ACTIVE",
        isVerified: Boolean(data.partner.isVerified),
        mustChangePassword: Boolean(data.partner.mustChangePassword),
        lastLoginAt: data.partner.lastLoginAt,
        permissions: data.partner.permissions,
      };

      set({
        token: data.token,
        currentPartner: partnerData,
        isAuthenticated: true,
      });

      return {
        success: true,
        mustChangePassword: partnerData.mustChangePassword,
      };
    } catch (err: any) {
      set({ isLoading: false });
      return {
        success: false,
        error: "Unable to connect to partner authentication service. Please try again.",
      };
    }
  },

  changePassword: async (currentPassword: string, newPassword: string) => {
    const token = get().token || getPartnerToken();
    if (!token) return { success: false, error: "Authentication required" };

    try {
      const res = await fetch("/api/partner/auth/change-password", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ currentPassword, newPassword }),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        return { success: false, error: data.error || "Failed to change password." };
      }

      if (get().currentPartner) {
        set({
          currentPartner: {
            ...get().currentPartner!,
            mustChangePassword: false,
          },
        });
      }

      return { success: true };
    } catch (err: any) {
      return { success: false, error: err.message || "Failed to update password." };
    }
  },

  forgotPassword: async (identifier: string) => {
    try {
      const res = await fetch("/api/partner/auth/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ identifier: identifier.trim() }),
      });
      const data = await res.json();
      return {
        success: true,
        message: data.message,
        resetToken: data.resetToken,
      };
    } catch (err: any) {
      return { success: false, error: err.message || "Failed to process request." };
    }
  },

  resetPassword: async (token: string, newPassword: string) => {
    try {
      const res = await fetch("/api/partner/auth/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token: token.trim(), newPassword }),
      });
      const data = await res.json();
      if (!res.ok || !data.success) {
        return { success: false, error: data.error || "Failed to reset password." };
      }
      return { success: true };
    } catch (err: any) {
      return { success: false, error: err.message || "Failed to reset password." };
    }
  },

  fetchMe: async () => {
    const token = get().token || getPartnerToken();
    if (!token) {
      set({ currentPartner: null, isAuthenticated: false });
      return null;
    }

    try {
      const res = await fetch("/api/partner/auth/me", {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();

      if (res.ok && data.partner) {
        const partnerData: PartnerAccount = {
          id: data.partner.id,
          partnerUserId: data.partner.partnerUserId,
          businessName: data.partner.businessName,
          ownerName: data.partner.name,
          category: data.partner.category,
          role: data.partner.role,
          partnerType: data.partner.partnerType || data.partner.providerType || "GROCERY",
          providerType: data.partner.providerType || data.partner.partnerType || "GROCERY",
          phone: data.partner.phone,
          email: data.partner.email,
          city: data.partner.city,
          address: data.partner.address,
          status: data.partner.status,
          isVerified: Boolean(data.partner.isVerified),
          mustChangePassword: Boolean(data.partner.mustChangePassword),
          lastLoginAt: data.partner.lastLoginAt,
          permissions: data.partner.permissions,
        };
        set({ currentPartner: partnerData, isAuthenticated: true, token });
        return partnerData;
      }
    } catch (err) {
      // Network failure
    }

    clearPartnerToken();
    set({ currentPartner: null, isAuthenticated: false, token: null });
    return null;
  },

  logout: () => {
    const token = get().token || getPartnerToken();
    if (token) {
      fetch("/api/partner/auth/logout", {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
      }).catch(() => {});
    }
    clearPartnerToken();
    set({ currentPartner: null, token: null, isAuthenticated: false });
  },

  partners: [],

  fetchPartners: async () => {
    const token = get().token || getPartnerToken();
    if (!token) return;
    try {
      const res = await fetch("/api/admin/partners", {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) {
        const list = await res.json();
        set({ partners: Array.isArray(list) ? list : [] });
      }
    } catch {}
  },

  addPartner: async (partnerData: any) => {
    const token = get().token || getPartnerToken();
    if (!token) return { success: false, error: "Not authenticated" };
    try {
      const res = await fetch("/api/admin/partners", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(partnerData),
      });
      const data = await res.json();
      if (res.ok) {
        await get().fetchPartners();
        return { success: true, data };
      }
      return { success: false, error: data.error || "Failed to create partner" };
    } catch (err: any) {
      return { success: false, error: err.message };
    }
  },

  updatePartner: async (id: string | number, updates: any) => {
    const token = get().token || getPartnerToken();
    if (!token) return;
    try {
      if (updates.status) {
        await fetch(`/api/admin/partners/${id}/status`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ status: updates.status }),
        });
        await get().fetchPartners();
      }
    } catch {}
  },

  deletePartner: async (id: string | number) => {
    const token = get().token || getPartnerToken();
    if (!token) return;
    try {
      await fetch(`/api/admin/partners/${id}/status`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ status: "SUSPENDED" }),
      });
      await get().fetchPartners();
    } catch {}
  },

  resetPartnersToDefault: () => {
    get().fetchPartners();
  },
}));
