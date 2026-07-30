"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import type { NavItem } from "@/types/menu";
import { cn } from "@/lib/utils";

interface MegaMenuProps {
  items: NavItem[];
  onMouseEnter?: () => void;
  onMouseLeave?: () => void;
}

export function MegaMenu({ items, onMouseEnter, onMouseLeave }: MegaMenuProps) {
  const columns = Math.min(Math.ceil(items.length / 5), 4);

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 8 }}
      transition={{ duration: 0.18, ease: "easeOut" }}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
      className="absolute top-full left-1/2 -translate-x-1/2 mt-1 z-50"
    >
      <div className="glass rounded-2xl shadow-xl border border-gray-100 p-4 min-w-[240px]"
           style={{ maxWidth: columns > 2 ? "640px" : "320px" }}>
        <div
          className={cn("grid gap-1", {
            "grid-cols-1": columns === 1,
            "grid-cols-2": columns === 2,
            "grid-cols-3": columns === 3,
            "grid-cols-4": columns >= 4,
          })}
        >
          {items.map((item) => (
            <div key={item.id} className="flex flex-col">
              {item.children && item.children.length > 0 ? (
                <>
                  <Link
                    href={item.url || "#"}
                    className="text-xs font-bold uppercase tracking-wider text-gray-400 px-2 py-1.5 mb-1 hover:text-[#2E6F40] transition-colors"
                  >
                    {item.label}
                  </Link>
                  {item.children.map((child) => (
                    <Link
                      key={child.id}
                      href={child.url || "#"}
                      className="flex items-center gap-2 px-2 py-1.5 rounded-lg text-sm text-gray-700
                                 hover:text-[#2E6F40] hover:bg-green-50 transition-all duration-150"
                    >
                      {child.label}
                    </Link>
                  ))}
                </>
              ) : (
                <Link
                  href={item.url || "#"}
                  className="flex items-center gap-2 px-2 py-1.5 rounded-lg text-sm font-medium text-gray-700
                             hover:text-[#2E6F40] hover:bg-green-50 transition-all duration-150"
                >
                  {item.label}
                </Link>
              )}
            </div>
          ))}
        </div>
      </div>
      {/* Arrow pointer */}
      <div className="absolute -top-1.5 left-1/2 -translate-x-1/2 w-3 h-3 bg-white border-l border-t border-gray-100 rotate-45 rounded-sm" />
    </motion.div>
  );
}
