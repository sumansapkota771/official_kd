import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import {
  ArrowRight,
  BookOpen,
  Calendar,
  CheckCircle2,
  Clock,
  Layers,
  ListChecks,
  Signal,
  User,
} from "lucide-react";
import { PageHero } from "@/components/ui/page-hero";
import { Container } from "@/components/ui/container";
import { Button } from "@/components/ui/button";
import { getCourse, getCourses } from "@/lib/content/resolvers";

export const revalidate = 3600;

export async function generateStaticParams() {
  const courses = await getCourses();
  return courses.map((c) => ({ slug: c.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const course = await getCourse(slug);
  if (!course) return {};
  return { title: course.name, description: course.summary };
}

const FIELD_ICONS = {
  Level: Signal,
  Duration: Clock,
  Format: Layers,
  Prerequisites: BookOpen,
  Fee: ListChecks,
  "Next Start Date": Calendar,
  Instructor: User,
} as const;

export default async function CourseDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const course = await getCourse(slug);
  if (!course) notFound();

  const fields: [keyof typeof FIELD_ICONS, string][] = [
    ["Level", course.level],
    ["Duration", course.duration],
    ["Format", course.format],
    ["Prerequisites", course.prerequisites],
    ["Fee", course.fee],
    ["Next Start Date", course.nextStartDate],
    ["Instructor", course.instructor],
  ];

  const all = await getCourses();
  const other = all.filter((c) => c.slug !== course.slug).slice(0, 3);

  return (
    <>
      <PageHero eyebrow="Learn" eyebrowTone="green" title={course.name} description={course.summary}>
        <div className="flex flex-wrap items-center gap-3">
          <Button href="/contact" size="lg" variant="secondary">
            Apply <ArrowRight className="h-4 w-4" />
          </Button>
          <Button href="/contact" variant="outline" size="lg">
            Reserve Seat
          </Button>
        </div>
      </PageHero>

      <section className="py-20 sm:py-24">
        <Container className="grid gap-12 lg:grid-cols-[1fr_320px]">
          <div className="flex flex-col gap-10">
            <div>
              <h2 className="text-lg font-semibold text-text-primary">Curriculum</h2>
              <ul className="mt-4 grid gap-3 sm:grid-cols-2">
                {course.curriculum.map((item, i) => (
                  <li
                    key={item}
                    className="flex items-start gap-3 tile p-4 text-sm text-text-secondary"
                  >
                    <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-brand-green-light text-xs font-bold text-brand-green-hover">
                      {i + 1}
                    </span>
                    {item}
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h2 className="text-lg font-semibold text-text-primary">Outcomes</h2>
              <ul className="mt-4 flex flex-col gap-2.5">
                {course.outcomes.map((item) => (
                  <li key={item} className="flex items-start gap-2 text-sm text-text-secondary">
                    <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-brand-green-hover" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <aside className="flex flex-col gap-6">
            <div className="flex flex-col gap-4 card p-6">
              {fields.map(([label, value]) => {
                const Icon = FIELD_ICONS[label];
                return (
                  <div key={label} className="flex items-start gap-3">
                    <Icon className="h-4.5 w-4.5 shrink-0 text-link" />
                    <div>
                      <p className="text-xs font-medium text-text-muted">{label}</p>
                      <p className="text-sm font-semibold text-text-primary">{value}</p>
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="panel p-6">
              <p className="text-sm font-semibold text-text-primary">Other courses</p>
              <ul className="mt-3 flex flex-col gap-2">
                {other.map((c) => (
                  <li key={c.slug}>
                    <Link
                      href={`/learn/${c.slug}`}
                      className="focus-ring flex items-center justify-between rounded-lg px-2 py-2 text-sm text-text-secondary hover:bg-surface hover:text-link"
                    >
                      {c.name}
                      <ArrowRight className="h-3.5 w-3.5" />
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </aside>
        </Container>
      </section>
    </>
  );
}
