"use client";

import { useEffect, useRef, useCallback, useState } from "react";

/**
 * Cinematic layered background controller.
 *
 * Renders a fixed, full-viewport container behind all content. Every section the
 * admin has set to image mode gets its own background layer, drawn from the
 * image uploaded for that section. Each layer is clipped to the band its own
 * section occupies on screen, so the image travels with the section: it enters
 * with the section's top edge at the bottom of the viewport and leaves with its
 * bottom edge at the top. Nothing fades — the clip is the whole effect.
 *
 * Everything visible here is CMS-controlled (home-section bgMode + imageUrl,
 * with visual-chapter as the per-section-key fallback). No hardcoded imagery.
 */

type ChapterData = {
  sectionKey?: string;
  imageUrl?: string;
  mobileImageUrl?: string;
  focal?: string;
  overlayOpacity?: string | number;
};

type Chapter = { id?: number; slug?: string | null; data: ChapterData };

/**
 * Seeded Unsplash stock photos are not content. Rows left over from the old
 * fallback seed are ignored here so they fall through to whatever the admin
 * actually uploaded, rather than putting a stock photo on the page.
 */
function realUrl(url?: string): string | undefined {
  if (!url) return undefined;
  return url.includes("images.unsplash.com") ? undefined : url;
}

export default function CinematicBackground2({
  initialChapters,
}: {
  initialChapters: Chapter[];
}) {
  const chaptersRef = useRef(initialChapters || []);
  const [layers, setLayers] = useState<ChapterData[]>([]);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    // Nothing here is animated any more (the clip-path seam is a hard cut that
    // tracks the scroll), so there is no motion to reduce.
    const mq = window.matchMedia("(max-width: 767px)");
    const sync = () => setIsMobile(mq.matches);
    sync();
    mq.addEventListener("change", sync);
    return () => mq.removeEventListener("change", sync);
  }, []);

  useEffect(() => {
    chaptersRef.current = initialChapters || [];
  }, [initialChapters]);

  const layerRefs = useRef<Map<string, HTMLDivElement>>(new Map());
  const signatureRef = useRef<string>("");
  const ticking = useRef(false);
  const layersDirty = useRef(true);

  // Keep the ref map in sync with mounted nodes — a stale key kept a detached
  // node alive in the map and shadowed the layer that replaced it.
  const setLayerRef = useCallback((key: string, el: HTMLDivElement | null) => {
    if (el) layerRefs.current.set(key, el);
    else layerRefs.current.delete(key);
    // The set of nodes changed, so whatever state was last computed has not
    // been written to these nodes yet — force the next pass to apply it.
    layersDirty.current = true;
  }, []);

  useEffect(() => {
    let cleanup: (() => void) | undefined;

    const timer = setTimeout(() => {
      const sections = Array.from(
        document.querySelectorAll<HTMLElement>("[data-section-key]")
      ).filter((s) => !!s.dataset.sectionKey);
      if (sections.length === 0) return;

      // Visual-chapter fallbacks, keyed by section key.
      const fallback = new Map<string, ChapterData>();
      for (const c of chaptersRef.current) {
        const key = c.data?.sectionKey;
        if (key) fallback.set(key, c.data);
      }

      // One layer per image-mode section, in DOM order.
      //
      // The admin panel is the single source of truth, in this precedence:
      //   bgMode ....... `cinematic-image` class on the section (surface sections
      //                  paint an opaque panel, so a layer under one is invisible
      //                  — they get none).
      //   image ........ the section's own imageUrl, else the visual-chapter
      //                  matched on sectionKey, else the image carried forward
      //                  from the nearest configured neighbour (so a section
      //                  switched to image mode before its image is uploaded
      //                  shows that image rather than a hole).
      //
      // sectionKey is always written explicitly: it used to be inherited from the
      // visual-chapter, so every section that had no chapter collapsed onto the
      // same empty key and they all shared one layer — one image for the page.
      const resolved: (ChapterData | undefined)[] = sections.map((section) => {
        const base = fallback.get(section.dataset.sectionKey!);
        const mobile =
          realUrl(section.dataset.mobileImageUrl) ?? realUrl(base?.mobileImageUrl);
        const own = realUrl(section.dataset.imageUrl);
        if (own) return { ...base, imageUrl: own, mobileImageUrl: mobile };
        const chapter = realUrl(base?.imageUrl);
        return chapter
          ? { ...base, imageUrl: chapter, mobileImageUrl: mobile }
          : undefined;
      });

      // Fill the holes from the nearest configured neighbour — forwards first,
      // then backwards for sections that sit above every configured image.
      for (let i = 1; i < resolved.length; i++) {
        if (!resolved[i]) resolved[i] = resolved[i - 1];
      }
      for (let i = resolved.length - 2; i >= 0; i--) {
        if (!resolved[i]) resolved[i] = resolved[i + 1];
      }

      const seen = new Set<string>();
      const next: ChapterData[] = [];
      sections.forEach((section, i) => {
        const key = section.dataset.sectionKey!;
        const data = resolved[i];
        if (seen.has(key)) return;
        if (!section.classList.contains("cinematic-image")) return;
        if (!data?.imageUrl) return;
        seen.add(key);
        next.push({ ...data, sectionKey: key });
      });

      setLayers((prev) =>
        prev.length === next.length &&
        prev.every(
          (p, i) =>
            p.sectionKey === next[i].sectionKey &&
            p.imageUrl === next[i].imageUrl &&
            p.mobileImageUrl === next[i].mobileImageUrl
        )
          ? prev
          : next
      );

      for (const c of next) {
        if (c.imageUrl) new Image().src = c.imageUrl;
        if (c.mobileImageUrl) new Image().src = c.mobileImageUrl;
      }

      // Each layer is pinned to its own section's box on screen, so a section
      // brings its image in with it: the moment its top edge crosses the bottom
      // of the viewport, the image appears in exactly that sliver and grows as
      // the section rises.
      //
      // The previous model drew a single seam at the topmost section boundary
      // in view and let the layer below it run to the bottom of the screen. With
      // sections shorter than the viewport that meant a section entering from
      // the bottom kept showing its predecessor's image, and its own only
      // appeared once everything above it had scrolled past the viewport top —
      // the delayed, jumpy reveal.
      function update() {
        ticking.current = false;
        const vh = window.innerHeight;

        const bands: [HTMLDivElement, number, number][] = [];
        let signature = "";

        for (const section of sections) {
          const el = layerRefs.current.get(section.dataset.sectionKey!);
          if (!el) continue;
          const rect = section.getBoundingClientRect();
          const top = Math.round(Math.max(0, Math.min(vh, rect.top)));
          const bottom = Math.round(Math.max(0, Math.min(vh, rect.bottom)));
          bands.push([el, top, bottom]);
          signature += `${section.dataset.sectionKey}:${top}-${bottom};`;
        }

        // The dirty flag matters on first paint: this effect runs before React
        // has mounted the layer divs, so the ref map is still empty and the
        // signature is "". Without it the geometry looked unchanged on every
        // later frame, nothing was ever written, and the layers stayed hidden.
        if (!layersDirty.current && signature === signatureRef.current) return;
        layersDirty.current = false;
        signatureRef.current = signature;

        for (const [el, top, bottom] of bands) {
          // Offscreen: collapse to an empty polygon rather than dropping
          // opacity, so the layer keeps its decoded image and reappears without
          // a repaint flash.
          el.style.clipPath =
            bottom <= top
              ? "polygon(0 0, 0 0, 0 0, 0 0)"
              : `polygon(0 ${top}px, 100% ${top}px, 100% ${bottom}px, 0 ${bottom}px)`;
        }
      }

      function onScroll() {
        if (!ticking.current) {
          ticking.current = true;
          requestAnimationFrame(update);
        }
      }

      update();
      // Hybrid: scroll events for most browsers, rAF polling as a fallback for
      // smooth-scroll libraries (Lenis) that may not dispatch native events.
      window.addEventListener("scroll", onScroll, { passive: true });
      window.addEventListener("resize", onScroll, { passive: true });
      let rafId = requestAnimationFrame(function poll() {
        update();
        rafId = requestAnimationFrame(poll);
      });

      // This cleanup used to be returned from the setTimeout callback, where it
      // was discarded — the listeners and rAF loop leaked on every remount and
      // stacked up, so several controllers fought over the same layers.
      cleanup = () => {
        window.removeEventListener("scroll", onScroll);
        window.removeEventListener("resize", onScroll);
        cancelAnimationFrame(rafId);
      };
    }, 50);

    return () => {
      clearTimeout(timer);
      cleanup?.();
      layersDirty.current = true;
      signatureRef.current = "";
    };
  }, [initialChapters]);

  // `inset-0` alone sizes the container to the viewport. It used to also carry
  // `h-screen w-screen`, which measures 100vh/100vw — taller than
  // window.innerHeight while a mobile URL bar is showing, and wider than the
  // viewport when a scrollbar is present. The clip bands are in innerHeight
  // pixels, so the difference showed as the image sitting off its section.
  return (
    <div
      aria-hidden
      className="pointer-events-none fixed inset-0 z-0 overflow-hidden"
    >
      {/* No base plate. It used to paint solid black behind the layers, which
          showed through as dark space wherever a layer had not loaded or no
          image was configured. Uncovered ground is now the page background. */}
      {layers.map((c) => {
        const key = c.sectionKey!;
        const url = (isMobile && c.mobileImageUrl) || c.imageUrl!;
        const overlayOpacity = (Number(c.overlayOpacity) || 20) / 100;
        const focal = c.focal || "center center";

        return (
          <div
            key={key}
            ref={(el) => setLayerRef(key, el)}
            className="absolute inset-0"
            style={{
              // Quoted — an unquoted url() breaks on spaces or parentheses.
              backgroundImage: `url("${url.replace(/"/g, "%22")}")`,
              backgroundPosition: focal,
              backgroundSize: "cover",
              backgroundRepeat: "no-repeat",
              clipPath: "polygon(0 0, 0 0, 0 0, 0 0)",
              willChange: "clip-path",
            }}
          >
            <div
              className="absolute inset-0"
              style={{ background: `rgba(10, 12, 18, ${overlayOpacity})` }}
            />
          </div>
        );
      })}
    </div>
  );
}
