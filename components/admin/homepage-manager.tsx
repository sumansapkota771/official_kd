"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  ArrowUp01Icon,
  ArrowDown01Icon,
  DragDropVerticalIcon,
  Edit02Icon,
  ArrowRight01Icon,
  EyeIcon,
  LockIcon,
  Loading01Icon,
  ViewIcon,
  ViewOffSlashIcon,
} from "hugeicons-react";
import { cn } from "@/lib/utils";

/** One editable piece of a section, already resolved to a link on the
 *  server so this file never has to load the content schemas. */
export type ManagerPart = {
  label: string;
  hint?: string;
  href: string;
  /** True when the link opens a form; false when it opens a list. */
  direct: boolean;
  count: number | null;
};

export type ManagerSection = {
  /** `home-section` row id — what reorder and save address. */
  id: number;
  slug: string;
  /** The section's type, e.g. "hero". */
  key: string;
  label: string;
  description: string;
  preview: string;
  locked: boolean;
  enabled: boolean;
  parts: ManagerPart[];
  /** True when no module is registered for this row's type, so the admin
   *  can see the row exists rather than wonder why it renders nothing. */
  unknown: boolean;
};

/**
 * The homepage, in the order it is served, with its sections editable in
 * place.
 *
 * Reorder, show/hide and edit all live on one screen because they are one
 * job — "arrange the homepage" — and splitting them across a list page and a
 * detail page is what put every field four clicks away in the first place.
 * Each section's parts are listed on its own card, so any field on the
 * homepage is two clicks from here.
 *
 * Order and visibility are two different stores on purpose. Order is the
 * row's `position`, moved through the reorder endpoint. Visibility is
 * `data.enabled`, which is what the page renderer filters on — using the
 * row's `published` flag instead would hide the section from the *admin's*
 * own list too, since unpublished rows are filtered out of public reads.
 */
