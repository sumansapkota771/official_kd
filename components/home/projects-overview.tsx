import { Container } from "@/components/ui/container";
import { SectionHeading } from "@/components/ui/section-heading";
import { Button } from "@/components/ui/button";
import { ProjectCard } from "@/components/ui/project-card";
import { Reveal, RevealGroup, RevealItem } from "@/components/motion/reveal";
import { getProjects, getSectionHeading } from "@/lib/content/resolvers";
import { cn } from "@/lib/utils";

/** How many make the homepage. The rest live on /projects. */
const HOME_COUNT = 6;

/**
 * The six projects that lead the homepage.
 *
 * Which six is a positional decision, not a flag on the record: the admin
 * already reorders this type by dragging, so the first six are the six.
 * Adding a `featured` checkbox would put the same decision in two places and
 * let them disagree.
 *
 * Hidden entirely until real projects exist — a work section with no work is
 * an advertisement for the gap.
 */
export async function ProjectsOverview({ className }: { className?: string }) {
  const [projects, heading] = await Promise.all([
    getProjects(),
    getSectionHeading("projects-overview"),
  ]);

  if (projects.length === 0) return null;
  const shown = projects.slice(0, HOME_COUNT);

  return (
    <section className={cn("section", className)}>
      <Container className="flex flex-col gap-12">
        <Reveal className="flex flex-col items-start justify-between gap-6 sm:flex-row sm:items-end">
          <SectionHeading
            eyebrow={heading?.eyebrow ?? "Work"}
            eyebrowTone={heading?.eyebrowTone}
            title={heading?.title ?? "Our remarkable projects"}
            description={
              heading?.description ??
              "Products we have designed, built and shipped — each told the same way, from the business problem to the result."
            }
          />
          {/* Only offered when there is actually more to see. */}
          {projects.length > HOME_COUNT && (
            <Button href="/projects" variant="pill-outline" size="lg" className="shrink-0">
              View all projects
            </Button>
          )}
        </Reveal>

        <RevealGroup
          as="ul"
          stagger={0.05}
          className="grid gap-3 sm:grid-cols-2 sm:gap-4 lg:grid-cols-3"
        >
          {shown.map((project) => (
            <RevealItem key={project.slug} as="li" className="flex">
              <ProjectCard project={project} />
            </RevealItem>
          ))}
        </RevealGroup>
      </Container>
    </section>
  );
}
