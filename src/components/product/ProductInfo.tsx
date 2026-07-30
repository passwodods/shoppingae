"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ShoppingCart, Heart, Share2, Check, Minus, Plus, Loader2, AlertCircle, Zap } from "lucide-react";
import { motion } from "framer-motion";
import type { WCProduct, WCVariation, WCReview } from "@/types/product";
import { formatPrice, getStockLabel, isInStock, cn } from "@/lib/utils";
import { useCartStore } from "@/stores/cart.store";
import { useWishlistStore } from "@/stores/wishlist.store";
import { StarRating } from "@/components/ui/StarRating";

interface ProductInfoProps {
  product: WCProduct;
  variations: WCVariation[];
  reviews: WCReview[];
}

export function ProductInfo({ product, variations, reviews }: ProductInfoProps) {
  const [quantity, setQuantity] = useState(1);
  const [selectedAttributes, setSelectedAttributes] = useState<Record<string, string>>({});
  const [addedToCart, setAddedToCart] = useState(false);
  const [isBuyingNow, setIsBuyingNow] = useState(false);

  const router = useRouter();
  const { addItem, isLoading } = useCartStore();
  const { toggleItem, isInWishlist } = useWishlistStore();

  const inWishlist = isInWishlist(product.id);

  // Find matching variation
  const selectedVariation = variations.find((v) =>
    v.attributes.every(
      (attr) => selectedAttributes[attr.name] === attr.option
    )
  );

  const currentPrice = selectedVariation ? selectedVariation.price : product.price;
  const currentRegularPrice = selectedVariation ? selectedVariation.regular_price : product.regular_price;
  const currentSalePrice = selectedVariation ? selectedVariation.sale_price : product.sale_price;
  const isOnSale = selectedVariation ? selectedVariation.on_sale : product.on_sale;
  const stockStatus = selectedVariation ? selectedVariation.stock_status : product.stock_status;
  const currentInStock = isInStock(stockStatus);

  const handleAddToCart = async (): Promise<boolean> => {
    if (!currentInStock) return false;
    if (product.type === "variable" && !selectedVariation) return false;

    await addItem(
      product.id,
      quantity,
      selectedVariation?.id,
      selectedVariation
        ? Object.fromEntries(selectedVariation.attributes.map((a) => [a.slug, a.option]))
        : undefined
    );

    setAddedToCart(true);
    setTimeout(() => setAddedToCart(false), 2000);
    return true;
  };

  const handleBuyNow = async () => {
    setIsBuyingNow(true);
    try {
      const success = await handleAddToCart();
      if (success) {
        router.push("/checkout");
      }
    } finally {
      setIsBuyingNow(false);
    }
  };

  const handleWhatsApp = () => {
    const phone = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || "971500000000";
    const currentUrl = typeof window !== "undefined" ? window.location.href : "";
    const text = encodeURIComponent(
      `Hello! I am interested in purchasing: ${product.name}\n${currentUrl}`
    );
    window.open(`https://wa.me/${phone.replace(/[^0-9]/g, "")}?text=${text}`, "_blank");
  };

  const handleWishlist = () => {
    toggleItem({
      id: product.id,
      slug: product.slug,
      name: product.name,
      price: currentPrice,
      image: product.images[0]?.src ?? "",
      addedAt: new Date().toISOString(),
    });
  };

  const handleShare = async () => {
    if (navigator.share) {
      await navigator.share({
        title: product.name,
        url: window.location.href,
      });
    } else {
      await navigator.clipboard.writeText(window.location.href);
    }
  };

  const discount = isOnSale && currentSalePrice && currentRegularPrice
    ? Math.round(((parseFloat(currentRegularPrice) - parseFloat(currentSalePrice)) / parseFloat(currentRegularPrice)) * 100)
    : 0;

  return (
    <div className="flex flex-col gap-4">
      {/* Category */}
      {product.categories[0] && (
        <Link
          href={`/category/${product.categories[0].slug}`}
          className="text-xs font-bold uppercase tracking-widest text-[#2E6F40] hover:text-[#225330] transition-colors"
        >
          {product.categories[0].name}
        </Link>
      )}

      {/* Title */}
      <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 leading-tight">
        {product.name}
      </h1>

      {/* Brand & SKU under Brand */}
      <div className="space-y-1">
        {product.acf?.brand && (
          <p className="text-sm text-gray-500">
            Brand: <span className="font-semibold text-gray-700">{product.acf.brand}</span>
          </p>
        )}
        {product.sku && (
          <p className="text-sm text-gray-500">
            SKU: <span className="font-semibold text-gray-700">{product.sku}</span>
          </p>
        )}
      </div>

      {/* Rating */}
      {product.rating_count > 0 && (
        <div className="flex items-center gap-2">
          <StarRating rating={parseFloat(product.average_rating)} showValue count={product.rating_count} />
          <a href="#reviews" className="text-sm text-[#2E6F40] hover:underline">
            {product.rating_count} review{product.rating_count !== 1 ? "s" : ""}
          </a>
        </div>
      )}

      {/* Price */}
      <div className="flex items-baseline gap-3">
        <span className="text-3xl font-extrabold text-[#2E6F40]">
          {formatPrice(currentPrice)}
        </span>
        {isOnSale && currentRegularPrice && (
          <span className="text-lg text-gray-400 line-through">
            {formatPrice(currentRegularPrice)}
          </span>
        )}
        {discount > 0 && (
          <span className="badge-sale text-sm">-{discount}%</span>
        )}
      </div>

      {/* Stock */}
      <div className="flex items-center gap-2">
        <div className={cn(
          "w-2 h-2 rounded-full",
          currentInStock ? "bg-emerald-500" : "bg-red-500"
        )} />
        <span className={cn(
          "text-sm font-medium",
          currentInStock ? "text-emerald-700" : "text-red-600"
        )}>
          {getStockLabel(stockStatus, selectedVariation?.stock_quantity ?? product.stock_quantity)}
        </span>
      </div>

      {/* Short description */}
      {product.short_description && (
        <div
          className="text-sm text-gray-600 leading-relaxed prose prose-sm max-w-none"
          dangerouslySetInnerHTML={{ __html: product.short_description }}
        />
      )}

      {/* Variation selectors */}
      {product.type === "variable" && product.attributes.filter((a) => a.variation).map((attr) => (
        <div key={attr.id} className="space-y-2">
          <label className="text-sm font-bold text-gray-900">
            {attr.name}
            {selectedAttributes[attr.name] && (
              <span className="ml-2 font-normal text-[#2E6F40]">
                {selectedAttributes[attr.name]}
              </span>
            )}
          </label>
          <div className="flex flex-wrap gap-2">
            {attr.options.map((option) => {
              const isSelected = selectedAttributes[attr.name] === option;
              return (
                <button
                  key={option}
                  onClick={() =>
                    setSelectedAttributes((prev) => ({ ...prev, [attr.name]: option }))
                  }
                  className={cn(
                    "px-3 py-1.5 rounded-lg text-sm font-medium border transition-all",
                    isSelected
                      ? "border-[#2E6F40] bg-green-50 text-[#2E6F40]"
                      : "border-gray-200 text-gray-700 hover:border-green-300 hover:text-[#2E6F40]"
                  )}
                >
                  {option}
                </button>
              );
            })}
          </div>
        </div>
      ))}

      {/* Variation required warning */}
      {product.type === "variable" &&
        product.attributes.filter((a) => a.variation).length > 0 &&
        !selectedVariation && (
          <div className="flex items-center gap-2 text-amber-600 text-sm bg-amber-50 px-3 py-2 rounded-lg">
            <AlertCircle className="w-4 h-4 flex-shrink-0" />
            Please select all options above
          </div>
        )}

      {/* Quantity + Add to Cart + Buy Now + Wishlist Row */}
      <div className="space-y-3 pt-2">
        <div className="flex flex-wrap items-center gap-3">
          {/* Quantity selector */}
          <div className="flex items-center rounded-xl border border-gray-200 overflow-hidden flex-shrink-0">
            <button
              onClick={() => setQuantity((q) => Math.max(1, q - 1))}
              className="w-9 h-11 flex items-center justify-center text-gray-600 hover:bg-gray-100 transition-colors"
              aria-label="Decrease quantity"
            >
              <Minus className="w-3.5 h-3.5" />
            </button>
            <span className="w-10 text-center font-semibold text-gray-900 text-sm" aria-live="polite">
              {quantity}
            </span>
            <button
              onClick={() => setQuantity((q) => q + 1)}
              className="w-9 h-11 flex items-center justify-center text-gray-600 hover:bg-gray-100 transition-colors"
              aria-label="Increase quantity"
            >
              <Plus className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Add to Cart button */}
          <motion.button
            onClick={handleAddToCart}
            disabled={!currentInStock || isLoading || (product.type === "variable" && !selectedVariation)}
            whileTap={{ scale: 0.97 }}
            className={cn(
              "flex-1 min-w-[140px] btn-primary text-sm py-3 px-4 relative",
              (!currentInStock || (product.type === "variable" && !selectedVariation)) && "opacity-60 cursor-not-allowed"
            )}
            aria-label={`Add ${product.name} to cart`}
          >
            {isLoading ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : addedToCart ? (
              <>
                <Check className="w-4 h-4" />
                Added!
              </>
            ) : (
              <>
                <ShoppingCart className="w-4 h-4" />
                {currentInStock ? "Add to Cart" : "Out of Stock"}
              </>
            )}
          </motion.button>

          {/* Buy Now Button (Side-by-side with Add to Cart) */}
          <motion.button
            onClick={handleBuyNow}
            disabled={!currentInStock || isBuyingNow || (product.type === "variable" && !selectedVariation)}
            whileTap={{ scale: 0.97 }}
            className={cn(
              "flex-1 min-w-[140px] py-3 px-4 rounded-full font-bold text-sm bg-amber-500 hover:bg-amber-600 text-white shadow-sm transition-all flex items-center justify-center gap-1.5",
              (!currentInStock || (product.type === "variable" && !selectedVariation)) && "opacity-60 cursor-not-allowed"
            )}
          >
            {isBuyingNow ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <>
                <Zap className="w-4 h-4 fill-current" />
                Buy Now
              </>
            )}
          </motion.button>

          {/* Wishlist & Share buttons */}
          <button
            onClick={handleWishlist}
            className={cn(
              "w-11 h-11 rounded-xl border flex items-center justify-center flex-shrink-0 transition-all",
              inWishlist
                ? "border-[#2E6F40] bg-[#2E6F40] text-white"
                : "border-gray-200 text-gray-500 hover:border-green-300 hover:text-[#2E6F40]"
            )}
            aria-label={inWishlist ? "Remove from wishlist" : "Add to wishlist"}
          >
            <Heart className={cn("w-4 h-4", inWishlist && "fill-current")} />
          </button>
          <button
            onClick={handleShare}
            className="w-11 h-11 rounded-xl border border-gray-200 flex items-center justify-center flex-shrink-0 text-gray-500 hover:border-gray-300 transition-all"
            aria-label="Share product"
          >
            <Share2 className="w-4 h-4" />
          </button>
        </div>

        {/* WhatsApp Button (Row 2 underneath) */}
        <motion.button
          onClick={handleWhatsApp}
          whileTap={{ scale: 0.98 }}
          className="w-full btn-whatsapp py-3 px-6 rounded-full font-bold text-sm flex items-center justify-center gap-2"
        >
          <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
            <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-1.04 3.799 3.783-.992z"/>
          </svg>
          Order on WhatsApp
        </motion.button>
      </div>
    </div>
  );
}
