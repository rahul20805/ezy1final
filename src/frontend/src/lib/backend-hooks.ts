import { useQuery } from "@tanstack/react-query";
import { useStoreData } from "./storeData";
import type { User, Product, ProductCategory, Vendor } from "../types";
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

// Real Reactive Hook connected to Live Store
export function useProducts() {
  const store = useStoreData();
  return {
    data: store.products.filter((p) => p.published),
    isLoading: false,
    isError: false,
  };
}

export function useCategories() {
  const store = useStoreData();
  const categories: ProductCategory[] = store.categories
    .filter((c) => c.published)
    .map((c) => ({
      id: c.id,
      name: c.name,
      image: c.image,
      description: c.description,
      itemCount: store.products.filter(
        (p) => p.category.toLowerCase() === c.name.toLowerCase() || p.categoryIds.includes(c.id)
      ).length,
    }));

  return {
    data: categories,
    isLoading: false,
    isError: false,
  };
}

export function useVendors() {
  return useQuery({
    queryKey: ["vendors"],
    queryFn: async (): Promise<Vendor[]> => [
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
    ],
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
