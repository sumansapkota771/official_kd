import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, Clock, Signal } from "lucide-react";
import { PageHero } from "@/components/ui/page-hero";
import { Container } from "@/components/ui/container";
import { SectionHeading } from "@/components/ui/section-heading";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { FaqAccordion } from "@/components/ui/faq-accordion";
import { getCourses } from "@/lib/content/resolvers";
import { getFaqs } from "@/lib/content/resolvers";
import { getPageHero } from "@/lib/content/resolvers";
import { getProcessSteps } from "@/lib/content/resolvers";
import { CourseJsonLd, FAQJsonLd } from "@/components/seo/json-ld";

export const revalidate = 3600;

export const metadata: Metadata = {
  title: "Learn — IT Courses",
  description:
    "Live, cohort-based IT courses from KodeDristi — AI & ML, full-stack web development, cloud & DevOps, mobile, data analytics and UI/UX.",
};

export default async function LearnPage() {
  const [courses, processSteps, faqs, hero] = await Promise.all([
    getCourses(),
    getProcessSteps(),
    getFaqs("learn"),
    getPageHero("learn"),
  ]);

  return (
    <>
      {courses.map((course) => (
        <CourseJsonLd
          key={course.slug}
          name={course.name}
          description={course.summary}
          url={`https://official-kd.vercel.app/learn/${course.slug}`}
          level={course.level}
        />
      ))}
      {faqs.length > 0 && (
        <FAQJsonLd
          items={faqs.map((f) => ({ question: f.q, answer: f.a }))}
        />
      )}
      <PageHero
        eyebrow={hero?.eyebrow ?? "Learn"}
        eyebrowTone="green"
        title={hero?.title ?? "IT courses built from real delivery work"}
        description={
          hero?.description ??
          "Six live, cohort-based programs taught by the same engineers who ship KodeDristi's client projects."
        }
      >
        <Button href="#courses" size="lg" variant="secondary">
          Browse courses <ArrowRight className="h-6 w-6" />
        </Button>
      </PageHero>

      <section id="courses" className="section">
        <Container className="flex flex-col gap-8">
          <SectionHeading eyebrow="Catalogue" eyebrowTone="green" title="Choose your track" />
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {courses.map((course) => (
              <Link
                key={course.slug}
                href={`/learn/${course.slug}`}
                className="focus-ring group flex flex-col gap-2.5 card card-hover p-6"
              >
                <Badge tone="green">{course.level}</Badge>
                <h3 className="text-lg font-semibold text-text-primary">{course.name}</h3>
                <p className="text-sm leading-relaxed text-text-muted">{course.summary}</p>
                <div className="mt-1 flex flex-wrap items-center gap-3 text-xs font-medium text-text-muted">
                  <span className="flex items-center gap-1.5">
                    <Clock className="h-4 w-4" /> {course.duration}
                  </span>
                  <span className="flex items-center gap-1.5">
                    <Signal className="h-4 w-4" /> {course.fee}
                  </span>
                </div>
                <span className="mt-1 flex items-center gap-1.5 text-sm font-semibold text-brand-green-hover opacity-0 transition-opacity group-hover:opacity-100">
                  View details <ArrowRight className="h-4 w-4" />
                </span>
              </Link>
            ))}
          </div>
        </Container>
      </section>

      <section className="section bg-background-secondary">
        <Container className="flex flex-col gap-8">
          <SectionHeading title="How enrollment works" />
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {processSteps.map((step, i) => (
              <div key={step.title} className="tile p-5">
                <span className="flex h-7 w-7 items-center justify-center rounded-[var(--radius-sm)] bg-brand-blue text-xs font-bold text-white">
                  {i + 1}
                </span>
                <h3 className="mt-3 font-semibold text-text-primary">{step.title}</h3>
                <p className="mt-1 text-sm leading-relaxed text-text-muted">
                  {step.description}
                </p>
              </div>
            ))}
          </div>
        </Container>
      </section>

      <section className="section">
        <Container className="grid gap-10 lg:grid-cols-2">
          <div className="flex flex-col gap-5">
            <SectionHeading eyebrow="FAQ" title="Common questions" />
            <FaqAccordion items={faqs} />
          </div>

          <div className="flex flex-col justify-between gap-5 rounded-card border border-border bg-background-secondary p-7">
            <div>
              <h3 className="text-xl font-semibold text-text-primary">Still deciding?</h3>
              <p className="mt-2 text-sm leading-relaxed text-text-muted">
                Ask us anything about a course, cohort dates, or corporate training — we
                usually reply within one business day.
              </p>
            </div>
            <div className="flex flex-wrap gap-2.5">
              <Button href="/contact" size="lg">
                Ask a Question <ArrowRight className="h-5 w-5" />
              </Button>
              <Button href="/contact" variant="outline" size="lg">
                Reserve Seat
              </Button>
            </div>
          </div>
        </Container>
      </section>
    </>
  );
}
