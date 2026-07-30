"use client";

import Link from "next/link";
import Image from "next/image";
import { Send } from "lucide-react";
import type { NavItem } from "@/types/menu";

interface FooterProps {
  footerItems?: NavItem[];
  aboutText?: string;
  socialLinks?: Array<{ platform: string; url: string }>;
  paymentLogos?: Array<{ name: string; src: string }>;
  copyrightText?: string;
  contactInfo?: {
    phone?: string;
    email?: string;
    address?: string;
    working_hours?: string;
  };
}

// Inline SVG social icons (Lucide v3 dropped these)
function SocialIcon({ platform }: { platform: string }) {
  switch (platform) {
    case "facebook":
      return (
        <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
          <path d="M18 2h-3a5 5 0 00-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 011-1h3z"/>
        </svg>
      );
    case "instagram":
      return (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4">
          <rect x="2" y="2" width="20" height="20" rx="5" ry="5"/>
          <circle cx="12" cy="12" r="4"/>
          <circle cx="17.5" cy="6.5" r="0.5" fill="currentColor"/>
        </svg>
      );
    case "twitter":
      return (
        <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
          <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
        </svg>
      );
    case "youtube":
      return (
        <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
          <path d="M22.54 6.42a2.78 2.78 0 00-1.95-1.97C18.88 4 12 4 12 4s-6.88 0-8.59.47A2.78 2.78 0 001.46 6.42 29 29 0 001 12a29 29 0 00.46 5.58 2.78 2.78 0 001.95 1.97C5.12 20 12 20 12 20s6.88 0 8.59-.47a2.78 2.78 0 001.95-1.97A29 29 0 0023 12a29 29 0 00-.46-5.58zM9.75 15.02V8.98L15.5 12l-5.75 3.02z"/>
        </svg>
      );
    default:
      return null;
  }
}

const DEFAULT_FOOTER_COLUMNS = [
  {
    title: "Shop",
    links: [
      { label: "All Products", url: "/shop" },
      { label: "New Arrivals", url: "/shop?orderby=date" },
      { label: "Best Sellers", url: "/shop?orderby=popularity" },
      { label: "Sale", url: "/shop?on_sale=true" },
    ],
  },
  {
    title: "Help",
    links: [
      { label: "FAQ", url: "/faq" },
      { label: "Contact Us", url: "/contact" },
      { label: "Shipping Info", url: "/shipping" },
      { label: "Returns", url: "/returns" },
    ],
  },
  {
    title: "Account",
    links: [
      { label: "My Account", url: "/account" },
      { label: "Orders", url: "/account/orders" },
      { label: "Wishlist", url: "/account/wishlist" },
      { label: "Addresses", url: "/account/addresses" },
    ],
  },
  {
    title: "Company",
    links: [
      { label: "About Us", url: "/about" },
      { label: "Blog", url: "/blog" },
      { label: "Privacy Policy", url: "/privacy-policy" },
      { label: "Terms of Service", url: "/terms" },
    ],
  },
];

export function Footer({
  footerItems = [],
  aboutText = "Your trusted online destination for health, beauty & wellness products. Authentic brands, best prices, and fast delivery across UAE.",
  socialLinks = [],
  copyrightText,
  contactInfo,
}: FooterProps) {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-gray-950 text-gray-400" role="contentinfo">
      {/* Newsletter strip */}
      <div className="border-b border-gray-800/60">
        <div className="container-shop py-10">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div>
              <h3 className="text-xl font-bold text-white">Get exclusive deals in your inbox</h3>
              <p className="text-sm text-gray-500 mt-1">
                Subscribe to our newsletter for early access to sales and new arrivals.
              </p>
            </div>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                const email = (e.currentTarget.elements.namedItem("email") as HTMLInputElement).value;
                fetch("/api/newsletter", {
                  method: "POST",
                  headers: { "Content-Type": "application/json" },
                  body: JSON.stringify({ email }),
                });
              }}
              className="flex w-full md:w-auto gap-2"
            >
              <input
                name="email"
                type="email"
                required
                placeholder="Enter your email"
                className="flex-1 md:w-72 px-4 py-2.5 rounded-full bg-gray-800/60 border border-gray-700 text-white text-sm placeholder:text-gray-500 focus:outline-none focus:border-[#2E6F40] focus:ring-1 focus:ring-[#2E6F40] transition-all"
              />
              <button
                type="submit"
                className="btn-primary rounded-full whitespace-nowrap"
              >
                <Send className="w-4 h-4" />
                Subscribe
              </button>
            </form>
          </div>
        </div>
      </div>

      {/* Main footer */}
      <div className="container-shop py-12">
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-8">
          {/* Brand column */}
          <div className="col-span-2 md:col-span-3 lg:col-span-1">
            <Link href="/" className="inline-block mb-4 p-2 bg-white rounded-xl shadow-xs">
              <Image
                src="/images/logo.png"
                alt="ShoppingAE"
                width={165}
                height={48}
                className="h-10 w-auto object-contain"
              />
            </Link>
            <p className="text-sm leading-relaxed text-gray-500 mb-5">{aboutText}</p>

            {/* Social links */}
            {socialLinks.length > 0 ? (
              <div className="flex items-center gap-2">
                {socialLinks.map((s) => (
                  <a
                    key={s.platform}
                    href={s.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-9 h-9 rounded-full border border-gray-700 flex items-center justify-center text-gray-400 hover:text-white hover:border-[#2E6F40] hover:bg-[#2E6F40]/10 transition-all duration-200"
                    aria-label={s.platform}
                  >
                    <SocialIcon platform={s.platform} />
                  </a>
                ))}
              </div>
            ) : (
              <div className="flex items-center gap-2">
                {["facebook", "instagram", "twitter", "youtube"].map((p) => (
                  <a
                    key={p}
                    href="#"
                    className="w-9 h-9 rounded-full border border-gray-700 flex items-center justify-center text-gray-400 hover:text-white hover:border-[#2E6F40] hover:bg-[#2E6F40]/10 transition-all duration-200"
                    aria-label={p}
                  >
                    <SocialIcon platform={p} />
                  </a>
                ))}
              </div>
            )}
          </div>

          {/* Nav columns */}
          {DEFAULT_FOOTER_COLUMNS.map((col) => (
            <div key={col.title}>
              <h4 className="text-sm font-bold text-white uppercase tracking-wider mb-4">
                {col.title}
              </h4>
              <ul className="space-y-2.5">
                {col.links.map((link) => (
                  <li key={link.label}>
                    <Link
                      href={link.url}
                      className="text-sm text-gray-500 hover:text-white transition-colors duration-150"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-gray-800/60">
        <div className="container-shop py-5 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-xs text-gray-600">
            {copyrightText ?? `© ${currentYear} ShopAE. All rights reserved.`}
          </p>
          <div className="flex items-center gap-4">
            <Link href="/privacy-policy" className="text-xs text-gray-600 hover:text-white transition-colors">
              Privacy
            </Link>
            <Link href="/terms" className="text-xs text-gray-600 hover:text-white transition-colors">
              Terms
            </Link>
            <div className="flex items-center gap-2 opacity-60">
              {/* Payment method pills */}
              {["Visa", "Mastercard", "PayPal", "Apple Pay"].map((p) => (
                <span key={p} className="text-[10px] px-2 py-0.5 border border-gray-700 rounded text-gray-500">
                  {p}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
