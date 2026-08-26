"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useReducedMotion } from "framer-motion";
import { Container } from "@/components/ui/container";
import { Button } from "@/components/ui/button";
import { Magnetic } from "@/components/motion/magnetic";
import { cn } from "@/lib/utils";
import type { HomeHeroSlideData } from "@/lib/content/schemas";

export type HeroSlide = HomeHeroSlideData & { slug: string };

/** How long each slide holds before the rail hands over. */
const SLIDE_MS = 7000;
/** Progress ticks. 16ms would be smoother and pointlessly expensive: the bar
 *  is 300px wide, so a step finer than ~1px of travel is invisible. */
const TICK_MS = 50;

/**
 * The hero's moving part: three propositions, one at a time, with a numbered
 * rail across the foot that shows which one is up and how long it has left.
 *
 * The rail is the whole idea. An unlabelled carousel asks people to wait and
 * see what arrives; a rail names all three destinations at once, so the
 * rotation reads as a table of contents that happens to advance rather than
 * as content being withheld. Every entry is also a button, so nobody has to
 * wait for the one they want.
 *
 * Progress is driven from a timer in state rather than a CSS transition,
 * because the bar has to be scrubbable: clicking a slide resets it, hovering
 * freezes it, and leaving the tab has to not silently burn through all three.
 *
 * Deliberately flat: solid fills only, no gradient anywhere in the rail or
 * the ground behind it.
 */
const GRID = 6;

/**
 * One flat-square pattern per slide, as indices into a 6x6 grid.
 *
 * Each is a crude picture of what its slide sells: a staircase climbing for
 * building, stacked bands for a syllabus, a block growing out of the corner
 * for investment. Abstract on purpose — the point is that the mark visibly
 * *changes with the subject*, not that anyone decodes it.
 */
const PATTERNS: number[][] = [
  [30, 31, 25, 24, 19, 18, 13, 12, 7, 6],
  [1, 2, 3, 4, 13, 14, 15, 16, 25, 26, 27, 28],
  [30, 31, 32, 24, 25, 26, 18, 19, 20, 12, 13, 14],
];

const ACCENTS = ["bg-brand-green", "bg-tile-ink-pill", "bg-white"];

/**
 * The composition opposite the copy: a matrix of solid squares, a subset lit
 * per slide.
 *
 * It exists because a flat ink field with copy on one side and nothing on the
 * other is not a composition, it is a margin. With gradients ruled out, the
 * only honest way to fill it is geometry with real edges, so that is what
 * this is: squares, one flat fill each, no blending anywhere.
 *
 * The stagger is index-driven rather than authored, so the wave reads as the
 * pattern resolving rather than as ten separate fades. Hidden below `lg`,
 * where the copy needs the whole width.
 */
function HeroMatrix({ index, reduceMotion }: { index: number; reduceMotion: boolean | null }) {
  const lit = PATTERNS[index % PATTERNS.length];
  const accent = ACCENTS[index % ACCENTS.length];

  return (
    <div
      aria-hidden
      className="pointer-events-none hidden aspect-square w-full max-w-[420px] grid-cols-6 gap-2.5 lg:grid"
      style={{ gridTemplateRows: `repeat(${GRID}, minmax(0, 1fr))` }}
    >
      {Array.from({ length: GRID * GRID }, (_, i) => {
        const on = lit.indexOf(i);
        return (
          <span
            key={i}
            className={cn(
              "block h-full w-full",
              on >= 0 ? accent : "bg-white/[0.05]",
              !reduceMotion && "transition-colors duration-500 ease-out-quint"
            )}
            style={
              !reduceMotion && on >= 0
                ? { transitionDelay: `${Math.min(on, 12) * 45}ms` }
                : undefined
            }
          />
        );
      })}
    </div>
  );
}

