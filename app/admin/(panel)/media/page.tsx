"use client";

import { useRef, useState } from "react";
import {
  Search01Icon,
  Loading01Icon,
  Cancel01Icon,
  Copy01Icon,
  CheckmarkCircle02Icon,
  Alert01Icon,
} from "hugeicons-react";
import {
  useMediaLibrary,
  formatSize,
  pickerButtonClass,
  type MediaItem,
} from "@/components/admin/media-picker";
import { cn } from "@/lib/utils";

/**
 * The media library.
 *
 * Every image on the site lands here, including the ones uploaded from a
 * content field, so it is the one place to search for a picture, give it alt
 * text, swap the file behind it or copy its URL for reuse. The same search
 * powers the picker inside the content editor — see `useMediaLibrary`.
 *
 * Thumbnails are `object-contain` on a plain ground rather than
 * `object-cover`. A cropped thumbnail of a logo is a different picture from
 * the one the site shows, and the whole point of looking at the library is
 * to see what you have got.
 */
export default function AdminMediaPage() {
  const { items, setItems, total, setTotal, loading, query, setQuery, error, reload } =
    useMediaLibrary();
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [selected, setSelected] = useState<MediaItem | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  /** Images with no alt text — the one number worth calling out here,
   *  because it is the accessibility debt nobody notices accruing. */
  const missingAlt = items.filter((i) => !i.alt.trim()).length;

  async function handleUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    setUploadError(null);
    try {
      const form = new FormData();
      form.append("file", file);
      const res = await fetch("/api/admin/media", { method: "POST", body: form });
      if (!res.ok) {
        const body = (await res.json().catch(() => ({}))) as { error?: string };
        throw new Error(body.error ?? "Upload failed.");
      }
      await reload();
    } catch (err) {
      setUploadError((err as Error).message);
    } finally {
      setUploading(false);
      if (inputRef.current) inputRef.current.value = "";
    }
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold text-text-primary">Media</h1>
          <p className="mt-1 max-w-2xl text-sm text-text-muted">
            {total} image{total === 1 ? "" : "s"}. Upload once and reuse anywhere —
            every image field on the site can pick from this library.
            {missingAlt > 0 && (
              <>
                {" "}
                <span className="font-medium text-brand-amber-text">
                  {missingAlt} of the images shown have no alt text.
                </span>
              </>
            )}
          </p>
        </div>
        <label
          className={cn(
            "focus-ring inline-flex h-10 cursor-pointer items-center gap-2 rounded-full bg-brand-blue px-4 text-sm font-semibold text-white transition-colors hover:bg-brand-blue-hover",
            uploading && "opacity-60"
          )}
        >
          {uploading ? (
            <>
              <Loading01Icon className="h-5.5 w-5.5 animate-spin" /> Uploading…
            </>
          ) : (
            "Upload image"
          )}
          <input
            ref={inputRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={handleUpload}
            disabled={uploading}
          />
        </label>
      </div>

      <div className="relative max-w-md">
        <Search01Icon className="pointer-events-none absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-text-muted" />
        <input
          type="search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search by file name, alt text or caption…"
          aria-label="Search the media library"
          className="focus-ring w-full rounded-xl border-[0.5px] border-border bg-background py-2.5 pl-9 pr-3 text-sm text-text-primary placeholder:text-text-muted focus-visible:border-brand-blue"
        />
      </div>

      {(error || uploadError) && (
        <p className="flex items-center gap-2 rounded-xl border-[0.5px] border-red-500/30 bg-red-500/5 px-4 py-3 text-sm text-text-primary">
          <Alert01Icon className="h-5.5 w-5.5 shrink-0 text-red-500" />
          {error ?? uploadError}
        </p>
      )}

      {loading && items.length === 0 ? (
        <p className="flex items-center gap-2 text-sm text-text-muted">
          <Loading01Icon className="h-5 w-5 animate-spin" /> Loading…
        </p>
      ) : items.length === 0 ? (
        <p className="card p-6 text-sm text-text-muted">
          {query
            ? "Nothing in the library matches that."
            : "No images yet. Upload one to get started — anything added from a content field lands here too."}
        </p>
      ) : (
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
          {items.map((item) => (
            <button
              key={item.id}
              type="button"
              onClick={() => setSelected(item)}
              className="focus-ring group flex flex-col gap-1.5 text-left"
            >
              <span className="flex aspect-4/3 items-center justify-center overflow-hidden rounded-xl border border-border bg-background p-3 transition-colors group-hover:border-brand-blue">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={item.url}
                  alt={item.alt || item.original_name}
                  className="max-h-full max-w-full object-contain"
                />
              </span>
              <span className="truncate text-xs font-medium text-text-primary">
                {item.original_name}
              </span>
              <span className="flex items-center gap-1.5 text-[11px] text-text-muted">
                {formatSize(item.size_bytes)}
                {item.alt.trim() ? (
                  <span className="flex items-center gap-1 text-brand-green-hover">
                    <CheckmarkCircle02Icon className="h-3.5 w-3.5" /> alt
                  </span>
                ) : (
                  <span className="text-brand-amber-text">no alt text</span>
                )}
              </span>
            </button>
          ))}
        </div>
      )}

      {selected && (
        <AssetDialog
          asset={selected}
          onClose={() => setSelected(null)}
          onChanged={(next) => {
            setItems((prev) => prev.map((i) => (i.id === next.id ? next : i)));
            setSelected(next);
          }}
          onDeleted={(id) => {
            setItems((prev) => prev.filter((i) => i.id !== id));
            setTotal((prev) => Math.max(0, prev - 1));
            setSelected(null);
          }}
        />
      )}
    </div>
  );
}

