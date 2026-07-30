import type { MetadataRoute } from "next";
import { getProducts, getCategories } from "@/lib/woocommerce";
import { getPosts } from "@/lib/wordpress";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://your-nextjs-site.com";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  let products: Awaited<ReturnType<typeof getProducts>>["products"] = [];
  let categories: Awaited<ReturnType<typeof getCategories>> = [];
  let posts: Awaited<ReturnType<typeof getPosts>>["posts"] = [];

  try {
    const results = await Promise.all([
      getProducts({ per_page: 100, status: "publish" }),
      getCategories({ per_page: 100, hide_empty: true }),
      getPosts({ per_page: 50 }),
    ]);
    products = results[0].products;
    categories = results[1];
    posts = results[2].posts;
  } catch {
    // WordPress not connected during build — return static pages only
  }

  const staticPages: MetadataRoute.Sitemap = [
    { url: siteUrl, lastModified: new Date(), changeFrequency: "daily", priority: 1.0 },
    { url: `${siteUrl}/shop`, lastModified: new Date(), changeFrequency: "daily", priority: 0.9 },
    { url: `${siteUrl}/blog`, lastModified: new Date(), changeFrequency: "weekly", priority: 0.7 },
    { url: `${siteUrl}/contact`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.5 },
    { url: `${siteUrl}/privacy-policy`, lastModified: new Date(), changeFrequency: "yearly", priority: 0.3 },
    { url: `${siteUrl}/terms`, lastModified: new Date(), changeFrequency: "yearly", priority: 0.3 },
  ];

  const productPages: MetadataRoute.Sitemap = products.map((p) => ({
    url: `${siteUrl}/product/${p.slug}`,
    lastModified: new Date(),
    changeFrequency: "weekly" as const,
    priority: 0.8,
  }));

  const categoryPages: MetadataRoute.Sitemap = categories.map((c) => ({
    url: `${siteUrl}/category/${c.slug}`,
    lastModified: new Date(),
    changeFrequency: "daily" as const,
    priority: 0.85,
  }));

  const blogPages: MetadataRoute.Sitemap = posts.map((p) => ({
    url: `${siteUrl}/blog/${p.slug}`,
    lastModified: new Date(p.modified),
    changeFrequency: "monthly" as const,
    priority: 0.6,
  }));

  return [...staticPages, ...productPages, ...categoryPages, ...blogPages];
}
