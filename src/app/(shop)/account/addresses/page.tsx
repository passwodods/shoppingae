"use client";

export const dynamic = "force-dynamic";

import { MapPin, Plus, ChevronRight } from "lucide-react";
import Link from "next/link";
import { useAuthStore } from "@/stores/auth.store";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function AddressesPage() {
  const { isAuthenticated } = useAuthStore();
  const router = useRouter();

  useEffect(() => {
    if (!isAuthenticated) router.replace("/login");
  }, [isAuthenticated, router]);

  if (!isAuthenticated) return null;

  return (
    <div className="container-shop py-8 max-w-3xl mx-auto">
      <div className="flex items-center gap-3 mb-8">
        <Link href="/account" className="text-gray-400 hover:text-gray-600 text-sm">Account</Link>
        <ChevronRight className="w-4 h-4 text-gray-300" />
        <h1 className="text-2xl font-bold text-gray-900">My Addresses</h1>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Billing */}
        <div className="card p-6">
          <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
            <MapPin className="w-5 h-5 text-[#2E6F40]" />
            Billing Address
          </h3>
          <p className="text-sm text-gray-500 mb-4">No billing address saved yet.</p>
          <Link href="/account/settings" className="text-sm text-[#2E6F40] hover:underline font-semibold">
            Add Billing Address →
          </Link>
        </div>

        {/* Shipping */}
        <div className="card p-6">
          <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
            <MapPin className="w-5 h-5 text-[#2E6F40]" />
            Shipping Address
          </h3>
          <p className="text-sm text-gray-500 mb-4">No shipping address saved yet.</p>
          <Link href="/account/settings" className="text-sm text-[#2E6F40] hover:underline font-semibold">
            Add Shipping Address →
          </Link>
        </div>
      </div>
    </div>
  );
}

