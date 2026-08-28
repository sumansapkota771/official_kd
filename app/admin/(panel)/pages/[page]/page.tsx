import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft01Icon, EyeIcon, SearchVisualIcon } from "hugeicons-react";
import { getTypeCounts } from "@/lib/content/store";
import { getSitePage } from "@/lib/content/site-map";
import { ModuleCard } from "@/components/admin/module-card";

export const dynamic = "force-dynamic";

/**
 * One page, section by section.
 *
 * The homepage is the exception and redirects to its own screen, because it
 * is the one page whose sections can be reordered and hidden — everywhere
 * else the order is the page's layout, not data, and offering drag handles
 * that do nothing would be a lie.
 *
 * SEO sits on this screen rather than only under the SEO section so that a
 * page's search listing is edited next to the page it describes: Pages →
 * About → Search listing is three clicks, the same as any other field here.
 */
export default async function AdminPageDetail({
  params,
}: {
  params: Promise<{ page: string }>;
}) {
  const { page: key } = await params;
  const page = getSitePage(key);
  if (!page) notFound();

  const counts = await getTypeCounts();

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div className="flex items-start gap-3">
          <Link
            href="/admin/pages"
            aria-label="Back to all pages"
            className="focus-ring mt-0.5 flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-border bg-background text-text-secondary transition-colors hover:bg-background-secondary"
          >
            <ArrowLeft01Icon className="h-6 w-6" />
          </Link>
          <div>
            <h1 className="text-2xl font-semibold text-text-primary">{page.label}</h1>
            <p className="mt-1 max-w-2xl text-sm text-text-muted">
              {page.description} Live at{" "}
              <span className="font-medium text-text-secondary">{page.path}</span>.
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Link
            href={`/admin/content/page-seo/slug/${page.key}`}
            className="focus-ring inline-flex h-10 items-center gap-2 rounded-full border border-border bg-background px-4 text-sm font-semibold text-text-secondary transition-colors hover:border-brand-blue hover:text-link"
          >
            <SearchVisualIcon className="h-6 w-6" /> Search listing
          </Link>
          <Link
            href={page.path}
            target="_blank"
            rel="noreferrer"
            className="focus-ring inline-flex h-10 items-center gap-2 rounded-full border border-border bg-background px-4 text-sm font-semibold text-text-secondary transition-colors hover:border-brand-blue hover:text-link"
          >
            <EyeIcon className="h-6 w-6" /> View page
          </Link>
        </div>
      </div>

      {page.isHomepage && (
        <p className="rounded-xl border-[0.5px] border-border bg-background-secondary px-4 py-3 text-sm text-text-muted">
          The homepage sections can also be reordered and hidden on the{" "}
          <Link href="/admin/homepage" className="font-semibold text-link hover:underline">
            Homepage screen
          </Link>
          .
        </p>
      )}

      <div className="grid gap-4 lg:grid-cols-2">
        {page.modules.map((module) => (
          <ModuleCard key={module.key} module={module} counts={counts} />
        ))}
      </div>
    </div>
  );
}
