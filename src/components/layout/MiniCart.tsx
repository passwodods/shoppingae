"use client";

import { motion, AnimatePresence } from "framer-motion";
import { X, ShoppingBag, Trash2, Minus, Plus, ArrowRight, Loader2 } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { useCartStore } from "@/stores/cart.store";
import { formatMinorPrice } from "@/lib/utils";
import { cn } from "@/lib/utils";

export function MiniCart() {
  const {
    cart,
    isLoading,
    isDrawerOpen,
    closeDrawer,
    updateItem,
    removeItem,
  } = useCartStore();

  return (
    <AnimatePresence>
      {isDrawerOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            key="minicart-backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-[60] bg-black/50 backdrop-blur-sm"
            onClick={closeDrawer}
          />

          {/* Drawer */}
          <motion.div
            key="minicart-drawer"
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 30, stiffness: 300 }}
            className="fixed right-0 top-0 bottom-0 z-[61] w-[90vw] max-w-[420px] bg-white shadow-2xl flex flex-col"
            role="dialog"
            aria-modal="true"
            aria-label="Shopping cart"
          >
            {/* Header */}
            <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
              <div className="flex items-center gap-2">
                <ShoppingBag className="w-5 h-5 text-[#2E6F40]" />
                <h2 className="font-bold text-gray-900">
                  Your Cart
                  {cart && cart.items_count > 0 && (
                    <span className="ml-2 text-sm font-normal text-gray-400">
                      ({cart.items_count} {cart.items_count === 1 ? "item" : "items"})
                    </span>
                  )}
                </h2>
              </div>
              <button onClick={closeDrawer} className="btn-icon" aria-label="Close cart">
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto">
              {isLoading && !cart ? (
                <div className="flex items-center justify-center h-40">
                  <Loader2 className="w-8 h-8 animate-spin text-[#2E6F40]" />
                </div>
              ) : !cart || cart.items.length === 0 ? (
                /* Empty state */
                <div className="flex flex-col items-center justify-center h-full gap-4 px-5 py-12">
                  <div className="w-20 h-20 rounded-full bg-green-50 flex items-center justify-center">
                    <ShoppingBag className="w-9 h-9 text-green-300" />
                  </div>
                  <div className="text-center">
                    <p className="text-lg font-bold text-gray-900">Your cart is empty</p>
                    <p className="text-sm text-gray-500 mt-1">Add some products to get started</p>
                  </div>
                  <Link
                    href="/shop"
                    onClick={closeDrawer}
                    className="btn-primary"
                  >
                    Start Shopping
                  </Link>
                </div>
              ) : (
                /* Cart items */
                <div className="divide-y divide-gray-50 px-5">
                  {cart.items.map((item) => (
                    <motion.div
                      key={item.key}
                      layout
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                      className="py-4 flex gap-3"
                    >
                      {/* Image */}
                      <div className="w-16 h-16 rounded-xl bg-gray-100 overflow-hidden flex-shrink-0">
                        {item.images[0] && (
                          <Image
                            src={item.images[0].thumbnail || item.images[0].src}
                            alt={item.images[0].alt || item.name}
                            width={64}
                            height={64}
                            className="w-full h-full object-cover"
                          />
                        )}
                      </div>

                      {/* Details */}
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-semibold text-gray-900 leading-tight line-clamp-2">
                          {item.name}
                        </p>
                        {/* Variations */}
                        {item.variation.length > 0 && (
                          <p className="text-xs text-gray-400 mt-0.5">
                            {item.variation.map((v) => `${v.attribute}: ${v.value}`).join(", ")}
                          </p>
                        )}
                        <p className="text-sm font-bold text-[#2E6F40] mt-1">
                          {formatMinorPrice(item.totals.line_total, item.totals.currency_minor_unit)}
                        </p>

                        {/* Quantity controls */}
                        <div className="flex items-center gap-2 mt-2">
                          <div className="flex items-center rounded-lg border border-gray-200 overflow-hidden">
                            <button
                              onClick={() => item.quantity > 1 ? updateItem(item.key, item.quantity - 1) : removeItem(item.key)}
                              className="w-7 h-7 flex items-center justify-center text-gray-600 hover:bg-gray-100 transition-colors"
                              disabled={isLoading}
                              aria-label="Decrease quantity"
                            >
                              <Minus className="w-3 h-3" />
                            </button>
                            <span className="w-8 text-center text-sm font-semibold">{item.quantity}</span>
                            <button
                              onClick={() => updateItem(item.key, item.quantity + 1)}
                              className="w-7 h-7 flex items-center justify-center text-gray-600 hover:bg-gray-100 transition-colors"
                              disabled={isLoading || (item.quantity_limit > 0 && item.quantity >= item.quantity_limit)}
                              aria-label="Increase quantity"
                            >
                              <Plus className="w-3 h-3" />
                            </button>
                          </div>
                          <button
                            onClick={() => removeItem(item.key)}
                            className="p-1.5 text-gray-400 hover:text-red-500 transition-colors rounded-lg hover:bg-red-50"
                            disabled={isLoading}
                            aria-label="Remove item"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              )}
            </div>

            {/* Footer with totals */}
            {cart && cart.items.length > 0 && (
              <div className="border-t border-gray-100 px-5 py-5 space-y-3">
                {/* Subtotal */}
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Subtotal</span>
                  <span className="font-semibold text-gray-900">
                    {formatMinorPrice(cart.totals.subtotal, cart.totals.currency_minor_unit)}
                  </span>
                </div>

                {/* Discount */}
                {parseInt(cart.totals.discount_total) > 0 && (
                  <div className="flex justify-between text-sm">
                    <span className="text-green-600">Discount</span>
                    <span className="font-semibold text-green-600">
                      -{formatMinorPrice(cart.totals.discount_total, cart.totals.currency_minor_unit)}
                    </span>
                  </div>
                )}

                {/* Total */}
                <div className="flex justify-between pt-2 border-t border-gray-100">
                  <span className="font-bold text-gray-900">Total</span>
                  <span className="font-bold text-lg text-[#2E6F40]">
                    {formatMinorPrice(cart.totals.total, cart.totals.currency_minor_unit)}
                  </span>
                </div>

                {/* CTA Buttons */}
                <div className="flex flex-col gap-2 pt-1">
                  <Link
                    href="/checkout"
                    onClick={closeDrawer}
                    className="btn-primary w-full justify-between"
                  >
                    Checkout
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                  <Link
                    href="/cart"
                    onClick={closeDrawer}
                    className="btn-secondary w-full"
                  >
                    View Cart
                  </Link>
                </div>

                <p className="text-center text-xs text-gray-400">
                  Taxes and shipping calculated at checkout
                </p>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
