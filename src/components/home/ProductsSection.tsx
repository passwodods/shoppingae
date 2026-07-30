import Link from "next/link";
import { ArrowRight } from "lucide-react";
import type { WCProduct } from "@/types/product";
import { ProductCard } from "@/components/ui/ProductCard";
import { cn } from "@/lib/utils";

interface ProductsSectionProps {
  title: string;
  subtitle?: string;
  products: WCProduct[];
  viewAllUrl?: string;
  accentColor?: "pink" | "amber" | "emerald" | "blue";
}

const accentClasses = {
  pink: "text-[#2E6F40]",
  amber: "text-amber-600",
  emerald: "text-emerald-600",
  blue: "text-blue-600",
};

export function ProductsSection({
  title,
  subtitle,
  products,
  viewAllUrl,
  accentColor = "pink",
}: ProductsSectionProps) {
  if (!products.length) return null;

  return (
    <div>
      {/* Section header */}
      <div className="flex items-end justify-between mb-6 gap-4">
        <div>
          <h2 className="section-heading">{title}</h2>
          {subtitle && <p className="section-subheading mt-1">{subtitle}</p>}
        </div>
        {viewAllUrl && (
          <Link
            href={viewAllUrl}
            className={cn(
              "flex items-center gap-1.5 text-sm font-semibold whitespace-nowrap hover:gap-2.5 transition-all",
              accentClasses[accentColor]
            )}
          >
            View all
            <ArrowRight className="w-4 h-4" />
          </Link>
        )}
      </div>

      {/* Products grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
        {products.map((product, i) => (
          <ProductCard
            key={product.id}
            product={product}
            priority={i < 4}
          />
        ))}
      </div>
    </div>
  );
}
