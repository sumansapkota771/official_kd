"use client";

import { useCallback, useSyncExternalStore } from "react";

/**
 * Subscribes to a CSS media query.
 *
 * Uses `useSyncExternalStore` rather than the usual effect-plus-setState
 * pattern: matchMedia *is* an external store, and this is the API built for
 * reading one. It also gives a correct server snapshot for free, so nothing
 * has to guess at a value during SSR.
 *
 * The server snapshot is always `false`, which makes "off" the pre-hydration
 * default — every consumer must therefore treat its effect as an enhancement
 * layered on afterwards, never as something the first paint depends on.
 */
export function useMediaQuery(query: string): boolean {
  const subscribe = useCallback(
    (onChange: () => void) => {
      const list = window.matchMedia(query);
      list.addEventListener("change", onChange);
      return () => list.removeEventListener("change", onChange);
    },
    [query]
  );

  return useSyncExternalStore(
    subscribe,
    () => window.matchMedia(query).matches,
    () => false
  );
}
