import { ArrowRight01Icon } from "hugeicons-react";
import { Container } from "@/components/ui/container";
import { SectionHeading } from "@/components/ui/section-heading";
import { Button } from "@/components/ui/button";
import { Reveal, RevealGroup, RevealItem } from "@/components/motion/reveal";
import { TeamCard } from "@/components/team/team-card";
import { getLeadership, getSectionHeading } from "@/lib/content/resolvers";
import { cn } from "@/lib/utils";

export async function TeamOverview({ className }: { className?: string }) {
  const [leadership, heading] = await Promise.all([
    getLeadership(),
    getSectionHeading("team-overview"),
  ]);

  return (
    <section className={cn("section", className)}>
      <Container className="flex flex-col gap-14">
        <Reveal className="flex flex-col items-start justify-between gap-6 sm:flex-row sm:items-end">
          <SectionHeading
            eyebrow={heading?.eyebrow ?? "Leadership"}
            eyebrowTone={heading?.eyebrowTone}
            title={heading?.title ?? "The team behind every delivery"}
            description={
              heading?.description ??
              "A small, senior team — led by our CEO — that stays close to every engagement."
            }
          />
          <Button href="/team" variant="outline" className="shrink-0">
            Meet the team
            <ArrowRight01Icon className="h-6 w-6 transition-transform duration-micro ease-out-quint group-hover/btn:translate-x-0.5" />
          </Button>
        </Reveal>

        {/* The same portrait tile the /team wall uses, so the homepage
            preview and the full page cannot drift into two different
            treatments of the same people. */}
        <RevealGroup
          as="ul"
          stagger={0.05}
          className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4"
        >
          {leadership.map((person) => (
            <RevealItem key={person.slug} as="li" className="flex">
              <TeamCard person={person} />
            </RevealItem>
          ))}
        </RevealGroup>
      </Container>
    </section>
  );
}
