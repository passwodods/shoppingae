"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { ShoppingCart, Zap, Check, Loader2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import type { WCProduct, WCVariation } from "@/types/product";
import { formatPrice, isInStock, cn } from "@/lib/utils";
import { useCartStore } from "@/stores/cart.store";

interface StickyAddToCartProps {
  product: WCProduct;
  selectedVariation?: WCVariation;
}

export function StickyAddToCart({ product, selectedVariation }: StickyAddToCartProps) {
  const [isVisible, setIsVisible] = useState(false);
  const [added, setAdded] = useState(false);
  const [isBuying, setIsBuying] = useState(false);

  const router = useRouter();
  const { addItem, isLoading } = useCartStore();

  const stockStatus = selectedVariation ? selectedVariation.stock_status : product.stock_status;
  const currentInStock = isInStock(stockStatus);
  const currentPrice = selectedVariation ? selectedVariation.price : product.price;

  useEffect(() => {
    const onScroll = () => {
      // Show sticky bar when scrolled down past 450px
      setIsVisible(window.scrollY > 450);
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const handleAddToCart = async () => {
    if (!currentInStock) return;
    await addItem(
      product.id,
      1,
      selectedVariation?.id,
      selectedVariation
        ? Object.fromEntries(selectedVariation.attributes.map((a) => [a.slug, a.option]))
        : undefined
    );
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  const handleBuyNow = async () => {
    setIsBuying(true);
    try {
      await handleAddToCart();
      router.push("/checkout");
    } finally {
      setIsBuying(false);
    }
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 100, opacity: 0 }}
          transition={{ duration: 0.3, ease: "easeOut" }}
          className="fixed bottom-0 left-0 right-0 z-[45] bg-white/95 backdrop-blur-md border-t border-gray-200 shadow-2xl py-3 px-4"
        >
          <div className="container-shop flex items-center justify-between gap-4">
            {/* Left: Image, Title & Price */}
            <div className="flex items-center gap-3 min-w-0">
              <div className="w-12 h-12 rounded-xl bg-gray-100 overflow-hidden flex-shrink-0 border border-gray-200">
                {product.images[0] && (
                  <Image
                    src={product.images[0].src}
                    alt={product.name}
                    width={48}
                    height={48}
                    className="w-full h-full object-cover"
                  />
                )}
              </div>
              <div className="min-w-0 hidden sm:block">
                <p className="text-sm font-bold text-gray-900 truncate max-w-xs md:max-w-md">{product.name}</p>
                <p className="text-sm font-extrabold text-[#2E6F40]">{formatPrice(currentPrice)}</p>
              </div>
            </div>

            {/* Right: Actions (Add to Cart & Buy Now side-by-side) */}
            <div className="flex items-center gap-2.5 w-full sm:w-auto">
              <motion.button
                onClick={handleAddToCart}
                disabled={!currentInStock || isLoading}
                whileTap={{ scale: 0.97 }}
                className={cn(
                  "flex-1 sm:flex-initial btn-primary py-2.5 px-5 text-sm font-bold shadow-sm whitespace-nowrap",
                  !currentInStock && "opacity-60 cursor-not-allowed"
                )}
              >
                {isLoading ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : added ? (
                  <>
                    <Check className="w-4 h-4" /> Added!
                  </>
                ) : (
                  <>
                    <ShoppingCart className="w-4 h-4" />
                    Add to Cart
                  </>
                )}
              </motion.button>

              <motion.button
                onClick={handleBuyNow}
                disabled={!currentInStock || isBuying}
                whileTap={{ scale: 0.97 }}
                className={cn(
                  "flex-1 sm:flex-initial py-2.5 px-5 rounded-full font-bold text-sm bg-amber-500 hover:bg-amber-600 text-white shadow-sm transition-all whitespace-nowrap flex items-center justify-center gap-1.5",
                  !currentInStock && "opacity-60 cursor-not-allowed"
                )}
              >
                {isBuying ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <>
                    <Zap className="w-4 h-4 fill-current" />
                    Buy Now
                  </>
                )}
              </motion.button>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
