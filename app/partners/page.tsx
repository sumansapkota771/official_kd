import type { Metadata } from "next";
import { ArrowRight } from "lucide-react";
import { PageHero } from "@/components/ui/page-hero";
import { Container } from "@/components/ui/container";
import { SectionHeading } from "@/components/ui/section-heading";
import { Button } from "@/components/ui/button";
import {
  getPageHero,
  getPartnerBenefits,
  getPartners,
} from "@/lib/content/resolvers";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Partners",
  description:
    "KodeDristi's institutional and academic partners, and how to become a partner.",
};

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
          Become a Partner <ArrowRight className="h-4 w-4" />
        </Button>
      </PageHero>

      <section id="institutional" className="py-16 sm:py-20">
        <Container className="flex flex-col gap-10">
          <SectionHeading eyebrow="Institutional Partners" title="Who we work with" />
          <div className="flex flex-wrap items-center gap-x-12 gap-y-6 card p-8">
            {partners.map((p) => (
              <span key={p.name} className="text-base font-semibold text-text-secondary">
                {p.name}
              </span>
            ))}
          </div>
        </Container>
      </section>

      <section id="become-a-partner" className="bg-background-secondary py-16 sm:py-20">
        <Container className="flex flex-col gap-10">
          <SectionHeading eyebrow="Become a Partner" eyebrowTone="green" title="What partnership looks like" />
          <div className="grid gap-6 sm:grid-cols-3">
            {partnerBenefits.map((b) => (
              <div key={b.title} className="card p-6">
                <h3 className="font-semibold text-text-primary">{b.title}</h3>
                <p className="mt-1.5 text-sm leading-relaxed text-text-muted">
                  {b.description}
                </p>
              </div>
            ))}
          </div>
          <div className="flex flex-col items-center gap-4 card p-10 text-center">
            <h3 className="text-xl font-semibold text-text-primary">
              Ready to explore a partnership?
            </h3>
            <p className="max-w-lg text-sm leading-relaxed text-text-muted">
              Send us your organisation details and goals — we&apos;ll follow up with a
              proposal and a meeting invitation.
            </p>
            <Button href="/contact" size="lg">
              Start the Conversation <ArrowRight className="h-4 w-4" />
            </Button>
          </div>
        </Container>
      </section>
    </>
  );
}
