"use client";

import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import type { AuthToken } from "@/types/customer";
import { saveToken, saveUser, clearToken } from "@/lib/auth";

interface AuthState {
  token: string | null;
  user: AuthToken | null;
  customerId: number | null;
  isAuthenticated: boolean;
  isLoading: boolean;

  login: (token: string, user: AuthToken, customerId?: number) => void;
  logout: () => void;
  setLoading: (loading: boolean) => void;
  hydrateFromStorage: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      token: null,
      user: null,
      customerId: null,
      isAuthenticated: false,
      isLoading: false,

      login: (token, user, customerId) => {
        saveToken(token);
        saveUser(user);
        set({
          token,
          user,
          customerId: customerId ?? null,
          isAuthenticated: true,
        });
      },

      logout: () => {
        clearToken();
        set({
          token: null,
          user: null,
          customerId: null,
          isAuthenticated: false,
        });
      },

      setLoading: (loading) => set({ isLoading: loading }),

      hydrateFromStorage: () => {
        const token = typeof window !== "undefined"
          ? localStorage.getItem("shopae_auth_token")
          : null;
        if (token) {
          const rawUser = typeof window !== "undefined"
            ? localStorage.getItem("shopae_auth_user")
            : null;
          const user = rawUser ? JSON.parse(rawUser) : null;
          set({ token, user, isAuthenticated: true });
        }
      },
    }),
    {
      name: "shopae-auth",
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        token: state.token,
        user: state.user,
        customerId: state.customerId,
        isAuthenticated: state.isAuthenticated,
      }),
    }
  )
);
