"use client";

export const dynamic = "force-dynamic";

import Link from "next/link";
import Image from "next/image";
import { Trash2, ShoppingCart, Heart } from "lucide-react";
import { useWishlistStore } from "@/stores/wishlist.store";
import { useCartStore } from "@/stores/cart.store";
import { useAuthStore } from "@/stores/auth.store";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function WishlistPage() {
  const { items, removeItem } = useWishlistStore();
  const { addItem } = useCartStore();
  const { isAuthenticated } = useAuthStore();
  const router = useRouter();

  const handleAddToCart = async (item: (typeof items)[0]) => {
    await addItem(parseInt(String(item.id)), 1);
  };

  return (
    <div className="container-shop py-8">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold text-gray-900">
          My Wishlist
          {items.length > 0 && (
            <span className="ml-3 text-lg font-normal text-gray-400">({items.length})</span>
          )}
        </h1>
        <Link href="/shop" className="btn-ghost text-sm">Continue Shopping</Link>
      </div>

      {items.length === 0 ? (
        <div className="text-center py-24">
          <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-green-50 flex items-center justify-center">
            <Heart className="w-10 h-10 text-green-300" />
          </div>
          <h2 className="text-xl font-bold text-gray-900 mb-2">Your wishlist is empty</h2>
          <p className="text-gray-500 mb-8">Save items you love for later.</p>
          <Link href="/shop" className="btn-primary">Browse Products</Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {items.map((item) => (
            <div key={item.id} className="card card-hover overflow-hidden group">
              <Link href={`/product/${item.slug}`} className="block aspect-square bg-gray-50 overflow-hidden relative">
                {item.image ? (
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-full h-full object-contain p-3 group-hover:scale-105 transition-transform duration-300"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-gray-200">
                    <Heart className="w-16 h-16" />
                  </div>
                )}
              </Link>
              <div className="p-4">
                <Link href={`/product/${item.slug}`}>
                  <h3 className="font-semibold text-gray-900 text-sm line-clamp-2 mb-2 hover:text-[#2E6F40] transition-colors">
                    {item.name}
                  </h3>
                </Link>
                <p className="text-[#2E6F40] font-bold text-base mb-4">{item.price}</p>
                <div className="flex gap-2">
                  <button
                    onClick={() => handleAddToCart(item)}
                    className="flex-1 btn-primary text-xs py-2"
                  >
                    <ShoppingCart className="w-3.5 h-3.5" />
                    Add to Cart
                  </button>
                  <button
                    onClick={() => removeItem(item.id)}
                    className="w-9 h-9 rounded-xl border border-gray-200 flex items-center justify-center text-gray-400 hover:text-red-500 hover:border-red-200 hover:bg-red-50 transition-all"
                    aria-label="Remove from wishlist"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

