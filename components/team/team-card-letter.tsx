"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useInView, useReducedMotion } from "framer-motion";
import { DURATION, EASE, VIEWPORT_MARGIN } from "@/lib/motion";
import { cn } from "@/lib/utils";

/**
 * The oversized initial on a team card, sliding in from the card's right edge.
 *
 * Two details make it behave rather than merely animate.
 *
 * The travel is measured from the card, not hardcoded: the tile is ~320px
 * wide in a four-up desktop grid and about half that on a phone, so one fixed
 * pixel distance would either fall short of the right edge on desktop or
 * launch the letter far outside a phone-sized card. The measurement runs once
 * on mount, before the card is normally scrolled to.
 *
 * And the element that gets observed is *not* the element that moves. The
 * outer span stays put while an inner one is translated, because
 * `useInView` reads the transformed box — an element parked a card's width to
 * the right can sit outside the viewport entirely on a card near the screen
 * edge, and would then never register as in view, so its letter would never
 * arrive.
 *
 * It replays every time the card scrolls back into view rather than firing
 * once. That is the opposite of the rule the shared `Reveal` follows, and
 * deliberately so: `Reveal` moves body content, where re-animating on every
 * pass is what makes a page feel restless. This is one decorative glyph, and
 * the motion is the point of it.
 *
 * The letter is `aria-hidden`: it is a graphic, and the person's name is
 * announced properly by the heading beside it.
 */
export function TeamCardLetter({
  letter,
  className,
}: {
  letter: string;
  className?: string;
}) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { margin: VIEWPORT_MARGIN });
  const reduceMotion = useReducedMotion();
  // Falls back to a sensible desktop-ish travel until the card is measured.
  const [distance, setDistance] = useState(200);

  useEffect(() => {
    const card = ref.current?.closest("article");
    if (!card) return;
    const measure = () => setDistance(card.getBoundingClientRect().width);
    measure();
    // The grid reflows between one and four columns, so a card measured at
    // one breakpoint is the wrong distance at another.
    const ro = new ResizeObserver(measure);
    ro.observe(card);
    return () => ro.disconnect();
  }, []);

  return (
    <span ref={ref} className={cn("block shrink-0", className)}>
      <motion.span
        aria-hidden
        data-reveal=""
        className="block"
        /* The resting state is expressed through `animate`, not `initial`.
           `initial` is read once at mount, so a distance measured afterwards
           would never reach it — the letter would always travel the fallback
           200px regardless of how wide its card actually is. */
        initial={{ x: reduceMotion ? 0 : distance, opacity: 0 }}
        animate={
          inView
            ? { x: 0, opacity: 1 }
            : { x: reduceMotion ? 0 : distance, opacity: 0 }
        }
        transition={{
          duration: reduceMotion ? DURATION.ui : DURATION.section,
          ease: EASE.outExpo,
        }}
      >
        {letter}
      </motion.span>
    </span>
  );
}
