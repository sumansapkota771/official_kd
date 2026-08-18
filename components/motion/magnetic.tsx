"use client";

import { useRef, type PointerEvent as ReactPointerEvent } from "react";
import { motion, useMotionValue, useSpring, useReducedMotion } from "framer-motion";
import { useFinePointer } from "@/lib/hooks/use-fine-pointer";
import { cn } from "@/lib/utils";

/**
 * Pulls its child a short distance toward the cursor while hovered.
 *
 * Reserved for the single most important action in a view. The effect works
 * because it is rare — applying it to every button turns a considered accent
 * into noise, and makes dense UI feel unstable.
 *
 * Movement is intentionally capped well below the element's own size so the
 * hit area never drifts away from where the user aimed.
 */
export function Magnetic({
  children,
  className,
  /** Fraction of the cursor's offset from centre that the element travels. */
  strength = 0.28,
  /** Hard cap on travel, in px, regardless of element size. */
  maxOffset = 10,
}: {
  children: React.ReactNode;
  className?: string;
  strength?: number;
  maxOffset?: number;
}) {
  const ref = useRef<HTMLSpanElement>(null);
  const finePointer = useFinePointer();
  const reduceMotion = useReducedMotion();
  const enabled = finePointer && !reduceMotion;

  const x = useMotionValue(0);
  const y = useMotionValue(0);

  // Springs rather than tweens: the element should feel like it has mass and
  // is being attracted, not like it is playing a fixed animation.
  const springX = useSpring(x, { stiffness: 260, damping: 22, mass: 0.4 });
  const springY = useSpring(y, { stiffness: 260, damping: 22, mass: 0.4 });

  const handleMove = (event: ReactPointerEvent<HTMLSpanElement>) => {
    if (!enabled || !ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    const offsetX = event.clientX - (rect.left + rect.width / 2);
    const offsetY = event.clientY - (rect.top + rect.height / 2);
    x.set(clamp(offsetX * strength, maxOffset));
    y.set(clamp(offsetY * strength, maxOffset));
  };

  const reset = () => {
    x.set(0);
    y.set(0);
  };

  return (
    <motion.span
      ref={ref}
      onPointerMove={handleMove}
      onPointerLeave={reset}
      // Cancel on press: during a click the element should stay put, so the
      // press feedback reads as a button and not as a moving target.
      onPointerDown={reset}
      style={enabled ? { x: springX, y: springY } : undefined}
      className={cn("inline-flex", className)}
    >
      {children}
    </motion.span>
  );
}

function clamp(value: number, limit: number): number {
  return Math.max(-limit, Math.min(limit, value));
}