export function HeroSlides({ slides }: { slides: HeroSlide[] }) {
  const reduceMotion = useReducedMotion();
  const [index, setIndex] = useState(0);
  const [elapsed, setElapsed] = useState(0);
  const [paused, setPaused] = useState(false);
  const [onScreen, setOnScreen] = useState(true);
  const rootRef = useRef<HTMLDivElement>(null);

  const multiple = slides.length > 1;
  // Auto-advance is a convenience, never the only way through. Reduced-motion
  // users get the rail as plain navigation and nothing moves on its own.
  // Hover/focus and visibility are tracked separately so leaving the hero
  // onscreen after a hover does not strand it paused.
  const auto = multiple && !reduceMotion && !paused && onScreen;

  const go = useCallback((i: number) => {
    setIndex(i);
    setElapsed(0);
  }, []);

  // Pause while the hero is offscreen: a rotation nobody can see is just a
  // timer keeping the main thread and the battery busy.
  useEffect(() => {
    const el = rootRef.current;
    if (!el || typeof IntersectionObserver === "undefined") return;
    const io = new IntersectionObserver(
      ([entry]) => setOnScreen(entry.isIntersecting),
      { threshold: 0.25 }
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  useEffect(() => {
    if (!auto) return;
    const id = window.setInterval(() => {
      setElapsed((e) => {
        const next = e + TICK_MS;
        if (next >= SLIDE_MS) {
          setIndex((i) => (i + 1) % slides.length);
          return 0;
        }
        return next;
      });
    }, TICK_MS);
    return () => window.clearInterval(id);
  }, [auto, slides.length]);

  const active = slides[index] ?? slides[0];
  if (!active) return null;

  return (
    <div
      ref={rootRef}
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onFocusCapture={() => setPaused(true)}
      onBlurCapture={() => setPaused(false)}
      /* Sized so the rail clears the fold. The header stack above this
         section runs ~250px, so a 78vh hero pushed the rail off-screen on a
         900px display — and a rail nobody sees is just an unexplained
         carousel. */
      className="flex min-h-[clamp(520px,62vh,760px)] flex-col"
    >
      <Container className="flex flex-1 items-center gap-16 py-14 sm:py-16">
        {/* `key` remounts the copy per slide, which is what replays the
            entrance. Without it React reuses the nodes and the text simply
            swaps in place, which reads as a typo correction, not a change of
            subject. */}
        <div key={active.slug} className="hero-slide min-w-0 flex-1 text-left lg:max-w-3xl">
          <h1 className="hero-headline display-xl font-semibold text-white">
            {active.title}
          </h1>

          <p className="mt-6 max-w-xl text-[19px] leading-[1.45] tracking-[-0.012em] text-pretty text-white/85 sm:text-[21px]">
            {active.paragraph}
          </p>

          <div className="mt-9 flex flex-wrap items-center gap-3">
            <Magnetic>
              <Button href={active.ctaHref} variant="pill-ink" size="lg">
                {active.ctaLabel}
              </Button>
            </Magnetic>
          </div>
        </div>

        <HeroMatrix index={index} reduceMotion={reduceMotion} />
      </Container>

      {multiple && (
        <Container className="pb-10 sm:pb-12">
          <ul className="grid gap-x-8 gap-y-5 sm:grid-cols-3">
            {slides.map((slide, i) => {
              const isActive = i === index;
              const pct = isActive ? Math.min(100, (elapsed / SLIDE_MS) * 100) : 0;
              return (
                <li key={slide.slug}>
                  <button
                    type="button"
                    onClick={() => go(i)}
                    aria-current={isActive ? "true" : undefined}
                    className="focus-ring group/rail block w-full text-left"
                  >
                    {/* Track and fill are both solid. The reference blends
                        its bar through three hues; this palette has one
                        accent and no reason to invent two more. */}
                    <span className="block h-0.5 w-full bg-white/20">
                      <span
                        className={cn(
                          "block h-full bg-brand-green",
                          // Only the running bar animates. Snapping the others
                          // to zero keeps a click from playing three bars
                          // draining at once.
                          isActive && !reduceMotion && "transition-[width] duration-75 ease-linear"
                        )}
                        style={{ width: `${reduceMotion && isActive ? 100 : pct}%` }}
                      />
                    </span>
                    <span
                      className={cn(
                        "mt-3 block text-[13px] font-semibold uppercase tracking-[0.14em] transition-colors duration-ui",
                        isActive
                          ? "text-white"
                          : "text-white/45 group-hover/rail:text-white/75"
                      )}
                    >
                      <span className="tabular-nums">
                        {String(i + 1).padStart(2, "0")}
                      </span>
                      <span aria-hidden className="mx-2 text-white/25">
                        |
                      </span>
                      {slide.label}
                    </span>
                  </button>
                </li>
              );
            })}
          </ul>
        </Container>
      )}
    </div>
  );
}
