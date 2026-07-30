import axios from "axios";
import type { WCProduct, WCCategory, WCProductsQuery, WCReview, WCVariation } from "@/types/product";
import type { WCOrder, WCCustomer } from "@/types/customer";

// ──────────────────────────────────────────────
// Axios client for WooCommerce REST API v3
// ──────────────────────────────────────────────
const woocommerce = axios.create({
  baseURL: `${process.env.NEXT_PUBLIC_WP_URL}/wp-json/wc/v3`,
  params: {
    consumer_key: process.env.WC_CONSUMER_KEY,
    consumer_secret: process.env.WC_CONSUMER_SECRET,
  },
  headers: {
    "Content-Type": "application/json",
  },
  timeout: 30000,
});

// ──────────────────────────────────────────────
// Products Fetchers (Direct from WordPress WooCommerce API)
// ──────────────────────────────────────────────
export async function getProducts(query: WCProductsQuery = {}): Promise<{
  products: WCProduct[];
  total: number;
  totalPages: number;
}> {
  try {
    const response = await woocommerce.get<WCProduct[]>("/products", {
      params: {
        per_page: 12,
        status: "publish",
        ...query,
      },
    });

    return {
      products: response.data,
      total: parseInt(response.headers["x-wp-total"] ?? `${response.data.length}`),
      totalPages: parseInt(response.headers["x-wp-totalpages"] ?? "1"),
    };
  } catch (error) {
    console.error("[WooCommerce] getProducts error:", error);
    return {
      products: [],
      total: 0,
      totalPages: 0,
    };
  }
}

export async function getProduct(slug: string): Promise<WCProduct | null> {
  try {
    const cleanSlug = decodeURIComponent(slug);
    const response = await woocommerce.get<WCProduct[]>("/products", {
      params: { slug: cleanSlug },
    });
    if (response.data && response.data.length > 0) {
      return response.data[0];
    }
    // Search fallback if exact slug param returned empty
    const fallbackResponse = await woocommerce.get<WCProduct[]>("/products", {
      params: { search: cleanSlug, per_page: 5 },
    });
    const found = fallbackResponse.data?.find(
      (p) => p.slug === cleanSlug || p.slug === slug || decodeURIComponent(p.slug) === cleanSlug
    );
    return found ?? fallbackResponse.data?.[0] ?? null;
  } catch {
    return null;
  }
}

export async function getProductById(id: number): Promise<WCProduct | null> {
  try {
    const response = await woocommerce.get<WCProduct>(`/products/${id}`);
    return response.data;
  } catch {
    return null;
  }
}

export async function getProductVariations(productId: number): Promise<WCVariation[]> {
  try {
    const response = await woocommerce.get<WCVariation[]>(`/products/${productId}/variations`, {
      params: { per_page: 100 },
    });
    return response.data;
  } catch {
    return [];
  }
}

export async function getFeaturedProducts(perPage = 8): Promise<WCProduct[]> {
  const { products } = await getProducts({ featured: true, per_page: perPage });
  return products;
}

export async function getBestSellers(perPage = 8): Promise<WCProduct[]> {
  const { products } = await getProducts({
    per_page: perPage,
    orderby: "popularity",
    order: "desc",
  });
  return products;
}

export async function getNewArrivals(perPage = 8): Promise<WCProduct[]> {
  const { products } = await getProducts({
    per_page: perPage,
    orderby: "date",
    order: "desc",
  });
  return products;
}

export async function getOnSaleProducts(perPage = 8): Promise<WCProduct[]> {
  const { products } = await getProducts({ on_sale: true, per_page: perPage });
  return products;
}

export async function getRelatedProducts(productId: number, categoryId?: number, perPage = 6): Promise<WCProduct[]> {
  const params: WCProductsQuery = { per_page: perPage, exclude: [productId] };
  if (categoryId) params.category = categoryId;
  const { products } = await getProducts(params);
  return products;
}

export async function searchProducts(query: string, perPage = 20): Promise<WCProduct[]> {
  const { products } = await getProducts({ search: query, per_page: perPage });
  return products;
}

// ──────────────────────────────────────────────
// Categories Fetcher (Direct from WordPress WooCommerce API)
// ──────────────────────────────────────────────
export async function getCategories(params: {
  per_page?: number;
  parent?: number;
  hide_empty?: boolean;
  orderby?: string;
  order?: string;
} = {}): Promise<WCCategory[]> {
  try {
    const response = await woocommerce.get<WCCategory[]>("/products/categories", {
      params: {
        per_page: 100,
        hide_empty: false,
        orderby: "menu_order",
        order: "asc",
        ...params,
      },
    });
    return response.data;
  } catch {
    return [];
  }
}

export async function getCategoryBySlug(slug: string): Promise<WCCategory | null> {
  try {
    const response = await woocommerce.get<WCCategory[]>("/products/categories", {
      params: { slug },
    });
    return response.data[0] ?? null;
  } catch {
    return null;
  }
}

// ──────────────────────────────────────────────
// Product Reviews (Direct from WordPress WooCommerce API)
// ──────────────────────────────────────────────
export async function getProductReviews(productId: number): Promise<WCReview[]> {
  try {
    const response = await woocommerce.get<WCReview[]>("/products/reviews", {
      params: { product: productId, per_page: 20, status: "approved" },
    });
    return response.data;
  } catch {
    return [];
  }
}

export async function createReview(data: {
  product_id: number;
  review: string;
  reviewer: string;
  reviewer_email: string;
  rating: number;
}): Promise<WCReview | null> {
  try {
    const response = await woocommerce.post<WCReview>("/products/reviews", data);
    return response.data;
  } catch {
    return null;
  }
}

// ──────────────────────────────────────────────
// Customer Orders & Account
// ──────────────────────────────────────────────
export async function getCustomerOrders(customerId: number): Promise<WCOrder[]> {
  try {
    const response = await woocommerce.get<WCOrder[]>("/orders", {
      params: { customer: customerId, per_page: 20 },
    });
    return response.data;
  } catch {
    return [];
  }
}

export async function getOrder(orderId: number): Promise<WCOrder | null> {
  try {
    const response = await woocommerce.get<WCOrder>(`/orders/${orderId}`);
    return response.data;
  } catch {
    return null;
  }
}

export async function getCustomer(customerId: number): Promise<WCCustomer | null> {
  try {
    const response = await woocommerce.get<WCCustomer>(`/customers/${customerId}`);
    return response.data;
  } catch {
    return null;
  }
}

export async function updateCustomer(customerId: number, data: Partial<WCCustomer>): Promise<WCCustomer | null> {
  try {
    const response = await woocommerce.put<WCCustomer>(`/customers/${customerId}`, data);
    return response.data;
  } catch {
    return null;
  }
}

export async function createCustomer(data: {
  email: string;
  first_name: string;
  last_name: string;
  username: string;
  password: string;
}): Promise<WCCustomer | null> {
  try {
    const response = await woocommerce.post<WCCustomer>("/customers", data);
    return response.data;
  } catch {
    return null;
  }
}

export default woocommerce;
