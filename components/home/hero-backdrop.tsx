"use client";

import { useReducedMotion } from "framer-motion";
import { useMediaQuery } from "@/lib/hooks/use-media-query";
import { HeroRobot } from "@/components/home/hero-robot";

/**
 * Hero backdrop: AI-robot illustration with layered atmospheric elements.
 * A subtle grid pattern + radial glow behind the robot creates depth
 * without relying on gradients or glassmorphism.
 */
export function HeroBackdrop() {
  const reduceMotion = useReducedMotion();
  const wideViewport = useMediaQuery("(min-width: 768px)");
  const animate = wideViewport && !reduceMotion;

  return (
    <div
      aria-hidden
      className="pointer-events-none absolute inset-0 -z-[1] overflow-hidden"
    >
      {/* Subtle dot grid — tech identity, not decoration */}
      <div
        className="absolute inset-0 opacity-[0.06]"
        style={{
          backgroundImage:
            "radial-gradient(circle, #ffffff 1px, transparent 1px)",
          backgroundSize: "24px 24px",
        }}
      />

      {/* Radial glow behind robot — depth without gradient bars */}
      <div
        className="absolute right-[-5%] top-1/2 h-[500px] w-[500px] -translate-y-1/2 rounded-full opacity-[0.07] blur-3xl md:h-[700px] md:w-[700px]"
        style={{
          background:
            "radial-gradient(circle, var(--brand-green) 0%, var(--brand-blue) 50%, transparent 70%)",
        }}
      />

      <div className="absolute right-[-10%] top-1/2 aspect-square w-[80vw] max-w-[640px] -translate-y-1/2 md:right-[-3%] md:w-[46vw]">
        <div className={animate ? "hero-ai-float h-full w-full" : "h-full w-full"}>
          <HeroRobot animate={animate} />
        </div>
      </div>
    </div>
  );
}
