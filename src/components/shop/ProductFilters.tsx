"use client";

import { useRouter, usePathname, useSearchParams } from "next/navigation";
import { useCallback } from "react";
import type { WCCategory } from "@/types/product";
import { buildCategoryUrl, decodeHtmlEntities } from "@/lib/utils";

interface ProductFiltersProps {
  categories: WCCategory[];
  currentParams: Record<string, string>;
}

export function ProductFilters({ categories, currentParams }: ProductFiltersProps) {
  const router = useRouter();
  const pathname = usePathname();

  const updateFilter = useCallback(
    (key: string, value: string | null) => {
      const params = new URLSearchParams(currentParams);
      params.delete("page");
      if (value === null) {
        params.delete(key);
      } else {
        params.set(key, value);
      }
      router.push(`${pathname}?${params.toString()}`);
    },
    [currentParams, pathname, router]
  );

  return (
    <div className="space-y-6">
      {/* Categories */}
      <div>
        <h3 className="text-sm font-bold text-gray-900 mb-3 uppercase tracking-wider">Category</h3>
        <div className="space-y-1">
          <button
            onClick={() => updateFilter("category", null)}
            className={`w-full text-left text-sm px-2 py-1.5 rounded-lg transition-colors ${
              !currentParams.category
                ? "text-[#2E6F40] bg-green-50 font-semibold"
                : "text-gray-600 hover:text-[#2E6F40] hover:bg-green-50"
            }`}
          >
            All Categories
          </button>
          {categories
            .filter((cat) => cat.count > 0)
            .map((cat) => {
              const isChild = cat.parent !== 0;
              const cleanName = decodeHtmlEntities(cat.name);
              return (
                <button
                  key={cat.id}
                  onClick={() => updateFilter("category", String(cat.id))}
                  className={`w-full text-left text-sm px-2 py-1.5 rounded-lg transition-colors flex items-center justify-between ${
                    currentParams.category === String(cat.id)
                      ? "text-[#2E6F40] bg-green-50 font-semibold"
                      : "text-gray-600 hover:text-[#2E6F40] hover:bg-green-50"
                  }`}
                >
                  <span className={isChild ? "pl-3.5 text-gray-500 text-xs font-normal" : ""}>
                    {isChild ? `• ${cleanName}` : cleanName}
                  </span>
                  <span className="text-xs text-gray-400">{cat.count}</span>
                </button>
              );
            })}
        </div>
      </div>

      {/* Price range */}
      <div>
        <h3 className="text-sm font-bold text-gray-900 mb-3 uppercase tracking-wider">Price</h3>
        <div className="flex items-center gap-2">
          <input
            type="number"
            placeholder="Min"
            defaultValue={currentParams.min_price}
            onBlur={(e) => updateFilter("min_price", e.target.value || null)}
            className="input text-sm py-1.5"
            min={0}
          />
          <span className="text-gray-400">–</span>
          <input
            type="number"
            placeholder="Max"
            defaultValue={currentParams.max_price}
            onBlur={(e) => updateFilter("max_price", e.target.value || null)}
            className="input text-sm py-1.5"
            min={0}
          />
        </div>
      </div>

      {/* On Sale */}
      <div>
        <h3 className="text-sm font-bold text-gray-900 mb-3 uppercase tracking-wider">Deals</h3>
        <label className="flex items-center gap-2 cursor-pointer">
          <input
            type="checkbox"
            checked={currentParams.on_sale === "true"}
            onChange={(e) => updateFilter("on_sale", e.target.checked ? "true" : null)}
            className="w-4 h-4 rounded border-gray-300 text-[#2E6F40] focus:ring-[#2E6F40]"
          />
          <span className="text-sm text-gray-700">On Sale</span>
        </label>
        <label className="flex items-center gap-2 cursor-pointer mt-2">
          <input
            type="checkbox"
            checked={currentParams.featured === "true"}
            onChange={(e) => updateFilter("featured", e.target.checked ? "true" : null)}
            className="w-4 h-4 rounded border-gray-300 text-[#2E6F40] focus:ring-[#2E6F40]"
          />
          <span className="text-sm text-gray-700">Featured</span>
        </label>
      </div>

      {/* Clear all */}
      {Object.keys(currentParams).filter((k) => k !== "page").length > 0 && (
        <button
          onClick={() => router.push(pathname)}
          className="w-full text-center text-sm text-red-500 hover:text-red-700 py-2 border border-red-200 rounded-xl hover:bg-red-50 transition-colors"
        >
          Clear all filters
        </button>
      )}
    </div>
  );
}
