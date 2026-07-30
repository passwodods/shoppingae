"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Mail, Phone, Globe, DollarSign, ChevronDown } from "lucide-react";
import Link from "next/link";

interface AnnouncementBarProps {
  messages?: Array<{ text: string; link_text?: string; link_url?: string }>;
  bgColor?: string;
  textColor?: string;
}

const DEFAULT_MESSAGES = [
  {
    text: "🚚 Free Express Delivery across UAE on orders over AED 99",
    link_text: "Shop Now",
    link_url: "/shop",
  },
  {
    text: "🌟 Up to 40% OFF on Skincare & Beauty Essentials",
    link_text: "Explore Deals",
    link_url: "/shop?on_sale=true",
  },
];

export function AnnouncementBar({
  messages = DEFAULT_MESSAGES,
  bgColor = "#1e3a24",
  textColor = "#ffffff",
}: AnnouncementBarProps) {
  const [current, setCurrent] = useState(0);
  const [language, setLanguage] = useState("English");
  const [currency, setCurrency] = useState("AED (د.إ)");
  const [isLangOpen, setIsLangOpen] = useState(false);
  const [isCurrOpen, setIsCurrOpen] = useState(false);

  const activeMessages = messages.length > 0 ? messages : DEFAULT_MESSAGES;

  useEffect(() => {
    if (activeMessages.length <= 1) return;
    const interval = setInterval(() => {
      setCurrent((i) => (i + 1) % activeMessages.length);
    }, 4500);
    return () => clearInterval(interval);
  }, [activeMessages.length]);

  const msg = activeMessages[current] || DEFAULT_MESSAGES[0];

  return (
    <div
      className="relative z-50 py-2 border-b border-white/10 text-xs font-medium"
      style={{ backgroundColor: bgColor, color: textColor }}
      role="banner"
    >
      <div className="container-shop flex flex-col md:flex-row items-center justify-between gap-2">
        {/* Left Side: Contact Info (Email & WhatsApp) */}
        <div className="flex items-center gap-4 text-white/90 hidden sm:flex">
          <a
            href="mailto:info@shopae.ae"
            className="flex items-center gap-1.5 hover:text-green-300 transition-colors"
          >
            <Mail className="w-3.5 h-3.5 text-green-400" />
            <span>info@shopae.ae</span>
          </a>
          <span className="text-white/30">|</span>
          <a
            href="https://wa.me/971500000000"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 hover:text-green-300 transition-colors"
          >
            {/* WhatsApp Icon */}
            <svg className="w-3.5 h-3.5 fill-green-400" viewBox="0 0 24 24">
              <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-1.04 3.799 3.783-.992z" />
            </svg>
            <span>+971 50 000 0000</span>
          </a>
        </div>

        {/* Middle: Promo Message Carousel */}
        <div className="flex-1 text-center overflow-hidden">
          <AnimatePresence mode="wait">
            <motion.div
              key={current}
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              transition={{ duration: 0.25 }}
              className="inline-flex items-center justify-center gap-2 flex-wrap"
            >
              <span className="text-white/95">{msg.text}</span>
              {msg.link_text && msg.link_url && (
                <Link
                  href={msg.link_url}
                  className="text-green-300 font-bold underline underline-offset-2 hover:text-white transition-colors"
                >
                  {msg.link_text}
                </Link>
              )}
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Right Side: Language & Currency Dropdowns */}
        <div className="flex items-center gap-3 text-white/90">
          {/* Language Dropdown */}
          <div className="relative">
            <button
              onClick={() => {
                setIsLangOpen(!isLangOpen);
                setIsCurrOpen(false);
              }}
              className="flex items-center gap-1 hover:text-green-300 transition-colors py-0.5"
            >
              <Globe className="w-3.5 h-3.5 text-green-400" />
              <span>{language}</span>
              <ChevronDown className={`w-3 h-3 transition-transform ${isLangOpen ? "rotate-180" : ""}`} />
            </button>

            {isLangOpen && (
              <div className="absolute right-0 top-full mt-1 w-28 bg-[#1e3a24] border border-white/20 rounded-lg shadow-xl py-1 z-50">
                {["English", "Arabic (عربي)"].map((lang) => (
                  <button
                    key={lang}
                    onClick={() => {
                      setLanguage(lang);
                      setIsLangOpen(false);
                    }}
                    className="w-full text-left px-3 py-1.5 text-xs text-white/90 hover:bg-white/10 hover:text-green-300 transition-colors"
                  >
                    {lang}
                  </button>
                ))}
              </div>
            )}
          </div>

          <span className="text-white/30">|</span>

          {/* Currency Dropdown */}
          <div className="relative">
            <button
              onClick={() => {
                setIsCurrOpen(!isCurrOpen);
                setIsLangOpen(false);
              }}
              className="flex items-center gap-1 hover:text-green-300 transition-colors py-0.5"
            >
              <DollarSign className="w-3.5 h-3.5 text-green-400" />
              <span>{currency}</span>
              <ChevronDown className={`w-3 h-3 transition-transform ${isCurrOpen ? "rotate-180" : ""}`} />
            </button>

            {isCurrOpen && (
              <div className="absolute right-0 top-full mt-1 w-28 bg-[#1e3a24] border border-white/20 rounded-lg shadow-xl py-1 z-50">
                {["AED (د.إ)", "USD ($)", "SAR (ر.س)"].map((curr) => (
                  <button
                    key={curr}
                    onClick={() => {
                      setCurrency(curr);
                      setIsCurrOpen(false);
                    }}
                    className="w-full text-left px-3 py-1.5 text-xs text-white/90 hover:bg-white/10 hover:text-green-300 transition-colors"
                  >
                    {curr}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
