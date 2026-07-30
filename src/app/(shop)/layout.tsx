import { getCachedNavMenus, getCachedCategories } from "@/lib/cache";
import { Header } from "@/components/layout/header/Header";
import { Footer } from "@/components/layout/Footer";
import type { NavItem } from "@/types/menu";

export const dynamic = "force-dynamic";

export default async function ShopLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [navMenus, categories] = await Promise.all([
    getCachedNavMenus(),
    getCachedCategories(),
  ]);

  // Fallback to top WooCommerce categories if WPGraphQL navigation menu is empty
  const categoryNavItems: NavItem[] = (categories || [])
    .filter((c) => c.parent === 0)
    .slice(0, 8)
    .map((c) => ({
      id: `cat-${c.id}`,
      label: c.name,
      url: `/category/${c.slug}`,
    }));

  const primaryItems =
    navMenus.primary && navMenus.primary.length > 0
      ? navMenus.primary
      : [
          { id: "all", label: "All Products", url: "/shop" },
          { id: "deals", label: "Flash Deals", url: "/shop?on_sale=true" },
          ...categoryNavItems,
        ];

  return (
    <div className="flex flex-col min-h-screen">
      <Header navItems={primaryItems} announcementEnabled={false} />
      <main className="flex-1">{children}</main>
      <Footer footerItems={navMenus.footer} />
    </div>
  );
}
