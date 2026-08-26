import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Image from "next/image";
import { ArrowRight } from "lucide-react";
import { PageHero } from "@/components/ui/page-hero";
import { Container } from "@/components/ui/container";
import { Button } from "@/components/ui/button";
import { ProjectCard } from "@/components/ui/project-card";
import { getProject, getProjects } from "@/lib/content/resolvers";

export const revalidate = 3600;

export async function generateStaticParams() {
  const projects = await getProjects();
  return projects.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const project = await getProject(slug);
  if (!project) return {};
  return { title: project.name, description: project.tagline };
}

export default async function ProjectCaseStudyPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const project = await getProject(slug);
  if (!project) notFound();

  const meta = [project.client, project.industry, project.year].filter(Boolean);
  const all = await getProjects();
  const others = all.filter((p) => p.slug !== project.slug).slice(0, 3);

  /**
   * The six chapters, in fixed order, every time.
   *
   * Declared as data rather than written out as markup so the order cannot
   * drift between one study and the next — that consistency is the whole
   * reason the type exists. Empty chapters drop out instead of printing a
   * heading over nothing, so a study written halfway still reads as finished
   * rather than as a form someone abandoned.
   */
  const chapters: { title: string; body?: string; items?: string[] }[] = [
    { title: "Business problem", body: project.businessProblem },
    { title: "Product strategy", body: project.productStrategy },
    { title: "Design and development", body: project.designDevelopment },
    { title: "Key features", items: project.keyFeatures },
    { title: "Technology stack", items: project.techStack },
    { title: "Business result", body: project.businessResult },
  ].filter((c) => (c.body && c.body.trim()) || (c.items && c.items.length > 0));

  return (
    <>
      <PageHero eyebrow={meta.join("  ·  ") || "Case study"} title={project.name} description={project.tagline}>
        {project.url?.trim() && (
          <Button href={project.url} variant="outline" size="lg">
            Visit the live site <ArrowRight className="h-5 w-5" />
          </Button>
        )}
      </PageHero>

      {project.image && (
        <section className="border-b border-border bg-surface">
          <Container className="py-10">
            <div className="relative aspect-[16/9] w-full overflow-hidden">
              <Image
                src={project.image}
                alt={`${project.name} interface`}
                fill
                sizes="(min-width: 1024px) 80vw, 100vw"
                className="object-cover object-center"
                priority
              />
            </div>
          </Container>
        </section>
      )}

      <section className="section">
        <Container className="flex flex-col gap-16">
          {chapters.map((chapter, i) => (
            <article key={chapter.title} className="grid gap-4 lg:grid-cols-[minmax(0,22rem)_1fr] lg:gap-14">
              {/* The chapter number is information here, not decoration: these
                  studies are read side by side, and the fixed order is what
                  makes that comparison possible. */}
              <div className="flex items-baseline gap-4">
                <span className="text-sm font-semibold tabular-nums text-brand-green-hover">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <h2 className="text-[22px] font-semibold leading-tight tracking-[-0.02em] text-text-primary sm:text-[26px]">
                  {chapter.title}
                </h2>
              </div>

              <div className="min-w-0">
                {chapter.body && (
                  <p className="prose-measure text-[17px] leading-[1.65] text-text-secondary">
                    {chapter.body}
                  </p>
                )}

                {chapter.items && chapter.items.length > 0 && (
                  <ul className="flex flex-wrap gap-2">
                    {chapter.items.map((item) => (
                      <li
                        key={item}
                        className="rounded-[var(--radius-sm)] border border-border bg-surface px-3 py-1.5 text-sm font-medium text-text-secondary"
                      >
                        {item}
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </article>
          ))}
        </Container>
      </section>

      {others.length > 0 && (
        <section className="section bg-background-secondary">
          <Container className="flex flex-col gap-10">
            <div className="flex flex-wrap items-end justify-between gap-4">
              <h2 className="display-md font-semibold text-text-primary">More work</h2>
              <Button href="/projects" variant="pill-outline">
                View all projects
              </Button>
            </div>
            <ul className="grid gap-3 sm:grid-cols-2 sm:gap-4 lg:grid-cols-3">
              {others.map((other) => (
                <li key={other.slug} className="flex">
                  <ProjectCard project={other} />
                </li>
              ))}
            </ul>
          </Container>
        </section>
      )}

      <section className="section">
        <Container>
          <div className="on-brand relative overflow-hidden rounded-card border border-brand-blue bg-brand-blue px-8 py-20 text-center text-white sm:px-16">
            <div className="absolute left-0 top-0 h-full w-1 bg-brand-green" aria-hidden="true" />
            <h2 className="display-md max-w-xl font-semibold">Have a problem like this one?</h2>
            <p className="mt-3 max-w-lg text-white/70">
              Tell us what you are trying to solve. We will reply within one
              business day with next steps.
            </p>
            <Button href="/contact" size="lg" className="mt-6 bg-white text-link hover:bg-white/90">
              Start a project <ArrowRight className="h-5 w-5" />
            </Button>
          </div>
        </Container>
      </section>
    </>
  );
}
