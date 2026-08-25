import type { LucideIcon } from "lucide-react";
import {
  listContent,
  getContentBySlug,
  getSingletonData,
} from "@/lib/content/store";
import { iconForKey } from "@/lib/content/icons";
import type {
  SolutionData,
  CourseData,
  ProductData,
  ArticleData,
  TestimonialData,
  PartnerData,
  TeamMemberData,
  StatData,
  TechData,
  DeliveryStepData,
  ValueData,
  CapabilityData,
  PerkData,
  RoleData,
  PartnerBenefitData,
  ProcessStepData,
  FaqData,
  ContactDetailData,
  HackathonHighlightData,
  HackathonTrackData,
  HackathonTimelineData,
  HackathonPartnerData,
  NavData,
  PageHeroData,
  SectionHeadingData,
  HomeHeroData,
  HomeTrustData,
  HomeFlagshipData,
  HomeFinalCtaData,
} from "@/lib/content/schemas";

export type SolutionView = Omit<SolutionData, "icon"> & { slug: string; icon: LucideIcon };
export type ProductView = Omit<ProductData, "icon"> & { slug: string; icon: LucideIcon };
export type ContactDetailView = Omit<ContactDetailData, "icon"> & { icon: LucideIcon };
export type HackathonHighlightView = Omit<HackathonHighlightData, "icon"> & { icon: LucideIcon };
export type NavGroup = { label: string; href: string; items: { label: string; href: string; description?: string }[] };

// ---- Solutions ----
export async function getSolutions(): Promise<SolutionView[]> {
  const items = await listContent<SolutionData>("solution");
  return items.map((i) => ({ ...i.data, slug: i.slug ?? "", icon: iconForKey(i.data.icon) }));
}
export async function getSolution(slug: string): Promise<SolutionView | null> {
  const item = await getContentBySlug<SolutionData>("solution", slug);
  if (!item) return null;
  return { ...item.data, slug: item.slug ?? "", icon: iconForKey(item.data.icon) };
}

// ---- Courses ----
export async function getCourses(): Promise<(CourseData & { slug: string })[]> {
  const items = await listContent<CourseData>("course");
  return items.map((i) => ({ ...i.data, slug: i.slug ?? "" }));
}
export async function getCourse(slug: string): Promise<(CourseData & { slug: string }) | null> {
  const item = await getContentBySlug<CourseData>("course", slug);
  if (!item) return null;
  return { ...item.data, slug: item.slug ?? "" };
}

// ---- Products ----
export async function getProducts(): Promise<ProductView[]> {
  const items = await listContent<ProductData>("product");
  return items.map((i) => ({ ...i.data, slug: i.slug ?? "", icon: iconForKey(i.data.icon) }));
}
export async function getProduct(slug: string): Promise<ProductView | null> {
  const item = await getContentBySlug<ProductData>("product", slug);
  if (!item) return null;
  return { ...item.data, slug: item.slug ?? "", icon: iconForKey(item.data.icon) };
}

// ---- Articles ----
export async function getArticles(): Promise<(ArticleData & { slug: string })[]> {
  const items = await listContent<ArticleData>("article");
  return items.map((i) => ({ ...i.data, slug: i.slug ?? "" }));
}
export async function getArticle(slug: string): Promise<(ArticleData & { slug: string }) | null> {
  const item = await getContentBySlug<ArticleData>("article", slug);
  if (!item) return null;
  return { ...item.data, slug: item.slug ?? "" };
}

