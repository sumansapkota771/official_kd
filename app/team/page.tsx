import type { Metadata } from "next";
import { buildPageMetadata } from "@/lib/content/seo";
import { ArrowRight } from "lucide-react";
import { PageHero } from "@/components/ui/page-hero";
import { Container } from "@/components/ui/container";
import { TeamCard } from "@/components/team/team-card";
import { RevealGroup, RevealItem } from "@/components/motion/reveal";
import { Button } from "@/components/ui/button";
import { getPageHero, getTeamMembers } from "@/lib/content/resolvers";

export const revalidate = 3600;

/**
 * Title, description, canonical and social tags come from this page's
 * `page-seo` row when one has been filled in, and from the literals below
 * when it has not - so the admin can rewrite them without a deploy, and a
 * row nobody has touched changes nothing.
 */
export async function generateMetadata(): Promise<Metadata> {
  return buildPageMetadata("team", {
    title: "Team",
    description:
      "The people behind KodeDristi's client work and course programs.",
    path: "/team",
  });
}

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
        <Container>
          {/* Four across at desktop, two on a phone. A portrait wall wants
              density — at two columns the faces get large enough to read as
              individual profiles rather than as one group. */}
          <RevealGroup
            as="ul"
            stagger={0.04}
            className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4"
          >
            {team.map((person) => (
              <RevealItem key={person.slug ?? person.name} as="li" className="flex">
                <TeamCard person={person} />
              </RevealItem>
            ))}
          </RevealGroup>
        </Container>
      </section>
    </>
  );
}
