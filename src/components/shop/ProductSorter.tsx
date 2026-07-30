"use client";

import { useRouter, usePathname } from "next/navigation";
import { ChevronDown, SlidersHorizontal } from "lucide-react";

interface ProductSorterProps {
  currentParams: Record<string, string>;
}

const SORT_OPTIONS = [
  { label: "Newest", value: "date:desc" },
  { label: "Price: Low to High", value: "price:asc" },
  { label: "Price: High to Low", value: "price:desc" },
  { label: "Best Selling", value: "popularity:desc" },
  { label: "Top Rated", value: "rating:desc" },
  { label: "Name: A–Z", value: "title:asc" },
];

export function ProductSorter({ currentParams }: ProductSorterProps) {
  const router = useRouter();
  const pathname = usePathname();
  const current = `${currentParams.orderby ?? "date"}:${currentParams.order ?? "desc"}`;

  const handleChange = (value: string) => {
    const [orderby, order] = value.split(":");
    const params = new URLSearchParams(currentParams);
    params.set("orderby", orderby);
    params.set("order", order);
    params.delete("page");
    router.push(`${pathname}?${params.toString()}`);
  };

  return (
    <div className="flex items-center gap-2">
      <label
        className="text-sm font-semibold text-gray-600 whitespace-nowrap flex items-center gap-1.5"
        htmlFor="sort-select"
      >
        <SlidersHorizontal className="w-3.5 h-3.5 text-[#2E6F40]" />
        Sort by:
      </label>
      <div className="relative">
        <select
          id="sort-select"
          value={current}
          onChange={(e) => handleChange(e.target.value)}
          className="appearance-none text-sm font-medium text-gray-800 bg-white border border-gray-200 rounded-full pl-4 pr-9 py-2 cursor-pointer shadow-xs hover:border-green-400 focus:outline-none focus:ring-2 focus:ring-[#2E6F40] focus:border-[#2E6F40] transition-all"
        >
          {SORT_OPTIONS.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
        <ChevronDown className="w-4 h-4 text-gray-500 pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 transition-transform" />
      </div>
    </div>
  );
}
