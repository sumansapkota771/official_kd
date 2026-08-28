import { db } from "@/lib/db";

/**
 * One-time fixes to content that is already in the database.
 *
 * Seed data only ever runs for a row that does not exist yet — that is what
 * stops a deploy from overwriting everything an admin has typed. The cost is
 * that changing a shipped default does nothing to a site that has been
 * running: edit the seed for the phone number and the live site keeps the
 * old one forever, because its row was written months ago.
 *
 * These migrations close that gap for the handful of values that genuinely
 * had to change. Each one is guarded twice: it runs once ever (recorded in
 * `content_migrations`), and it only rewrites a row that still holds the
 * exact value it shipped with. An admin who had already edited that field
 * keeps their edit — the migration finds nothing to match and does nothing.
 */

type Migration = {
  id: string;
  describe: string;
  run: () => Promise<void>;
};

/**
 * Replace one key inside a row's JSON, but only where it still equals the
 * value being replaced.
 *
 * `jsonb_set` rather than rewriting `data` wholesale: the rows carry other
 * fields (an href beside a value, a tone beside a title) and a full
 * overwrite would silently drop whatever the migration did not know about.
 */
async function replaceField(
  type: string,
  slug: string,
  key: string,
  from: string,
  to: string
): Promise<void> {
  await db.query(
    `UPDATE content_items
        SET data = jsonb_set(data, ARRAY[$4], to_jsonb($5::text), true),
            updated_at = now()
      WHERE type = $1 AND slug = $2 AND data->>$4 = $3`,
    [type, slug, from, key, to]
  );
}

const MIGRATIONS: Migration[] = [
  {
    id: "2026-08-contact-phone-and-hours",
    describe: "Point the phone number at 9851362001 and the hours at 10:00–18:00.",
    run: async () => {
      await replaceField("contact-detail", "phone", "value", "+977 9842863398", "9851362001");
      await replaceField("contact-detail", "phone", "href", "tel:+9779842863398", "tel:+9779851362001");
      await replaceField(
        "contact-detail",
        "hours",
        "value",
        "9:00 AM – 7:00 PM, Sun–Fri",
        "10:00 AM – 6:00 PM"
      );
      await replaceField("contact-detail", "hours", "label", "Hours", "Office Hours");
    },
  },
  {
    id: "2026-08-partners-heading",
    describe: 'Rename the homepage partner wall to "Trusted By Leading Organizations".',
    run: async () => {
      await replaceField(
        "section-heading",
        "hackathon-partners",
        "title",
        "The organisations behind the hackathon",
        "Trusted By Leading Organizations"
      );
      await replaceField("section-heading", "hackathon-partners", "title", "Our Partners", "Trusted By Leading Organizations");
      await replaceField("section-heading", "hackathon-partners", "eyebrow", "Hackathon Partners", "Partners");
      await replaceField("section-heading", "hackathon-partners", "eyebrow", "Our Partners", "Partners");
    },
  },
];

/**
 * Runs whatever has not run yet.
 *
 * A failing migration is logged and skipped rather than thrown: it is
 * cosmetic content maintenance, and taking the whole site down because one
 * `UPDATE` could not find its table would be a far worse outcome than a
 * stale phone number. It is not recorded as applied, so the next boot
 * retries it.
 */
export async function runContentMigrations(): Promise<void> {
  await db.query(`
    CREATE TABLE IF NOT EXISTS content_migrations (
      id text PRIMARY KEY,
      applied_at timestamptz NOT NULL DEFAULT now()
    );
  `);

  const { rows } = await db.query<{ id: string }>("SELECT id FROM content_migrations");
  const applied = new Set(rows.map((r) => r.id));

  for (const migration of MIGRATIONS) {
    if (applied.has(migration.id)) continue;
    try {
      await migration.run();
      await db.query(
        "INSERT INTO content_migrations (id) VALUES ($1) ON CONFLICT (id) DO NOTHING",
        [migration.id]
      );
    } catch (err) {
      console.warn(`[content] migration "${migration.id}" failed; will retry next boot.`, err);
    }
  }
}
