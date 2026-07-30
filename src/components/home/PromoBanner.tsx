import Link from "next/link";
import { ArrowRight } from "lucide-react";

export function PromoBanner() {
  return (
    <section className="container-shop py-10" aria-label="Promotional banners">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Banner 1 */}
        <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-[#2E6F40] to-[#15803D] p-8 text-white min-h-[200px] flex flex-col justify-end group">
          <div className="absolute inset-0 bg-gradient-to-br from-[#2E6F40]/90 to-[#166534]/95" />
          {/* Decorative circles */}
          <div className="absolute -top-10 -right-10 w-48 h-48 rounded-full bg-white/10" />
          <div className="absolute top-4 right-4 w-24 h-24 rounded-full bg-white/5" />
          <div className="relative z-10">
            <span className="text-xs font-semibold uppercase tracking-widest text-green-200 mb-2 block">
              Special Offer
            </span>
            <h3 className="text-2xl font-bold leading-tight mb-3">
              Save up to 40% on<br />Skincare Essentials
            </h3>
            <Link
              href="/category/skincare-beauty"
              className="inline-flex items-center gap-1.5 text-sm font-semibold text-white hover:gap-3 transition-all duration-200 group-hover:text-green-200"
            >
              Shop Skincare
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>

        {/* Banner 2 */}
        <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-emerald-600 to-teal-700 p-8 text-white min-h-[200px] flex flex-col justify-end group">
          <div className="absolute inset-0 bg-gradient-to-br from-emerald-600/90 to-teal-800/95" />
          <div className="absolute -top-10 -right-10 w-48 h-48 rounded-full bg-white/10" />
          <div className="absolute top-4 right-4 w-24 h-24 rounded-full bg-white/5" />
          <div className="relative z-10">
            <span className="text-xs font-semibold uppercase tracking-widest text-emerald-200 mb-2 block">
              Free Shipping
            </span>
            <h3 className="text-2xl font-bold leading-tight mb-3">
              Vitamins & Supplements<br />Starting from AED 29
            </h3>
            <Link
              href="/category/vitamins-supplements"
              className="inline-flex items-center gap-1.5 text-sm font-semibold text-white hover:gap-3 transition-all duration-200 group-hover:text-emerald-200"
            >
              Shop Vitamins
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
