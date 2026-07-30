"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import type { WPFAQItem } from "@/types/blog";
import { cn } from "@/lib/utils";

interface FAQAccordionProps {
  items: WPFAQItem[];
}

export function FAQAccordion({ items }: FAQAccordionProps) {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <div className="space-y-2">
      {items.map((item, i) => (
        <div key={i} className={cn("rounded-xl border transition-all duration-200", openIndex === i ? "border-pink-200 shadow-sm" : "border-gray-200")}>
          <button
            onClick={() => setOpenIndex(openIndex === i ? null : i)}
            className="flex items-center justify-between w-full px-5 py-4 text-left"
            aria-expanded={openIndex === i}
          >
            <span className="font-semibold text-gray-900 text-sm">{item.question}</span>
            <ChevronDown
              className={cn(
                "w-4 h-4 text-gray-400 flex-shrink-0 ml-4 transition-transform duration-200",
                openIndex === i && "rotate-180 text-[#2E6F40]"
              )}
            />
          </button>
          <AnimatePresence initial={false}>
            {openIndex === i && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.2, ease: "easeOut" }}
                className="overflow-hidden"
              >
                <div
                  className="px-5 pb-5 text-sm text-gray-600 leading-relaxed"
                  dangerouslySetInnerHTML={{ __html: item.answer }}
                />
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      ))}
    </div>
  );
}
