"use client";

import { useEffect, useRef, useState } from "react";

type MediaItem = {
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

export default function AdminMediaPage() {
  const [items, setItems] = useState<MediaItem[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [selected, setSelected] = useState<MediaItem | null>(null);
  const [filter, setFilter] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);
  const mountedRef = useRef(false);

  useEffect(() => {
    async function load(offset = 0) {
      const params = new URLSearchParams({ limit: "50", offset: String(offset) });
      if (filter) params.set("mime", filter);
      const res = await fetch(`/api/admin/media?${params}`);
      if (res.ok && mountedRef.current) {
        const data = await res.json();
        setItems(data.items);
        setTotal(data.total);
      }
      if (mountedRef.current) setLoading(false);
    }
    mountedRef.current = true;
    load();
    return () => { mountedRef.current = false; };
  }, [filter]);

  async function handleUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    const form = new FormData();
    form.append("file", file);
    const res = await fetch("/api/admin/media", { method: "POST", body: form });
    if (res.ok) {
      const asset = await res.json();
      if (!filter || (asset.mime_type && asset.mime_type.startsWith(filter))) {
        setItems((prev) => [asset, ...prev]);
      }
      setTotal((prev) => prev + 1);
    }
    setUploading(false);
    if (inputRef.current) inputRef.current.value = "";
  }

  async function handleSave() {
    if (!selected) return;
    const res = await fetch(`/api/admin/media/${selected.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ alt: selected.alt, caption: selected.caption }),
    });
    if (res.ok) {
      const updated = await res.json();
      setItems((prev) => prev.map((i) => (i.id === updated.id ? updated : i)));
      setSelected(null);
    }
  }

  async function handleDelete(id: number) {
    if (!confirm("Delete this asset?")) return;
    const res = await fetch(`/api/admin/media/${id}`, { method: "DELETE" });
    if (res.ok) {
      setItems((prev) => prev.filter((i) => i.id !== id));
      setTotal((prev) => prev - 1);
      if (selected?.id === id) setSelected(null);
    }
  }

  function formatSize(bytes: number) {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  }

  return (
    <div>
      <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="font-heading text-2xl font-bold text-text-primary">Media Library</h1>
          <p className="mt-1 text-sm text-text-muted">{total} assets</p>
        </div>
        <div className="flex items-center gap-3">
          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="rounded-xl border border-border bg-surface px-3 py-2 text-sm text-text-secondary"
          >
            <option value="">All types</option>
            <option value="image/jpeg">JPEG</option>
            <option value="image/png">PNG</option>
            <option value="image/webp">WebP</option>
            <option value="image/gif">GIF</option>
            <option value="image/svg+xml">SVG</option>
          </select>
          <label className="focus-ring cursor-pointer rounded-xl bg-brand-blue px-4 py-2 text-sm font-semibold text-white transition hover:bg-brand-blue-hover">
            {uploading ? "Uploading…" : "Upload image"}
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
      </div>

      {loading ? (
        <p className="text-sm text-text-muted">Loading…</p>
      ) : items.length === 0 ? (
        <p className="text-sm text-text-muted">No media assets yet. Upload an image to get started.</p>
      ) : (
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
          {items.map((item) => (
            <button
              key={item.id}
              type="button"
              onClick={() => setSelected(item)}
              className={`focus-ring group relative aspect-square overflow-hidden rounded-xl border transition ${
                selected?.id === item.id
                  ? "border-brand-blue ring-2 ring-brand-blue/30"
                  : "border-border hover:border-text-muted"
              }`}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={item.url}
                alt={item.alt || item.original_name}
                className="h-full w-full object-cover"
              />
              <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/60 to-transparent p-2 opacity-0 transition-opacity group-hover:opacity-100">
                <p className="truncate text-xs text-white">{item.original_name}</p>
                <p className="text-xs text-white/70">{formatSize(item.size_bytes)}</p>
              </div>
            </button>
          ))}
        </div>
      )}

      {selected && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="w-full max-w-lg rounded-2xl border border-border bg-surface p-6">
            <div className="flex items-start justify-between">
              <h2 className="font-heading text-lg font-bold text-text-primary">Edit asset</h2>
              <button
                type="button"
                onClick={() => setSelected(null)}
                className="text-text-muted hover:text-text-primary"
              >
                ✕
              </button>
            </div>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={selected.url}
              alt={selected.alt || selected.original_name}
              className="mt-4 max-h-60 w-full rounded-xl object-contain"
            />
            <div className="mt-4 flex flex-col gap-3">
              <div>
                <label className="mb-1 block text-xs font-medium text-text-muted">Alt text</label>
                <input
                  type="text"
                  value={selected.alt}
                  onChange={(e) => setSelected({ ...selected, alt: e.target.value })}
                  className="w-full rounded-xl border border-border bg-background px-3 py-2 text-sm text-text-secondary"
                  placeholder="Describe the image"
                />
              </div>
              <div>
                <label className="mb-1 block text-xs font-medium text-text-muted">Caption</label>
                <input
                  type="text"
                  value={selected.caption}
                  onChange={(e) => setSelected({ ...selected, caption: e.target.value })}
                  className="w-full rounded-xl border border-border bg-background px-3 py-2 text-sm text-text-secondary"
                  placeholder="Optional caption"
                />
              </div>
              <p className="text-xs text-text-muted">
                {selected.original_name} · {formatSize(selected.size_bytes)}
                {selected.width && selected.height ? ` · ${selected.width}×${selected.height}` : ""}
              </p>
              <div className="flex items-center gap-2 pt-2">
                <button
                  type="button"
                  onClick={handleSave}
                  className="rounded-xl bg-brand-blue px-4 py-2 text-sm font-semibold text-white transition hover:bg-brand-blue-hover"
                >
                  Save
                </button>
                <button
                  type="button"
                  onClick={() => handleDelete(selected.id)}
                  className="rounded-xl border border-red-300 px-4 py-2 text-sm font-semibold text-red-600 transition hover:bg-red-50 dark:border-red-800 dark:text-red-400 dark:hover:bg-red-950"
                >
                  Delete
                </button>
                <button
                  type="button"
                  onClick={() => setSelected(null)}
                  className="ml-auto rounded-xl border border-border px-4 py-2 text-sm font-medium text-text-secondary transition hover:bg-background-secondary"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
