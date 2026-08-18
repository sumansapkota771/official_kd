"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { GoogleLogo } from "@/components/ui/google-logo";
import { cn } from "@/lib/utils";
import { DashboardSquare01Icon, UserIcon, Logout02Icon } from "hugeicons-react";

type SessionUser = {
  email: string;
  name: string | null;
  avatar: string | null;
  role: "admin" | "user";
};

export function SignInButton({ compact = false }: { compact?: boolean }) {
  const [user, setUser] = useState<SessionUser | null | undefined>(undefined);

  useEffect(() => {
    let cancelled = false;
    fetch("/api/auth/me")
      .then((r) => r.json())
      .then((d) => {
        if (!cancelled) setUser(d?.user ?? null);
      })
      .catch(() => {
        if (!cancelled) setUser(null);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  if (user === undefined) {
    return <div className="h-9 w-24 rounded-full bg-text-secondary/10" aria-hidden />;
  }

  if (!user) {
    return (
      <Link
        href="/api/auth/google"
        className={cn(
          "focus-ring inline-flex items-center justify-center gap-2 rounded-full border-[0.5px] border-border bg-white font-semibold text-brand-blue shadow-sm transition-colors hover:bg-background-secondary",
          compact ? "h-9 px-4 text-xs" : "h-10 px-5 text-sm"
        )}
      >
        <GoogleLogo className="h-4 w-4" /> Sign in
      </Link>
    );
  }

  return (
    <div className="flex items-center gap-1.5">
      <Link
        href={user.role === "admin" ? "/admin" : "/profile"}
        className={cn(
          "focus-ring group flex items-center gap-2 rounded-full border-[0.5px] border-border bg-white py-1 pl-1 pr-3 text-sm font-medium text-text-primary shadow-sm transition-colors hover:bg-background-secondary"
        )}
      >
        {user.avatar ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={user.avatar}
            alt=""
            className="h-7 w-7 rounded-full object-cover"
            referrerPolicy="no-referrer"
          />
        ) : (
          <span className="flex h-7 w-7 items-center justify-center rounded-full bg-brand-blue text-xs font-bold text-white">
            {(user.name ?? user.email).charAt(0).toUpperCase()}
          </span>
        )}
        <span className="max-w-[120px] truncate">{user.name ?? user.email}</span>
        {user.role === "admin" ? (
          <DashboardSquare01Icon className="h-5.25 w-5.25 text-brand-blue" />
        ) : (
          <UserIcon className="h-5.25 w-5.25 text-text-muted" />
        )}
      </Link>
      <LogoutButton />
    </div>
  );
}

function LogoutButton() {
  const router = useRouter();
  const [loggingOut, setLoggingOut] = useState(false);
  return (
    <button
      type="button"
      aria-label="Sign out"
      disabled={loggingOut}
      onClick={async () => {
        setLoggingOut(true);
        await fetch("/api/auth/logout", { method: "POST" }).catch(() => {});
        router.push("/");
      }}
      className="focus-ring inline-flex h-9 w-9 items-center justify-center rounded-full border-[0.5px] border-border bg-white text-text-secondary shadow-sm transition-colors hover:bg-background-secondary disabled:opacity-60"
    >
      <Logout02Icon className="h-6 w-6" />
    </button>
  );
}
