import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, CheckCircle2 } from "lucide-react";
import { PageHero } from "@/components/ui/page-hero";
import { Container } from "@/components/ui/container";
import { SectionHeading } from "@/components/ui/section-heading";
import { FaqAccordion } from "@/components/ui/faq-accordion";
import { ProductTalkForm } from "@/components/contact/product-talk-form";
import { cn } from "@/lib/utils";
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
        <Container className="grid gap-4 sm:grid-cols-2">
          {products.map((product) => {
            const Icon = product.icon;
            const isBlue = product.accent === "blue";
            return (
              <Link
                key={product.slug}
                href={`/products/${product.slug}`}
                className="focus-ring group flex flex-col gap-3 card card-hover p-6"
              >
                <Icon
                  className={cn(
                    "h-7 w-7",
                    isBlue ? "text-brand-blue" : "text-brand-green-hover"
                  )}
                />
                <div>
                  <h2 className="text-lg font-semibold text-text-primary">{product.name}</h2>
                  <p className="mt-1.5 text-sm leading-relaxed text-text-muted">
                    {product.tagline}
                  </p>
                </div>
                <span className="mt-auto flex items-center gap-1.5 text-sm font-semibold text-brand-blue opacity-0 transition-opacity group-hover:opacity-100">
                  View product <ArrowRight className="h-4 w-4" />
                </span>
              </Link>
            );
          })}
        </Container>
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
