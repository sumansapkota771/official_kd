import Image from "next/image";
import { Container } from "@/components/ui/container";
import { SectionHeading } from "@/components/ui/section-heading";
import { Badge } from "@/components/ui/badge";
import { Reveal, RevealGroup, RevealItem } from "@/components/motion/reveal";
import { getCourses, getSectionHeading } from "@/lib/content/resolvers";
import { cn } from "@/lib/utils";

/**
 * The course catalogue, laid out as a marketplace grid: thumbnail, title,
 * instructor, a row of qualifiers, then the fee.
 *
 * Deliberately inert. There are no links anywhere in this section — not on
 * the card, not on the thumbnail, not a "view all". A card that looks
 * clickable and is not is worse than one that plainly is not, so nothing
 * here carries a hover-lift, a chevron, or an action colour that would
 * promise a destination.
 *
 * Four across rather than the site's usual two-up showcase pair: this is a
 * catalogue to be compared at a glance, and the pattern it is modelled on
 * gets its legibility from small, uniform, densely-set cards.
 */
export async function CoursesOverview({ className }: { className?: string }) {
  const [courses, heading] = await Promise.all([
    getCourses(),
    getSectionHeading("courses-overview"),
  ]);

  if (courses.length === 0) return null;

  return (
    <section className={cn("section", className)}>
      <Container className="flex flex-col gap-10">
        <Reveal>
          <SectionHeading
            eyebrow={heading?.eyebrow ?? "Learn"}
            eyebrowTone={heading?.eyebrowTone ?? "green"}
            title={heading?.title ?? "Applied IT courses, taught by practitioners"}
            description={
              heading?.description ??
              "Live cohort-based programs — built from the same work our engineering team ships for clients."
            }
          />
        </Reveal>

        <RevealGroup
          as="ul"
          stagger={0.04}
          className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4"
        >
          {courses.map((course) => (
            <RevealItem key={course.slug} as="li" className="flex">
              <CourseCard course={course} />
            </RevealItem>
          ))}
        </RevealGroup>
      </Container>
    </section>
  );
}

type Course = Awaited<ReturnType<typeof getCourses>>[number];

function CourseCard({ course }: { course: Course }) {
  /* The qualifiers that sit where a marketplace would put its rating. Real
     fields only — a course with no cohort date shows one chip, not a
     placeholder. */
  const chips = [course.duration, course.format].filter(Boolean);

  return (
    <article className="card flex w-full flex-col overflow-hidden">
      {/* Thumbnail well, laid out whether or not artwork exists yet, so
          adding an image later never resizes the row. */}
      <div
        className={cn(
          "relative aspect-[16/9] w-full shrink-0 overflow-hidden",
          !course.image && "bg-text-primary/[0.04]"
        )}
      >
        {course.image ? (
          <Image
            src={course.image}
            alt=""
            fill
            sizes="(min-width: 1024px) 25vw, (min-width: 640px) 50vw, 100vw"
            className="object-cover object-center"
          />
        ) : (
          <span
            aria-hidden
            className="absolute inset-0 flex items-center justify-center text-text-primary/15"
          >
            <svg viewBox="0 0 24 24" className="h-9 w-9" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <rect x="3" y="4" width="18" height="16" rx="2.5" />
              <path d="m4 17 4.5-4.5a2 2 0 0 1 2.8 0L16 17" />
              <circle cx="8.5" cy="9.5" r="1.5" />
            </svg>
          </span>
        )}
      </div>

      <div className="flex flex-1 flex-col p-4 sm:p-5">
        <h3 className="text-[17px] font-bold leading-[1.25] tracking-[-0.02em] text-text-primary">
          {course.name}
        </h3>

        {course.instructor && (
          <p className="mt-1.5 text-[13px] text-text-muted">{course.instructor}</p>
        )}

        <div className="mt-3 flex flex-wrap items-center gap-2">
          {course.level && <Badge tone="green">{course.level}</Badge>}
          {chips.map((chip) => (
            <span
              key={chip}
              className="rounded-[var(--radius-sm)] border border-border px-2 py-1 text-[11px] font-medium text-text-muted"
            >
              {chip}
            </span>
          ))}
        </div>

        {/* Fee last and heaviest, the way a catalogue closes a card. No
            struck-through "was" price: this course has one fee, and printing
            an invented original next to it would be a fabricated discount. */}
        <div className="mt-auto flex flex-wrap items-baseline gap-x-2.5 gap-y-1 pt-4">
          {course.fee && (
            <span className="text-[19px] font-bold tracking-[-0.02em] text-text-primary">
              {course.fee}
            </span>
          )}
          {course.nextStartDate && (
            <span className="text-[13px] text-text-muted">
              starts {course.nextStartDate}
            </span>
          )}
        </div>
      </div>
    </article>
  );
}
