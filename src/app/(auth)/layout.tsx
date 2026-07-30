import { Header } from "@/components/layout/header/Header";
import { Footer } from "@/components/layout/Footer";
import { getCachedNavMenus } from "@/lib/cache";

export const dynamic = "force-dynamic";

export default async function AuthLayout({ children }: { children: React.ReactNode }) {
  const navMenus = await getCachedNavMenus();
  return (
    <div className="flex flex-col min-h-screen">
      <Header navItems={navMenus.primary} />
      <main className="flex-1 bg-gray-50/60">{children}</main>
      <Footer footerItems={navMenus.footer} />
    </div>
  );
}
