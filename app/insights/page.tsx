import type { Metadata } from "next";
import { PageHero } from "@/components/ui/page-hero";
import {
  ShowcaseCard,
  showcaseGridInner,
  showcaseGridOuter,
  showcaseTone,
} from "@/components/ui/showcase-card";
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
        <div className={showcaseGridOuter}>
          <div className={showcaseGridInner}>
            {articles.map((article, i) => (
              <ShowcaseCard
                key={article.slug}
                tone={showcaseTone(i)}
                eyebrow={article.category}
                title={article.title}
                description={article.excerpt}
                href={`/insights/${article.slug}`}
                actionLabel="Read article"
                image={article.image}
                meta={
                  <>
                    <span>
                      {new Date(article.date).toLocaleDateString("en-US", {
                        month: "long",
                        day: "numeric",
                        year: "numeric",
                      })}
                    </span>
                    <span>{article.readTime}</span>
                  </>
                }
              />
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
