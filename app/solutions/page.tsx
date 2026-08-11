import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { PageHero } from "@/components/ui/page-hero";
import { Container } from "@/components/ui/container";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { solutions } from "@/lib/data/solutions";

export const metadata: Metadata = {
  title: "Solutions",
  description:
    "Web & mobile apps, SaaS products, AI & automation, custom software, cloud and DevOps, domain & hosting, design and marketing — KodeDristi's full service catalogue.",
};

export default function SolutionsPage() {
  return (
    <>
      <PageHero
        eyebrow="Solutions"
        title={`${solutions.length} delivery tracks. One accountable team.`}
        description="Every solution below follows the same disciplined process — a clear problem statement, a defined approach, concrete deliverables and a realistic timeline."
      >
        <Button href="/contact" size="lg">
          Book a Consultation <ArrowRight className="h-4 w-4" />
        </Button>
      </PageHero>

      <section className="py-16 sm:py-20">
        <Container className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {solutions.map((solution) => {
            const Icon = solution.icon;
            const isBlue = solution.accent === "blue";
            return (
              <Link
                key={solution.slug}
                href={`/solutions/${solution.slug}`}
                className="focus-ring group flex flex-col gap-4 card card-hover p-7"
              >
                <Icon
                  className={cn(
                    "h-5.5 w-5.5 shrink-0",
                    isBlue ? "text-brand-blue" : "text-brand-green-hover"
                  )}
                />
                <div>
                  <h2 className="text-xl font-semibold text-text-primary">{solution.name}</h2>
                  <p className="mt-2 text-sm leading-relaxed text-text-muted">
                    {solution.tagline}
                  </p>
                </div>
                <div className="mt-auto flex flex-wrap gap-2 pt-2">
                  {solution.tags.slice(0, 3).map((tag) => (
                    <span
                      key={tag}
                      className="rounded-full border border-border px-2.5 py-1 text-xs font-medium text-text-muted"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
                <span className="flex items-center gap-1.5 text-sm font-semibold text-brand-blue opacity-0 transition-opacity group-hover:opacity-100">
                  View solution <ArrowRight className="h-3.5 w-3.5" />
                </span>
              </Link>
            );
          })}
        </Container>
      </section>
    </>
  );
}
