import type { Metadata } from "next";
import { buildPageMetadata } from "@/lib/content/seo";
import { ArrowRight } from "lucide-react";
import { PageHero } from "@/components/ui/page-hero";
import { Container } from "@/components/ui/container";
import { SectionHeading } from "@/components/ui/section-heading";
import { Button } from "@/components/ui/button";
import { LogoWall } from "@/components/ui/logo-wall";
import {
  getPageHero,
  getPartnerBenefits,
  getPartners,
} from "@/lib/content/resolvers";

export const revalidate = 3600;

/**
 * Title, description, canonical and social tags come from this page's
 * `page-seo` row when one has been filled in, and from the literals below
 * when it has not - so the admin can rewrite them without a deploy, and a
 * row nobody has touched changes nothing.
 */
export async function generateMetadata(): Promise<Metadata> {
  return buildPageMetadata("partners", {
    title: "Partners",
    description:
      "KodeDristi's institutional and academic partners, and how to become a partner.",
    path: "/partners",
  });
}

export default async function PartnersPage() {
  const [partners, partnerBenefits, hero] = await Promise.all([
    getPartners(),
    getPartnerBenefits(),
    getPageHero("partners"),
  ]);

  return (
    <>
      <PageHero
        eyebrow={hero?.eyebrow ?? "Partners"}
        title={hero?.title ?? "Built with our partners, not just for them"}
        description={
          hero?.description ??
          "KodeDristi works with universities, training institutes and businesses to expand access to quality software education and delivery."
        }
      >
        <Button href="#become-a-partner" size="lg">
          Become a Partner <ArrowRight className="h-6 w-6" />
        </Button>
      </PageHero>

      <section id="institutional" className="section">
        <Container className="flex flex-col gap-8">
          <SectionHeading eyebrow="Partners" title="Trusted By Leading Organizations" />
          {/* The same wall the homepage uses, so a logo added in the admin
              looks identical in both places rather than being a name here
              and a mark there. */}
          <LogoWall
            items={partners.map((p) => ({
              name: p.name,
              logo: p.logo,
              alt: p.alt,
              url: p.url,
            }))}
          />
        </Container>
      </section>

      <section id="become-a-partner" className="section bg-background-secondary">
        <Container className="flex flex-col gap-8">
          <SectionHeading eyebrow="Become a Partner" eyebrowTone="green" title="What partnership looks like" />
          <div className="grid gap-3 sm:gap-4 sm:grid-cols-3">
            {partnerBenefits.map((b) => (
              <div key={b.title} className="card card-on-panel p-5">
                <h3 className="font-semibold text-text-primary">{b.title}</h3>
                <p className="mt-1 text-sm leading-relaxed text-text-muted">
                  {b.description}
                </p>
              </div>
            ))}
          </div>
          <div className="card card-on-panel flex flex-col items-center gap-3 p-8 text-center">
            <h3 className="text-lg font-semibold text-text-primary">
              Ready to explore a partnership?
            </h3>
            <p className="max-w-lg text-sm leading-relaxed text-text-muted">
              Send us your organisation details and goals — we&apos;ll follow up with a
              proposal and a meeting invitation.
            </p>
            <Button href="/contact" size="lg">
              Start the Conversation <ArrowRight className="h-5 w-5" />
            </Button>
          </div>
        </Container>
      </section>
    </>
  );
}
