"use client";

export const dynamic = "force-dynamic";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Loader2, Lock, CreditCard, MapPin, User, CheckCircle } from "lucide-react";
import { useCartStore } from "@/stores/cart.store";
import { useCartInit } from "@/hooks/useCartInit";
import { useAuthStore } from "@/stores/auth.store";
import { placeOrder } from "@/lib/store-api";
import { formatMinorPrice } from "@/lib/utils";
import toast from "react-hot-toast";

const addressSchema = z.object({
  first_name: z.string().min(1, "First name required"),
  last_name: z.string().min(1, "Last name required"),
  company: z.string().default(""),
  address_1: z.string().min(5, "Address required"),
  address_2: z.string().default(""),
  city: z.string().min(2, "City required"),
  state: z.string().default(""),
  postcode: z.string().default(""),
  country: z.string().min(2, "Country required").default("AE"),
  phone: z.string().min(7, "Phone required"),
  email: z.string().email("Valid email required"),
});

const checkoutSchema = z.object({
  billing: addressSchema,
  shipping_same: z.boolean().default(true),
  payment_method: z.string().default("cod"),
  customer_note: z.string().default(""),
});

type CheckoutFormData = z.output<typeof checkoutSchema>;

const STEPS = ["Contact & Billing", "Payment", "Review"];

