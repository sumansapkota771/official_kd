import type { Metadata } from "next";
import { ArrowRight } from "lucide-react";
import { PageHero } from "@/components/ui/page-hero";
import { Container } from "@/components/ui/container";
import { Button } from "@/components/ui/button";
import { getPageHero, getTeamMembers } from "@/lib/content/resolvers";

export const revalidate = 3600;

export const metadata: Metadata = {
  title: "Team",
  description: "The people behind KodeDristi's client work and course programs.",
};

export default async function TeamPage() {
  const [team, hero] = await Promise.all([getTeamMembers(), getPageHero("team")]);

  return (
    <>
      <PageHero
        eyebrow={hero?.eyebrow ?? "Company"}
        title={hero?.title ?? "Team"}
        description={
          hero?.description ??
          "A small, senior bench across engineering, design and instruction — the same people on your project are the ones teaching our courses."
        }
      >
        <Button href="/careers" size="lg">
          View Open Roles <ArrowRight className="h-6 w-6" />
        </Button>
      </PageHero>

      <section className="section">
        <Container className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {team.map((person) => (
            <div key={person.name} className="card p-5">
              <div className="flex h-11 w-11 items-center justify-center rounded-[var(--radius-sm)] bg-brand-blue text-sm font-bold text-white">
                {person.name.split(" ").map((n) => n[0]).join("")}
              </div>
              <h3 className="mt-3 font-semibold text-text-primary">{person.name}</h3>
              <p className="mt-0.5 text-sm font-medium text-brand-green-hover">{person.role}</p>
              <p className="mt-2 text-sm leading-relaxed text-text-muted">{person.bio}</p>
            </div>
          ))}
        </Container>
      </section>
    </>
  );
}
