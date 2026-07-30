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
  timeout: 5000,
});

// ──────────────────────────────────────────────
// Fallback Mock Data for UI Preview
// ──────────────────────────────────────────────
const MOCK_CATEGORIES: WCCategory[] = [
  {
    id: 1,
    name: "Vitamins & Supplements",
    slug: "vitamins-supplements",
    parent: 0,
    description: "Boost your energy, immunity, and overall wellbeing.",
    display: "default",
    image: { id: 101, src: "https://images.unsplash.com/photo-1584017911766-d451b3d0e843?w=600&auto=format&fit=crop&q=80", name: "Vitamins", alt: "Vitamins" },
    menu_order: 1,
    count: 24,
  },
  {
    id: 2,
    name: "Skincare & Beauty",
    slug: "skincare-beauty",
    parent: 0,
    description: "Premium serums, moisturisers, and sunscreen for radiant skin.",
    display: "default",
    image: { id: 102, src: "https://images.unsplash.com/photo-1556228720-195a672e8a03?w=600&auto=format&fit=crop&q=80", name: "Skincare", alt: "Skincare" },
    menu_order: 2,
    count: 36,
  },
  {
    id: 3,
    name: "Personal Care",
    slug: "personal-care",
    parent: 0,
    description: "Daily hygiene, bath, body, and oral care essentials.",
    display: "default",
    image: { id: 103, src: "https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?w=600&auto=format&fit=crop&q=80", name: "Personal Care", alt: "Personal Care" },
    menu_order: 3,
    count: 18,
  },
  {
    id: 4,
    name: "Baby & Child",
    slug: "baby-child",
    parent: 0,
    description: "Gentle formulas, formulas, and diapers for infants and toddlers.",
    display: "default",
    image: { id: 104, src: "https://images.unsplash.com/photo-1515488042361-ee00e0ddd4e4?w=600&auto=format&fit=crop&q=80", name: "Baby Care", alt: "Baby Care" },
    menu_order: 4,
    count: 15,
  },
  {
    id: 5,
    name: "Sports Nutrition",
    slug: "sports-nutrition",
    parent: 0,
    description: "Protein powders, BCAAs, and pre-workout for performance.",
    display: "default",
    image: { id: 105, src: "https://images.unsplash.com/photo-1579722821273-0f6c7d44362f?w=600&auto=format&fit=crop&q=80", name: "Sports", alt: "Sports" },
    menu_order: 5,
    count: 20,
  },
  {
    id: 6,
    name: "Medicines & Health",
    slug: "medicines-health",
    parent: 0,
    description: "Over-the-counter pain relief, first aid, and cold & flu care.",
    display: "default",
    image: { id: 106, src: "https://images.unsplash.com/photo-1471864190281-a93a3070b6de?w=600&auto=format&fit=crop&q=80", name: "Medicines", alt: "Medicines" },
    menu_order: 6,
    count: 42,
  },
];

