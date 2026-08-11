"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Logout02Icon } from "hugeicons-react";

export function LogoutButton() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  return (
    <button
      type="button"
      disabled={loading}
      onClick={async () => {
        setLoading(true);
        await fetch("/api/auth/logout", { method: "POST" }).catch(() => {});
        router.push("/");
        router.refresh();
      }}
      className="focus-ring inline-flex h-10 items-center gap-2 rounded-full border border-border bg-background px-4 text-sm font-semibold text-text-secondary transition-colors hover:bg-background-secondary disabled:opacity-60"
    >
      <Logout02Icon className="h-4 w-4" /> Sign out
    </button>
  );
}
