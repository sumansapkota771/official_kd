import { randomBytes } from "crypto";
import sharp from "sharp";
import { mimeForExtension, putUpload } from "@/lib/storage";

/** Generous, because a phone or camera frame is routinely 8-25 MB. What
 *  actually lands in storage is far smaller — everything raster is
 *  re-encoded below before it is written. */
export const MAX_UPLOAD = 25 * 1024 * 1024;

/** Longest edge kept. 2400 still covers a full-bleed banner on a 2x display. */
const MAX_EDGE = 2400;

/** Formats stored byte-for-byte: re-encoding a vector rasterises it, and
 *  re-encoding a GIF through the still pipeline drops the animation. */
const PASSTHROUGH = new Set(["svg", "gif"]);

export type ProcessedUpload = {
  filename: string;
  originalName: string;
  url: string;
  mimeType: string;
  sizeBytes: number;
  width?: number;
  height?: number;
  originalBytes: number;
};

export class UploadError extends Error {}

/** AVIF that this libvips build cannot decode is still fine in a browser, so
 *  it is stored untouched rather than refused. */
function isAvif(buf: Buffer): boolean {
  return (
    buf.length > 12 &&
    buf.toString("ascii", 4, 8) === "ftyp" &&
    /avif|avis/.test(buf.toString("ascii", 8, 12))
  );
}

export function mb(bytes: number): string {
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

/**
 * Normalise one uploaded image and put it in storage.
 *
 * Shared by both upload endpoints so that a picture attached to a content
 * field and a picture added straight to the media library go through
 * exactly the same door — same size limit, same re-encoding, same accepted
 * formats. They used to differ: the library refused anything over 5 MB and
 * anything the *browser* mislabelled, which meant a HEIC photo from an
 * iPhone worked in one place and failed in the other for no reason a person
 * could see.
 *
 * The browser's reported MIME type is deliberately not the gate. It arrives
 * empty or plainly wrong for plenty of real files; whether the bytes decode
 * as an image is the honest test, so sharp does the deciding.
 */
export async function processUpload(file: File): Promise<ProcessedUpload> {
  if (file.size > MAX_UPLOAD) {
    throw new UploadError(
      `That image is ${mb(file.size)}. The limit is ${mb(MAX_UPLOAD)} — try exporting it smaller.`
    );
  }

  const input = Buffer.from(await file.arrayBuffer());

  let output: Buffer;
  let ext: string;
  let width: number | undefined;
  let height: number | undefined;

  try {
    const meta = await sharp(input).metadata();
    const format = meta.format ?? "";

    if (PASSTHROUGH.has(format)) {
      output = input;
      ext = format;
      width = meta.width;
      height = meta.height;
    } else {
      /* `rotate()` with no argument bakes in the EXIF orientation before the
         pixels are resized — without it, portrait phone photos land
         sideways. Re-encoding also drops the rest of the EXIF block, so
         camera GPS coordinates do not get published with the picture. */
      const result = await sharp(input)
        .rotate()
        .resize({ width: MAX_EDGE, height: MAX_EDGE, fit: "inside", withoutEnlargement: true })
        .webp({ quality: 82 })
        .toBuffer({ resolveWithObject: true });
      output = result.data;
      ext = "webp";
      width = result.info.width;
      height = result.info.height;
    }
  } catch {
    if (isAvif(input)) {
      output = input;
      ext = "avif";
    } else {
      throw new UploadError(
        `That file could not be read as an image (${file.type || "unknown type"}, ${mb(file.size)}). JPEG, PNG, WebP, HEIC, TIFF, GIF, AVIF and SVG all work.`
      );
    }
  }

  const mimeType = mimeForExtension(ext);
  const filename = `${randomBytes(8).toString("hex")}.${ext}`;
  const url = await putUpload(filename, output, mimeType);

  return {
    filename,
    originalName: file.name || filename,
    url,
    mimeType,
    sizeBytes: output.length,
    width,
    height,
    originalBytes: file.size,
  };
}
