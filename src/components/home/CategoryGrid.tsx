import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import type { WCCategory } from "@/types/product";
import { buildCategoryUrl } from "@/lib/utils";

interface CategoryGridProps {
  categories: WCCategory[];
}

const CATEGORY_COLORS = [
  "from-pink-100 to-rose-100",
  "from-purple-100 to-violet-100",
  "from-blue-100 to-cyan-100",
  "from-emerald-100 to-teal-100",
  "from-amber-100 to-orange-100",
  "from-indigo-100 to-blue-100",
];

export function CategoryGrid({ categories }: CategoryGridProps) {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3 sm:gap-4">
      {categories.slice(0, 12).map((category, i) => (
        <Link
          key={category.id}
          href={buildCategoryUrl(category.slug)}
          className="group flex flex-col items-center gap-2.5 p-3 rounded-2xl hover:shadow-md transition-all duration-300 hover:-translate-y-1"
        >
          <div
            className={`w-full aspect-square rounded-xl bg-gradient-to-br ${CATEGORY_COLORS[i % CATEGORY_COLORS.length]} flex items-center justify-center overflow-hidden`}
          >
            {category.image ? (
              <Image
                src={category.image.src}
                alt={category.image.alt || category.name}
                width={120}
                height={120}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              />
            ) : (
              <span className="text-3xl select-none">
                {getCategoryEmoji(category.slug)}
              </span>
            )}
          </div>
          <p className="text-xs sm:text-sm font-semibold text-gray-800 text-center leading-tight group-hover:text-[#2E6F40] transition-colors">
            {category.name}
          </p>
        </Link>
      ))}

      {/* View All */}
      <Link
        href="/shop"
        className="group flex flex-col items-center gap-2.5 p-3 rounded-2xl hover:shadow-md transition-all duration-300 hover:-translate-y-1"
      >
        <div className="w-full aspect-square rounded-xl bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center">
          <ArrowRight className="w-8 h-8 text-gray-400 group-hover:text-[#2E6F40] transition-colors group-hover:translate-x-1 duration-300" />
        </div>
        <p className="text-xs sm:text-sm font-semibold text-gray-500 group-hover:text-[#2E6F40] transition-colors">
          View All
        </p>
      </Link>
    </div>
  );
}

function getCategoryEmoji(slug: string): string {
  const map: Record<string, string> = {
    skincare: "🧴",
    "hair-care": "💆",
    "oral-care": "🦷",
    fragrance: "🌸",
    vitamins: "💊",
    nutrition: "🥗",
    "personal-care": "🛁",
    "first-aid": "🩺",
    cosmetics: "💄",
    baby: "👶",
    sports: "🏋️",
    home: "🏠",
    pantry: "🥫",
    medical: "⚕️",
  };
  for (const key of Object.keys(map)) {
    if (slug.includes(key)) return map[key];
  }
  return "🛍️";
}
