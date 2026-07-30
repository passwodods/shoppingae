"use client";

import { useEffect } from "react";
import { useCartStore } from "@/stores/cart.store";

/**
 * Initialises the cart on first client render.
 * Used in layouts to ensure cart count is populated.
 */
export function useCartInit() {
  const { fetchCart, cart } = useCartStore();

  useEffect(() => {
    if (!cart) {
      fetchCart();
    }
  }, []);
}
