import type { Metadata } from "next";
import type { WCProduct } from "@/types/product";
import type { WCCategory } from "@/types/product";
import type { WPPost } from "@/types/blog";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://your-nextjs-site.com";
const siteName = process.env.NEXT_PUBLIC_SITE_NAME ?? "ShopAE";
const siteDesc = process.env.NEXT_PUBLIC_SITE_DESCRIPTION ?? "";

// ──────────────────────────────────────────────
// Base metadata (root layout)
// ──────────────────────────────────────────────
export const baseMetadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: siteName,
    template: `%s | ${siteName}`,
  },
  description: siteDesc,
  applicationName: siteName,
  referrer: "origin-when-cross-origin",
  keywords: ["health", "beauty", "wellness", "UAE", "online pharmacy"],
  openGraph: {
    type: "website",
    siteName,
    locale: "en_AE",
  },
  twitter: {
    card: "summary_large_image",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  alternates: {
    canonical: siteUrl,
  },
};

// ──────────────────────────────────────────────
// Product page metadata
// ──────────────────────────────────────────────
export function getProductMetadata(product: WCProduct): Metadata {
  const title = product.yoast_head_json?.og_title ?? product.name;
  const description = product.yoast_head_json?.description ?? product.short_description.replace(/<[^>]*>/g, "");
  const imageUrl = product.yoast_head_json?.og_image?.[0]?.url ?? product.images[0]?.src;
  const canonical = `${siteUrl}/product/${product.slug}`;

  return {
    title,
    description,
    alternates: { canonical },
    openGraph: {
      title,
      description,
      url: canonical,
      type: "website",
      images: imageUrl ? [{ url: imageUrl, width: 800, height: 800, alt: product.name }] : [],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: imageUrl ? [imageUrl] : [],
    },
  };
}

// ──────────────────────────────────────────────
// Category page metadata
// ──────────────────────────────────────────────
export function getCategoryMetadata(category: WCCategory): Metadata {
  const title = `${category.name} – ${siteName}`;
  const description = category.description || `Shop ${category.name} products. Best prices with fast delivery across UAE.`;
  const canonical = `${siteUrl}/category/${category.slug}`;
  const imageUrl = category.image?.src;

  return {
    title,
    description,
    alternates: { canonical },
    openGraph: {
      title,
      description,
      url: canonical,
      type: "website",
      images: imageUrl ? [{ url: imageUrl, alt: category.name }] : [],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
    },
  };
}

// ──────────────────────────────────────────────
// Blog post metadata
// ──────────────────────────────────────────────
export function getPostMetadata(post: WPPost): Metadata {
  const title = post.yoast_head_json?.og_title ?? post.title.rendered;
  const description = post.yoast_head_json?.description ?? post.excerpt.rendered.replace(/<[^>]*>/g, "");
  const canonical = `${siteUrl}/blog/${post.slug}`;
  const featuredImage = post._embedded?.["wp:featuredmedia"]?.[0]?.source_url;

  return {
    title,
    description,
    alternates: { canonical },
    openGraph: {
      title,
      description,
      url: canonical,
      type: "article",
      publishedTime: post.date,
      modifiedTime: post.modified,
      images: featuredImage ? [{ url: featuredImage }] : [],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: featuredImage ? [featuredImage] : [],
    },
  };
}
