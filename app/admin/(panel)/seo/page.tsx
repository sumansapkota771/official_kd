import Link from "next/link";
import {
  CheckmarkCircle02Icon,
  Edit02Icon,
  EyeIcon,
  ViewOffSlashIcon,
} from "hugeicons-react";
import { listContentRaw } from "@/lib/content/store";
import { SEO_PAGES, type PageSeoData } from "@/lib/content/schemas";
import { cn } from "@/lib/utils";

export const dynamic = "force-dynamic";

/** Google truncates a title near 60 characters and a description near 160.
 *  The bars are advisory — over-length is flagged, never blocked. */
const TITLE_LIMIT = 60;
const DESCRIPTION_LIMIT = 160;

/**
 * Every page's search listing, in one table.
 *
 * SEO is the one job that is genuinely done page-by-page in a single
 * sitting — write thirteen descriptions, check none is missing — so it gets
 * a screen that shows all thirteen at once and says which are still empty.
 * The same fields are also reachable from each page's own screen, because
 * the other way people arrive at this is "I am editing About, and while I am
 * here…".
 */
export default async function AdminSeoPage() {
  let rows: { slug: string | null; data: Partial<PageSeoData> }[] = [];
  try {
    rows = await listContentRaw<PageSeoData>("page-seo");
  } catch {
    // Database unreachable — the page list is still worth showing.
  }
  const bySlug = new Map(rows.map((r) => [r.slug ?? "", r.data]));

  const done = SEO_PAGES.filter((p) => {
    const d = bySlug.get(p.slug);
    return Boolean(d?.seoTitle?.trim() && d?.metaDescription?.trim());
  }).length;

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-semibold text-text-primary">SEO</h1>
        <p className="mt-1 max-w-2xl text-sm text-text-muted">
          The title and description each page shows in search results, plus its
          canonical URL and social share card. {done} of {SEO_PAGES.length} pages
          are filled in — the rest fall back to the wording the page ships with,
          which is why nothing is broken while they are empty.
        </p>
      </div>

      <div className="card divide-y divide-border">
        {SEO_PAGES.map((page) => {
          const data = bySlug.get(page.slug) ?? {};
          const title = data.seoTitle?.trim() ?? "";
          const description = data.metaDescription?.trim() ?? "";
          const filled = Boolean(title && description);
          return (
            <div key={page.slug} className="flex flex-wrap items-center gap-4 p-4 sm:px-5">
              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-center gap-2">
                  <p className="text-sm font-semibold text-text-primary">{page.pageName}</p>
                  <span className="text-xs text-text-muted">{page.path}</span>
                  {data.noIndex && (
                    <span className="inline-flex items-center gap-1 rounded-full bg-background-secondary px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-text-muted">
                      <ViewOffSlashIcon className="h-4 w-4" /> No-index
                    </span>
                  )}
                </div>

                {/* A rough search result, so the lengths mean something. */}
                <p
                  className={cn(
                    "mt-1.5 truncate text-sm",
                    title ? "text-link" : "italic text-text-muted"
                  )}
                >
                  {title || "Using the page's built-in title"}
                </p>
                <p
                  className={cn(
                    "mt-0.5 line-clamp-2 text-xs",
                    description ? "text-text-muted" : "italic text-text-muted/70"
                  )}
                >
                  {description || "Using the page's built-in description"}
                </p>

                <div className="mt-2 flex flex-wrap items-center gap-2 text-[11px]">
                  <Meter label="Title" length={title.length} limit={TITLE_LIMIT} />
                  <Meter label="Description" length={description.length} limit={DESCRIPTION_LIMIT} />
                  {filled && (
                    <span className="inline-flex items-center gap-1 font-semibold text-brand-green-hover">
                      <CheckmarkCircle02Icon className="h-4 w-4" /> Complete
                    </span>
                  )}
                </div>
              </div>

              <div className="flex shrink-0 items-center gap-2">
                <Link
                  href={page.path}
                  target="_blank"
                  rel="noreferrer"
                  aria-label={`Open ${page.pageName}`}
                  className="focus-ring flex h-9 w-9 items-center justify-center rounded-full border border-border bg-background text-text-muted transition-colors hover:border-brand-blue hover:text-link"
                >
                  <EyeIcon className="h-5.5 w-5.5" />
                </Link>
                <Link
                  href={`/admin/content/page-seo/slug/${page.slug}`}
                  className="focus-ring inline-flex h-9 items-center gap-1.5 rounded-full border border-border bg-background px-3 text-xs font-semibold text-text-secondary transition-colors hover:border-brand-blue hover:text-link"
                >
                  <Edit02Icon className="h-5 w-5" /> Edit
                </Link>
              </div>
            </div>
          );
        })}
      </div>

      <p className="text-sm text-text-muted">
        Projects and blog posts carry their own titles and descriptions on the
        item itself — edit those under{" "}
        <Link href="/admin/projects" className="font-semibold text-link hover:underline">
          Projects
        </Link>{" "}
        and{" "}
        <Link href="/admin/blog" className="font-semibold text-link hover:underline">
          Blog
        </Link>
        .
      </p>
    </div>
  );
}

function Meter({ label, length, limit }: { label: string; length: number; limit: number }) {
  if (length === 0) return null;
  const over = length > limit;
  return (
    <span
      className={cn(
        "rounded-full px-2 py-0.5 font-semibold",
        over
          ? "bg-brand-amber/15 text-brand-amber-text"
          : "bg-background-secondary text-text-muted"
      )}
    >
      {label} {length}/{limit}
    </span>
  );
}
