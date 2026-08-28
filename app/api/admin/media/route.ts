import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { listMedia, getMediaCount, createMedia } from "@/lib/media";
import { processUpload, UploadError } from "@/lib/uploads";

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

  const url = new URL(request.url);
  const mime = url.searchParams.get("mime") || undefined;
  const q = url.searchParams.get("q") || undefined;
  const limit = Math.min(parseInt(url.searchParams.get("limit") || "50", 10), 100);
  const offset = Math.max(parseInt(url.searchParams.get("offset") || "0", 10), 0);

  try {
    const [items, total] = await Promise.all([
      listMedia({ mime, q, limit, offset }),
      getMediaCount({ mime, q }),
    ]);
    return NextResponse.json({ items, total, limit, offset });
  } catch (err) {
    console.error("[media/list]", err);
    return NextResponse.json({ error: (err as Error).message }, { status: 500 });
  }
}

/**
 * Adds a file to the library.
 *
 * Shares the content editor's pipeline, so the two ways of getting a picture
 * into the site accept exactly the same files at exactly the same size
 * limit — see `processUpload`.
 */
export async function POST(request: Request) {
  const session = await getSession();
  if (!session || session.role !== "admin") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const form = await request.formData();
    const file = form.get("file");
    if (!file || !(file instanceof File)) {
      return NextResponse.json({ error: "No file" }, { status: 400 });
    }

    const processed = await processUpload(file);

    const asset = await createMedia({
      filename: processed.filename,
      original_name: processed.originalName,
      url: processed.url,
      mime_type: processed.mimeType,
      size_bytes: processed.sizeBytes,
      width: processed.width,
      height: processed.height,
      alt: form.get("alt")?.toString() || "",
      caption: form.get("caption")?.toString() || "",
      uploaded_by: session.email,
    });

    return NextResponse.json(asset);
  } catch (err) {
    if (err instanceof UploadError) {
      return NextResponse.json({ error: err.message }, { status: 400 });
    }
    console.error("[media/upload]", err);
    const message = err instanceof Error ? err.message : "Upload failed";
    return NextResponse.json({ error: `Upload failed: ${message}` }, { status: 500 });
  }
}
