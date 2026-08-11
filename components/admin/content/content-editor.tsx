"use client";

import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft01Icon, Loading01Icon } from "hugeicons-react";
import { ICON_KEYS, ICON_MAP } from "@/lib/content/icons";
import { slugify, type ContentField, type ContentItem } from "@/lib/content/schemas";
import { cn } from "@/lib/utils";

const fieldClasses =
  "focus-ring w-full rounded-xl border-[0.5px] border-border bg-background px-4 py-2.5 text-sm text-text-primary placeholder:text-text-muted focus-visible:border-brand-blue";
const labelClasses = "text-sm font-medium text-text-secondary";

function asString(value: unknown): string {
  return typeof value === "string" ? value : "";
}

function asStrings(value: unknown): string[] {
  return Array.isArray(value) ? value.filter((v): v is string => typeof v === "string") : [];
}

export function ContentEditor({
  type,
  singular,
  fields,
  isSingleton,
  singletonSlug,
  initial,
}: {
  type: string;
  singular: string;
  fields: ContentField[];
  isSingleton?: boolean;
  singletonSlug?: string;
  initial?: ContentItem | null;
}) {
  const router = useRouter();
  const [slug, setSlug] = useState(
    initial?.slug ?? (isSingleton ? singletonSlug ?? "main" : "")
  );
  const [published, setPublished] = useState(initial?.published ?? true);
  const [data, setData] = useState<Record<string, unknown>>(initial?.data ?? {});
  const [jsonDrafts, setJsonDrafts] = useState<Record<string, string>>({});
  const [jsonError, setJsonError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  function setField(key: string, value: unknown) {
    setData((prev) => ({ ...prev, [key]: value }));
  }

  function fieldControl(field: ContentField) {
    const key = field.key;

    if (field.kind === "text" || field.kind === "url") {
      return (
        <input
          id={`field-${key}`}
          type={field.kind === "url" ? "url" : "text"}
          className={fieldClasses}
          value={asString(data[key])}
          onChange={(e) => setField(key, e.target.value)}
          placeholder={field.placeholder}
          required={field.required}
        />
      );
    }

    if (field.kind === "textarea") {
      return (
        <textarea
          id={`field-${key}`}
          rows={3}
          className={fieldClasses}
          value={asString(data[key])}
          onChange={(e) => setField(key, e.target.value)}
          placeholder={field.placeholder}
          required={field.required}
        />
      );
    }

    if (field.kind === "select") {
      const options = field.options ?? [];
      return (
        <select
          id={`field-${key}`}
          className={fieldClasses}
          value={options.includes(asString(data[key])) ? asString(data[key]) : ""}
          onChange={(e) => setField(key, e.target.value)}
        >
          <option value="">Select…</option>
          {options.map((opt) => (
            <option key={opt} value={opt}>
              {opt}
            </option>
          ))}
        </select>
      );
    }

    if (field.kind === "tone") {
      return (
        <select
          id={`field-${key}`}
          className={fieldClasses}
          value={asString(data[key]) || "blue"}
          onChange={(e) => setField(key, e.target.value)}
        >
          <option value="blue">Blue</option>
          <option value="green">Green</option>
        </select>
      );
    }

    if (field.kind === "list") {
      return (
        <textarea
          id={`field-${key}`}
          rows={5}
          className={cn(fieldClasses, "font-mono text-xs")}
          value={asStrings(data[key]).join("\n")}
          onChange={(e) =>
            setField(
              key,
              e.target.value
                .split("\n")
                .map((l) => l.trim())
                .filter(Boolean)
            )
          }
          placeholder={field.placeholder ?? "One item per line"}
        />
      );
    }

    if (field.kind === "json") {
      const draft = jsonDrafts[key] ?? JSON.stringify(data[key] ?? {}, null, 2);
      return (
        <div className="flex flex-col gap-1.5">
          <textarea
            id={`field-${key}`}
            rows={10}
            className={cn(fieldClasses, "font-mono text-xs")}
            value={draft}
            onChange={(e) => {
              const next = e.target.value;
              setJsonDrafts((prev) => ({ ...prev, [key]: next }));
              try {
                const parsed = JSON.parse(next) as unknown;
                setField(key, parsed);
                setJsonError(null);
              } catch {
                setJsonError("Invalid JSON — changes not saved.");
              }
            }}
          />
          {jsonError && <p className="text-xs font-medium text-red-500">{jsonError}</p>}
          {field.helper && !jsonError && <p className="text-xs text-text-muted">{field.helper}</p>}
        </div>
      );
    }

    if (field.kind === "check") {
      return (
        <label className="flex items-center gap-2.5 text-sm font-medium text-text-secondary">
          <input
            type="checkbox"
            checked={Boolean(data[key])}
            onChange={(e) => setField(key, e.target.checked)}
            className="h-4 w-4 rounded border-border accent-brand-blue"
          />
          {field.label}
        </label>
      );
    }

    if (field.kind === "icon") {
      const current = asString(data[key]) || "sparkles";
      return (
        <div className="flex flex-wrap gap-2">
          {ICON_KEYS.map((iconKey) => {
            const Icon = ICON_MAP[iconKey];
            const active = current === iconKey;
            return (
              <button
                key={iconKey}
                type="button"
                title={iconKey}
                onClick={() => setField(key, iconKey)}
                className={cn(
                  "focus-ring flex h-9 w-9 items-center justify-center rounded-lg border-[0.5px] transition-colors",
                  active
                    ? "border-brand-blue bg-brand-blue-light text-brand-blue"
                    : "border-border bg-surface text-text-muted hover:border-brand-blue hover:text-brand-blue"
                )}
              >
                <Icon className="h-4 w-4" />
              </button>
            );
          })}
        </div>
      );
    }

    return null;
  }

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (jsonError) {
      setMessage("Fix the invalid JSON field before saving.");
      return;
    }
    setSaving(true);
    setMessage(null);
    try {
      const finalSlug = isSingleton && singletonSlug ? singletonSlug : slugify(slug || "item");
      const res = await fetch("/api/admin/content", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: initial?.id, type, slug: finalSlug, data, published }),
      });
      if (!res.ok) {
        const body = (await res.json().catch(() => ({}))) as { error?: string };
        throw new Error(body.error ?? "Save failed");
      }
      router.push(`/admin/content/${type}`);
      router.refresh();
    } catch (err) {
      setMessage((err as Error).message);
      setSaving(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <Link
            href={`/admin/content/${type}`}
            className="focus-ring flex h-10 w-10 items-center justify-center rounded-full border border-border bg-background text-text-secondary transition-colors hover:bg-background-secondary"
            aria-label="Back to list"
          >
            <ArrowLeft01Icon className="h-4 w-4" />
          </Link>
          <div>
            <h1 className="text-xl font-semibold text-text-primary">
              {initial ? `Edit ${singular}` : `New ${singular}`}
            </h1>
            <p className="text-sm text-text-muted">{type}</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Link
            href={`/admin/content/${type}`}
            className="focus-ring inline-flex h-10 items-center rounded-full border border-border bg-background px-4 text-sm font-semibold text-text-secondary transition-colors hover:bg-background-secondary"
          >
            Cancel
          </Link>
          <button
            type="submit"
            disabled={saving}
            className="focus-ring inline-flex h-10 items-center gap-2 rounded-full bg-brand-blue px-5 text-sm font-semibold text-white transition-colors hover:bg-brand-blue-hover disabled:opacity-60"
          >
            {saving ? (
              <>
                <Loading01Icon className="h-4 w-4 animate-spin" /> Saving
              </>
            ) : (
              "Save"
            )}
          </button>
        </div>
      </div>

      {message && (
        <p className="rounded-xl border-[0.5px] border-red-500/30 bg-red-500/5 px-4 py-3 text-sm text-text-primary">
          {message}
        </p>
      )}

      {!isSingleton && (
        <div className="flex flex-col gap-1.5">
          <label htmlFor="slug-field" className={labelClasses}>
            Slug
          </label>
          <input
            id="slug-field"
            type="text"
            className={fieldClasses}
            value={slug}
            onChange={(e) => setSlug(e.target.value)}
            required
            placeholder="e.g. web-mobile-apps"
          />
          <p className="text-xs text-text-muted">Used in the URL for this item.</p>
        </div>
      )}

      <label className="flex items-center gap-2.5 text-sm font-medium text-text-secondary">
        <input
          type="checkbox"
          checked={published}
          onChange={(e) => setPublished(e.target.checked)}
          className="h-4 w-4 rounded border-border accent-brand-blue"
        />
        Published (visible on the live site)
      </label>

      <div className="grid gap-5 rounded-2xl border-[0.5px] border-border bg-surface p-5 sm:p-6">
        {fields.map((field) =>
          field.kind === "check" ? (
            <div key={field.key}>{fieldControl(field)}</div>
          ) : (
            <div key={field.key} className="flex flex-col gap-1.5">
              <label htmlFor={field.kind === "icon" ? undefined : `field-${field.key}`} className={labelClasses}>
                {field.label}
              </label>
              {fieldControl(field)}
              {field.helper && field.kind !== "json" && (
                <p className="text-xs text-text-muted">{field.helper}</p>
              )}
            </div>
          )
        )}
      </div>
    </form>
  );
}
