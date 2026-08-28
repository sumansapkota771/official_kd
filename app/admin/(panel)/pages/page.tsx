import Link from "next/link";
import { ArrowRight01Icon, EyeIcon, File01Icon } from "hugeicons-react";
import { getTypeCounts } from "@/lib/content/store";
import { moduleTypes } from "@/lib/content/admin-modules";
import { SITE_PAGES } from "@/lib/content/site-map";

export const dynamic = "force-dynamic";

/**
 * Every page on the site, as a page.
 *
 * The list is the site map itself, so a page added to the registry appears
 * here without another admin screen being written — which is the point of
 * having a registry rather than a folder of hand-built dashboards.
 */
export default async function AdminPagesPage() {
  const counts = await getTypeCounts();

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-semibold text-text-primary">Pages</h1>
        <p className="mt-1 max-w-2xl text-sm text-text-muted">
          Every page on the site, broken into the same sections a visitor sees.
          Open one to edit its hero, its sections and its search listing.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {SITE_PAGES.map((page) => {
          const items = page.modules
            .flatMap(moduleTypes)
            .reduce((sum, type) => sum + (counts.get(type) ?? 0), 0);
          return (
            <div key={page.key} className="card flex flex-col gap-3 p-5">
              <div className="flex items-center justify-between">
                <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-brand-blue-light text-link">
                  <File01Icon className="h-7 w-7" />
                </span>
                <Link
                  href={page.path}
                  target="_blank"
                  rel="noreferrer"
                  aria-label={`Open ${page.label} on the site`}
                  className="focus-ring flex h-9 w-9 items-center justify-center rounded-full border border-border text-text-muted transition-colors hover:border-brand-blue hover:text-link"
                >
                  <EyeIcon className="h-5.5 w-5.5" />
                </Link>
              </div>

              <div>
                <h2 className="text-base font-semibold text-text-primary">{page.label}</h2>
                <p className="mt-0.5 text-xs text-text-muted">{page.path}</p>
                <p className="mt-2 text-sm text-text-muted">{page.description}</p>
              </div>

              <div className="mt-auto flex items-center gap-2 pt-2">
                <span className="rounded-full bg-background-secondary px-2.5 py-1 text-xs font-semibold text-text-secondary">
                  {page.modules.length} section{page.modules.length === 1 ? "" : "s"}
                </span>
                <span className="rounded-full bg-background-secondary px-2.5 py-1 text-xs font-semibold text-text-muted">
                  {items} item{items === 1 ? "" : "s"}
                </span>
              </div>

              <Link
                href={`/admin/pages/${page.key}`}
                className="focus-ring inline-flex h-10 items-center justify-center gap-1.5 rounded-full bg-brand-blue px-4 text-sm font-semibold text-white transition-colors hover:bg-brand-blue-hover"
              >
                Edit page <ArrowRight01Icon className="h-5.5 w-5.5" />
              </Link>
            </div>
          );
        })}
      </div>
    </div>
  );
}