/**
 * One asset: preview, alt text, caption, replace, copy URL, delete.
 *
 * Replace is the reason this is a dialog rather than an inline row. Swapping
 * the file keeps the asset's id, alt text and caption, so a logo that has
 * been rebranded is updated in one place instead of being re-uploaded and
 * re-described — and every field pointing at it is updated the moment its
 * page is next rendered.
 */
function AssetDialog({
  asset,
  onClose,
  onChanged,
  onDeleted,
}: {
  asset: MediaItem;
  onClose: () => void;
  onChanged: (next: MediaItem) => void;
  onDeleted: (id: number) => void;
}) {
  const [alt, setAlt] = useState(asset.alt);
  const [caption, setCaption] = useState(asset.caption);
  const [busy, setBusy] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  const dirty = alt !== asset.alt || caption !== asset.caption;

  async function save() {
    setBusy("save");
    setMessage(null);
    try {
      const res = await fetch(`/api/admin/media/${asset.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ alt, caption }),
      });
      if (!res.ok) throw new Error("Could not save.");
      onChanged((await res.json()) as MediaItem);
      setMessage("Saved.");
    } catch (err) {
      setMessage((err as Error).message);
    } finally {
      setBusy(null);
    }
  }

  async function replace(file: File) {
    setBusy("replace");
    setMessage(null);
    try {
      const form = new FormData();
      form.append("file", file);
      const res = await fetch(`/api/admin/media/${asset.id}`, { method: "POST", body: form });
      if (!res.ok) {
        const body = (await res.json().catch(() => ({}))) as { error?: string };
        throw new Error(body.error ?? "Could not replace the file.");
      }
      onChanged((await res.json()) as MediaItem);
      setMessage("File replaced. Anywhere still pointing at the old URL needs updating.");
    } catch (err) {
      setMessage((err as Error).message);
    } finally {
      setBusy(null);
    }
  }

  async function remove() {
    if (!confirm("Delete this image? Anything still using it will show a broken picture.")) return;
    setBusy("delete");
    try {
      const res = await fetch(`/api/admin/media/${asset.id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Could not delete.");
      onDeleted(asset.id);
    } catch (err) {
      setMessage((err as Error).message);
      setBusy(null);
    }
  }

  async function copyUrl() {
    try {
      await navigator.clipboard.writeText(asset.url);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      setMessage("The browser would not allow copying. Select the URL below instead.");
    }
  }

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label={`Edit ${asset.original_name}`}
      className="fixed inset-0 z-100 flex items-center justify-center bg-black/50 p-4"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="flex max-h-[88vh] w-full max-w-lg flex-col overflow-y-auto rounded-2xl border border-border bg-surface p-6">
        <div className="flex items-start justify-between gap-3">
          <h2 className="text-lg font-semibold text-text-primary">Edit image</h2>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close"
            className="focus-ring flex h-9 w-9 items-center justify-center rounded-full border border-border text-text-muted transition-colors hover:text-text-primary"
          >
            <Cancel01Icon className="h-5.5 w-5.5" />
          </button>
        </div>

        <div className="mt-4 flex max-h-60 items-center justify-center rounded-xl border border-border bg-background p-4">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={asset.url}
            alt={asset.alt || asset.original_name}
            className="max-h-52 max-w-full object-contain"
          />
        </div>

        <div className="mt-4 flex flex-col gap-3">
          <div>
            <label htmlFor="asset-alt" className="mb-1 block text-xs font-medium text-text-muted">
              Alt text
            </label>
            <input
              id="asset-alt"
              type="text"
              value={alt}
              onChange={(e) => setAlt(e.target.value)}
              className="focus-ring w-full rounded-xl border-[0.5px] border-border bg-background px-3 py-2 text-sm text-text-primary focus-visible:border-brand-blue"
              placeholder="Describe the image for screen readers"
            />
            <p className="mt-1 text-xs text-text-muted">
              Written once here and offered wherever this image is reused.
            </p>
          </div>

          <div>
            <label htmlFor="asset-caption" className="mb-1 block text-xs font-medium text-text-muted">
              Caption
            </label>
            <input
              id="asset-caption"
              type="text"
              value={caption}
              onChange={(e) => setCaption(e.target.value)}
              className="focus-ring w-full rounded-xl border-[0.5px] border-border bg-background px-3 py-2 text-sm text-text-primary focus-visible:border-brand-blue"
              placeholder="Optional"
            />
          </div>

          <p className="break-all rounded-xl bg-background-secondary px-3 py-2 text-[11px] text-text-muted">
            {asset.url}
          </p>

          <p className="text-xs text-text-muted">
            {asset.original_name} · {formatSize(asset.size_bytes)}
            {asset.width && asset.height ? ` · ${asset.width}×${asset.height}` : ""}
          </p>

          {message && <p className="text-xs text-text-secondary">{message}</p>}

          <div className="flex flex-wrap items-center gap-2 pt-1">
            <button
              type="button"
              onClick={save}
              disabled={busy !== null || !dirty}
              className="focus-ring inline-flex h-10 items-center gap-2 rounded-full bg-brand-blue px-4 text-sm font-semibold text-white transition-colors hover:bg-brand-blue-hover disabled:opacity-50"
            >
              {busy === "save" ? <Loading01Icon className="h-5.5 w-5.5 animate-spin" /> : null}
              Save
            </button>

            <label className={cn(pickerButtonClass, busy !== null && "pointer-events-none opacity-60")}>
              {busy === "replace" ? "Replacing…" : "Replace file"}
              <input
                type="file"
                accept="image/*"
                className="hidden"
                onChange={(e) => {
                  const f = e.target.files?.[0];
                  if (f) void replace(f);
                  e.target.value = "";
                }}
              />
            </label>

            <button type="button" onClick={copyUrl} className={pickerButtonClass}>
              {copied ? (
                <>
                  <CheckmarkCircle02Icon className="h-5 w-5" /> Copied
                </>
              ) : (
                <>
                  <Copy01Icon className="h-5 w-5" /> Copy URL
                </>
              )}
            </button>

            <button
              type="button"
              onClick={remove}
              disabled={busy !== null}
              className="focus-ring ml-auto inline-flex h-10 items-center rounded-full border border-red-500/30 px-4 text-sm font-semibold text-red-500 transition-colors hover:bg-red-500/5 disabled:opacity-50"
            >
              Delete
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
