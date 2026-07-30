import { cn } from "@/lib/utils";

// ──────────────────────────────────────────────
// Base Skeleton Box
// ──────────────────────────────────────────────
interface SkeletonProps {
  className?: string;
}

export function Skeleton({ className }: SkeletonProps) {
  return (
    <div
      className={cn("skeleton rounded-xl", className)}
      aria-hidden="true"
    />
  );
}

// ──────────────────────────────────────────────
// Product Card Skeleton
// ──────────────────────────────────────────────
export function ProductCardSkeleton() {
  return (
    <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden" aria-busy="true" aria-label="Loading product">
      <Skeleton className="aspect-square w-full rounded-none" />
      <div className="p-3 space-y-2">
        <Skeleton className="h-3 w-20" />
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-3/4" />
        <div className="flex items-center justify-between pt-1">
          <Skeleton className="h-5 w-16" />
          <Skeleton className="h-9 w-9 rounded-full" />
        </div>
      </div>
    </div>
  );
}

// ──────────────────────────────────────────────
// Product Grid Skeleton
// ──────────────────────────────────────────────
export function ProductGridSkeleton({ count = 8 }: { count?: number }) {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
      {Array.from({ length: count }).map((_, i) => (
        <ProductCardSkeleton key={i} />
      ))}
    </div>
  );
}

// ──────────────────────────────────────────────
// Hero Skeleton
// ──────────────────────────────────────────────
export function HeroSkeleton() {
  return (
    <div className="relative w-full overflow-hidden">
      <Skeleton className="h-[420px] sm:h-[520px] lg:h-[600px] w-full rounded-none" />
    </div>
  );
}

// ──────────────────────────────────────────────
// Text Skeleton Variants
// ──────────────────────────────────────────────
export function TextSkeleton({ lines = 3 }: { lines?: number }) {
  return (
    <div className="space-y-2">
      {Array.from({ length: lines }).map((_, i) => (
        <Skeleton
          key={i}
          className={cn("h-4", i === lines - 1 ? "w-2/3" : "w-full")}
        />
      ))}
    </div>
  );
}
