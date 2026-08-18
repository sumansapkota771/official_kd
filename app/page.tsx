import { Hero } from "@/components/home/hero";
import { TrustStrip } from "@/components/home/trust-strip";
import { FlagshipProgram } from "@/components/home/flagship-program";
import { SolutionsOverview } from "@/components/home/solutions-overview";
import { CoursesOverview } from "@/components/home/courses-overview";
import { TechDelivery } from "@/components/home/tech-delivery";
import { TeamOverview } from "@/components/home/team-overview";
import { FinalCta } from "@/components/home/final-cta";
import { Testimonials } from "@/components/home/testimonials";
import { getHomeHeroData } from "@/lib/content/resolvers";

export const dynamic = "force-dynamic";

/**
 * Homepage section layout.
 *
 * Background images are NOT set on the sections themselves. They come from the
 * CinematicBackground2 global layer, which reads from the CMS "visual-chapter"
 * content type. Each section with a background image has `data-section-key`
 * matching a visual-chapter's `sectionKey`.
 *
 * Alternation pattern:
 * - Hero → cinematic-image (background from cinematic layer, hero backdrop on top)
 * - TrustStrip → cinematic-surface (solid, masks hero image)
 * - FlagshipProgram → cinematic-image (transparent, content over flagship image)
 * - SolutionsOverview → cinematic-surface (solid, masks flagship image)
 * - CoursesOverview → cinematic-image (transparent, content over courses image)
 * - TechDelivery → cinematic-surface (solid, masks courses image)
 * - TeamOverview → cinematic-image (transparent, content over team image)
 * - FinalCta → cinematic-surface (solid, masks team image)
 * - Testimonials → cinematic-image (transparent, content over testimonials image)
 */
export default async function Home() {
  const hero = await getHomeHeroData();

  return (
    <>
      <Hero content={hero} />

      <TrustStrip className="cinematic-surface" />

      <FlagshipProgram className="cinematic-image" />

      <SolutionsOverview className="cinematic-surface" />

      <CoursesOverview className="cinematic-image" />

      <TechDelivery className="cinematic-surface" />

      <TeamOverview className="cinematic-image" />

      <FinalCta className="cinematic-surface" />

      <Testimonials className="cinematic-image" />
    </>
  );
}