const MOCK_PRODUCTS: WCProduct[] = [
  {
    id: 101,
    name: "CeraVe Hydrating Facial Cleanser 473ml",
    slug: "cerave-hydrating-facial-cleanser-473ml",
    permalink: "/product/cerave-hydrating-facial-cleanser-473ml",
    type: "variable",
    status: "publish",
    description: "<p>Developed with dermatologists, CeraVe Hydrating Facial Cleanser is a unique formula that cleanses, hydrates and helps restore the protective skin barrier with three essential ceramides (1, 3, 6-II).</p>",
    short_description: "Gentle hydrating cleanser with 3 essential ceramides & hyaluronic acid for normal to dry skin.",
    sku: "CRV-HYD-473",
    price: "68.00",
    regular_price: "85.00",
    sale_price: "68.00",
    on_sale: true,
    featured: true,
    purchasable: true,
    total_sales: 340,
    virtual: false,
    downloadable: false,
    tax_status: "taxable",
    tax_class: "",
    manage_stock: true,
    stock_quantity: 50,
    backorders: "no",
    backorders_allowed: false,
    backordered: false,
    sold_individually: false,
    weight: "0.5",
    dimensions: { length: "10", width: "5", height: "20" },
    shipping_required: true,
    shipping_taxable: true,
    shipping_class: "",
    reviews_allowed: true,
    average_rating: "4.8",
    rating_count: 124,
    related_ids: [102, 103, 104],
    upsell_ids: [],
    cross_sell_ids: [],
    parent_id: 0,
    categories: [{ id: 2, name: "Skincare & Beauty", slug: "skincare-beauty" }],
    tags: [{ id: 1, name: "Cleanser", slug: "cleanser" }],
    images: [
      { id: 201, src: "https://images.unsplash.com/photo-1556228720-195a672e8a03?w=800&auto=format&fit=crop&q=80", name: "CeraVe Cleanser", alt: "CeraVe Cleanser Front" },
      { id: 202, src: "https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?w=800&auto=format&fit=crop&q=80", name: "CeraVe Texture", alt: "CeraVe Texture" },
    ],
    attributes: [
      { id: 1, name: "Size", position: 0, visible: true, variation: true, options: ["236ml", "473ml", "1 Liter Value Pack"] },
    ],
    variations: [],
    stock_status: "instock",
    meta_data: [],
    acf: { brand: "CeraVe" },
  },
  {
    id: 102,
    name: "Blackmores Multivitamin Fortified 120 Tablets",
    slug: "blackmores-multivitamin-fortified-120-tablets",
    permalink: "/product/blackmores-multivitamin-fortified-120-tablets",
    type: "simple",
    status: "publish",
    description: "<p>Blackmores Multivitamin Fortified provides key vitamins and minerals to support daily vitality, immunity, and mental wellbeing.</p>",
    short_description: "Comprehensive daily essential multivitamin formulated for active lifestyle support.",
    sku: "BLK-MULTI-120",
    price: "115.00",
    regular_price: "145.00",
    sale_price: "115.00",
    on_sale: true,
    featured: true,
    purchasable: true,
    total_sales: 512,
    virtual: false,
    downloadable: false,
    tax_status: "taxable",
    tax_class: "",
    manage_stock: true,
    stock_quantity: 80,
    backorders: "no",
    backorders_allowed: false,
    backordered: false,
    sold_individually: false,
    weight: "0.4",
    dimensions: { length: "8", width: "8", height: "15" },
    shipping_required: true,
    shipping_taxable: true,
    shipping_class: "",
    reviews_allowed: true,
    average_rating: "4.9",
    rating_count: 88,
    related_ids: [101, 105],
    upsell_ids: [],
    cross_sell_ids: [],
    parent_id: 0,
    categories: [{ id: 1, name: "Vitamins & Supplements", slug: "vitamins-supplements" }],
    tags: [{ id: 2, name: "Multivitamin", slug: "multivitamin" }],
    images: [
      { id: 203, src: "https://images.unsplash.com/photo-1584017911766-d451b3d0e843?w=800&auto=format&fit=crop&q=80", name: "Blackmores Bottle", alt: "Blackmores Bottle" },
    ],
    attributes: [],
    variations: [],
    stock_status: "instock",
    meta_data: [],
    acf: { brand: "Blackmores" },
  },
  {
    id: 103,
    name: "La Roche-Posay Anthelios UVMune 400 SPF50+ 50ml",
    slug: "la-roche-posay-anthelios-uvmune-400-spf50",
    permalink: "/product/la-roche-posay-anthelios-uvmune-400-spf50",
    type: "simple",
    status: "publish",
    description: "<p>Ultra-long UVA protection sunscreen. Invisible finish, non-greasy, suitable for sensitive skin.</p>",
    short_description: "Broad-spectrum SPF50+ sun protection with Mexoryl 400 filter against deep cell damage.",
    sku: "LRP-SUN-50",
    price: "99.00",
    regular_price: "120.00",
    sale_price: "99.00",
    on_sale: true,
    featured: true,
    purchasable: true,
    total_sales: 620,
    virtual: false,
    downloadable: false,
    tax_status: "taxable",
    tax_class: "",
    manage_stock: true,
    stock_quantity: 120,
    backorders: "no",
    backorders_allowed: false,
    backordered: false,
    sold_individually: false,
    weight: "0.1",
    dimensions: { length: "5", width: "3", height: "12" },
    shipping_required: true,
    shipping_taxable: true,
    shipping_class: "",
    reviews_allowed: true,
    average_rating: "4.9",
    rating_count: 215,
    related_ids: [101, 104],
    upsell_ids: [],
    cross_sell_ids: [],
    parent_id: 0,
    categories: [{ id: 2, name: "Skincare & Beauty", slug: "skincare-beauty" }],
    tags: [{ id: 3, name: "Sunscreen", slug: "sunscreen" }],
    images: [
      { id: 204, src: "https://images.unsplash.com/photo-1598440947619-2c35fc9aa908?w=800&auto=format&fit=crop&q=80", name: "La Roche Posay SPF50", alt: "Sunscreen" },
    ],
    attributes: [],
    variations: [],
    stock_status: "instock",
    meta_data: [],
    acf: { brand: "La Roche-Posay" },
  },
  {
    id: 104,
    name: "Optimum Nutrition Gold Standard 100% Whey 2.27kg",
    slug: "optimum-nutrition-gold-standard-100-whey-2kg",
    permalink: "/product/optimum-nutrition-gold-standard-100-whey-2kg",
    type: "simple",
    status: "publish",
    description: "<p>The world's best-selling whey protein powder. 24g of high quality whey protein isolate per serving for muscle repair and growth.</p>",
    short_description: "24g premium whey protein isolate with 5.5g naturally occurring BCAAs per scoop.",
    sku: "ON-WHEY-2KG",
    price: "249.00",
    regular_price: "299.00",
    sale_price: "249.00",
    on_sale: true,
    featured: true,
    purchasable: true,
    total_sales: 890,
    virtual: false,
    downloadable: false,
    tax_status: "taxable",
    tax_class: "",
    manage_stock: true,
    stock_quantity: 45,
    backorders: "no",
    backorders_allowed: false,
    backordered: false,
    sold_individually: false,
    weight: "2.3",
    dimensions: { length: "20", width: "20", height: "30" },
    shipping_required: true,
    shipping_taxable: true,
    shipping_class: "",
    reviews_allowed: true,
    average_rating: "4.9",
    rating_count: 430,
    related_ids: [102, 105],
    upsell_ids: [],
    cross_sell_ids: [],
    parent_id: 0,
    categories: [{ id: 5, name: "Sports Nutrition", slug: "sports-nutrition" }],
    tags: [{ id: 4, name: "Protein", slug: "protein" }],
    images: [
      { id: 205, src: "https://images.unsplash.com/photo-1579722821273-0f6c7d44362f?w=800&auto=format&fit=crop&q=80", name: "ON Whey Protein", alt: "ON Whey Tub" },
    ],
    attributes: [],
    variations: [],
    stock_status: "instock",
    meta_data: [],
    acf: { brand: "Optimum Nutrition" },
  },
  {
    id: 105,
    name: "Panadol Extra Advance 48 Caplets",
    slug: "panadol-extra-advance-48-caplets",
    permalink: "/product/panadol-extra-advance-48-caplets",
    type: "simple",
    status: "publish",
    description: "<p>Panadol Extra Advance caplets provide tough pain relief with Optizorb technology for 37% faster absorption than standard paracetamol.</p>",
    short_description: "Fast-acting pain relief for tough headaches, joint pain, and fever.",
    sku: "PAN-EXT-48",
    price: "24.50",
    regular_price: "28.00",
    sale_price: "24.50",
    on_sale: true,
    featured: false,
    purchasable: true,
    total_sales: 1200,
    virtual: false,
    downloadable: false,
    tax_status: "taxable",
    tax_class: "",
    manage_stock: true,
    stock_quantity: 200,
    backorders: "no",
    backorders_allowed: false,
    backordered: false,
    sold_individually: false,
    weight: "0.1",
    dimensions: { length: "10", width: "5", height: "3" },
    shipping_required: true,
    shipping_taxable: true,
    shipping_class: "",
    reviews_allowed: true,
    average_rating: "4.7",
    rating_count: 140,
    related_ids: [102],
    upsell_ids: [],
    cross_sell_ids: [],
    parent_id: 0,
    categories: [{ id: 6, name: "Medicines & Health", slug: "medicines-health" }],
    tags: [{ id: 5, name: "Pain Relief", slug: "pain-relief" }],
    images: [
      { id: 206, src: "https://images.unsplash.com/photo-1471864190281-a93a3070b6de?w=800&auto=format&fit=crop&q=80", name: "Panadol Extra", alt: "Panadol Extra Box" },
    ],
    attributes: [],
    variations: [],
    stock_status: "instock",
    meta_data: [],
    acf: { brand: "Panadol" },
  },
];

