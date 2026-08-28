import Link from "next/link";
import { EyeIcon } from "hugeicons-react";
import { listContentRaw, getTypeCounts } from "@/lib/content/store";
import { getHomepageModule, HOMEPAGE_MODULES } from "@/lib/content/site-map";
import { resolveParts } from "@/lib/content/admin-modules";
import {
  HomepageManager,
  type ManagerSection,
} from "@/components/admin/homepage-manager";

export const dynamic = "force-dynamic";

type SectionRow = { type?: string; label?: string; enabled?: boolean };

/**
 * The homepage screen — every band of the front page, in the order it is
 * served, with its own content one click away.
 *
 * The list comes from the `home-section` rows rather than from the module
 * registry, because those rows *are* the running order: reading the registry
 * would show the shipped order and quietly disagree with the live site the
 * moment anyone dragged anything.
 *
 * A section the database has never heard of is folded back in at the end, so
 * a band added to the site in a deploy is manageable here immediately rather
 * than after someone remembers to press Seed.
 */
export default async function AdminHomepagePage() {
  const [rows, counts] = await Promise.all([
    listContentRaw<SectionRow>("home-section"),
    getTypeCounts(),
  ]);

  const sections: ManagerSection[] = rows.map((row) => {
    const key = row.data.type ?? row.slug ?? "";
    const module = getHomepageModule(key);
    return {
      id: row.id,
      slug: row.slug ?? key,
      key,
      // The module's own name wins over the stored label: the stored one is
      // a copy made when the row was seeded, and it is the module registry
      // that gets renamed when a section is renamed.
      label: module?.label ?? row.data.label ?? key,
      description: module?.description ?? "No matching section is registered for this row.",
      preview: module?.preview ?? "/",
      locked: Boolean(module?.locked),
      enabled: row.data.enabled !== false,
      parts: module ? resolveParts(module.parts, counts) : [],
      unknown: !module,
    };
  });

  const known = new Set(sections.map((s) => s.key));
  const missing = HOMEPAGE_MODULES.filter((m) => !known.has(m.key));

  const visible = sections.filter((s) => s.enabled).length;

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold text-text-primary">Homepage</h1>
          <p className="mt-1 max-w-2xl text-sm text-text-muted">
            {sections.length} section{sections.length === 1 ? "" : "s"}, {visible} visible.
            Drag a card to change the order on the live page. Everything inside a
            section is one click from here.
          </p>
        </div>
        <Link
          href="/"
          target="_blank"
          rel="noreferrer"
          className="focus-ring inline-flex h-10 items-center gap-2 rounded-full border border-border bg-background px-4 text-sm font-semibold text-text-secondary transition-colors hover:border-brand-blue hover:text-link"
        >
          <EyeIcon className="h-6 w-6" /> View homepage
        </Link>
      </div>

      {sections.length === 0 ? (
        <p className="card p-6 text-sm text-text-muted">
          No homepage sections are recorded yet. They are created automatically on
          the first request to the site — reload this page, or open{" "}
          <Link href="/admin/content/home-section" className="font-semibold text-link hover:underline">
            All content → Homepage sections
          </Link>
          .
        </p>
      ) : (
        <HomepageManager sections={sections} />
      )}

      {missing.length > 0 && (
        <p className="rounded-xl border-[0.5px] border-border bg-background-secondary px-4 py-3 text-sm text-text-muted">
          Not currently on the page:{" "}
          {missing.map((m) => m.label).join(", ")}. These were removed from the
          running order — add them back from{" "}
          <Link href="/admin/content/home-section" className="font-semibold text-link hover:underline">
            All content → Homepage sections
          </Link>
          .
        </p>
      )}
    </div>
  );
}
