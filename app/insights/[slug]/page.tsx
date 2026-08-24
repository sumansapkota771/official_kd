import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, ArrowRight, Calendar, Clock } from "lucide-react";
import { PageHero } from "@/components/ui/page-hero";
import { Container } from "@/components/ui/container";
import { Button } from "@/components/ui/button";
import { getArticle, getArticles } from "@/lib/content/resolvers";

export const revalidate = 3600;

export async function generateStaticParams() {
  const articles = await getArticles();
  return articles.map((a) => ({ slug: a.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const article = await getArticle(slug);
  if (!article) return {};
  return { title: article.title, description: article.excerpt };
}

export default async function ArticleDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const article = await getArticle(slug);
  if (!article) notFound();

  const all = await getArticles();
  const other = all.filter((a) => a.slug !== article.slug).slice(0, 2);

  return (
    <>
      <PageHero eyebrow={article.category} title={article.title}>
        <div className="flex items-center gap-4 text-sm font-medium text-text-muted">
          <span className="flex items-center gap-1.5">
            <Calendar className="h-4 w-4" />
            {new Date(article.date).toLocaleDateString("en-US", {
              month: "long",
              day: "numeric",
              year: "numeric",
            })}
          </span>
          <span className="flex items-center gap-1.5">
            <Clock className="h-4 w-4" /> {article.readTime}
          </span>
        </div>
      </PageHero>

      <section className="py-20 sm:py-24">
        <Container className="grid gap-12 lg:grid-cols-[1fr_280px]">
          <article className="flex flex-col gap-5">
            <Link
              href="/insights"
              className="focus-ring flex w-fit items-center gap-1.5 text-sm font-semibold text-link"
            >
              <ArrowLeft className="h-3.5 w-3.5" /> Back to Insights
            </Link>
            {article.body.map((paragraph, i) => (
              <p key={i} className="text-base leading-relaxed text-text-secondary">
                {paragraph}
              </p>
            ))}
          </article>

          <aside className="flex flex-col gap-6">
            <div className="panel p-6">
              <p className="text-sm font-semibold text-text-primary">Read next</p>
              <ul className="mt-3 flex flex-col gap-2">
                {other.map((a) => (
                  <li key={a.slug}>
                    <Link
                      href={`/insights/${a.slug}`}
                      className="focus-ring flex items-center justify-between gap-2 rounded-lg px-2 py-2 text-sm text-text-secondary hover:bg-surface hover:text-link"
                    >
                      <span className="line-clamp-2">{a.title}</span>
                      <ArrowRight className="h-3.5 w-3.5 shrink-0" />
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
            <div className="card p-6">
              <p className="font-semibold text-text-primary">Have a project in mind?</p>
              <p className="mt-1.5 text-sm leading-relaxed text-text-muted">
                Tell us what you&apos;re trying to solve.
              </p>
              <Button href="/contact" className="mt-4 w-full">
                Start a Project <ArrowRight className="h-4 w-4" />
              </Button>
            </div>
          </aside>
        </Container>
      </section>
    </>
  );
}
