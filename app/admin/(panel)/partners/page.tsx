import Link from "next/link";
import { EyeIcon } from "hugeicons-react";
import { getTypeCounts } from "@/lib/content/store";
import { getHomepageModule, getSitePage, type SiteModule } from "@/lib/content/site-map";
import { ModuleCard } from "@/components/admin/module-card";

export const dynamic = "force-dynamic";

/**
 * Everything partner-shaped, on one screen.
 *
 * There are four separate lists behind the word "partner" — the homepage
 * logo wall, the /partners wall, the benefit cards and the signed academic
 * agreements — and they were previously four unrelated entries scattered
 * through the content tree. Gathering them here is the difference between
 * knowing where to add a logo and guessing.
 *
 * The modules are pulled from the site map rather than restated, so the
 * lists shown here cannot drift from the ones the pages actually render.
 */
export default async function AdminPartnersPage() {
  const counts = await getTypeCounts();

  const partnersPage = getSitePage("partners");
  const modules: SiteModule[] = [
    getHomepageModule("hackathon-partners"),
    partnersPage?.modules.find((m) => m.key === "partners-list") ?? null,
    partnersPage?.modules.find((m) => m.key === "partners-benefits") ?? null,
    getHomepageModule("academia"),
  ].filter((m): m is SiteModule => Boolean(m));

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold text-text-primary">Partners</h1>
          <p className="mt-1 max-w-2xl text-sm text-text-muted">
            Every organisation the site names, wherever it appears. Logos are
            fitted inside equal cards automatically — upload any shape and it
            will not be stretched or cropped.
          </p>
        </div>
        <Link
          href="/partners"
          target="_blank"
          rel="noreferrer"
          className="focus-ring inline-flex h-10 shrink-0 items-center gap-2 rounded-full border border-border bg-background px-4 text-sm font-semibold text-text-secondary transition-colors hover:border-brand-blue hover:text-link"
        >
          <EyeIcon className="h-6 w-6" /> View partners page
        </Link>
      </div>

      <div className="flex flex-wrap gap-2">
        <Link
          href="/admin/content/page-hero/slug/partners"
          className="focus-ring inline-flex h-9 items-center rounded-full border border-border bg-background px-3.5 text-xs font-semibold text-text-secondary transition-colors hover:border-brand-blue hover:text-link"
        >
          Edit the /partners hero
        </Link>
        <Link
          href="/admin/content/page-seo/slug/partners"
          className="focus-ring inline-flex h-9 items-center rounded-full border border-border bg-background px-3.5 text-xs font-semibold text-text-secondary transition-colors hover:border-brand-blue hover:text-link"
        >
          Search listing
        </Link>
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        {modules.map((module) => (
          <ModuleCard key={module.key} module={module} counts={counts} />
        ))}
      </div>
    </div>
  );
}
