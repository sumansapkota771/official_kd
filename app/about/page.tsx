import type { Metadata } from "next";
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

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "About",
  description:
    "KodeDristi's mission, values, leadership, capabilities and work culture — the company behind #WithYouEveryStep.",
};

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
            Meet the Team <ArrowRight className="h-4 w-4" />
          </Button>
          <Button href="/partners" variant="outline" size="lg">
            Partner With Us
          </Button>
        </div>
      </PageHero>

      <section className="py-16 sm:py-20">
        <Container className="grid gap-6 sm:grid-cols-2">
          <div className="card p-7">
            <Target className="h-5.5 w-5.5 text-brand-blue" />
            <h2 className="mt-4 text-xl font-semibold text-text-primary">Mission</h2>
            <p className="mt-2 text-sm leading-relaxed text-text-muted">
              To make quality software and quality technical education equally accessible —
              so businesses ship reliably and the people who build for them keep growing.
            </p>
          </div>
          <div className="card p-7">
            <Compass className="h-5.5 w-5.5 text-brand-green-hover" />
            <h2 className="mt-4 text-xl font-semibold text-text-primary">Values</h2>
            <ul className="mt-3 flex flex-col gap-2">
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

      <section className="bg-background-secondary py-16 sm:py-20">
        <Container className="flex flex-col gap-10">
          <SectionHeading title="What we value" />
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {values.map((v) => (
              <div key={v.title} className="card p-6">
                <Heart className="h-5 w-5 text-brand-green-hover" />
                <h3 className="mt-3 font-semibold text-text-primary">{v.title}</h3>
                <p className="mt-1.5 text-sm leading-relaxed text-text-muted">
                  {v.description}
                </p>
              </div>
            ))}
          </div>
        </Container>
      </section>

      <section className="py-16 sm:py-20">
        <Container className="grid gap-12 lg:grid-cols-2">
          <div>
            <SectionHeading eyebrow="Leadership" title="Who runs KodeDristi" />
            <div className="mt-6 flex flex-col gap-4">
              {leadership.map((person) => (
                <div key={person.name} className="flex items-center gap-4 card p-4">
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-brand-blue text-sm font-bold text-white">
                    {person.name.split(" ").map((n) => n[0]).join("")}
                  </div>
                  <div>
                    <p className="font-semibold text-text-primary">{person.name}</p>
                    <p className="text-sm text-brand-blue">{person.role}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div>
            <SectionHeading eyebrow="Capabilities" eyebrowTone="green" title="What we're built to do" />
            <ul className="mt-6 grid gap-3 sm:grid-cols-2">
              {capabilities.map((c) => (
                <li key={c.slug} className="tile p-4 text-sm text-text-secondary">
                  {c.label}
                </li>
              ))}
            </ul>
          </div>
        </Container>
      </section>

      <section className="bg-background-secondary py-16 sm:py-20">
        <Container className="grid gap-6 sm:grid-cols-2">
          <div className="card p-7">
            <MapPin className="h-5.5 w-5.5 text-brand-blue" />
            <h2 className="mt-4 text-xl font-semibold text-text-primary">Location</h2>
            <p className="mt-2 text-sm leading-relaxed text-text-muted">
              Kathmandu, Nepal — working with clients locally and internationally, remote-first
              across engagements.
            </p>
          </div>
          <div className="card p-7">
            <Users className="h-5.5 w-5.5 text-brand-green-hover" />
            <h2 className="mt-4 text-xl font-semibold text-text-primary">Work culture</h2>
            <p className="mt-2 text-sm leading-relaxed text-text-muted">
              Small senior pods, sprint demos every two weeks, and an open door between our
              client delivery team and our instructors.
            </p>
          </div>
        </Container>
      </section>

      <section className="py-16 sm:py-20">
        <Container className="flex flex-col items-center gap-6 card p-10 text-center sm:p-14">
          <h2 className="text-2xl font-bold text-text-primary sm:text-3xl">
            Careers &amp; media kit
          </h2>
          <p className="max-w-xl text-sm leading-relaxed text-text-muted sm:text-base">
            Looking to join KodeDristi, or need our brand assets and company profile for
            press? Both are one click away.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-3">
            <Button href="/careers" size="lg">
              View Careers <ArrowRight className="h-4 w-4" />
            </Button>
            <Button href="/contact" variant="outline" size="lg">
              <Download className="h-4 w-4" /> Request Media Kit
            </Button>
          </div>
        </Container>
      </section>
    </>
  );
}
