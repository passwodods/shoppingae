import { GraphQLClient } from "graphql-request";

// ──────────────────────────────────────────────
// WPGraphQL client
// ──────────────────────────────────────────────
export const graphqlClient = new GraphQLClient(
  process.env.NEXT_PUBLIC_GRAPHQL_URL ?? "https://your-wordpress.com/graphql",
  {
    headers: {
      "Content-Type": "application/json",
    },
  }
);

// ──────────────────────────────────────────────
// Navigation / Menus
// ──────────────────────────────────────────────
const GET_MENUS = `
  query GetMenus {
    menus {
      nodes {
        id
        databaseId
        name
        slug
        locations
        menuItems(first: 100) {
          nodes {
            id
            databaseId
            label
            url
            target
            cssClasses
            parentId
            connectedNode {
              node {
                ... on Page {
                  slug
                  uri
                }
                ... on Category {
                  slug
                  uri
                }
                ... on ProductCategory {
                  slug
                  uri
                }
              }
            }
          }
        }
      }
    }
  }
`;

export async function getMenus() {
  try {
    const data = await graphqlClient.request<{
      menus: { nodes: import("@/types/menu").Menu[] };
    }>(GET_MENUS);
    return data.menus.nodes;
  } catch (error) {
    console.error("[GraphQL] getMenus error:", error);
    return [];
  }
}

// ──────────────────────────────────────────────
// Homepage ACF fields
// ──────────────────────────────────────────────
const GET_HOMEPAGE = `
  query GetHomepage {
    page(id: "/", idType: URI) {
      id
      title
      acfHomepage {
        heroSlides {
          title
          subtitle
          buttonText
          buttonUrl
          badgeText
          textColor
          backgroundColor
          image {
            sourceUrl
            altText
            mediaDetails {
              width
              height
            }
          }
          mobileImage {
            sourceUrl
            altText
          }
        }
        promoBanners {
          title
          subtitle
          buttonText
          buttonUrl
          style
          backgroundColor
          image {
            sourceUrl
            altText
            mediaDetails {
              width
              height
            }
          }
        }
        sectionFeaturedTitle
        sectionFeaturedSubtitle
        sectionBestsellersTitle
        sectionNewarrivalsTitle
        sectionBrandsTitle
        brandLogos {
          name
          link
          logo {
            sourceUrl
            altText
          }
        }
        newsletterTitle
        newsletterSubtitle
        trustBadges {
          icon
          title
          subtitle
        }
      }
    }
    globalOptions: page(id: "/global-options/", idType: URI) {
      acfGlobal {
        announcementEnabled
        announcementMessages {
          text
          linkText
          linkUrl
        }
        announcementBgColor
        announcementTextColor
        freeShippingThreshold
      }
    }
  }
`;

export async function getHomepageData() {
  try {
    const data = await graphqlClient.request<{
      page: {
        id: string;
        title: string;
        acfHomepage: Record<string, unknown>;
      };
      globalOptions: {
        acfGlobal: Record<string, unknown>;
      } | null;
    }>(GET_HOMEPAGE);
    return data;
  } catch (error) {
    console.error("[GraphQL] getHomepageData error:", error);
    return null;
  }
}

// ──────────────────────────────────────────────
// SEO (Yoast via WPGraphQL Yoast SEO addon)
// ──────────────────────────────────────────────
const GET_PAGE_SEO = `
  query GetPageSEO($id: ID!) {
    page(id: $id, idType: DATABASE_ID) {
      seo {
        title
        metaDesc
        canonical
        opengraphTitle
        opengraphDescription
        opengraphImage {
          sourceUrl
          mediaDetails { width height }
        }
        twitterTitle
        twitterDescription
        twitterImage {
          sourceUrl
        }
        schema {
          raw
        }
      }
    }
  }
`;

export async function getPageSEO(databaseId: number) {
  try {
    const data = await graphqlClient.request<{
      page: { seo: Record<string, unknown> };
    }>(GET_PAGE_SEO, { id: databaseId });
    return data.page?.seo ?? null;
  } catch {
    return null;
  }
}

// ──────────────────────────────────────────────
// Build hierarchical menu tree
// ──────────────────────────────────────────────
export function buildMenuTree(items: import("@/types/menu").MenuItem[]): import("@/types/menu").NavItem[] {
  const map = new Map<string, import("@/types/menu").NavItem>();
  const roots: import("@/types/menu").NavItem[] = [];

  // First pass: create all items
  for (const item of items) {
    map.set(item.id, {
      id: item.id,
      label: item.label,
      url: item.url,
      slug: item.connectedNode?.node?.slug,
      cssClasses: item.cssClasses,
      children: [],
    });
  }

  // Second pass: build tree
  for (const item of items) {
    const node = map.get(item.id)!;
    if (item.parentId && map.has(item.parentId)) {
      const parent = map.get(item.parentId)!;
      parent.children = parent.children ?? [];
      parent.children.push(node);
    } else {
      roots.push(node);
    }
  }

  return roots;
}
