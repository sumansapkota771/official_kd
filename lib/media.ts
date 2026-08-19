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

export async function listMedia(opts?: {
  mime?: string;
  limit?: number;
  offset?: number;
}): Promise<MediaAsset[]> {
  await ensureSchema();
  const conditions: string[] = [];
  const params: unknown[] = [];
  let idx = 1;

  if (opts?.mime) {
    conditions.push(`mime_type LIKE $${idx++}`);
    params.push(`${opts.mime}%`);
  }

  const where = conditions.length ? `WHERE ${conditions.join(" AND ")}` : "";
  const limit = opts?.limit ?? 50;
  const offset = opts?.offset ?? 0;

  const { rows } = await db.query(
    `SELECT * FROM media_assets ${where} ORDER BY created_at DESC LIMIT $${idx++} OFFSET $${idx++}`,
    [...params, limit, offset]
  );
  return rows as MediaAsset[];
}

export async function getMediaCount(mime?: string): Promise<number> {
  await ensureSchema();
  if (mime) {
    const { rows } = await db.query(
      `SELECT count(*)::int as c FROM media_assets WHERE mime_type LIKE $1`,
      [`${mime}%`]
    );
    return rows[0]?.c ?? 0;
  }
  const { rows } = await db.query(`SELECT count(*)::int as c FROM media_assets`);
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

export async function deleteMedia(id: number): Promise<boolean> {
  await ensureSchema();
  const { rowCount } = await db.query(`DELETE FROM media_assets WHERE id = $1`, [id]);
  return (rowCount ?? 0) > 0;
}
