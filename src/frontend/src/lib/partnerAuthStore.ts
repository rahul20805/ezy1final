import { create } from "zustand";
import { persist } from "zustand/middleware";

export type AdminRole =
  | "super_owner"
  | "SUPER_ADMIN"
  | "ADMIN"
  | "CONTENT_MANAGER"
  | "ORDER_MANAGER"
  | "SUPPORT_AGENT"
  | "FINANCE_MANAGER"
  | "PARTNER_MANAGER"
  | "partner";

export interface PartnerPermissions {
  canManageShop: boolean;
  canManageServices: boolean;
  canManageBookings: boolean;
  canManageOrders: boolean;
  canManageEnquiries: boolean;
  canManageCustomers: boolean;
  canManageGallery: boolean;
  canManageReviews: boolean;
  canManageWebsiteContent: boolean;
  canManageCategories: boolean;
  canManageOwnerSettings: boolean;
  canManageHealthcare?: boolean;
  canManageTransport?: boolean;
  canManageDelivery?: boolean;
  canManageFinance?: boolean;
  canManageAuditLogs?: boolean;
  canManageAdmins?: boolean;
}

export interface PartnerAccount {
  id: string; // Unique login ID e.g. "admin", "sharma_grocery"
  password: string;
  businessName: string;
  ownerName: string;
  category:
    | "All"
    | "Grocery"
    | "Pharmacy"
    | "Services"
    | "Transport"
    | "Workshops"
    | "Healthcare"
    | "System";
  role: AdminRole;
  phone: string;
  email: string;
  city: string;
  vendorId?: number;
  permissions: PartnerPermissions;
  status: "active" | "suspended" | "pending";
}

export const DEFAULT_PARTNER_ACCOUNTS: PartnerAccount[] = [
  {
    id: "admin",
    password: "admin123",
    businessName: "EZY1 Platform Headquarters",
    ownerName: "Alka & Rahul Yadav",
    category: "All",
    role: "super_owner",
    phone: "+91 98765 43210",
    email: "admin@ezy1.in",
    city: "Bengaluru",
    vendorId: 0,
    status: "active",
    permissions: {
      canManageShop: true,
      canManageServices: true,
      canManageBookings: true,
      canManageOrders: true,
      canManageEnquiries: true,
      canManageCustomers: true,
      canManageGallery: true,
      canManageReviews: true,
      canManageWebsiteContent: true,
      canManageCategories: true,
      canManageOwnerSettings: true,
      canManageHealthcare: true,
      canManageTransport: true,
      canManageDelivery: true,
      canManageFinance: true,
      canManageAuditLogs: true,
      canManageAdmins: true,
    },
  },
  {
    id: "sharma_grocery",
    password: "partner123",
    businessName: "Sharma Kirana Store",
    ownerName: "Ramesh Sharma",
    category: "Grocery",
    role: "partner",
    phone: "9876543210",
    email: "sharma.kirana@partner.ezy1.in",
    city: "Mumbai",
    vendorId: 1,
    status: "active",
    permissions: {
      canManageShop: true,
      canManageServices: false,
      canManageBookings: false,
      canManageOrders: true,
      canManageEnquiries: true,
      canManageCustomers: true,
      canManageGallery: true,
      canManageReviews: true,
      canManageWebsiteContent: false,
      canManageCategories: false,
      canManageOwnerSettings: false,
    },
  },
  {
    id: "nair_pharma",
    password: "partner123",
    businessName: "Nair Ayurveda & Pharma",
    ownerName: "Krishnan Nair",
    category: "Pharmacy",
    role: "partner",
    phone: "9845012345",
    email: "nair.pharma@partner.ezy1.in",
    city: "Thiruvananthapuram",
    vendorId: 2,
    status: "active",
    permissions: {
      canManageShop: true,
      canManageServices: false,
      canManageBookings: false,
      canManageOrders: true,
      canManageEnquiries: true,
      canManageCustomers: true,
      canManageGallery: true,
      canManageReviews: true,
      canManageWebsiteContent: false,
      canManageCategories: false,
      canManageOwnerSettings: false,
    },
  },
  {
    id: "suresh_services",
    password: "partner123",
    businessName: "Suresh Electricals & Fixes",
    ownerName: "Suresh Sharma",
    category: "Services",
    role: "partner",
    phone: "9812345670",
    email: "suresh.services@partner.ezy1.in",
    city: "Bengaluru",
    vendorId: 4,
    status: "active",
    permissions: {
      canManageShop: false,
      canManageServices: true,
      canManageBookings: true,
      canManageOrders: true,
      canManageEnquiries: true,
      canManageCustomers: true,
      canManageGallery: true,
      canManageReviews: true,
      canManageWebsiteContent: false,
      canManageCategories: false,
      canManageOwnerSettings: false,
    },
  },
  {
    id: "rajesh_transport",
    password: "partner123",
    businessName: "Rajesh Fleet & Logistics",
    ownerName: "Rajesh Kumar",
    category: "Transport",
    role: "partner",
    phone: "9900112233",
    email: "rajesh.transport@partner.ezy1.in",
    city: "Bengaluru",
    vendorId: 5,
    status: "active",
    permissions: {
      canManageShop: false,
      canManageServices: false,
      canManageBookings: true,
      canManageOrders: true,
      canManageEnquiries: true,
      canManageCustomers: false,
      canManageGallery: false,
      canManageReviews: true,
      canManageWebsiteContent: false,
      canManageCategories: false,
      canManageOwnerSettings: false,
    },
  },
];

