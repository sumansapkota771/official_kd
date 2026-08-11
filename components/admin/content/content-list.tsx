"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  ArrowUp01Icon,
  ArrowDown01Icon,
  AddSquareIcon,
  Delete01Icon,
  Loading01Icon,
  CheckmarkCircle02Icon,
  Edit02Icon,
} from "hugeicons-react";
import { ICON_MAP } from "@/lib/content/icons";
import type { ContentItem } from "@/lib/content/schemas";
import { cn } from "@/lib/utils";

export type ContentListRow = Omit<ContentItem, "createdAt" | "updatedAt"> & {
  createdAt: string;
  updatedAt: string;
};

function displayValue(item: ContentListRow, field?: string): string {
  if (!field) return item.slug ?? "";
  const v = item.data?.[field];
  return typeof v === "string" ? v : "";
}

export function ContentList({
  type,
  label,
  singular,
  isSingleton,
  titleField,
  subtitleField,
  iconField,
  items,
}: {
  type: string;
  label: string;
  singular: string;
  isSingleton: boolean;
  titleField: string;
  subtitleField: string;
  iconField: string;
  items: ContentListRow[];
}) {
  const router = useRouter();
  const [busy, setBusy] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function run(fn: () => Promise<Response>) {
    setError(null);
    try {
      const res = await fn();
      if (!res.ok) {
        const body = (await res.json().catch(() => ({}))) as { error?: string };
        throw new Error(body.error ?? "Action failed");
      }
      router.refresh();
    } catch (err) {
      setError((err as Error).message);
    }
  }

  async function togglePublish(item: ContentListRow) {
    setBusy(`pub-${item.id}`);
    await run(() =>
      fetch("/api/admin/content", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: item.id, published: !item.published }),
      })
    );
    setBusy(null);
  }

  async function remove(item: ContentListRow) {
    if (!confirm(`Delete "${displayValue(item, titleField) || item.slug}"? This cannot be undone.`)) return;
    setBusy(`del-${item.id}`);
    await run(() => fetch(`/api/admin/content?id=${item.id}`, { method: "DELETE" }));
    setBusy(null);
  }

  async function move(item: ContentListRow, dir: -1 | 1) {
    setBusy(`mv-${item.id}`);
    const ids = items.map((i) => i.id);
    const idx = ids.indexOf(item.id);
    const target = idx + dir;
    if (target < 0 || target >= ids.length) {
      setBusy(null);
      return;
    }
    [ids[idx], ids[target]] = [ids[target], ids[idx]];
    await run(() =>
      fetch("/api/admin/content/reorder", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ type, ids }),
      })
    );
    setBusy(null);
  }

  return (
    <div className="flex flex-col gap-5">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-semibold text-text-primary">{label}</h1>
          <p className="mt-1 text-sm text-text-muted">
            {items.length} item{items.length === 1 ? "" : "s"} · {isSingleton ? "single content block" : "reorderable"}
          </p>
        </div>
        {!isSingleton && (
          <Link
            href={`/admin/content/${type}/new`}
            className="focus-ring inline-flex h-10 items-center gap-2 rounded-full bg-brand-blue px-4 text-sm font-semibold text-white transition-colors hover:bg-brand-blue-hover"
          >
            <AddSquareIcon className="h-4 w-4" /> New {singular}
          </Link>
        )}
      </div>

      {error && (
        <p className="rounded-xl border-[0.5px] border-red-500/30 bg-red-500/5 px-4 py-3 text-sm text-text-primary">
          {error}
        </p>
      )}

      <div className="card divide-y divide-border">
        {items.length === 0 && (
          <p className="p-6 text-sm text-text-muted">
            No {label.toLowerCase()} yet.
            {!isSingleton && (
              <>
                {" "}
                <Link href={`/admin/content/${type}/new`} className="font-semibold text-brand-blue hover:underline">
                  Create one
                </Link>
                .
              </>
            )}
          </p>
        )}

        {items.map((item, i) => {
          const title = displayValue(item, titleField) || item.slug || `#${item.id}`;
          const subtitle = subtitleField ? displayValue(item, subtitleField) : undefined;
          const Icon = iconField
            ? (ICON_MAP[displayValue(item, iconField) as keyof typeof ICON_MAP] ?? null)
            : null;
          return (
            <div key={item.id} className="flex items-center gap-4 p-4 sm:px-5">
              <div className="flex flex-col items-center gap-1">
                <button
                  type="button"
                  onClick={() => move(item, -1)}
                  disabled={i === 0 || busy !== null}
                  aria-label="Move up"
                  className="focus-ring flex h-7 w-7 items-center justify-center rounded-md text-text-muted transition-colors hover:bg-background-secondary hover:text-text-primary disabled:opacity-30 disabled:hover:bg-transparent"
                >
                  <ArrowUp01Icon className="h-4 w-4" />
                </button>
                <button
                  type="button"
                  onClick={() => move(item, 1)}
                  disabled={i === items.length - 1 || busy !== null}
                  aria-label="Move down"
                  className="focus-ring flex h-7 w-7 items-center justify-center rounded-md text-text-muted transition-colors hover:bg-background-secondary hover:text-text-primary disabled:opacity-30 disabled:hover:bg-transparent"
                >
                  <ArrowDown01Icon className="h-4 w-4" />
                </button>
              </div>

              <Link
                href={`/admin/content/${type}/${item.id}`}
                className="focus-ring flex min-w-0 flex-1 items-center gap-3 rounded-xl"
              >
                {Icon && (
                  <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-brand-blue-light text-brand-blue">
                    <Icon className="h-5 w-5" />
                  </span>
                )}
                <span className="min-w-0">
                  <span className="block truncate text-sm font-semibold text-text-primary">{title}</span>
                  {subtitle && <span className="mt-0.5 block truncate text-xs text-text-muted">{subtitle}</span>}
                  <span className="mt-0.5 block text-[11px] text-text-muted">/{item.slug}</span>
                </span>
              </Link>

              <div className="flex shrink-0 items-center gap-1.5">
                <button
                  type="button"
                  onClick={() => togglePublish(item)}
                  disabled={busy !== null}
                  title={item.published ? "Published — click to unpublish" : "Unpublished — click to publish"}
                  className={cn(
                    "focus-ring inline-flex h-9 items-center gap-1.5 rounded-full border px-3 text-xs font-semibold transition-colors disabled:opacity-60",
                    item.published
                      ? "border-brand-green/30 bg-brand-green/10 text-brand-green-hover hover:bg-brand-green/20"
                      : "border-border bg-background text-text-muted hover:border-brand-blue/40 hover:text-text-secondary"
                  )}
                >
                  {busy === `pub-${item.id}` ? (
                    <Loading01Icon className="h-3.5 w-3.5 animate-spin" />
                  ) : item.published ? (
                    <CheckmarkCircle02Icon className="h-3.5 w-3.5" />
                  ) : (
                    <span className="h-2 w-2 rounded-full bg-text-muted" />
                  )}
                  {item.published ? "Live" : "Draft"}
                </button>

                <Link
                  href={`/admin/content/${type}/${item.id}`}
                  aria-label={`Edit ${title}`}
                  className="focus-ring flex h-9 w-9 items-center justify-center rounded-full border border-border bg-background text-text-secondary transition-colors hover:border-brand-blue hover:text-brand-blue"
                >
                  <Edit02Icon className="h-4 w-4" />
                </Link>

                <button
                  type="button"
                  onClick={() => remove(item)}
                  disabled={busy !== null}
                  aria-label={`Delete ${title}`}
                  className="focus-ring flex h-9 w-9 items-center justify-center rounded-full border border-border bg-background text-text-muted transition-colors hover:border-red-500/40 hover:text-red-500 disabled:opacity-60"
                >
                  {busy === `del-${item.id}` ? (
                    <Loading01Icon className="h-4 w-4 animate-spin" />
                  ) : (
                    <Delete01Icon className="h-4 w-4" />
                  )}
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
