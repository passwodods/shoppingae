import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { getWPPage } from "@/lib/wordpress";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const page = await getWPPage(slug);
  if (!page) return { title: "Page Not Found" };

  return {
    title: `${page.title} | ShopAE`,
    description: page.title,
  };
}

export default async function DynamicWPPage({ params }: PageProps) {
  const { slug } = await params;
  const page = await getWPPage(slug);

  if (!page) notFound();

  return (
    <div className="bg-white py-12">
      <div className="container-shop max-w-4xl">
        {/* Page Title */}
        <h1 className="text-3xl sm:text-4xl font-extrabold text-gray-900 mb-8 border-b border-gray-100 pb-4">
          {page.title}
        </h1>

        {/* Page HTML Content from WordPress */}
        <div
          className="prose prose-green max-w-none text-gray-700 leading-relaxed text-sm sm:text-base space-y-4"
          dangerouslySetInnerHTML={{ __html: page.content }}
        />
      </div>
    </div>
  );
}
