import { Suspense } from "react";
import type { Metadata } from "next";
import { getCachedProducts, getCachedCategories } from "@/lib/cache";
import { ProductCard } from "@/components/ui/ProductCard";
import { ProductGridSkeleton } from "@/components/ui/Skeleton";
import { Pagination } from "@/components/ui/Pagination";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs";
import { ProductFilters } from "@/components/shop/ProductFilters";
import { ProductSorter } from "@/components/shop/ProductSorter";
import { ActiveFilters } from "@/components/shop/ActiveFilters";
import type { WCProductsQuery } from "@/types/product";

export const metadata: Metadata = {
  title: "All Products",
  description: "Browse our full range of health, beauty, and wellness products.",
};

interface ShopPageProps {
  searchParams: Promise<{
    page?: string;
    orderby?: string;
    order?: string;
    category?: string;
    min_price?: string;
    max_price?: string;
    on_sale?: string;
    featured?: string;
    search?: string;
  }>;
}

const PER_PAGE = 16;

export default async function ShopPage({ searchParams }: ShopPageProps) {
  const params = await searchParams;
  const page = parseInt(params.page ?? "1");
  const orderby = (params.orderby as WCProductsQuery["orderby"]) ?? "date";
  const order = (params.order as "asc" | "desc") ?? "desc";

  const query: WCProductsQuery = {
    page,
    per_page: PER_PAGE,
    orderby,
    order,
    status: "publish",
  };

  if (params.category) query.category = params.category;
  if (params.min_price) query.min_price = params.min_price;
  if (params.max_price) query.max_price = params.max_price;
  if (params.on_sale === "true") query.on_sale = true;
  if (params.featured === "true") query.featured = true;
  if (params.search) query.search = params.search;

  const [{ products, total, totalPages }, categories] = await Promise.all([
    getCachedProducts(query),
    getCachedCategories(),
  ]);

  const topCategories = categories.filter((c) => c.parent === 0);

  return (
    <div className="py-8 container-shop">
      <Breadcrumbs items={[{ label: "Shop" }]} className="mb-6" />

      <div className="flex gap-8">
        {/* Sidebar filters */}
        <aside className="hidden lg:block w-64 flex-shrink-0" aria-label="Product filters">
          <ProductFilters
            categories={topCategories}
            currentParams={params as Record<string, string>}
          />
        </aside>

        {/* Main content */}
        <div className="flex-1 min-w-0">
          {/* Top bar */}
          <div className="flex items-center justify-between flex-wrap gap-3 mb-6">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                {params.search ? `Results for "${params.search}"` : "All Products"}
              </h1>
              <p className="text-sm text-gray-500 mt-0.5">
                {total} product{total !== 1 ? "s" : ""} found
              </p>
            </div>
            <ProductSorter currentParams={params as Record<string, string>} />
          </div>

          {/* Active filters */}
          <ActiveFilters currentParams={params as Record<string, string>} categories={topCategories} />

          {/* Grid */}
          {products.length > 0 ? (
            <Suspense fallback={<ProductGridSkeleton count={PER_PAGE} />}>
              <div className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-4 gap-4 mb-8">
                {products.map((product, i) => (
                  <ProductCard key={product.id} product={product} priority={i < 4} />
                ))}
              </div>
            </Suspense>
          ) : (
            <div className="flex flex-col items-center justify-center py-24 text-center">
              <div className="text-6xl mb-4">🔍</div>
              <h2 className="text-xl font-bold text-gray-900 mb-2">No products found</h2>
              <p className="text-gray-500 max-w-sm">
                Try adjusting your filters or search term to find what you're looking for.
              </p>
            </div>
          )}

          {/* Pagination */}
          {totalPages > 1 && (
            <Pagination
              currentPage={page}
              totalPages={totalPages}
              basePath="/shop"
              searchParams={params as Record<string, string>}
            />
          )}
        </div>
      </div>
    </div>
  );
}
