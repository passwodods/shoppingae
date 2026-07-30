import axios from "axios";
import type { WPPost, WPPostsQuery, WPFAQItem } from "@/types/blog";

const wpRestUrl = process.env.NEXT_PUBLIC_WP_REST_URL ?? "https://your-wordpress.com/wp-json";

export async function getPosts(query: WPPostsQuery = {}): Promise<{
  posts: WPPost[];
  total: number;
  totalPages: number;
}> {
  try {
    const response = await axios.get<WPPost[]>(`${wpRestUrl}/wp/v2/posts`, {
      params: {
        per_page: 10,
        _embed: "wp:featuredmedia,author,wp:term",
        status: "publish",
        ...query,
      },
      timeout: 4000,
    });

    return {
      posts: response.data,
      total: parseInt(response.headers["x-wp-total"] ?? `${response.data.length}`),
      totalPages: parseInt(response.headers["x-wp-totalpages"] ?? "1"),
    };
  } catch {
    return {
      posts: [],
      total: 0,
      totalPages: 0,
    };
  }
}

export async function getPost(slug: string): Promise<WPPost | null> {
  try {
    const response = await axios.get<WPPost[]>(`${wpRestUrl}/wp/v2/posts`, {
      params: { slug, status: "publish", _embed: "wp:featuredmedia,author,wp:term" },
      timeout: 4000,
    });
    return response.data[0] ?? null;
  } catch {
    return null;
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

export async function getACFFaqs(): Promise<WPFAQItem[]> {
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

export const getFAQs = getACFFaqs;

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
