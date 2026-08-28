import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { getSchema, slugify } from "@/lib/content/schemas";
import { revalidatePublicRoutes } from "@/lib/content/revalidate";
import { processUpload, UploadError } from "@/lib/uploads";
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
  /* Uploads posted here go through the same pipeline as everywhere else.
     This branch used to write straight into `public/uploads`, which fails on
     any read-only deployment and, where it succeeds, is served from a
     build-time snapshot that will never contain the file. */
  const contentType = request.headers.get("content-type") || "";
  if (contentType.includes("multipart/form-data")) {
    try {
      const form = await request.formData();
      const file = form.get("file");
      if (!file || !(file instanceof File)) {
        return NextResponse.json({ error: "file is required" }, { status: 400 });
      }
      const processed = await processUpload(file);
      try {
        const { createMedia } = await import("@/lib/media");
        await createMedia({
          filename: processed.filename,
          original_name: processed.originalName,
          url: processed.url,
          mime_type: processed.mimeType,
          size_bytes: processed.sizeBytes,
          width: processed.width,
          height: processed.height,
        });
      } catch (err) {
        console.warn("[content] stored the file but could not record it in Media.", err);
      }
      return NextResponse.json({ url: processed.url });
    } catch (err) {
      const status = err instanceof UploadError ? 400 : 500;
      return NextResponse.json({ error: (err as Error).message }, { status });
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
