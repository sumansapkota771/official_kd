"use client";

import { useRef } from "react";
import { motion, useInView, useReducedMotion } from "framer-motion";
import { DURATION, EASE, REVEAL_DISTANCE, STAGGER, VIEWPORT_MARGIN } from "@/lib/motion";
import { cn } from "@/lib/utils";

type RevealProps = {
  children: React.ReactNode;
  className?: string;
  /** Direction the content travels from. "none" fades in place. */
  from?: "up" | "left" | "right" | "none";
  /** Seconds to wait before starting. Use sparingly — prefer RevealGroup. */
  delay?: number;
  /** Render as a different element (e.g. "section", "li"). */
  as?: "div" | "section" | "li" | "article" | "span";
};

/**
 * Scroll reveal for a single block.
 *
 * Deliberately a *client* island: the home page sections are async server
 * components that fetch CMS content, so they must stay on the server. They
 * wrap their children in this instead of becoming client components
 * themselves — the children are still server-rendered and passed through
 * as an already-resolved React node.
 *
 * Fires once. Content that re-animates every time it scrolls past is the
 * single fastest way to make a site feel cheap.
 */
export function Reveal({
  children,
  className,
  from = "up",
  delay = 0,
  as = "div",
}: RevealProps) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: VIEWPORT_MARGIN });
  const reduceMotion = useReducedMotion();

  // Indexing `motion` by tag name yields a union whose ref type is the
  // intersection of every element type, which nothing can satisfy. The tag is
  // correct at runtime; this narrows it to one concrete signature for TS.
  const MotionTag = motion[as] as typeof motion.div;

  // With reduced motion we still fade (a 0→1 opacity carries no vestibular
  // risk) but drop all travel, which is the part that causes discomfort.
  const offset = reduceMotion || from === "none" ? {} : from === "up"
    ? { y: REVEAL_DISTANCE }
    : { x: from === "left" ? -REVEAL_DISTANCE : REVEAL_DISTANCE };

  return (
    <MotionTag
      ref={ref}
      initial={{ opacity: 0, ...offset }}
      animate={inView ? { opacity: 1, x: 0, y: 0 } : undefined}
      transition={{
        duration: reduceMotion ? DURATION.ui : DURATION.reveal,
        ease: EASE.outExpo,
        delay,
      }}
      /* Marks every reveal for the `<noscript>` rule in the root layout,
         which forces them visible. The motion library writes `opacity: 0`
         into the server-rendered markup, so without that escape hatch a
         browser with scripting off would be served a blank page. */
      data-reveal=""
      className={cn(className)}
    >
      {children}
    </MotionTag>
  );
}

/**
 * Reveals direct children in sequence.
 *
 * Uses variants so the stagger is computed by the animation system rather
 * than by hand-assigned delays — which means adding or removing a child
 * never requires renumbering the others.
 */
export function RevealGroup({
  children,
  className,
  stagger = STAGGER,
  as = "div",
}: {
  children: React.ReactNode;
  className?: string;
  stagger?: number;
  as?: "div" | "ul" | "section";
}) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: VIEWPORT_MARGIN });
  const reduceMotion = useReducedMotion();

  const MotionTag = motion[as] as typeof motion.div;

  return (
    <MotionTag
      ref={ref}
      initial="hidden"
      animate={inView ? "visible" : "hidden"}
      variants={{
        hidden: {},
        // Staggering the *container* leaves children free to define their
        // own motion, so a card and a heading can differ inside one group.
        visible: { transition: { staggerChildren: reduceMotion ? 0 : stagger } },
      }}
      className={cn(className)}
    >
      {children}
    </MotionTag>
  );
}

/**
 * A single child of RevealGroup. Inherits timing from its parent's stagger.
 */
export function RevealItem({
  children,
  className,
  as = "div",
}: {
  children: React.ReactNode;
  className?: string;
  as?: "div" | "li" | "article";
}) {
  const reduceMotion = useReducedMotion();
  const MotionTag = motion[as];

  return (
    <MotionTag
      variants={{
        hidden: { opacity: 0, y: reduceMotion ? 0 : REVEAL_DISTANCE },
        visible: {
          opacity: 1,
          y: 0,
          transition: {
            duration: reduceMotion ? DURATION.ui : DURATION.reveal,
            ease: EASE.outExpo,
          },
        },
      }}
      data-reveal=""
      className={cn(className)}
    >
      {children}
    </MotionTag>
  );
}
