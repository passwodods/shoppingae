"use client";

import { useState, useRef } from "react";
import Image from "next/image";
import { ChevronLeft, ChevronRight, ZoomIn } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import type { WCImage } from "@/types/product";
import { cn } from "@/lib/utils";

interface ProductGalleryProps {
  images: WCImage[];
  productName: string;
}

export function ProductGallery({ images, productName }: ProductGalleryProps) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isZoomed, setIsZoomed] = useState(false);
  const [zoomPos, setZoomPos] = useState({ x: 50, y: 50 });
  const imageRef = useRef<HTMLDivElement>(null);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!imageRef.current || !isZoomed) return;
    const rect = imageRef.current.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    setZoomPos({ x, y });
  };

  if (!images.length) {
    return (
      <div className="aspect-square rounded-2xl bg-gray-100 flex items-center justify-center text-gray-300">
        <ZoomIn className="w-16 h-16" />
      </div>
    );
  }

  const currentImage = images[activeIndex];

  return (
    <div className="flex flex-col-reverse md:flex-row items-start gap-4">
      {/* Thumbnails Column (Left Side on Desktop, Noon.com style) */}
      {images.length > 1 && (
        <div className="flex md:flex-col gap-2.5 overflow-x-auto md:overflow-y-auto max-h-none md:max-h-[520px] w-full md:w-auto flex-shrink-0 py-1 pr-1 no-scrollbar">
          {images.map((img, i) => (
            <button
              key={img.id}
              onClick={() => setActiveIndex(i)}
              className={cn(
                "flex-shrink-0 w-16 h-16 md:w-20 md:h-20 rounded-xl overflow-hidden border-2 bg-white transition-all duration-200 relative group",
                i === activeIndex
                  ? "border-[#2E6F40] shadow-md ring-2 ring-green-100 scale-105"
                  : "border-gray-200 hover:border-green-300 opacity-75 hover:opacity-100"
              )}
              aria-label={`View image ${i + 1}`}
              aria-pressed={i === activeIndex}
            >
              <Image
                src={img.src}
                alt={img.alt || `${productName} ${i + 1}`}
                width={80}
                height={80}
                className="w-full h-full object-contain p-1.5 transition-transform duration-300 group-hover:scale-105"
              />
            </button>
          ))}
        </div>
      )}

      {/* Main Image Container */}
      <div
        ref={imageRef}
        className={cn(
          "relative flex-1 w-full aspect-square rounded-2xl overflow-hidden bg-gray-50 border border-gray-100 shadow-xs",
          isZoomed ? "cursor-zoom-out" : "cursor-zoom-in"
        )}
        onClick={() => setIsZoomed(!isZoomed)}
        onMouseMove={handleMouseMove}
        onMouseLeave={() => setIsZoomed(false)}
      >
        <AnimatePresence mode="wait">
          <motion.div
            key={activeIndex}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="absolute inset-0"
          >
            <Image
              src={currentImage.src}
              alt={currentImage.alt || productName}
              fill
              priority
              sizes="(max-width: 1024px) 100vw, 50vw"
              className={cn(
                "object-contain p-4 transition-transform duration-200",
                isZoomed ? "scale-150" : "scale-100"
              )}
              style={
                isZoomed
                  ? { transformOrigin: `${zoomPos.x}% ${zoomPos.y}%` }
                  : {}
              }
            />
          </motion.div>
        </AnimatePresence>

        {/* Zoom indicator */}
        {!isZoomed && (
          <div className="absolute top-3 right-3 w-8 h-8 rounded-full bg-white/80 backdrop-blur-sm border border-gray-200 flex items-center justify-center text-gray-500 shadow-sm pointer-events-none">
            <ZoomIn className="w-4 h-4" />
          </div>
        )}

        {/* Navigation arrows */}
        {images.length > 1 && (
          <>
            <button
              onClick={(e) => {
                e.stopPropagation();
                setActiveIndex((i) => (i - 1 + images.length) % images.length);
              }}
              className="absolute left-3 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-white/90 backdrop-blur-sm border border-gray-200 flex items-center justify-center shadow-md hover:bg-white hover:scale-110 transition-all"
              aria-label="Previous image"
            >
              <ChevronLeft className="w-5 h-5 text-gray-700" />
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation();
                setActiveIndex((i) => (i + 1) % images.length);
              }}
              className="absolute right-3 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-white/90 backdrop-blur-sm border border-gray-200 flex items-center justify-center shadow-md hover:bg-white hover:scale-110 transition-all"
              aria-label="Next image"
            >
              <ChevronRight className="w-5 h-5 text-gray-700" />
            </button>
          </>
        )}
      </div>
    </div>
  );
}
