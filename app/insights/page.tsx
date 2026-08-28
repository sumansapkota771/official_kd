import type { Metadata } from "next";
import { buildPageMetadata } from "@/lib/content/seo";
import { PageHero } from "@/components/ui/page-hero";
import {
  ShowcaseCard,
  showcaseGridInner,
  showcaseGridOuter,
  showcaseTone,
} from "@/components/ui/showcase-card";
import { RevealGroup, RevealItem } from "@/components/motion/reveal";
import { getArticles, getPageHero } from "@/lib/content/resolvers";
import { ArticleJsonLd, OrganizationJsonLd } from "@/components/seo/json-ld";

export const revalidate = 3600;

/**
 * Title, description, canonical and social tags come from this page's
 * `page-seo` row when one has been filled in, and from the literals below
 * when it has not - so the admin can rewrite them without a deploy, and a
 * row nobody has touched changes nothing.
 */
export async function generateMetadata(): Promise<Metadata> {
  return buildPageMetadata("insights", {
    title: "News & Insights",
    description:
      "Articles on AI software development in Nepal, custom software, cloud migration and more from the KodeDristi engineering team.",
    path: "/insights",
  });
}

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
          <RevealGroup className={showcaseGridInner}>
            {articles.map((article, i) => (
              <RevealItem key={article.slug} className="flex">
                <ShowcaseCard
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
              </RevealItem>
            ))}
          </RevealGroup>
        </div>
      </section>
    </>
  );
}
