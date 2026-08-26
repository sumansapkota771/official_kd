import type { Metadata } from "next";
import { PageHero } from "@/components/ui/page-hero";
import { Container } from "@/components/ui/container";
import { Button } from "@/components/ui/button";
import { ProjectCard } from "@/components/ui/project-card";
import { getPageHero, getProjects } from "@/lib/content/resolvers";

export const revalidate = 3600;

export const metadata: Metadata = {
  title: "Projects",
  description:
    "Software KodeDristi has designed, built and shipped — each project told from the business problem through to the result.",
};

export default async function ProjectsPage() {
  const [projects, hero] = await Promise.all([getProjects(), getPageHero("projects")]);

  return (
    <>
      <PageHero
        eyebrow={hero?.eyebrow ?? "Work"}
        title={hero?.title ?? "Projects"}
        description={
          hero?.description ??
          "Everything we have shipped, with the reasoning behind it — the problem, the strategy, the build and what it changed for the business."
        }
      >
        <Button href="/contact" size="lg">
          Start a project
        </Button>
      </PageHero>

      <section className="section">
        <Container>
          {projects.length === 0 ? (
            <p className="max-w-prose text-text-muted">
              Case studies are being written up. In the meantime,{" "}
              <a href="/contact" className="font-semibold text-link hover:underline">
                ask us about work in your sector
              </a>{" "}
              and we will walk you through the closest one.
            </p>
          ) : (
            <ul className="grid gap-3 sm:grid-cols-2 sm:gap-4 lg:grid-cols-3">
              {projects.map((project) => (
                <li key={project.slug} className="flex">
                  <ProjectCard project={project} />
                </li>
              ))}
            </ul>
          )}
        </Container>
      </section>
    </>
  );
}
