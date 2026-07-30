"use client";

import { useRouter, usePathname } from "next/navigation";
import { X } from "lucide-react";
import type { WCCategory } from "@/types/product";

interface ActiveFiltersProps {
  currentParams: Record<string, string>;
  categories: WCCategory[];
}

export function ActiveFilters({ currentParams, categories }: ActiveFiltersProps) {
  const router = useRouter();
  const pathname = usePathname();

  const removeFilter = (key: string) => {
    const params = new URLSearchParams(currentParams);
    params.delete(key);
    params.delete("page");
    router.push(`${pathname}?${params.toString()}`);
  };

  const activeFilters: Array<{ key: string; label: string }> = [];

  if (currentParams.category) {
    const cat = categories.find((c) => String(c.id) === currentParams.category);
    if (cat) activeFilters.push({ key: "category", label: `Category: ${cat.name}` });
  }
  if (currentParams.min_price) activeFilters.push({ key: "min_price", label: `Min: AED ${currentParams.min_price}` });
  if (currentParams.max_price) activeFilters.push({ key: "max_price", label: `Max: AED ${currentParams.max_price}` });
  if (currentParams.on_sale === "true") activeFilters.push({ key: "on_sale", label: "On Sale" });
  if (currentParams.featured === "true") activeFilters.push({ key: "featured", label: "Featured" });

  if (!activeFilters.length) return null;

  return (
    <div className="flex flex-wrap gap-2 mb-4">
      {activeFilters.map((filter) => (
        <button
          key={filter.key}
          onClick={() => removeFilter(filter.key)}
          className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-green-50 border border-pink-200 text-xs font-semibold text-pink-700 hover:bg-green-100 transition-colors"
        >
          {filter.label}
          <X className="w-3 h-3" />
        </button>
      ))}
    </div>
  );
}
