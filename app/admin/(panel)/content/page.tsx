import Link from "next/link";
import { ArrowRight01Icon, ContentWritingIcon } from "hugeicons-react";
import { getTypeSummary } from "@/lib/content/store";
import { SeedButton } from "@/components/admin/content/seed-button";
import { cn } from "@/lib/utils";

export const dynamic = "force-dynamic";

export default async function AdminContentOverview() {
  const summary = await getTypeSummary();

  const groups: { group: string; items: typeof summary }[] = [];
  for (const s of summary) {
    const last = groups[groups.length - 1];
    if (last && last.group === s.group) last.items.push(s);
    else groups.push({ group: s.group, items: [s] });
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold text-text-primary">Content</h1>
          <p className="mt-1 text-sm text-text-muted">
            Everything on the site lives here — edit it and the public pages update immediately.
          </p>
        </div>
        <SeedButton label="all content" />
      </div>

      {groups.map((g) => (
        <section key={g.group} className="flex flex-col gap-3">
          <h2 className="text-sm font-semibold uppercase tracking-wide text-text-muted">
            {g.group}
          </h2>
          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
            {g.items.map((s) => (
              <Link
                key={s.type}
                href={`/admin/content/${s.type}`}
                className="focus-ring group card card-hover p-5"
              >
                <div className="flex items-center justify-between">
                  <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-brand-blue-light text-brand-blue">
                    <ContentWritingIcon className="h-5 w-5" />
                  </span>
                  <ArrowRight01Icon className="h-4 w-4 text-text-muted transition-transform group-hover:translate-x-0.5 group-hover:text-brand-blue" />
                </div>
                <h3 className="mt-4 text-base font-semibold text-text-primary">{s.label}</h3>
                <p className="mt-1 text-sm text-text-muted">{s.singular}</p>
                <div className="mt-4 flex items-center gap-2">
                  <span className="rounded-full bg-background-secondary px-2.5 py-1 text-xs font-semibold text-text-secondary">
                    {s.count} total
                  </span>
                  <span
                    className={cn(
                      "rounded-full px-2.5 py-1 text-xs font-semibold",
                      s.publishedCount > 0
                        ? "bg-brand-green/10 text-brand-green-hover"
                        : "bg-background-secondary text-text-muted"
                    )}
                  >
                    {s.publishedCount} live
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </section>
      ))}
    </div>
  );
}
