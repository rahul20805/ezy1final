import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { Product } from "../types";
import { useStoreData } from "./storeData";

export interface CartItem {
  product: Product;
  quantity: number;
}

interface CartState {
  items: Record<number, CartItem>;
  totalItems: number;
  totalAmount: number;
  addItem: (product: Product) => void;
  removeItem: (productId: number) => void;
  updateQuantity: (productId: number, quantity: number) => void;
  clearCart: () => void;
}

export const useCartStore = create<CartState>()(
  persist(
    (set) => ({
      items: {},
      totalItems: 0,
      totalAmount: 0,

      addItem: (product) => {
        try {
          const store = useStoreData.getState();
          const savedUser =
            typeof localStorage !== "undefined"
              ? JSON.parse(localStorage.getItem("ezy1_auth_user") || "null")
              : null;
          store.trackCartActivity({
            action: "ADD",
            productId: product.id,
            productName: product.name,
            category: (product as any).category || (product as any).categoryId || "General",
            partnerId: (product as any).vendorId || 1,
            partnerName: (product as any).vendorName || (product as any).brand || "Local Partner",
            quantity: 1,
            price: product.price,
            userName: savedUser?.name || "Active Customer",
            userPhone: savedUser?.phone || "9876543210",
          });
        } catch (e) {
          // Non-blocking tracking
        }

        return set((state) => {
          const existing = state.items[product.id];
          const quantity = existing ? existing.quantity + 1 : 1;
          const newItems = {
            ...state.items,
            [product.id]: { product, quantity },
          };

          return {
            items: newItems,
            totalItems: state.totalItems + 1,
            totalAmount: state.totalAmount + product.price,
          };
        });
      },

      removeItem: (productId) =>
        set((state) => {
          const existing = state.items[productId];
          if (!existing) return state;

          const newItems = { ...state.items };
          delete newItems[productId];

          return {
            items: newItems,
            totalItems: state.totalItems - existing.quantity,
            totalAmount:
              state.totalAmount - existing.product.price * existing.quantity,
          };
        }),

      updateQuantity: (productId, quantity) =>
        set((state) => {
          const existing = state.items[productId];
          if (!existing) return state;

          if (quantity <= 0) {
            const newItems = { ...state.items };
            delete newItems[productId];
            return {
              items: newItems,
              totalItems: state.totalItems - existing.quantity,
              totalAmount:
                state.totalAmount - existing.product.price * existing.quantity,
            };
          }

          const diff = quantity - existing.quantity;
          const newItems = {
            ...state.items,
            [productId]: { ...existing, quantity },
          };

          return {
            items: newItems,
            totalItems: state.totalItems + diff,
            totalAmount: state.totalAmount + existing.product.price * diff,
          };
        }),

      clearCart: () => set({ items: {}, totalItems: 0, totalAmount: 0 }),
    }),
    {
      name: "ezy1-cart",
    },
  ),
);
