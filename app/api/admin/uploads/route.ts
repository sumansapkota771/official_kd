import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { writeFile, mkdir } from "fs/promises";
import { join } from "path";
import { randomBytes } from "crypto";
import sharp from "sharp";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

async function requireAdmin(): Promise<boolean> {
  const session = await getSession();
  return Boolean(session && session.role === "admin");
}

/** Generous, because a phone or camera frame is routinely 8-25 MB. What
 *  actually lands on disk is far smaller — everything raster is re-encoded
 *  below before it is written. */
const MAX_UPLOAD = 25 * 1024 * 1024;

/** Longest edge kept. 2400 still covers a full-bleed banner on a 2x display. */
const MAX_EDGE = 2400;

/** Formats stored byte-for-byte: re-encoding a vector rasterises it, and
 *  re-encoding a GIF through the still pipeline drops the animation. */
const PASSTHROUGH = new Set(["svg", "gif"]);

/** AVIF that this libvips build cannot decode is still fine in a browser, so
 *  it is stored untouched rather than refused. */
function isAvif(buf: Buffer): boolean {
  return (
    buf.length > 12 &&
    buf.toString("ascii", 4, 8) === "ftyp" &&
    /avif|avis/.test(buf.toString("ascii", 8, 12))
  );
}

function mb(bytes: number): string {
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

export async function POST(request: Request) {
  if (!(await requireAdmin())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const form = await request.formData();
    const file = form.get("file");
    if (!file || !(file instanceof File)) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }

    if (file.size > MAX_UPLOAD) {
      return NextResponse.json(
        { error: `That image is ${mb(file.size)}. The limit is ${mb(MAX_UPLOAD)} — try exporting it smaller.` },
        { status: 400 }
      );
    }

    const input = Buffer.from(await file.arrayBuffer());

    /* The browser's reported MIME type is not used as the gate. It arrives
       empty or plainly wrong for plenty of real files — HEIC straight off an
       iPhone, screenshots pasted from some tools, anything with an unusual
       extension — and the old allowlist rejected all of those. Whether the
       bytes actually decode as an image is the honest test, so sharp does the
       deciding. */
    let output: Buffer;
    let ext: string;
    try {
      const meta = await sharp(input).metadata();
      const format = meta.format ?? "";

      if (PASSTHROUGH.has(format)) {
        output = input;
        ext = format;
      } else {
        /* `rotate()` with no argument bakes in the EXIF orientation before
           the pixels are resized — without it, portrait phone photos land
           sideways. Re-encoding also drops the rest of the EXIF block, so
           camera GPS coordinates do not get published with the picture. */
        output = await sharp(input)
          .rotate()
          .resize({
            width: MAX_EDGE,
            height: MAX_EDGE,
            fit: "inside",
            withoutEnlargement: true,
          })
          .webp({ quality: 82 })
          .toBuffer();
        ext = "webp";
      }
    } catch {
      if (isAvif(input)) {
        output = input;
        ext = "avif";
      } else {
        return NextResponse.json(
          {
            error: `That file could not be read as an image (${file.type || "unknown type"}, ${mb(file.size)}). JPEG, PNG, WebP, HEIC, TIFF, GIF, AVIF and SVG all work.`,
          },
          { status: 400 }
        );
      }
    }

    const filename = `${randomBytes(8).toString("hex")}.${ext}`;
    const uploadsDir = join(process.cwd(), "public", "uploads");
    await mkdir(uploadsDir, { recursive: true });
    await writeFile(join(uploadsDir, filename), output);

    return NextResponse.json({
      url: `/uploads/${filename}`,
      bytes: output.length,
      originalBytes: file.size,
    });
  } catch (err) {
    console.error("[upload]", err);
    const message = err instanceof Error ? err.message : "Upload failed";
    return NextResponse.json({ error: `Upload failed: ${message}` }, { status: 500 });
  }
}
