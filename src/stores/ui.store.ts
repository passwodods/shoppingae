"use client";

import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

interface RecentlyViewedItem {
  id: number;
  slug: string;
  name: string;
  price: string;
  image: string;
  viewedAt: string;
}

interface UIState {
  // Overlays
  isMobileNavOpen: boolean;
  isSearchOpen: boolean;
  isMiniCartOpen: boolean;

  // Recently viewed
  recentlyViewed: RecentlyViewedItem[];

  // Drawer
  openMobileNav: () => void;
  closeMobileNav: () => void;
  openSearch: () => void;
  closeSearch: () => void;
  openMiniCart: () => void;
  closeMiniCart: () => void;

  // Recently viewed
  addRecentlyViewed: (item: RecentlyViewedItem) => void;
  clearRecentlyViewed: () => void;
}

export const useUIStore = create<UIState>()(
  persist(
    (set, get) => ({
      isMobileNavOpen: false,
      isSearchOpen: false,
      isMiniCartOpen: false,
      recentlyViewed: [],

      openMobileNav: () => set({ isMobileNavOpen: true }),
      closeMobileNav: () => set({ isMobileNavOpen: false }),
      openSearch: () => set({ isSearchOpen: true }),
      closeSearch: () => set({ isSearchOpen: false }),
      openMiniCart: () => set({ isMiniCartOpen: true }),
      closeMiniCart: () => set({ isMiniCartOpen: false }),

      addRecentlyViewed: (item) => {
        const current = get().recentlyViewed;
        const filtered = current.filter((i) => i.id !== item.id);
        const updated = [item, ...filtered].slice(0, 12); // max 12 items
        set({ recentlyViewed: updated });
      },

      clearRecentlyViewed: () => set({ recentlyViewed: [] }),
    }),
    {
      name: "shopae-ui",
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({ recentlyViewed: state.recentlyViewed }),
    }
  )
);
