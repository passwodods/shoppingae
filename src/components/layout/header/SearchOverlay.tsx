"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search, X, Loader2, TrendingUp, Clock } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { useUIStore } from "@/stores/ui.store";
import { searchProducts } from "@/lib/woocommerce";
import type { WCProduct } from "@/types/product";
import { formatPrice, buildProductUrl } from "@/lib/utils";
import { useDebounce } from "@/hooks/useDebounce";

const POPULAR_SEARCHES = [
  "Vitamin C Serum",
  "Face Wash",
  "Sunscreen SPF 50",
  "Protein Powder",
  "Fragrance",
  "Multivitamin",
];

export function SearchOverlay() {
  const { isSearchOpen, closeSearch } = useUIStore();
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<WCProduct[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const debouncedQuery = useDebounce(query, 350);

  useEffect(() => {
    if (isSearchOpen) {
      setTimeout(() => inputRef.current?.focus(), 100);
    } else {
      setQuery("");
      setResults([]);
    }
  }, [isSearchOpen]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") closeSearch();
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [closeSearch]);

  useEffect(() => {
    if (!debouncedQuery || debouncedQuery.length < 2) {
      setResults([]);
      return;
    }

    let cancelled = false;
    setIsLoading(true);
    searchProducts(debouncedQuery, 6)
      .then((products) => {
        if (!cancelled) setResults(products);
      })
      .catch(() => {
        if (!cancelled) setResults([]);
      })
      .finally(() => {
        if (!cancelled) setIsLoading(false);
      });

    return () => { cancelled = true; };
  }, [debouncedQuery]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      closeSearch();
      window.location.href = `/search?q=${encodeURIComponent(query.trim())}`;
    }
  };

  return (
    <AnimatePresence>
      {isSearchOpen && (
        <>
          <motion.div
            key="search-backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-[70] bg-black/60 backdrop-blur-sm"
            onClick={closeSearch}
          />

          <motion.div
            key="search-panel"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.25, ease: "easeOut" }}
            className="fixed top-0 left-0 right-0 z-[71] bg-white shadow-2xl"
          >
            <div className="container-shop py-4">
              {/* Search input */}
              <form onSubmit={handleSearch} className="flex items-center gap-3">
                <Search className="w-5 h-5 text-gray-400 flex-shrink-0" />
                <input
                  ref={inputRef}
                  type="search"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Search for products, brands, categories…"
                  className="flex-1 bg-transparent text-lg text-gray-900 placeholder:text-gray-400 outline-none"
                  autoComplete="off"
                />
                {isLoading && <Loader2 className="w-5 h-5 text-[#2E6F40] animate-spin flex-shrink-0" />}
                <button
                  type="button"
                  onClick={closeSearch}
                  className="btn-icon flex-shrink-0"
                  aria-label="Close search"
                >
                  <X className="w-5 h-5" />
                </button>
              </form>

              {/* Divider */}
              <div className="h-px bg-gray-100 mt-4" />

              {/* Results / Suggestions */}
              <div className="py-4 max-h-[60vh] overflow-y-auto">
                {query.length < 2 ? (
                  /* Popular searches */
                  <div>
                    <p className="flex items-center gap-2 text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">
                      <TrendingUp className="w-3.5 h-3.5" />
                      Popular Searches
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {POPULAR_SEARCHES.map((s) => (
                        <button
                          key={s}
                          onClick={() => setQuery(s)}
                          className="px-3 py-1.5 rounded-full border border-gray-200 text-sm text-gray-600 hover:border-green-300 hover:text-[#2E6F40] hover:bg-green-50 transition-all"
                        >
                          {s}
                        </button>
                      ))}
                    </div>
                  </div>
                ) : results.length > 0 ? (
                  /* Product results */
                  <div>
                    <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">
                      Products
                    </p>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      {results.map((product) => (
                        <Link
                          key={product.id}
                          href={buildProductUrl(product.slug)}
                          onClick={closeSearch}
                          className="flex items-center gap-3 p-2 rounded-xl hover:bg-gray-50 transition-colors group"
                        >
                          <div className="w-12 h-12 rounded-lg bg-gray-100 overflow-hidden flex-shrink-0">
                            {product.images[0] && (
                              <Image
                                src={product.images[0].src}
                                alt={product.images[0].alt || product.name}
                                width={48}
                                height={48}
                                className="w-full h-full object-cover"
                              />
                            )}
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-gray-900 truncate group-hover:text-[#2E6F40] transition-colors">
                              {product.name}
                            </p>
                            <p className="text-sm font-bold text-[#2E6F40]">
                              {formatPrice(product.price)}
                            </p>
                          </div>
                        </Link>
                      ))}
                    </div>
                    <Link
                      href={`/search?q=${encodeURIComponent(query)}`}
                      onClick={closeSearch}
                      className="mt-4 flex items-center justify-center w-full py-2.5 rounded-xl border border-gray-200 text-sm font-semibold text-gray-700 hover:border-green-300 hover:text-[#2E6F40] hover:bg-green-50 transition-all"
                    >
                      View all results for "{query}"
                    </Link>
                  </div>
                ) : !isLoading && query.length >= 2 ? (
                  <div className="text-center py-8">
                    <p className="text-gray-500 text-sm">No products found for "<strong>{query}</strong>"</p>
                    <p className="text-gray-400 text-xs mt-1">Try different keywords</p>
                  </div>
                ) : null}
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
