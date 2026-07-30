// ============================================================
// ACF (Advanced Custom Fields) Types for Homepage / Global fields
// ============================================================

export interface ACFHeroSlide {
  title: string;
  subtitle: string;
  button_text: string;
  button_url: string;
  badge_text?: string;
  image: {
    url: string;
    alt: string;
    width: number;
    height: number;
  };
  mobile_image?: {
    url: string;
    alt: string;
    width: number;
    height: number;
  };
  background_color?: string;
  text_color?: "light" | "dark";
}

export interface ACFPromoBanner {
  title: string;
  subtitle?: string;
  button_text?: string;
  button_url?: string;
  image: {
    url: string;
    alt: string;
    width: number;
    height: number;
  };
  style?: "full" | "half" | "third";
  background_color?: string;
}

export interface ACFCategoryHighlight {
  category_id: number;
  custom_title?: string;
  custom_image?: {
    url: string;
    alt: string;
  };
  background_color?: string;
}

export interface ACFAnnouncementBar {
  enabled: boolean;
  messages: Array<{
    text: string;
    link_text?: string;
    link_url?: string;
  }>;
  background_color: string;
  text_color: string;
}

export interface ACFHomepageFields {
  hero_slides: ACFHeroSlide[];
  promo_banners: ACFPromoBanner[];
  featured_categories: ACFCategoryHighlight[];
  section_featured_title: string;
  section_featured_subtitle?: string;
  section_bestsellers_title: string;
  section_newarrivals_title: string;
  section_brands_title: string;
  brand_logos: Array<{
    name: string;
    logo: { url: string; alt: string };
    link?: string;
  }>;
  newsletter_title: string;
  newsletter_subtitle: string;
  trust_badges: Array<{
    icon: string;
    title: string;
    subtitle: string;
  }>;
}

export interface ACFFooterFields {
  about_text: string;
  social_links: Array<{
    platform: "facebook" | "instagram" | "twitter" | "youtube" | "tiktok" | "snapchat";
    url: string;
  }>;
  footer_columns: Array<{
    title: string;
    links: Array<{
      label: string;
      url: string;
    }>;
  }>;
  contact_info: {
    phone: string;
    email: string;
    address: string;
    working_hours: string;
  };
  payment_methods: Array<{
    name: string;
    logo: { url: string; alt: string };
  }>;
  copyright_text: string;
}

export interface ACFGlobalOptions {
  announcement_bar: ACFAnnouncementBar;
  header_phone: string;
  whatsapp_number?: string;
  free_shipping_threshold: number;
  currency_code: string;
  currency_symbol: string;
}
