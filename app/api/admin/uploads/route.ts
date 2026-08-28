import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { createMedia } from "@/lib/media";
import { processUpload, UploadError } from "@/lib/uploads";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/**
 * The upload endpoint the content editor posts to.
 *
 * Every image that comes through here is also recorded in the media library.
 * It previously was not, which meant a logo attached to a partner existed on
 * the site but was invisible in Media — so it could not be found, given alt
 * text, or reused on another row without uploading the same file again.
 * A failure to record is not fatal: the file is already stored and the field
 * needs its URL, and losing the upload over a bookkeeping row would be the
 * worse trade.
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
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }

    const processed = await processUpload(file);

    try {
      await createMedia({
        filename: processed.filename,
        original_name: processed.originalName,
        url: processed.url,
        mime_type: processed.mimeType,
        size_bytes: processed.sizeBytes,
        width: processed.width,
        height: processed.height,
        alt: form.get("alt")?.toString() || "",
        uploaded_by: session.email,
      });
    } catch (err) {
      console.warn("[upload] stored the file but could not record it in Media.", err);
    }

    return NextResponse.json({
      url: processed.url,
      bytes: processed.sizeBytes,
      originalBytes: processed.originalBytes,
    });
  } catch (err) {
    if (err instanceof UploadError) {
      return NextResponse.json({ error: err.message }, { status: 400 });
    }
    console.error("[upload]", err);
    const message = err instanceof Error ? err.message : "Upload failed";
    return NextResponse.json({ error: `Upload failed: ${message}` }, { status: 500 });
  }
}
