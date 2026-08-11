import { NextResponse } from "next/server";
import { listContent } from "@/lib/content/store";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const NAME_FIELDS: Record<string, string> = {
  solution: "name",
  course: "name",
  product: "name",
};

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const type = searchParams.get("type");
  if (!type || !NAME_FIELDS[type]) {
    return NextResponse.json({ items: [] });
  }
  try {
    const items = await listContent<Record<string, unknown>>(type);
    const nameField = NAME_FIELDS[type];
    return NextResponse.json({
      items: items.map((i) => ({
        slug: i.slug,
        name: (i.data[nameField] as string | undefined) ?? "",
      })),
    });
  } catch {
    return NextResponse.json({ items: [] });
  }
}
