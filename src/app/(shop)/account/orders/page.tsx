"use client";

export const dynamic = "force-dynamic";

import { useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ShoppingBag, Package, Loader2, ChevronRight } from "lucide-react";
import { useAuthStore } from "@/stores/auth.store";
import { getCustomerOrders } from "@/lib/woocommerce";
import { useState } from "react";
import type { WCOrder } from "@/types/customer";
import { formatPrice, formatDate } from "@/lib/utils";

const ORDER_STATUS_COLORS: Record<string, string> = {
  pending: "bg-yellow-100 text-yellow-700",
  processing: "bg-blue-100 text-blue-700",
  "on-hold": "bg-orange-100 text-orange-700",
  completed: "bg-emerald-100 text-emerald-700",
  cancelled: "bg-red-100 text-red-600",
  refunded: "bg-gray-100 text-gray-600",
  failed: "bg-red-100 text-red-600",
};

export default function OrdersPage() {
  const { user, isAuthenticated } = useAuthStore();
  const router = useRouter();
  const [orders, setOrders] = useState<WCOrder[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isAuthenticated) {
      router.replace("/login");
      return;
    }
    // Note: requires customer ID from auth — this would come from the JWT claims
    // For now show placeholder; production fetches via REST with Bearer token
    setLoading(false);
  }, [isAuthenticated, router]);

  if (!isAuthenticated) return null;

  return (
    <div className="container-shop py-8 max-w-4xl mx-auto">
      <div className="flex items-center gap-3 mb-8">
        <Link href="/account" className="text-gray-400 hover:text-gray-600 text-sm">Account</Link>
        <ChevronRight className="w-4 h-4 text-gray-300" />
        <h1 className="text-2xl font-bold text-gray-900">My Orders</h1>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-16">
          <Loader2 className="w-8 h-8 animate-spin text-[#2E6F40]" />
        </div>
      ) : orders.length === 0 ? (
        <div className="text-center py-24">
          <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-green-50 flex items-center justify-center">
            <Package className="w-10 h-10 text-green-300" />
          </div>
          <h2 className="text-xl font-bold text-gray-900 mb-2">No orders yet</h2>
          <p className="text-gray-500 mb-8">Start shopping to see your orders here.</p>
          <Link href="/shop" className="btn-primary">Browse Products</Link>
        </div>
      ) : (
        <div className="space-y-4">
          {orders.map((order) => (
            <div key={order.id} className="card p-5">
              <div className="flex items-center justify-between mb-3 flex-wrap gap-3">
                <div>
                  <p className="font-bold text-gray-900">Order #{order.number}</p>
                  <p className="text-sm text-gray-500">{formatDate(order.date_created)}</p>
                </div>
                <div className="flex items-center gap-3">
                  <span className={`text-xs font-semibold px-2.5 py-1 rounded-full capitalize ${ORDER_STATUS_COLORS[order.status] ?? "bg-gray-100 text-gray-600"}`}>
                    {order.status}
                  </span>
                  <span className="font-bold text-[#2E6F40]">{formatPrice(order.total)}</span>
                </div>
              </div>
              <div className="text-sm text-gray-500">
                {order.line_items.length} item{order.line_items.length !== 1 ? "s" : ""}
                {order.line_items.length > 0 && (
                  <span> · {order.line_items[0].name}{order.line_items.length > 1 ? ` +${order.line_items.length - 1} more` : ""}</span>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

