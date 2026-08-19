"use client";

import { useEffect, useRef, useCallback, useState } from "react";

/**
 * Cinematic layered background controller.
 *
 * Renders a fixed, full-viewport container behind all content. Each visual-chapter
 * from the CMS that has an imageUrl gets a background image layer. The layers use
 * clip-path polygon seams between sections — as the user scrolls, the seam moves,
 * revealing the next image from bottom to top.
 *
 * Which sections get images vs solid backgrounds is controlled entirely by the
 * CMS (home-section bgMode + visual-chapter imageUrl). No hardcoded sets.
 */

type ChapterData = {
  sectionKey?: string;
  imageUrl?: string;
  mobileImageUrl?: string;
  focal?: string;
  overlayOpacity?: string | number;
};

type Chapter = { id?: number; slug?: string | null; data: ChapterData };

export default function CinematicBackground2({
  initialChapters,
}: {
  initialChapters: Chapter[];
}) {
  const prefersReduced = useRef(false);

  useEffect(() => {
    prefersReduced.current =
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  }, []);

  const chaptersRef = useRef(initialChapters || []);
  const [mergedChapters, setMergedChapters] = useState<Chapter[]>(initialChapters || []);

  useEffect(() => {
    chaptersRef.current = initialChapters || [];
  }, [initialChapters]);

  const layerRefs = useRef<Map<string, HTMLDivElement>>(new Map());
  const seamRef = useRef<number | null>(null);
  const topLayerRef = useRef<string | null>(null);
  const bottomLayerRef = useRef<string | null>(null);
  const ticking = useRef(false);
  const sectionsKeyRef = useRef<string>("");

  const setLayerRef = useCallback(
    (key: string, el: HTMLDivElement | null) => {
      if (el) layerRefs.current.set(key, el);
    },
    []
  );

  useEffect(() => {
    const timer = setTimeout(() => {
      // Get ALL sections with data-section-key (CMS-controlled order)
      const sections = Array.from(
        document.querySelectorAll<HTMLElement>("[data-section-key]")
      );
      if (sections.length === 0) return;

      // Build a map of visual-chapter data by section key.
      // Per-section imageUrl from home-section takes priority over visual-chapter fallback.
      const chapterMap = new Map<string, Chapter>();
      for (const c of chaptersRef.current) {
        const key = c.data?.sectionKey;
        if (key) chapterMap.set(key, c);
      }

      // Override imageUrl with per-section data-image-url attributes from the DOM
      for (const section of sections) {
        const key = section.dataset.sectionKey;
        const directUrl = section.dataset.imageUrl;
        const mobileUrl = section.dataset.mobileImageUrl;
        if (!key) continue;
        if (directUrl) {
          const existing = chapterMap.get(key);
          chapterMap.set(key, {
            ...existing,
            data: { ...existing?.data, imageUrl: directUrl, mobileImageUrl: mobileUrl || existing?.data?.mobileImageUrl },
          });
        }
      }

      // Update merged chapters for layer rendering
      const merged = Array.from(chapterMap.values());
      setMergedChapters(merged);

      // Preload all images
      for (const [, c] of chapterMap) {
        if (c.data?.imageUrl) {
          new Image().src = c.data.imageUrl;
        }
      }

      function update() {
        ticking.current = false;
        const vh = window.innerHeight;

        // At top of page — show first section's image
        const atTop =
          window.scrollY < 10 ||
          (sections[0] &&
            sections[0].getBoundingClientRect().top >= -20 &&
            sections[0].getBoundingClientRect().top <= vh * 0.3);

        if (atTop) {
          applyState(sections[0].dataset.sectionKey!, null, null);
          return;
        }

        // Find the first section whose top is below viewport top
        let seamIndex = -1;
        for (let i = 0; i < sections.length; i++) {
          if (sections[i].getBoundingClientRect().top > 0) {
            seamIndex = i;
            break;
          }
        }

        if (seamIndex === -1) {
          // All sections scrolled past — show last section's image
          const last = sections[sections.length - 1];
          applyState(last.dataset.sectionKey!, null, null);
          return;
        }

        const nextSection = sections[seamIndex];
        const prevSection = seamIndex > 0 ? sections[seamIndex - 1] : null;
        const seamY = nextSection.getBoundingClientRect().top;

        const topKey =
          prevSection?.dataset.sectionKey ?? sections[0].dataset.sectionKey!;
        const bottomKey = nextSection.dataset.sectionKey!;

        applyState(topKey, bottomKey, seamY);
      }

      function applyState(
        topKey: string,
        bottomKey: string | null,
        seamY: number | null
      ) {
        const layers = layerRefs.current;
        const reduced = prefersReduced.current;

        if (
          topKey === topLayerRef.current &&
          bottomKey === bottomLayerRef.current &&
          seamY === seamRef.current
        ) {
          return;
        }

        topLayerRef.current = topKey;
        bottomLayerRef.current = bottomKey;
        seamRef.current = seamY;

        for (const [key, el] of layers) {
          const isTop = key === topKey;
          const isBottom = key === bottomKey;

          if (!isTop && !isBottom) {
            el.style.opacity = "0";
            el.style.clipPath = "none";
            el.style.transition = reduced ? "none" : "opacity 120ms linear";
            continue;
          }

          el.style.opacity = "1";
          el.style.transition = reduced
            ? "none"
            : "clip-path 180ms cubic-bezier(0.22,1,0.36,1), opacity 120ms linear";
          el.style.willChange = "clip-path,opacity";

          if (seamY === null) {
            el.style.clipPath = "polygon(0 0, 100% 0, 100% 100%, 0 100%)";
          } else if (isTop) {
            const y = Math.max(0, Math.min(seamY, window.innerHeight));
            el.style.clipPath = `polygon(0 0, 100% 0, 100% ${y}px, 0 ${y}px)`;
          } else {
            const y = Math.max(0, Math.min(seamY, window.innerHeight));
            el.style.clipPath = `polygon(0 ${y}px, 100% ${y}px, 100% 100%, 0 100%)`;
          }
        }
      }

      function onScroll() {
        if (!ticking.current) {
          ticking.current = true;
          requestAnimationFrame(update);
        }
      }

      update();
      // Hybrid: scroll events for most browsers, rAF polling as fallback
      // for smooth-scroll libraries (Lenis) that may not dispatch native events.
      window.addEventListener("scroll", onScroll, { passive: true });
      window.addEventListener("resize", onScroll, { passive: true });
      let rafId = 0;
      const poll = () => {
        update();
        rafId = requestAnimationFrame(poll);
      };
      rafId = requestAnimationFrame(poll);

      return () => {
        window.removeEventListener("scroll", onScroll);
        window.removeEventListener("resize", onScroll);
        cancelAnimationFrame(rafId);
      };
    }, 50);

    return () => clearTimeout(timer);
  }, [initialChapters]);

  // Render a layer for EVERY visual-chapter that has an imageUrl
  // Sections without an imageUrl in the CMS simply won't have a layer
  const imageLayers = mergedChapters.filter((c) => c.data?.imageUrl);

  return (
    <div
      aria-hidden
      className="pointer-events-none fixed inset-0 -z-10 h-screen w-screen overflow-hidden"
    >
      <div className="absolute inset-0 bg-black" />
      {imageLayers.map((c) => {
        const key = c.data?.sectionKey ?? "";
        const url = c.data?.imageUrl;
        const overlayOpacity = (Number(c.data?.overlayOpacity) || 20) / 100;
        const focal = c.data?.focal || "center center";

        return (
          <div
            key={key}
            ref={(el) => setLayerRef(key, el)}
            className="absolute inset-0"
            style={{
              backgroundImage: url ? `url(${url})` : undefined,
              backgroundPosition: focal,
              backgroundSize: "cover",
              opacity: 0,
              clipPath: "polygon(0 0, 100% 0, 100% 100%, 0 100%)",
            }}
          >
            <div
              className="absolute inset-0"
              style={{
                background: `rgba(10, 12, 18, ${overlayOpacity})`,
                pointerEvents: "none",
              }}
            />
          </div>
        );
      })}
    </div>
  );
}
