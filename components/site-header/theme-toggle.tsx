"use client";

import { useEffect, useState } from "react";
import { useTheme } from "next-themes";
import { Moon02Icon, Sun01Icon } from "hugeicons-react";
import { cn } from "@/lib/utils";

export function ThemeToggle({ className }: { className?: string }) {
  const { resolvedTheme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  // next-themes only knows the resolved theme after the client mounts;
  // this guard prevents a server/client hydration mismatch on first paint.
  // eslint-disable-next-line react-hooks/set-state-in-effect
  useEffect(() => setMounted(true), []);

  const isDark = mounted && resolvedTheme === "dark";

  return (
    <button
      type="button"
      onClick={() => setTheme(isDark ? "light" : "dark")}
      aria-label="Toggle color theme"
      className={cn(
        "focus-ring inline-flex h-8 w-8 items-center justify-center rounded-[var(--radius-sm)] border border-border text-text-secondary transition-colors hover:border-brand-blue hover:text-link",
        className
      )}
    >
      {isDark ? <Sun01Icon className="h-6 w-6" /> : <Moon02Icon className="h-6 w-6" />}
    </button>
  );
}
