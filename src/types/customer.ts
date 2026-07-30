// ============================================================
// Customer / Auth Types
// ============================================================

export interface WCCustomer {
  id: number;
  date_created: string;
  date_modified: string;
  email: string;
  first_name: string;
  last_name: string;
  role: string;
  username: string;
  billing: WCAddress;
  shipping: WCAddress;
  is_paying_customer: boolean;
  avatar_url: string;
  meta_data: Array<{ id: number; key: string; value: unknown }>;
}

export interface WCAddress {
  first_name: string;
  last_name: string;
  company: string;
  address_1: string;
  address_2: string;
  city: string;
  state: string;
  postcode: string;
  country: string;
  email?: string;
  phone: string;
}

export interface LoginCredentials {
  username: string;
  password: string;
}

export interface RegisterData {
  email: string;
  first_name: string;
  last_name: string;
  username: string;
  password: string;
}

export interface AuthToken {
  token: string;
  user_email: string;
  user_nicename: string;
  user_display_name: string;
}

export interface WCOrder {
  id: number;
  parent_id: number;
  number: string;
  order_key: string;
  created_via: string;
  version: string;
  status: string;
  currency: string;
  date_created: string;
  date_modified: string;
  discount_total: string;
  discount_tax: string;
  shipping_total: string;
  shipping_tax: string;
  cart_tax: string;
  total: string;
  total_tax: string;
  billing: WCAddress & { email: string };
  shipping: WCAddress;
  payment_method: string;
  payment_method_title: string;
  customer_id: number;
  customer_note: string;
  line_items: WCLineItem[];
  shipping_lines: WCShippingLine[];
  coupon_lines: WCCouponLine[];
  customer_ip_address: string;
}

export interface WCLineItem {
  id: number;
  name: string;
  product_id: number;
  variation_id: number;
  quantity: number;
  tax_class: string;
  subtotal: string;
  subtotal_tax: string;
  total: string;
  total_tax: string;
  sku: string;
  price: number;
  image: { id: string; src: string };
}

export interface WCShippingLine {
  id: number;
  method_title: string;
  method_id: string;
  total: string;
  total_tax: string;
}

export interface WCCouponLine {
  id: number;
  code: string;
  discount: string;
  discount_tax: string;
}
