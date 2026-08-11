import type { Metadata } from "next";
import { ArrowRight, Heart, Rocket, GraduationCap, MapPinned } from "lucide-react";
import { PageHero } from "@/components/ui/page-hero";
import { Container } from "@/components/ui/container";
import { SectionHeading } from "@/components/ui/section-heading";
import { Button } from "@/components/ui/button";

export const metadata: Metadata = {
  title: "Careers",
  description: "Open roles at KodeDristi and how we hire.",
};

const PERKS = [
  { icon: Rocket, title: "Real client work", description: "Ship to production from week one — no bench time on toy projects." },
  { icon: GraduationCap, title: "Teach what you build", description: "Engineers can instruct in our course programs alongside client work." },
  { icon: Heart, title: "Small, senior teams", description: "Work directly with leadership — no layers between you and the decision." },
  { icon: MapPinned, title: "Kathmandu-based, remote-friendly", description: "Hybrid setup with flexibility for the right role." },
];

const OPEN_ROLES = [
  { title: "Full-Stack Engineer (Next.js / Laravel)", type: "Full-time · Kathmandu" },
  { title: "AI/ML Engineer", type: "Full-time · Kathmandu / Remote" },
  { title: "Flutter Developer", type: "Full-time · Kathmandu" },
  { title: "Course Instructor — Cloud & DevOps", type: "Part-time · Remote" },
];

export default function CareersPage() {
  return (
    <>
      <PageHero
        eyebrow="Company"
        title="Careers"
        description="We hire in small numbers, for real ownership. If you'd rather ship than sit in standups, this is that kind of team."
      >
        <Button href="/contact" size="lg">
          Send Us Your CV <ArrowRight className="h-4 w-4" />
        </Button>
      </PageHero>

      <section className="py-16 sm:py-20">
        <Container className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {PERKS.map((perk) => (
            <div key={perk.title} className="card p-6">
              <perk.icon className="h-5.5 w-5.5 text-brand-blue" />
              <h3 className="mt-4 font-semibold text-text-primary">{perk.title}</h3>
              <p className="mt-1.5 text-sm leading-relaxed text-text-muted">
                {perk.description}
              </p>
            </div>
          ))}
        </Container>
      </section>

      <section className="bg-background-secondary py-16 sm:py-20">
        <Container className="flex flex-col gap-10">
          <SectionHeading eyebrow="Open Roles" eyebrowTone="green" title="Current openings" />
          <div className="flex flex-col divide-y divide-border overflow-hidden card">
            {OPEN_ROLES.map((role) => (
              <div
                key={role.title}
                className="flex flex-col items-start justify-between gap-3 p-5 sm:flex-row sm:items-center"
              >
                <div>
                  <p className="font-semibold text-text-primary">{role.title}</p>
                  <p className="text-sm text-text-muted">{role.type}</p>
                </div>
                <Button href="/contact" variant="outline" size="sm">
                  Apply <ArrowRight className="h-3.5 w-3.5" />
                </Button>
              </div>
            ))}
          </div>
          <p className="text-sm text-text-muted">
            Don&apos;t see a fit?{" "}
            <a href="/contact" className="font-semibold text-brand-blue hover:underline">
              Reach out anyway
            </a>{" "}
            — we keep a shortlist for future openings.
          </p>
        </Container>
      </section>
    </>
  );
}