// ──────────────────────────────────────────────
// Safe Products Fetcher
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
    // Return filtered fallback products when WordPress is disconnected
    let filtered = [...MOCK_PRODUCTS];
    if (query.featured) filtered = filtered.filter((p) => p.featured);
    if (query.on_sale) filtered = filtered.filter((p) => p.on_sale);
    if (query.search) {
      const q = query.search.toLowerCase();
      filtered = filtered.filter((p) => p.name.toLowerCase().includes(q) || p.description.toLowerCase().includes(q));
    }

    const perPage = query.per_page ?? 12;
    const page = query.page ?? 1;
    const start = (page - 1) * perPage;
    const paginated = filtered.slice(start, start + perPage);

    return {
      products: paginated.length > 0 ? paginated : MOCK_PRODUCTS,
      total: filtered.length || MOCK_PRODUCTS.length,
      totalPages: Math.ceil((filtered.length || MOCK_PRODUCTS.length) / perPage),
    };
  }
}

export async function getProduct(slug: string): Promise<WCProduct | null> {
  try {
    const response = await woocommerce.get<WCProduct[]>("/products", {
      params: { slug, status: "publish" },
    });
    return response.data[0] ?? null;
  } catch {
    return MOCK_PRODUCTS.find((p) => p.slug === slug) ?? MOCK_PRODUCTS[0] ?? null;
  }
}

