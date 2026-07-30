import { type NextRequest, NextResponse } from "next/server";
import { revalidateTag } from "next/cache";

export async function POST(request: NextRequest) {
  const body = await request.json().catch(() => ({}));
  const secret = request.headers.get("x-revalidation-secret");

  if (secret !== process.env.REVALIDATION_SECRET) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { tag } = body as { tag?: string; path?: string };

  if (tag) {
    revalidateTag(tag, "max");
    return NextResponse.json({ revalidated: true, tag });
  }

  // Revalidate all known tags
  const tags = ["products", "categories", "menus", "homepage", "blog"];
  for (const t of tags) {
    revalidateTag(t, "max");
  }

  return NextResponse.json({ revalidated: true, tags });
}
