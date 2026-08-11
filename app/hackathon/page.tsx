import type { Metadata } from "next";
import { ArrowRight, Award, Calendar, Trophy, Users } from "lucide-react";
import { PageHero } from "@/components/ui/page-hero";
import { Container } from "@/components/ui/container";
import { SectionHeading } from "@/components/ui/section-heading";
import { Button } from "@/components/ui/button";

export const metadata: Metadata = {
  title: "National AI Hackathon",
  description:
    "KodeDristi's flagship National AI Hackathon — 48 hours, real mentors, real prizes, and a direct line to our hiring and partner network.",
};

const TIMELINE = [
  { label: "Registrations open", detail: "Teams of 2–4 register online" },
  { label: "Kickoff & problem statements", detail: "Live opening ceremony and track briefs" },
  { label: "48-hour build window", detail: "Mentors on call throughout" },
  { label: "Demos & judging", detail: "Live pitches to the judging panel" },
  { label: "Awards ceremony", detail: "Winners announced, prizes and offers extended" },
];

const TRACKS = [
  { title: "Applied AI", description: "LLM applications, computer vision or predictive models solving a real problem." },
  { title: "Civic & Social Impact", description: "Software addressing an education, health or public-service challenge in Nepal." },
  { title: "Open Innovation", description: "Any product idea — web, mobile or AI — judged on execution and impact." },
];

export default function HackathonPage() {
  return (
    <>
      <PageHero
        eyebrow="Flagship Program"
        title="National AI Hackathon"
        description="KodeDristi's flagship national competition for student and professional builders — 48 hours, real mentors, real prizes, and a direct line to our hiring and partner network."
      >
        <div className="flex flex-wrap items-center gap-3">
          <Button href="/contact" size="lg">
            Register for Hackathon <ArrowRight className="h-4 w-4" />
          </Button>
          <Button href="#tracks" variant="outline" size="lg">
            View Tracks
          </Button>
        </div>
      </PageHero>

      <section className="border-y border-border bg-surface py-10">
        <Container className="grid grid-cols-2 gap-6 sm:grid-cols-4">
          {[
            { icon: Users, label: "Teams of 2–4" },
            { icon: Calendar, label: "48-hour build" },
            { icon: Trophy, label: "Cash & prizes" },
            { icon: Award, label: "Hiring pipeline" },
          ].map((item) => (
            <div key={item.label} className="flex flex-col items-center gap-2 text-center">
              <item.icon className="h-5.5 w-5.5 text-brand-blue" />
              <p className="text-sm font-semibold text-text-primary">{item.label}</p>
            </div>
          ))}
        </Container>
      </section>

      <section id="tracks" className="py-16 sm:py-20">
        <Container className="flex flex-col gap-10">
          <SectionHeading eyebrow="Tracks" title="Three ways to compete" />
          <div className="grid gap-6 sm:grid-cols-3">
            {TRACKS.map((track) => (
              <div key={track.title} className="card p-6">
                <h3 className="font-semibold text-text-primary">{track.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-text-muted">
                  {track.description}
                </p>
              </div>
            ))}
          </div>
        </Container>
      </section>

      <section className="bg-background-secondary py-16 sm:py-20">
        <Container className="flex flex-col gap-10">
          <SectionHeading eyebrow="Schedule" eyebrowTone="green" title="How the weekend runs" />
          <ol className="flex flex-col gap-5">
            {TIMELINE.map((item, i) => (
              <li key={item.label} className="flex gap-4">
                <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-brand-green-light text-sm font-bold text-brand-green-hover">
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

      <section className="py-16 sm:py-20">
        <Container>
          <div className="flex flex-col items-center gap-6 rounded-3xl border border-border bg-brand-blue px-6 py-14 text-center text-white sm:px-12">
            <h2 className="max-w-xl text-3xl font-semibold leading-tight tracking-[-0.02em] sm:text-4xl">
              Ready to compete?
            </h2>
            <p className="max-w-lg text-white/85">
              Full rulebook, judging criteria and sponsorship proposal are available on
              request — detailed content for this program is being finalised.
            </p>
            <Button href="/contact" size="lg" className="bg-white text-brand-blue hover:bg-white/90">
              Register for Hackathon <ArrowRight className="h-4 w-4" />
            </Button>
          </div>
        </Container>
      </section>
    </>
  );
}
