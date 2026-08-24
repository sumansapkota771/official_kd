"use client";

import { motion, type Variants } from "framer-motion";
import { ArrowRight01Icon } from "hugeicons-react";
import { Container } from "@/components/ui/container";
import { Button } from "@/components/ui/button";
import { Magnetic } from "@/components/motion/magnetic";
import { HeroBackdrop } from "@/components/home/hero-backdrop";
import { DURATION, EASE } from "@/lib/motion";
import { cn } from "@/lib/utils";
import type { HomeHeroData } from "@/lib/content/schemas";

/**
 * Entrance choreography.
 *
 * The order is deliberate and matches how the page is read: context (eyebrow)
 * → claim (headline) → detail (paragraph) → action (CTAs). Each step overlaps
 * the previous one, so it reads as a single settling movement rather than
 * four separate animations queued up.
 */
const container: Variants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.075, delayChildren: 0.05 } },
};

const rise: Variants = {
  hidden: { opacity: 0, y: 14 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: DURATION.section, ease: EASE.outExpo },
  },
};

export function Hero({ content, className }: { content: HomeHeroData; className?: string }) {
  return (
    <section
      /* Ink ground, stated outright. This used to be a transparent section
         over an admin-chosen background image, with a gradient scrim to drag
         the contrast down far enough for white type. With that system gone
         there is nothing to scrim, so the hero simply owns its background —
         and white now sits on a known 18.7:1 instead of on a guess. */
      className={cn(
        "relative isolate overflow-hidden bg-surface-ink",
        className
      )}
    >
      <HeroBackdrop />

      <Container className="relative z-10">
        <motion.div
          variants={container}
          initial="hidden"
          animate="visible"
          className="flex flex-col items-center gap-6 py-28 text-center sm:py-36 lg:py-44"
        >
          <motion.span variants={rise} className="eyebrow text-brand-green">
            {content.eyebrow}
          </motion.span>

          <motion.h1
            variants={rise}
            className="display-xl max-w-4xl font-semibold text-white"
          >
            {content.title}
          </motion.h1>

          <motion.p
            variants={rise}
            className="max-w-2xl text-[19px] leading-[1.4] tracking-[-0.012em] text-pretty text-white sm:text-[21px] lg:text-[24px]"
          >
            {content.paragraph}
          </motion.p>

          <motion.div
            variants={rise}
            className="flex flex-wrap items-center justify-center gap-3 pt-2"
          >
            {/* Magnetic is applied to exactly one control on the page — the
                primary conversion. Its pull only means something while it is
                the only thing that pulls. */}
            <Magnetic>
              <Button href={content.primaryHref} variant="pill-ink" size="lg">
                {content.primaryLabel}
              </Button>
            </Magnetic>
            <Button
              href={content.secondaryHref}
              variant="pill-ink-outline"
              size="lg"
            >
              {content.secondaryLabel}
            </Button>
          </motion.div>

          <motion.div variants={rise}>
            <Button
              href={content.tertiaryHref}
              variant="ghost"
              size="sm"
              className="w-fit text-tile-ink-accent hover:bg-white/10"
            >
              {content.tertiaryLabel} <ArrowRight01Icon className="h-5.25 w-5.25" />
            </Button>
          </motion.div>
        </motion.div>
      </Container>
    </section>
  );
}