export default function CheckoutPage() {
  useCartInit();
  const { cart, clearCart } = useCartStore();
  const { isAuthenticated } = useAuthStore();
  const router = useRouter();
  const [step, setStep] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [orderId, setOrderId] = useState<number | null>(null);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(checkoutSchema),
    defaultValues: {
      billing: { country: "AE" },
      shipping_same: true,
      payment_method: "cod",
    },
  });

  const onSubmit = async (data: CheckoutFormData) => {
    setIsSubmitting(true);
    try {
      const order = await placeOrder({
        billing_address: {
          ...data.billing,
          company: data.billing.company ?? "",
          address_2: data.billing.address_2 ?? "",
          state: data.billing.state ?? "",
          postcode: data.billing.postcode ?? "",
        },
        shipping_address: {
          ...data.billing,
          company: data.billing.company ?? "",
          address_2: data.billing.address_2 ?? "",
          state: data.billing.state ?? "",
          postcode: data.billing.postcode ?? "",
        },
        customer_note: data.customer_note,
        payment_method: data.payment_method,
      });

      setOrderId(order.id);
      clearCart();

      // Handle payment redirect if needed
      if (order.payment_result?.redirect_url) {
        window.location.href = order.payment_result.redirect_url;
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Order failed";
      toast.error(msg);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Order success screen
  if (orderId) {
    return (
      <div className="container-shop py-16 text-center max-w-lg mx-auto">
        <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-emerald-100 flex items-center justify-center">
          <CheckCircle className="w-10 h-10 text-emerald-600" />
        </div>
        <h1 className="text-3xl font-bold text-gray-900 mb-3">Order Placed!</h1>
        <p className="text-gray-600 mb-2">
          Thank you for your purchase. Your order #{orderId} has been received.
        </p>
        <p className="text-sm text-gray-400 mb-8">
          You'll receive a confirmation email shortly.
        </p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link href={`/account/orders`} className="btn-primary">View My Orders</Link>
          <Link href="/shop" className="btn-secondary">Continue Shopping</Link>
        </div>
      </div>
    );
  }

  if (!cart || cart.items.length === 0) {
    return (
      <div className="container-shop py-16 text-center">
        <h1 className="text-2xl font-bold mb-4">Your cart is empty</h1>
        <Link href="/shop" className="btn-primary">Go Shopping</Link>
      </div>
    );
  }

  const currency_minor_unit = cart.totals.currency_minor_unit;

  return (
    <div className="container-shop py-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Checkout</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Form */}
        <form onSubmit={handleSubmit(onSubmit)} className="lg:col-span-2 space-y-6">
          {/* Billing */}
          <div className="card p-6 space-y-4">
            <h2 className="flex items-center gap-2 text-lg font-bold text-gray-900">
              <MapPin className="w-5 h-5 text-[#2E6F40]" />
              Billing Address
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium text-gray-700 mb-1 block">First Name *</label>
                <input {...register("billing.first_name")} className="input" placeholder="John" />
                {errors.billing?.first_name && <p className="text-xs text-red-500 mt-1">{errors.billing.first_name.message}</p>}
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700 mb-1 block">Last Name *</label>
                <input {...register("billing.last_name")} className="input" placeholder="Doe" />
                {errors.billing?.last_name && <p className="text-xs text-red-500 mt-1">{errors.billing.last_name.message}</p>}
              </div>
              <div className="sm:col-span-2">
                <label className="text-sm font-medium text-gray-700 mb-1 block">Email *</label>
                <input {...register("billing.email")} type="email" className="input" placeholder="john@example.com" />
                {errors.billing?.email && <p className="text-xs text-red-500 mt-1">{errors.billing.email.message}</p>}
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700 mb-1 block">Phone *</label>
                <input {...register("billing.phone")} type="tel" className="input" placeholder="+971 50 000 0000" />
                {errors.billing?.phone && <p className="text-xs text-red-500 mt-1">{errors.billing.phone.message}</p>}
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700 mb-1 block">Country *</label>
                <select {...register("billing.country")} className="input">
                  <option value="AE">United Arab Emirates</option>
                  <option value="SA">Saudi Arabia</option>
                  <option value="KW">Kuwait</option>
                  <option value="QA">Qatar</option>
                  <option value="BH">Bahrain</option>
                  <option value="OM">Oman</option>
                </select>
              </div>
              <div className="sm:col-span-2">
                <label className="text-sm font-medium text-gray-700 mb-1 block">Address *</label>
                <input {...register("billing.address_1")} className="input" placeholder="Street address, apartment, etc." />
                {errors.billing?.address_1 && <p className="text-xs text-red-500 mt-1">{errors.billing.address_1.message}</p>}
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700 mb-1 block">City *</label>
                <input {...register("billing.city")} className="input" placeholder="Dubai" />
                {errors.billing?.city && <p className="text-xs text-red-500 mt-1">{errors.billing.city.message}</p>}
              </div>
            </div>
          </div>

          {/* Payment */}
          <div className="card p-6 space-y-4">
            <h2 className="flex items-center gap-2 text-lg font-bold text-gray-900">
              <CreditCard className="w-5 h-5 text-[#2E6F40]" />
              Payment Method
            </h2>
            <div className="space-y-2">
              {[
                { id: "cod", label: "Cash on Delivery", description: "Pay when your order arrives" },
                { id: "bacs", label: "Bank Transfer", description: "Transfer to our bank account" },
              ].map((method) => (
                <label key={method.id} className="flex items-start gap-3 p-3 rounded-xl border border-gray-200 hover:border-green-300 cursor-pointer transition-colors has-[:checked]:border-[#2E6F40] has-[:checked]:bg-green-50">
                  <input
                    {...register("payment_method")}
                    type="radio"
                    value={method.id}
                    className="mt-0.5"
                  />
                  <div>
                    <p className="font-semibold text-gray-900 text-sm">{method.label}</p>
                    <p className="text-xs text-gray-500">{method.description}</p>
                  </div>
                </label>
              ))}
            </div>
          </div>

          {/* Note */}
          <div className="card p-6">
            <label className="text-sm font-medium text-gray-700 mb-1.5 block">
              Order Notes (optional)
            </label>
            <textarea
              {...register("customer_note")}
              rows={3}
              className="input resize-none"
              placeholder="Special instructions for your order…"
            />
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="btn-primary w-full text-base py-4"
          >
            {isSubmitting ? (
              <><Loader2 className="w-5 h-5 animate-spin" /> Placing Order…</>
            ) : (
              <><Lock className="w-5 h-5" /> Place Order</>
            )}
          </button>

          <p className="text-center text-xs text-gray-400">
            By placing your order, you agree to our{" "}
            <Link href="/terms" className="text-[#2E6F40] hover:underline">Terms of Service</Link>{" "}
            and{" "}
            <Link href="/privacy-policy" className="text-[#2E6F40] hover:underline">Privacy Policy</Link>.
          </p>
        </form>

        {/* Summary */}
        <div className="lg:col-span-1">
          <div className="card p-6 sticky top-24 space-y-4">
            <h2 className="text-lg font-bold text-gray-900">Order Summary</h2>
            <div className="space-y-3 max-h-64 overflow-y-auto">
              {cart.items.map((item) => (
                <div key={item.key} className="flex items-center gap-3 text-sm">
                  <span className="flex-shrink-0 w-6 h-6 rounded-full bg-green-100 text-pink-700 text-xs font-bold flex items-center justify-center">
                    {item.quantity}
                  </span>
                  <span className="flex-1 text-gray-700 truncate">{item.name}</span>
                  <span className="font-semibold text-gray-900 flex-shrink-0">
                    {formatMinorPrice(item.totals.line_total, currency_minor_unit)}
                  </span>
                </div>
              ))}
            </div>
            <div className="border-t border-gray-100 pt-4 space-y-2 text-sm">
              <div className="flex justify-between text-gray-600">
                <span>Subtotal</span>
                <span>{formatMinorPrice(cart.totals.subtotal, currency_minor_unit)}</span>
              </div>
              {parseInt(cart.totals.shipping_total) > 0 && (
                <div className="flex justify-between text-gray-600">
                  <span>Shipping</span>
                  <span>{formatMinorPrice(cart.totals.shipping_total, currency_minor_unit)}</span>
                </div>
              )}
              {parseInt(cart.totals.discount_total) > 0 && (
                <div className="flex justify-between text-green-600">
                  <span>Discount</span>
                  <span>-{formatMinorPrice(cart.totals.discount_total, currency_minor_unit)}</span>
                </div>
              )}
            </div>
            <div className="border-t border-gray-100 pt-3 flex justify-between font-bold">
              <span className="text-gray-900">Total</span>
              <span className="text-xl text-[#2E6F40]">
                {formatMinorPrice(cart.totals.total, currency_minor_unit)}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

