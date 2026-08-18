import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowRight, CheckCircle2, Clock, Sparkles } from "lucide-react";
import { PageHero } from "@/components/ui/page-hero";
import { Container } from "@/components/ui/container";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { getSolution, getSolutions } from "@/lib/content/resolvers";

export const dynamic = "force-dynamic";

export async function generateStaticParams() {
  const solutions = await getSolutions();
  return solutions.map((s) => ({ slug: s.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const solution = await getSolution(slug);
  if (!solution) return {};
  return {
    title: solution.name,
    description: solution.tagline,
  };
}

export default async function SolutionDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const solution = await getSolution(slug);
  if (!solution) notFound();

  const Icon = solution.icon;
  const isBlue = solution.accent === "blue";
  const all = await getSolutions();
  const other = all.filter((s) => s.slug !== solution.slug).slice(0, 3);

  return (
    <>
      <PageHero eyebrow="Solutions" eyebrowTone={solution.accent} title={solution.name} description={solution.tagline}>
        <div className="flex flex-wrap items-center gap-3">
          <Button href="/contact" size="lg">
            Book a Consultation <ArrowRight className="h-4 w-4" />
          </Button>
          <Button href="/contact" variant="outline" size="lg">
            Request Proposal
          </Button>
        </div>
      </PageHero>

      <section className="py-20 sm:py-24">
        <Container className="grid gap-12 lg:grid-cols-[1fr_320px]">
          <div className="flex flex-col gap-10">
            <Block
              title="Problem"
              tone={isBlue ? "blue" : "green"}
              icon={Icon}
            >
              <p className="text-base leading-relaxed text-text-secondary">{solution.problem}</p>
            </Block>

            <Block title="Approach" tone={isBlue ? "green" : "blue"} icon={Sparkles}>
              <p className="text-base leading-relaxed text-text-secondary">{solution.approach}</p>
            </Block>

            <Block title="Deliverables" tone={isBlue ? "blue" : "green"} icon={CheckCircle2}>
              <ul className="grid gap-3 sm:grid-cols-2">
                {solution.deliverables.map((item) => (
                  <li key={item} className="flex items-start gap-2 text-sm text-text-secondary">
                    <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-brand-green-hover" />
                    {item}
                  </li>
                ))}
              </ul>
            </Block>
          </div>

          <aside className="flex flex-col gap-6">
            <div className="card p-6">
              <p className="flex items-center gap-2 text-sm font-semibold text-text-primary">
                <Clock className="h-4 w-4 text-brand-blue" /> Timeline range
              </p>
              <p className="mt-1 text-2xl font-bold text-text-primary">{solution.timeline}</p>
            </div>

            <div className="card p-6">
              <p className="text-sm font-semibold text-text-primary">Tags &amp; proof</p>
              <div className="mt-3 flex flex-wrap gap-2">
                {solution.tags.map((tag) => (
                  <Badge key={tag} tone={isBlue ? "blue" : "green"}>
                    {tag}
                  </Badge>
                ))}
              </div>
              <p className="mt-4 text-sm leading-relaxed text-text-muted">{solution.proof}</p>
            </div>

            <div className="panel p-6">
              <p className="text-sm font-semibold text-text-primary">Other solutions</p>
              <ul className="mt-3 flex flex-col gap-2">
                {other.map((s) => (
                  <li key={s.slug}>
                    <Link
                      href={`/solutions/${s.slug}`}
                      className="focus-ring flex items-center justify-between rounded-lg px-2 py-2 text-sm text-text-secondary hover:bg-surface hover:text-brand-blue"
                    >
                      {s.name}
                      <ArrowRight className="h-3.5 w-3.5" />
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </aside>
        </Container>
      </section>
    </>
  );
}

function Block({
  title,
  tone,
  icon: Icon,
  children,
}: {
  title: string;
  tone: "blue" | "green";
  icon: React.ComponentType<{ className?: string }>;
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col gap-3">
      <div className="flex items-center gap-2.5">
        <Icon
          className={
            tone === "blue"
              ? "h-4.5 w-4.5 text-brand-blue"
              : "h-4.5 w-4.5 text-brand-green-hover"
          }
        />
        <h2 className="text-lg font-semibold text-text-primary">{title}</h2>
      </div>
      {children}
    </div>
  );
}
