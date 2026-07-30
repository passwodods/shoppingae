"use client";

import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

interface WishlistItem {
  id: number;
  slug: string;
  name: string;
  price: string;
  image: string;
  addedAt: string;
}

interface WishlistState {
  items: WishlistItem[];
  addItem: (item: WishlistItem) => void;
  removeItem: (id: number) => void;
  toggleItem: (item: WishlistItem) => void;
  isInWishlist: (id: number) => boolean;
  clearWishlist: () => void;
}

export const useWishlistStore = create<WishlistState>()(
  persist(
    (set, get) => ({
      items: [],

      addItem: (item) => {
        const exists = get().items.find((i) => i.id === item.id);
        if (!exists) {
          set((state) => ({ items: [...state.items, item] }));
        }
      },

      removeItem: (id) => {
        set((state) => ({ items: state.items.filter((i) => i.id !== id) }));
      },

      toggleItem: (item) => {
        const exists = get().items.find((i) => i.id === item.id);
        if (exists) {
          get().removeItem(item.id);
        } else {
          get().addItem(item);
        }
      },

      isInWishlist: (id) => {
        return get().items.some((i) => i.id === id);
      },

      clearWishlist: () => set({ items: [] }),
    }),
    {
      name: "shopae-wishlist",
      storage: createJSONStorage(() => localStorage),
    }
  )
);
