import { ArrowRight01Icon } from "hugeicons-react";
import { Container } from "@/components/ui/container";
import { SectionHeading } from "@/components/ui/section-heading";
import { Button } from "@/components/ui/button";
import { leadership } from "@/lib/data/content";

export function TeamOverview() {
  return (
    <section className="bg-background-secondary py-20 sm:py-24">
      <Container className="flex flex-col gap-12">
        <div className="flex flex-col items-start justify-between gap-6 sm:flex-row sm:items-end">
          <SectionHeading
            eyebrow="Leadership"
            title="The team behind every delivery"
            description="A small, senior team — led by our CEO — that stays close to every engagement."
          />
          <Button href="/team" variant="outline" className="shrink-0">
            Meet the team <ArrowRight01Icon className="h-4 w-4" />
          </Button>
        </div>

        <div className="grid gap-5 sm:grid-cols-3">
          {leadership.map((person) => (
            <div key={person.name} className="card p-6">
              <div className="flex h-14 w-14 items-center justify-center rounded-full bg-brand-blue text-lg font-bold text-white">
                {person.name
                  .split(" ")
                  .map((n) => n[0])
                  .join("")}
              </div>
              <h3 className="mt-4 font-semibold text-text-primary">{person.name}</h3>
              <p className="text-sm font-medium text-brand-blue">{person.role}</p>
              <p className="mt-2 text-sm leading-relaxed text-text-muted">{person.bio}</p>
            </div>
          ))}
        </div>
      </Container>
    </section>
  );
}
