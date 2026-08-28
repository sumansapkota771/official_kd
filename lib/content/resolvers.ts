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
  ProjectData,
  MouPartnershipData,
  GalleryData,
  GalleryPhotoData,
  LaganiHighlightData,
  LaganiFocusData,
  LaganiProcessData,
  LaganiPortfolioData,
  NavData,
  PageHeroData,
  SectionHeadingData,
  HomeHeroData,
  HomeHeroSlideData,
  HomeTrustData,
  HomeFlagshipData,
  HomeLaganiData,
  HomeFinalCtaData,
  SiteSettingsData,
  PageSeoData,
} from "@/lib/content/schemas";

export type SolutionView = Omit<SolutionData, "icon"> & { slug: string; icon: LucideIcon };
export type ProductView = Omit<ProductData, "icon"> & { slug: string; icon: LucideIcon };
export type ContactDetailView = Omit<ContactDetailData, "icon"> & { icon: LucideIcon };
export type HackathonHighlightView = Omit<HackathonHighlightData, "icon"> & { icon: LucideIcon };
export type LaganiHighlightView = Omit<LaganiHighlightData, "icon"> & { icon: LucideIcon };
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

// ---- Projects ----
export async function getProjects(): Promise<(ProjectData & { slug: string })[]> {
  const items = await listContent<ProjectData>("project");
  return items.map((i) => ({ ...i.data, slug: i.slug ?? "" }));
}
export async function getProject(slug: string): Promise<(ProjectData & { slug: string }) | null> {
  const item = await getContentBySlug<ProjectData>("project", slug);
  if (!item) return null;
  return { ...item.data, slug: item.slug ?? "" };
}

// ---- Galleries ----
export type GalleryView = GalleryData & { slug: string };
export type GalleryPhotoView = GalleryPhotoData & { slug: string };

export async function getGalleries(): Promise<GalleryView[]> {
  const items = await listContent<GalleryData>("gallery");
  return items.map((i) => ({ ...i.data, slug: i.slug ?? "" }));
}

export async function getGallery(slug: string): Promise<GalleryView | null> {
  const item = await getContentBySlug<GalleryData>("gallery", slug);
  if (!item) return null;
  return { ...item.data, slug: item.slug ?? "" };
}

/**
 * Photos for one gallery, in admin order.
 *
 * Filtering happens here rather than in SQL because `gallery` lives inside
 * the row's JSON blob, and `listContent` is the one place that already
 * applies the published/soft-deleted rules — reaching around it with a raw
 * query would mean re-implementing those and eventually diverging from them.
 */
export async function getGalleryPhotos(gallerySlug: string): Promise<GalleryPhotoView[]> {
  const items = await listContent<GalleryPhotoData>("gallery-photo");
  return items
    .filter((i) => i.data.gallery === gallerySlug)
    .map((i) => ({ ...i.data, slug: i.slug ?? "" }));
}

/** How many photos each gallery holds, keyed by gallery slug — one pass, so
 *  a homepage showing N galleries does not run N queries. */
export async function getGalleryPhotoCounts(): Promise<Record<string, number>> {
  const items = await listContent<GalleryPhotoData>("gallery-photo");
  const counts: Record<string, number> = {};
  for (const item of items) {
    const key = item.data.gallery;
    if (key) counts[key] = (counts[key] ?? 0) + 1;
  }
  return counts;
}

// ---- Industry academia ----
export async function getMouPartnerships(): Promise<(MouPartnershipData & { slug: string })[]> {
  const items = await listContent<MouPartnershipData>("mou-partnership");
  return items.map((i) => ({ ...i.data, slug: i.slug ?? "" }));
}

// ---- Dristi Lagani ----
export async function getLaganiHighlights(): Promise<LaganiHighlightView[]> {
  const items = await listContent<LaganiHighlightData>("lagani-highlight");
  return items.map((i) => ({ ...i.data, icon: iconForKey(i.data.icon) }));
}
export async function getLaganiFocus(): Promise<(LaganiFocusData & { slug: string })[]> {
  const items = await listContent<LaganiFocusData>("lagani-focus");
  return items.map((i) => ({ ...i.data, slug: i.slug ?? "" }));
}
export async function getLaganiProcess(): Promise<(LaganiProcessData & { slug: string })[]> {
  const items = await listContent<LaganiProcessData>("lagani-process");
  return items.map((i) => ({ ...i.data, slug: i.slug ?? "" }));
}
export async function getLaganiPortfolio(): Promise<(LaganiPortfolioData & { slug: string })[]> {
  const items = await listContent<LaganiPortfolioData>("lagani-portfolio");
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

export async function getHomeHeroSlides(): Promise<(HomeHeroSlideData & { slug: string })[]> {
  const items = await listContent<HomeHeroSlideData>("home-hero-slide");
  return items.map((i) => ({ ...i.data, slug: i.slug ?? "" }));
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

export async function getHomeLaganiData(): Promise<HomeLaganiData> {
  const data = await getSingletonData<HomeLaganiData>("home-lagani");
  return (
    data ?? {
      badge: "Investment Program",
      title: "Dristi Lagani",
      description:
        "KodeDristi backs early-stage Nepali software companies with capital and an engineering team — so the funding buys runway and the build at the same time.",
      point1: "Pre-seed and seed",
      point2: "Open year-round",
      ctaLabel: "Pitch to Dristi Lagani",
      ctaHref: "/dristi-lagani",
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

/**
 * The company facts shared by the footer, the contact page and the
 * structured data.
 *
 * Falls back to the shipped defaults rather than to nulls: a footer with no
 * phone number is worse than a footer with last week's phone number, and
 * every caller would otherwise need its own placeholder.
 */
export const SITE_SETTINGS_DEFAULTS: SiteSettingsData = {
  companyName: "KodeDristi Software Pvt. Ltd.",
  tagline: "One platform for software delivery, applied AI and technical learning.",
  phone: "9851362001",
  phoneHref: "tel:+9779851362001",
  email: "hello@kodedristi.com",
  address: "Kathmandu, Nepal",
  officeHours: "10:00 AM – 6:00 PM",
  officeDays: "",
  footerNote: "#WithYouEveryStep",
};

export async function getSiteSettings(): Promise<SiteSettingsData> {
  const data = await getSingletonData<Partial<SiteSettingsData>>("site-settings");
  if (!data) return SITE_SETTINGS_DEFAULTS;
  // Merged field by field, so a row saved before a field existed — or one an
  // admin blanked — still yields a usable value instead of an empty footer.
  const merged = { ...SITE_SETTINGS_DEFAULTS };
  for (const [key, value] of Object.entries(data)) {
    if (typeof value === "string" && value.trim()) {
      (merged as Record<string, string>)[key] = value;
    }
  }
  return merged;
}

export async function getPageSeo(page: string): Promise<PageSeoData | null> {
  const item = await getContentBySlug<PageSeoData>("page-seo", page);
  return item?.data ?? null;
}

export type ContentOptions = { slug: string; name: string }[];
