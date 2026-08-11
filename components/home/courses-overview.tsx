import Link from "next/link";
import { ArrowRight01Icon, Time02Icon, Wifi01Icon } from "hugeicons-react";
import { Container } from "@/components/ui/container";
import { SectionHeading } from "@/components/ui/section-heading";
import { Button } from "@/components/ui/button";
import { getCourses, getSectionHeading } from "@/lib/content/resolvers";

export async function CoursesOverview() {
  const [courses, heading] = await Promise.all([
    getCourses(),
    getSectionHeading("courses-overview"),
  ]);

  return (
    <section className="bg-background-secondary py-20 sm:py-24">
      <Container className="flex flex-col gap-12">
        <div className="flex flex-col items-start justify-between gap-6 sm:flex-row sm:items-end">
          <SectionHeading
            eyebrow={heading?.eyebrow ?? "Learn"}
            eyebrowTone={heading?.eyebrowTone ?? "green"}
            title={heading?.title ?? "Applied IT courses, taught by practitioners"}
            description={
              heading?.description ??
              "Six live cohort-based programs — built from the same work our engineering team ships for clients."
            }
          />
          <Button href="/learn" variant="outline" className="shrink-0">
            View all courses <ArrowRight01Icon className="h-4 w-4" />
          </Button>
        </div>

        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
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
              <div className="mt-1 flex items-center gap-4 text-xs font-medium text-text-muted">
                <span className="flex items-center gap-1.5">
                  <Time02Icon className="h-3.5 w-3.5" /> {course.duration}
                </span>
                <span className="flex items-center gap-1.5">
                  <Wifi01Icon className="h-3.5 w-3.5" /> {course.fee}
                </span>
              </div>
              <span className="mt-2 flex items-center gap-1.5 text-sm font-semibold text-brand-green-hover opacity-0 transition-opacity group-hover:opacity-100">
                View details <ArrowRight01Icon className="h-3.5 w-3.5" />
              </span>
            </Link>
          ))}
        </div>
      </Container>
    </section>
  );
}
