"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { AnimatePresence, motion } from "framer-motion";

/**
 * First-load splash: the animated KodeDristi logo shown once, while the
 * site's initial page load is finishing.
 *
 * Why it only appears once: it mounts in the root layout, and Next.js keeps
 * the layout mounted across client-side navigations, so the effect never
 * re-runs on subsequent route changes.
 *
 * The treatment echoes the hero's glass-core 3D language:
 *  - the logo springs in over a soft, breathing blue→green glass halo,
 *  - a sonar ring pings outward like a glass sphere,
 *  - a thin green beam sweeps the track beneath it.
 *
 * It holds for a minimum time so it reads as deliberate, then fades out once
 * the window has loaded (capped by MAX_WAIT_MS as a backstop). Under
 * `prefers-reduced-motion` it only flashes quietly before yielding.
 */

const MIN_HOLD_MS = 1800;
const MAX_WAIT_MS = 3200;

function prefersReducedMotion() {
  return (
    typeof window !== "undefined" &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches
  );
}

export function FirstLoadSplash() {
  const [visible, setVisible] = useState(true);
  const settled = useRef(false);

  useEffect(() => {
    if (prefersReducedMotion()) {
      const timer = setTimeout(() => setVisible(false), 250);
      return () => clearTimeout(timer);
    }

    let loaded = document.readyState === "complete";
    const maybeHide = () => {
      if (!loaded || settled.current) return;
      settled.current = true;
      setVisible(false);
    };
    const forceHide = () => {
      settled.current = true;
      setVisible(false);
    };

    const onLoad = () => {
      loaded = true;
      maybeHide();
    };

    const minHold = setTimeout(maybeHide, MIN_HOLD_MS);
    const maxWait = setTimeout(forceHide, MAX_WAIT_MS);

    window.addEventListener("load", onLoad);
    return () => {
      window.removeEventListener("load", onLoad);
      clearTimeout(minHold);
      clearTimeout(maxWait);
    };
  }, []);

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          key="first-load-splash"
          className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-background"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
          role="status"
          aria-label="KodeDristi is loading"
        >
          <div className="relative flex flex-col items-center gap-8">
            <div className="relative">
              <div className="splash-halo absolute -inset-10 rounded-full" aria-hidden="true" />
              <div className="splash-ring absolute -inset-6 rounded-full" aria-hidden="true" />
              <motion.div
                initial={{ opacity: 0, scale: 0.86, y: 12 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
              >
                <div className="relative h-24 w-[214px]">
                  <Image
                    src="/images/logo.png"
                    alt="KodeDristi Software Pvt. Ltd."
                    fill
                    priority
                    className="object-contain object-center"
                    sizes="214px"
                  />
                </div>
              </motion.div>
            </div>

            <div className="h-[3px] w-56 overflow-hidden rounded-full bg-surface-elevated">
              <div className="loader-bar h-full w-2/5 rounded-full bg-brand-green" />
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
