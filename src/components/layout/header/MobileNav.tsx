"use client";

import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, ChevronRight, ChevronLeft } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { useUIStore } from "@/stores/ui.store";
import type { NavItem } from "@/types/menu";
import { cn } from "@/lib/utils";

interface MobileNavProps {
  items: NavItem[];
}

export function MobileNav({ items }: MobileNavProps) {
  const { isMobileNavOpen, closeMobileNav } = useUIStore();
  const [activeParent, setActiveParent] = useState<NavItem | null>(null);
  const drawerRef = useRef<HTMLDivElement>(null);

  // Close on escape key
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") closeMobileNav();
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [closeMobileNav]);

  // Lock body scroll when open
  useEffect(() => {
    document.body.style.overflow = isMobileNavOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [isMobileNavOpen]);

  const handleClose = () => {
    setActiveParent(null);
    closeMobileNav();
  };

  return (
    <AnimatePresence>
      {isMobileNavOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            key="mobile-nav-backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-[60] bg-black/60 backdrop-blur-sm"
            onClick={handleClose}
            aria-hidden="true"
          />

          {/* Drawer */}
          <motion.div
            key="mobile-nav-drawer"
            ref={drawerRef}
            initial={{ x: "-100%" }}
            animate={{ x: 0 }}
            exit={{ x: "-100%" }}
            transition={{ type: "spring", damping: 30, stiffness: 300 }}
            className="fixed left-0 top-0 bottom-0 z-[61] w-[85vw] max-w-[360px] bg-white shadow-2xl flex flex-col"
            role="dialog"
            aria-modal="true"
            aria-label="Navigation menu"
          >
            {/* Header */}
            <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
              <Link href="/" onClick={handleClose} className="flex items-center py-0.5">
                <Image
                  src="/images/logo.png"
                  alt="ShoppingAE"
                  width={140}
                  height={40}
                  className="h-8 w-auto object-contain"
                />
              </Link>
              <button
                onClick={handleClose}
                className="btn-icon"
                aria-label="Close menu"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Navigation */}
            <div className="flex-1 overflow-y-auto py-2">
              <AnimatePresence mode="wait">
                {activeParent ? (
                  /* Sub-menu */
                  <motion.div
                    key="submenu"
                    initial={{ x: "100%", opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    exit={{ x: "100%", opacity: 0 }}
                    transition={{ duration: 0.2, ease: "easeOut" }}
                    className="px-3"
                  >
                    <button
                      onClick={() => setActiveParent(null)}
                      className="flex items-center gap-2 w-full px-3 py-3 text-sm font-semibold text-gray-500 hover:text-gray-900 mb-2"
                    >
                      <ChevronLeft className="w-4 h-4" />
                      Back to Menu
                    </button>
                    <div className="mb-2 px-3 py-1.5">
                      <Link
                        href={activeParent.url || "#"}
                        onClick={handleClose}
                        className="text-base font-bold text-[#2E6F40]"
                      >
                        All {activeParent.label}
                      </Link>
                    </div>
                    {activeParent.children?.map((child) => (
                      <Link
                        key={child.id}
                        href={child.url || "#"}
                        onClick={handleClose}
                        className="flex items-center px-3 py-3 rounded-xl text-sm text-gray-700 hover:text-[#2E6F40] hover:bg-green-50 transition-colors"
                      >
                        {child.label}
                      </Link>
                    ))}
                  </motion.div>
                ) : (
                  /* Top-level menu */
                  <motion.div
                    key="topmenu"
                    initial={{ x: 0 }}
                    animate={{ x: 0 }}
                    exit={{ x: "-100%", opacity: 0 }}
                    transition={{ duration: 0.2, ease: "easeOut" }}
                    className="px-3"
                  >
                    {items.map((item) => (
                      <div key={item.id}>
                        {item.children && item.children.length > 0 ? (
                          <button
                            onClick={() => setActiveParent(item)}
                            className="flex items-center justify-between w-full px-3 py-3 rounded-xl text-sm font-semibold text-gray-800 hover:text-[#2E6F40] hover:bg-green-50 transition-colors"
                          >
                            <span>{item.label}</span>
                            <ChevronRight className="w-4 h-4 text-gray-400" />
                          </button>
                        ) : (
                          <Link
                            href={item.url || "#"}
                            onClick={handleClose}
                            className="flex items-center px-3 py-3 rounded-xl text-sm font-semibold text-gray-800 hover:text-[#2E6F40] hover:bg-green-50 transition-colors"
                          >
                            {item.label}
                          </Link>
                        )}
                      </div>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Footer links */}
            <div className="border-t border-gray-100 px-5 py-4 flex flex-col gap-1">
              <Link href="/login" onClick={handleClose} className="flex items-center gap-2 text-sm text-gray-600 py-2 hover:text-[#2E6F40]">
                My Account
              </Link>
              <Link href="/account/wishlist" onClick={handleClose} className="flex items-center gap-2 text-sm text-gray-600 py-2 hover:text-[#2E6F40]">
                Wishlist
              </Link>
              <Link href="/contact" onClick={handleClose} className="flex items-center gap-2 text-sm text-gray-600 py-2 hover:text-[#2E6F40]">
                Contact Us
              </Link>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
