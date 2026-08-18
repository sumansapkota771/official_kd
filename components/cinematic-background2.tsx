"use client";

import { useEffect, useRef, useState, useCallback } from "react";

/**
 * Cinematic layered background controller.
 *
 * Renders a fixed, full-viewport container behind all content. Each homepage
 * section that should have a background image gets a layer. The layers use
 * `clip-path: polygon()` to create a physical "seam" between sections — as
 * the user scrolls, the seam moves, revealing the next image from bottom to
 * top like a page being peeled back.
 *
 * Architecture:
 * - Fixed container at z-index -10 (behind all content)
 * - Each image layer is position:absolute, inset:0, with background-size:cover
 * - Only two layers are visible at any time: "top" (above seam) and "bottom" (below seam)
 * - Seam position = the top edge of the next section in viewport coordinates
 * - Hero image is special: shows fully when at top of page
 *
 * The section ordering and which sections get images is derived from the DOM
 * via `[data-section-key]` attributes. The images come from the CMS
 * (visual-chapter content type) or fallback data.
 */

type Chapter = { id?: number; slug?: string; data: Record<string, any> };

// All sections that participate in the cinematic background system.
// Sections NOT in this list act as solid surfaces that mask images.
const IMAGE_SECTIONS = new Set([
  "hero",
  "home-flagship",
  "courses-overview",
  "team-overview",
  "testimonials",
]);

export default function CinematicBackground2({
  initialChapters,
}: {
  initialChapters: Chapter[];
}) {
  const [chapters, setChapters] = useState<Chapter[]>(initialChapters || []);
  const prefersReduced = useRef(false);

  useEffect(() => {
    prefersReduced.current =
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  }, []);

  useEffect(() => {
    setChapters(initialChapters || []);
  }, [initialChapters]);

  // Refs for scroll tracking — no state updates in the scroll loop
  const layerRefs = useRef<Map<string, HTMLDivElement>>(new Map());
  const seamRef = useRef<number | null>(null);
  const topLayerRef = useRef<string | null>(null);
  const bottomLayerRef = useRef<string | null>(null);
  const ticking = useRef(false);

  // Register layer DOM nodes
  const setLayerRef = useCallback(
    (key: string, el: HTMLDivElement | null) => {
      if (el) layerRefs.current.set(key, el);
      else layerRefs.current.delete(key);
    },
    []
  );

  useEffect(() => {
    // Wait for DOM to be ready
    const timer = setTimeout(() => {
      const allSections = Array.from(
        document.querySelectorAll<HTMLElement>("[data-section-key]")
      );
      const sections = allSections.filter((s) =>
        IMAGE_SECTIONS.has(s.dataset.sectionKey ?? "")
      );
      if (sections.length === 0) return;

      // Build a map of chapter data by section key
      const chapterMap = new Map<string, Chapter>();
      for (const c of chapters) {
        const key = c.data?.sectionKey;
        if (key) chapterMap.set(key, c);
      }

      // Preload images
      for (const c of chapters) {
        if (c.data?.imageUrl) {
          new Image().src = c.data.imageUrl;
        }
      }

      function update() {
        ticking.current = false;
        const vh = window.innerHeight;

        // Check if we're at the very top
        const atTop =
          window.scrollY < 10 ||
          (sections[0] &&
            sections[0].getBoundingClientRect().top >= -20 &&
            sections[0].getBoundingClientRect().top <= vh * 0.3);

        if (atTop) {
          // Hero fully visible, no seam
          applyState(sections[0].dataset.sectionKey!, null, null);
          return;
        }

        // Find which section boundary is at or above the viewport top
        // We want the seam between the section that just scrolled past
        // and the next one coming up
        let seamIndex = -1;
        for (let i = 0; i < sections.length; i++) {
          const rect = sections[i].getBoundingClientRect();
          if (rect.top > 0) {
            // This section is below the viewport top
            seamIndex = i;
            break;
          }
        }

        if (seamIndex === -1) {
          // All sections scrolled past — show last image
          const last = sections[sections.length - 1];
          applyState(last.dataset.sectionKey!, null, null);
          return;
        }

        const nextSection = sections[seamIndex];
        const prevSection = seamIndex > 0 ? sections[seamIndex - 1] : null;
        const seamY = nextSection.getBoundingClientRect().top;

        const topKey = prevSection?.dataset.sectionKey ?? sections[0].dataset.sectionKey!;
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

        // Skip if nothing changed
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
            // Hidden layer — fast opacity fade, no clip-path
            el.style.opacity = "0";
            el.style.clipPath = "none";
            el.style.transition = reduced ? "none" : "opacity 120ms linear";
            continue;
          }

          // Visible layer
          el.style.opacity = "1";
          el.style.transition = reduced
            ? "none"
            : "clip-path 180ms cubic-bezier(0.22,1,0.36,1), opacity 120ms linear";
          el.style.willChange = "clip-path,opacity";

          if (seamY === null) {
            // No seam — show full image
            el.style.clipPath = "polygon(0 0, 100% 0, 100% 100%, 0 100%)";
          } else if (isTop) {
            // Top layer: visible above the seam
            const y = Math.max(0, Math.min(seamY, window.innerHeight));
            el.style.clipPath = `polygon(0 0, 100% 0, 100% ${y}px, 0 ${y}px)`;
          } else {
            // Bottom layer: visible below the seam
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

      // Initial paint
      update();

      window.addEventListener("scroll", onScroll, { passive: true });
      window.addEventListener("resize", onScroll, { passive: true });

      return () => {
        window.removeEventListener("scroll", onScroll);
        window.removeEventListener("resize", onScroll);
      };
    }, 50); // Small delay to ensure DOM is ready

    return () => clearTimeout(timer);
  }, [chapters]);

  // Build the ordered list of layers from chapters
  const orderedLayers = chapters.filter(
    (c) => c.data?.sectionKey && IMAGE_SECTIONS.has(c.data.sectionKey)
  );

  return (
    <div
      aria-hidden
      className="pointer-events-none fixed inset-0 -z-10 h-screen w-screen overflow-hidden"
    >
      <div className="absolute inset-0 bg-black" />
      {orderedLayers.map((c) => {
        const key = c.data.sectionKey;
        const url = c.data.imageUrl;
        const overlayOpacity = (Number(c.data.overlayOpacity) || 20) / 100;
        const focal = c.data.focal || "center center";

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
            {/* Dark overlay for text readability */}
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
