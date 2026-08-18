"use client";

import { useMediaQuery } from "@/lib/hooks/use-media-query";

/**
 * True when the primary input is a precise pointer (mouse/trackpad).
 *
 * Pointer-following effects are meaningless on touch — there is no cursor to
 * follow, and the effect only fires *after* a tap has already landed, which
 * reads as a glitch. Gating on capability rather than viewport width is what
 * keeps a touchscreen laptop and a phone both behaving correctly.
 *
 * False until hydration, so every consumer must degrade gracefully to "off".
 */
export function useFinePointer(): boolean {
  return useMediaQuery("(pointer: fine)");
}
