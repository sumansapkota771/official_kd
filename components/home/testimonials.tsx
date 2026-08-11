import { QuoteUpIcon } from "hugeicons-react";
import { Container } from "@/components/ui/container";
import { SectionHeading } from "@/components/ui/section-heading";
import { testimonials } from "@/lib/data/content";

export function Testimonials() {
  return (
    <section className="py-20 sm:py-24">
      <Container className="flex flex-col gap-12">
        <SectionHeading
          eyebrow="Testimonials"
          title="What our clients say"
          align="center"
          className="mx-auto"
        />
        <div className="grid gap-5 lg:grid-cols-3">
          {testimonials.map((t) => (
            <figure
              key={t.name}
              className="flex flex-col gap-4 card p-6"
            >
              <QuoteUpIcon className="h-6 w-6 text-brand-green" />
              <blockquote className="text-sm leading-relaxed text-text-secondary">
                &ldquo;{t.quote}&rdquo;
              </blockquote>
              <figcaption className="mt-auto pt-2">
                <p className="text-sm font-semibold text-text-primary">{t.name}</p>
                <p className="text-xs text-text-muted">{t.role}</p>
              </figcaption>
            </figure>
          ))}
        </div>
      </Container>
    </section>
  );
}
