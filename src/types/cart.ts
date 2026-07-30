// ============================================================
// Cart & Checkout Types (WooCommerce Store API)
// ============================================================

export interface StoreCartItemImage {
  id: number;
  src: string;
  thumbnail: string;
  srcset: string;
  sizes: string;
  name: string;
  alt: string;
}

export interface StoreCartItemVariation {
  attribute: string;
  value: string;
}

export interface StoreCartItem {
  key: string;
  id: number;
  quantity: number;
  quantity_limit: number;
  name: string;
  short_description: string;
  description: string;
  sku: string;
  low_stock_remaining: number | null;
  backorders_allowed: boolean;
  show_backorder_badge: boolean;
  sold_individually: boolean;
  permalink: string;
  images: StoreCartItemImage[];
  variation: StoreCartItemVariation[];
  item_data: unknown[];
  prices: {
    price: string;
    regular_price: string;
    sale_price: string;
    price_range: null | { min_amount: string; max_amount: string };
    currency_code: string;
    currency_symbol: string;
    currency_minor_unit: number;
    currency_decimal_separator: string;
    currency_thousand_separator: string;
    currency_prefix: string;
    currency_suffix: string;
    raw_prices: { precision: number; price: string; regular_price: string; sale_price: string };
  };
  totals: {
    line_subtotal: string;
    line_subtotal_tax: string;
    line_total: string;
    line_total_tax: string;
    currency_code: string;
    currency_symbol: string;
    currency_minor_unit: number;
    currency_decimal_separator: string;
    currency_thousand_separator: string;
    currency_prefix: string;
    currency_suffix: string;
  };
  catalog_visibility: string;
  extensions: Record<string, unknown>;
}

export interface StoreCartCoupon {
  code: string;
  discount_type: string;
  totals: {
    total_discount: string;
    total_discount_tax: string;
    currency_code: string;
    currency_symbol: string;
    currency_minor_unit: number;
    currency_decimal_separator: string;
    currency_thousand_separator: string;
    currency_prefix: string;
    currency_suffix: string;
  };
}

export interface StoreCartShippingRate {
  package_id: number;
  name: string;
  destination: {
    address_1: string;
    address_2: string;
    city: string;
    state: string;
    postcode: string;
    country: string;
  };
  items: Array<{ key: string; name: string; quantity: number }>;
  shipping_rates: Array<{
    rate_id: string;
    name: string;
    description: string;
    delivery_time: string;
    price: string;
    taxes: string;
    instance_id: number;
    method_id: string;
    meta_data: Array<{ key: string; value: string; label: string }>;
    selected: boolean;
    currency_code: string;
    currency_symbol: string;
    currency_minor_unit: number;
    currency_decimal_separator: string;
    currency_thousand_separator: string;
    currency_prefix: string;
    currency_suffix: string;
  }>;
}

export interface StoreCart {
  coupons: StoreCartCoupon[];
  shipping_rates: StoreCartShippingRate[];
  shipping_address: StoreAddress;
  billing_address: StoreBillingAddress;
  items: StoreCartItem[];
  items_count: number;
  items_weight: number;
  cross_sells: unknown[];
  needs_payment: boolean;
  needs_shipping: boolean;
  has_calculated_shipping: boolean;
  fees: unknown[];
  totals: {
    subtotal: string;
    subtotal_tax: string;
    fee_total: string;
    fee_tax: string;
    discount_total: string;
    discount_tax: string;
    shipping_total: string;
    shipping_tax: string;
    total_tax: string;
    total: string;
    currency_code: string;
    currency_symbol: string;
    currency_minor_unit: number;
    currency_decimal_separator: string;
    currency_thousand_separator: string;
    currency_prefix: string;
    currency_suffix: string;
  };
  errors: unknown[];
  payment_requirements: string[];
  extensions: Record<string, unknown>;
}

export interface StoreAddress {
  first_name: string;
  last_name: string;
  company: string;
  address_1: string;
  address_2: string;
  city: string;
  state: string;
  postcode: string;
  country: string;
  phone: string;
}

export interface StoreBillingAddress extends StoreAddress {
  email: string;
}

export interface CheckoutFormData {
  billing_address: StoreBillingAddress;
  shipping_address: StoreAddress;
  customer_note: string;
  create_account: boolean;
  payment_method: string;
  shipping_same_as_billing: boolean;
}

export interface PlaceOrderPayload {
  billing_address: StoreBillingAddress;
  shipping_address: StoreAddress;
  customer_note?: string;
  create_account?: boolean;
  payment_method: string;
  payment_data?: Array<{ key: string; value: string }>;
}

export interface StoreOrder {
  id: number;
  status: string;
  currency: string;
  currency_symbol: string;
  order_key: string;
  billing_address: StoreBillingAddress;
  shipping_address: StoreAddress;
  customer_note: string;
  customer_id: number;
  date_created: string;
  line_items: StoreCartItem[];
  totals: StoreCart["totals"];
  payment_method: string;
  payment_result: {
    payment_status: string;
    payment_details: Array<{ key: string; value: string }>;
    redirect_url: string;
  };
}
