"use client";

export const dynamic = "force-dynamic";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { User, ShoppingBag, Heart, MapPin, Settings, LogOut, ChevronRight } from "lucide-react";
import { useAuthStore } from "@/stores/auth.store";
import { useWishlistStore } from "@/stores/wishlist.store";
import { useEffect } from "react";

const NAV_ITEMS = [
  { label: "My Orders", href: "/account/orders", icon: "orders" },
  { label: "Wishlist", href: "/account/wishlist", icon: "wishlist" },
  { label: "Addresses", href: "/account/addresses", icon: "addresses" },
  { label: "Account Settings", href: "/account/settings", icon: "settings" },
];

function NavIcon({ type, className }: { type: string; className: string }) {
  switch (type) {
    case "orders":    return <ShoppingBag className={className} />;
    case "wishlist":  return <Heart className={className} />;
    case "addresses": return <MapPin className={className} />;
    case "settings":  return <Settings className={className} />;
    default:          return null;
  }
}

export default function AccountPage() {
  const { user, isAuthenticated, logout } = useAuthStore();
  const { items: wishlistItems } = useWishlistStore();
  const router = useRouter();

  useEffect(() => {
    if (!isAuthenticated) {
      router.replace("/login");
    }
  }, [isAuthenticated, router]);

  if (!isAuthenticated || !user) {
    return null;
  }

  const handleLogout = () => {
    logout();
    router.push("/");
  };

  return (
    <div className="container-shop py-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">My Account</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Sidebar */}
        <div className="lg:col-span-1 space-y-4">
          {/* User card */}
          <div className="card p-6 text-center">
            <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-gradient-to-br from-pink-200 to-purple-200 flex items-center justify-center">
              <User className="w-10 h-10 text-[#2E6F40]" />
            </div>
            <h2 className="font-bold text-gray-900 text-lg">{user.user_display_name}</h2>
            <p className="text-sm text-gray-500 mt-0.5">{user.user_email}</p>
          </div>

          {/* Navigation */}
          <div className="card divide-y divide-gray-100">
            {NAV_ITEMS.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="flex items-center gap-3 px-5 py-3.5 hover:bg-gray-50 transition-colors group"
              >
                <NavIcon
                  type={item.icon}
                  className="w-5 h-5 text-gray-400 group-hover:text-[#2E6F40] transition-colors"
                />
                <span className="flex-1 text-sm font-medium text-gray-700 group-hover:text-gray-900">
                  {item.label}
                </span>
                <ChevronRight className="w-4 h-4 text-gray-300 group-hover:text-gray-500" />
              </Link>
            ))}
            <button
              onClick={handleLogout}
              className="flex items-center gap-3 px-5 py-3.5 w-full text-left hover:bg-red-50 transition-colors group"
            >
              <LogOut className="w-5 h-5 text-gray-400 group-hover:text-red-500 transition-colors" />
              <span className="text-sm font-medium text-gray-700 group-hover:text-red-600">
                Sign Out
              </span>
            </button>
          </div>
        </div>

        {/* Main content */}
        <div className="lg:col-span-2 space-y-8">
          {/* Quick stats */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
            <div className="card p-5 text-center">
              <ShoppingBag className="w-8 h-8 text-[#2E6F40] mx-auto mb-2" />
              <p className="text-2xl font-extrabold text-gray-900">—</p>
              <p className="text-xs text-gray-500 mt-0.5">Total Orders</p>
            </div>
            <div className="card p-5 text-center">
              <Heart className="w-8 h-8 text-[#2E6F40] mx-auto mb-2" />
              <p className="text-2xl font-extrabold text-gray-900">{wishlistItems.length}</p>
              <p className="text-xs text-gray-500 mt-0.5">Wishlist Items</p>
            </div>
            <div className="card p-5 text-center">
              <MapPin className="w-8 h-8 text-[#2E6F40] mx-auto mb-2" />
              <p className="text-2xl font-extrabold text-gray-900">—</p>
              <p className="text-xs text-gray-500 mt-0.5">Addresses</p>
            </div>
          </div>

          {/* Wishlist preview */}
          {wishlistItems.length > 0 && (
            <div>
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-bold text-gray-900">Your Wishlist</h3>
                <Link href="/account/wishlist" className="text-sm text-[#2E6F40] hover:underline">
                  View all
                </Link>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {wishlistItems.slice(0, 3).map((item) => (
                  <Link
                    key={item.id}
                    href={`/product/${item.slug}`}
                    className="card p-3 flex items-center gap-3 hover:shadow-md transition-shadow"
                  >
                    <div className="w-12 h-12 rounded-lg bg-gray-100 overflow-hidden flex-shrink-0">
                      <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                    </div>
                    <div className="min-w-0">
                      <p className="text-xs font-semibold text-gray-900 truncate">{item.name}</p>
                      <p className="text-xs text-[#2E6F40] font-bold">{item.price}</p>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

