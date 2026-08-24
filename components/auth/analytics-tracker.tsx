"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";

export function AnalyticsTracker() {
  const pathname = usePathname();

  useEffect(() => {
    if (pathname.startsWith("/admin")) return;
    let visitorId = localStorage.getItem("kd_vid");
    if (!visitorId) {
      visitorId =
        typeof crypto !== "undefined" && typeof crypto.randomUUID === "function"
          ? crypto.randomUUID()
          : `${Date.now()}-${Math.random().toString(36).slice(2, 11)}`;
      localStorage.setItem("kd_vid", visitorId);
      document.cookie = `kd_vid=${visitorId}; path=/; max-age=31536000; samesite=lax`;
    }
    const t = window.setTimeout(
      () => {
        fetch("/api/analytics/track", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ page: pathname, visitorId }),
          keepalive: true,
        }).catch(() => {});
      },
      300
    );
    return () => window.clearTimeout(t);
  }, [pathname]);

  return null;
}
