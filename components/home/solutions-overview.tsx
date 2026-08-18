import { ArrowRight01Icon } from "hugeicons-react";
import { Container } from "@/components/ui/container";
import { SectionHeading } from "@/components/ui/section-heading";
import { Button } from "@/components/ui/button";
import { SpotlightCard, CardCue } from "@/components/ui/spotlight-card";
import { Reveal, RevealGroup, RevealItem } from "@/components/motion/reveal";
import { getSectionHeading, getSolutions } from "@/lib/content/resolvers";
import { cn } from "@/lib/utils";

export async function SolutionsOverview({ className }: { className?: string }) {
  const [solutions, heading] = await Promise.all([
    getSolutions(),
    getSectionHeading("solutions-overview"),
  ]);

  return (
    <section data-section-key="solutions-overview" className={cn("section", className)}>
      <Container className="flex flex-col gap-14">
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
          <Button href="/solutions" variant="outline" className="shrink-0">
            View all solutions
            <ArrowRight01Icon className="h-6 w-6 transition-transform duration-micro ease-out-quint group-hover/btn:translate-x-0.5" />
          </Button>
        </Reveal>

        <RevealGroup className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {solutions.map((solution, i) => {
            const Icon = solution.icon;
            const isBlue = solution.accent === "blue";
            /* First card spans 2 cols on large screens — breaks the uniform grid */
            const spanning = i === 0;
            return (
              <RevealItem
                key={solution.slug}
                className={cn("flex", spanning && "sm:col-span-2 lg:col-span-1")}
              >
                <SpotlightCard
                  href={`/solutions/${solution.slug}`}
                  className="flex w-full flex-col gap-4"
                >
                  <Icon
                    className={cn(
                      "h-7.5 w-7.5 shrink-0 transition-transform duration-ui ease-out-quint group-hover/card:-translate-y-0.5",
                      isBlue ? "text-brand-blue" : "text-brand-green-hover"
                    )}
                  />
                  <div>
                    <h3 className="text-lg font-semibold text-text-primary">{solution.name}</h3>
                    <p className="mt-1.5 text-sm leading-relaxed text-text-muted">
                      {solution.tagline}
                    </p>
                  </div>
                  <CardCue label="Learn more" tone={isBlue ? "blue" : "green"} />
                </SpotlightCard>
              </RevealItem>
            );
          })}
        </RevealGroup>
      </Container>
    </section>
  );
}
