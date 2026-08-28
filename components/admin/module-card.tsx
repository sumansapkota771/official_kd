import Link from "next/link";
import {
  ArrowRight01Icon,
  Edit02Icon,
  EyeIcon,
  LockIcon,
} from "hugeicons-react";
import { editHref, partOpensEditor, type SiteModule } from "@/lib/content/site-map";
import { cn } from "@/lib/utils";

/**
 * One band of the website, as the admin sees it.
 *
 * Everything a section is made of is listed on the card itself, each with
 * its own Edit button, so reaching a field is Homepage → Edit rather than
 * Homepage → section → list → item → Edit. That is the whole reason the card
 * lists its parts instead of linking to a sub-page: a sub-page would read
 * tidier and cost every edit an extra click.
 *
 * A part that resolves to exactly one row — a singleton, or a heading pinned
 * to a slug — opens straight into its form. A part that is a list says how
 * many rows it holds, because there "which one" is a real question and the
 * count is the answer's first half.
 */
export function ModuleCard({
  module,
  counts,
  actions,
  className,
}: {
  module: SiteModule;
  /** Row counts by content type, from one query, so a card with five parts
   *  does not run five. */
  counts?: Map<string, number>;
  /** Reorder / visibility controls, supplied by the homepage screen. Other
   *  screens pass nothing and the card renders without them. */
  actions?: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={cn("card flex flex-col gap-4 p-5", className)}>
      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-2">
            <h3 className="text-base font-semibold text-text-primary">{module.label}</h3>
            {module.locked && (
              <span
                title="Content is editable; the design of this section is fixed."
                className="inline-flex items-center gap-1 rounded-full bg-background-secondary px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-text-muted"
              >
                <LockIcon className="h-4 w-4" /> Fixed design
              </span>
            )}
          </div>
          <p className="mt-1 text-sm text-text-muted">{module.description}</p>
        </div>
        {actions}
      </div>

      <ul className="flex flex-col divide-y divide-border border-t border-border">
        {module.parts.map((part) => {
          const direct = partOpensEditor(part);
          const count = direct ? null : counts?.get(part.type) ?? null;
          return (
            <li
              key={`${part.type}:${part.slug ?? ""}`}
              className="flex items-center justify-between gap-3 py-3"
            >
              <div className="min-w-0">
                <p className="truncate text-sm font-medium text-text-primary">
                  {part.label}
                  {count !== null && (
                    <span className="ml-2 rounded-full bg-background-secondary px-2 py-0.5 text-[11px] font-semibold text-text-muted">
                      {count}
                    </span>
                  )}
                </p>
                {part.hint && <p className="mt-0.5 text-xs text-text-muted">{part.hint}</p>}
              </div>
              <Link
                href={editHref(part)}
                className={cn(
                  "focus-ring inline-flex h-9 shrink-0 items-center gap-1.5 rounded-full border px-3 text-xs font-semibold transition-colors",
                  "border-border bg-background text-text-secondary hover:border-brand-blue hover:text-link"
                )}
              >
                {direct ? (
                  <>
                    <Edit02Icon className="h-5 w-5" /> Edit
                  </>
                ) : (
                  <>
                    <ArrowRight01Icon className="h-5 w-5" /> Manage
                  </>
                )}
              </Link>
            </li>
          );
        })}
      </ul>

      <Link
        href={module.preview}
        target="_blank"
        rel="noreferrer"
        className="focus-ring inline-flex items-center gap-1.5 self-start text-xs font-semibold text-text-muted transition-colors hover:text-link"
      >
        <EyeIcon className="h-5 w-5" /> Preview on site
      </Link>
    </div>
  );
}
