import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { getPosts, getPostCategories } from "@/lib/wordpress";
import { Pagination } from "@/components/ui/Pagination";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs";
import { formatDate, stripHtml } from "@/lib/utils";

export const metadata: Metadata = {
  title: "Blog",
  description: "Health, beauty, and wellness tips, guides, and news from ShopAE.",
};

export const revalidate = 600;

interface BlogPageProps {
  searchParams: Promise<{ page?: string; category?: string }>;
}

export default async function BlogPage({ searchParams }: BlogPageProps) {
  const sp = await searchParams;
  const page = parseInt(sp.page ?? "1");

  const { posts, total, totalPages } = await getPosts({ page, per_page: 9, categories: sp.category });

  return (
    <div className="container-shop py-8">
      <Breadcrumbs items={[{ label: "Blog" }]} className="mb-6" />

      <div className="mb-8">
        <h1 className="section-heading">Health & Beauty Blog</h1>
        <p className="section-subheading">Expert tips, guides, and wellness advice</p>
      </div>

      {posts.length > 0 ? (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-10">
            {posts.map((post) => {
              const featuredImage = post._embedded?.["wp:featuredmedia"]?.[0];
              const author = post._embedded?.author?.[0];
              return (
                <article key={post.id} className="card card-hover group overflow-hidden">
                  {featuredImage && (
                    <div className="aspect-video overflow-hidden">
                      <Image
                        src={featuredImage.source_url}
                        alt={featuredImage.alt_text || post.title.rendered}
                        width={featuredImage.media_details?.width ?? 600}
                        height={featuredImage.media_details?.height ?? 340}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                    </div>
                  )}
                  <div className="p-5">
                    <p className="text-xs text-[#2E6F40] font-semibold mb-2">{formatDate(post.date)}</p>
                    <Link href={`/blog/${post.slug}`}>
                      <h2 className="font-bold text-gray-900 leading-snug mb-2 line-clamp-2 group-hover:text-[#2E6F40] transition-colors"
                          dangerouslySetInnerHTML={{ __html: post.title.rendered }} />
                    </Link>
                    <p className="text-sm text-gray-500 line-clamp-2 mb-4">
                      {stripHtml(post.excerpt.rendered)}
                    </p>
                    <div className="flex items-center justify-between">
                      {author && (
                        <p className="text-xs text-gray-400">By {author.name}</p>
                      )}
                      <Link href={`/blog/${post.slug}`} className="text-sm font-semibold text-[#2E6F40] hover:underline">
                        Read More →
                      </Link>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>

          {totalPages > 1 && (
            <Pagination
              currentPage={page}
              totalPages={totalPages}
              basePath="/blog"
              searchParams={sp as Record<string, string>}
            />
          )}
        </>
      ) : (
        <div className="text-center py-24">
          <p className="text-6xl mb-4">📝</p>
          <h2 className="text-xl font-bold text-gray-900 mb-2">No posts yet</h2>
          <p className="text-gray-500">Check back soon for health & beauty articles.</p>
        </div>
      )}
    </div>
  );
}
