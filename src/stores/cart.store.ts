"use client";

import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import type { StoreCart } from "@/types/cart";
import {
  getCart,
  addToCart,
  updateCartItem,
  removeCartItem,
  applyCoupon,
  removeCoupon,
  selectShippingRate,
} from "@/lib/store-api";
import toast from "react-hot-toast";

interface CartState {
  cart: StoreCart | null;
  isLoading: boolean;
  isDrawerOpen: boolean;
  cartCount: number;

  // Actions
  fetchCart: () => Promise<void>;
  addItem: (productId: number, quantity?: number, variationId?: number, variation?: Record<string, string>) => Promise<void>;
  updateItem: (itemKey: string, quantity: number) => Promise<void>;
  removeItem: (itemKey: string) => Promise<void>;
  applyCouponCode: (code: string) => Promise<void>;
  removeCouponCode: (code: string) => Promise<void>;
  selectRate: (packageId: number, rateId: string) => Promise<void>;
  openDrawer: () => void;
  closeDrawer: () => void;
  toggleDrawer: () => void;
  clearCart: () => void;
}

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      cart: null,
      isLoading: false,
      isDrawerOpen: false,
      cartCount: 0,

      fetchCart: async () => {
        try {
          set({ isLoading: true });
          const cart = await getCart();
          set({ cart, cartCount: cart.items_count });
        } catch (error) {
          console.error("[Cart] fetchCart error:", error);
        } finally {
          set({ isLoading: false });
        }
      },

      addItem: async (productId, quantity = 1, variationId, variation) => {
        try {
          set({ isLoading: true });
          const cart = await addToCart(productId, quantity, variationId, variation);
          set({ cart, cartCount: cart.items_count, isDrawerOpen: true });
          toast.success("Item added to cart");
        } catch (error: unknown) {
          const msg = error instanceof Error ? error.message : "Failed to add item";
          toast.error(msg);
        } finally {
          set({ isLoading: false });
        }
      },

      updateItem: async (itemKey, quantity) => {
        try {
          set({ isLoading: true });
          const cart = await updateCartItem(itemKey, quantity);
          set({ cart, cartCount: cart.items_count });
        } catch {
          toast.error("Failed to update cart");
        } finally {
          set({ isLoading: false });
        }
      },

      removeItem: async (itemKey) => {
        try {
          set({ isLoading: true });
          const cart = await removeCartItem(itemKey);
          set({ cart, cartCount: cart.items_count });
          toast.success("Item removed");
        } catch {
          toast.error("Failed to remove item");
        } finally {
          set({ isLoading: false });
        }
      },

      applyCouponCode: async (code) => {
        try {
          set({ isLoading: true });
          const cart = await applyCoupon(code);
          set({ cart });
          toast.success("Coupon applied!");
        } catch {
          toast.error("Invalid or expired coupon");
        } finally {
          set({ isLoading: false });
        }
      },

      removeCouponCode: async (code) => {
        try {
          set({ isLoading: true });
          const cart = await removeCoupon(code);
          set({ cart });
          toast.success("Coupon removed");
        } catch {
          toast.error("Failed to remove coupon");
        } finally {
          set({ isLoading: false });
        }
      },

      selectRate: async (packageId, rateId) => {
        try {
          set({ isLoading: true });
          const cart = await selectShippingRate(packageId, rateId);
          set({ cart });
        } catch {
          toast.error("Failed to select shipping rate");
        } finally {
          set({ isLoading: false });
        }
      },

      openDrawer: () => set({ isDrawerOpen: true }),
      closeDrawer: () => set({ isDrawerOpen: false }),
      toggleDrawer: () => set((state) => ({ isDrawerOpen: !state.isDrawerOpen })),
      clearCart: () => set({ cart: null, cartCount: 0 }),
    }),
    {
      name: "shopae-cart-storage",
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({ cart: state.cart, cartCount: state.cartCount }),
    }
  )
);
