"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";
import { ArrowDown01Icon } from "hugeicons-react";

export type SubmissionRow = {
  id: number;
  section: string;
  data: Record<string, unknown>;
  created_at: string;
};

const SECTIONS: { key: string; label: string }[] = [
  { key: "all", label: "All" },
  { key: "project", label: "Project Enquiries" },
  { key: "course", label: "Course Applications" },
  { key: "partnership", label: "Partnerships" },
  { key: "product_talk", label: "Product Talks" },
];

function labelFor(key: string): string {
  return SECTIONS.find((s) => s.key === key)?.label ?? key;
}

export function SubmissionsPanel({
  submissions,
  sectionCounts,
}: {
  submissions: SubmissionRow[];
  sectionCounts: Record<string, number>;
}) {
  const [tab, setTab] = useState("all");
  const [expanded, setExpanded] = useState<number | null>(null);

  const filtered =
    tab === "all" ? submissions : submissions.filter((s) => s.section === tab);

  return (
    <div className="card mt-4">
      <div className="flex flex-wrap gap-2 border-b border-border p-4">
        {SECTIONS.map((s) => {
          const count = s.key === "all" ? submissions.length : sectionCounts[s.key] ?? 0;
          return (
            <button
              key={s.key}
              onClick={() => setTab(s.key)}
              className={cn(
                "focus-ring rounded-full border px-3.5 py-1.5 text-xs font-semibold transition-colors",
                tab === s.key
                  ? "border-brand-blue bg-brand-blue text-white"
                  : "border-border bg-background text-text-secondary hover:border-brand-blue/40"
              )}
            >
              {s.label} <span className="opacity-70">{count}</span>
            </button>
          );
        })}
      </div>

      {filtered.length === 0 && (
        <p className="p-6 text-sm text-text-muted">Nothing here yet.</p>
      )}

      <ul className="divide-y divide-border">
        {filtered.map((s) => {
          const open = expanded === s.id;
          const rows = Object.entries(s.data).filter(([k, v]) => v !== "" && v != null);
          return (
            <li key={s.id}>
              <button
                onClick={() => setExpanded(open ? null : s.id)}
                className="flex w-full items-center justify-between gap-3 px-5 py-3.5 text-left transition-colors hover:bg-background-secondary"
              >
                <div className="min-w-0">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="rounded-full bg-background-secondary px-2 py-0.5 text-[11px] font-semibold text-text-secondary">
                      {labelFor(s.section)}
                    </span>
                    <span className="truncate text-sm font-medium text-text-primary">
                      {String(s.data.name ?? s.data.product ?? s.data.organization ?? "Submission")}
                    </span>
                  </div>
                  <p className="mt-0.5 text-xs text-text-muted">{s.created_at}</p>
                </div>
                <ArrowDown01Icon
                  className={cn("h-4 w-4 shrink-0 text-text-muted transition-transform", open && "rotate-180")}
                />
              </button>
              {open && (
                <div className="border-t border-border bg-background-secondary/40 px-5 py-4">
                  <dl className="grid gap-x-6 gap-y-3 sm:grid-cols-2">
                    {rows.length === 0 && <p className="text-sm text-text-muted">No fields submitted.</p>}
                    {rows.map(([k, v]) => (
                      <div key={k}>
                        <dt className="text-[11px] font-semibold uppercase tracking-wider text-text-muted">
                          {k}
                        </dt>
                        <dd className="mt-0.5 break-words text-sm text-text-primary">
                          {String(v)}
                        </dd>
                      </div>
                    ))}
                  </dl>
                </div>
              )}
            </li>
          );
        })}
      </ul>
    </div>
  );
}
