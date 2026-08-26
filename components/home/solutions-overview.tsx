import { Container } from "@/components/ui/container";
import { SectionHeading } from "@/components/ui/section-heading";
import { Button } from "@/components/ui/button";
import {
  ShowcaseCard,
  showcaseGridInner,
  showcaseGridOuter,
} from "@/components/ui/showcase-card";
import { Reveal, RevealGroup, RevealItem } from "@/components/motion/reveal";
import { getSectionHeading, getSolutions } from "@/lib/content/resolvers";
import { cn } from "@/lib/utils";

export async function SolutionsOverview({ className }: { className?: string }) {
  const [solutions, heading] = await Promise.all([
    getSolutions(),
    getSectionHeading("solutions-overview"),
  ]);

  return (
    <section className={cn("section", className)}>
      <Container>
        <Reveal className="flex flex-col items-start justify-between gap-6 sm:flex-row sm:items-end">
          <SectionHeading
            eyebrow={heading?.eyebrow ?? "Solutions"}
            eyebrowTone={heading?.eyebrowTone}
            title={heading?.title ?? `${solutions.length} ways we help you ship`}
            description={
              heading?.description ??
              "From a single web app to a full AI-driven platform — pick a starting point, or let us scope the right mix."
            }
          />
          {/* Pill, and no arrow: the shape already reads as a control, so the
              label can stand on its own. */}
          <Button href="/solutions" variant="pill-outline" size="lg" className="shrink-0">
            View all solutions
          </Button>
        </Reveal>

      </Container>

      {/* The grid breaks out of the Container: a pair of tiles is meant to
          fill the viewport edge to edge, with only a gutter to the screen
          edge. Inside max-w-7xl they read as boxes on a page instead. */}
      <div className={cn("mt-14", showcaseGridOuter, "pb-0")}>
        {/* Two up. The tiles are large enough that a third column would shrink
            the image wells below the size that makes them worth having. */}
        <RevealGroup className={showcaseGridInner}>
          {solutions.map((solution) => (
            <RevealItem key={solution.slug} className="flex">
              <ShowcaseCard
                tone="light"
                title={solution.name}
                description={solution.tagline}
                href={`/solutions/${solution.slug}`}
                secondary={{ label: "Get a quote", href: "/contact" }}
                image={solution.image}
                imageAlt=""
                className="min-h-[420px] sm:min-h-[500px] lg:min-h-[560px] [&_[data-image-slot]]:min-h-[220px] sm:[&_[data-image-slot]]:min-h-[280px]"
              />
            </RevealItem>
          ))}
        </RevealGroup>
      </div>
    </section>
  );
}
