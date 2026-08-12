import { useQuery } from "@tanstack/react-query";
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

const API_BASE = "http://localhost:3000/api";

async function fetchApi<T>(endpoint: string): Promise<T> {
  const res = await fetch(`${API_BASE}${endpoint}`);
  if (!res.ok) throw new Error("Failed to fetch data");
  return res.json();
}

// Simulated delay to mimic real backend calls for parts not yet in DB
function delay<T>(data: T, ms = 400): Promise<T> {
  return new Promise((resolve) => setTimeout(() => resolve(data), ms));
}

// === REAL BACKEND CALLS ===

export function useVendors() {
  return useQuery({
    queryKey: ["vendors"],
    queryFn: () => fetchApi<Vendor[]>("/vendors"),
  });
}

export function useProducts() {
  return useQuery({
    queryKey: ["products"],
    queryFn: () => fetchApi<Product[]>("/products"),
  });
}

export function useCurrentUserProfile() {
  return useQuery({
    queryKey: ["currentUser"],
    queryFn: async () => {
      // Temporarily fetch all and pick the first one until we have real auth
      const users = await fetchApi<User[]>("/users");
      return users[0] || {
        id: 1,
        name: MOCK_USER_NAME,
        phone: "9876543210",
        email: "amit.verma@email.com",
        city: MOCK_USER_CITY,
        role: "user",
        createdAt: "2025-09-01",
      };
    },
  });
}

export function useCategories() {
  return useQuery({
    queryKey: ["categories"],
    queryFn: async () => {
      // Generate unique categories based on products in DB
      const products = await fetchApi<Product[]>("/products");
      const categorySet = new Set(products.map(p => p.category));
      
      const categories: ProductCategory[] = [];
      let id = 1;
      categorySet.forEach(name => {
        categories.push({
          id: id++,
          name,
          icon: "shopping-bag",
          color: "bg-blue-100",
          itemCount: products.filter(p => p.category === name).length
        });
      });
      return categories;
    },
  });
}

// === PENDING REAL DB IMPLEMENTATION ===

export function useDoctors() {
  return useQuery({
    queryKey: ["doctors"],
    queryFn: () => delay(doctors),
  });
}

export function useAppointments() {
  return useQuery({
    queryKey: ["appointments"],
    queryFn: () => delay(appointments),
  });
}

export function useBusRoutes() {
  return useQuery({
    queryKey: ["busRoutes"],
    queryFn: () => delay(busRoutes),
  });
}

export function useRides() {
  return useQuery({
    queryKey: ["rides"],
    queryFn: () => delay(rides),
  });
}

export function useWallet() {
  return useQuery({
    queryKey: ["wallet"],
    queryFn: () =>
      delay({
        balance: MOCK_WALLET_BALANCE,
        transactions: walletTransactions,
      }),
  });
}