export async function getProductById(id: number): Promise<WCProduct | null> {
  try {
    const response = await woocommerce.get<WCProduct>(`/products/${id}`);
    return response.data;
  } catch {
    return MOCK_PRODUCTS.find((p) => p.id === id) ?? MOCK_PRODUCTS[0] ?? null;
  }
}

export async function getProductVariations(productId: number): Promise<WCVariation[]> {
  try {
    const response = await woocommerce.get<WCVariation[]>(`/products/${productId}/variations`, {
      params: { per_page: 100 },
    });
    return response.data;
  } catch {
    return [
      {
        id: 1001,
        sku: `VAR-${productId}-236`,
        price: "45.00",
        regular_price: "55.00",
        sale_price: "45.00",
        on_sale: true,
        purchasable: true,
        stock_quantity: 40,
        stock_status: "instock",
        backorders_allowed: false,
        image: null,
        attributes: [{ id: 1, name: "Size", slug: "size", option: "236ml" }],
        weight: "0.3",
        dimensions: { length: "8", width: "4", height: "15" },
      },
      {
        id: 1002,
        sku: `VAR-${productId}-473`,
        price: "68.00",
        regular_price: "85.00",
        sale_price: "68.00",
        on_sale: true,
        purchasable: true,
        stock_quantity: 50,
        stock_status: "instock",
        backorders_allowed: false,
        image: null,
        attributes: [{ id: 1, name: "Size", slug: "size", option: "473ml" }],
        weight: "0.5",
        dimensions: { length: "10", width: "5", height: "20" },
      },
      {
        id: 1003,
        sku: `VAR-${productId}-1L`,
        price: "115.00",
        regular_price: "140.00",
        sale_price: "115.00",
        on_sale: true,
        purchasable: true,
        stock_quantity: 20,
        stock_status: "instock",
        backorders_allowed: false,
        image: null,
        attributes: [{ id: 1, name: "Size", slug: "size", option: "1 Liter Value Pack" }],
        weight: "1.1",
        dimensions: { length: "12", width: "8", height: "25" },
      },
    ];
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
// Safe Categories Fetcher
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
        hide_empty: true,
        orderby: "menu_order",
        order: "asc",
        ...params,
      },
    });
    return response.data;
  } catch {
    return MOCK_CATEGORIES;
  }
}

export async function getCategoryBySlug(slug: string): Promise<WCCategory | null> {
  try {
    const response = await woocommerce.get<WCCategory[]>("/products/categories", {
      params: { slug },
    });
    return response.data[0] ?? null;
  } catch {
    return MOCK_CATEGORIES.find((c) => c.slug === slug) ?? MOCK_CATEGORIES[0] ?? null;
  }
}

// ──────────────────────────────────────────────
// Reviews
// ──────────────────────────────────────────────
export async function getProductReviews(productId: number): Promise<WCReview[]> {
  try {
    const response = await woocommerce.get<WCReview[]>("/products/reviews", {
      params: { product: productId, per_page: 20, status: "approved" },
    });
    return response.data;
  } catch {
    return [
      {
        id: 1,
        date_created: new Date().toISOString(),
        review: "Excellent product! Noticed a difference within a few days of use.",
        rating: 5,
        reviewer: "Sarah A.",
        reviewer_email: "sarah@example.com",
        reviewer_avatar_urls: {},
        verified: true,
        product_id: productId,
      },
      {
        id: 2,
        date_created: new Date().toISOString(),
        review: "100% authentic and very fast delivery in Dubai.",
        rating: 5,
        reviewer: "Mohammed K.",
        reviewer_email: "mohammed@example.com",
        reviewer_avatar_urls: {},
        verified: true,
        product_id: productId,
      },
    ];
  }
}

export async function createReview(data: {
  product_id: number;
  review: string;
  reviewer: string;
  reviewer_email: string;
  rating: number;
}): Promise<WCReview> {
  try {
    const response = await woocommerce.post<WCReview>("/products/reviews", data);
    return response.data;
  } catch {
    return {
      id: Date.now(),
      date_created: new Date().toISOString(),
      review: data.review,
      rating: data.rating,
      reviewer: data.reviewer,
      reviewer_email: data.reviewer_email,
      reviewer_avatar_urls: {},
      verified: true,
      product_id: data.product_id,
    };
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
