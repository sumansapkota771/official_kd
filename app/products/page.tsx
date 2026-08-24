import type { Metadata } from "next";
import { CheckCircle2 } from "lucide-react";
import { PageHero } from "@/components/ui/page-hero";
import { Container } from "@/components/ui/container";
import {
  ShowcaseCard,
  showcaseGridInner,
  showcaseGridOuter,
  showcaseTone,
} from "@/components/ui/showcase-card";
import { SectionHeading } from "@/components/ui/section-heading";
import { FaqAccordion } from "@/components/ui/faq-accordion";
import { ProductTalkForm } from "@/components/contact/product-talk-form";
import { getFaqs } from "@/lib/content/resolvers";
import { getPageHero } from "@/lib/content/resolvers";
import { getPartners } from "@/lib/content/resolvers";
import { getProducts } from "@/lib/content/resolvers";
import { getTestimonials } from "@/lib/content/resolvers";

export const revalidate = 3600;

export const metadata: Metadata = {
  title: "Products",
  description:
    "Okil.ai, Billing Software, Accounting Software and LMS — in-house products built and maintained by KodeDristi.",
};

export default async function ProductsPage() {
  const [products, partners, testimonials, faqs, hero] = await Promise.all([
    getProducts(),
    getPartners(),
    getTestimonials(),
    getFaqs("products"),
    getPageHero("products"),
  ]);

  return (
    <>
      <PageHero
        eyebrow={hero?.eyebrow ?? "Products"}
        title={hero?.title ?? "Products"}
        description={
          hero?.description ??
          "In-house software KodeDristi builds, ships and maintains — proof of the same engineering standard we bring to client work."
        }
      />

      <section className="section">
        <div className={showcaseGridOuter}>
          <div className={showcaseGridInner}>
            {products.map((product, i) => (
              <ShowcaseCard
                key={product.slug}
                tone={showcaseTone(i)}
                title={product.name}
                description={product.tagline}
                href={`/products/${product.slug}`}
                actionLabel="View product"
                secondary={{ label: "Talk to us", href: "/contact" }}
                image={product.image}
              />
            ))}
          </div>
        </div>
      </section>

      <section className="section-tight border-y border-border bg-background-secondary">
        <Container className="flex flex-col items-center gap-6">
          <p className="text-xs font-semibold uppercase tracking-widest text-text-muted">Trusted by teams and institutions</p>
          <div className="flex flex-wrap items-center justify-center gap-x-10 gap-y-3">
            {partners.map((p) => (
              <span key={p.name} className="text-sm font-semibold text-text-secondary/60">
                {p.name}
              </span>
            ))}
          </div>
        </Container>
      </section>

      <section className="section">
        <Container className="grid gap-10 lg:grid-cols-2">
          <div className="flex flex-col gap-5">
            <SectionHeading eyebrow="FAQ" title="Product questions" />
            <FaqAccordion items={faqs} />
          </div>

          <div className="flex flex-col gap-5">
            <SectionHeading eyebrow="Reviews" eyebrowTone="green" title="What users say" />
            <div className="flex flex-col gap-3">
              {testimonials.slice(0, 2).map((t) => (
                <figure key={t.name} className="card p-4">
                  <blockquote className="text-sm leading-relaxed text-text-secondary">
                    &ldquo;{t.quote}&rdquo;
                  </blockquote>
                  <figcaption className="mt-2.5 text-xs font-semibold text-text-muted">
                    {t.name} · {t.role}
                  </figcaption>
                </figure>
              ))}
            </div>
          </div>
        </Container>
      </section>

      <section className="section border-t border-border bg-background-secondary">
        <Container className="grid gap-10 lg:grid-cols-2">
          <div className="flex flex-col gap-5">
            <SectionHeading
              eyebrow="Product talk"
              eyebrowTone="green"
              title="See it working, ask anything"
              description="Book a 30-minute call with our product team. We'll walk you through the software, answer pricing and licensing questions, and scope custom builds based on it."
            />
            <ul className="flex flex-col gap-2">
              {["Live guided demo", "Pricing & licensing", "White-label / partnership", "Custom build like this"].map(
                (item) => (
                  <li key={item} className="flex items-center gap-2 text-sm text-text-secondary">
                    <CheckCircle2 className="h-5 w-5 shrink-0 text-brand-green-hover" />
                    {item}
                  </li>
                )
              )}
            </ul>
          </div>
          <ProductTalkForm />
        </Container>
      </section>
    </>
  );
}
