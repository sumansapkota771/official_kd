import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { getSchema, slugify } from "@/lib/content/schemas";
import { revalidatePublicRoutes } from "@/lib/content/revalidate";
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
      const maxBytes = 5 * 1024 * 1024; // 5 MB — matches media upload limit
      if (file.size > maxBytes) {
        return NextResponse.json({ error: "File too large (max 5MB)" }, { status: 413 });
      }
      const mime = file.type || "";
      if (!mime.startsWith("image/")) {
        return NextResponse.json({ error: "Only image uploads are allowed" }, { status: 400 });
      }
      const buffer = Buffer.from(await file.arrayBuffer());
      const fs = await import("fs");
      const path = await import("path");
      const { randomBytes } = await import("crypto");
      const uploadsDir = path.join(process.cwd(), "public", "uploads");
      await fs.promises.mkdir(uploadsDir, { recursive: true });
      const id = randomBytes(8).toString("hex");
      const ext = file.name.split(".").pop() || "bin";
      const safeName = `${id}.${ext}`;
      const outPath = path.join(uploadsDir, safeName);
      await fs.promises.writeFile(outPath, buffer);
      const url = `/uploads/${safeName}`;

      const { createMedia } = await import("@/lib/media");
      await createMedia({
        filename: safeName,
        original_name: file.name,
        url,
        mime_type: mime,
        size_bytes: file.size,
      });

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
    if (body.data !== undefined && (typeof body.data !== "object" || Array.isArray(body.data) || body.data === null)) {
      return NextResponse.json({ error: "data must be a plain object" }, { status: 400 });
    }
    /* Creating over an existing slug used to be silent data loss: the insert
       is an `ON CONFLICT (type, slug) DO UPDATE`, so a second "image-1"
       replaced the first with no warning. Singletons are supposed to upsert
       onto their fixed slug, so only they keep that behaviour. */
    if (!body.id) {
      let isSingleton = false;
      try {
        isSingleton = Boolean(getSchema(body.type).isSingleton);
      } catch {
        return NextResponse.json({ error: `Unknown content type: ${body.type}` }, { status: 400 });
      }
      if (!isSingleton) {
        const wanted = slugify(body.slug);
        const existing = await listContentRaw(body.type);
        if (existing.some((i) => i.slug === wanted)) {
          return NextResponse.json(
            { error: `An item with the slug "${wanted}" already exists. Choose a different slug.` },
            { status: 409 }
          );
        }
      }
    }

    const item = await saveContent({
      id: body.id,
      type: body.type,
      slug: body.slug,
      data: body.data ?? {},
      published: body.published ?? true,
    });
    revalidatePublicRoutes();
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
    revalidatePublicRoutes();
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
    revalidatePublicRoutes();
    return NextResponse.json({ ok: true });
  } catch (err) {
    return NextResponse.json({ error: (err as Error).message }, { status: 500 });
  }
}
