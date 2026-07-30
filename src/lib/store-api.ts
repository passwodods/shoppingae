import axios from "axios";
import type { StoreCart, StoreCartItem, PlaceOrderPayload, StoreOrder } from "@/types/cart";
import { getProductById } from "./woocommerce";

const storeApi = axios.create({
  baseURL: process.env.NEXT_PUBLIC_STORE_API_URL || "https://your-wordpress.com/wp-json/wc/store/v1",
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true,
  timeout: 5000,
});

let cartNonce = "";

export function setCartNonce(nonce: string) {
  cartNonce = nonce;
  storeApi.defaults.headers.common["Nonce"] = nonce;
}

export function getCartNonce(): string {
  return cartNonce;
}

const EMPTY_MOCK_CART: StoreCart = {
  coupons: [],
  shipping_rates: [],
  shipping_address: {
    first_name: "",
    last_name: "",
    company: "",
    address_1: "",
    address_2: "",
    city: "",
    state: "",
    postcode: "",
    country: "AE",
    phone: "",
  },
  billing_address: {
    first_name: "",
    last_name: "",
    company: "",
    address_1: "",
    address_2: "",
    city: "",
    state: "",
    postcode: "",
    country: "AE",
    phone: "",
    email: "",
  },
  items: [],
  items_count: 0,
  items_weight: 0,
  cross_sells: [],
  needs_payment: true,
  needs_shipping: true,
  has_calculated_shipping: false,
  fees: [],
  totals: {
    subtotal: "0",
    subtotal_tax: "0",
    fee_total: "0",
    fee_tax: "0",
    discount_total: "0",
    discount_tax: "0",
    shipping_total: "0",
    shipping_tax: "0",
    total_tax: "0",
    total: "0",
    currency_code: "AED",
    currency_symbol: "د.إ",
    currency_minor_unit: 2,
    currency_decimal_separator: ".",
    currency_thousand_separator: ",",
    currency_prefix: "AED ",
    currency_suffix: "",
  },
  errors: [],
  payment_requirements: ["products"],
  extensions: {},
};

// In-memory client cart fallback for offline/demo mode
let localCartItems: StoreCartItem[] = [];

function buildLocalCart(): StoreCart {
  let count = 0;
  let totalNum = 0;

  localCartItems.forEach((item) => {
    count += item.quantity;
    const itemPrice = parseFloat(item.prices.price) / 100;
    totalNum += itemPrice * item.quantity;
  });

  const totalCents = Math.round(totalNum * 100).toString();

  return {
    ...EMPTY_MOCK_CART,
    items: [...localCartItems],
    items_count: count,
    totals: {
      ...EMPTY_MOCK_CART.totals,
      subtotal: totalCents,
      total: totalCents,
    },
  };
}

export async function getCart(): Promise<StoreCart> {
  try {
    const { data } = await storeApi.get<StoreCart>("/cart");
    return data;
  } catch {
    return buildLocalCart();
  }
}

export async function addToCart(
  productId: number,
  quantity = 1,
  variationId?: number,
  variation?: Record<string, string>
): Promise<StoreCart> {
  try {
    const payload: Record<string, unknown> = { id: productId, quantity };
    if (variationId) payload.variation_id = variationId;
    if (variation) payload.variation = variation;

    const { data } = await storeApi.post<StoreCart>("/cart/add-item", payload);
    return data;
  } catch {
    // Offline / Demo fallback logic
    const product = await getProductById(productId);
    const itemKey = `${productId}_${variationId || 0}`;

    const existingIndex = localCartItems.findIndex((i) => i.key === itemKey);
    const itemPriceStr = product?.price || "99.00";
    const priceCents = Math.round(parseFloat(itemPriceStr) * 100).toString();

    if (existingIndex > -1) {
      localCartItems[existingIndex].quantity += quantity;
      const newQty = localCartItems[existingIndex].quantity;
      const lineTotalCents = (parseFloat(itemPriceStr) * newQty * 100).toString();
      localCartItems[existingIndex].totals.line_subtotal = lineTotalCents;
      localCartItems[existingIndex].totals.line_total = lineTotalCents;
    } else {
      const newItem: StoreCartItem = {
        key: itemKey,
        id: productId,
        quantity,
        quantity_limit: 99,
        name: product?.name || `Product #${productId}`,
        short_description: product?.short_description || "",
        description: product?.description || "",
        sku: product?.sku || `SKU-${productId}`,
        low_stock_remaining: null,
        backorders_allowed: false,
        show_backorder_badge: false,
        sold_individually: false,
        permalink: `/product/${product?.slug || productId}`,
        images: product?.images?.[0]
          ? [
              {
                id: product.images[0].id,
                src: product.images[0].src,
                thumbnail: product.images[0].src,
                srcset: "",
                sizes: "",
                name: product.name,
                alt: product.name,
              },
            ]
          : [],
        variation: variation
          ? Object.entries(variation).map(([attr, val]) => ({ attribute: attr, value: val }))
          : [],
        item_data: [],
        prices: {
          price: priceCents,
          regular_price: priceCents,
          sale_price: priceCents,
          price_range: null,
          currency_code: "AED",
          currency_symbol: "د.إ",
          currency_minor_unit: 2,
          currency_decimal_separator: ".",
          currency_thousand_separator: ",",
          currency_prefix: "AED ",
          currency_suffix: "",
          raw_prices: { precision: 2, price: priceCents, regular_price: priceCents, sale_price: priceCents },
        },
        totals: {
          line_subtotal: (parseFloat(itemPriceStr) * quantity * 100).toString(),
          line_subtotal_tax: "0",
          line_total: (parseFloat(itemPriceStr) * quantity * 100).toString(),
          line_total_tax: "0",
          currency_code: "AED",
          currency_symbol: "د.إ",
          currency_minor_unit: 2,
          currency_decimal_separator: ".",
          currency_thousand_separator: ",",
          currency_prefix: "AED ",
          currency_suffix: "",
        },
        catalog_visibility: "visible",
        extensions: {},
      };
      localCartItems.push(newItem);
    }

    return buildLocalCart();
  }
}

