import type { Metadata } from "next";
import { buildPageMetadata } from "@/lib/content/seo";
import { ArrowRight } from "lucide-react";
import { PageHero } from "@/components/ui/page-hero";
import { RevealGroup, RevealItem } from "@/components/motion/reveal";
import { Container } from "@/components/ui/container";
import { SectionHeading } from "@/components/ui/section-heading";
import { Button } from "@/components/ui/button";
import { getPageHero, getPerks, getRoles } from "@/lib/content/resolvers";

export const revalidate = 3600;

/**
 * Title, description, canonical and social tags come from this page's
 * `page-seo` row when one has been filled in, and from the literals below
 * when it has not - so the admin can rewrite them without a deploy, and a
 * row nobody has touched changes nothing.
 */
export async function generateMetadata(): Promise<Metadata> {
  return buildPageMetadata("careers", {
    title: "Careers",
    description:
      "Open roles at KodeDristi and how we hire.",
    path: "/careers",
  });
}

export default async function CareersPage() {
  const [perks, roles, hero] = await Promise.all([
    getPerks(),
    getRoles(),
    getPageHero("careers"),
  ]);

  return (
    <>
      <PageHero
        eyebrow={hero?.eyebrow ?? "Company"}
        title={hero?.title ?? "Careers"}
        description={
          hero?.description ??
          "We hire in small numbers, for real ownership. If you'd rather ship than sit in standups, this is that kind of team."
        }
      >
        <Button href="/contact" size="lg">
          Send Us Your CV <ArrowRight className="h-6 w-6" />
        </Button>
      </PageHero>

      <section className="section">
        <Container>
          <RevealGroup className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {perks.map((perk) => (
              <RevealItem key={perk.title} className="tile p-5">
                <h3 className="font-semibold text-text-primary">{perk.title}</h3>
                <p className="mt-1 text-sm leading-relaxed text-text-muted">
                  {perk.description}
                </p>
              </RevealItem>
            ))}
          </RevealGroup>
        </Container>
      </section>

      <section className="section bg-background-secondary">
        <Container className="flex flex-col gap-8">
          <SectionHeading eyebrow="Open Roles" eyebrowTone="green" title="Current openings" />
          <div className="card card-on-panel flex flex-col divide-y divide-border overflow-hidden">
            {roles.map((role) => (
              <div
                key={role.title}
                className="flex flex-col items-start justify-between gap-3 p-4 sm:flex-row sm:items-center"
              >
                <div>
                  <p className="font-semibold text-text-primary">{role.title}</p>
                  <p className="text-sm text-text-muted">{role.type}</p>
                </div>
                <Button href="/contact" variant="outline" size="sm">
                  Apply <ArrowRight className="h-4 w-4" />
                </Button>
              </div>
            ))}
          </div>
          <p className="text-sm text-text-muted">
            Don&apos;t see a fit?{" "}
            <a href="/contact" className="font-semibold text-link hover:underline">
              Reach out anyway
            </a>{" "}
            — we keep a shortlist for future openings.
          </p>
        </Container>
      </section>
    </>
  );
}
