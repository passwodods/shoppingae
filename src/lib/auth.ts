import axios from "axios";
import type { AuthToken, WCCustomer, LoginCredentials, RegisterData } from "@/types/customer";

const wpRestUrl = process.env.NEXT_PUBLIC_WP_REST_URL ?? "https://your-wordpress.com/wp-json";

// ──────────────────────────────────────────────
// JWT Authentication (via JWT Auth for WP REST API plugin)
// ──────────────────────────────────────────────
export async function loginCustomer(credentials: LoginCredentials): Promise<AuthToken> {
  const response = await axios.post<AuthToken>(
    `${wpRestUrl}/jwt-auth/v1/token`,
    credentials
  );
  return response.data;
}

export async function validateToken(token: string): Promise<boolean> {
  try {
    await axios.post(
      `${wpRestUrl}/jwt-auth/v1/token/validate`,
      {},
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );
    return true;
  } catch {
    return false;
  }
}

export async function registerCustomer(data: RegisterData): Promise<WCCustomer> {
  const response = await axios.post<WCCustomer>(
    `${wpRestUrl}/wc/v3/customers`,
    data,
    {
      params: {
        consumer_key: process.env.WC_CONSUMER_KEY,
        consumer_secret: process.env.WC_CONSUMER_SECRET,
      },
    }
  );
  return response.data;
}

export async function resetPassword(email: string): Promise<void> {
  await axios.post(`${wpRestUrl}/wc/v3/customers/recover_password`, { email }, {
    params: {
      consumer_key: process.env.WC_CONSUMER_KEY,
      consumer_secret: process.env.WC_CONSUMER_SECRET,
    },
  });
}

export async function getCustomerByToken(token: string): Promise<WCCustomer | null> {
  try {
    const response = await axios.get<WCCustomer>(
      `${wpRestUrl}/wp/v2/users/me`,
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );
    return response.data as unknown as WCCustomer;
  } catch {
    return null;
  }
}

// ──────────────────────────────────────────────
// Token storage helpers (client-side only)
// ──────────────────────────────────────────────
const TOKEN_KEY = "shopae_auth_token";
const USER_KEY = "shopae_auth_user";

export function saveToken(token: string): void {
  if (typeof window !== "undefined") {
    localStorage.setItem(TOKEN_KEY, token);
  }
}

export function getToken(): string | null {
  if (typeof window !== "undefined") {
    return localStorage.getItem(TOKEN_KEY);
  }
  return null;
}

export function clearToken(): void {
  if (typeof window !== "undefined") {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
  }
}

export function saveUser(user: AuthToken): void {
  if (typeof window !== "undefined") {
    localStorage.setItem(USER_KEY, JSON.stringify(user));
  }
}

export function getSavedUser(): AuthToken | null {
  if (typeof window !== "undefined") {
    const raw = localStorage.getItem(USER_KEY);
    return raw ? JSON.parse(raw) : null;
  }
  return null;
}
