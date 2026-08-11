import { ArrowRight01Icon } from "hugeicons-react";
import { Container } from "@/components/ui/container";
import { Button } from "@/components/ui/button";
import { getHomeFinalCtaData } from "@/lib/content/resolvers";

export async function FinalCta() {
  const content = await getHomeFinalCtaData();

  return (
    <section className="py-20 sm:py-24">
      <Container>
        <div className="flex flex-col items-center gap-6 rounded-[var(--radius-card)] border-[0.5px] border-border bg-brand-blue px-6 py-14 text-center text-white sm:px-12">
          <h2 className="max-w-2xl text-3xl font-semibold leading-tight tracking-[-0.02em] sm:text-4xl">
            {content.title}
          </h2>
          <p className="max-w-xl text-base leading-relaxed text-white/75 sm:text-[17px]">
            {content.description}
          </p>
          <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
            <Button href={content.primaryHref} size="lg" variant="secondary">
              {content.primaryLabel} <ArrowRight01Icon className="h-4 w-4" />
            </Button>
            <Button
              href={content.secondaryHref}
              variant="outline"
              size="lg"
              className="border-white/30 text-white hover:bg-white/10"
            >
              {content.secondaryLabel}
            </Button>
          </div>
        </div>
      </Container>
    </section>
  );
}
