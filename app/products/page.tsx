import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, CheckCircle2, Quote } from "lucide-react";
import { PageHero } from "@/components/ui/page-hero";
import { Container } from "@/components/ui/container";
import { SectionHeading } from "@/components/ui/section-heading";
import { FaqAccordion } from "@/components/ui/faq-accordion";
import { ProductTalkForm } from "@/components/contact/product-talk-form";
import { cn } from "@/lib/utils";
import { products } from "@/lib/data/products";
import { partners, testimonials } from "@/lib/data/content";

export const metadata: Metadata = {
  title: "Products",
  description:
    "Okil.ai, Billing Software, Accounting Software and LMS — in-house products built and maintained by KodeDristi.",
};

const FAQS = [
  { q: "Can these products be white-labelled?", a: "Yes — Billing Software, Accounting Software and LMS all support white-label deployment for partners." },
  { q: "Do you offer a trial?", a: "Every product has a guided demo; trial access is arranged during your first call." },
  { q: "Can you build something similar for us?", a: "Yes — reach out via the contact card on any product page to scope a custom build." },
];

export default function ProductsPage() {
  return (
    <>
      <PageHero
        eyebrow="Products"
        title="Products"
        description="In-house software KodeDristi builds, ships and maintains — proof of the same engineering standard we bring to client work."
      />

      <section className="py-16 sm:py-20">
        <Container className="grid gap-6 sm:grid-cols-2">
          {products.map((product) => {
            const Icon = product.icon;
            const isBlue = product.accent === "blue";
            return (
              <Link
                key={product.slug}
                href={`/products/${product.slug}`}
                className="focus-ring group flex flex-col gap-4 card card-hover p-7"
              >
                <Icon
                  className={cn(
                    "h-5.5 w-5.5",
                    isBlue ? "text-brand-blue" : "text-brand-green-hover"
                  )}
                />
                <div>
                  <h2 className="text-xl font-semibold text-text-primary">{product.name}</h2>
                  <p className="mt-2 text-sm leading-relaxed text-text-muted">
                    {product.tagline}
                  </p>
                </div>
                <span className="mt-auto flex items-center gap-1.5 text-sm font-semibold text-brand-blue opacity-0 transition-opacity group-hover:opacity-100">
                  View product <ArrowRight className="h-3.5 w-3.5" />
                </span>
              </Link>
            );
          })}
        </Container>
      </section>

      <section className="border-y border-border bg-background-secondary py-14">
        <Container className="flex flex-col items-center gap-8">
          <p className="text-sm font-semibold text-text-muted">Trusted by teams and institutions</p>
          <div className="flex flex-wrap items-center justify-center gap-x-10 gap-y-4">
            {partners.map((p) => (
              <span key={p.name} className="text-sm font-semibold text-text-secondary/70">
                {p.name}
              </span>
            ))}
          </div>
        </Container>
      </section>

      <section className="py-16 sm:py-20">
        <Container className="grid gap-12 lg:grid-cols-2">
          <div className="flex flex-col gap-6">
            <SectionHeading eyebrow="FAQ" title="Product questions" />
            <FaqAccordion items={FAQS} />
          </div>

          <div className="flex flex-col gap-6">
            <SectionHeading eyebrow="Reviews" eyebrowTone="green" title="What users say" />
            <div className="flex flex-col gap-4">
              {testimonials.slice(0, 2).map((t) => (
                <figure key={t.name} className="card p-5">
                  <Quote className="h-5 w-5 text-brand-green" />
                  <blockquote className="mt-2 text-sm leading-relaxed text-text-secondary">
                    &ldquo;{t.quote}&rdquo;
                  </blockquote>
                  <figcaption className="mt-3 text-xs font-semibold text-text-muted">
                    {t.name} · {t.role}
                  </figcaption>
                </figure>
              ))}
            </div>
          </div>
        </Container>
      </section>

      <section className="border-t border-border bg-background-secondary py-16 sm:py-20">
        <Container className="grid gap-12 lg:grid-cols-2">
          <div className="flex flex-col gap-6">
            <SectionHeading
              eyebrow="Product talk"
              eyebrowTone="green"
              title="See it working, ask anything"
              description="Book a 30-minute call with our product team. We'll walk you through the software, answer pricing and licensing questions, and scope custom builds based on it."
            />
            <ul className="flex flex-col gap-3">
              {["Live guided demo", "Pricing & licensing", "White-label / partnership", "Custom build like this"].map(
                (item) => (
                  <li key={item} className="flex items-center gap-2 text-sm text-text-secondary">
                    <CheckCircle2 className="h-4 w-4 shrink-0 text-brand-green-hover" />
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
