import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, Calendar, Clock } from "lucide-react";
import { PageHero } from "@/components/ui/page-hero";
import { Container } from "@/components/ui/container";
import { articles } from "@/lib/data/content";

export const metadata: Metadata = {
  title: "News & Insights",
  description:
    "Articles on AI software development in Nepal, custom software, cloud migration and more from the KodeDristi engineering team.",
};

export default function InsightsPage() {
  return (
    <>
      <PageHero
        eyebrow="Knowledge"
        title="News &amp; Insights"
        description="Notes from our engineering and delivery teams — practical, not promotional."
      />

      <section className="py-16 sm:py-20">
        <Container className="grid gap-6 lg:grid-cols-2">
          {articles.map((article) => (
            <Link
              key={article.slug}
              href={`/insights/${article.slug}`}
              className="focus-ring group flex flex-col gap-3 card card-hover p-7"
            >
              <span className="w-fit rounded-full bg-badge-blue-bg px-2.5 py-1 text-[11px] font-semibold text-badge-blue-text">
                {article.category}
              </span>
              <h2 className="text-xl font-semibold text-text-primary">{article.title}</h2>
              <p className="text-sm leading-relaxed text-text-muted">{article.excerpt}</p>
              <div className="mt-2 flex items-center gap-4 text-xs font-medium text-text-muted">
                <span className="flex items-center gap-1.5">
                  <Calendar className="h-3.5 w-3.5" />
                  {new Date(article.date).toLocaleDateString("en-US", {
                    month: "long",
                    day: "numeric",
                    year: "numeric",
                  })}
                </span>
                <span className="flex items-center gap-1.5">
                  <Clock className="h-3.5 w-3.5" /> {article.readTime}
                </span>
              </div>
              <span className="mt-1 flex items-center gap-1.5 text-sm font-semibold text-brand-blue opacity-0 transition-opacity group-hover:opacity-100">
                Read article <ArrowRight className="h-3.5 w-3.5" />
              </span>
            </Link>
          ))}
        </Container>
      </section>
    </>
  );
}
