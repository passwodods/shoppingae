import { notFound } from "next/navigation";
import { Suspense } from "react";
import type { Metadata } from "next";
import {
  getCachedProduct,
  getCachedProductVariations,
  getCachedProductReviews,
  getCachedBestSellers,
} from "@/lib/cache";
import { getProductMetadata } from "@/lib/metadata";
import { productSchema, breadcrumbSchema } from "@/lib/structured-data";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs";
import { ProductGallery } from "@/components/product/ProductGallery";
import { ProductInfo } from "@/components/product/ProductInfo";
import { ProductTabs } from "@/components/product/ProductTabs";
import { BestSellersSidebar } from "@/components/product/BestSellersSidebar";
import { RelatedProducts } from "@/components/product/RelatedProducts";
import { StickyAddToCart } from "@/components/product/StickyAddToCart";
import { ProductGridSkeleton } from "@/components/ui/Skeleton";

interface ProductPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: ProductPageProps): Promise<Metadata> {
  const { slug } = await params;
  const product = await getCachedProduct(slug);
  if (!product) return { title: "Product Not Found" };
  return getProductMetadata(product);
}

export default async function ProductPage({ params }: ProductPageProps) {
  const { slug } = await params;
  const product = await getCachedProduct(slug);

  if (!product) notFound();

  const [variations, reviews, bestSellers] = await Promise.all([
    product.type === "variable" ? getCachedProductVariations(product.id) : Promise.resolve([]),
    getCachedProductReviews(product.id),
    getCachedBestSellers(12),
  ]);

  const breadcrumbItems = [
    { label: "Shop", href: "/shop" },
    ...(product.categories[0]
      ? [{ label: product.categories[0].name, href: `/category/${product.categories[0].slug}` }]
      : []),
  ];

  const jsonLd = [
    productSchema(product, reviews),
    breadcrumbSchema(breadcrumbItems.map((item) => ({
      name: item.label,
      url: item.href ?? `/product/${slug}`,
    }))),
  ];

  return (
    <>
      {jsonLd.map((schema, i) => (
        <script
          key={i}
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
        />
      ))}

      <div className="container-shop py-8 pb-20">
        <Breadcrumbs items={breadcrumbItems} className="mb-6" />

        {/* Product main section: Gallery + Info */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 mb-12">
          <ProductGallery images={product.images} productName={product.name} />
          <ProductInfo product={product} variations={variations} reviews={reviews} />
        </div>

        {/* 70% Product Information Tabs (Left) + 30% Best Selling Products Sidebar (Right) */}
        <div className="grid grid-cols-1 lg:grid-cols-10 gap-8 mb-12 items-start">
          {/* 70% Left Column */}
          <div className="lg:col-span-7">
            <ProductTabs product={product} reviews={reviews} />
          </div>

          {/* 30% Right Column */}
          <div className="lg:col-span-3">
            <BestSellersSidebar products={bestSellers} currentProductId={product.id} />
          </div>
        </div>

        {/* Related products */}
        <Suspense fallback={<ProductGridSkeleton count={4} />}>
          <RelatedProducts
            productId={product.id}
            categoryId={product.categories[0]?.id}
          />
        </Suspense>

        {/* Sticky Add to Cart floating bar on scroll */}
        <StickyAddToCart product={product} />
      </div>
    </>
  );
}
