import Link from "next/link";
import Image from "next/image";
import { ArrowRight, Calendar, BookOpen } from "lucide-react";
import type { WPPost } from "@/types/blog";
import { formatDate, stripHtml } from "@/lib/utils";

interface LatestBlogSectionProps {
  posts: WPPost[];
}

export function LatestBlogSection({ posts }: LatestBlogSectionProps) {
  if (!posts || posts.length === 0) return null;

  // Take first 4 posts
  const displayPosts = posts.slice(0, 4);

  return (
    <section className="py-14 bg-gray-50/70 border-t border-gray-100" aria-label="Latest blog articles">
      <div className="container-shop">
        {/* Section Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-10">
          <div>
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-green-100 text-[#2E6F40] mb-2">
              <BookOpen className="w-3.5 h-3.5" /> Health & Beauty Journal
            </span>
            <h2 className="section-heading">Latest Advice & Articles</h2>
            <p className="section-subheading">Expert tips, skincare routines, and supplement guides from our pharmacists</p>
          </div>
          <Link
            href="/blog"
            className="inline-flex items-center gap-1.5 text-sm font-bold text-[#2E6F40] hover:text-[#166534] hover:gap-2.5 transition-all self-start sm:self-auto"
          >
            View All Articles
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        {/* 4 Columns Grid Layout */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {displayPosts.map((post) => {
            const media = post._embedded?.["wp:featuredmedia"]?.[0];
            const imageUrl = media?.source_url || "https://images.unsplash.com/photo-1620916566398-39f1143ab7be?w=800&auto=format&fit=crop&q=80";

            return (
              <article
                key={post.id}
                className="group bg-white rounded-2xl border border-gray-100 overflow-hidden shadow-xs hover:shadow-xl hover:-translate-y-1 hover:border-green-200 transition-all duration-300 flex flex-col"
              >
                {/* Thumbnail */}
                <Link href={`/blog/${post.slug}`} className="block relative aspect-[16/10] overflow-hidden bg-gray-100">
                  <Image
                    src={imageUrl}
                    alt={media?.alt_text || post.title.rendered}
                    fill
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute top-3 left-3">
                    <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold bg-white/90 backdrop-blur-sm text-[#2E6F40] shadow-xs">
                      <Calendar className="w-3 h-3" />
                      {formatDate(post.date)}
                    </span>
                  </div>
                </Link>

                {/* Content */}
                <div className="p-5 flex flex-col flex-1">
                  <Link href={`/blog/${post.slug}`}>
                    <h3 className="font-bold text-base text-gray-900 line-clamp-2 leading-snug group-hover:text-[#2E6F40] transition-colors mb-2">
                      {stripHtml(post.title.rendered)}
                    </h3>
                  </Link>
                  <p className="text-xs text-gray-500 line-clamp-3 leading-relaxed mb-4 flex-1">
                    {stripHtml(post.excerpt.rendered)}
                  </p>
                  <Link
                    href={`/blog/${post.slug}`}
                    className="inline-flex items-center gap-1 text-xs font-bold text-[#2E6F40] hover:text-[#166534] group-hover:gap-2 transition-all mt-auto"
                  >
                    Read Article
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
