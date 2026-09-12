import { useQuery } from "@tanstack/react-query";
import {
  MOCK_USER_CITY,
  MOCK_USER_NAME,
  MOCK_WALLET_BALANCE,
  appointments,
  busRoutes,
  doctors,
  rides,
  walletTransactions,
} from "../mock-data";
import type { Product, ProductCategory, User, Vendor } from "../types";
import { useStoreData } from "./storeData";

// Real Reactive Hook connected to Live Store & API
export function useProducts() {
  const store = useStoreData();
  const query = useQuery({
    queryKey: ["products"],
    queryFn: async () => {
      try {
        const res = await fetch("/api/products");
        if (res.ok) {
          const data = await res.json();
          if (Array.isArray(data) && data.length > 0) {
            return data;
          }
        }
      } catch (err) {
        console.warn("Products API fetch error, falling back to store:", err);
      }
      return store.products.filter((p) => p.published);
    },
    initialData: store.products.filter((p) => p.published),
  });

  return {
    data: query.data || store.products.filter((p) => p.published),
    isLoading: query.isLoading,
    isError: query.isError,
  };
}

export function useCategories() {
  const store = useStoreData();
  const query = useQuery({
    queryKey: ["categories"],
    queryFn: async () => {
      try {
        const res = await fetch("/api/categories");
        if (res.ok) {
          const data = await res.json();
          if (Array.isArray(data) && data.length > 0) {
            return data.map((c: any) => ({
              id: c.id,
              name: c.name,
              image:
                c.image ||
                "https://images.unsplash.com/photo-1542838132-92c53300491e?w=500&q=80",
              description: c.description,
              itemCount: store.products.filter(
                (p) =>
                  p.category.toLowerCase() === c.name.toLowerCase() ||
                  p.categoryIds.includes(c.id),
              ).length,
            }));
          }
        }
      } catch (err) {
        console.warn("Categories API fetch error:", err);
      }
      return store.categories
        .filter((c) => c.published)
        .map((c) => ({
          id: c.id,
          name: c.name,
          image: c.image,
          description: c.description,
          itemCount: store.products.filter(
            (p) =>
              p.category.toLowerCase() === c.name.toLowerCase() ||
              p.categoryIds.includes(c.id),
          ).length,
        }));
    },
    initialData: store.categories
      .filter((c) => c.published)
      .map((c) => ({
        id: c.id,
        name: c.name,
        image: c.image,
        description: c.description,
        itemCount: store.products.filter(
          (p) =>
            p.category.toLowerCase() === c.name.toLowerCase() ||
            p.categoryIds.includes(c.id),
        ).length,
      })),
  });

  return {
    data: query.data,
    isLoading: query.isLoading,
    isError: query.isError,
  };
}

export function useVendors() {
  return useQuery({
    queryKey: ["vendors"],
    queryFn: async (): Promise<Vendor[]> => {
      try {
        const res = await fetch("/api/vendors");
        if (res.ok) {
          const data = await res.json();
          if (Array.isArray(data) && data.length > 0) {
            return data.map((v: any) => ({
              id: v.id,
              businessName: v.businessName,
              ownerName: v.ownerName || "",
              category: v.category,
              city: v.city,
              address: v.address,
              phone: v.phone,
              status: v.status || "approved",
              rating: v.rating || 4.8,
              totalOrders: v.totalOrders || 0,
              joinedAt: v.joinedAt || "2025-10-15",
            }));
          }
        }
      } catch (err) {
        console.warn("Failed to fetch vendors from API:", err);
      }
      return [
        {
          id: 1,
          businessName: "Sharma Kirana Store",
          ownerName: "Ramesh Sharma",
          category: "Grocery",
          city: "Mumbai",
          address: "12, Andheri West Market",
          phone: "9876543210",
          status: "approved",
          rating: 4.8,
          totalOrders: 340,
          joinedAt: "2025-10-15",
        },
        {
          id: 2,
          businessName: "Nair Ayurveda Pharma",
          ownerName: "Krishnan Nair",
          category: "Pharmacy",
          city: "Thiruvananthapuram",
          address: "45, East Fort Road",
          phone: "9845012345",
          status: "approved",
          rating: 4.9,
          totalOrders: 215,
          joinedAt: "2025-11-02",
        },
      ];
    },
  });
}

export function useCurrentUserProfile() {
  return useQuery({
    queryKey: ["currentUser"],
    queryFn: async (): Promise<User> => ({
      id: 1,
      name: MOCK_USER_NAME,
      phone: "9876543210",
      email: "amit.verma@email.com",
      city: MOCK_USER_CITY,
      role: "user",
      createdAt: "2025-09-01",
    }),
  });
}

export function useDoctors() {
  return useQuery({
    queryKey: ["doctors"],
    queryFn: async () => doctors,
  });
}

export function useAppointments() {
  return useQuery({
    queryKey: ["appointments"],
    queryFn: async () => appointments,
  });
}

export function useBusRoutes() {
  return useQuery({
    queryKey: ["busRoutes"],
    queryFn: async () => busRoutes,
  });
}

export function useRides() {
  return useQuery({
    queryKey: ["rides"],
    queryFn: async () => rides,
  });
}

export function useWallet() {
  return useQuery({
    queryKey: ["wallet"],
    queryFn: async () => ({
      balance: MOCK_WALLET_BALANCE,
      transactions: walletTransactions,
    }),
  });
}