export function HomepageManager({ sections }: { sections: ManagerSection[] }) {
  const router = useRouter();
  const [busy, setBusy] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [dragIndex, setDragIndex] = useState<number | null>(null);
  const [overIndex, setOverIndex] = useState<number | null>(null);

  async function run(fn: () => Promise<Response>) {
    setError(null);
    try {
      const res = await fn();
      if (!res.ok) {
        const body = (await res.json().catch(() => ({}))) as { error?: string };
        throw new Error(body.error ?? "That did not save. Try again.");
      }
      router.refresh();
    } catch (err) {
      setError((err as Error).message);
    }
  }

  /* The list mid-drag: the real order with the dragged card lifted out and
     dropped where the pointer is. Derived, so nothing needs syncing back
     when the drag ends. */
  const display = useMemo(() => {
    if (dragIndex === null || overIndex === null || dragIndex === overIndex) return sections;
    const next = [...sections];
    const [moved] = next.splice(dragIndex, 1);
    next.splice(overIndex, 0, moved);
    return next;
  }, [sections, dragIndex, overIndex]);

  async function commitOrder(ids: number[]) {
    setBusy("reorder");
    await run(() =>
      fetch("/api/admin/content/reorder", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ type: "home-section", ids }),
      })
    );
    setBusy(null);
  }

  function onDrop() {
    if (dragIndex !== null && overIndex !== null && dragIndex !== overIndex) {
      void commitOrder(display.map((s) => s.id));
    }
    setDragIndex(null);
    setOverIndex(null);
  }

  async function move(index: number, dir: -1 | 1) {
    const target = index + dir;
    if (target < 0 || target >= sections.length) return;
    const ids = sections.map((s) => s.id);
    [ids[index], ids[target]] = [ids[target], ids[index]];
    await commitOrder(ids);
  }

  async function toggle(section: ManagerSection) {
    setBusy(`vis-${section.id}`);
    await run(() =>
      fetch("/api/admin/content", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: section.id,
          type: "home-section",
          slug: section.slug,
          data: { type: section.key, label: section.label, enabled: !section.enabled },
          published: true,
        }),
      })
    );
    setBusy(null);
  }

  return (
    <div className="flex flex-col gap-5">
      {error && (
        <p className="rounded-xl border-[0.5px] border-red-500/30 bg-red-500/5 px-4 py-3 text-sm text-text-primary">
          {error}
        </p>
      )}

      <div className="flex flex-col gap-4">
        {display.map((section, i) => {
          const dragging = dragIndex !== null && display[i]?.id === sections[dragIndex]?.id;
          return (
            <div
              key={section.id}
              draggable={busy === null}
              onDragStart={(e) => {
                setDragIndex(i);
                setOverIndex(i);
                e.dataTransfer.effectAllowed = "move";
                // Firefox refuses to start a drag with no payload.
                e.dataTransfer.setData("text/plain", String(section.id));
              }}
              onDragOver={(e) => {
                if (dragIndex === null) return;
                e.preventDefault();
                e.dataTransfer.dropEffect = "move";
                if (overIndex !== i) setOverIndex(i);
              }}
              onDrop={(e) => {
                e.preventDefault();
                onDrop();
              }}
              onDragEnd={onDrop}
              className={cn(
                "card flex flex-col gap-4 p-5 transition-colors",
                dragging && "bg-brand-blue-light/60 opacity-60",
                !section.enabled && "opacity-70"
              )}
            >
              <div className="flex flex-wrap items-start justify-between gap-4">
                <div className="flex min-w-0 items-start gap-3">
                  <span
                    aria-hidden
                    title="Drag to reorder"
                    className="mt-0.5 shrink-0 cursor-grab text-text-muted/60 active:cursor-grabbing"
                  >
                    <DragDropVerticalIcon className="h-6 w-6" />
                  </span>
                  {/* Native drag is mouse-only, so the arrows are not a
                      convenience — without them a keyboard user cannot
                      reorder the homepage at all. */}
                  <div className="flex shrink-0 flex-col items-center">
                    <button
                      type="button"
                      onClick={() => move(i, -1)}
                      disabled={i === 0 || busy !== null}
                      aria-label={`Move ${section.label} up`}
                      className="focus-ring flex h-7 w-7 items-center justify-center rounded-md text-text-muted transition-colors hover:bg-background-secondary hover:text-text-primary disabled:opacity-30 disabled:hover:bg-transparent"
                    >
                      <ArrowUp01Icon className="h-6 w-6" />
                    </button>
                    <button
                      type="button"
                      onClick={() => move(i, 1)}
                      disabled={i === sections.length - 1 || busy !== null}
                      aria-label={`Move ${section.label} down`}
                      className="focus-ring flex h-7 w-7 items-center justify-center rounded-md text-text-muted transition-colors hover:bg-background-secondary hover:text-text-primary disabled:opacity-30 disabled:hover:bg-transparent"
                    >
                      <ArrowDown01Icon className="h-6 w-6" />
                    </button>
                  </div>

                  <div className="min-w-0">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="text-xs font-semibold text-text-muted">{i + 1}.</span>
                      <h3 className="text-base font-semibold text-text-primary">{section.label}</h3>
                      {section.locked && (
                        <span
                          title="Content is editable; the design of this section is fixed."
                          className="inline-flex items-center gap-1 rounded-full bg-background-secondary px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-text-muted"
                        >
                          <LockIcon className="h-4 w-4" /> Fixed design
                        </span>
                      )}
                      {!section.enabled && (
                        <span className="rounded-full bg-background-secondary px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-text-muted">
                          Hidden
                        </span>
                      )}
                    </div>
                    <p className="mt-1 text-sm text-text-muted">{section.description}</p>
                  </div>
                </div>

                <div className="flex shrink-0 items-center gap-2">
                  <button
                    type="button"
                    onClick={() => toggle(section)}
                    disabled={busy !== null}
                    title={
                      section.enabled
                        ? "Visible on the homepage — click to hide"
                        : "Hidden — click to show"
                    }
                    className={cn(
                      "focus-ring inline-flex h-9 items-center gap-1.5 rounded-full border px-3 text-xs font-semibold transition-colors disabled:opacity-60",
                      section.enabled
                        ? "border-brand-green/30 bg-brand-green/10 text-brand-green-hover hover:bg-brand-green/20"
                        : "border-border bg-background text-text-muted hover:border-brand-blue/40 hover:text-text-secondary"
                    )}
                  >
                    {busy === `vis-${section.id}` ? (
                      <Loading01Icon className="h-5 w-5 animate-spin" />
                    ) : section.enabled ? (
                      <ViewIcon className="h-5 w-5" />
                    ) : (
                      <ViewOffSlashIcon className="h-5 w-5" />
                    )}
                    {section.enabled ? "Visible" : "Hidden"}
                  </button>
                  <Link
                    href={section.preview}
                    target="_blank"
                    rel="noreferrer"
                    className="focus-ring inline-flex h-9 items-center gap-1.5 rounded-full border border-border bg-background px-3 text-xs font-semibold text-text-secondary transition-colors hover:border-brand-blue hover:text-link"
                  >
                    <EyeIcon className="h-5 w-5" /> Preview
                  </Link>
                </div>
              </div>

              {section.unknown ? (
                <p className="rounded-xl border-[0.5px] border-border bg-background-secondary px-4 py-3 text-xs text-text-muted">
                  This row has no matching section on the site
                  {` ("${section.key}")`}. Hide it, or delete it from All content →
                  Homepage sections.
                </p>
              ) : (
                <ul className="flex flex-col divide-y divide-border border-t border-border">
                  {section.parts.map((part) => (
                    <li key={part.href} className="flex items-center justify-between gap-3 py-3">
                      <div className="min-w-0">
                        <p className="truncate text-sm font-medium text-text-primary">
                          {part.label}
                          {part.count !== null && (
                            <span className="ml-2 rounded-full bg-background-secondary px-2 py-0.5 text-[11px] font-semibold text-text-muted">
                              {part.count}
                            </span>
                          )}
                        </p>
                        {part.hint && <p className="mt-0.5 text-xs text-text-muted">{part.hint}</p>}
                      </div>
                      <Link
                        href={part.href}
                        className="focus-ring inline-flex h-9 shrink-0 items-center gap-1.5 rounded-full border border-border bg-background px-3 text-xs font-semibold text-text-secondary transition-colors hover:border-brand-blue hover:text-link"
                      >
                        {part.direct ? (
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
                  ))}
                </ul>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
