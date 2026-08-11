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

export default async function Home() {
  const hero = await getHomeHeroData();

  return (
    <>
      <Hero content={hero} />
      <TrustStrip />
      <FlagshipProgram />
      <SolutionsOverview />
      <CoursesOverview />
      <TechDelivery />
      <TeamOverview />
      <FinalCta />
      <Testimonials />
    </>
  );
}
