"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";

export function LangToggle({ className }: { className?: string }) {
  const [lang, setLang] = useState<"EN" | "NE">("EN");

  return (
    <div
      className={cn(
        "inline-flex items-center overflow-hidden rounded-full border-[0.5px] border-border text-[11px] font-bold",
        className
      )}
      role="group"
      aria-label="Select language"
    >
      {(["EN", "NE"] as const).map((code) => (
        <button
          key={code}
          type="button"
          onClick={() => setLang(code)}
          aria-pressed={lang === code}
          className={cn(
            "px-2.5 py-1 transition-colors",
            lang === code
              ? "bg-brand-blue text-white"
              : "bg-transparent text-text-muted hover:text-link"
          )}
        >
          {code}
        </button>
      ))}
    </div>
  );
}
