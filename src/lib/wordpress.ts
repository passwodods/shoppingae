import axios from "axios";
import type { WPPost, WPPostsQuery, WPFAQItem } from "@/types/blog";

const wpRestUrl = process.env.NEXT_PUBLIC_WP_REST_URL ?? "https://your-wordpress.com/wp-json";

const MOCK_POSTS = [
  {
    id: 1,
    date: "2026-07-20T10:00:00",
    slug: "top-10-vitamin-c-serums-glowing-skin-uae",
    title: { rendered: "Top 10 Vitamin C Serums for Radiant Glowing Skin in UAE" },
    excerpt: { rendered: "Discover the best dermatologist-approved Vitamin C serums for sun damage repair, brightening, and collagen support in the Gulf climate.", protected: false },
    content: { rendered: "<p>Full article guide on Vitamin C skincare routines for Dubai summer weather...</p>", protected: false },
    _embedded: {
      "wp:featuredmedia": [
        {
          source_url: "https://images.unsplash.com/photo-1620916566398-39f1143ab7be?w=800&auto=format&fit=crop&q=80",
          alt_text: "Vitamin C Serums",
        },
      ],
    },
  },
  {
    id: 2,
    date: "2026-07-18T14:30:00",
    slug: "essential-daily-vitamins-active-lifestyle-dubai",
    title: { rendered: "Essential Daily Vitamins Every Active Adult Needs in Dubai" },
    excerpt: { rendered: "A comprehensive guide to Vitamin D3, Magnesium, Omega-3s, and B-Complex supplements for peak daily energy and immunity.", protected: false },
    content: { rendered: "<p>Learn how to optimize your daily vitamin intake for heat resilience and fitness goals...</p>", protected: false },
    _embedded: {
      "wp:featuredmedia": [
        {
          source_url: "https://images.unsplash.com/photo-1584017911766-d451b3d0e843?w=800&auto=format&fit=crop&q=80",
          alt_text: "Daily Vitamins",
        },
      ],
    },
  },
  {
    id: 3,
    date: "2026-07-15T09:15:00",
    slug: "how-to-choose-the-right-sunscreen-sensitive-skin",
    title: { rendered: "How to Choose the Right Sunscreen for Sensitive Skin" },
    excerpt: { rendered: "Physical vs Mineral sunscreens: What Mexoryl 400 filters mean and why SPF 50+ is non-negotiable in Middle East sunshine.", protected: false },
    content: { rendered: "<p>Dermatologist secrets to preventing sun spots, redness, and premature aging...</p>", protected: false },
    _embedded: {
      "wp:featuredmedia": [
        {
          source_url: "https://images.unsplash.com/photo-1598440947619-2c35fc9aa908?w=800&auto=format&fit=crop&q=80",
          alt_text: "Sunscreen Guide",
        },
      ],
    },
  },
  {
    id: 4,
    date: "2026-07-10T11:45:00",
    slug: "whey-protein-isolate-vs-concentrate-fitness-guide",
    title: { rendered: "Whey Protein Isolate vs Concentrate: Which Should You Buy?" },
    excerpt: { rendered: "Breakdown of absorption speed, lactose content, amino acid profiles, and muscle recovery benefits for gym-goers.", protected: false },
    content: { rendered: "<p>Everything you need to know before choosing your post-workout protein tub...</p>", protected: false },
    _embedded: {
      "wp:featuredmedia": [
        {
          source_url: "https://images.unsplash.com/photo-1579722821273-0f6c7d44362f?w=800&auto=format&fit=crop&q=80",
          alt_text: "Whey Protein Guide",
        },
      ],
    },
  },
];

// ──────────────────────────────────────────────
// Safe Posts Fetcher
// ──────────────────────────────────────────────
export async function getPosts(query: WPPostsQuery = {}): Promise<{
  posts: WPPost[];
  total: number;
  totalPages: number;
}> {
  try {
    const params: Record<string, unknown> = {
      _embed: "wp:featuredmedia,author,wp:term",
      per_page: query.per_page ?? 10,
      page: query.page ?? 1,
      status: "publish",
      orderby: query.orderby ?? "date",
      order: query.order ?? "desc",
    };

    if (query.search) params.search = query.search;
    if (query.categories) params.categories = query.categories;
    if (query.tags) params.tags = query.tags;

    const response = await axios.get<WPPost[]>(`${wpRestUrl}/wp/v2/posts`, { params, timeout: 4000 });

    return {
      posts: response.data,
      total: parseInt(response.headers["x-wp-total"] ?? `${response.data.length}`),
      totalPages: parseInt(response.headers["x-wp-totalpages"] ?? "1"),
    };
  } catch {
    const perPage = query.per_page ?? 4;
    const paginated = (MOCK_POSTS as unknown as WPPost[]).slice(0, perPage);
    return {
      posts: paginated,
      total: MOCK_POSTS.length,
      totalPages: 1,
    };
  }
}

export async function getPost(slug: string): Promise<WPPost | null> {
  try {
    const response = await axios.get<WPPost[]>(`${wpRestUrl}/wp/v2/posts`, {
      params: { slug, _embed: "wp:featuredmedia,author,wp:term" },
      timeout: 4000,
    });
    return response.data[0] ?? null;
  } catch {
    const found = (MOCK_POSTS as unknown as WPPost[]).find((p) => p.slug === slug);
    return found ?? (MOCK_POSTS[0] as unknown as WPPost) ?? null;
  }
}

export async function getPostCategories(): Promise<Array<{ id: number; name: string; slug: string; count: number }>> {
  try {
    const response = await axios.get(`${wpRestUrl}/wp/v2/categories`, {
      params: { per_page: 100, hide_empty: true },
      timeout: 4000,
    });
    return response.data;
  } catch {
    return [];
  }
}

export async function getFAQs(): Promise<WPFAQItem[]> {
  try {
    const response = await axios.get(`${wpRestUrl}/acf/v3/options/options`, {
      timeout: 4000,
    });
    const faqs = response.data?.acf?.faqs as WPFAQItem[] | undefined;
    return faqs ?? [];
  } catch {
    return [];
  }
}

export async function getWPPage(slug: string): Promise<{
  title: string;
  content: string;
  acf?: Record<string, unknown>;
} | null> {
  try {
    const response = await axios.get(`${wpRestUrl}/wp/v2/pages`, {
      params: { slug, status: "publish" },
      timeout: 4000,
    });
    const page = response.data[0];
    if (!page) return null;
    return {
      title: page.title?.rendered ?? "",
      content: page.content?.rendered ?? "",
      acf: page.acf ?? {},
    };
  } catch {
    return null;
  }
}

export async function getGlobalOptions() {
  try {
    const response = await axios.get(`${wpRestUrl}/acf/v3/options/options`, { timeout: 4000 });
    return response.data?.acf ?? {};
  } catch {
    return {};
  }
}
