import { ArrowRight01Icon } from "hugeicons-react";
import { Container } from "@/components/ui/container";
import { Button } from "@/components/ui/button";
import { Magnetic } from "@/components/motion/magnetic";
import { Reveal } from "@/components/motion/reveal";
import { getHomeFinalCtaData } from "@/lib/content/resolvers";
import { cn } from "@/lib/utils";

export async function FinalCta({ className }: { className?: string }) {
  const content = await getHomeFinalCtaData();

  return (
    /* Loose rhythm: the closing ask gets more air than the sections above it,
       so the page resolves rather than simply stopping. */
    <section className={cn("section-loose", className)}>
      <Container>
        {/* Same soft-green wash the tiles and the footer use, not a bespoke
            dark/indigo panel — the closing ask reads as one more surface in
            the site's own material rather than a color the rest of the page
            never otherwise commits to. */}
        <Reveal className="relative overflow-hidden rounded-card bg-background-secondary px-8 py-16 sm:px-16">
          {/* Decorative corner accents */}
          <div className="absolute left-0 top-0 h-24 w-1 bg-brand-green" aria-hidden="true" />
          <div className="absolute bottom-0 right-0 h-24 w-1 bg-brand-green" aria-hidden="true" />

          {/* Content left, actions right — a banner split rather than the
              centred stack this used to be. `lg:items-center` is what makes
              the button pair line up against the text block's own vertical
              centre instead of its top. */}
          <div className="flex flex-col items-start gap-8 text-left lg:flex-row lg:items-center lg:justify-between">
            <div className="flex flex-col gap-3">
              <h2 className="display-md max-w-2xl font-semibold">{content.title}</h2>
              <p className="prose-measure text-base leading-relaxed text-text-secondary sm:text-[17px]">
                {content.description}
              </p>
            </div>

            <div className="flex shrink-0 flex-wrap items-center gap-3">
              <Magnetic>
                {/* Hover keeps the resting fill/border — only the icon still
                    nudges, since that is motion, not a colour swap. */}
                <Button
                  href={content.primaryHref}
                  size="lg"
                  variant="secondary"
                  className="hover:bg-brand-green hover:text-text-on-green"
                >
                  {content.primaryLabel}
                  <ArrowRight01Icon className="h-6 w-6 transition-transform duration-micro ease-out-quint group-hover/btn:translate-x-0.5" />
                </Button>
              </Magnetic>
              <Button
                href={content.secondaryHref}
                variant="outline"
                size="lg"
                className="hover:border-brand-blue/20 hover:bg-transparent"
              >
                {content.secondaryLabel}
              </Button>
            </div>
          </div>
        </Reveal>
      </Container>
    </section>
  );
}
