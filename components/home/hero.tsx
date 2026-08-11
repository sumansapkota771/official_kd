"use client";

import { motion } from "framer-motion";
import { ArrowRight01Icon, Rocket01Icon, SparklesIcon, Mortarboard01Icon } from "hugeicons-react";
import { Container } from "@/components/ui/container";
import { Button } from "@/components/ui/button";
import type { HomeHeroData } from "@/lib/content/schemas";

export function Hero({ content }: { content: HomeHeroData }) {
  return (
    <section className="relative overflow-hidden bg-background-secondary">
      <Container className="relative grid gap-14 py-20 sm:py-24 lg:grid-cols-[1.05fr_0.95fr] lg:items-center lg:py-28">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          className="flex flex-col gap-6"
        >
          <span className="text-[13px] font-semibold uppercase tracking-[0.12em] text-brand-blue">
            {content.eyebrow}
          </span>
          <h1 className="max-w-xl text-4xl font-semibold leading-[1.05] tracking-[-0.03em] text-text-primary sm:text-5xl lg:text-[3.4rem]">
            {content.title}
          </h1>
          <p className="max-w-lg text-[17px] leading-relaxed text-text-secondary">
            {content.paragraph}
          </p>

          <div className="flex flex-wrap items-center gap-3 pt-2">
            <Button href={content.primaryHref} size="lg">
              {content.primaryLabel} <ArrowRight01Icon className="h-4 w-4" />
            </Button>
            <Button href={content.secondaryHref} variant="secondary" size="lg">
              {content.secondaryLabel}
            </Button>
          </div>
          <Button href={content.tertiaryHref} variant="ghost" size="sm" className="w-fit">
            {content.tertiaryLabel} <ArrowRight01Icon className="h-3.5 w-3.5" />
          </Button>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.94 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, ease: "easeOut", delay: 0.15 }}
          className="relative mx-auto w-full max-w-md"
        >
          <div className="relative rounded-3xl border-[0.5px] border-border bg-surface p-6 shadow-elevated">
            <div className="flex items-center gap-3 border-b border-border pb-4">
              <span className="h-2.5 w-2.5 rounded-full bg-brand-blue" />
              <span className="h-2.5 w-2.5 rounded-full bg-brand-green" />
              <span className="ml-auto text-xs font-semibold text-text-muted">
                delivery.status
              </span>
            </div>
            <div className="flex flex-col gap-4 pt-5">
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
          </div>

          <motion.div
            animate={{ y: [0, -8, 0] }}
            transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
            className="absolute -bottom-6 -left-6 card-elevated px-4 py-3 shadow-elevated"
          >
            <p className="text-2xl font-bold text-brand-green">10+</p>
            <p className="text-xs font-medium text-text-muted">Projects delivered</p>
          </motion.div>
        </motion.div>
      </Container>
    </section>
  );
}

function StatusRow({
  icon: Icon,
  tone,
  title,
  meta,
}: {
  icon: React.ComponentType<{ className?: string }>;
  tone: "blue" | "green";
  title: string;
  meta: string;
}) {
  return (
    <div className="flex items-center gap-3">
      <Icon
        className={
          tone === "blue"
            ? "h-4.5 w-4.5 shrink-0 text-brand-blue"
            : "h-4.5 w-4.5 shrink-0 text-brand-green-hover"
        }
      />
      <div className="min-w-0">
        <p className="truncate text-sm font-semibold text-text-primary">{title}</p>
        <p className="text-xs text-text-muted">{meta}</p>
      </div>
    </div>
  );
}
