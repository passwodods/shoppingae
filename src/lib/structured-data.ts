import type { WCProduct, WCCategory, WCReview } from "@/types/product";
import type { WPFAQItem, WPPost } from "@/types/blog";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://your-nextjs-site.com";
const siteName = process.env.NEXT_PUBLIC_SITE_NAME ?? "ShopAE";

// ──────────────────────────────────────────────
// Organization schema (add to root layout)
// ──────────────────────────────────────────────
export function organizationSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: siteName,
    url: siteUrl,
    logo: `${siteUrl}/logo.png`,
    sameAs: [],
    contactPoint: {
      "@type": "ContactPoint",
      contactType: "customer service",
      availableLanguage: "English",
    },
  };
}

// ──────────────────────────────────────────────
// Website / Sitelinks Searchbox
// ──────────────────────────────────────────────
export function websiteSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: siteName,
    url: siteUrl,
    potentialAction: {
      "@type": "SearchAction",
      target: {
        "@type": "EntryPoint",
        urlTemplate: `${siteUrl}/search?q={search_term_string}`,
      },
      "query-input": "required name=search_term_string",
    },
  };
}

// ──────────────────────────────────────────────
// Product schema
// ──────────────────────────────────────────────
export function productSchema(product: WCProduct, reviews?: WCReview[]) {
  const imageUrls = product.images.map((img) => img.src);
  const reviewData = reviews?.map((r) => ({
    "@type": "Review",
    reviewRating: {
      "@type": "Rating",
      ratingValue: r.rating,
      bestRating: 5,
    },
    author: { "@type": "Person", name: r.reviewer },
    reviewBody: r.review,
    datePublished: r.date_created,
  }));

  const schema: Record<string, unknown> = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.name,
    description: product.short_description.replace(/<[^>]*>/g, ""),
    sku: product.sku,
    image: imageUrls,
    url: `${siteUrl}/product/${product.slug}`,
    offers: {
      "@type": "Offer",
      url: `${siteUrl}/product/${product.slug}`,
      priceCurrency: process.env.NEXT_PUBLIC_CURRENCY ?? "AED",
      price: parseFloat(product.price) || 0,
      availability:
        product.stock_status === "instock"
          ? "https://schema.org/InStock"
          : product.stock_status === "onbackorder"
          ? "https://schema.org/BackOrder"
          : "https://schema.org/OutOfStock",
      seller: { "@type": "Organization", name: siteName },
    },
    brand: product.acf?.brand
      ? { "@type": "Brand", name: product.acf.brand }
      : undefined,
  };

  if (reviews && reviews.length > 0) {
    schema.aggregateRating = {
      "@type": "AggregateRating",
      ratingValue: parseFloat(product.average_rating),
      reviewCount: product.rating_count,
      bestRating: 5,
      worstRating: 1,
    };
    schema.review = reviewData;
  }

  return schema;
}

// ──────────────────────────────────────────────
// Breadcrumb schema
// ──────────────────────────────────────────────
export function breadcrumbSchema(
  items: Array<{ name: string; url: string }>
) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: item.url.startsWith("http") ? item.url : `${siteUrl}${item.url}`,
    })),
  };
}

// ──────────────────────────────────────────────
// FAQ schema
// ──────────────────────────────────────────────
export function faqSchema(faqs: WPFAQItem[]) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((faq) => ({
      "@type": "Question",
      name: faq.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: faq.answer.replace(/<[^>]*>/g, ""),
      },
    })),
  };
}

// ──────────────────────────────────────────────
// Article / Blog Post schema
// ──────────────────────────────────────────────
export function articleSchema(post: WPPost) {
  const author = post._embedded?.author?.[0];
  const featuredImage = post._embedded?.["wp:featuredmedia"]?.[0]?.source_url;

  return {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: post.title.rendered,
    description: post.excerpt.rendered.replace(/<[^>]*>/g, ""),
    datePublished: post.date,
    dateModified: post.modified,
    url: `${siteUrl}/blog/${post.slug}`,
    image: featuredImage ? [featuredImage] : [],
    author: author
      ? { "@type": "Person", name: author.name }
      : { "@type": "Organization", name: siteName },
    publisher: {
      "@type": "Organization",
      name: siteName,
      logo: { "@type": "ImageObject", url: `${siteUrl}/logo.png` },
    },
  };
}

// ──────────────────────────────────────────────
// Category schema
// ──────────────────────────────────────────────
export function categorySchema(category: WCCategory) {
  return {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: category.name,
    description: category.description || "",
    url: `${siteUrl}/category/${category.slug}`,
    image: category.image?.src,
  };
}
