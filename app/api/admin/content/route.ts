import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import {
  deleteContentItem,
  listContentRaw,
  saveContent,
  setContentPublished,
} from "@/lib/content/store";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

async function requireAdmin(): Promise<boolean> {
  const session = await getSession();
  return Boolean(session && session.role === "admin");
}

export async function GET(request: Request) {
  if (!(await requireAdmin())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const { searchParams } = new URL(request.url);
  const type = searchParams.get("type");
  if (!type) {
    return NextResponse.json({ error: "type is required" }, { status: 400 });
  }
  try {
    const items = await listContentRaw(type);
    return NextResponse.json({
      items: items.map((i) => ({ ...i, createdAt: i.createdAt.toISOString(), updatedAt: i.updatedAt.toISOString() })),
    });
  } catch (err) {
    return NextResponse.json({ error: (err as Error).message }, { status: 500 });
  }
}

export async function POST(request: Request) {
  if (!(await requireAdmin())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  try {
    const body = (await request.json()) as {
      id?: number;
      type: string;
      slug: string;
      data?: Record<string, unknown>;
      published?: boolean;
    };
    if (!body.type || typeof body.slug !== "string" || !body.slug.trim()) {
      return NextResponse.json({ error: "type and slug are required" }, { status: 400 });
    }
    const item = await saveContent({
      id: body.id,
      type: body.type,
      slug: body.slug,
      data: body.data ?? {},
      published: body.published ?? true,
    });
    return NextResponse.json({ item: { ...item, createdAt: item.createdAt.toISOString(), updatedAt: item.updatedAt.toISOString() } });
  } catch (err) {
    return NextResponse.json({ error: (err as Error).message }, { status: 500 });
  }
}

export async function PATCH(request: Request) {
  if (!(await requireAdmin())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  try {
    const body = (await request.json()) as { id?: number; published?: boolean };
    if (!body.id || typeof body.published !== "boolean") {
      return NextResponse.json({ error: "id and published are required" }, { status: 400 });
    }
    await setContentPublished(body.id, body.published);
    return NextResponse.json({ ok: true });
  } catch (err) {
    return NextResponse.json({ error: (err as Error).message }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  if (!(await requireAdmin())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const { searchParams } = new URL(request.url);
  const id = Number(searchParams.get("id"));
  if (!id) {
    return NextResponse.json({ error: "id is required" }, { status: 400 });
  }
  try {
    await deleteContentItem(id);
    return NextResponse.json({ ok: true });
  } catch (err) {
    return NextResponse.json({ error: (err as Error).message }, { status: 500 });
  }
}
