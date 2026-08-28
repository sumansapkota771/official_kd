import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import {
  updateMedia,
  deleteMedia,
  replaceMediaFile,
  type MediaAsset,
} from "@/lib/media";
import { processUpload, UploadError } from "@/lib/uploads";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

async function requireAdmin(): Promise<boolean> {
  const session = await getSession();
  return Boolean(session && session.role === "admin");
}

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  if (!(await requireAdmin())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;
  const body = await request.json();
  const patch: Partial<Pick<MediaAsset, "alt" | "caption" | "focal_x" | "focal_y">> = {};

  if ("alt" in body) patch.alt = body.alt;
  if ("caption" in body) patch.caption = body.caption;
  if ("focal_x" in body) patch.focal_x = body.focal_x;
  if ("focal_y" in body) patch.focal_y = body.focal_y;

  const updated = await updateMedia(parseInt(id, 10), patch);
  if (!updated) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }
  return NextResponse.json(updated);
}

/**
 * Swaps the file behind an existing asset, keeping its id, alt text and
 * caption.
 *
 * A new URL comes back rather than the old one being overwritten in place:
 * stored filenames are random and immutable, which is what lets them be
 * cached for a year — and what stops a browser from showing the previous
 * picture after the swap.
 */
export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  if (!(await requireAdmin())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;
  try {
    const form = await request.formData();
    const file = form.get("file");
    if (!file || !(file instanceof File)) {
      return NextResponse.json({ error: "No file" }, { status: 400 });
    }

    const processed = await processUpload(file);
    const updated = await replaceMediaFile(parseInt(id, 10), {
      filename: processed.filename,
      original_name: processed.originalName,
      url: processed.url,
      mime_type: processed.mimeType,
      size_bytes: processed.sizeBytes,
      width: processed.width,
      height: processed.height,
    });
    if (!updated) return NextResponse.json({ error: "Not found" }, { status: 404 });
    return NextResponse.json(updated);
  } catch (err) {
    if (err instanceof UploadError) {
      return NextResponse.json({ error: err.message }, { status: 400 });
    }
    console.error("[media/replace]", err);
    return NextResponse.json({ error: (err as Error).message }, { status: 500 });
  }
}

export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  if (!(await requireAdmin())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;
  const deleted = await deleteMedia(parseInt(id, 10));
  if (!deleted) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }
  return NextResponse.json({ ok: true });
}
