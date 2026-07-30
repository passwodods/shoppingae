"use client";

import { useEffect, useState, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { ShoppingCart, Search, User, Heart, Menu, ChevronDown, LayoutGrid, Flame } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useCartStore } from "@/stores/cart.store";
import { useUIStore } from "@/stores/ui.store";
import { useAuthStore } from "@/stores/auth.store";
import { cn } from "@/lib/utils";
import type { NavItem } from "@/types/menu";
import { MegaMenu } from "./MegaMenu";
import { MobileNav } from "./MobileNav";
import { SearchOverlay } from "./SearchOverlay";
import { MiniCart } from "../MiniCart";
import { AnnouncementBar } from "./AnnouncementBar";

interface HeaderProps {
  navItems?: NavItem[];
  announcementMessages?: Array<{ text: string; link_text?: string; link_url?: string }>;
  announcementEnabled?: boolean;
}

const DEFAULT_MAIN_MENU: NavItem[] = [
  { id: "all", label: "All Categories", url: "/shop" },
  { id: "vitamins", label: "Vitamins & Supplements", url: "/category/vitamins-supplements" },
  { id: "skincare", label: "Skincare & Beauty", url: "/category/skincare-beauty" },
  { id: "personal", label: "Personal Care", url: "/category/personal-care" },
  { id: "baby", label: "Baby & Child", url: "/category/baby-child" },
  { id: "sports", label: "Sports Nutrition", url: "/category/sports-nutrition" },
  { id: "medicines", label: "Medicines & Health", url: "/category/medicines-health" },
  { id: "deals", label: "Flash Deals", url: "/shop?on_sale=true" },
];

