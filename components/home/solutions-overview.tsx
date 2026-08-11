import Link from "next/link";
import { ArrowRight01Icon } from "hugeicons-react";
import { Container } from "@/components/ui/container";
import { SectionHeading } from "@/components/ui/section-heading";
import { Button } from "@/components/ui/button";
import { getSectionHeading, getSolutions } from "@/lib/content/resolvers";
import { cn } from "@/lib/utils";

export async function SolutionsOverview() {
  const [solutions, heading] = await Promise.all([
    getSolutions(),
    getSectionHeading("solutions-overview"),
  ]);

  return (
    <section className="py-20 sm:py-24">
      <Container className="flex flex-col gap-12">
        <div className="flex flex-col items-start justify-between gap-6 sm:flex-row sm:items-end">
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
            View all solutions <ArrowRight01Icon className="h-4 w-4" />
          </Button>
        </div>

        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {solutions.map((solution) => {
            const Icon = solution.icon;
            const isBlue = solution.accent === "blue";
            return (
              <Link
                key={solution.slug}
                href={`/solutions/${solution.slug}`}
                className="focus-ring group flex flex-col gap-4 card card-hover p-6"
              >
                <Icon
                  className={cn(
                    "h-5 w-5 shrink-0",
                    isBlue ? "text-brand-blue" : "text-brand-green-hover"
                  )}
                />
                <div>
                  <h3 className="text-lg font-semibold text-text-primary">{solution.name}</h3>
                  <p className="mt-1.5 text-sm leading-relaxed text-text-muted">
                    {solution.tagline}
                  </p>
                </div>
                <span className="mt-auto flex items-center gap-1.5 text-sm font-semibold text-brand-blue opacity-0 transition-opacity group-hover:opacity-100">
                  Learn more <ArrowRight01Icon className="h-3.5 w-3.5" />
                </span>
              </Link>
            );
          })}
        </div>
      </Container>
    </section>
  );
}
