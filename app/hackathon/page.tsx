import type { Metadata } from "next";
import { ArrowRight } from "lucide-react";
import { PageHero } from "@/components/ui/page-hero";
import { Container } from "@/components/ui/container";
import { SectionHeading } from "@/components/ui/section-heading";
import { Button } from "@/components/ui/button";
import {
  getHackathonHighlights,
  getHackathonTimeline,
  getHackathonTracks,
  getPageHero,
} from "@/lib/content/resolvers";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "National AI Hackathon",
  description:
    "KodeDristi's flagship National AI Hackathon — 48 hours, real mentors, real prizes, and a direct line to our hiring and partner network.",
};

export default async function HackathonPage() {
  const [timeline, tracks, highlights, hero] = await Promise.all([
    getHackathonTimeline(),
    getHackathonTracks(),
    getHackathonHighlights(),
    getPageHero("hackathon"),
  ]);

  return (
    <>
      <PageHero
        eyebrow={hero?.eyebrow ?? "Flagship Program"}
        title={hero?.title ?? "National AI Hackathon"}
        description={
          hero?.description ??
          "KodeDristi's flagship national competition for student and professional builders — 48 hours, real mentors, real prizes, and a direct line to our hiring and partner network."
        }
      >
        <div className="flex flex-wrap items-center gap-3">
          <Button href="/contact" size="lg">
            Register for Hackathon <ArrowRight className="h-6 w-6" />
          </Button>
          <Button href="#tracks" variant="outline" size="lg">
            View Tracks
          </Button>
        </div>
      </PageHero>

      <section className="section-tight border-y border-border bg-surface">
        <Container className="grid grid-cols-2 gap-4 sm:grid-cols-4">
          {highlights.map((item) => (
            <div key={item.label} className="flex flex-col items-center gap-1.5 text-center">
              <item.icon className="h-7 w-7 text-brand-blue" />
              <p className="text-sm font-semibold text-text-primary">{item.label}</p>
            </div>
          ))}
        </Container>
      </section>

      <section id="tracks" className="section">
        <Container className="flex flex-col gap-8">
          <SectionHeading eyebrow="Tracks" title="Three ways to compete" />
          <div className="grid gap-4 sm:grid-cols-3">
            {tracks.map((track) => (
              <div key={track.title} className="card p-5">
                <h3 className="font-semibold text-text-primary">{track.title}</h3>
                <p className="mt-1.5 text-sm leading-relaxed text-text-muted">
                  {track.description}
                </p>
              </div>
            ))}
          </div>
        </Container>
      </section>

      <section className="section bg-background-secondary">
        <Container className="flex flex-col gap-8">
          <SectionHeading eyebrow="Schedule" eyebrowTone="green" title="How the weekend runs" />
          <ol className="flex flex-col gap-4">
            {timeline.map((item, i) => (
              <li key={item.label} className="flex gap-3">
                <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-[var(--radius-sm)] bg-brand-green text-xs font-bold text-white">
                  {i + 1}
                </span>
                <div>
                  <p className="font-semibold text-text-primary">{item.label}</p>
                  <p className="mt-0.5 text-sm text-text-muted">{item.detail}</p>
                </div>
              </li>
            ))}
          </ol>
        </Container>
      </section>

      <section className="section">
        <Container>
          <div className="on-brand relative overflow-hidden rounded-card border border-brand-blue bg-brand-blue px-8 py-20 text-center text-white sm:px-16">
            <div className="absolute left-0 top-0 h-full w-1 bg-brand-green" aria-hidden="true" />
            <h2 className="display-md max-w-xl font-semibold">Ready to compete?</h2>
            <p className="mt-3 max-w-lg text-white/70">
              Full rulebook, judging criteria and sponsorship proposal are available on
              request — detailed content for this program is being finalised.
            </p>
            <Button href="/contact" size="lg" className="mt-6 bg-white text-brand-blue hover:bg-white/90">
              Register for Hackathon <ArrowRight className="h-5 w-5" />
            </Button>
          </div>
        </Container>
      </section>
    </>
  );
}
