import type { Metadata } from "next";
import { ArrowRight } from "lucide-react";
import { PageHero } from "@/components/ui/page-hero";
import {
  ShowcaseCard,
  showcaseGridInner,
  showcaseGridOuter,
} from "@/components/ui/showcase-card";
import { Button } from "@/components/ui/button";
import { RevealGroup, RevealItem } from "@/components/motion/reveal";
import { getPageHero, getSolutions } from "@/lib/content/resolvers";

export const revalidate = 3600;

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
        <div className={showcaseGridOuter}>
          <RevealGroup className={showcaseGridInner}>
            {/* Every card the same light (green-tinted) tone here, not the
                homepage grid's light/ink checkerboard — this page is the
                full catalogue rather than a curated pair-up, and a long run
                of alternating dark and light tiles reads as noisier than a
                single, calm, consistent surface. */}
            {solutions.map((solution) => (
              <RevealItem key={solution.slug} className="flex">
                <ShowcaseCard
                  tone="light"
                  title={solution.name}
                  description={solution.tagline}
                  href={`/solutions/${solution.slug}`}
                  actionLabel="View solution"
                  secondary={{ label: "Get a quote", href: "/contact" }}
                  image={solution.image}
                  className="min-h-[420px] sm:min-h-[500px] lg:min-h-[560px] [&_[data-image-slot]]:min-h-[220px] sm:[&_[data-image-slot]]:min-h-[280px]"
                />
              </RevealItem>
            ))}
          </RevealGroup>
        </div>
      </section>
    </>
  );
}
