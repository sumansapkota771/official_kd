import { ArrowRight01Icon, Award01Icon, UserMultipleIcon, Calendar01Icon } from "hugeicons-react";
import { Container } from "@/components/ui/container";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Reveal } from "@/components/motion/reveal";
import { getHomeFlagshipData } from "@/lib/content/resolvers";
import { cn } from "@/lib/utils";

export async function FlagshipProgram({ className }: { className?: string }) {
  const content = await getHomeFlagshipData();

  return (
    <section data-section-key="home-flagship" className={cn("section", className)}>
      <Container>
        {/* A product highlight with its own primary CTA: the flagship panel
            takes the strong-brand-blue moment, and the final CTA below owns
            the hero-blue space. Solid colour only — the project is
            gradient-free. The badge and button follow the system's on-brand
            inverse conventions. */}
        <Reveal className="on-brand relative overflow-hidden rounded-card bg-brand-blue px-8 py-14 text-white sm:px-14 sm:py-20">
          {/* Left accent edge — breaks the flat-blue panel */}
          <div className="absolute left-0 top-0 h-full w-1 bg-brand-green" aria-hidden="true" />
          <div className="relative flex flex-col gap-8 lg:flex-row lg:items-center lg:justify-between">
            <div className="max-w-xl">
              <Badge className="bg-white/15 text-white">
                <Award01Icon className="h-5.25 w-5.25" /> {content.badge}
              </Badge>
              <h2 className="display-md mt-5 font-semibold">
                {content.title}
              </h2>
              <p className="mt-4 text-base leading-relaxed text-white/85 sm:text-lg">
                {content.description}
              </p>
              <div className="mt-6 flex flex-wrap gap-6 text-sm text-white">
                <span className="flex items-center gap-2">
                  <UserMultipleIcon className="h-6 w-6" /> {content.point1}
                </span>
                <span className="flex items-center gap-2">
                  <Calendar01Icon className="h-6 w-6" /> {content.point2}
                </span>
              </div>
            </div>
            {/* On solid brand blue, white is the system's primary action —
                the one strong CTA this section gets (rule 4). */}
            <Button href={content.ctaHref} size="lg" className="w-fit shrink-0 bg-white text-brand-blue hover:bg-white/90">
              {content.ctaLabel}
              <ArrowRight01Icon className="h-6 w-6 transition-transform duration-micro ease-out-quint group-hover/btn:translate-x-0.5" />
            </Button>
          </div>
        </Reveal>
      </Container>
    </section>
  );
}
