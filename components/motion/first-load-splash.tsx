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
 * Deliberately bare: the mark on the page's own background, easing up to
 * full size, and nothing else. It previously sat inside a breathing halo and
 * a sonar ring with a progress beam beneath, all of which have been removed —
 * a splash that decorates itself competes with the site it is introducing.
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
          {/* The mark alone. The halo, the sonar ring and the progress track
              that used to surround it are gone by request — with them removed
              the logo is the whole splash, and its own settle is the only
              motion left. */}
          <motion.div
            initial={{ opacity: 0, scale: 0.94 }}
            animate={{ opacity: 1, scale: 1 }}
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
        </motion.div>
      )}
    </AnimatePresence>
  );
}
