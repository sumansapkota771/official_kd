"use client";

import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { GoogleLogo } from "@/components/ui/google-logo";
import { Loading01Icon, Shield01Icon } from "hugeicons-react";

const fieldClasses =
  "focus-ring w-full rounded-xl border-[0.5px] border-border bg-background px-4 py-2.5 text-sm text-text-primary placeholder:text-text-muted focus-visible:border-brand-blue";

const ERROR_MESSAGES: Record<string, string> = {
  google_unconfigured: "Google sign-in is not configured yet. Use the credentials form.",
  google_failed: "Google sign-in failed. Please try again.",
};

export function LoginForm({
  googleConfigured,
  error: serverError,
}: {
  googleConfigured: boolean;
  error?: string;
}) {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(
    serverError ? (ERROR_MESSAGES[serverError] ?? serverError) : null
  );

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      if (!res.ok) throw new Error("bad");
      router.push("/admin");
      router.refresh();
    } catch {
      setError("Invalid credentials. Try again.");
      setLoading(false);
    }
  }

  return (
    <div className="card w-full max-w-md p-8">
      <div className="flex items-center gap-3">
        <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-brand-blue/10 text-brand-blue">
          <Shield01Icon className="h-5 w-5" />
        </span>
        <div>
          <h1 className="text-lg font-semibold text-text-primary">Admin Panel</h1>
          <p className="text-xs text-text-muted">Sign in to manage the KodeDristi site</p>
        </div>
      </div>

      {error && (
        <p className="mt-5 rounded-xl border-[0.5px] border-red-500/30 bg-red-500/5 px-4 py-3 text-sm text-text-primary">
          {error}
        </p>
      )}

      {googleConfigured && (
        <>
          <a
            href="/api/auth/google"
            className="focus-ring mt-6 inline-flex h-11 w-full items-center justify-center gap-2 rounded-full border-[0.5px] border-border bg-white font-semibold text-text-primary shadow-sm transition-colors hover:bg-background-secondary"
          >
            <GoogleLogo className="h-4 w-4" /> Continue with Google
          </a>
          <div className="my-6 flex items-center gap-3 text-[11px] font-semibold uppercase tracking-wider text-text-muted">
            <span className="h-px flex-1 bg-border" /> or <span className="h-px flex-1 bg-border" />
          </div>
        </>
      )}

      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <div className="flex flex-col gap-1.5">
          <label htmlFor="admin-email" className="text-sm font-medium text-text-secondary">
            Email
          </label>
          <input
            id="admin-email"
            type="email"
            required
            autoComplete="username"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className={fieldClasses}
            placeholder="admin@kodedristi.com"
          />
        </div>
        <div className="flex flex-col gap-1.5">
          <label htmlFor="admin-password" className="text-sm font-medium text-text-secondary">
            Password
          </label>
          <input
            id="admin-password"
            type="password"
            required
            autoComplete="current-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className={fieldClasses}
            placeholder="••••••••"
          />
        </div>
        <button
          type="submit"
          disabled={loading}
          className="focus-ring mt-1 inline-flex h-11 w-full items-center justify-center gap-2 rounded-full bg-brand-blue font-semibold text-white transition-colors hover:bg-brand-blue-hover disabled:opacity-60"
        >
          {loading ? (
            <>
              <Loading01Icon className="h-4 w-4 animate-spin" /> Signing in
            </>
          ) : (
            "Sign in to Dashboard"
          )}
        </button>
      </form>
    </div>
  );
}
