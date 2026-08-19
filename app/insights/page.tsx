import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, Calendar, Clock } from "lucide-react";
import { PageHero } from "@/components/ui/page-hero";
import { Container } from "@/components/ui/container";
import { Badge } from "@/components/ui/badge";
import { getArticles, getPageHero } from "@/lib/content/resolvers";
import { ArticleJsonLd, OrganizationJsonLd } from "@/components/seo/json-ld";

export const revalidate = 3600;

export const metadata: Metadata = {
  title: "News & Insights",
  description:
    "Articles on AI software development in Nepal, custom software, cloud migration and more from the KodeDristi engineering team.",
};

export default async function InsightsPage() {
  const articles = await getArticles();
  const hero = (await getPageHero("insights")) ?? {
    eyebrow: "Knowledge",
    title: "News & Insights",
    description: "Notes from our engineering and delivery teams — practical, not promotional.",
  };

  return (
    <>
      <OrganizationJsonLd />
      {articles.map((article) => (
        <ArticleJsonLd
          key={article.slug}
          title={article.title}
          description={article.excerpt}
          author="KodeDristi Team"
          datePublished={article.date}
          url={`https://official-kd.vercel.app/insights/${article.slug}`}
        />
      ))}
      <PageHero eyebrow={hero.eyebrow} title={hero.title} description={hero.description} />

      <section className="section">
        <Container className="grid gap-4 lg:grid-cols-2">
          {articles.map((article) => (
            <Link
              key={article.slug}
              href={`/insights/${article.slug}`}
              className="focus-ring group flex flex-col gap-2.5 card card-hover p-6"
            >
              <Badge>{article.category}</Badge>
              <h2 className="text-lg font-semibold text-text-primary">{article.title}</h2>
              <p className="text-sm leading-relaxed text-text-muted">{article.excerpt}</p>
              <div className="mt-1 flex items-center gap-3 text-xs font-medium text-text-muted">
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
              <span className="mt-1 flex items-center gap-1.5 text-sm font-semibold text-brand-blue opacity-0 transition-opacity group-hover:opacity-100">
                Read article <ArrowRight className="h-4 w-4" />
              </span>
            </Link>
          ))}
        </Container>
      </section>
    </>
  );
}