interface PartnerAuthState {
  token: string | null;
  currentPartner: PartnerAccount | null;
  partners: PartnerAccount[];
  isAuthenticated: boolean;
  login: (id: string, password: string) => Promise<{ success: boolean; error?: string }>;
  logout: () => void;
  addPartner: (partner: PartnerAccount) => void;
  updatePartner: (id: string, updates: Partial<PartnerAccount>) => Promise<void>;
  deletePartner: (id: string) => void;
  resetPartnersToDefault: () => void;
}

export const usePartnerAuth = create<PartnerAuthState>()(
  persist(
    (set, get) => ({
      token: null,
      currentPartner: DEFAULT_PARTNER_ACCOUNTS[0], // Default logged in as Super Admin
      partners: DEFAULT_PARTNER_ACCOUNTS,
      isAuthenticated: true,

      login: async (id, password) => {
        try {
          const res = await fetch("/api/auth/partner/login", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ username: id.trim(), password: password.trim() }),
          });
          const data = await res.json();
          if (data && data.success && data.token) {
            const partnerData: PartnerAccount = {
              id: data.user.username || id.trim(),
              password: "",
              businessName: data.user.vendor?.businessName || data.user.name,
              ownerName: data.user.name,
              category: data.user.vendor?.category || "Grocery",
              role: data.user.role || (id.trim() === "admin" ? "super_owner" : "partner"),
              phone: data.user.vendor?.phone || data.user.phone || "",
              email: data.user.vendor?.email || data.user.email || "",
              city: data.user.vendor?.city || data.user.city || "",
              vendorId: data.user.vendorId || (data.user.vendor ? data.user.vendor.id : 0),
              status: "active",
              permissions:
                data.user.role === "super_owner"
                  ? DEFAULT_PARTNER_ACCOUNTS[0].permissions
                  : {
                      canManageShop: true,
                      canManageServices: true,
                      canManageBookings: true,
                      canManageOrders: true,
                      canManageEnquiries: true,
                      canManageCustomers: true,
                      canManageGallery: true,
                      canManageReviews: true,
                      canManageWebsiteContent: false,
                      canManageCategories: false,
                      canManageOwnerSettings: false,
                    },
            };
            set({ currentPartner: partnerData, token: data.token, isAuthenticated: true });
            return { success: true };
          }
          if (data && data.error) {
            return { success: false, error: data.error };
          }
        } catch (err) {
          console.warn("Backend API login network fallback to local auth store:", err);
        }

        // Fallback check against cached partners if offline
        const found = get().partners.find(
          (p) =>
            p.id.toLowerCase() === id.trim().toLowerCase() &&
            p.password === password.trim(),
        );

        if (!found) {
          return {
            success: false,
            error: "Invalid Admin / Partner ID or Password.",
          };
        }

        if (found.status === "suspended") {
          return {
            success: false,
            error: "This partner account has been suspended by administration.",
          };
        }

        set({ currentPartner: found, isAuthenticated: true });
        return { success: true };
      },

      logout: () => {
        set({ currentPartner: null, token: null, isAuthenticated: false });
      },

      addPartner: (partner) => {
        set({
          partners: [
            ...get().partners.filter((p) => p.id !== partner.id),
            partner,
          ],
        });
      },

      updatePartner: async (id, updates) => {
        const current = get().partners.find((p) => p.id === id);
        const vendorId = updates.vendorId || current?.vendorId;
        const token = get().token;

        if (vendorId && token) {
          try {
            await fetch(`/api/vendors/${vendorId}`, {
              method: "PUT",
              headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
              },
              body: JSON.stringify(updates),
            });
          } catch (err) {
            console.error("Failed to sync vendor update with server API:", err);
          }
        }

        set({
          partners: get().partners.map((p) =>
            p.id === id ? { ...p, ...updates } : p,
          ),
          currentPartner:
            get().currentPartner?.id === id
              ? { ...get().currentPartner!, ...updates }
              : get().currentPartner,
        });
      },

      deletePartner: (id) => {
        set({
          partners: get().partners.filter((p) => p.id !== id),
          currentPartner:
            get().currentPartner?.id === id ? null : get().currentPartner,
          isAuthenticated:
            get().currentPartner?.id === id ? false : get().isAuthenticated,
        });
      },

      resetPartnersToDefault: () => {
        set({
          partners: DEFAULT_PARTNER_ACCOUNTS,
          currentPartner: DEFAULT_PARTNER_ACCOUNTS[0],
          isAuthenticated: true,
        });
      },
    }),
    {
      name: "ezy1_partner_auth_v3",
    },
  ),
);
