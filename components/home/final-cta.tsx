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
    <section data-section-key="home-final-cta" className={cn("section-loose", className)}>
      <Container>
        <Reveal className="on-brand relative overflow-hidden rounded-card border border-brand-blue bg-brand-blue px-8 py-20 text-center text-white sm:px-16">
          {/* Decorative corner accents */}
          <div className="absolute left-0 top-0 h-24 w-1 bg-brand-green" aria-hidden="true" />
          <div className="absolute bottom-0 right-0 h-24 w-1 bg-brand-green" aria-hidden="true" />
          <h2 className="display-md max-w-2xl font-semibold">{content.title}</h2>
          <p className="prose-measure text-base leading-relaxed text-white/70 sm:text-[17px]">
            {content.description}
          </p>
          <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
            <Magnetic>
              <Button href={content.primaryHref} size="lg" variant="secondary">
                {content.primaryLabel}
                <ArrowRight01Icon className="h-6 w-6 transition-transform duration-micro ease-out-quint group-hover/btn:translate-x-0.5" />
              </Button>
            </Magnetic>
            <Button
              href={content.secondaryHref}
              variant="outline"
              size="lg"
              className="border-white/30 text-white hover:bg-white/10"
            >
              {content.secondaryLabel}
            </Button>
          </div>
        </Reveal>
      </Container>
    </section>
  );
}
