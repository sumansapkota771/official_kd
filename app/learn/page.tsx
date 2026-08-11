import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, Clock, Signal } from "lucide-react";
import { PageHero } from "@/components/ui/page-hero";
import { Container } from "@/components/ui/container";
import { SectionHeading } from "@/components/ui/section-heading";
import { Button } from "@/components/ui/button";
import { FaqAccordion } from "@/components/ui/faq-accordion";
import { getCourses } from "@/lib/content/resolvers";
import { getFaqs } from "@/lib/content/resolvers";
import { getPageHero } from "@/lib/content/resolvers";
import { getProcessSteps } from "@/lib/content/resolvers";

export const dynamic = "force-dynamic";

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
          Browse courses <ArrowRight className="h-4 w-4" />
        </Button>
      </PageHero>

      <section id="courses" className="py-16 sm:py-20">
        <Container className="flex flex-col gap-10">
          <SectionHeading eyebrow="Catalogue" eyebrowTone="green" title="Choose your track" />
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {courses.map((course) => (
              <Link
                key={course.slug}
                href={`/learn/${course.slug}`}
                className="focus-ring group flex flex-col gap-3 card card-hover p-6"
              >
                <span className="w-fit rounded-full bg-badge-green-bg px-2.5 py-1 text-[11px] font-semibold text-badge-green-text">
                  {course.level}
                </span>
                <h3 className="text-lg font-semibold text-text-primary">{course.name}</h3>
                <p className="text-sm leading-relaxed text-text-muted">{course.summary}</p>
                <div className="mt-1 flex flex-wrap items-center gap-4 text-xs font-medium text-text-muted">
                  <span className="flex items-center gap-1.5">
                    <Clock className="h-3.5 w-3.5" /> {course.duration}
                  </span>
                  <span className="flex items-center gap-1.5">
                    <Signal className="h-3.5 w-3.5" /> {course.fee}
                  </span>
                </div>
                <span className="mt-2 flex items-center gap-1.5 text-sm font-semibold text-brand-green-hover opacity-0 transition-opacity group-hover:opacity-100">
                  View details <ArrowRight className="h-3.5 w-3.5" />
                </span>
              </Link>
            ))}
          </div>
        </Container>
      </section>

      <section className="bg-background-secondary py-16 sm:py-20">
        <Container className="flex flex-col gap-10">
          <SectionHeading title="How enrollment works" />
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {processSteps.map((step, i) => (
              <div key={step.title} className="card p-6">
                <span className="flex h-8 w-8 items-center justify-center rounded-full bg-brand-blue-light text-sm font-bold text-brand-blue">
                  {i + 1}
                </span>
                <h3 className="mt-4 font-semibold text-text-primary">{step.title}</h3>
                <p className="mt-1.5 text-sm leading-relaxed text-text-muted">
                  {step.description}
                </p>
              </div>
            ))}
          </div>
        </Container>
      </section>

      <section className="py-16 sm:py-20">
        <Container className="grid gap-12 lg:grid-cols-2">
          <div className="flex flex-col gap-6">
            <SectionHeading eyebrow="FAQ" title="Common questions" />
            <FaqAccordion items={faqs} />
          </div>

          <div className="flex flex-col justify-between gap-6 rounded-3xl border border-border bg-background-secondary p-8">
            <div>
              <h3 className="text-xl font-semibold text-text-primary">Still deciding?</h3>
              <p className="mt-2 text-sm leading-relaxed text-text-muted">
                Ask us anything about a course, cohort dates, or corporate training — we
                usually reply within one business day.
              </p>
            </div>
            <div className="flex flex-wrap gap-3">
              <Button href="/contact" size="lg">
                Ask a Question <ArrowRight className="h-4 w-4" />
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
