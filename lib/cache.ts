const cache = new Map<string, { data: unknown; expires: number }>();

export function cached<T>(key: string, ttlMs: number, fn: () => Promise<T>): Promise<T> {
  const now = Date.now();
  const hit = cache.get(key);
  if (hit && hit.expires > now) {
    return Promise.resolve(hit.data as T);
  }
  return fn().then((data) => {
    cache.set(key, { data, expires: now + ttlMs });
    return data;
  });
}

export function invalidateCache(prefix?: string) {
  if (!prefix) {
    cache.clear();
    return;
  }
  for (const key of cache.keys()) {
    if (key.startsWith(prefix)) cache.delete(key);
  }
}

/** TTL constants (ms) */
export const TTL = {
  /** Frequently-changing content (homepage, articles) */
  SHORT: 30_000,
  /** Mostly static content (team, capabilities, values) */
  MEDIUM: 120_000,
  /** Near-static content (schema, settings) */
  LONG: 300_000,
} as const;
