"use client";

export const dynamic = "force-dynamic";
import { useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { Trash2, Minus, Plus, ShoppingBag, ArrowRight, Tag, Loader2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useCartStore } from "@/stores/cart.store";
import { useCartInit } from "@/hooks/useCartInit";
import { formatMinorPrice } from "@/lib/utils";

export default function CartPage() {
  useCartInit();
  const { cart, isLoading, updateItem, removeItem, applyCouponCode, removeCouponCode } = useCartStore();

  if (isLoading && !cart) {
    return (
      <div className="container-shop py-16 flex items-center justify-center">
        <Loader2 className="w-10 h-10 animate-spin text-[#2E6F40]" />
      </div>
    );
  }

  if (!cart || cart.items.length === 0) {
    return (
      <div className="container-shop py-16 text-center">
        <div className="max-w-sm mx-auto">
          <div className="w-24 h-24 mx-auto mb-6 rounded-full bg-green-50 flex items-center justify-center">
            <ShoppingBag className="w-12 h-12 text-green-300" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Your cart is empty</h1>
          <p className="text-gray-500 mb-8">Looks like you haven't added anything yet.</p>
          <Link href="/shop" className="btn-primary">
            Start Shopping
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    );
  }

  const currency_minor_unit = cart.totals.currency_minor_unit;

  return (
    <div className="container-shop py-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Shopping Cart</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Cart items */}
        <div className="lg:col-span-2 space-y-4">
          <AnimatePresence>
            {cart.items.map((item) => (
              <motion.div
                key={item.key}
                layout
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, x: -32 }}
                className="card p-4 flex gap-4"
              >
                {/* Image */}
                <div className="w-20 h-20 rounded-xl bg-gray-100 overflow-hidden flex-shrink-0">
                  {item.images[0] && (
                    <Image
                      src={item.images[0].thumbnail || item.images[0].src}
                      alt={item.images[0].alt || item.name}
                      width={80}
                      height={80}
                      className="w-full h-full object-cover"
                    />
                  )}
                </div>

                {/* Details */}
                <div className="flex-1 min-w-0">
                  <Link href={`/product/${item.id}`} className="font-semibold text-gray-900 hover:text-[#2E6F40] line-clamp-2 leading-snug">
                    {item.name}
                  </Link>
                  {item.variation.length > 0 && (
                    <p className="text-xs text-gray-400 mt-0.5">
                      {item.variation.map((v) => `${v.attribute}: ${v.value}`).join(" / ")}
                    </p>
                  )}
                  <div className="flex items-center justify-between mt-3 flex-wrap gap-3">
                    {/* Quantity */}
                    <div className="flex items-center rounded-xl border border-gray-200 overflow-hidden">
                      <button
                        onClick={() => item.quantity > 1 ? updateItem(item.key, item.quantity - 1) : removeItem(item.key)}
                        disabled={isLoading}
                        className="w-8 h-8 flex items-center justify-center text-gray-600 hover:bg-gray-100 transition-colors"
                        aria-label="Decrease quantity"
                      >
                        <Minus className="w-3 h-3" />
                      </button>
                      <span className="w-10 text-center text-sm font-semibold">{item.quantity}</span>
                      <button
                        onClick={() => updateItem(item.key, item.quantity + 1)}
                        disabled={isLoading}
                        className="w-8 h-8 flex items-center justify-center text-gray-600 hover:bg-gray-100 transition-colors"
                        aria-label="Increase quantity"
                      >
                        <Plus className="w-3 h-3" />
                      </button>
                    </div>

                    <div className="flex items-center gap-3">
                      <span className="font-bold text-[#2E6F40]">
                        {formatMinorPrice(item.totals.line_total, currency_minor_unit)}
                      </span>
                      <button
                        onClick={() => removeItem(item.key)}
                        disabled={isLoading}
                        className="p-1.5 text-gray-400 hover:text-red-500 transition-colors"
                        aria-label="Remove item"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>

          {/* Coupon */}
          <div className="card p-4">
            <form
              onSubmit={(e) => {
                e.preventDefault();
                const code = (e.currentTarget.elements.namedItem("coupon") as HTMLInputElement).value;
                if (code) applyCouponCode(code);
              }}
              className="flex gap-2"
            >
              <div className="flex-1 relative">
                <Tag className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  name="coupon"
                  className="input pl-9"
                  placeholder="Enter coupon code"
                />
              </div>
              <button type="submit" disabled={isLoading} className="btn-secondary">
                Apply
              </button>
            </form>
            {/* Applied coupons */}
            {cart.coupons.length > 0 && (
              <div className="mt-3 flex flex-wrap gap-2">
                {cart.coupons.map((coupon) => (
                  <div key={coupon.code} className="flex items-center gap-1.5 px-2 py-1 bg-green-50 border border-green-200 rounded-full text-xs font-semibold text-green-700">
                    <Tag className="w-3 h-3" />
                    {coupon.code.toUpperCase()}
                    <button
                      onClick={() => removeCouponCode(coupon.code)}
                      className="ml-0.5 hover:text-red-500 transition-colors"
                      aria-label="Remove coupon"
                    >
                      ×
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Order summary */}
        <div className="lg:col-span-1">
          <div className="card p-6 sticky top-24 space-y-4">
            <h2 className="text-lg font-bold text-gray-900">Order Summary</h2>

            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600">Subtotal ({cart.items_count} items)</span>
                <span className="font-medium">{formatMinorPrice(cart.totals.subtotal, currency_minor_unit)}</span>
              </div>
              {parseInt(cart.totals.discount_total) > 0 && (
                <div className="flex justify-between text-green-600">
                  <span>Discount</span>
                  <span className="font-medium">-{formatMinorPrice(cart.totals.discount_total, currency_minor_unit)}</span>
                </div>
              )}
              {parseInt(cart.totals.shipping_total) > 0 && (
                <div className="flex justify-between">
                  <span className="text-gray-600">Shipping</span>
                  <span className="font-medium">{formatMinorPrice(cart.totals.shipping_total, currency_minor_unit)}</span>
                </div>
              )}
              {parseInt(cart.totals.fee_total) > 0 && (
                <div className="flex justify-between">
                  <span className="text-gray-600">Fees</span>
                  <span className="font-medium">{formatMinorPrice(cart.totals.fee_total, currency_minor_unit)}</span>
                </div>
              )}
            </div>

            <div className="border-t border-gray-100 pt-4 flex justify-between">
              <span className="font-bold text-gray-900">Total</span>
              <span className="font-extrabold text-xl text-[#2E6F40]">
                {formatMinorPrice(cart.totals.total, currency_minor_unit)}
              </span>
            </div>

            <Link href="/checkout" className="btn-primary w-full justify-between text-base">
              Proceed to Checkout
              <ArrowRight className="w-4 h-4" />
            </Link>

            <Link href="/shop" className="btn-ghost w-full justify-center text-sm">
              Continue Shopping
            </Link>

            <p className="text-center text-xs text-gray-400">
              Secure checkout · All major cards accepted
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

