import { cache } from "react";
import { unstable_cache } from "next/cache";
import {
  getProducts,
  getProduct,
  getCategories,
  getCategoryBySlug,
  getFeaturedProducts,
  getBestSellers,
  getNewArrivals,
  getProductVariations,
  getProductReviews,
  getRelatedProducts,
} from "./woocommerce";
import { getMenus, getHomepageData, buildMenuTree } from "./graphql";
import type { WCProductsQuery } from "@/types/product";

// ──────────────────────────────────────────────
// Cache tags
// ──────────────────────────────────────────────
export const CACHE_TAGS = {
  products: "products",
  product: (slug: string) => `product-${slug}`,
  categories: "categories",
  category: (slug: string) => `category-${slug}`,
  menus: "menus",
  homepage: "homepage",
  blog: "blog",
  post: (slug: string) => `post-${slug}`,
  cart: "cart",
} as const;

// ──────────────────────────────────────────────
// Cached data fetchers (ISR with tags)
// ──────────────────────────────────────────────
export const getCachedProducts = unstable_cache(
  async (query: WCProductsQuery) => getProducts(query),
  ["products"],
  { tags: [CACHE_TAGS.products], revalidate: 300 }
);

export const getCachedProduct = (slug: string) =>
  unstable_cache(
    async () => getProduct(slug),
    [`product-${slug}`],
    { tags: [CACHE_TAGS.products], revalidate: 300 }
  )();

const getCachedCategoriesInternal = unstable_cache(
  async () => getCategories(),
  ["categories"],
  { tags: [CACHE_TAGS.categories], revalidate: 60 }
);

export async function getCachedCategories(): Promise<any[]> {
  try {
    const cached = await getCachedCategoriesInternal();
    if (cached && cached.length > 0) {
      return cached;
    }
  } catch {}
  return getCategories();
}

export const getCachedCategory = (slug: string) =>
  unstable_cache(
    async () => getCategoryBySlug(slug),
    [`category-${slug}`],
    { tags: [CACHE_TAGS.categories], revalidate: 3600 }
  )();

export const getCachedFeaturedProducts = unstable_cache(
  async (perPage?: number) => getFeaturedProducts(perPage),
  ["featured-products"],
  { tags: [CACHE_TAGS.products], revalidate: 300 }
);

export const getCachedBestSellers = unstable_cache(
  async (perPage?: number) => getBestSellers(perPage),
  ["bestsellers"],
  { tags: [CACHE_TAGS.products], revalidate: 300 }
);

export const getCachedNewArrivals = unstable_cache(
  async (perPage?: number) => getNewArrivals(perPage),
  ["new-arrivals"],
  { tags: [CACHE_TAGS.products], revalidate: 300 }
);

export const getCachedProductVariations = (productId: number) =>
  unstable_cache(
    async () => getProductVariations(productId),
    [`product-variations-${productId}`],
    { tags: [CACHE_TAGS.products], revalidate: 300 }
  )();

export const getCachedProductReviews = (productId: number) =>
  unstable_cache(
    async () => getProductReviews(productId),
    [`product-reviews-${productId}`],
    { tags: [CACHE_TAGS.products], revalidate: 60 }
  )();

export const getCachedRelatedProducts = (productId: number, categoryId?: number, perPage?: number) =>
  unstable_cache(
    async () => getRelatedProducts(productId, categoryId, perPage),
    [`related-products-${productId}-${categoryId || 0}`],
    { tags: [CACHE_TAGS.products], revalidate: 300 }
  )();

export const getCachedMenus = unstable_cache(
  async () => {
    const menus = await getMenus();
    return menus;
  },
  ["menus"],
  { tags: [CACHE_TAGS.menus], revalidate: 3600 }
);

const getCachedNavMenusInternal = unstable_cache(
  async () => {
    const menus = await getMenus();
    const primaryMenu = menus.find(
      (m) => m.locations?.includes("PRIMARY") || m.slug === "primary-menu"
    );
    const footerMenu = menus.find(
      (m) => m.locations?.includes("FOOTER") || m.slug === "footer-menu"
    );
    return {
      primary: primaryMenu ? buildMenuTree(primaryMenu.menuItems.nodes) : [],
      footer: footerMenu ? buildMenuTree(footerMenu.menuItems.nodes) : [],
    };
  },
  ["nav-menus"],
  { tags: [CACHE_TAGS.menus], revalidate: 3600 }
);

export async function getCachedNavMenus(): Promise<{ primary: any[]; footer: any[] }> {
  try {
    const cached = await getCachedNavMenusInternal();
    if (cached && (cached.primary.length > 0 || cached.footer.length > 0)) {
      return cached;
    }
  } catch {}

  try {
    const menus = await getMenus();
    const primaryMenu = menus.find(
      (m) => m.locations?.includes("PRIMARY") || m.slug === "primary-menu"
    );
    const footerMenu = menus.find(
      (m) => m.locations?.includes("FOOTER") || m.slug === "footer-menu"
    );
    return {
      primary: primaryMenu ? buildMenuTree(primaryMenu.menuItems.nodes) : [],
      footer: footerMenu ? buildMenuTree(footerMenu.menuItems.nodes) : [],
    };
  } catch {
    return { primary: [], footer: [] };
  }
}

export const getCachedHomepageData = unstable_cache(
  async () => getHomepageData(),
  ["homepage"],
  { tags: [CACHE_TAGS.homepage], revalidate: 300 }
);

// React cache for per-request deduplication
export const getProductCached = cache(async (slug: string) => getProduct(slug));
export const getCategoriesCached = cache(async () => getCategories());