export function Header({
  navItems = [],
  announcementMessages = [],
  announcementEnabled = true,
}: HeaderProps) {
  const [isScrolled, setIsScrolled] = useState(false);
  const [activeMega, setActiveMega] = useState<string | null>(null);
  const megaTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);

  const { cartCount, openDrawer: openCart } = useCartStore();
  const { openMobileNav, openSearch } = useUIStore();
  const { isAuthenticated } = useAuthStore();

  const menuList = navItems.length > 0 ? navItems : DEFAULT_MAIN_MENU;

  useEffect(() => {
    const onScroll = () => setIsScrolled(window.scrollY > 10);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const handleMegaEnter = (id: string) => {
    if (megaTimeout.current) clearTimeout(megaTimeout.current);
    setActiveMega(id);
  };

  const handleMegaLeave = () => {
    megaTimeout.current = setTimeout(() => setActiveMega(null), 150);
  };

  return (
    <>
      {/* Top Notification Bar */}
      <AnnouncementBar messages={announcementMessages} />

      <header
        className={cn(
          "sticky top-0 z-40 transition-all duration-300 bg-white border-b border-gray-100",
          isScrolled && "shadow-md"
        )}
      >
        {/* Main Header Bar */}
        <div className="container-shop">
          <div className="flex items-center justify-between h-[68px] gap-4">
            {/* Mobile menu toggle */}
            <button
              className="btn-icon lg:hidden"
              onClick={openMobileNav}
              aria-label="Open navigation menu"
            >
              <Menu className="w-6 h-6" />
            </button>

            {/* Logo */}
            <Link href="/" className="flex-shrink-0 flex items-center py-1">
              <Image
                src="/images/logo.png"
                alt="ShoppingAE"
                width={165}
                height={48}
                priority
                className="h-10 w-auto object-contain hover:opacity-90 transition-opacity"
              />
            </Link>

            {/* Desktop Search Bar embedded in Header */}
            <div className="hidden md:flex flex-1 max-w-xl mx-4">
              <div
                onClick={openSearch}
                className="w-full flex items-center gap-2 px-4 py-2.5 rounded-full border border-gray-200 bg-gray-50/80 text-gray-400 text-sm cursor-pointer hover:border-green-300 hover:bg-white transition-all shadow-xs"
              >
                <Search className="w-4 h-4 text-gray-400" />
                <span className="flex-1">Search vitamins, skincare, medicines, brands…</span>
                <span className="text-[10px] font-semibold bg-gray-200 text-gray-600 px-2 py-0.5 rounded-full">⌘K</span>
              </div>
            </div>

            {/* Right Actions */}
            <div className="flex items-center gap-1.5">
              {/* Mobile Search Button */}
              <button
                className="btn-icon md:hidden"
                onClick={openSearch}
                aria-label="Search products"
              >
                <Search className="w-5 h-5" />
              </button>

              {/* Account */}
              <Link
                href={isAuthenticated ? "/account" : "/login"}
                className="btn-icon hidden sm:inline-flex"
                aria-label={isAuthenticated ? "My account" : "Login"}
              >
                <User className="w-5 h-5" />
              </Link>

              {/* Wishlist */}
              <Link href="/account/wishlist" className="btn-icon hidden sm:inline-flex" aria-label="Wishlist">
                <Heart className="w-5 h-5" />
              </Link>

              {/* Cart */}
              <button
                className="relative btn-icon"
                onClick={openCart}
                aria-label={`Shopping cart (${cartCount} items)`}
              >
                <ShoppingCart className="w-5 h-5" />
                <AnimatePresence>
                  {cartCount > 0 && (
                    <motion.span
                      key="cart-count"
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      exit={{ scale: 0 }}
                      className="absolute -top-1 -right-1 min-w-[18px] h-[18px] flex items-center justify-center
                                 rounded-full bg-[#2E6F40] text-white text-[10px] font-bold px-1"
                    >
                      {cartCount > 99 ? "99+" : cartCount}
                    </motion.span>
                  )}
                </AnimatePresence>
              </button>
            </div>
          </div>
        </div>

        {/* ── Main Category Nav Bar (Homepage & Global Header) ── */}
        <div className="bg-[#2E6F40] text-white">
          <div className="container-shop">
            <nav className="flex items-center justify-between overflow-x-auto no-scrollbar py-0.5" aria-label="Category navigation">
              <div className="flex items-center gap-1 whitespace-nowrap">
                {menuList.map((item) => {
                  const isDeals = item.id === "deals" || item.label.includes("Deals");
                  const isAll = item.id === "all";

                  return (
                    <div
                      key={item.id}
                      className="relative"
                      onMouseEnter={() => (item.children?.length ? handleMegaEnter(item.id) : undefined)}
                      onMouseLeave={handleMegaLeave}
                    >
                      <Link
                        href={item.url || "#"}
                        className={cn(
                          "flex items-center gap-1.5 px-3.5 py-2.5 text-xs font-bold transition-all rounded-lg my-0.5",
                          isDeals
                            ? "bg-amber-500 text-white hover:bg-amber-600 shadow-xs"
                            : isAll
                            ? "bg-[#225330] text-white hover:bg-[#1b4327]"
                            : "text-white/95 hover:text-white hover:bg-white/10"
                        )}
                      >
                        {isAll && <LayoutGrid className="w-3.5 h-3.5 text-green-300" />}
                        {isDeals && <Flame className="w-3.5 h-3.5 text-yellow-300 fill-current animate-pulse" />}
                        <span>{item.label}</span>
                        {item.children && item.children.length > 0 && (
                          <ChevronDown
                            className={cn(
                              "w-3 h-3 transition-transform duration-200",
                              activeMega === item.id ? "rotate-180 text-white" : "opacity-70"
                            )}
                          />
                        )}
                      </Link>

                      {/* Mega Menu Dropdown */}
                      <AnimatePresence>
                        {activeMega === item.id && item.children && item.children.length > 0 && (
                          <MegaMenu
                            items={item.children}
                            onMouseEnter={() => handleMegaEnter(item.id)}
                            onMouseLeave={handleMegaLeave}
                          />
                        )}
                      </AnimatePresence>
                    </div>
                  );
                })}
              </div>

              {/* Track Order link on right side of Category Bar */}
              <div className="hidden lg:flex items-center gap-4 text-xs font-semibold text-white/80 whitespace-nowrap pl-4">
                <Link href="/account/orders" className="hover:text-white transition-colors">
                  📦 Track Order
                </Link>
                <Link href="/contact" className="hover:text-white transition-colors">
                  💬 Need Help?
                </Link>
              </div>
            </nav>
          </div>
        </div>
      </header>

      {/* Mobile Nav Drawer */}
      <MobileNav items={menuList} />

      {/* Search Overlay */}
      <SearchOverlay />

      {/* Mini Cart Drawer */}
      <MiniCart />
    </>
  );
}
