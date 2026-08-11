"use client";

import { useSyncExternalStore } from "react";
import { Cancel01Icon, InformationSquareIcon } from "hugeicons-react";

const CONSENT_EVENT = "kd-consent-change";

function getSnapshot(): string {
  return typeof document === "undefined" ? "" : document.cookie;
}

function getServerSnapshot(): string {
  return "";
}

function subscribe(onChange: () => void) {
  window.addEventListener(CONSENT_EVENT, onChange);
  return () => window.removeEventListener(CONSENT_EVENT, onChange);
}

export function CookieConsent() {
  const cookie = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
  const consented = cookie.split(";").some((c) => c.trim().startsWith("kd_consent="));

  if (consented) return null;

  function choose(value: "accepted" | "essential") {
    document.cookie = `kd_consent=${value}; path=/; max-age=31536000; samesite=lax`;
    window.dispatchEvent(new Event(CONSENT_EVENT));
  }

  return (
    <div className="fixed inset-x-4 bottom-4 z-[90] sm:inset-x-auto sm:right-6 sm:bottom-6 sm:w-[400px]">
      <div className="panel p-5 shadow-elevated">
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-2">
            <InformationSquareIcon className="h-5 w-5 text-brand-blue" />
            <h3 className="text-sm font-semibold text-text-primary">We use cookies</h3>
          </div>
          <button
            onClick={() => choose("essential")}
            aria-label="Dismiss"
            className="focus-ring rounded-full p-1 text-text-muted transition-colors hover:bg-background-secondary"
          >
            <Cancel01Icon className="h-4 w-4" />
          </button>
        </div>
        <p className="mt-2 text-[13px] leading-relaxed text-text-muted">
          We use a small set of essential cookies to count unique visitors, keep you signed in, and
          remember your preferences. Nothing is sold or shared.
        </p>
        <div className="mt-4 flex flex-wrap gap-2">
          <button
            onClick={() => choose("accepted")}
            className="focus-ring inline-flex h-9 items-center justify-center rounded-full bg-brand-blue px-5 text-sm font-semibold text-white transition-colors hover:bg-brand-blue-hover"
          >
            Accept all
          </button>
          <button
            onClick={() => choose("essential")}
            className="focus-ring inline-flex h-9 items-center justify-center rounded-full border border-border bg-background px-5 text-sm font-semibold text-text-secondary transition-colors hover:bg-background-secondary"
          >
            Essential only
          </button>
        </div>
      </div>
    </div>
  );
}
