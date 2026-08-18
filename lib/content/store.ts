import { db } from "@/lib/db";
import { ensureSchema } from "@/lib/db/schema";
import {
  CONTENT_GROUPS,
  CONTENT_SCHEMAS,
  getSchema,
  type ContentItem,
  type ContentSchema,
  type SeedRow,
} from "@/lib/content/schemas";

type Row = {
  id: number;
  type: string;
  slug: string | null;
  data: unknown;
  position: number;
  published: boolean;
  created_at: Date;
  updated_at: Date;
};

function mapRow<T>(row: Row): ContentItem<T> {
  return {
    id: row.id,
    type: row.type,
    slug: row.slug,
    data: (typeof row.data === "string" ? JSON.parse(row.data) : row.data) as T,
    position: row.position,
    published: row.published,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

function fallbackItems<T>(schema: ContentSchema): ContentItem<T>[] {
  const rows = schema.fallback?.() ?? [];
  return rows.map((r, i) => ({
    id: 0,
    type: schema.type,
    slug: r.slug,
    data: r.data as T,
    position: i,
    published: true,
    createdAt: new Date(),
    updatedAt: new Date(),
  }));
}

function logFallback(type: string, err: unknown) {
  console.warn(`[content] "${type}" not readable from DB, using fallback data.`, err);
}

// Serverless Postgres occasionally refuses the first connection of a session
// (paused project waking up, cold TLS handshake). Admin writes are idempotent
// (UPDATE by id / ON CONFLICT upsert), so retrying once after a connection
// timeout is safe and turns a hard "connection timeout" failure into a no-op.
function isConnectionTimeout(err: unknown): boolean {
  const message = (err instanceof Error ? err.message : String(err)).toLowerCase();
  return message.includes("timeout") || message.includes("etimedout") || message.includes("econnreset");
}

async function retryOnTimeout<T>(fn: () => Promise<T>): Promise<T> {
  try {
    return await fn();
  } catch (err) {
    if (isConnectionTimeout(err)) {
      await new Promise((resolve) => setTimeout(resolve, 1_500));
      return fn();
    }
    throw err;
  }
}

// ---------------------------------------------------------------------------
// Seeding
// ---------------------------------------------------------------------------

const seeding = new Map<string, Promise<void>>();

async function insertRows(schema: ContentSchema, rows: SeedRow[]): Promise<void> {
  for (let i = 0; i < rows.length; i += 1) {
    await db.query(
      `INSERT INTO content_items (type, slug, data, position, published)
       VALUES ($1, $2, $3, $4, true)
       ON CONFLICT (type, slug) DO NOTHING`,
      [schema.type, rows[i].slug, JSON.stringify(rows[i].data), i]
    );
  }
}

function ensureSeeded(schema: ContentSchema): Promise<void> {
  if (!schema.fallback) return Promise.resolve();
  const fallback = schema.fallback;
  const existing = seeding.get(schema.type);
  if (existing) return existing;
  const promise = (async () => {
    await ensureSchema();
    const res = await db.query<{ count: number }>(
      "SELECT count(*)::int AS count FROM content_items WHERE type = $1",
      [schema.type]
    );
    if (res.rows[0]?.count === 0) {
      await insertRows(schema, fallback());
    }
  })().catch((err) => {
    seeding.delete(schema.type);
    throw err;
  });
  seeding.set(schema.type, promise);
  return promise;
}

export async function seedContent(type?: string): Promise<{ type: string; inserted: number }[]> {
  await ensureSchema();
  const schemas = CONTENT_SCHEMAS.filter(
    (s) => s.fallback && (!type || s.type === type)
  );
  const results: { type: string; inserted: number }[] = [];
  for (const schema of schemas) {
    const fallback = schema.fallback as () => SeedRow[];
    const before = await db.query<{ count: number }>(
      "SELECT count(*)::int AS count FROM content_items WHERE type = $1",
      [schema.type]
    );
    const beforeCount = before.rows[0]?.count ?? 0;
    await insertRows(schema, fallback());
    const after = await db.query<{ count: number }>(
      "SELECT count(*)::int AS count FROM content_items WHERE type = $1",
      [schema.type]
    );
    results.push({
      type: schema.type,
      inserted: Math.max(0, (after.rows[0]?.count ?? 0) - beforeCount),
    });
  }
  return results;
}

// ---------------------------------------------------------------------------
// Reads
// ---------------------------------------------------------------------------

export async function listContent<T = Record<string, unknown>>(
  type: string,
  opts: { publishedOnly?: boolean } = {}
): Promise<ContentItem<T>[]> {
  const schema = getSchema(type);
  const publishedOnly = opts.publishedOnly !== false;
  try {
    await ensureSeeded(schema);
    const res = await db.query<Row>(
      "SELECT * FROM content_items WHERE type = $1 ORDER BY position ASC, id ASC",
      [type]
    );
    let items = res.rows.map((r) => mapRow<T>(r));
    if (publishedOnly) items = items.filter((i) => i.published);
    return items;
  } catch (err) {
    logFallback(type, err);
    let items = fallbackItems<T>(schema);
    if (publishedOnly) items = items.filter((i) => i.published);
    return items;
  }
}

export async function getContentBySlug<T = Record<string, unknown>>(
  type: string,
  slug: string
): Promise<ContentItem<T> | null> {
  const schema = getSchema(type);
  try {
    await ensureSeeded(schema);
    const res = await db.query<Row>(
      "SELECT * FROM content_items WHERE type = $1 AND slug = $2 AND published = true LIMIT 1",
      [type, slug]
    );
    if (res.rows[0]) return mapRow<T>(res.rows[0]);
    const fallbackRow = schema.fallback?.().find((r) => r.slug === slug);
    if (fallbackRow) {
      return {
        id: 0,
        type: schema.type,
        slug: fallbackRow.slug,
        data: fallbackRow.data as T,
        position: 0,
        published: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      };
    }
    return null;
  } catch (err) {
    logFallback(type, err);
    const fallbackRow = schema.fallback?.().find((r) => r.slug === slug);
    if (!fallbackRow) return null;
    return {
      id: 0,
      type: schema.type,
      slug: fallbackRow.slug,
      data: fallbackRow.data as T,
      position: 0,
      published: true,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
  }
}

export async function getSingleton<T = Record<string, unknown>>(
  type: string
): Promise<ContentItem<T> | null> {
  const schema = getSchema(type);
  try {
    await ensureSeeded(schema);
    const res = await db.query<Row>(
      "SELECT * FROM content_items WHERE type = $1 ORDER BY position ASC, id ASC LIMIT 1",
      [type]
    );
    if (res.rows[0]) return mapRow<T>(res.rows[0]);
    return null;
  } catch (err) {
    logFallback(type, err);
    const fallbackRow = schema.fallback?.()[0];
    if (!fallbackRow) return null;
    return {
      id: 0,
      type: schema.type,
      slug: fallbackRow.slug,
      data: fallbackRow.data as T,
      position: 0,
      published: true,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
  }
}

export async function getSingletonData<T = Record<string, unknown>>(
  type: string
): Promise<T | null> {
  const item = await getSingleton<T>(type);
  if (item) return item.data;
  const schema = getSchema(type);
  const fallback = schema.fallback?.()[0];
  return (fallback?.data as T) ?? null;
}

// ---------------------------------------------------------------------------
// Writes (admin only)
// ---------------------------------------------------------------------------

export async function listContentRaw<T = Record<string, unknown>>(
  type: string
): Promise<ContentItem<T>[]> {
  const schema = getSchema(type);
  try {
    await ensureSeeded(schema);
    const res = await db.query<Row>(
      "SELECT * FROM content_items WHERE type = $1 ORDER BY position ASC, id ASC",
      [type]
    );
    return res.rows.map((r) => mapRow<T>(r));
  } catch (err) {
    logFallback(type, err);
    return fallbackItems<T>(schema);
  }
}

export async function saveContent(input: {
  id?: number;
  type: string;
  slug: string;
  data: Record<string, unknown>;
  published?: boolean;
  position?: number;
}): Promise<ContentItem> {
  await ensureSchema();
  const slug = input.slug.trim();
  if (!slug) throw new Error("Slug is required");
  const published = input.published ?? true;

  return retryOnTimeout(async () => {
    if (input.id) {
      const res = await db.query<Row>(
        `UPDATE content_items
         SET slug = $1, data = $2, published = $3, updated_at = now()
         WHERE id = $4
         RETURNING *`,
        [slug, JSON.stringify(input.data), published, input.id]
      );
      if (!res.rows[0]) throw new Error("Content item not found");
      return mapRow(res.rows[0]);
    }

    const positionRes = await db.query<{ pos: number }>(
      "SELECT COALESCE(MAX(position), -1) + 1 AS pos FROM content_items WHERE type = $1",
      [input.type]
    );
    const position = input.position ?? positionRes.rows[0].pos;
    const res = await db.query<Row>(
      `INSERT INTO content_items (type, slug, data, position, published)
       VALUES ($1, $2, $3, $4, $5)
       ON CONFLICT (type, slug) DO UPDATE SET
         data = EXCLUDED.data,
         published = EXCLUDED.published,
         position = EXCLUDED.position,
         updated_at = now()
       RETURNING *`,
      [input.type, slug, JSON.stringify(input.data), position, published]
    );
    return mapRow(res.rows[0]);
  });
}

export async function deleteContentItem(id: number): Promise<void> {
  await ensureSchema();
  await retryOnTimeout(() =>
    db.query("DELETE FROM content_items WHERE id = $1", [id]).then(() => undefined)
  );
}

export async function setContentPublished(id: number, published: boolean): Promise<void> {
  await ensureSchema();
  await retryOnTimeout(() =>
    db
      .query("UPDATE content_items SET published = $1, updated_at = now() WHERE id = $2", [
        published,
        id,
      ])
      .then(() => undefined)
  );
}

export async function reorderContent(type: string, orderedIds: number[]): Promise<void> {
  await ensureSchema();
  await retryOnTimeout(async () => {
    for (let i = 0; i < orderedIds.length; i += 1) {
      await db.query(
        "UPDATE content_items SET position = $1, updated_at = now() WHERE id = $2 AND type = $3",
        [i, orderedIds[i], type]
      );
    }
  });
}

export async function getTypeSummary(): Promise<
  {
    type: string;
    label: string;
    singular: string;
    isSingleton: boolean;
    group: string;
    count: number;
    publishedCount: number;
  }[]
> {
  const ordered: { type: string; group: string }[] = [];
  for (const g of CONTENT_GROUPS) {
    for (const t of g.types) ordered.push({ type: t, group: g.group });
  }
  const known = new Set(ordered.map((o) => o.type));
  for (const s of CONTENT_SCHEMAS) {
    if (!known.has(s.type)) ordered.push({ type: s.type, group: "Other" });
  }

  try {
    await ensureSchema();
    await Promise.all(CONTENT_SCHEMAS.filter((s) => s.fallback).map(ensureSeeded));
    const res = await db.query<{ type: string; count: number; publishedCount: number }>(
      `SELECT type, count(*)::int AS count,
              count(*) FILTER (WHERE published)::int AS publishedCount
       FROM content_items GROUP BY type`
    );
    const byType = new Map(res.rows.map((r) => [r.type, r]));
    return ordered.map(({ type, group }) => {
      const schema = getSchema(type);
      const row = byType.get(type);
      return {
        type,
        label: schema.label,
        singular: schema.singular,
        isSingleton: schema.isSingleton ?? false,
        group,
        count: row?.count ?? 0,
        publishedCount: row?.publishedCount ?? 0,
      };
    });
  } catch (err) {
    logFallback("summary", err);
    return ordered.map(({ type, group }) => {
      const schema = getSchema(type);
      const count = schema.fallback?.().length ?? 0;
      return {
        type,
        label: schema.label,
        singular: schema.singular,
        isSingleton: schema.isSingleton ?? false,
        group,
        count,
        publishedCount: count,
      };
    });
  }
}
