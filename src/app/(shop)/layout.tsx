import { getCachedNavMenus } from "@/lib/cache";
import { Header } from "@/components/layout/header/Header";
import { Footer } from "@/components/layout/Footer";

export const dynamic = "force-dynamic";

export default async function ShopLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const navMenus = await getCachedNavMenus();

  return (
    <div className="flex flex-col min-h-screen">
      <Header navItems={navMenus.primary} announcementEnabled={false} />
      <main className="flex-1">{children}</main>
      <Footer footerItems={navMenus.footer} />
    </div>
  );
}
