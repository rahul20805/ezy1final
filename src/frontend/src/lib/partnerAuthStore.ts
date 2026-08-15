import { create } from "zustand";
import { persist } from "zustand/middleware";

export interface PartnerAccount {
  id: string; // login username/admin ID
  password: string; // password
  businessName: string;
  ownerName: string;
  category: "all" | "Grocery" | "Pharmacy" | "Healthcare" | "Services" | "Transport" | "Workshops";
  role: "super_owner" | "partner" | "doctor" | "driver" | "service_provider";
  phone: string;
  email: string;
  city: string;
  vendorId: number;
  status: "active" | "suspended" | "pending";
  permissions: {
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
  };
}

const DEFAULT_PARTNERS: PartnerAccount[] = [
  {
    id: "admin",
    password: "admin123",
    businessName: "ezy1 Super Headquarters",
    ownerName: "Alka & Rahul Yadav (Super Admin)",
    category: "all",
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
    email: "sharma.kirana@example.com",
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
    email: "nair.pharma@example.com",
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
    businessName: "Suresh Electricals & Home Services",
    ownerName: "Suresh Sharma",
    category: "Services",
    role: "service_provider",
    phone: "9812345670",
    email: "suresh.services@example.com",
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
    businessName: "Rajesh Express Logistics & Cabs",
    ownerName: "Rajesh Kumar",
    category: "Transport",
    role: "driver",
    phone: "9822334455",
    email: "rajesh.transport@example.com",
    city: "Bengaluru",
    vendorId: 5,
    status: "active",
    permissions: {
      canManageShop: false,
      canManageServices: false,
      canManageBookings: true,
      canManageOrders: true,
      canManageEnquiries: true,
      canManageCustomers: true,
      canManageGallery: false,
      canManageReviews: true,
      canManageWebsiteContent: false,
      canManageCategories: false,
      canManageOwnerSettings: false,
    },
  },
];

interface PartnerAuthState {
  partners: PartnerAccount[];
  currentPartner: PartnerAccount | null;
  isAuthenticated: boolean;
  
  // Actions
  login: (id: string, password: string) => { success: boolean; error?: string };
  logout: () => void;
  addPartner: (partner: PartnerAccount) => void;
  updatePartner: (id: string, updates: Partial<PartnerAccount>) => void;
  deletePartner: (id: string) => void;
  resetPartnersToDefault: () => void;
}

export const usePartnerAuth = create<PartnerAuthState>()(
  persist(
    (set, get) => ({
      partners: DEFAULT_PARTNERS,
      currentPartner: DEFAULT_PARTNERS[0], // Default pre-authenticated as super admin for instant smooth demoing
      isAuthenticated: true,

      login: (id, password) => {
        const cleanId = id.trim().toLowerCase();
        const partner = get().partners.find(
          (p) => p.id.toLowerCase() === cleanId && p.password === password.trim()
        );

        if (!partner) {
          return { success: false, error: "Invalid Admin/Partner ID or Password." };
        }

        if (partner.status === "suspended") {
          return { success: false, error: "This partner account has been suspended by Admin." };
        }

        set({ currentPartner: partner, isAuthenticated: true });
        return { success: true };
      },

      logout: () => {
        set({ currentPartner: null, isAuthenticated: false });
      },

      addPartner: (partner) => {
        set({ partners: [...get().partners, partner] });
      },

      updatePartner: (id, updates) => {
        set({
          partners: get().partners.map((p) => (p.id === id ? { ...p, ...updates } : p)),
          currentPartner:
            get().currentPartner?.id === id
              ? { ...get().currentPartner!, ...updates }
              : get().currentPartner,
        });
      },

      deletePartner: (id) => {
        set({
          partners: get().partners.filter((p) => p.id !== id),
          currentPartner: get().currentPartner?.id === id ? null : get().currentPartner,
          isAuthenticated: get().currentPartner?.id === id ? false : get().isAuthenticated,
        });
      },

      resetPartnersToDefault: () => {
        set({
          partners: DEFAULT_PARTNERS,
          currentPartner: DEFAULT_PARTNERS[0],
          isAuthenticated: true,
        });
      },
    }),
    {
      name: "ezy1_partner_auth_v2",
    }
  )
);
