"use client";

import Link from "next/link";
import Image from "next/image";
import { ShoppingCart, Check, Loader2, ChevronLeft, ChevronRight, RefreshCw } from "lucide-react";
import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import type { WCProduct } from "@/types/product";
import { formatPrice, cn } from "@/lib/utils";
import { StarRating } from "@/components/ui/StarRating";
import { useCartStore } from "@/stores/cart.store";

interface BestSellersSidebarProps {
  products: WCProduct[];
  currentProductId?: number;
}

const ITEMS_PER_PAGE = 5;

export function BestSellersSidebar({ products, currentProductId }: BestSellersSidebarProps) {
  const [addingId, setAddingId] = useState<number | null>(null);
  const [addedId, setAddedId] = useState<number | null>(null);
  const [currentPage, setCurrentPage] = useState(0);
  const [isHovered, setIsHovered] = useState(false);
  const { addItem } = useCartStore();

  // Filter out current product
  const filteredProducts = products.filter((p) => p.id !== currentProductId);

  // Total pages of 5 products each
  const totalPages = Math.ceil(filteredProducts.length / ITEMS_PER_PAGE);

  // Auto-rotate every 6 seconds if there are multiple pages
  useEffect(() => {
    if (totalPages <= 1 || isHovered) return;

    const timer = setInterval(() => {
      setCurrentPage((prev) => (prev + 1) % totalPages);
    }, 6000);

    return () => clearInterval(timer);
  }, [totalPages, isHovered]);

  if (!filteredProducts.length) return null;

  // Get current 5 products for active page
  const startIndex = currentPage * ITEMS_PER_PAGE;
  const currentBatch = filteredProducts.slice(startIndex, startIndex + ITEMS_PER_PAGE);

  // Handle case where batch has fewer than 5 (wrap around if needed to always show 5)
  let visibleProducts = currentBatch;
  if (visibleProducts.length < ITEMS_PER_PAGE && filteredProducts.length >= ITEMS_PER_PAGE) {
    visibleProducts = [
      ...currentBatch,
      ...filteredProducts.slice(0, ITEMS_PER_PAGE - currentBatch.length),
    ];
  }

  const handleNext = () => {
    setCurrentPage((prev) => (prev + 1) % totalPages);
  };

  const handlePrev = () => {
    setCurrentPage((prev) => (prev - 1 + totalPages) % totalPages);
  };

  const handleQuickAdd = async (e: React.MouseEvent, product: WCProduct) => {
    e.preventDefault();
    e.stopPropagation();

    setAddingId(product.id);
    try {
      await addItem(product.id, 1);
      setAddedId(product.id);
      setTimeout(() => setAddedId(null), 2000);
    } finally {
      setAddingId(null);
    }
  };

  return (
    <aside
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className="bg-white rounded-2xl border border-gray-200 p-5 shadow-xs sticky top-24 space-y-4"
    >
      {/* Header with Navigation Controls */}
      <div className="flex items-center justify-between pb-3 border-b border-gray-100">
        <div>
          <h3 className="font-bold text-base text-gray-900 leading-tight">Best Selling Products</h3>
          <p className="text-xs text-gray-500">Top 5 items customers love</p>
        </div>

        {/* Carousel Rotation Controls */}
        {totalPages > 1 && (
          <div className="flex items-center gap-1">
            <button
              onClick={handlePrev}
              className="w-7 h-7 rounded-lg border border-gray-200 flex items-center justify-center text-gray-600 hover:text-[#2E6F40] hover:border-[#2E6F40] hover:bg-green-50 transition-all"
              aria-label="Previous best sellers"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <span className="text-[11px] font-bold text-gray-500 px-1">
              {currentPage + 1}/{totalPages}
            </span>
            <button
              onClick={handleNext}
              className="w-7 h-7 rounded-lg border border-gray-200 flex items-center justify-center text-gray-600 hover:text-[#2E6F40] hover:border-[#2E6F40] hover:bg-green-50 transition-all"
              aria-label="Next best sellers"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>

      {/* Product List with Smooth Fade/Slide Transition */}
      <AnimatePresence mode="wait">
        <motion.div
          key={currentPage}
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -6 }}
          transition={{ duration: 0.25 }}
          className="space-y-3"
        >
          {visibleProducts.map((product) => {
            const isAdding = addingId === product.id;
            const isAdded = addedId === product.id;
            const discount =
              product.on_sale && product.sale_price && product.regular_price
                ? Math.round(
                    ((parseFloat(product.regular_price) - parseFloat(product.sale_price)) /
                      parseFloat(product.regular_price)) *
                      100
                  )
                : 0;

            return (
              <div
                key={product.id}
                className="group flex gap-3 p-2 rounded-xl border border-gray-100 hover:border-green-200 hover:bg-green-50/30 transition-all duration-200"
              >
                {/* Thumbnail */}
                <Link
                  href={`/product/${product.slug}`}
                  className="relative w-16 h-16 rounded-lg bg-gray-50 overflow-hidden flex-shrink-0 border border-gray-100"
                >
                  {product.images[0] && (
                    <Image
                      src={product.images[0].src}
                      alt={product.images[0].alt || product.name}
                      fill
                      sizes="64px"
                      className="object-contain p-1 group-hover:scale-105 transition-transform duration-300"
                    />
                  )}
                  {discount > 0 && (
                    <span className="absolute top-0.5 left-0.5 bg-red-500 text-white text-[9px] font-extrabold px-1 rounded">
                      -{discount}%
                    </span>
                  )}
                </Link>

                {/* Details */}
                <div className="flex-1 min-w-0 flex flex-col justify-between">
                  <div>
                    <Link href={`/product/${product.slug}`}>
                      <h4 className="text-xs font-bold text-gray-900 group-hover:text-[#2E6F40] transition-colors truncate">
                        {product.name}
                      </h4>
                    </Link>

                    {/* Rating */}
                    {product.rating_count > 0 && (
                      <div className="flex items-center gap-1 mt-0.5">
                        <StarRating rating={parseFloat(product.average_rating)} size="sm" />
                        <span className="text-[10px] text-gray-400">({product.rating_count})</span>
                      </div>
                    )}
                  </div>

                  {/* Price & Add to Cart button */}
                  <div className="flex items-center justify-between gap-2 mt-1 pt-1 border-t border-gray-100/60">
                    <div className="flex items-baseline gap-1">
                      <span className="text-xs font-extrabold text-[#2E6F40]">
                        {formatPrice(product.price)}
                      </span>
                      {product.on_sale && product.regular_price && (
                        <span className="text-[10px] text-gray-400 line-through">
                          {formatPrice(product.regular_price)}
                        </span>
                      )}
                    </div>

                    <button
                      onClick={(e) => handleQuickAdd(e, product)}
                      disabled={isAdding}
                      className={cn(
                        "px-2 py-1 rounded-lg text-[11px] font-bold flex items-center gap-1 transition-all",
                        isAdded
                          ? "bg-emerald-600 text-white"
                          : "bg-[#2E6F40] hover:bg-[#225330] text-white shadow-xs"
                      )}
                      aria-label={`Add ${product.name} to cart`}
                    >
                      {isAdding ? (
                        <Loader2 className="w-3 h-3 animate-spin" />
                      ) : isAdded ? (
                        <>
                          <Check className="w-3 h-3" />
                          Added
                        </>
                      ) : (
                        <>
                          <ShoppingCart className="w-3 h-3" />
                          Add
                        </>
                      )}
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </motion.div>
      </AnimatePresence>

      {/* Pagination Dots Indicator */}
      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-1.5 pt-1">
          {Array.from({ length: totalPages }).map((_, idx) => (
            <button
              key={idx}
              onClick={() => setCurrentPage(idx)}
              className={cn(
                "h-1.5 rounded-full transition-all duration-300",
                currentPage === idx ? "w-5 bg-[#2E6F40]" : "w-1.5 bg-gray-200 hover:bg-gray-400"
              )}
              aria-label={`Go to page ${idx + 1}`}
            />
          ))}
        </div>
      )}
    </aside>
  );
}
