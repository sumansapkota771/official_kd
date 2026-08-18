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
          Become a Partner <ArrowRight className="h-6 w-6" />
        </Button>
      </PageHero>

      <section id="institutional" className="section">
        <Container className="flex flex-col gap-8">
          <SectionHeading eyebrow="Institutional Partners" title="Who we work with" />
          <div className="flex flex-wrap items-center gap-x-10 gap-y-4 rounded-card border border-border bg-surface p-6">
            {partners.map((p) => (
              <span key={p.name} className="text-sm font-semibold text-text-secondary">
                {p.name}
              </span>
            ))}
          </div>
        </Container>
      </section>

      <section id="become-a-partner" className="section bg-background-secondary">
        <Container className="flex flex-col gap-8">
          <SectionHeading eyebrow="Become a Partner" eyebrowTone="green" title="What partnership looks like" />
          <div className="grid gap-4 sm:grid-cols-3">
            {partnerBenefits.map((b) => (
              <div key={b.title} className="card p-5">
                <h3 className="font-semibold text-text-primary">{b.title}</h3>
                <p className="mt-1 text-sm leading-relaxed text-text-muted">
                  {b.description}
                </p>
              </div>
            ))}
          </div>
          <div className="flex flex-col items-center gap-3 rounded-card border border-border bg-surface p-8 text-center">
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
