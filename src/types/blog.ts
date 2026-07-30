// ============================================================
// WordPress Post / Blog Types
// ============================================================

export interface WPPost {
  id: number;
  slug: string;
  status: string;
  title: { rendered: string };
  content: { rendered: string; protected: boolean };
  excerpt: { rendered: string; protected: boolean };
  author: number;
  featured_media: number;
  categories: number[];
  tags: number[];
  date: string;
  modified: string;
  link: string;
  yoast_head_json?: import("./product").YoastSEO;
  _embedded?: {
    author?: Array<{ name: string; avatar_urls: Record<string, string> }>;
    "wp:featuredmedia"?: Array<{
      source_url: string;
      alt_text: string;
      media_details?: {
        width: number;
        height: number;
        sizes: Record<string, { source_url: string; width: number; height: number }>;
      };
    }>;
    "wp:term"?: Array<Array<{ id: number; name: string; slug: string }>>;
  };
}

export interface WPPage {
  id: number;
  slug: string;
  status: string;
  title: { rendered: string };
  content: { rendered: string; protected: boolean };
  excerpt: { rendered: string; protected: boolean };
  parent: number;
  menu_order: number;
  link: string;
  date: string;
  modified: string;
  yoast_head_json?: import("./product").YoastSEO;
  acf?: Record<string, unknown>;
  template: string;
}

export interface WPFAQItem {
  question: string;
  answer: string;
  category?: string;
}

export interface WPContactInfo {
  email: string;
  phone: string;
  address: string;
  working_hours: string;
  map_embed_url?: string;
}

export interface WPPostsQuery {
  page?: number;
  per_page?: number;
  orderby?: "date" | "id" | "title" | "relevance" | "menu_order";
  order?: "asc" | "desc";
  search?: string;
  categories?: string | number;
  tags?: string;
  status?: string;
}
