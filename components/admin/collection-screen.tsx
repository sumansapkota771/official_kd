import Link from "next/link";
import { EyeIcon } from "hugeicons-react";
import { getSchema } from "@/lib/content/schemas";
import { listContentRaw } from "@/lib/content/store";
import { ContentList } from "@/components/admin/content/content-list";

/**
 * A top-level admin screen that *is* one collection.
 *
 * Projects, Blog and the partner lists each get their own item in the
 * sidebar rather than living only under All content, because they are the
 * things edited most often and burying them behind a content index put every
 * one of those edits a click further away than it needed to be.
 *
 * The list itself is the same `ContentList` the generic content routes use —
 * one implementation of reordering, publishing and deleting, so a fix to any
 * of them lands everywhere at once. Only the framing around it differs.
 */
export async function CollectionScreen({
  type,
  title,
  description,
  viewHref,
  viewLabel,
  extra,
}: {
  type: string;
  title: string;
  description: string;
  /** The page on the live site this collection feeds. */
  viewHref?: string;
  viewLabel?: string;
  /** Related links — a page hero, an SEO row — rendered as a strip under the
   *  header, so the whole page is reachable from the collection screen. */
  extra?: { href: string; label: string }[];
}) {
  const schema = getSchema(type);
  const items = await listContentRaw(type);

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold text-text-primary">{title}</h1>
          <p className="mt-1 max-w-2xl text-sm text-text-muted">{description}</p>
        </div>
        {viewHref && (
          <Link
            href={viewHref}
            target="_blank"
            rel="noreferrer"
            className="focus-ring inline-flex h-10 shrink-0 items-center gap-2 rounded-full border border-border bg-background px-4 text-sm font-semibold text-text-secondary transition-colors hover:border-brand-blue hover:text-link"
          >
            <EyeIcon className="h-6 w-6" /> {viewLabel ?? "View on site"}
          </Link>
        )}
      </div>

      {extra && extra.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {extra.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="focus-ring inline-flex h-9 items-center rounded-full border border-border bg-background px-3.5 text-xs font-semibold text-text-secondary transition-colors hover:border-brand-blue hover:text-link"
            >
              {link.label}
            </Link>
          ))}
        </div>
      )}

      <ContentList
        type={type}
        label={schema.label}
        singular={schema.singular}
        isSingleton={Boolean(schema.isSingleton)}
        titleField={schema.titleField}
        subtitleField={schema.subtitleField ?? ""}
        iconField={schema.iconField ?? ""}
        items={items.map((i) => ({
          ...i,
          createdAt: i.createdAt.toISOString(),
          updatedAt: i.updatedAt.toISOString(),
        }))}
      />
    </div>
  );
}
