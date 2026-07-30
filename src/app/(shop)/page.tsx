import { Suspense } from "react";
import { getCachedFeaturedProducts, getCachedBestSellers, getCachedNewArrivals, getCachedCategories } from "@/lib/cache";
import { getPosts } from "@/lib/wordpress";
import { HeroSection } from "@/components/home/HeroSection";
import { TrustBadges } from "@/components/home/TrustBadges";
import { CategoryGrid } from "@/components/home/CategoryGrid";
import { ProductsSection } from "@/components/home/ProductsSection";
import { PromoBanner } from "@/components/home/PromoBanner";
import { BrandsSection } from "@/components/home/BrandsSection";
import { LatestBlogSection } from "@/components/home/LatestBlogSection";
import { SEOFooterSection } from "@/components/home/SEOFooterSection";
import { ProductGridSkeleton } from "@/components/ui/Skeleton";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "ShopAE – Health, Beauty & Wellness | UAE Online Pharmacy",
  description:
    "Shop authentic health, beauty, and wellness products at the best prices in UAE. Fast delivery, easy returns, and exclusive deals.",
  alternates: { canonical: "/" },
  openGraph: {
    title: "ShopAE – Health, Beauty & Wellness",
    description: "Your trusted online destination for health & beauty in UAE.",
    type: "website",
  },
};

export const revalidate = 300; // ISR: revalidate every 5 minutes

export default async function HomePage() {
  const [featured, bestSellers, newArrivals, categories, blogData] = await Promise.all([
    getCachedFeaturedProducts(8),
    getCachedBestSellers(8),
    getCachedNewArrivals(8),
    getCachedCategories(),
    getPosts({ per_page: 4 }),
  ]);

  // Top-level categories only
  const topCategories = categories
    .filter((c) => c.parent === 0)
    .slice(0, 12);

  return (
    <div className="bg-white">
      {/* Hero Slider */}
      <HeroSection />

      {/* Trust Badges */}
      <TrustBadges />



      {/* Promo Banner */}
      <PromoBanner />

      {/* Featured Products */}
      {featured.length > 0 && (
        <section className="py-12 bg-gray-50/60">
          <div className="container-shop">
            <Suspense fallback={<ProductGridSkeleton />}>
              <ProductsSection
                title="Featured Products"
                subtitle="Hand-picked selections for you"
                products={featured}
                viewAllUrl="/shop?featured=true"
              />
            </Suspense>
          </div>
        </section>
      )}

      {/* Best Sellers */}
      {bestSellers.length > 0 && (
        <section className="py-12">
          <div className="container-shop">
            <Suspense fallback={<ProductGridSkeleton />}>
              <ProductsSection
                title="Best Sellers"
                subtitle="Our most popular products"
                products={bestSellers}
                viewAllUrl="/shop?orderby=popularity"
                accentColor="amber"
              />
            </Suspense>
          </div>
        </section>
      )}

      {/* New Arrivals */}
      {newArrivals.length > 0 && (
        <section className="py-12 bg-gray-50/60">
          <div className="container-shop">
            <Suspense fallback={<ProductGridSkeleton />}>
              <ProductsSection
                title="New Arrivals"
                subtitle="The latest additions to our store"
                products={newArrivals}
                viewAllUrl="/shop?orderby=date"
                accentColor="emerald"
              />
            </Suspense>
          </div>
        </section>
      )}

      {/* Brands Section */}
      <BrandsSection />

      {/* 4-Column Blog Posts Section */}
      <LatestBlogSection posts={blogData.posts} />

      {/* Noon-Style SEO Content & Popular Searches Tag Cloud Section */}
      <SEOFooterSection />
    </div>
  );
}
