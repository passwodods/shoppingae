import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

// ──────────────────────────────────────────────
// Tailwind class merger
// ──────────────────────────────────────────────
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// ──────────────────────────────────────────────
// Currency formatting
// ──────────────────────────────────────────────
export function formatPrice(
  amount: string | number,
  options: {
    currencyCode?: string;
    locale?: string;
    minimumFractionDigits?: number;
  } = {}
): string {
  const {
    currencyCode = process.env.NEXT_PUBLIC_CURRENCY ?? "AED",
    locale = process.env.NEXT_PUBLIC_LOCALE ?? "en-AE",
    minimumFractionDigits = 2,
  } = options;

  const num = typeof amount === "string" ? parseFloat(amount) : amount;

  if (isNaN(num)) return "";

  return new Intl.NumberFormat(locale, {
    style: "currency",
    currency: currencyCode,
    minimumFractionDigits,
    maximumFractionDigits: 2,
  }).format(num);
}

// Minor units → decimal (WooCommerce Store API returns prices in minor units)
export function fromMinorUnits(amount: string | number, minorUnit = 2): number {
  const num = typeof amount === "string" ? parseInt(amount, 10) : amount;
  return num / Math.pow(10, minorUnit);
}

export function formatMinorPrice(amount: string | number, minorUnit = 2): string {
  return formatPrice(fromMinorUnits(amount, minorUnit));
}

// ──────────────────────────────────────────────
// Slug helpers
// ──────────────────────────────────────────────
export function slugify(text: string): string {
  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/\s+/g, "-")
    .replace(/[^\w-]+/g, "")
    .replace(/--+/g, "-");
}

export function buildProductUrl(slug: string): string {
  return `/product/${slug}`;
}

export function buildCategoryUrl(slug: string): string {
  return `/category/${slug}`;
}

export function buildSearchUrl(query: string, params?: Record<string, string>): string {
  const searchParams = new URLSearchParams({ q: query, ...params });
  return `/search?${searchParams.toString()}`;
}

// ──────────────────────────────────────────────
// String helpers
// ──────────────────────────────────────────────
export function truncate(str: string, maxLength: number): string {
  if (str.length <= maxLength) return str;
  return str.slice(0, maxLength).trimEnd() + "…";
}

export function stripHtml(html: string): string {
  return html.replace(/<[^>]*>/g, "").trim();
}

export function decodeHtmlEntities(text: string): string {
  return text
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#039;/g, "'")
    .replace(/&nbsp;/g, " ");
}

// ──────────────────────────────────────────────
// Date helpers
// ──────────────────────────────────────────────
export function formatDate(dateString: string, locale = "en-AE"): string {
  const date = new Date(dateString);
  return date.toLocaleDateString(locale, {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

export function formatRelativeDate(dateString: string): string {
  const date = new Date(dateString);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

  if (diffDays === 0) return "Today";
  if (diffDays === 1) return "Yesterday";
  if (diffDays < 7) return `${diffDays} days ago`;
  if (diffDays < 30) return `${Math.floor(diffDays / 7)} weeks ago`;
  if (diffDays < 365) return `${Math.floor(diffDays / 30)} months ago`;
  return `${Math.floor(diffDays / 365)} years ago`;
}

// ──────────────────────────────────────────────
// WP URL helpers (strip WP domain, replace with Next.js domain)
// ──────────────────────────────────────────────
export function wpUrlToRelative(url: string): string {
  const wpUrl = process.env.NEXT_PUBLIC_WP_URL ?? "";
  return url.replace(wpUrl, "");
}

// ──────────────────────────────────────────────
// Array helpers
// ──────────────────────────────────────────────
export function chunk<T>(array: T[], size: number): T[][] {
  const chunks: T[][] = [];
  for (let i = 0; i < array.length; i += size) {
    chunks.push(array.slice(i, i + size));
  }
  return chunks;
}

export function unique<T>(array: T[]): T[] {
  return [...new Set(array)];
}

// ──────────────────────────────────────────────
// Rating helpers
// ──────────────────────────────────────────────
export function ratingToPercent(rating: number, max = 5): number {
  return (rating / max) * 100;
}

// ──────────────────────────────────────────────
// Stock helpers
// ──────────────────────────────────────────────
export function getStockLabel(
  stockStatus: "instock" | "outofstock" | "onbackorder",
  quantity?: number | null
): string {
  if (stockStatus === "outofstock") return "Out of stock";
  if (stockStatus === "onbackorder") return "Available on backorder";
  if (quantity !== null && quantity !== undefined && quantity <= 5) {
    return `Only ${quantity} left`;
  }
  return "In stock";
}

export function isInStock(stockStatus: "instock" | "outofstock" | "onbackorder"): boolean {
  return stockStatus !== "outofstock";
}
