"use client";

import { motion, useReducedMotion, type Variants } from "framer-motion";
import { ArrowRight01Icon } from "hugeicons-react";
import { Container } from "@/components/ui/container";
import { Button } from "@/components/ui/button";
import { Magnetic } from "@/components/motion/magnetic";
import { HeroBackdrop } from "@/components/home/hero-backdrop";
import { DURATION, EASE } from "@/lib/motion";
import type { HomeHeroData } from "@/lib/content/schemas";

/**
 * Entrance choreography.
 *
 * The order is deliberate and matches how the page is read: context (eyebrow)
 * → claim (headline) → detail (paragraph) → action (CTAs) → evidence (card).
 * Each step overlaps the previous one, so it reads as a single settling
 * movement rather than five separate animations queued up.
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

export function Hero({ content }: { content: HomeHeroData }) {
  const reduceMotion = useReducedMotion();

  return (
    <section
      data-section-key="hero"
      className="cinematic-image relative isolate overflow-hidden"
    >
      <HeroBackdrop />

      <Container className="relative z-10 grid gap-16 py-24 sm:py-32 lg:grid-cols-[1.05fr_0.95fr] lg:items-center lg:py-40">
        <motion.div
          variants={container}
          initial="hidden"
          animate="visible"
          className="flex flex-col gap-6"
        >
          <motion.span
            variants={rise}
            className="eyebrow text-brand-green"
          >
            {content.eyebrow}
          </motion.span>

          <motion.h1
            variants={rise}
            className="display-xl max-w-2xl font-semibold text-white"
          >
            {content.title}
          </motion.h1>

          <motion.p
            variants={rise}
            className="prose-measure text-[17px] leading-relaxed text-white/70"
          >
            {content.paragraph}
          </motion.p>

          <motion.div variants={rise} className="flex flex-wrap items-center gap-3 pt-2">
            {/* Magnetic is applied to exactly one control on the page — the
                primary conversion. Its pull only means something while it is
                the only thing that pulls. */}
            <Magnetic>
              <Button href={content.primaryHref} size="lg">
                {content.primaryLabel}
                <ArrowRight01Icon className="h-6 w-6 transition-transform duration-micro ease-out-quint group-hover/btn:translate-x-0.5" />
              </Button>
            </Magnetic>
            <Button href={content.secondaryHref} variant="secondary" size="lg">
              {content.secondaryLabel}
            </Button>
          </motion.div>

          <motion.div variants={rise}>
            <Button href={content.tertiaryHref} variant="ghost" size="sm" className="w-fit">
              {content.tertiaryLabel} <ArrowRight01Icon className="h-5.25 w-5.25" />
            </Button>
          </motion.div>
        </motion.div>

        <motion.div
          initial={reduceMotion ? { opacity: 0 } : { opacity: 0, y: 24, scale: 0.97 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{
            duration: DURATION.cinematic,
            ease: EASE.outExpo,
            delay: 0.28,
          }}
          className="relative mx-auto w-full max-w-md"
        >
          {/* <div className="card-elevated relative p-7">
            <div className="flex items-center gap-3 border-b border-border pb-5">
              <span className="h-2.5 w-2.5 rounded-full bg-brand-blue" />
              <span className="h-2.5 w-2.5 rounded-full bg-brand-green" />
              <span className="ml-auto font-mono text-xs font-semibold text-text-muted">
                delivery.status
              </span>
            </div>
            <div className="flex flex-col gap-5 pt-6">
              <StatusRow
                icon={Rocket01Icon}
                tone="blue"
                title="Sprint 4 — SaaS onboarding flow"
                meta="Shipped to staging"
              />
              <StatusRow
                icon={SparklesIcon}
                tone="green"
                title="AI automation — invoice parsing"
                meta="98.2% accuracy"
              />
              <StatusRow
                icon={Mortarboard01Icon}
                tone="blue"
                title="AI & ML cohort — capstone demo"
                meta="Starts 1 Sept"
              />
            </div>
          </div> */}

          {/* <motion.div
            animate={reduceMotion ? undefined : { y: [0, -7, 0] }}
            transition={{ duration: 5.5, repeat: Infinity, ease: "easeInOut" }}
            className="card-elevated absolute -bottom-6 -left-6 px-4 py-3"
          >
            <p className="text-2xl font-bold text-brand-green-hover">10+</p>
            <p className="text-xs font-medium text-text-muted">Projects delivered</p>
          </motion.div> */}
        </motion.div>
      </Container>
    </section>
  );
}
