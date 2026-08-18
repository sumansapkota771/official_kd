import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { PageHero } from "@/components/ui/page-hero";
import { Container } from "@/components/ui/container";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { getPageHero, getSolutions } from "@/lib/content/resolvers";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Solutions",
  description:
    "Web & mobile apps, SaaS products, AI & automation, custom software, cloud and DevOps, domain & hosting, design and marketing — KodeDristi's full service catalogue.",
};

export default async function SolutionsPage() {
  const solutions = await getSolutions();
  const hero = (await getPageHero("solutions")) ?? {
    eyebrow: "Solutions",
    title: `${solutions.length} delivery tracks. One accountable team.`,
    description:
      "Every solution below follows the same disciplined process — a clear problem statement, a defined approach, concrete deliverables and a realistic timeline.",
  };

  return (
    <>
      <PageHero eyebrow={hero.eyebrow} title={hero.title} description={hero.description}>
        <Button href="/contact" size="lg">
          Book a Consultation <ArrowRight className="h-6 w-6" />
        </Button>
      </PageHero>

      <section className="section">
        <Container className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {solutions.map((solution) => {
            const Icon = solution.icon;
            const isBlue = solution.accent === "blue";
            return (
              <Link
                key={solution.slug}
                href={`/solutions/${solution.slug}`}
                className="focus-ring group flex flex-col gap-3 card card-hover p-6"
              >
                <Icon
                  className={cn(
                    "h-7 w-7 shrink-0",
                    isBlue ? "text-brand-blue" : "text-brand-green-hover"
                  )}
                />
                <div>
                  <h2 className="text-lg font-semibold text-text-primary">{solution.name}</h2>
                  <p className="mt-1.5 text-sm leading-relaxed text-text-muted">
                    {solution.tagline}
                  </p>
                </div>
                <div className="mt-auto flex flex-wrap gap-1.5 pt-2">
                  {solution.tags.slice(0, 3).map((tag) => (
                    <span
                      key={tag}
                      className="rounded-[var(--radius-sm)] border border-border px-2 py-0.5 text-[11px] font-medium text-text-muted"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
                <span className="flex items-center gap-1.5 text-sm font-semibold text-brand-blue opacity-0 transition-opacity group-hover:opacity-100">
                  View solution <ArrowRight className="h-4 w-4" />
                </span>
              </Link>
            );
          })}
        </Container>
      </section>
    </>
  );
}