// ---- Simple collections ----
export async function getTestimonials(): Promise<(TestimonialData & { slug: string })[]> {
  const items = await listContent<TestimonialData>("testimonial");
  return items.map((i) => ({ ...i.data, slug: i.slug ?? "" }));
}
export async function getPartners(): Promise<(PartnerData & { slug: string })[]> {
  const items = await listContent<PartnerData>("partner");
  return items.map((i) => ({ ...i.data, slug: i.slug ?? "" }));
}
export async function getTeamMembers(): Promise<(TeamMemberData & { slug: string })[]> {
  const items = await listContent<TeamMemberData>("team-member");
  return items.map((i) => ({ ...i.data, slug: i.slug ?? "" }));
}
export async function getLeadership(): Promise<(TeamMemberData & { slug: string })[]> {
  const members = await getTeamMembers();
  return members.filter((m) => m.leadership !== false);
}
export async function getStats(): Promise<(StatData & { slug: string })[]> {
  const items = await listContent<StatData>("stat");
  return items.map((i) => ({ ...i.data, slug: i.slug ?? "" }));
}
export async function getTechStack(): Promise<(TechData & { slug: string })[]> {
  const items = await listContent<TechData>("tech");
  return items.map((i) => ({ ...i.data, slug: i.slug ?? "" }));
}
export async function getDeliveryApproach(): Promise<(DeliveryStepData & { slug: string })[]> {
  const items = await listContent<DeliveryStepData>("delivery-step");
  return items.map((i) => ({ ...i.data, slug: i.slug ?? "" }));
}
export async function getValues(): Promise<(ValueData & { slug: string })[]> {
  const items = await listContent<ValueData>("value");
  return items.map((i) => ({ ...i.data, slug: i.slug ?? "" }));
}
export async function getCapabilities(): Promise<(CapabilityData & { slug: string })[]> {
  const items = await listContent<CapabilityData>("capability");
  return items.map((i) => ({ ...i.data, slug: i.slug ?? "" }));
}
export async function getPerks(): Promise<(PerkData & { slug: string })[]> {
  const items = await listContent<PerkData>("perk");
  return items.map((i) => ({ ...i.data, slug: i.slug ?? "" }));
}
export async function getRoles(): Promise<(RoleData & { slug: string })[]> {
  const items = await listContent<RoleData>("role");
  return items.map((i) => ({ ...i.data, slug: i.slug ?? "" }));
}
export async function getPartnerBenefits(): Promise<(PartnerBenefitData & { slug: string })[]> {
  const items = await listContent<PartnerBenefitData>("partner-benefit");
  return items.map((i) => ({ ...i.data, slug: i.slug ?? "" }));
}
export async function getProcessSteps(): Promise<(ProcessStepData & { slug: string })[]> {
  const items = await listContent<ProcessStepData>("process-step");
  return items.map((i) => ({ ...i.data, slug: i.slug ?? "" }));
}
export async function getFaqs(group?: "learn" | "products"): Promise<(FaqData & { slug: string })[]> {
  const items = await listContent<FaqData>("faq");
  return items
    .filter((i) => !group || i.data.group === group)
    .map((i) => ({ ...i.data, slug: i.slug ?? "" }));
}
export async function getContactDetails(): Promise<ContactDetailView[]> {
  const items = await listContent<ContactDetailData>("contact-detail");
  return items.map((i) => ({ ...i.data, icon: iconForKey(i.data.icon) }));
}
export async function getHackathonHighlights(): Promise<HackathonHighlightView[]> {
  const items = await listContent<HackathonHighlightData>("hackathon-highlight");
  return items.map((i) => ({ ...i.data, icon: iconForKey(i.data.icon) }));
}
export async function getHackathonTracks(): Promise<(HackathonTrackData & { slug: string })[]> {
  const items = await listContent<HackathonTrackData>("hackathon-track");
  return items.map((i) => ({ ...i.data, slug: i.slug ?? "" }));
}
export async function getHackathonTimeline(): Promise<(HackathonTimelineData & { slug: string })[]> {
  const items = await listContent<HackathonTimelineData>("hackathon-timeline");
  return items.map((i) => ({ ...i.data, slug: i.slug ?? "" }));
}
export async function getHackathonPartners(): Promise<(HackathonPartnerData & { slug: string })[]> {
  const items = await listContent<HackathonPartnerData>("hackathon-partner");
  return items.map((i) => ({ ...i.data, slug: i.slug ?? "" }));
}

// ---- Singletons ----
export async function getNav(): Promise<NavData> {
  const data = await getSingletonData<NavData>("nav");
  return data ?? { groups: [] };
}

export async function getPageHero(page: string): Promise<PageHeroData | null> {
  return getContentBySlug<PageHeroData>("page-hero", page).then((item) => item?.data ?? null);
}

export async function getSectionHeading(
  section: string
): Promise<SectionHeadingData | null> {
  return getContentBySlug<SectionHeadingData>("section-heading", section).then(
    (item) => item?.data ?? null
  );
}

export async function getHomeHeroData(): Promise<HomeHeroData> {
  const data = await getSingletonData<HomeHeroData>("home-hero");
  return (
    data ?? {
      eyebrow: "#WithYouEveryStep",
      title: "One platform for software, AI and the people who build them.",
      paragraph:
        "KodeDristi designs and ships web, mobile, SaaS and AI products for growing businesses — and trains the next generation of engineers to build them. 10+ projects delivered, 4+ institutional partners.",
      primaryLabel: "Start a Project",
      primaryHref: "/contact",
      secondaryLabel: "Explore Programs",
      secondaryHref: "/learn",
      tertiaryLabel: "Register for the National AI Hackathon",
      tertiaryHref: "/hackathon",
    }
  );
}

export async function getHomeTrustData(): Promise<HomeTrustData> {
  const data = await getSingletonData<HomeTrustData>("home-trust");
  return (
    data ?? {
      label: "Trusted by growing businesses and academic partners across Nepal",
    }
  );
}

export async function getHomeFlagshipData(): Promise<HomeFlagshipData> {
  const data = await getSingletonData<HomeFlagshipData>("home-flagship");
  return (
    data ?? {
      badge: "Flagship Program",
      title: "National AI Hackathon 2026",
      description:
        "KodeDristi's flagship national competition for student and professional builders — 48 hours, real mentors, real prizes, and a direct line to our hiring and partner network.",
      point1: "Open to teams of 2–4",
      point2: "Registrations open now",
      ctaLabel: "Register for Hackathon",
      ctaHref: "/hackathon",
    }
  );
}

export async function getHomeFinalCtaData(): Promise<HomeFinalCtaData> {
  const data = await getSingletonData<HomeFinalCtaData>("home-final-cta");
  return (
    data ?? {
      title: "Let's architect your digital future.",
      description:
        "Tell us what you're trying to solve. We'll respond within one business day with next steps — no obligation.",
      primaryLabel: "Start a Project",
      primaryHref: "/contact",
      secondaryLabel: "Explore Programs",
      secondaryHref: "/learn",
    }
  );
}

export type ContentOptions = { slug: string; name: string }[];
