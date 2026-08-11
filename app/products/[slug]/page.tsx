import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowRight, CheckCircle2, MessageSquare, Users } from "lucide-react";
import { PageHero } from "@/components/ui/page-hero";
import { Container } from "@/components/ui/container";
import { Button } from "@/components/ui/button";
import { getProduct, getProducts } from "@/lib/content/resolvers";

export const dynamic = "force-dynamic";

export async function generateStaticParams() {
  const products = await getProducts();
  return products.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const product = await getProduct(slug);
  if (!product) return {};
  return { title: product.name, description: product.tagline };
}

export default async function ProductDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const product = await getProduct(slug);
  if (!product) notFound();

  const Icon = product.icon;
  const isBlue = product.accent === "blue";
  const all = await getProducts();
  const other = all.filter((p) => p.slug !== product.slug).slice(0, 3);

  return (
    <>
      <PageHero eyebrow="Products" eyebrowTone={product.accent} title={product.name} description={product.tagline}>
        <Button href="/contact" size="lg">
          Talk to Us About {product.name} <ArrowRight className="h-4 w-4" />
        </Button>
      </PageHero>

      <section className="py-16 sm:py-20">
        <Container className="grid gap-12 lg:grid-cols-[1fr_320px]">
          <div className="flex flex-col gap-10">
            <div className="flex items-center gap-3">
              <Icon
                className={
                  isBlue
                    ? "h-5.5 w-5.5 text-brand-blue"
                    : "h-5.5 w-5.5 text-brand-green-hover"
                }
              />
              <p className="text-base leading-relaxed text-text-secondary">
                {product.description}
              </p>
            </div>

            <div>
              <h2 className="text-lg font-semibold text-text-primary">Key features</h2>
              <ul className="mt-4 grid gap-3 sm:grid-cols-2">
                {product.features.map((f) => (
                  <li
                    key={f}
                    className="flex items-start gap-2 tile p-4 text-sm text-text-secondary"
                  >
                    <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-brand-green-hover" />
                    {f}
                  </li>
                ))}
              </ul>
            </div>

            <div className="flex items-start gap-3 panel p-6">
              <Users className="mt-0.5 h-5 w-5 shrink-0 text-brand-blue" />
              <div>
                <p className="font-semibold text-text-primary">Built for</p>
                <p className="mt-1 text-sm leading-relaxed text-text-muted">{product.audience}</p>
              </div>
            </div>
          </div>

          <aside className="flex flex-col gap-6">
            <div className="flex flex-col gap-4 card p-6">
              <MessageSquare className="h-6 w-6 text-brand-blue" />
              <p className="font-semibold text-text-primary">Discuss a similar product</p>
              <p className="text-sm leading-relaxed text-text-muted">
                Want something like {product.name} for your own business or a fully custom
                build? Tell us about it.
              </p>
              <Button href="/contact" className="w-full">
                Start a Conversation <ArrowRight className="h-4 w-4" />
              </Button>
            </div>

            <div className="panel p-6">
              <p className="text-sm font-semibold text-text-primary">Other products</p>
              <ul className="mt-3 flex flex-col gap-2">
                {other.map((p) => (
                  <li key={p.slug}>
                    <Link
                      href={`/products/${p.slug}`}
                      className="focus-ring flex items-center justify-between rounded-lg px-2 py-2 text-sm text-text-secondary hover:bg-surface hover:text-brand-blue"
                    >
                      {p.name}
                      <ArrowRight className="h-3.5 w-3.5" />
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </aside>
        </Container>
      </section>
    </>
  );
}
