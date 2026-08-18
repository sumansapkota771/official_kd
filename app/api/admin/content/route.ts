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
  // Support file uploads (multipart/form-data) through the content endpoint
  const contentType = request.headers.get("content-type") || "";
  if (contentType.includes("multipart/form-data")) {
    try {
      const form = await request.formData();
      const file = form.get("file") as File | null;
      if (!file) return NextResponse.json({ error: "file is required" }, { status: 400 });
      if (typeof file.size !== "number" || file.size === 0) {
        return NextResponse.json({ error: "Invalid file" }, { status: 400 });
      }
      const maxBytes = 6 * 1024 * 1024; // 6 MB
      if (file.size > maxBytes) {
        return NextResponse.json({ error: "File too large (max 6MB)" }, { status: 413 });
      }
      const mime = file.type || "";
      if (!mime.startsWith("image/")) {
        return NextResponse.json({ error: "Only image uploads are allowed" }, { status: 400 });
      }
      const buffer = Buffer.from(await file.arrayBuffer());
      const fs = await import("fs");
      const path = await import("path");
      const uploadsDir = path.join(process.cwd(), "public", "uploads");
      await fs.promises.mkdir(uploadsDir, { recursive: true });
      const safeName = `${Date.now()}-${String(file.name).replace(/[^a-zA-Z0-9._-]/g, "-")}`;
      const outPath = path.join(uploadsDir, safeName);
      await fs.promises.writeFile(outPath, buffer);
      const url = `/uploads/${safeName}`;
      return NextResponse.json({ url });
    } catch (err) {
      return NextResponse.json({ error: (err as Error).message }, { status: 500 });
    }
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
