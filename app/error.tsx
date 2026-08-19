"use client";

import { useEffect } from "react";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("[GlobalError]", error);
  }, [error]);

  return (
    <section className="mx-auto flex min-h-[60vh] max-w-3xl flex-col items-center justify-center px-5 py-24 text-center">
      <p className="font-heading text-[7rem] font-black leading-none tracking-tighter text-text-muted opacity-20">
        500
      </p>
      <h1 className="mt-4 font-heading text-3xl font-bold text-text-primary">
        Something went wrong
      </h1>
      <p className="mt-3 max-w-md text-text-muted">
        An unexpected error occurred. Please try again.
      </p>
      <button
        onClick={reset}
        className="mt-8 inline-flex items-center gap-2 rounded-lg bg-brand-blue px-6 py-3 text-sm font-semibold text-white transition hover:bg-brand-blue-hover"
      >
        Try again
      </button>
    </section>
  );
}
