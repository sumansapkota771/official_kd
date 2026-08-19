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
  bgMode: "surface" | "image";
  sectionKey: string;
  imageUrl?: string;
  mobileImageUrl?: string;
};

const DEFAULT_SECTIONS: SectionConfig[] = [
  { type: "hero", label: "Hero", enabled: true, bgMode: "image", sectionKey: "hero", imageUrl: "", mobileImageUrl: "" },
  { type: "trust", label: "Trust strip", enabled: true, bgMode: "surface", sectionKey: "home-trust", imageUrl: "", mobileImageUrl: "" },
  { type: "flagship", label: "Flagship program", enabled: true, bgMode: "image", sectionKey: "home-flagship", imageUrl: "", mobileImageUrl: "" },
  { type: "solutions", label: "Solutions overview", enabled: true, bgMode: "surface", sectionKey: "solutions-overview", imageUrl: "", mobileImageUrl: "" },
  { type: "courses", label: "Courses overview", enabled: true, bgMode: "image", sectionKey: "courses-overview", imageUrl: "", mobileImageUrl: "" },
  { type: "tech", label: "Tech delivery", enabled: true, bgMode: "surface", sectionKey: "tech-delivery", imageUrl: "", mobileImageUrl: "" },
  { type: "team", label: "Team overview", enabled: true, bgMode: "image", sectionKey: "team-overview", imageUrl: "", mobileImageUrl: "" },
  { type: "cta", label: "Final CTA", enabled: true, bgMode: "surface", sectionKey: "home-final-cta", imageUrl: "", mobileImageUrl: "" },
  { type: "testimonials", label: "Testimonials", enabled: true, bgMode: "image", sectionKey: "testimonials", imageUrl: "", mobileImageUrl: "" },
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
  const bgClass = (mode: string) => mode === "image" ? "cinematic-image" : "cinematic-surface";

  return (
    <>
      {sections
        .filter((s) => s.enabled)
        .map((section) => {
          switch (section.type) {
            case "hero":
              return <Hero key="hero" content={hero} imageUrl={section.imageUrl} mobileImageUrl={section.mobileImageUrl} />;
            case "trust":
              return <TrustStrip key="trust" className={bgClass(section.bgMode)} imageUrl={section.imageUrl} mobileImageUrl={section.mobileImageUrl} />;
            case "flagship":
              return <FlagshipProgram key="flagship" className={bgClass(section.bgMode)} imageUrl={section.imageUrl} mobileImageUrl={section.mobileImageUrl} />;
            case "solutions":
              return <SolutionsOverview key="solutions" className={bgClass(section.bgMode)} imageUrl={section.imageUrl} mobileImageUrl={section.mobileImageUrl} />;
            case "courses":
              return <CoursesOverview key="courses" className={bgClass(section.bgMode)} imageUrl={section.imageUrl} mobileImageUrl={section.mobileImageUrl} />;
            case "tech":
              return <TechDelivery key="tech" className={bgClass(section.bgMode)} imageUrl={section.imageUrl} mobileImageUrl={section.mobileImageUrl} />;
            case "team":
              return <TeamOverview key="team" className={bgClass(section.bgMode)} imageUrl={section.imageUrl} mobileImageUrl={section.mobileImageUrl} />;
            case "cta":
              return <FinalCta key="cta" className={bgClass(section.bgMode)} imageUrl={section.imageUrl} mobileImageUrl={section.mobileImageUrl} />;
            case "testimonials":
              return <Testimonials key="testimonials" className={bgClass(section.bgMode)} imageUrl={section.imageUrl} mobileImageUrl={section.mobileImageUrl} />;
            default:
              return null;
          }
        })}
    </>
  );
}
