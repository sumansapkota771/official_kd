import { listAllSlugs, listContent } from "@/lib/content/store";
import { Hero } from "@/components/home/hero";
import { TrustStrip } from "@/components/home/trust-strip";
import { FlagshipProgram } from "@/components/home/flagship-program";
import { HackathonPartners } from "@/components/home/hackathon-partners";
import { DristiLagani } from "@/components/home/dristi-lagani";
import { SolutionsOverview } from "@/components/home/solutions-overview";
import { CoursesOverview } from "@/components/home/courses-overview";
import { TechDelivery } from "@/components/home/tech-delivery";
import { TeamOverview } from "@/components/home/team-overview";
import { FinalCta } from "@/components/home/final-cta";
import { Testimonials } from "@/components/home/testimonials";
import { getHomeHeroData } from "@/lib/content/resolvers";

type SectionConfig = {
  type: string;
  label: string;
  enabled: boolean;
};

const DEFAULT_SECTIONS: SectionConfig[] = [
  { type: "hero", label: "Hero", enabled: true },
  { type: "trust", label: "Trust strip", enabled: true },
  { type: "flagship", label: "Flagship program", enabled: true },
  { type: "hackathon-partners", label: "Hackathon partners", enabled: true },
  { type: "lagani", label: "Dristi Lagani", enabled: true },
  { type: "solutions", label: "Solutions overview", enabled: true },
  { type: "courses", label: "Courses overview", enabled: true },
  { type: "tech", label: "Tech delivery", enabled: true },
  { type: "team", label: "Team overview", enabled: true },
  { type: "cta", label: "Final CTA", enabled: true },
  { type: "testimonials", label: "Testimonials", enabled: true },
];

/**
 * Folds in any section the stored order has never heard of.
 *
 * `home-section` rows are seeded once — only while the table holds none of
 * them — so a site that has been running since before a section existed has
 * no row for it, and that section would silently never render again. Rather
 * than depend on someone remembering to press Seed in the admin, anything in
 * DEFAULT_SECTIONS the database does not know about is spliced back in
 * beside the section it ships next to, leaving a hand-ordered homepage
 * otherwise untouched.
 *
 * `everSeen` carries the soft-deleted rows too, and it is what keeps this
 * from being destructive: a section the admin deleted must stay deleted, and
 * without the tombstones it is indistinguishable from one that never
 * existed — so every render would resurrect it.
 */
function withMissingDefaults(
  stored: SectionConfig[],
  everSeen: Set<string>
): SectionConfig[] {
  const merged = [...stored];
  const known = new Set(stored.map((s) => s.type));

  DEFAULT_SECTIONS.forEach((section, i) => {
    if (known.has(section.type) || everSeen.has(section.type)) return;
    // Anchor to the nearest earlier section that *is* present, so the new
    // one lands next to its neighbour wherever the admin moved it to.
    const previous = DEFAULT_SECTIONS.slice(0, i)
      .reverse()
      .find((s) => known.has(s.type));
    const at = previous
      ? merged.findIndex((s) => s.type === previous.type) + 1
      : 0;
    merged.splice(at, 0, section);
    known.add(section.type);
  });

  return merged;
}

export async function SectionRenderer() {
  let sections = DEFAULT_SECTIONS;

  try {
    const [items, everSeen] = await Promise.all([
      listContent<SectionConfig>("home-section"),
      listAllSlugs("home-section"),
    ]);
    if (items.length > 0) {
      const stored = items.map((item) => item.data);
      // No tombstones available means no safe way to tell a deleted section
      // from a new one, so the stored order stands as-is.
      sections = everSeen ? withMissingDefaults(stored, everSeen) : stored;
    }
  } catch {
    // DB down — use defaults
  }

  const hero = await getHomeHeroData();

  return (
    <>
      {sections
        .filter((s) => s.enabled)
        .map((section) => {
          switch (section.type) {
            case "hero":
              return <Hero key="hero" content={hero} />;
            case "trust":
              return <TrustStrip key="trust" />;
            case "flagship":
              return <FlagshipProgram key="flagship" />;
            case "hackathon-partners":
              return <HackathonPartners key="hackathon-partners" />;
            case "lagani":
              return <DristiLagani key="lagani" />;
            case "solutions":
              return <SolutionsOverview key="solutions" />;
            case "courses":
              return <CoursesOverview key="courses" />;
            case "tech":
              return <TechDelivery key="tech" />;
            case "team":
              return <TeamOverview key="team" />;
            case "cta":
              return <FinalCta key="cta" />;
            case "testimonials":
              return <Testimonials key="testimonials" />;
            default:
              return null;
          }
        })}
    </>
  );
}
