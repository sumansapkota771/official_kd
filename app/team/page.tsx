import type { Metadata } from "next";
import { ArrowRight } from "lucide-react";
import { PageHero } from "@/components/ui/page-hero";
import { Container } from "@/components/ui/container";
import { Button } from "@/components/ui/button";
import { getPageHero, getTeamMembers } from "@/lib/content/resolvers";

export const dynamic = "force-dynamic";

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
          View Open Roles <ArrowRight className="h-4 w-4" />
        </Button>
      </PageHero>

      <section className="py-16 sm:py-20">
        <Container className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {team.map((person) => (
            <div key={person.name} className="card p-6">
              <div className="flex h-14 w-14 items-center justify-center rounded-full bg-brand-blue text-lg font-bold text-white">
                {person.name.split(" ").map((n) => n[0]).join("")}
              </div>
              <h3 className="mt-4 font-semibold text-text-primary">{person.name}</h3>
              <p className="text-sm font-medium text-brand-blue">{person.role}</p>
              <p className="mt-2 text-sm leading-relaxed text-text-muted">{person.bio}</p>
            </div>
          ))}
        </Container>
      </section>
    </>
  );
}
