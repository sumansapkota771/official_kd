import { Time02Icon, Wifi01Icon } from "hugeicons-react";
import { Container } from "@/components/ui/container";
import { SectionHeading } from "@/components/ui/section-heading";
import { Button } from "@/components/ui/button";
import {
  ShowcaseCard,
  showcaseGridInner,
  showcaseGridOuter,
  showcaseTone,
} from "@/components/ui/showcase-card";
import { Reveal, RevealGroup, RevealItem } from "@/components/motion/reveal";
import { getCourses, getSectionHeading } from "@/lib/content/resolvers";
import { cn } from "@/lib/utils";

export async function CoursesOverview({ className }: { className?: string }) {
  const [courses, heading] = await Promise.all([
    getCourses(),
    getSectionHeading("courses-overview"),
  ]);

  return (
    <section className={cn("section", className)}>
      <Container>
        <Reveal className="flex flex-col items-start justify-between gap-6 sm:flex-row sm:items-end">
          <SectionHeading
            eyebrow={heading?.eyebrow ?? "Learn"}
            eyebrowTone={heading?.eyebrowTone ?? "green"}
            title={heading?.title ?? "Applied IT courses, taught by practitioners"}
            description={
              heading?.description ??
              "Six live cohort-based programs — built from the same work our engineering team ships for clients."
            }
          />
          <Button href="/learn" variant="pill-outline" size="lg" className="shrink-0">
            View all courses
          </Button>
        </Reveal>

      </Container>

      <div className={cn("mt-14", showcaseGridOuter, "pb-0")}>
        <RevealGroup className={showcaseGridInner} stagger={0.05}>
          {courses.map((course, i) => (
            <RevealItem key={course.slug} className="flex">
              <ShowcaseCard
                tone={showcaseTone(i)}
                eyebrow={course.level}
                title={course.name}
                description={course.summary}
                href={`/learn/${course.slug}`}
                actionLabel="View details"
                secondary={{ label: "Enroll", href: "/contact" }}
                image={course.image}
                imageAlt=""
                meta={
                  <>
                    <span className="flex items-center gap-1.5">
                      <Time02Icon className="h-4 w-4" /> {course.duration}
                    </span>
                    <span className="flex items-center gap-1.5">
                      <Wifi01Icon className="h-4 w-4" /> {course.fee}
                    </span>
                  </>
                }
              />
            </RevealItem>
          ))}
        </RevealGroup>
      </div>
    </section>
  );
}
