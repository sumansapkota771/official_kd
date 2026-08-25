import { mkdir, writeFile } from "node:fs/promises";
import { join } from "node:path";

/**
 * Where uploaded files go.
 *
 * Writing into `public/uploads` only ever worked on a developer's machine.
 * On Vercel the filesystem is read-only outside `/tmp`, so the write throws
 * EROFS — and even where it succeeds, Next serves `public/` from a snapshot
 * taken at build time, so a file written at runtime is never served. Both
 * failures point the same way: uploads belong in object storage.
 *
 * Supabase Storage is used when it is configured, and the local directory
 * remains the fallback so `next dev` works for anyone without credentials.
 * The two produce different URL shapes on purpose — an absolute Supabase URL
 * for new files, a relative `/uploads/...` path for the ones already
 * committed to the repo — which is what lets the existing content keep
 * resolving with no migration.
 */

const SUPABASE_URL = process.env.SUPABASE_URL?.replace(/\/+$/, "");
const SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;
const BUCKET = process.env.SUPABASE_STORAGE_BUCKET || "uploads";

export function storageConfigured(): boolean {
  return Boolean(SUPABASE_URL && SERVICE_KEY);
}

const MIME_BY_EXT: Record<string, string> = {
  webp: "image/webp",
  avif: "image/avif",
  png: "image/png",
  jpg: "image/jpeg",
  jpeg: "image/jpeg",
  gif: "image/gif",
  svg: "image/svg+xml",
};

export function mimeForExtension(ext: string): string {
  return MIME_BY_EXT[ext.toLowerCase()] ?? "application/octet-stream";
}

/**
 * Store one file and return the URL the site should reference.
 *
 * `filename` is expected to be collision-proof already (the callers mint a
 * random hex name), so the upload is sent with `x-upsert: false` — a name
 * that somehow repeats should fail loudly rather than quietly overwrite
 * somebody else's picture.
 */
export async function putUpload(
  filename: string,
  body: Buffer,
  contentType: string
): Promise<string> {
  if (storageConfigured()) {
    return putSupabase(filename, body, contentType);
  }
  return putLocal(filename, body);
}

async function putSupabase(
  filename: string,
  body: Buffer,
  contentType: string
): Promise<string> {
  const res = await fetch(
    `${SUPABASE_URL}/storage/v1/object/${BUCKET}/${filename}`,
    {
      method: "POST",
      headers: {
        authorization: `Bearer ${SERVICE_KEY}`,
        "content-type": contentType,
        // The name is random and the content never changes under it, so the
        // object is safe to cache for a year.
        "cache-control": "public, max-age=31536000, immutable",
        "x-upsert": "false",
      },
      // Buffer is a Uint8Array, which fetch accepts directly.
      body: new Uint8Array(body),
    }
  );

  if (!res.ok) {
    const detail = await res.text().catch(() => "");
    throw new Error(describeStorageFailure(res.status, detail));
  }

  return `${SUPABASE_URL}/storage/v1/object/public/${BUCKET}/${filename}`;
}

/**
 * Turns Supabase's terse storage errors into something an admin can act on.
 * The raw body is "new row violates row-level security policy" for a missing
 * bucket, which tells the reader nothing about what to go and fix.
 */
function describeStorageFailure(status: number, detail: string): string {
  if (status === 404 || /bucket not found/i.test(detail)) {
    return `storage bucket "${BUCKET}" does not exist. Create it in Supabase → Storage and mark it Public.`;
  }
  if (status === 401 || status === 403) {
    return "Supabase rejected the storage credentials. Check SUPABASE_SERVICE_ROLE_KEY is the service_role key, not the anon key.";
  }
  if (status === 409) {
    return "a file with that name already exists in storage.";
  }
  return `Supabase storage returned ${status}. ${detail.slice(0, 300)}`;
}

async function putLocal(filename: string, body: Buffer): Promise<string> {
  try {
    const dir = join(process.cwd(), "public", "uploads");
    await mkdir(dir, { recursive: true });
    await writeFile(join(dir, filename), body);
    return `/uploads/${filename}`;
  } catch (err) {
    if ((err as NodeJS.ErrnoException).code === "EROFS") {
      throw new Error(
        "this deployment has a read-only filesystem and no object storage configured. Set SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY, then redeploy."
      );
    }
    throw err;
  }
}