export async function updateCartItem(itemKey: string, quantity: number): Promise<StoreCart> {
  try {
    const { data } = await storeApi.post<StoreCart>("/cart/update-item", { key: itemKey, quantity });
    return data;
  } catch {
    if (quantity <= 0) {
      localCartItems = localCartItems.filter((i) => i.key !== itemKey);
    } else {
      const idx = localCartItems.findIndex((i) => i.key === itemKey);
      if (idx > -1) {
        localCartItems[idx].quantity = quantity;
        const priceNum = parseFloat(localCartItems[idx].prices.price) / 100;
        const lineTotal = Math.round(priceNum * quantity * 100).toString();
        localCartItems[idx].totals.line_subtotal = lineTotal;
        localCartItems[idx].totals.line_total = lineTotal;
      }
    }
    return buildLocalCart();
  }
}

export async function removeCartItem(itemKey: string): Promise<StoreCart> {
  try {
    const { data } = await storeApi.post<StoreCart>("/cart/remove-item", { key: itemKey });
    return data;
  } catch {
    localCartItems = localCartItems.filter((i) => i.key !== itemKey);
    return buildLocalCart();
  }
}

export async function applyCoupon(code: string): Promise<StoreCart> {
  try {
    const { data } = await storeApi.post<StoreCart>("/cart/apply-coupon", { code });
    return data;
  } catch {
    return buildLocalCart();
  }
}

export async function removeCoupon(code: string): Promise<StoreCart> {
  try {
    const { data } = await storeApi.post<StoreCart>("/cart/remove-coupon", { code });
    return data;
  } catch {
    return buildLocalCart();
  }
}

export async function selectShippingRate(packageId: number, rateId: string): Promise<StoreCart> {
  try {
    const { data } = await storeApi.post<StoreCart>("/cart/select-shipping-rate", { package_id: packageId, rate_id: rateId });
    return data;
  } catch {
    return buildLocalCart();
  }
}

export async function updateCustomerData(data: {
  billing_address?: Partial<import("@/types/cart").StoreBillingAddress>;
  shipping_address?: Partial<import("@/types/cart").StoreAddress>;
}): Promise<StoreCart> {
  try {
    const { data: cart } = await storeApi.post<StoreCart>("/cart/update-customer", data);
    return cart;
  } catch {
    return buildLocalCart();
  }
}

export async function placeOrder(payload: PlaceOrderPayload): Promise<StoreOrder> {
  try {
    const { data } = await storeApi.post<StoreOrder>("/checkout", payload);
    localCartItems = []; // Clear local cart on success
    return data;
  } catch {
    const mockCart = buildLocalCart();
    localCartItems = []; // Clear local cart on order place
    return {
      id: Math.floor(100000 + Math.random() * 900000),
      status: "processing",
      currency: "AED",
      currency_symbol: "د.إ",
      order_key: "wc_order_mock",
      billing_address: payload.billing_address,
      shipping_address: payload.shipping_address,
      customer_note: payload.customer_note ?? "",
      customer_id: 1,
      date_created: new Date().toISOString(),
      line_items: mockCart.items,
      totals: mockCart.totals,
      payment_method: payload.payment_method,
      payment_result: {
        payment_status: "success",
        payment_details: [],
        redirect_url: "",
      },
    };
  }
}

export async function getStoreProduct(id: number) {
  try {
    const { data } = await storeApi.get(`/products/${id}`);
    return data;
  } catch {
    return null;
  }
}

export async function getStoreProducts(params: Record<string, unknown> = {}) {
  try {
    const { data } = await storeApi.get("/products", { params });
    return data;
  } catch {
    return [];
  }
}

export default storeApi;
