"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import {
  Cancel01Icon,
  Loading01Icon,
  Search01Icon,
  CheckmarkCircle02Icon,
} from "hugeicons-react";
import { cn } from "@/lib/utils";

export type MediaItem = {
  id: number;
  filename: string;
  original_name: string;
  url: string;
  mime_type: string;
  size_bytes: number;
  width: number | null;
  height: number | null;
  alt: string;
  caption: string;
  focal_x: number;
  focal_y: number;
  created_at: string;
};

export function formatSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

/**
 * Loads the media library, filtered.
 *
 * Shared by the library screen and the picker so both search the same way —
 * and so the picker is not a second, subtly different implementation of the
 * same list that drifts the first time either is changed.
 *
 * Requests are sequenced by a counter rather than aborted: typing quickly
 * fires several searches, and without this the slowest one to return wins
 * and the grid shows results for a query the box no longer contains.
 */
export function useMediaLibrary(initialQuery = "") {
  const [items, setItems] = useState<MediaItem[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState(initialQuery);
  const [error, setError] = useState<string | null>(null);
  const requestId = useRef(0);

  const load = useCallback(async (q: string) => {
    const id = ++requestId.current;
    setLoading(true);
    setError(null);
    try {
      const params = new URLSearchParams({ limit: "100" });
      if (q.trim()) params.set("q", q.trim());
      const res = await fetch(`/api/admin/media?${params}`);
      if (!res.ok) throw new Error("Could not load the media library.");
      const data = (await res.json()) as { items: MediaItem[]; total: number };
      if (id !== requestId.current) return;
      setItems(data.items);
      setTotal(data.total);
    } catch (err) {
      if (id === requestId.current) setError((err as Error).message);
    } finally {
      if (id === requestId.current) setLoading(false);
    }
  }, []);

  // Debounced, so a five-letter search is one request rather than five.
  useEffect(() => {
    const timer = setTimeout(() => void load(query), 250);
    return () => clearTimeout(timer);
  }, [query, load]);

  return {
    items,
    setItems,
    total,
    setTotal,
    loading,
    query,
    setQuery,
    error,
    setError,
    reload: () => load(query),
  };
}

/**
 * Pick an image that is already in the library.
 *
 * This is what makes the library central rather than a filing cabinet: the
 * same logo can be put on a partner card, a portfolio tile and a case study
 * without being uploaded three times, and its alt text is written once.
 * Selecting an asset with alt text carries that text back to the caller, so
 * a field that has somewhere to put it does not start empty.
 */
export function MediaPickerDialog({
  onSelect,
  onClose,
}: {
  onSelect: (item: MediaItem) => void;
  onClose: () => void;
}) {
  const { items, total, loading, query, setQuery, error } = useMediaLibrary();

  // Escape closes, because a dialog that can only be dismissed by finding
  // its close button is a trap on a small screen.
  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Choose an image from the media library"
      className="fixed inset-0 z-100 flex items-center justify-center bg-black/50 p-4"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="flex max-h-[85vh] w-full max-w-3xl flex-col rounded-2xl border border-border bg-surface">
        <div className="flex items-center gap-3 border-b border-border p-4">
          <div className="relative flex-1">
            <Search01Icon className="pointer-events-none absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-text-muted" />
            <input
              type="search"
              autoFocus
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              /* The picker opens inside the content editor's form, where a
                 bare Enter in a text input submits it — saving the row from
                 a dialog that was only being searched. */
              onKeyDown={(e) => {
                if (e.key === "Enter") e.preventDefault();
              }}
              placeholder="Search by file name, alt text or caption…"
              className="focus-ring w-full rounded-xl border-[0.5px] border-border bg-background py-2 pl-9 pr-3 text-sm text-text-primary placeholder:text-text-muted focus-visible:border-brand-blue"
            />
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close"
            className="focus-ring flex h-9 w-9 items-center justify-center rounded-full border border-border text-text-muted transition-colors hover:text-text-primary"
          >
            <Cancel01Icon className="h-5.5 w-5.5" />
          </button>
        </div>

        <div className="min-h-0 flex-1 overflow-y-auto p-4">
          {error && <p className="text-sm text-red-500">{error}</p>}
          {loading && items.length === 0 && (
            <p className="flex items-center gap-2 text-sm text-text-muted">
              <Loading01Icon className="h-5 w-5 animate-spin" /> Loading…
            </p>
          )}
          {!loading && items.length === 0 && (
            <p className="text-sm text-text-muted">
              {query
                ? "Nothing in the library matches that."
                : "The library is empty. Upload an image and it will appear here."}
            </p>
          )}
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
            {items.map((item) => (
              <button
                key={item.id}
                type="button"
                onClick={() => onSelect(item)}
                title={item.original_name}
                className="focus-ring group flex flex-col gap-1.5 text-left"
              >
                <span className="flex aspect-4/3 items-center justify-center overflow-hidden rounded-xl border border-border bg-background p-2 transition-colors group-hover:border-brand-blue">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={item.url}
                    alt={item.alt || item.original_name}
                    className="max-h-full max-w-full object-contain"
                  />
                </span>
                <span className="truncate text-[11px] text-text-muted">
                  {item.original_name}
                </span>
                {item.alt && (
                  <span className="flex items-center gap-1 truncate text-[10px] text-brand-green-hover">
                    <CheckmarkCircle02Icon className="h-3.5 w-3.5 shrink-0" /> has alt text
                  </span>
                )}
              </button>
            ))}
          </div>
        </div>

        <p className="border-t border-border px-4 py-3 text-xs text-text-muted">
          {total} image{total === 1 ? "" : "s"} in the library.
        </p>
      </div>
    </div>
  );
}

/** Shared class for the small outline buttons used around image fields. */
export const pickerButtonClass = cn(
  "focus-ring inline-flex h-9 cursor-pointer items-center gap-1.5 rounded-full border border-border bg-background px-3 text-sm font-medium text-text-secondary transition-colors hover:border-brand-blue hover:text-link"
);
