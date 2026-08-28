import { Container } from "@/components/ui/container";
import { SectionHeading } from "@/components/ui/section-heading";
import { Button } from "@/components/ui/button";
import { Reveal } from "@/components/motion/reveal";
import { LogoWall } from "@/components/ui/logo-wall";
import { getHackathonPartners, getSectionHeading } from "@/lib/content/resolvers";
import { cn } from "@/lib/utils";

/**
 * "Trusted By Leading Organizations" — the logo wall that follows the
 * hackathon banner.
 *
 * The layout lives in `LogoWall`, which the /partners page uses too, so both
 * walls normalise their marks the same way: one card size, one padding, each
 * logo fitted rather than filled. This component's job is only the heading,
 * the button and the data.
 *
 * It used to lay the marks out as four hand-chunked rows of bare images at
 * their natural widths, which meant a wide wordmark rendered several times
 * the area of a square badge and the last row ended wherever it ran out.
 * Equal cards remove both problems at once.
 *
 * Renders nothing when the list is empty. A wall with no organisations on it
 * is worse than no wall.
 */
export async function HackathonPartners({ className }: { className?: string }) {
  const [partners, heading] = await Promise.all([
    getHackathonPartners(),
    getSectionHeading("hackathon-partners"),
  ]);

  if (partners.length === 0) return null;

  return (
    <section className={cn("section", className)}>
      <Container className="flex flex-col gap-12 sm:gap-14">
        <Reveal className="flex flex-col items-start justify-between gap-6 sm:flex-row sm:items-end">
          <SectionHeading
            eyebrow={heading?.eyebrow ?? "Partners"}
            eyebrowTone={heading?.eyebrowTone ?? "green"}
            title={heading?.title ?? "Trusted By Leading Organizations"}
            description={
              heading?.description ??
              "Institutions, sponsors and community partners we build, teach and run programmes with."
            }
          />
          <Button href="/contact" variant="pill-outline" size="lg" className="shrink-0">
            Become a partner
          </Button>
        </Reveal>

        <LogoWall
          items={partners.map((p) => ({
            name: p.name,
            logo: p.logo,
            url: p.url,
          }))}
        />
      </Container>
    </section>
  );
}
