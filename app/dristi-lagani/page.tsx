import type { Metadata } from "next";
import Image from "next/image";
import { ArrowRight } from "lucide-react";
import { PageHero } from "@/components/ui/page-hero";
import { Container } from "@/components/ui/container";
import { SectionHeading } from "@/components/ui/section-heading";
import { Button } from "@/components/ui/button";
import {
  getLaganiFocus,
  getLaganiHighlights,
  getLaganiPortfolio,
  getLaganiProcess,
  getPageHero,
  getSectionHeading,
} from "@/lib/content/resolvers";
import type { LaganiPortfolioData } from "@/lib/content/schemas";
import { cn } from "@/lib/utils";

export const revalidate = 3600;

export const metadata: Metadata = {
  title: "Dristi Lagani",
  description:
    "KodeDristi's investment programme for early-stage Nepali software companies — capital and an engineering team, not just a cheque.",
};

export default async function DristiLaganiPage() {
  const [highlights, focus, process, portfolio, hero, portfolioHeading] =
    await Promise.all([
      getLaganiHighlights(),
      getLaganiFocus(),
      getLaganiProcess(),
      getLaganiPortfolio(),
      getPageHero("dristi-lagani"),
      getSectionHeading("lagani-portfolio"),
    ]);

  return (
    <>
      <PageHero
        eyebrow={hero?.eyebrow ?? "Investment Program"}
        title={hero?.title ?? "Dristi Lagani"}
        description={
          hero?.description ??
          "Capital and an engineering team for early-stage Nepali software companies — we invest, then we build alongside you."
        }
        eyebrowTone={hero?.eyebrowTone ?? "green"}
      >
        <div className="flex flex-wrap items-center gap-3">
          <Button href="/contact" size="lg">
            Pitch to Dristi Lagani <ArrowRight className="h-6 w-6" />
          </Button>
          <Button href="#focus" variant="outline" size="lg">
            What we back
          </Button>
        </div>
      </PageHero>

      <section className="section-tight border-y border-border bg-surface">
        <Container className="grid grid-cols-2 gap-4 sm:grid-cols-4">
          {highlights.map((item) => (
            <div key={item.label} className="flex flex-col items-center gap-1.5 text-center">
              <item.icon className="h-7 w-7 text-brand-green-hover" />
              <p className="text-sm font-semibold text-text-primary">{item.label}</p>
            </div>
          ))}
        </Container>
      </section>

      <section id="focus" className="section">
        <Container className="flex flex-col gap-8">
          <SectionHeading
            eyebrow="Investment Focus"
            eyebrowTone="green"
            title="What we back"
          />
          <div className="grid gap-3 sm:grid-cols-3 sm:gap-4">
            {focus.map((area) => (
              <div key={area.slug} className="card p-5">
                <h3 className="font-semibold text-text-primary">{area.title}</h3>
                <p className="mt-1.5 text-sm leading-relaxed text-text-muted">
                  {area.description}
                </p>
              </div>
            ))}
          </div>
        </Container>
      </section>

      <section className="section bg-background-secondary">
        <Container className="flex flex-col gap-8">
          <SectionHeading eyebrow="Process" title="How funding works" />
          <ol className="flex flex-col gap-4">
            {process.map((step, i) => (
              <li key={step.slug} className="flex gap-3">
                <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-[var(--radius-sm)] bg-brand-blue text-xs font-bold text-white">
                  {i + 1}
                </span>
                <div>
                  <p className="font-semibold text-text-primary">{step.label}</p>
                  <p className="mt-0.5 text-sm text-text-muted">{step.detail}</p>
                </div>
              </li>
            ))}
          </ol>
        </Container>
      </section>

      {/* Hidden until there is a real portfolio to show. An investment page
          with an empty portfolio wall advertises the gap. */}
      {portfolio.length > 0 && (
        <section className="section">
          <Container className="flex flex-col gap-12">
            <SectionHeading
              eyebrow={portfolioHeading?.eyebrow ?? "Portfolio"}
              eyebrowTone={portfolioHeading?.eyebrowTone ?? "green"}
              title={portfolioHeading?.title ?? "Companies we have backed"}
              description={portfolioHeading?.description || undefined}
            />
            <ul className="grid grid-cols-2 gap-x-8 gap-y-12 sm:grid-cols-3 sm:gap-x-12 lg:grid-cols-4">
              {portfolio.map((company) => (
                <li key={company.slug} className="flex">
                  <PortfolioMark company={company} />
                </li>
              ))}
            </ul>
          </Container>
        </section>
      )}

      <section className="section bg-background-secondary">
        <Container>
          <div className="on-brand relative overflow-hidden rounded-card border border-brand-blue bg-brand-blue px-8 py-20 text-center text-white sm:px-16">
            <div className="absolute left-0 top-0 h-full w-1 bg-brand-green" aria-hidden="true" />
            <h2 className="display-md max-w-xl font-semibold">Building something?</h2>
            <p className="mt-3 max-w-lg text-white/70">
              Send the deck, a demo, or just a clear write-up of the problem. We
              read everything and reply either way.
            </p>
            <Button href="/contact" size="lg" className="mt-6 bg-white text-link hover:bg-white/90">
              Pitch to Dristi Lagani <ArrowRight className="h-5 w-5" />
            </Button>
          </div>
        </Container>
      </section>
    </>
  );
}

const markClasses = "flex w-full flex-col items-center justify-center text-center";

/**
 * One portfolio company, drawn exactly like a hackathon partner: the mark
 * alone in a fixed well, no tile behind it, so a tall logo and a plain
 * wordmark still land on the same optical line.
 */
function PortfolioMark({ company }: { company: LaganiPortfolioData & { slug: string } }) {
  const mark = (
    <>
      <div className="relative flex h-16 w-full items-center justify-center sm:h-20">
        {company.logo ? (
          <Image
            src={company.logo}
            alt={company.name}
            fill
            sizes="(min-width: 1024px) 20vw, (min-width: 640px) 28vw, 42vw"
            className="object-contain object-center"
          />
        ) : (
          <span className="text-[17px] font-semibold leading-tight tracking-[-0.02em] text-balance text-text-primary sm:text-[19px]">
            {company.name}
          </span>
        )}
      </div>

      {company.stage && (
        <p className="mt-4 text-[11px] font-semibold uppercase tracking-wider text-text-muted sm:text-xs">
          {company.stage}
        </p>
      )}
    </>
  );

  if (company.url?.trim()) {
    return (
      <a
        href={company.url}
        target="_blank"
        rel="noreferrer noopener"
        className={cn(
          markClasses,
          "focus-ring transition-opacity duration-ui ease-out-quint hover:opacity-70"
        )}
      >
        {mark}
      </a>
    );
  }

  return <div className={markClasses}>{mark}</div>;
}
