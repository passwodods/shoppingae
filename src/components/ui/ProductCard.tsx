"use client";

import Image from "next/image";
import Link from "next/link";
import { Heart, ShoppingCart, Star, Eye } from "lucide-react";
import { motion } from "framer-motion";
import { useState } from "react";
import type { WCProduct } from "@/types/product";
import { formatPrice, buildProductUrl, isInStock, cn } from "@/lib/utils";
import { useCartStore } from "@/stores/cart.store";
import { useWishlistStore } from "@/stores/wishlist.store";

interface ProductCardProps {
  product: WCProduct;
  priority?: boolean;
  variant?: "default" | "compact" | "horizontal";
}

export function ProductCard({ product, priority = false, variant = "default" }: ProductCardProps) {
  const [isHovered, setIsHovered] = useState(false);
  const [currentImage] = useState(0);
  const { addItem, isLoading } = useCartStore();
  const { toggleItem, isInWishlist } = useWishlistStore();

  const inWishlist = isInWishlist(product.id);
  const inStock = isInStock(product.stock_status);
  const hasSale = product.on_sale && product.sale_price && product.regular_price;
  const discount = hasSale
    ? Math.round(((parseFloat(product.regular_price) - parseFloat(product.sale_price)) / parseFloat(product.regular_price)) * 100)
    : 0;

  const handleAddToCart = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (!inStock || product.type === "variable") {
      window.location.href = buildProductUrl(product.slug);
      return;
    }
    await addItem(product.id, 1);
  };

  const handleWishlist = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    toggleItem({
      id: product.id,
      slug: product.slug,
      name: product.name,
      price: product.price,
      image: product.images[0]?.src ?? "",
      addedAt: new Date().toISOString(),
    });
  };

  if (variant === "compact") {
    return (
      <Link href={buildProductUrl(product.slug)} className="flex items-center gap-3 p-3 rounded-xl hover:bg-gray-50 transition-colors group">
        <div className="w-16 h-16 rounded-xl overflow-hidden bg-gray-100 flex-shrink-0">
          {product.images[0] && (
            <Image
              src={product.images[0].src}
              alt={product.images[0].alt || product.name}
              width={64}
              height={64}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            />
          )}
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-semibold text-gray-900 truncate">{product.name}</p>
          <p className="text-sm font-bold text-[#2E6F40] mt-0.5">{formatPrice(product.price)}</p>
        </div>
      </Link>
    );
  }

  return (
    <motion.article
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
      className="group relative bg-white rounded-2xl border border-gray-100 overflow-hidden transition-all duration-300 hover:shadow-xl hover:-translate-y-1 hover:border-green-100 flex flex-col"
    >
      {/* Badges */}
      <div className="absolute top-3 left-3 z-10 flex flex-col gap-1.5">
        {hasSale && (
          <span className="badge-sale text-[11px]">-{discount}%</span>
        )}
        {product.featured && !hasSale && (
          <span className="badge bg-green-100 text-green-800 text-[11px]">Featured</span>
        )}
        {!inStock && (
          <span className="badge-out-of-stock text-[11px]">Out of Stock</span>
        )}
      </div>

      {/* Wishlist button */}
      <button
        onClick={handleWishlist}
        className={cn(
          "absolute top-3 right-3 z-10 w-8 h-8 rounded-full flex items-center justify-center",
          "shadow-sm border transition-all duration-200",
          inWishlist
            ? "bg-[#2E6F40] border-[#2E6F40] text-white"
            : "bg-white/90 backdrop-blur-sm border-gray-200 text-gray-400 hover:border-green-300 hover:text-[#2E6F40]"
        )}
        aria-label={inWishlist ? "Remove from wishlist" : "Add to wishlist"}
      >
        <Heart className={cn("w-3.5 h-3.5", inWishlist && "fill-current")} />
      </button>

      {/* Product Image */}
      <Link href={buildProductUrl(product.slug)} className="block relative overflow-hidden bg-gray-50">
        <div className="aspect-square">
          {product.images.length > 0 ? (
            <Image
              src={product.images[currentImage]?.src || product.images[0].src}
              alt={product.images[0].alt || product.name}
              fill
              priority={priority}
              sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
              className={cn(
                "object-contain p-3 transition-all duration-500",
                isHovered ? "scale-105" : "scale-100"
              )}
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-gray-300">
              <Eye className="w-12 h-12" />
            </div>
          )}
        </div>

        {/* Quick view overlay */}
        <div className={cn(
          "absolute inset-x-0 bottom-0 flex items-center justify-center gap-2 py-3 bg-white/90 backdrop-blur-sm transition-all duration-300",
          isHovered ? "opacity-100 translate-y-0" : "opacity-0 translate-y-full"
        )}>
          <span
            className="text-xs font-semibold text-gray-700 flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-gray-200 hover:border-green-300 hover:text-[#2E6F40] transition-colors"
          >
            <Eye className="w-3.5 h-3.5" />
            Quick View
          </span>
        </div>
      </Link>

      {/* Info */}
      <div className="p-3 flex flex-col flex-1">
        {/* Category */}
        {product.categories[0] && (
          <Link
            href={`/category/${product.categories[0].slug}`}
            className="text-[11px] font-semibold text-[#2E6F40] uppercase tracking-wider hover:text-[#225330] transition-colors mb-1"
          >
            {product.categories[0].name}
          </Link>
        )}

        {/* Name */}
        <Link href={buildProductUrl(product.slug)}>
          <h3 className="text-sm font-semibold text-gray-900 line-clamp-2 leading-snug hover:text-[#2E6F40] transition-colors mb-2">
            {product.name}
          </h3>
        </Link>

        {/* Rating */}
        {product.rating_count > 0 && (
          <div className="flex items-center gap-1 mb-2">
            <div className="flex">
              {[1, 2, 3, 4, 5].map((star) => (
                <Star
                  key={star}
                  className={cn(
                    "w-3 h-3",
                    star <= Math.round(parseFloat(product.average_rating))
                      ? "fill-amber-400 text-amber-400"
                      : "fill-gray-200 text-gray-200"
                  )}
                />
              ))}
            </div>
            <span className="text-[11px] text-gray-400">({product.rating_count})</span>
          </div>
        )}

        {/* Spacer */}
        <div className="flex-1" />

        {/* Price + Add to cart */}
        <div className="flex items-center justify-between gap-2">
          <div>
            <div className="flex items-baseline gap-1.5">
              <span className="font-bold text-[#2E6F40]">
                {formatPrice(hasSale ? product.sale_price : product.price)}
              </span>
              {hasSale && (
                <span className="text-[11px] text-gray-400 line-through">
                  {formatPrice(product.regular_price)}
                </span>
              )}
            </div>
          </div>

          <button
            onClick={handleAddToCart}
            disabled={!inStock || isLoading}
            className={cn(
              "w-9 h-9 rounded-full flex items-center justify-center flex-shrink-0 transition-all duration-200",
              inStock
                ? "bg-[#2E6F40] text-white hover:bg-[#225330] hover:scale-110 shadow-sm hover:shadow-md"
                : "bg-gray-200 text-gray-400 cursor-not-allowed"
            )}
            aria-label={`Add ${product.name} to cart`}
          >
            <ShoppingCart className="w-4 h-4" />
          </button>
        </div>
      </div>
    </motion.article>
  );
}
