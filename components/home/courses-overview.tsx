import { ArrowRight01Icon, Time02Icon, Wifi01Icon } from "hugeicons-react";
import { Container } from "@/components/ui/container";
import { SectionHeading } from "@/components/ui/section-heading";
import { Button } from "@/components/ui/button";
import { SpotlightCard, CardCue } from "@/components/ui/spotlight-card";
import { Badge } from "@/components/ui/badge";
import { Reveal, RevealGroup, RevealItem } from "@/components/motion/reveal";
import { getCourses, getSectionHeading } from "@/lib/content/resolvers";
import { cn } from "@/lib/utils";

export async function CoursesOverview({ className }: { className?: string }) {
  const [courses, heading] = await Promise.all([
    getCourses(),
    getSectionHeading("courses-overview"),
  ]);

  return (
    <section data-section-key="courses-overview" className={cn("section", className)}>
      <Container className="flex flex-col gap-14">
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
          <Button href="/learn" variant="outline" className="shrink-0">
            View all courses
            <ArrowRight01Icon className="h-6 w-6 transition-transform duration-micro ease-out-quint group-hover/btn:translate-x-0.5" />
          </Button>
        </Reveal>

        <RevealGroup className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3" stagger={0.05}>
          {courses.map((course) => (
            <RevealItem key={course.slug} className="flex">
              <SpotlightCard
                href={`/learn/${course.slug}`}
                className="flex w-full flex-col gap-3"
              >
                <Badge tone="green">{course.level}</Badge>
                <h3 className="text-lg font-semibold text-text-primary">{course.name}</h3>
                <p className="text-sm leading-relaxed text-text-muted">{course.summary}</p>
                <div className="mt-1 flex items-center gap-4 text-xs font-medium text-text-muted">
                  <span className="flex items-center gap-1.5">
                    <Time02Icon className="h-4 w-4" /> {course.duration}
                  </span>
                  <span className="flex items-center gap-1.5">
                    <Wifi01Icon className="h-4 w-4" /> {course.fee}
                  </span>
                </div>
                <CardCue label="View details" tone="green" />
              </SpotlightCard>
            </RevealItem>
          ))}
        </RevealGroup>
      </Container>
    </section>
  );
}
