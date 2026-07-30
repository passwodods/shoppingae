// ============================================================
// Product Types (WooCommerce REST API + WPGraphQL)
// ============================================================

export interface WCImage {
  id: number;
  src: string;
  name: string;
  alt: string;
}

export interface WCCategory {
  id: number;
  name: string;
  slug: string;
  parent: number;
  description: string;
  display: string;
  image: WCImage | null;
  menu_order: number;
  count: number;
  link?: string;
}

export interface WCAttribute {
  id: number;
  name: string;
  position: number;
  visible: boolean;
  variation: boolean;
  options: string[];
}

export interface WCDimensions {
  length: string;
  width: string;
  height: string;
}

export interface WCVariation {
  id: number;
  sku: string;
  price: string;
  regular_price: string;
  sale_price: string;
  on_sale: boolean;
  purchasable: boolean;
  stock_quantity: number | null;
  stock_status: "instock" | "outofstock" | "onbackorder";
  backorders_allowed: boolean;
  image: WCImage | null;
  attributes: Array<{
    id: number;
    name: string;
    slug: string;
    option: string;
  }>;
  weight: string;
  dimensions: WCDimensions;
}

export interface WCTag {
  id: number;
  name: string;
  slug: string;
}

export type ProductType = "simple" | "variable" | "grouped" | "external";
export type ProductStatus = "publish" | "draft" | "pending" | "private";
export type StockStatus = "instock" | "outofstock" | "onbackorder";

export interface WCProduct {
  id: number;
  name: string;
  slug: string;
  permalink: string;
  type: ProductType;
  status: ProductStatus;
  description: string;
  short_description: string;
  sku: string;
  price: string;
  regular_price: string;
  sale_price: string;
  on_sale: boolean;
  featured: boolean;
  purchasable: boolean;
  total_sales: number;
  virtual: boolean;
  downloadable: boolean;
  tax_status: string;
  tax_class: string;
  manage_stock: boolean;
  stock_quantity: number | null;
  backorders: string;
  backorders_allowed: boolean;
  backordered: boolean;
  sold_individually: boolean;
  weight: string;
  dimensions: WCDimensions;
  shipping_required: boolean;
  shipping_taxable: boolean;
  shipping_class: string;
  reviews_allowed: boolean;
  average_rating: string;
  rating_count: number;
  related_ids: number[];
  upsell_ids: number[];
  cross_sell_ids: number[];
  parent_id: number;
  categories: Array<{ id: number; name: string; slug: string }>;
  tags: WCTag[];
  images: WCImage[];
  attributes: WCAttribute[];
  variations: number[];
  stock_status: StockStatus;
  meta_data: Array<{ id: number; key: string; value: unknown }>;
  yoast_head?: string;
  yoast_head_json?: YoastSEO;
  // ACF brand field
  acf?: {
    brand?: string;
    brand_logo?: string;
    features?: string[];
    features_benefits?: string | string[];
    specification?: string | Record<string, string>;
    ingredients?: string;
    included_makeup_brushes?: string | string[];
    how_to_use?: string;
    safety?: string;
    warnings?: string;
    faqs?: Array<{ question: string; answer: string }>;
    shipping_returns?: string;
    [key: string]: unknown;
  };
}

export interface WCProductsQuery {
  page?: number;
  per_page?: number;
  search?: string;
  category?: string | number;
  tag?: string | number;
  status?: string;
  type?: ProductType;
  featured?: boolean;
  on_sale?: boolean;
  orderby?: "date" | "id" | "include" | "title" | "slug" | "price" | "popularity" | "rating";
  order?: "asc" | "desc";
  min_price?: string;
  max_price?: string;
  stock_status?: StockStatus;
  attribute?: string;
  attribute_term?: string;
  include?: number[];
  exclude?: number[];
}

export interface YoastSEO {
  title: string;
  description: string;
  robots: Record<string, string>;
  canonical: string;
  og_locale: string;
  og_type: string;
  og_title: string;
  og_description: string;
  og_url: string;
  og_site_name: string;
  og_image?: Array<{ url: string; width: number; height: number; type: string }>;
  twitter_card: string;
  twitter_creator?: string;
  twitter_site?: string;
  schema: {
    "@context": string;
    "@graph": unknown[];
  };
}

export interface WCReview {
  id: number;
  date_created: string;
  review: string;
  rating: number;
  reviewer: string;
  reviewer_email: string;
  reviewer_avatar_urls: Record<string, string>;
  verified: boolean;
  product_id: number;
}
