"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import Lenis from "lenis";

/**
 * Smooth scrolling for the marketing site.
 *
 * Lenis was already a dependency but had never been wired up. It is mounted
 * here rather than in the layout so it can be scoped by route and torn down
 * cleanly on navigation.
 *
 * Deliberately NOT applied to /admin: the panel is a data tool where people
 * scan long tables, and inertial scrolling actively fights that. Smoothing
 * belongs on pages you read, not pages you work in.
 */
export function SmoothScroll() {
  const pathname = usePathname();
  const isAdmin = pathname.startsWith("/admin");

  useEffect(() => {
    if (isAdmin) return;

    // Honour the OS setting. Inertial scrolling is a vestibular trigger, so
    // this is a hard opt-out, not a reduced-intensity path.
    const motionQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (motionQuery.matches) return;

    const lenis = new Lenis({
      // Tuned to feel like weight rather than lag. Higher lerp values drift
      // behind the input device and read as input latency.
      lerp: 0.12,
      wheelMultiplier: 1,
      // Native touch scrolling on mobile: the OS already does this well, and
      // overriding it costs battery and breaks pull-to-refresh.
      syncTouch: false,
    });

    let frame = 0;
    const raf = (time: number) => {
      lenis.raf(time);
      frame = requestAnimationFrame(raf);
    };
    frame = requestAnimationFrame(raf);

    return () => {
      cancelAnimationFrame(frame);
      lenis.destroy();
    };
  }, [isAdmin]);

  return null;
}
