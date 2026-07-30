import type { Metadata } from "next";
import { getProducts } from "@/lib/woocommerce";
import { ProductCard } from "@/components/ui/ProductCard";
import { Pagination } from "@/components/ui/Pagination";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs";
import { ProductSorter } from "@/components/shop/ProductSorter";

interface SearchPageProps {
  searchParams: Promise<{ q?: string; page?: string; orderby?: string; order?: string }>;
}

export async function generateMetadata({ searchParams }: SearchPageProps): Promise<Metadata> {
  const sp = await searchParams;
  return {
    title: sp.q ? `Search: "${sp.q}"` : "Search",
    description: sp.q ? `Search results for "${sp.q}" — ShopAE` : "Search products on ShopAE",
    robots: { index: false, follow: true },
  };
}

const PER_PAGE = 16;

export default async function SearchPage({ searchParams }: SearchPageProps) {
  const sp = await searchParams;
  const query = sp.q ?? "";
  const page = parseInt(sp.page ?? "1");

  const { products, total, totalPages } = await getProducts({
    search: query,
    page,
    per_page: PER_PAGE,
    orderby: (sp.orderby as never) ?? "relevance",
    order: (sp.order as never) ?? "desc",
    status: "publish",
  });

  return (
    <div className="py-8 container-shop">
      <Breadcrumbs items={[{ label: "Search" }]} className="mb-6" />

      <div className="flex items-end justify-between mb-6 gap-4 flex-wrap">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            {query ? `Results for "${query}"` : "All Products"}
          </h1>
          <p className="text-sm text-gray-500 mt-0.5">
            {total} product{total !== 1 ? "s" : ""} found
          </p>
        </div>
        {products.length > 0 && <ProductSorter currentParams={sp as Record<string, string>} />}
      </div>

      {products.length > 0 ? (
        <>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 mb-8">
            {products.map((product, i) => (
              <ProductCard key={product.id} product={product} priority={i < 4} />
            ))}
          </div>
          {totalPages > 1 && (
            <Pagination
              currentPage={page}
              totalPages={totalPages}
              basePath="/search"
              searchParams={sp as Record<string, string>}
            />
          )}
        </>
      ) : (
        <div className="text-center py-24">
          <p className="text-6xl mb-4">🔍</p>
          <h2 className="text-xl font-bold text-gray-900 mb-2">
            {query ? `No results for "${query}"` : "Enter a search term above"}
          </h2>
          <p className="text-gray-500 max-w-sm mx-auto">
            Try different keywords or browse our{" "}
            <a href="/shop" className="text-[#2E6F40] hover:underline">full catalogue</a>.
          </p>
        </div>
      )}
    </div>
  );
}
