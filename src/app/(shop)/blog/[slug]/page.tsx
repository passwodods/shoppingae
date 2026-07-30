import { notFound } from "next/navigation";
import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { getPost } from "@/lib/wordpress";
import { getPostMetadata } from "@/lib/metadata";
import { articleSchema, breadcrumbSchema } from "@/lib/structured-data";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs";
import { formatDate, stripHtml } from "@/lib/utils";

interface BlogPostPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: BlogPostPageProps): Promise<Metadata> {
  const { slug } = await params;
  const post = await getPost(slug);
  if (!post) return { title: "Post Not Found" };
  return getPostMetadata(post);
}

export const revalidate = 600;

export default async function BlogPostPage({ params }: BlogPostPageProps) {
  const { slug } = await params;
  const post = await getPost(slug);
  if (!post) notFound();

  const author = post._embedded?.author?.[0];
  const featuredImage = post._embedded?.["wp:featuredmedia"]?.[0];
  const categories = post._embedded?.["wp:term"]?.[0] ?? [];

  const breadcrumbItems = [
    { label: "Blog", href: "/blog" },
    { label: stripHtml(post.title.rendered) },
  ];

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema(post)) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(breadcrumbSchema(breadcrumbItems.map((i) => ({
            name: i.label,
            url: i.href ?? `/blog/${slug}`,
          })))),
        }}
      />

      <article className="container-shop py-8 max-w-4xl mx-auto">
        <Breadcrumbs items={breadcrumbItems} className="mb-6" />

        {/* Meta */}
        <div className="mb-6 flex items-center flex-wrap gap-3 text-sm text-gray-500">
          {categories.map((cat: { id: number; name: string; slug: string }) => (
            <Link
              key={cat.id}
              href={`/blog?category=${cat.id}`}
              className="badge badge-primary"
            >
              {cat.name}
            </Link>
          ))}
          <span>·</span>
          <time dateTime={post.date}>{formatDate(post.date)}</time>
          {author && <>
            <span>·</span>
            <span>By {author.name}</span>
          </>}
        </div>

        {/* Title */}
        <h1
          className="text-3xl sm:text-4xl font-extrabold text-gray-900 leading-tight mb-6"
          dangerouslySetInnerHTML={{ __html: post.title.rendered }}
        />

        {/* Featured image */}
        {featuredImage && (
          <div className="relative aspect-video w-full rounded-2xl overflow-hidden mb-8">
            <Image
              src={featuredImage.source_url}
              alt={featuredImage.alt_text || stripHtml(post.title.rendered)}
              fill
              priority
              sizes="(max-width: 768px) 100vw, 800px"
              className="object-cover"
            />
          </div>
        )}

        {/* Content */}
        <div
          className="prose prose-gray prose-lg max-w-none
            prose-headings:font-bold prose-headings:text-gray-900
            prose-a:text-[#2E6F40] prose-a:no-underline hover:prose-a:underline
            prose-img:rounded-xl prose-blockquote:border-[#2E6F40]"
          dangerouslySetInnerHTML={{ __html: post.content.rendered }}
        />

        {/* Footer */}
        <div className="mt-10 pt-6 border-t border-gray-100 flex items-center gap-4">
          <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center">
            <span className="text-[#2E6F40] font-bold text-sm">
              {author?.name?.[0] ?? "A"}
            </span>
          </div>
          <div>
            <p className="font-semibold text-gray-900">{author?.name ?? "ShopAE Team"}</p>
            <p className="text-xs text-gray-500">Published {formatDate(post.date)}</p>
          </div>
        </div>

        <div className="mt-8">
          <Link href="/blog" className="btn-secondary">
            ← Back to Blog
          </Link>
        </div>
      </article>
    </>
  );
}
