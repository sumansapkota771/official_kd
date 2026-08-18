"use client";

import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";

type Chapter = {
  id?: number;
  slug?: string;
  data: Record<string, any>;
};

function clamp(v: number, a = 0, b = 1) {
  return Math.max(a, Math.min(b, v));
}

export default function CinematicBackground({ initialChapters }: { initialChapters: Chapter[] }) {
  const [chapters, setChapters] = useState<Chapter[]>(initialChapters || []);
  const [opacities, setOpacities] = useState<Record<string, number>>({});
  const containerRef = useRef<HTMLDivElement | null>(null);
  const prefersReduced = typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  useEffect(() => {
    setChapters(initialChapters || []);
  }, [initialChapters]);
  useEffect(() => {    // Scroll-driven pairwise crossfade: when a section (next) moves from bottom
    // into the viewport, crossfade between the previous (hero) and the next
    // based on how far the next section's top has traveled into the viewport.
    const sections = Array.from(document.querySelectorAll<HTMLElement>("[data-section-key]"));
    if (sections.length === 0) return;
    let running = false;
    function update() {      running = false;      const vh = window.innerHeight || document.documentElement.clientHeight;
      const rects = sections.map((s) => s.getBoundingClientRect());
      // Find the adjacent pair where next.top is inside (0, vh)      let pairIndex = -1;      for (let i = 0; i < rects.length - 1; i++) {        const nextTop = rects[i + 1].top;        if (nextTop > 0 && nextTop < vh) {          pairIndex = i;          break;        }      }
      const nextOpacities: Record<string, number> = {};
      if (pairIndex >= 0) {        const prevKey = sections[pairIndex].dataset.sectionKey ?? "";        const nextKey = sections[pairIndex + 1].dataset.sectionKey ?? "";        const nextTop = rects[pairIndex + 1].top;        const progress = clamp(1 - nextTop / vh, 0, 1); // 0 -> next below; 1 -> next at top
        // prev fades out, next fades in        nextOpacities[prevKey] = 1 - progress;        nextOpacities[nextKey] = progress;        // Preload the next image when progress > 0.1        if (progress > 0.1) {          const chapterNext = chapters.find((c) => c.data?.sectionKey === nextKey);          if (chapterNext?.data?.imageUrl) new Image().src = chapterNext.data.imageUrl;        }      } else {        // No adjacent pair in transition — pick the last section with top <= 0        let currentIndex = -1;        for (let i = 0; i < rects.length; i++) {          if (rects[i].top <= 0) currentIndex = i;          else break;        }        if (currentIndex >= 0) {          const key = sections[currentIndex].dataset.sectionKey ?? "";          nextOpacities[key] = 1;        } else {          // Top of page: show first (hero)          const key = sections[0].dataset.sectionKey ?? "";          nextOpacities[key] = 1;        }      }      // Ensure all chapters have a numeric opacity (default 0)      for (const c of chapters) {        const k = c.data?.sectionKey;        if (k && nextOpacities[k] == null) nextOpacities[k] = 0;      }      setOpacities(nextOpacities);    }
    function onScroll() {      if (!running) {        running = true;        requestAnimationFrame(update);      }    }
    update();    window.addEventListener("scroll", onScroll, { passive: true });    window.addEventListener("resize", onScroll);    return () => {      window.removeEventListener("scroll", onScroll);      window.removeEventListener("resize", onScroll);    };  }, [chapters]);
  return (
    <div
      ref={containerRef}      aria-hidden      className={cn(        "pointer-events-none fixed inset-0 -z-10 h-screen w-screen overflow-hidden",        prefersReduced ? "" : "transition-opacity"      )}    >      {/* Background layers */}      <div className="absolute inset-0">        <div          className="absolute inset-0 bg-black/0"          style={{ mixBlendMode: "normal" }}        />        <div className="absolute inset-0">          {chapters.map((c) => {            const url = c.data?.imageUrl;            const key = c.data?.sectionKey ?? c.slug ?? String(c.id);            const opacity = typeof opacities[key] === "number" ? opacities[key] : 0;            const scale = 1 + 0.015 * opacity;            const style: React.CSSProperties = {              backgroundImage: url ? `url(${url})` : undefined,              backgroundPosition: c.data?.focal || "center center",              backgroundSize: "cover",              opacity,              transition: prefersReduced ? undefined : "opacity 160ms linear, transform 420ms ease",              transform: !prefersReduced ? `scale(${scale})` : undefined,            };            return (              <div                key={c.slug ?? c.id}                className="absolute inset-0 will-change-transform will-change-opacity"                style={style}              >                {/* overlay */}                <div                  className="absolute inset-0"                  style={{ background: `linear-gradient(rgba(0,0,0,${(Number(c.data?.overlayOpacity) || 20) / 100}), rgba(0,0,0,${(Number(c.data?.overlayOpacity) || 20) / 100}))` }}                />              </div>            );          })}        </div>      </div>    </div>  );}