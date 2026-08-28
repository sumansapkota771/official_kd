import type { Metadata } from "next";
import { buildPageMetadata } from "@/lib/content/seo";
import { ArrowRight, Compass, Download, Heart, MapPin, Target, Users } from "lucide-react";
import { PageHero } from "@/components/ui/page-hero";
import { Container } from "@/components/ui/container";
import { SectionHeading } from "@/components/ui/section-heading";
import { Button } from "@/components/ui/button";
import {
  getCapabilities,
  getLeadership,
  getPageHero,
  getValues,
} from "@/lib/content/resolvers";

export const revalidate = 3600;

/**
 * Title, description, canonical and social tags come from this page's
 * `page-seo` row when one has been filled in, and from the literals below
 * when it has not - so the admin can rewrite them without a deploy, and a
 * row nobody has touched changes nothing.
 */
export async function generateMetadata(): Promise<Metadata> {
  return buildPageMetadata("about", {
    title: "About",
    description:
      "KodeDristi's mission, values, leadership, capabilities and work culture — the company behind #WithYouEveryStep.",
    path: "/about",
  });
}

export default async function AboutPage() {
  const [values, capabilities, leadership, hero] = await Promise.all([
    getValues(),
    getCapabilities(),
    getLeadership(),
    getPageHero("about"),
  ]);

  return (
    <>
      <PageHero
        eyebrow={hero?.eyebrow ?? "Company"}
        title={hero?.title ?? "Software and skills, built together"}
        description={
          hero?.description ??
          "KodeDristi is a Kathmandu-based software company that builds client products and runs applied IT courses from the same engineering bench — #WithYouEveryStep."
        }
      >
        <div className="flex flex-wrap items-center gap-3">
          <Button href="/team" size="lg">
            Meet the Team <ArrowRight className="h-6 w-6" />
          </Button>
          <Button href="/partners" variant="outline" size="lg">
            Partner With Us
          </Button>
        </div>
      </PageHero>

      <section className="section-tight">
        <Container className="grid gap-3 sm:gap-4 sm:grid-cols-2">
          <div className="card p-6">
            <Target className="h-7 w-7 text-link" />
            <h2 className="mt-3 text-lg font-semibold text-text-primary">Mission</h2>
            <p className="mt-2 text-sm leading-relaxed text-text-muted">
              To make quality software and quality technical education equally accessible —
              so businesses ship reliably and the people who build for them keep growing.
            </p>
          </div>
          <div className="card p-6">
            <Compass className="h-7 w-7 text-brand-green-hover" />
            <h2 className="mt-3 text-lg font-semibold text-text-primary">Values</h2>
            <ul className="mt-2.5 flex flex-col gap-1.5">
              {values.slice(0, 2).map((v) => (
                <li key={v.title} className="text-sm text-text-muted">
                  <span className="font-semibold text-text-secondary">{v.title}.</span>{" "}
                  {v.description}
                </li>
              ))}
            </ul>
          </div>
        </Container>
      </section>

      <section className="section bg-background-secondary">
        <Container className="flex flex-col gap-8">
          <SectionHeading title="What we value" />
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {values.map((v) => (
              <div key={v.title} className="tile p-5">
                <Heart className="h-6 w-6 text-brand-green-hover" />
                <h3 className="mt-2.5 font-semibold text-text-primary">{v.title}</h3>
                <p className="mt-1 text-sm leading-relaxed text-text-muted">
                  {v.description}
                </p>
              </div>
            ))}
          </div>
        </Container>
      </section>

      <section className="section">
        <Container className="grid gap-10 lg:grid-cols-2">
          <div>
            <SectionHeading eyebrow="Leadership" title="Who runs KodeDristi" />
            <div className="mt-5 flex flex-col gap-3">
              {leadership.map((person) => (
                <div key={person.name} className="flex items-center gap-3 card p-3.5">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-[var(--radius-sm)] bg-brand-blue text-xs font-bold text-white">
                    {person.name.split(" ").map((n) => n[0]).join("")}
                  </div>
                  <div>
                    <p className="font-semibold text-text-primary">{person.name}</p>
                    <p className="text-sm text-brand-green-hover">{person.role}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div>
            <SectionHeading eyebrow="Capabilities" eyebrowTone="green" title="What we're built to do" />
            <ul className="mt-5 grid gap-2 sm:grid-cols-2">
              {capabilities.map((c) => (
                <li key={c.slug} className="tile px-4 py-2.5 text-sm text-text-secondary">
                  {c.label}
                </li>
              ))}
            </ul>
          </div>
        </Container>
      </section>

      <section className="section bg-background-secondary">
        <Container className="grid gap-3 sm:gap-4 sm:grid-cols-2">
          <div className="card card-on-panel p-6">
            <MapPin className="h-7 w-7 text-link" />
            <h2 className="mt-3 text-lg font-semibold text-text-primary">Location</h2>
            <p className="mt-2 text-sm leading-relaxed text-text-muted">
              Kathmandu, Nepal — working with clients locally and internationally, remote-first
              across engagements.
            </p>
          </div>
          <div className="card card-on-panel p-6">
            <Users className="h-7 w-7 text-brand-green-hover" />
            <h2 className="mt-3 text-lg font-semibold text-text-primary">Work culture</h2>
            <p className="mt-2 text-sm leading-relaxed text-text-muted">
              Small senior pods, sprint demos every two weeks, and an open door between our
              client delivery team and our instructors.
            </p>
          </div>
        </Container>
      </section>

      <section className="section">
        <Container className="card flex flex-col items-center gap-5 p-8 text-center sm:p-12">
          <h2 className="text-xl font-bold text-text-primary sm:text-2xl">
            Careers &amp; media kit
          </h2>
          <p className="max-w-xl text-sm leading-relaxed text-text-muted">
            Looking to join KodeDristi, or need our brand assets and company profile for
            press? Both are one click away.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-2.5">
            <Button href="/careers" size="lg">
              View Careers <ArrowRight className="h-5 w-5" />
            </Button>
            <Button href="/contact" variant="outline" size="lg">
              <Download className="h-5 w-5" /> Request Media Kit
            </Button>
          </div>
        </Container>
      </section>
    </>
  );
}
