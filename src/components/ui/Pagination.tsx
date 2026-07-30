import Link from "next/link";
import { ChevronLeft, ChevronRight, MoreHorizontal } from "lucide-react";
import { cn } from "@/lib/utils";

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  basePath: string;
  searchParams?: Record<string, string | string[] | undefined>;
}

function buildUrl(
  basePath: string,
  page: number,
  searchParams: Record<string, string | string[] | undefined>
): string {
  const params = new URLSearchParams();
  Object.entries(searchParams).forEach(([key, val]) => {
    if (key === "page") return;
    if (Array.isArray(val)) val.forEach((v) => params.append(key, v));
    else if (val) params.set(key, val);
  });
  if (page > 1) params.set("page", String(page));
  const qs = params.toString();
  return qs ? `${basePath}?${qs}` : basePath;
}

function getPageRange(current: number, total: number): (number | "...")[] {
  if (total <= 7) return Array.from({ length: total }, (_, i) => i + 1);

  const pages: (number | "...")[] = [1];

  if (current > 3) pages.push("...");

  const start = Math.max(2, current - 1);
  const end = Math.min(total - 1, current + 1);
  for (let i = start; i <= end; i++) pages.push(i);

  if (current < total - 2) pages.push("...");
  pages.push(total);

  return pages;
}

export function Pagination({ currentPage, totalPages, basePath, searchParams = {} }: PaginationProps) {
  if (totalPages <= 1) return null;

  const pages = getPageRange(currentPage, totalPages);

  return (
    <nav aria-label="Pagination" className="flex items-center justify-center gap-1.5">
      {/* Previous */}
      <Link
        href={buildUrl(basePath, currentPage - 1, searchParams)}
        aria-label="Previous page"
        aria-disabled={currentPage === 1}
        className={cn(
          "flex items-center gap-1 px-3 py-2 rounded-xl text-sm font-medium transition-all",
          currentPage === 1
            ? "pointer-events-none text-gray-300 bg-gray-50"
            : "text-gray-600 hover:text-[#2E6F40] hover:bg-green-50"
        )}
      >
        <ChevronLeft className="w-4 h-4" />
        <span className="hidden sm:inline">Prev</span>
      </Link>

      {/* Page numbers */}
      {pages.map((page, i) =>
        page === "..." ? (
          <span key={`ellipsis-${i}`} className="w-9 h-9 flex items-center justify-center text-gray-400">
            <MoreHorizontal className="w-4 h-4" />
          </span>
        ) : (
          <Link
            key={page}
            href={buildUrl(basePath, page as number, searchParams)}
            aria-label={`Page ${page}`}
            aria-current={page === currentPage ? "page" : undefined}
            className={cn(
              "w-9 h-9 flex items-center justify-center rounded-xl text-sm font-semibold transition-all",
              page === currentPage
                ? "bg-[#2E6F40] text-white shadow-sm"
                : "text-gray-600 hover:text-[#2E6F40] hover:bg-green-50"
            )}
          >
            {page}
          </Link>
        )
      )}

      {/* Next */}
      <Link
        href={buildUrl(basePath, currentPage + 1, searchParams)}
        aria-label="Next page"
        aria-disabled={currentPage === totalPages}
        className={cn(
          "flex items-center gap-1 px-3 py-2 rounded-xl text-sm font-medium transition-all",
          currentPage === totalPages
            ? "pointer-events-none text-gray-300 bg-gray-50"
            : "text-gray-600 hover:text-[#2E6F40] hover:bg-green-50"
        )}
      >
        <span className="hidden sm:inline">Next</span>
        <ChevronRight className="w-4 h-4" />
      </Link>
    </nav>
  );
}
