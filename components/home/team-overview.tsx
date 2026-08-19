import { ArrowRight01Icon } from "hugeicons-react";
import { Container } from "@/components/ui/container";
import { SectionHeading } from "@/components/ui/section-heading";
import { Button } from "@/components/ui/button";
import { Reveal, RevealGroup, RevealItem } from "@/components/motion/reveal";
import { getLeadership, getSectionHeading } from "@/lib/content/resolvers";
import { cn } from "@/lib/utils";

export async function TeamOverview({ className, imageUrl, mobileImageUrl }: { className?: string; imageUrl?: string; mobileImageUrl?: string }) {
  const [leadership, heading] = await Promise.all([
    getLeadership(),
    getSectionHeading("team-overview"),
  ]);

  return (
    <section data-section-key="team-overview" data-image-url={imageUrl || undefined} data-mobile-image-url={mobileImageUrl || undefined} className={cn("section", className)}>
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

        <RevealGroup className="grid gap-4 sm:grid-cols-3">
          {leadership.map((person) => (
            <RevealItem key={person.slug} className="flex">
              <div className="card group/person w-full p-6">
                <div className="flex h-12 w-12 items-center justify-center rounded-[var(--radius-sm)] bg-brand-blue text-sm font-bold text-white transition-colors duration-ui ease-out-quint group-hover/person:bg-brand-blue-hover">
                  {person.name
                    .split(" ")
                    .map((n) => n[0])
                    .join("")}
                </div>
                <h3 className="mt-4 font-semibold text-text-primary">{person.name}</h3>
                <p className="mt-0.5 text-sm font-medium text-brand-green-hover">{person.role}</p>
                <p className="mt-2 text-sm leading-relaxed text-text-muted">{person.bio}</p>
              </div>
            </RevealItem>
          ))}
        </RevealGroup>
      </Container>
    </section>
  );
}
