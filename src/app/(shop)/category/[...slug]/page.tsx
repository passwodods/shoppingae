import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { getCachedCategory, getCachedProducts, getCachedCategories } from "@/lib/cache";
import { getCategoryMetadata } from "@/lib/metadata";
import { breadcrumbSchema, categorySchema } from "@/lib/structured-data";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs";
import { ProductCard } from "@/components/ui/ProductCard";
import { Pagination } from "@/components/ui/Pagination";
import { ProductSorter } from "@/components/shop/ProductSorter";

interface CategoryPageProps {
  params: Promise<{ slug: string[] }>;
  searchParams: Promise<{ page?: string; orderby?: string; order?: string }>;
}

export async function generateMetadata({ params }: CategoryPageProps): Promise<Metadata> {
  const { slug } = await params;
  const categorySlug = slug[slug.length - 1];
  const category = await getCachedCategory(categorySlug);
  if (!category) return { title: "Category Not Found" };
  return getCategoryMetadata(category);
}

const PER_PAGE = 16;

export default async function CategoryPage({ params, searchParams }: CategoryPageProps) {
  const { slug } = await params;
  const sp = await searchParams;
  const categorySlug = slug[slug.length - 1];
  const page = parseInt(sp.page ?? "1");

  const [category] = await Promise.all([getCachedCategory(categorySlug)]);
  if (!category) notFound();

  const { products, total, totalPages } = await getCachedProducts({
    category: category.id,
    page,
    per_page: PER_PAGE,
    orderby: (sp.orderby as never) ?? "date",
    order: (sp.order as never) ?? "desc",
    status: "publish",
  });

  const breadcrumbItems = [
    { label: "Shop", href: "/shop" },
    { label: category.name },
  ];

  const jsonLd = [
    categorySchema(category),
    breadcrumbSchema(breadcrumbItems.map((i) => ({
      name: i.label,
      url: i.href ?? `/category/${categorySlug}`,
    }))),
  ];

  return (
    <>
      {jsonLd.map((schema, i) => (
        <script key={i} type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />
      ))}
      <div className="py-8 container-shop">
        <Breadcrumbs items={breadcrumbItems} className="mb-6" />

        <div className="flex items-end justify-between mb-6 gap-4 flex-wrap">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">{category.name}</h1>
            {category.description && (
              <p className="text-gray-500 mt-1 max-w-2xl text-sm"
                 dangerouslySetInnerHTML={{ __html: category.description }} />
            )}
            <p className="text-sm text-gray-400 mt-2">{total} products</p>
          </div>
          <ProductSorter currentParams={sp as Record<string, string>} />
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
                basePath={`/category/${slug.join("/")}`}
                searchParams={sp as Record<string, string>}
              />
            )}
          </>
        ) : (
          <div className="text-center py-24">
            <p className="text-6xl mb-4">📦</p>
            <h2 className="text-xl font-bold text-gray-900 mb-2">No products in this category</h2>
            <p className="text-gray-500">Check back soon for new arrivals.</p>
          </div>
        )}
      </div>
    </>
  );
}
