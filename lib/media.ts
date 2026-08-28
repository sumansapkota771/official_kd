import { db } from "@/lib/db";
import { ensureSchema } from "@/lib/db/schema";

export interface MediaAsset {
  id: number;
  filename: string;
  original_name: string;
  url: string;
  mime_type: string;
  size_bytes: number;
  width: number | null;
  height: number | null;
  alt: string;
  caption: string;
  focal_x: number;
  focal_y: number;
  uploaded_by: string | null;
  created_at: string;
}

/**
 * The filter both the list and the count run, built once.
 *
 * Keeping them in one place is what stops "showing 12 of 40" from being a
 * lie: the two queries used to build their own WHERE clauses, so adding a
 * search term to one without the other would have paged through a filtered
 * list using an unfiltered total.
 */
function mediaFilter(opts: { mime?: string; q?: string }): {
  where: string;
  params: unknown[];
} {
  const conditions: string[] = [];
  const params: unknown[] = [];

  if (opts.mime) {
    params.push(`${opts.mime}%`);
    conditions.push(`mime_type LIKE $${params.length}`);
  }
  if (opts.q?.trim()) {
    // Matched against the original filename, the alt text and the caption:
    // an admin looking for a picture remembers what is *in* it far more
    // often than what the file was called.
    params.push(`%${opts.q.trim()}%`);
    const p = `$${params.length}`;
    conditions.push(`(original_name ILIKE ${p} OR alt ILIKE ${p} OR caption ILIKE ${p})`);
  }

  return {
    where: conditions.length ? `WHERE ${conditions.join(" AND ")}` : "",
    params,
  };
}

export async function listMedia(opts?: {
  mime?: string;
  q?: string;
  limit?: number;
  offset?: number;
}): Promise<MediaAsset[]> {
  await ensureSchema();
  const { where, params } = mediaFilter(opts ?? {});
  const limit = opts?.limit ?? 50;
  const offset = opts?.offset ?? 0;

  const { rows } = await db.query(
    `SELECT * FROM media_assets ${where} ORDER BY created_at DESC LIMIT $${params.length + 1} OFFSET $${params.length + 2}`,
    [...params, limit, offset]
  );
  return rows as MediaAsset[];
}

export async function getMediaCount(opts?: { mime?: string; q?: string }): Promise<number> {
  await ensureSchema();
  const { where, params } = mediaFilter(opts ?? {});
  const { rows } = await db.query(
    `SELECT count(*)::int as c FROM media_assets ${where}`,
    params
  );
  return rows[0]?.c ?? 0;
}

export async function createMedia(asset: {
  filename: string;
  original_name: string;
  url: string;
  mime_type: string;
  size_bytes: number;
  width?: number;
  height?: number;
  alt?: string;
  caption?: string;
  focal_x?: number;
  focal_y?: number;
  uploaded_by?: string;
}): Promise<MediaAsset> {
  await ensureSchema();
  const { rows } = await db.query(
    `INSERT INTO media_assets (filename, original_name, url, mime_type, size_bytes, width, height, alt, caption, focal_x, focal_y, uploaded_by)
     VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12) RETURNING *`,
    [
      asset.filename,
      asset.original_name,
      asset.url,
      asset.mime_type,
      asset.size_bytes,
      asset.width ?? null,
      asset.height ?? null,
      asset.alt ?? "",
      asset.caption ?? "",
      asset.focal_x ?? 0.5,
      asset.focal_y ?? 0.5,
      asset.uploaded_by ?? null,
    ]
  );
  return rows[0] as MediaAsset;
}

export async function updateMedia(
  id: number,
  patch: Partial<Pick<MediaAsset, "alt" | "caption" | "focal_x" | "focal_y">>
): Promise<MediaAsset | null> {
  await ensureSchema();
  const sets: string[] = [];
  const params: unknown[] = [];
  let idx = 1;

  for (const [key, val] of Object.entries(patch)) {
    if (val !== undefined) {
      sets.push(`${key} = $${idx++}`);
      params.push(val);
    }
  }
  if (sets.length === 0) return null;
  params.push(id);

  const { rows } = await db.query(
    `UPDATE media_assets SET ${sets.join(", ")} WHERE id = $${idx} RETURNING *`,
    params
  );
  return (rows[0] as MediaAsset) ?? null;
}

/**
 * Point an existing asset at a new file.
 *
 * Replacing rather than re-uploading is the whole point: everything already
 * referencing this asset keeps working, and the alt text written for it
 * survives. The URL changes because the stored filename is random and
 * immutable — which is also what stops a browser from serving the old
 * picture from cache after the swap.
 */
export async function replaceMediaFile(
  id: number,
  file: {
    filename: string;
    original_name: string;
    url: string;
    mime_type: string;
    size_bytes: number;
    width?: number;
    height?: number;
  }
): Promise<MediaAsset | null> {
  await ensureSchema();
  const { rows } = await db.query(
    `UPDATE media_assets
        SET filename = $1, original_name = $2, url = $3, mime_type = $4,
            size_bytes = $5, width = $6, height = $7
      WHERE id = $8
      RETURNING *`,
    [
      file.filename,
      file.original_name,
      file.url,
      file.mime_type,
      file.size_bytes,
      file.width ?? null,
      file.height ?? null,
      id,
    ]
  );
  return (rows[0] as MediaAsset) ?? null;
}

export async function getMedia(id: number): Promise<MediaAsset | null> {
  await ensureSchema();
  const { rows } = await db.query(`SELECT * FROM media_assets WHERE id = $1`, [id]);
  return (rows[0] as MediaAsset) ?? null;
}

export async function deleteMedia(id: number): Promise<boolean> {
  await ensureSchema();
  const { rowCount } = await db.query(`DELETE FROM media_assets WHERE id = $1`, [id]);
  return (rowCount ?? 0) > 0;
}
