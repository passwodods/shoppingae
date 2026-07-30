"use client";

import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Navigation, Pagination, EffectFade } from "swiper/modules";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

// Import Swiper styles
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import "swiper/css/effect-fade";

// Default slides (overridden by WordPress ACF in production)
const DEFAULT_SLIDES = [
  {
    id: "1",
    title: "Your Health Journey Starts Here",
    subtitle: "Premium vitamins, supplements & wellness products delivered to your door",
    badgeText: "🌟 New Arrivals",
    buttonText: "Shop Now",
    buttonUrl: "/shop",
    backgroundColor: "from-green-50 via-emerald-50 to-teal-50",
    textColor: "dark" as const,
    image: null,
  },
  {
    id: "2",
    title: "Luxury Beauty at Every Budget",
    subtitle: "Discover authentic skincare, cosmetics & fragrances from top global brands",
    badgeText: "✨ Up to 40% Off",
    buttonText: "Explore Beauty",
    buttonUrl: "/category/skincare-beauty",
    backgroundColor: "from-emerald-50 via-green-50 to-lime-50",
    textColor: "dark" as const,
    image: null,
  },
  {
    id: "3",
    title: "Free Delivery Across UAE",
    subtitle: "On orders above AED 99. Same-day delivery available in Dubai",
    badgeText: "🚚 Fast Shipping",
    buttonText: "Start Shopping",
    buttonUrl: "/shop",
    backgroundColor: "from-teal-50 via-emerald-50 to-green-50",
    textColor: "dark" as const,
    image: null,
  },
];

export function HeroSection() {
  return (
    <section className="relative overflow-hidden" aria-label="Hero slider">
      <Swiper
        modules={[Autoplay, Navigation, Pagination, EffectFade]}
        effect="fade"
        autoplay={{ delay: 5000, disableOnInteraction: false, pauseOnMouseEnter: true }}
        loop
        speed={800}
        navigation={{
          nextEl: ".hero-btn-next",
          prevEl: ".hero-btn-prev",
        }}
        pagination={{ clickable: true, el: ".hero-pagination" }}
        className="h-[420px] sm:h-[520px] lg:h-[600px]"
      >
        {DEFAULT_SLIDES.map((slide) => (
          <SwiperSlide key={slide.id}>
            <div
              className={cn(
                "relative w-full h-full bg-gradient-to-br flex items-center",
                slide.backgroundColor
              )}
            >
              <div className="container-shop relative z-10">
                <div className="max-w-2xl">
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.1 }}
                  >
                    {slide.badgeText && (
                      <span className="inline-flex items-center px-3.5 py-1 rounded-full text-xs font-semibold bg-white/90 backdrop-blur-sm border border-green-200 text-[#2E6F40] mb-4 shadow-sm">
                        {slide.badgeText}
                      </span>
                    )}
                    <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-gray-900 leading-tight tracking-tight text-balance">
                      {slide.title}
                    </h1>
                    <p className="mt-4 text-lg text-gray-600 text-pretty max-w-lg">
                      {slide.subtitle}
                    </p>
                    <div className="mt-8 flex items-center gap-3">
                      <Link href={slide.buttonUrl} className="btn-primary text-base px-8 py-3.5">
                        {slide.buttonText}
                        <ArrowRight className="w-4 h-4" />
                      </Link>
                      <Link href="/shop" className="btn-ghost text-base">
                        Browse All
                      </Link>
                    </div>
                  </motion.div>
                </div>
              </div>

              {/* Decorative blobs */}
              <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute -top-20 -right-20 w-96 h-96 rounded-full bg-green-300/20 blur-3xl" />
                <div className="absolute -bottom-20 right-1/3 w-64 h-64 rounded-full bg-emerald-300/20 blur-3xl" />
              </div>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>

      {/* Custom navigation */}
      <button
        className="hero-btn-prev absolute left-4 top-1/2 -translate-y-1/2 z-20 w-10 h-10 rounded-full glass flex items-center justify-center shadow-md hover:shadow-lg transition-all hover:scale-110 hidden sm:flex"
        aria-label="Previous slide"
      >
        <ChevronLeft className="w-5 h-5 text-gray-700" />
      </button>
      <button
        className="hero-btn-next absolute right-4 top-1/2 -translate-y-1/2 z-20 w-10 h-10 rounded-full glass flex items-center justify-center shadow-md hover:shadow-lg transition-all hover:scale-110 hidden sm:flex"
        aria-label="Next slide"
      >
        <ChevronRight className="w-5 h-5 text-gray-700" />
      </button>

      {/* Pagination dots */}
      <div className="hero-pagination absolute bottom-4 left-0 right-0 z-20 flex justify-center gap-1.5 [&_.swiper-pagination-bullet]:w-2 [&_.swiper-pagination-bullet]:h-2 [&_.swiper-pagination-bullet]:rounded-full [&_.swiper-pagination-bullet]:bg-gray-400/60 [&_.swiper-pagination-bullet-active]:bg-[#2E6F40] [&_.swiper-pagination-bullet-active]:w-6" />
    </section>
  );
}
