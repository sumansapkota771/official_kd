import { listContent } from "@/lib/content/store";
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

type SectionConfig = {
  type: string;
  label: string;
  enabled: boolean;
};

const DEFAULT_SECTIONS: SectionConfig[] = [
  { type: "hero", label: "Hero", enabled: true },
  { type: "trust", label: "Trust strip", enabled: true },
  { type: "flagship", label: "Flagship program", enabled: true },
  { type: "solutions", label: "Solutions overview", enabled: true },
  { type: "courses", label: "Courses overview", enabled: true },
  { type: "tech", label: "Tech delivery", enabled: true },
  { type: "team", label: "Team overview", enabled: true },
  { type: "cta", label: "Final CTA", enabled: true },
  { type: "testimonials", label: "Testimonials", enabled: true },
];

export async function SectionRenderer() {
  let sections = DEFAULT_SECTIONS;

  try {
    const items = await listContent<SectionConfig>("home-section");
    if (items.length > 0) {
      sections = items.map((item) => item.data);
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
