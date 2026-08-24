import type { Metadata } from "next";
import { ArrowRight } from "lucide-react";
import { PageHero } from "@/components/ui/page-hero";
import {
  ShowcaseCard,
  showcaseGridInner,
  showcaseGridOuter,
  showcaseTone,
} from "@/components/ui/showcase-card";
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
        <div className={showcaseGridOuter}>
          <div className={showcaseGridInner}>
            {team.map((person, i) => (
              <ShowcaseCard
                key={person.name}
                tone={showcaseTone(i)}
                eyebrow={person.role}
                title={person.name}
                description={person.bio}
                href="/careers"
                actionLabel="Work with us"
                image={person.image}
                /* Headshots are portraits, not scenery: cropping one to fill
                   the well is how you behead people. */
                imageFit="contain"
              />
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
