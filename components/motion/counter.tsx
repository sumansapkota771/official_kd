"use client";

import { useEffect, useRef, useState } from "react";
import { useInView, useReducedMotion } from "framer-motion";
import { EASE, VIEWPORT_MARGIN } from "@/lib/motion";

/**
 * Counts a stat up to its value when it scrolls into view.
 *
 * Applied only to the trust strip, where the numbers *are* the message. The
 * motion here is doing a job — it makes the eye land on the figure — rather
 * than decorating something that was already legible.
 *
 * Values arrive from the CMS as display strings ("10+", "4+", "98.2%"), so the
 * leading number is animated and any prefix/suffix is preserved verbatim.
 * Anything without a leading number renders unchanged.
 */
export function Counter({ value, className }: { value: string; className?: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: VIEWPORT_MARGIN });
  const reduceMotion = useReducedMotion();

  const match = value.match(/^(\D*)(\d+(?:\.\d+)?)([\s\S]*)$/);
  const target = match ? Number(match[2]) : null;
  const decimals = match?.[2].includes(".") ? match[2].split(".")[1].length : 0;

  const [progress, setProgress] = useState(0);

  // Only the running animation owns state. The reduced-motion and
  // no-number cases are resolved during render instead, so nothing is
  // written to state synchronously from an effect.
  const animates = target !== null && !reduceMotion;

  useEffect(() => {
    if (!animates || !inView || target === null) return;

    const duration = 1000;
    const start = performance.now();
    let frame = 0;

    const tick = (now: number) => {
      const t = Math.min((now - start) / duration, 1);
      // Same out-expo curve as the reveal system, so the number settles on
      // the same rhythm as the element it sits inside.
      setProgress(cubicBezierY(t, EASE.outExpo));
      if (t < 1) frame = requestAnimationFrame(tick);
    };

    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [animates, inView, target]);

  if (target === null || !match) {
    return <span className={className}>{value}</span>;
  }

  const shown = animates ? formatted(target * progress, decimals) : formatted(target, decimals);

  return (
    <span ref={ref} className={className}>
      {/* The finished value is what assistive tech announces; the ticking
          digits are decorative and would otherwise be read out mid-count. */}
      <span className="sr-only">{value}</span>
      <span aria-hidden>
        {match[1]}
        {shown}
        {match[3]}
      </span>
    </span>
  );
}

function formatted(n: number, decimals: number): string {
  return decimals > 0 ? n.toFixed(decimals) : Math.round(n).toString();
}

/**
 * Y value of a cubic-bezier at time t, solved by bisection on x.
 *
 * Precise enough for a counter (a fraction of a digit) and avoids pulling in
 * an easing dependency just to reuse the curve the CSS already uses.
 */
function cubicBezierY(
  t: number,
  [x1, y1, x2, y2]: readonly [number, number, number, number]
): number {
  if (t <= 0) return 0;
  if (t >= 1) return 1;

  const sampleX = (u: number) =>
    3 * (1 - u) * (1 - u) * u * x1 + 3 * (1 - u) * u * u * x2 + u * u * u;
  const sampleY = (u: number) =>
    3 * (1 - u) * (1 - u) * u * y1 + 3 * (1 - u) * u * u * y2 + u * u * u;

  let low = 0;
  let high = 1;
  let mid = t;
  for (let i = 0; i < 18; i++) {
    mid = (low + high) / 2;
    if (sampleX(mid) < t) low = mid;
    else high = mid;
  }
  return sampleY(mid);
}
