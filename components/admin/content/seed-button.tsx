"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { RefreshIcon, Loading01Icon } from "hugeicons-react";

export function SeedButton({ type, label }: { type?: string; label: string }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  async function handleSeed() {
    if (!confirm(`Seed "${label}"? Adds any missing default items for this content type.`)) return;
    setLoading(true);
    setMessage(null);
    try {
      const res = await fetch("/api/admin/content/seed", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(type ? { type } : {}),
      });
      if (!res.ok) throw new Error("Seed failed");
      const body = (await res.json()) as { results: { type: string; inserted: number }[] };
      const total = body.results.reduce((sum, r) => sum + r.inserted, 0);
      setMessage(total > 0 ? `Added ${total} missing item${total === 1 ? "" : "s"}.` : "Nothing to add — already seeded.");
      router.refresh();
    } catch (err) {
      setMessage((err as Error).message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex flex-col items-end gap-2">
      <button
        type="button"
        onClick={handleSeed}
        disabled={loading}
        className="focus-ring inline-flex h-10 items-center gap-2 rounded-full border border-border bg-background px-4 text-sm font-semibold text-text-secondary transition-colors hover:border-brand-blue hover:text-link disabled:opacity-60"
      >
        {loading ? <Loading01Icon className="h-6 w-6 animate-spin" /> : <RefreshIcon className="h-6 w-6" />}
        Seed default content
      </button>
      {message && <p className="text-xs text-text-muted">{message}</p>}
    </div>
  );
}
