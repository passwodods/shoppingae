"use client";

import { useState } from "react";
import Link from "next/link";
import { ChevronDown, ChevronUp, Search, Sparkles } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface SEOArticle {
  id: string;
  title: string;
  excerpt: string;
  fullText: string;
  links?: Array<{ text: string; url: string }>;
}

const DEFAULT_SEO_ARTICLES: SEOArticle[] = [
  {
    id: "superior-shopping",
    title: "Superior Online Health & Beauty Shopping in the UAE",
    excerpt:
      "ShopAE is your premier online destination for authentic health, beauty, wellness, and pharmacy essentials in the UAE. Whether you are looking for dermatologist-approved ",
    fullText:
      "ShopAE is your premier online destination for authentic health, beauty, wellness, and pharmacy essentials in the UAE. Whether you are looking for dermatologist-approved skincare products, daily multivitamins, organic hair care, or sports nutrition, we have thousands of certified products delivered straight to your doorstep. Enjoy flexible Cash on Delivery, same-day Dubai delivery, and fast shipping across Abu Dhabi, Sharjah, Ajman, and all Emirates.",
  },
  {
    id: "best-products-brands",
    title: "Shop Top Global Health & Skincare Brands at ShopAE UAE",
    excerpt:
      "Explore a massive variety of authentic items from world-leading brands. Our health and beauty collection features the latest ",
    fullText:
      "Explore a massive variety of authentic items from world-leading brands. Our health and beauty collection features the latest Vitamin C serums, Hyaluronic Acid moisturisers, Mexoryl sunscreens, Whey protein isolates, and essential daily supplements. We carry genuine products from CeraVe, La Roche-Posay, Blackmores, Optimum Nutrition, Panadol, Vichy, Bioderma, The Ordinary, and many other trusted pharmaceutical brands.",
  },
  {
    id: "hassle-free-shopping",
    title: "Hassle-Free UAE Online Pharmacy & Wellness Delivery",
    excerpt:
      "When you order online at ShopAE, you enjoy peace of mind knowing you get 100% authentic, expiry-verified products with flexible payment options including ",
    fullText:
      "When you order online at ShopAE, you enjoy peace of mind knowing you get 100% authentic, expiry-verified products with flexible payment options including Cash on Delivery (COD) and secure credit/debit card payments. Orders over AED 99 qualify for Free UAE Express Shipping. With our 30-day hassle-free return policy and 24/7 customer care team, online shopping for wellness in the Gulf has never been easier.",
  },
];

const DEFAULT_POPULAR_SEARCHES = [
  "Vitamin C Serum",
  "CeraVe Cleanser",
  "Sunscreen SPF 50",
  "Multivitamin Tablets",
  "Whey Protein Isolate",
  "La Roche-Posay Anthelios",
  "Panadol Extra",
  "Hyaluronic Acid Serum",
  "Collagen Powder",
  "Retinol Cream",
  "Niacinamide Serum",
  "Omega 3 Fish Oil",
  "Magnesium Glycinate",
  "Bioderma Sensibio",
  "The Ordinary Niacinamide",
  "Vichy Mineral 89",
  "BCAA Powder",
  "Creatine Monohydrate",
  "Hair Growth Serum",
  "Organic Shampoo",
  "Baby Formula",
  "Sensitive Skin Lotion",
  "Micellar Water",
  "Dubai Pharmacy Online",
  "UAE Wellness Express",
  "Face Moisturiser",
  "Eczema Relief Cream",
  "Biotin Capsules",
];

export function SEOFooterSection() {
  const [expandedArticles, setExpandedArticles] = useState<Record<string, boolean>>({});
  const [showAllTags, setShowAllTags] = useState(false);

  const toggleArticle = (id: string) => {
    setExpandedArticles((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const visibleTags = showAllTags ? DEFAULT_POPULAR_SEARCHES : DEFAULT_POPULAR_SEARCHES.slice(0, 16);

  return (
    <section className="py-12 bg-white border-t border-gray-100" aria-label="SEO Knowledge Base & Popular Searches">
      <div className="container-shop space-y-10">
        {/* ── 1. SEO Content Articles (Noon-style Expandable Blocks) ── */}
        <div className="space-y-6">
          {DEFAULT_SEO_ARTICLES.map((article) => {
            const isExpanded = Boolean(expandedArticles[article.id]);

            return (
              <div key={article.id} className="space-y-1.5 border-b border-gray-100 pb-5 last:border-0 last:pb-0">
                <h2 className="text-base font-bold text-gray-900 leading-snug">
                  {article.title}
                </h2>
                <div className="text-xs text-gray-600 leading-relaxed font-normal">
                  <p>
                    {isExpanded ? article.fullText : `${article.excerpt}...`}
                  </p>
                </div>
                <button
                  onClick={() => toggleArticle(article.id)}
                  className="inline-flex items-center gap-1 text-xs font-bold text-[#2E6F40] hover:text-[#166534] transition-colors pt-1"
                >
                  <span>{isExpanded ? "Read Less" : "Read More"}</span>
                  {isExpanded ? (
                    <ChevronUp className="w-3.5 h-3.5" />
                  ) : (
                    <ChevronDown className="w-3.5 h-3.5" />
                  )}
                </button>
              </div>
            );
          })}
        </div>

        {/* ── 2. Popular Searches / Tag Cloud Bar (Noon-style SEO Tag Cloud) ── */}
        <div className="pt-6 border-t border-gray-200/80 space-y-4">
          <div className="flex items-center gap-2">
            <Search className="w-4 h-4 text-[#2E6F40]" />
            <h3 className="font-bold text-sm text-gray-900">Popular Searches</h3>
          </div>

          {/* Tag Pills */}
          <div className="flex flex-wrap gap-2">
            {visibleTags.map((tag) => (
              <Link
                key={tag}
                href={`/search?q=${encodeURIComponent(tag)}`}
                className="text-xs text-gray-700 bg-gray-100/80 hover:bg-green-50 hover:text-[#2E6F40] hover:border-green-300 border border-transparent px-3 py-1.5 rounded-md transition-all font-medium"
              >
                {tag}
              </Link>
            ))}
          </div>

          {/* View More / View Less Tags Button */}
          {DEFAULT_POPULAR_SEARCHES.length > 16 && (
            <button
              onClick={() => setShowAllTags(!showAllTags)}
              className="inline-flex items-center gap-1 text-xs font-bold text-[#2E6F40] hover:underline pt-1"
            >
              <span>{showAllTags ? "View Less" : "View More Searches"}</span>
              <ChevronDown className={`w-3.5 h-3.5 transition-transform ${showAllTags ? "rotate-180" : ""}`} />
            </button>
          )}
        </div>
      </div>
    </section>
  );
}
