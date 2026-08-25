import { keyOfIcon } from "@/lib/content/icons";
import { solutions } from "@/lib/data/solutions";
import { courses } from "@/lib/data/courses";
import { products } from "@/lib/data/products";
import { navGroups } from "@/lib/data/nav";
import {
  testimonials,
  techStack,
  deliveryApproach,
  leadership,
  stats,
  articles,
  partners,
} from "@/lib/data/content";

export type ContentItem<TData = Record<string, unknown>> = {
  id: number;
  type: string;
  slug: string | null;
  data: TData;
  position: number;
  published: boolean;
  createdAt: Date;
  updatedAt: Date;
};

export type FieldKind =
  | "text"
  | "textarea"
  | "url"
  | "select"
  | "icon"
  | "tone"
  | "list"
  | "json"
  | "check"
  | "image";

export type ContentField = {
  key: string;
  label: string;
  kind: FieldKind;
  required?: boolean;
  options?: string[];
  placeholder?: string;
  helper?: string;
};

export type ContentSchema = {
  type: string;
  label: string;
  singular: string;
  isSingleton?: boolean;
  singletonSlug?: string;
  titleField: string;
  subtitleField?: string;
  iconField?: string;
  fields: ContentField[];
  fallback?: () => SeedRow[];
};

export type SeedRow = { slug: string; data: Record<string, unknown> };

// ---------------------------------------------------------------------------
// Data shapes stored inside content_items.data
// ---------------------------------------------------------------------------

export type SolutionData = {
  name: string;
  tagline: string;
  /** Showcase-card artwork. Empty until an image is uploaded; the card
      reserves the space either way so adding one shifts nothing. */
  image?: string;
  icon: string;
  accent: "blue" | "green";
  problem: string;
  approach: string;
  deliverables: string[];
  timeline: string;
  tags: string[];
  proof: string;
};

export type CourseData = {
  name: string;
  summary: string;
  /** Showcase-card artwork — see SolutionData.image. */
  image?: string;
  level: "Beginner" | "Intermediate" | "Advanced";
  duration: string;
  format: string;
  curriculum: string[];
  prerequisites: string;
  fee: string;
  nextStartDate: string;
  instructor: string;
  outcomes: string[];
};

export type ProductData = {
  name: string;
  tagline: string;
  /** Showcase-card artwork — see SolutionData.image. */
  image?: string;
  icon: string;
  accent: "blue" | "green";
  description: string;
  features: string[];
  audience: string;
};

export type ArticleData = {
  title: string;
  excerpt: string;
  /** Showcase-card artwork — see SolutionData.image. */
  image?: string;
  category: string;
  date: string;
  readTime: string;
  body: string[];
};

export type TestimonialData = {
  quote: string;
  name: string;
  role: string;
  /** 9:16 clip recorded by the client. Optional — without it the card falls
   *  back to the written quote, so the rail never shows a broken player. */
  videoUrl?: string;
  /** First frame shown before playback. Strongly recommended: without it the
   *  card is blank until the video buffers. */
  posterUrl?: string;
};
export type PartnerData = { name: string };
export type TeamMemberData = {
  name: string;
  role: string;
  bio: string;
  /** Headshot for the team showcase card — see SolutionData.image. */
  image?: string;
  leadership?: boolean;
};
export type StatData = { value: string; label: string };
export type TechData = { name: string };
export type DeliveryStepData = { title: string; description: string };
export type ValueData = { title: string; description: string };
export type CapabilityData = { label: string };
export type PerkData = { title: string; description: string };
export type RoleData = { title: string; type: string };
export type PartnerBenefitData = { title: string; description: string };
export type ProcessStepData = { title: string; description: string };
export type FaqData = { q: string; a: string; group: "learn" | "products" };
export type ContactDetailData = { icon: string; label: string; value: string; href?: string };
export type HackathonHighlightData = { icon: string; label: string };
export type HackathonTrackData = { title: string; description: string };
export type HackathonTimelineData = { label: string; detail: string };
export type HackathonPartnerData = {
  name: string;
  /** The partner's own mark. Optional: without one the tile sets the name as
   *  a wordmark instead, so a partner can be listed the day the agreement is
   *  signed rather than the day their logo file turns up. */
  logo?: string;
  /** Sponsorship level, printed under the mark. Free text — every hackathon
   *  invents its own ladder. Empty prints nothing. */
  tier?: string;
  /** The partner's site. Given one, the whole tile becomes the link. */
  url?: string;
};
export type NavData = { groups: typeof navGroups };
export type PageHeroData = { eyebrow: string; title: string; description: string; eyebrowTone?: "blue" | "green" };
export type SectionHeadingData = {
  eyebrow: string;
  title: string;
  description: string;
  eyebrowTone?: "blue" | "green";
};
export type HackathonSlideshowData = {
  imageUrl: string;
  mobileImageUrl?: string;
  displayOrder: number;
  /** Which way the copy reads over this particular picture. Chosen per image
   *  because a bright shot and a dark one cannot share one text colour. */
  textTone?: "light" | "dark";
  /** Optional wash, tinted to match textTone, for images the copy struggles
   *  on. "0" leaves the photograph untouched. */
  overlayOpacity?: string;
};
export type HomeHeroData = {
  eyebrow: string;
  title: string;
  paragraph: string;
  primaryLabel: string;
  primaryHref: string;
  secondaryLabel: string;
  secondaryHref: string;
  tertiaryLabel: string;
  tertiaryHref: string;
};
export type HomeTrustData = { label: string };
export type HomeFlagshipData = {
  badge: string;
  title: string;
  description: string;
  point1: string;
  point2: string;
  ctaLabel: string;
  ctaHref: string;
};
export type HomeFinalCtaData = {
  title: string;
  description: string;
  primaryLabel: string;
  primaryHref: string;
  secondaryLabel: string;
  secondaryHref: string;
};

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

export function slugify(input: string): string {
  return (
    input
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "") || "item"
  );
}

function serializeSolutions(): SeedRow[] {
  return solutions.map((s) => ({
    slug: s.slug,
    data: {
      name: s.name,
      tagline: s.tagline,
      icon: keyOfIcon(s.icon),
      accent: s.accent,
      problem: s.problem,
      approach: s.approach,
      deliverables: s.deliverables,
      timeline: s.timeline,
      tags: s.tags,
      proof: s.proof,
    },
  }));
}

function serializeCourses(): SeedRow[] {
  return courses.map((c) => ({ slug: c.slug, data: { ...c } }));
}

function serializeProducts(): SeedRow[] {
  return products.map((p) => ({
    slug: p.slug,
    data: {
      name: p.name,
      tagline: p.tagline,
      icon: keyOfIcon(p.icon),
      accent: p.accent,
      description: p.description,
      features: p.features,
      audience: p.audience,
    },
  }));
}

function serializeArticles(): SeedRow[] {
  return articles.map((a) => ({ slug: a.slug, data: { ...a } }));
}

function serializeTestimonials(): SeedRow[] {
  return testimonials.map((t) => ({ slug: slugify(t.name), data: { ...t } }));
}

function serializePartners(): SeedRow[] {
  return partners.map((p) => ({ slug: slugify(p.name), data: { ...p } }));
}

function serializeTeam(): SeedRow[] {
  const extraTeam = [
    { name: "Bipan Pandey", role: "Graphics Designer", bio: "Crafts visual identity and graphics across KodeDristi's brand, products and events." },
    { name: "Pratima Khanal", role: "Marketing & PR Lead", bio: "Owns brand communications, community and public relations for KodeDristi." },
    { name: "Rishab Dev Chudali", role: "Flutter Developer", bio: "Builds cross-platform mobile applications for clients and in-house products." },
    { name: "Sanjish Thapa Magar", role: "Backend Developer", bio: "Designs and ships reliable APIs and backend services for client systems." },
    { name: "Rakesh Singh", role: "QA Engineer", bio: "Keeps every release verified across automated and manual testing." },
    { name: "Anish Basnet", role: "Legal & Accounting", bio: "Handles legal compliance, contracts and financial operations." },
    { name: "Abiskar Dahal", role: "Database Engineer", bio: "Designs data models and keeps systems consistent and performant at scale." },
    { name: "Sujal Panday", role: "Frontend Developer", bio: "Builds polished, accessible front-end experiences for client applications." },
    { name: "Sunny Jha", role: "IT Support Engineer", bio: "Keeps infrastructure, devices and internal tooling running smoothly." },
  ];
  return [
    ...leadership.map((p) => ({
      slug: slugify(p.name),
      data: { name: p.name, role: p.role, bio: p.bio, leadership: true },
    })),
    ...extraTeam.map((p) => ({
      slug: slugify(p.name),
      data: { ...p, leadership: false },
    })),
  ];
}

function serializeStats(): SeedRow[] {
  return stats.map((s) => ({ slug: slugify(s.label), data: { ...s } }));
}

function serializeTech(): SeedRow[] {
  return techStack.map((t) => ({ slug: slugify(t.name), data: { ...t } }));
}

function serializeDelivery(): SeedRow[] {
  return deliveryApproach.map((d) => ({ slug: slugify(d.title), data: { ...d } }));
}

const values = [
  { title: "Ship what we promise", description: "Every engagement ends in something running in production, not a slide deck." },
  { title: "Stay close to the problem", description: "We model your real workflow before we write a line of code." },
  { title: "Teach as we build", description: "Our courses and client work run on the same standard — no separate 'training-grade' shortcuts." },
  { title: "Grow people, not just projects", description: "We invest in engineers who stay curious, on client work and in the classroom." },
];

const capabilities = [
  "Web & mobile product engineering",
  "SaaS architecture & multi-tenant systems",
  "Applied AI, automation & LLM integration",
  "Cloud infrastructure & DevOps",
  "Custom enterprise software",
  "Technical training & curriculum design",
];

const perks = [
  { title: "Real client work", description: "Ship to production from week one — no bench time on toy projects." },
  { title: "Teach what you build", description: "Engineers can instruct in our course programs alongside client work." },
  { title: "Small, senior teams", description: "Work directly with leadership — no layers between you and the decision." },
  { title: "Kathmandu-based, remote-friendly", description: "Hybrid setup with flexibility for the right role." },
];

const openRoles = [
  { title: "Full-Stack Engineer (Next.js / Laravel)", type: "Full-time · Kathmandu" },
  { title: "AI/ML Engineer", type: "Full-time · Kathmandu / Remote" },
  { title: "Flutter Developer", type: "Full-time · Kathmandu" },
  { title: "Course Instructor — Cloud & DevOps", type: "Part-time · Remote" },
];

const partnerBenefits = [
  { title: "Curriculum collaboration", description: "Co-develop course tracks aligned with your institution's programs." },
  { title: "Joint programs", description: "Co-branded bootcamps, hackathon sponsorship and guest instruction." },
  { title: "Hiring pipeline", description: "Direct access to graduating cohorts for internships and hiring." },
];

const processSteps = [
  { title: "Apply", description: "Tell us about your background and the course you want." },
  { title: "Reserve your seat", description: "Confirm enrollment with a deposit — seats are limited per cohort." },
  { title: "Orientation", description: "Get your schedule, materials access and instructor introduction." },
  { title: "Start learning", description: "Live sessions, weekly labs and a capstone project." },
];

const faqs: { q: string; a: string; group: "learn" | "products" }[] = [
  { q: "Are classes live or self-paced?", a: "All KodeDristi courses are live, cohort-based sessions with a fixed schedule — not pre-recorded content.", group: "learn" },
  { q: "What happens if I miss a session?", a: "Every live session is recorded and shared with enrolled students within 24 hours.", group: "learn" },
  { q: "Is there a certificate?", a: "Yes — students who complete the capstone project receive a KodeDristi completion certificate.", group: "learn" },
  { q: "Can my company sponsor a cohort seat?", a: "Yes, reach out via the enquiry form below and we'll set up corporate billing.", group: "learn" },
  { q: "Can these products be white-labelled?", a: "Yes — Billing Software, Accounting Software and LMS all support white-label deployment for partners.", group: "products" },
  { q: "Do you offer a trial?", a: "Every product has a guided demo; trial access is arranged during your first call.", group: "products" },
  { q: "Can you build something similar for us?", a: "Yes — reach out via the contact card on any product page to scope a custom build.", group: "products" },
];

const contactDetails = [
  { icon: "phone", label: "Phone", value: "+977 9842863398", href: "tel:+9779842863398" },
  { icon: "mail", label: "Email", value: "hello@kodedristi.com", href: "mailto:hello@kodedristi.com" },
  { icon: "map-pin", label: "Location", value: "Kathmandu, Nepal" },
  { icon: "clock", label: "Hours", value: "9:00 AM – 7:00 PM, Sun–Fri" },
];

const hackathonHighlights = [
  { icon: "users", label: "Teams of 2–4" },
  { icon: "calendar", label: "48-hour build" },
  { icon: "trophy", label: "Cash & prizes" },
  { icon: "award", label: "Hiring pipeline" },
];

const hackathonTracks = [
  { title: "Applied AI", description: "LLM applications, computer vision or predictive models solving a real problem." },
  { title: "Civic & Social Impact", description: "Software addressing an education, health or public-service challenge in Nepal." },
  { title: "Open Innovation", description: "Any product idea — web, mobile or AI — judged on execution and impact." },
];

const hackathonTimeline = [
  { label: "Registrations open", detail: "Teams of 2–4 register online" },
  { label: "Kickoff & problem statements", detail: "Live opening ceremony and track briefs" },
  { label: "48-hour build window", detail: "Mentors on call throughout" },
  { label: "Demos & judging", detail: "Live pitches to the judging panel" },
  { label: "Awards ceremony", detail: "Winners announced, prizes and offers extended" },
];

const pageHeroes: { slug: string; data: PageHeroData }[] = [
  { slug: "about", data: { eyebrow: "Company", title: "Software and skills, built together", description: "KodeDristi is a Kathmandu-based software company that builds client products and runs applied IT courses from the same engineering bench — #WithYouEveryStep." } },
  { slug: "team", data: { eyebrow: "Company", title: "Team", description: "A small, senior bench across engineering, design and instruction — the same people on your project are the ones teaching our courses." } },
  { slug: "careers", data: { eyebrow: "Company", title: "Careers", description: "We hire in small numbers, for real ownership. If you'd rather ship than sit in standups, this is that kind of team." } },
  { slug: "partners", data: { eyebrow: "Partners", title: "Built with our partners, not just for them", description: "KodeDristi works with universities, training institutes and businesses to expand access to quality software education and delivery." } },
  { slug: "learn", data: { eyebrow: "Learn", title: "IT courses built from real delivery work", description: "Six live, cohort-based programs taught by the same engineers who ship KodeDristi's client projects.", eyebrowTone: "green" } },
  { slug: "insights", data: { eyebrow: "Knowledge", title: "News & Insights", description: "Notes from our engineering and delivery teams — practical, not promotional." } },
  { slug: "products", data: { eyebrow: "Products", title: "Products", description: "In-house software KodeDristi builds, ships and maintains — proof of the same engineering standard we bring to client work." } },
  { slug: "solutions", data: { eyebrow: "Solutions", title: `${solutions.length} delivery tracks. One accountable team.`, description: "Every solution below follows the same disciplined process — a clear problem statement, a defined approach, concrete deliverables and a realistic timeline." } },
  { slug: "contact", data: { eyebrow: "Contact", title: "Let's talk about what you're building", description: "Whether it's a project, a course seat, or a partnership — tell us the details and we'll follow up within one business day." } },
  { slug: "hackathon", data: { eyebrow: "Flagship Program", title: "National AI Hackathon", description: "KodeDristi's flagship national competition for student and professional builders — 48 hours, real mentors, real prizes, and a direct line to our hiring and partner network." } },
];

const sectionHeadings: { slug: string; data: SectionHeadingData }[] = [
  { slug: "hackathon-partners", data: { eyebrow: "Hackathon Partners", title: "The organisations behind the hackathon", description: "Sponsors, academic hosts and community partners who put up the prizes, the mentors and the rooms.", eyebrowTone: "green" } },
  { slug: "solutions-overview", data: { eyebrow: "Solutions", title: `${solutions.length} ways we help you ship`, description: "From a single web app to a full AI-driven platform — pick a starting point, or let us scope the right mix." } },
  { slug: "courses-overview", data: { eyebrow: "Learn", title: "Applied IT courses, taught by practitioners", description: "Six live cohort-based programs — built from the same work our engineering team ships for clients.", eyebrowTone: "green" } },
  { slug: "tech-delivery", data: { eyebrow: "Technology", title: "A stack chosen for reliability, not resume-padding", description: "" } },
  { slug: "team-overview", data: { eyebrow: "Leadership", title: "The team behind every delivery", description: "A small, senior team — led by our CEO — that stays close to every engagement." } },
  { slug: "testimonials", data: { eyebrow: "Testimonials", title: "What our clients say", description: "" } },
];

const homeHero: SeedRow = {
  slug: "main",
  data: {
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
  },
};

const homeTrust: SeedRow = {
  slug: "main",
  data: { label: "Trusted by growing businesses and academic partners across Nepal" },
};

const homeFlagship: SeedRow = {
  slug: "main",
  data: {
    badge: "Flagship Program",
    title: "National AI Hackathon 2026",
    description:
      "KodeDristi's flagship national competition for student and professional builders — 48 hours, real mentors, real prizes, and a direct line to our hiring and partner network.",
    point1: "Open to teams of 2–4",
    point2: "Registrations open now",
    ctaLabel: "Register for Hackathon",
    ctaHref: "/hackathon",
  },
};

const homeFinalCta: SeedRow = {
  slug: "main",
  data: {
    title: "Let's architect your digital future.",
    description:
      "Tell us what you're trying to solve. We'll respond within one business day with next steps — no obligation.",
    primaryLabel: "Start a Project",
    primaryHref: "/contact",
    secondaryLabel: "Explore Programs",
    secondaryHref: "/learn",
  },
};

// ---------------------------------------------------------------------------
// Schema registry
// ---------------------------------------------------------------------------

export const CONTENT_SCHEMAS: ContentSchema[] = [
  {
    type: "solution",
    label: "Solutions",
    singular: "Solution",
    titleField: "name",
    subtitleField: "tagline",
    iconField: "icon",
    fields: [
      { key: "name", label: "Name", kind: "text", required: true },
      { key: "tagline", label: "Tagline", kind: "text", required: true },
      { key: "image", label: "Card image", kind: "image", helper: "Shown in the Solutions showcase grid on the home page. Leave empty and the card keeps the space reserved." },
      { key: "icon", label: "Icon", kind: "icon" },
      { key: "accent", label: "Accent color", kind: "tone" },
      { key: "problem", label: "Problem statement", kind: "textarea" },
      { key: "approach", label: "Approach", kind: "textarea" },
      { key: "deliverables", label: "Deliverables (one per line)", kind: "list" },
      { key: "timeline", label: "Timeline", kind: "text" },
      { key: "tags", label: "Tags (one per line)", kind: "list" },
      { key: "proof", label: "Proof", kind: "textarea" },
    ],
    fallback: serializeSolutions,
  },
  {
    type: "course",
    label: "Courses",
    singular: "Course",
    titleField: "name",
    subtitleField: "summary",
    fields: [
      { key: "name", label: "Name", kind: "text", required: true },
      { key: "summary", label: "Summary", kind: "textarea" },
      { key: "image", label: "Card image", kind: "image", helper: "Shown in the Learn showcase grid on the home page. Leave empty and the card keeps the space reserved." },
      { key: "level", label: "Level", kind: "select", options: ["Beginner", "Intermediate", "Advanced"] },
      { key: "duration", label: "Duration", kind: "text" },
      { key: "format", label: "Format", kind: "text" },
      { key: "curriculum", label: "Curriculum (one per line)", kind: "list" },
      { key: "prerequisites", label: "Prerequisites", kind: "text" },
      { key: "fee", label: "Fee", kind: "text" },
      { key: "nextStartDate", label: "Next start date", kind: "text" },
      { key: "instructor", label: "Instructor", kind: "text" },
      { key: "outcomes", label: "Outcomes (one per line)", kind: "list" },
    ],
    fallback: serializeCourses,
  },
  {
    type: "product",
    label: "Products",
    singular: "Product",
    titleField: "name",
    subtitleField: "tagline",
    iconField: "icon",
    fields: [
      { key: "name", label: "Name", kind: "text", required: true },
      { key: "tagline", label: "Tagline", kind: "text", required: true },
      { key: "image", label: "Card image", kind: "image", helper: "Shown on the showcase card. Leave empty and the card keeps the space reserved." },
      { key: "icon", label: "Icon", kind: "icon" },
      { key: "accent", label: "Accent color", kind: "tone" },
      { key: "description", label: "Description", kind: "textarea" },
      { key: "features", label: "Features (one per line)", kind: "list" },
      { key: "audience", label: "Audience", kind: "text" },
    ],
    fallback: serializeProducts,
  },
  {
    type: "article",
    label: "Insights / Articles",
    singular: "Article",
    titleField: "title",
    subtitleField: "category",
    fields: [
      { key: "title", label: "Title", kind: "text", required: true },
      { key: "excerpt", label: "Excerpt", kind: "textarea" },
      { key: "image", label: "Card image", kind: "image", helper: "Shown on the showcase card. Leave empty and the card keeps the space reserved." },
      { key: "category", label: "Category", kind: "text" },
      { key: "date", label: "Date (YYYY-MM-DD)", kind: "text" },
      { key: "readTime", label: "Read time", kind: "text" },
      { key: "body", label: "Body (one paragraph per line)", kind: "list" },
    ],
    fallback: serializeArticles,
  },
  {
    type: "testimonial",
    label: "Testimonials",
    singular: "Testimonial",
    titleField: "name",
    subtitleField: "role",
    fields: [
      { key: "quote", label: "Quote", kind: "textarea", required: true },
      { key: "name", label: "Name", kind: "text", required: true },
      { key: "role", label: "Role", kind: "text" },
      {
        key: "videoUrl",
        label: "Video URL (9:16)",
        kind: "url",
        placeholder: "https://…/anjali.mp4",
        helper:
          "Vertical 9:16 MP4 (H.264/AAC) recorded by the client. Leave empty to show the written quote instead.",
      },
      {
        key: "posterUrl",
        label: "Video poster image",
        kind: "url",
        placeholder: "https://…/anjali-poster.jpg",
        helper: "Shown before the video loads. Use a 9:16 frame from the clip.",
      },
    ],
    fallback: serializeTestimonials,
  },
  {
    type: "partner",
    label: "Partners",
    singular: "Partner",
    titleField: "name",
    fields: [{ key: "name", label: "Name", kind: "text", required: true }],
    fallback: serializePartners,
  },
  {
    type: "team-member",
    label: "Team",
    singular: "Team member",
    titleField: "name",
    subtitleField: "role",
    fields: [
      { key: "name", label: "Name", kind: "text", required: true },
      { key: "role", label: "Role", kind: "text" },
      { key: "bio", label: "Bio", kind: "textarea" },
      { key: "image", label: "Card image", kind: "image", helper: "Headshot shown on the team card. Leave empty and the card keeps the space reserved." },
      { key: "leadership", label: "Show in leadership sections", kind: "check" },
    ],
    fallback: serializeTeam,
  },
  {
    type: "stat",
    label: "Stats",
    singular: "Stat",
    titleField: "label",
    fields: [
      { key: "value", label: "Value (e.g. 10+)", kind: "text", required: true },
      { key: "label", label: "Label", kind: "text", required: true },
    ],
    fallback: serializeStats,
  },
  {
    type: "tech",
    label: "Tech stack",
    singular: "Tech",
    titleField: "name",
    fields: [{ key: "name", label: "Name", kind: "text", required: true }],
    fallback: serializeTech,
  },
  {
    type: "delivery-step",
    label: "Delivery approach",
    singular: "Step",
    titleField: "title",
    fields: [
      { key: "title", label: "Title", kind: "text", required: true },
      { key: "description", label: "Description", kind: "textarea" },
    ],
    fallback: serializeDelivery,
  },
  {
    type: "value",
    label: "Company values",
    singular: "Value",
    titleField: "title",
    fields: [
      { key: "title", label: "Title", kind: "text", required: true },
      { key: "description", label: "Description", kind: "textarea" },
    ],
    fallback: () => values.map((v) => ({ slug: slugify(v.title), data: { ...v } })),
  },
  {
    type: "capability",
    label: "Capabilities",
    singular: "Capability",
    titleField: "label",
    fields: [{ key: "label", label: "Capability", kind: "text", required: true }],
    fallback: () => capabilities.map((c) => ({ slug: slugify(c), data: { label: c } })),
  },
  {
    type: "perk",
    label: "Careers perks",
    singular: "Perk",
    titleField: "title",
    fields: [
      { key: "title", label: "Title", kind: "text", required: true },
      { key: "description", label: "Description", kind: "textarea" },
    ],
    fallback: () => perks.map((p) => ({ slug: slugify(p.title), data: { ...p } })),
  },
  {
    type: "role",
    label: "Open roles",
    singular: "Role",
    titleField: "title",
    subtitleField: "type",
    fields: [
      { key: "title", label: "Title", kind: "text", required: true },
      { key: "type", label: "Type / location", kind: "text" },
    ],
    fallback: () => openRoles.map((r) => ({ slug: slugify(r.title), data: { ...r } })),
  },
  {
    type: "partner-benefit",
    label: "Partner benefits",
    singular: "Benefit",
    titleField: "title",
    fields: [
      { key: "title", label: "Title", kind: "text", required: true },
      { key: "description", label: "Description", kind: "textarea" },
    ],
    fallback: () =>
      partnerBenefits.map((b) => ({ slug: slugify(b.title), data: { ...b } })),
  },
  {
    type: "process-step",
    label: "Enrollment steps",
    singular: "Step",
    titleField: "title",
    fields: [
      { key: "title", label: "Title", kind: "text", required: true },
      { key: "description", label: "Description", kind: "textarea" },
    ],
    fallback: () => processSteps.map((s) => ({ slug: slugify(s.title), data: { ...s } })),
  },
  {
    type: "faq",
    label: "FAQs",
    singular: "FAQ",
    titleField: "q",
    fields: [
      { key: "q", label: "Question", kind: "textarea", required: true },
      { key: "a", label: "Answer", kind: "textarea" },
      { key: "group", label: "Section", kind: "select", options: ["learn", "products"] },
    ],
    fallback: () => faqs.map((f) => ({ slug: slugify(f.q), data: { ...f } })),
  },
  {
    type: "contact-detail",
    label: "Contact details",
    singular: "Detail",
    titleField: "label",
    iconField: "icon",
    fields: [
      { key: "icon", label: "Icon", kind: "icon" },
      { key: "label", label: "Label", kind: "text", required: true },
      { key: "value", label: "Value", kind: "text", required: true },
      { key: "href", label: "Link (tel:/mailto:/URL)", kind: "url" },
    ],
    fallback: () => contactDetails.map((c) => ({ slug: slugify(c.label), data: { ...c } })),
  },
  {
    type: "hackathon-highlight",
    label: "Hackathon highlights",
    singular: "Highlight",
    titleField: "label",
    iconField: "icon",
    fields: [
      { key: "icon", label: "Icon", kind: "icon" },
      { key: "label", label: "Label", kind: "text", required: true },
    ],
    fallback: () =>
      hackathonHighlights.map((h) => ({ slug: slugify(h.label), data: { ...h } })),
  },
  {
    type: "hackathon-track",
    label: "Hackathon tracks",
    singular: "Track",
    titleField: "title",
    fields: [
      { key: "title", label: "Title", kind: "text", required: true },
      { key: "description", label: "Description", kind: "textarea" },
    ],
    fallback: () => hackathonTracks.map((t) => ({ slug: slugify(t.title), data: { ...t } })),
  },
  {
    type: "hackathon-timeline",
    label: "Hackathon timeline",
    singular: "Step",
    titleField: "label",
    fields: [
      { key: "label", label: "Label", kind: "text", required: true },
      { key: "detail", label: "Detail", kind: "text" },
    ],
    fallback: () =>
      hackathonTimeline.map((t) => ({ slug: slugify(t.label), data: { ...t } })),
  },
  {
    type: "hackathon-partner",
    label: "Hackathon partners",
    singular: "Hackathon partner",
    titleField: "name",
    subtitleField: "tier",
    fields: [
      { key: "name", label: "Name", kind: "text", required: true },
      { key: "logo", label: "Logo", kind: "image", helper: "Ideally a wordmark on a transparent background. Leave it empty and the tile sets the name as a wordmark instead — a partner listed without a logo still looks finished." },
      { key: "tier", label: "Tier", kind: "text", placeholder: "Title Partner", helper: "Printed under the mark — e.g. Title Partner, Gold, Academic Host. Leave empty to show none." },
      { key: "url", label: "Website", kind: "url", placeholder: "https://…", helper: "Optional. With a link the whole tile becomes clickable." },
    ],
    /* Seeded from the institutional partner list so the section is populated
       the moment it ships. It stays a separate list from `partner` on
       purpose: who sponsors the hackathon and who partners with the company
       are two rosters, and this one is curated down from day one. */
    fallback: () => partners.map((p) => ({ slug: slugify(p.name), data: { name: p.name } })),
  },
  {
    type: "nav",
    label: "Navigation",
    singular: "Navigation",
    isSingleton: true,
    singletonSlug: "main",
    titleField: "groups",
    fields: [
      {
        key: "groups",
        label: "Nav groups (JSON)",
        kind: "json",
        helper: "Array of { label, href, items: [{ label, href, description }] }",
      },
    ],
    fallback: () => [{ slug: "main", data: { groups: navGroups } }],
  },
  {
    type: "page-hero",
    label: "Page heroes",
    singular: "Page hero",
    titleField: "title",
    subtitleField: "slug",
    fields: [
      { key: "eyebrow", label: "Eyebrow", kind: "text" },
      { key: "title", label: "Title", kind: "text", required: true },
      { key: "description", label: "Description", kind: "textarea" },
      { key: "eyebrowTone", label: "Eyebrow tone", kind: "tone" },
    ],
    fallback: () => pageHeroes.map((p) => ({ slug: p.slug, data: { ...p.data } })),
  },
  {
    type: "section-heading",
    label: "Home section headings",
    singular: "Section heading",
    titleField: "title",
    subtitleField: "slug",
    fields: [
      { key: "eyebrow", label: "Eyebrow", kind: "text" },
      { key: "title", label: "Title", kind: "text", required: true },
      { key: "description", label: "Description", kind: "textarea" },
      { key: "eyebrowTone", label: "Eyebrow tone", kind: "tone" },
    ],
    fallback: () => sectionHeadings.map((s) => ({ slug: s.slug, data: { ...s.data } })),
  },
  {
    type: "home-hero",
    label: "Home hero",
    singular: "Home hero",
    isSingleton: true,
    singletonSlug: "main",
    titleField: "title",
    fields: [
      { key: "eyebrow", label: "Eyebrow", kind: "text" },
      { key: "title", label: "Title", kind: "textarea", required: true },
      { key: "paragraph", label: "Paragraph", kind: "textarea" },
      { key: "primaryLabel", label: "Primary button label", kind: "text" },
      { key: "primaryHref", label: "Primary button link", kind: "url" },
      { key: "secondaryLabel", label: "Secondary button label", kind: "text" },
      { key: "secondaryHref", label: "Secondary button link", kind: "url" },
      { key: "tertiaryLabel", label: "Tertiary link label", kind: "text" },
      { key: "tertiaryHref", label: "Tertiary link href", kind: "url" },
    ],
    fallback: () => [homeHero],
  },
  {
    type: "home-trust",
    label: "Trust strip",
    singular: "Trust strip",
    isSingleton: true,
    singletonSlug: "main",
    titleField: "label",
    fields: [{ key: "label", label: "Trust text", kind: "text", required: true }],
    fallback: () => [homeTrust],
  },
  {
    type: "home-flagship",
    label: "Flagship banner",
    singular: "Flagship banner",
    isSingleton: true,
    singletonSlug: "main",
    titleField: "title",
    fields: [
      { key: "badge", label: "Badge", kind: "text" },
      { key: "title", label: "Title", kind: "text", required: true },
      { key: "description", label: "Description", kind: "textarea" },
      { key: "point1", label: "Highlight point 1", kind: "text" },
      { key: "point2", label: "Highlight point 2", kind: "text" },
      { key: "ctaLabel", label: "Button label", kind: "text" },
      { key: "ctaHref", label: "Button link", kind: "url" },
    ],
    fallback: () => [homeFlagship],
  },
  {
    type: "home-final-cta",
    label: "Final CTA banner",
    singular: "Final CTA",
    isSingleton: true,
    singletonSlug: "main",
    titleField: "title",
    fields: [
      { key: "title", label: "Title", kind: "text", required: true },
      { key: "description", label: "Description", kind: "textarea" },
      { key: "primaryLabel", label: "Primary button label", kind: "text" },
      { key: "primaryHref", label: "Primary button link", kind: "url" },
      { key: "secondaryLabel", label: "Secondary button label", kind: "text" },
      { key: "secondaryHref", label: "Secondary button link", kind: "url" },
    ],
    fallback: () => [homeFinalCta],
  },
];

// ---------------------------------------------------------------------------
// Admin ordering — mirrors the order content appears on the site: global
// chrome, then the homepage section by section, then the other pages in nav
// order, then the hackathon pages.
// ---------------------------------------------------------------------------

export const CONTENT_GROUPS: { group: string; types: string[] }[] = [
  { group: "Site-wide", types: ["nav", "page-hero"] },
  {
    group: "Homepage",
    types: [
      "home-section",
      "home-hero",
      "home-trust",
      "stat",
      "home-flagship",
      "hackathon-partner",
      "section-heading",
      "solution",
      "course",
      "tech",
      "delivery-step",
      "team-member",
      "home-final-cta",
      "testimonial",
    ],
  },
  { group: "Learn", types: ["process-step", "faq"] },
  { group: "About", types: ["value", "capability"] },
  { group: "Careers", types: ["perk", "role"] },
  { group: "Insights", types: ["article"] },
  { group: "Contact", types: ["contact-detail"] },
  { group: "Partners", types: ["partner", "partner-benefit"] },
  { group: "Products", types: ["product"] },
  {
    group: "Hackathon",
    types: ["hackathon-highlight", "hackathon-track", "hackathon-timeline", "hackathon-slideshow-settings", "hackathon-slideshow-image"],
  },
];

// Hackathon slideshow settings (admin-manageable)
CONTENT_SCHEMAS.push({
  type: "hackathon-slideshow-settings",
  label: "Hackathon background",
  singular: "Background settings",
  isSingleton: true,
  singletonSlug: "main",
  titleField: "intervalSeconds",
  fields: [
    { key: "intervalSeconds", label: "Slide interval (seconds)", kind: "text", required: true, placeholder: "6", helper: "Seconds each background image stays before it fades to the next" },
    { key: "autoPlay", label: "Rotate automatically", kind: "check", helper: "Off shows only the first image. Rotation is also skipped for visitors who ask for reduced motion." },
  ],
  fallback: () => [{ slug: "main", data: { intervalSeconds: 5, autoPlay: true } }],
});

// Hackathon slideshow images (admin-manageable)
CONTENT_SCHEMAS.push({
  type: "hackathon-slideshow-image",
  label: "Hackathon background images",
  singular: "Background image",
  titleField: "imageUrl",
  subtitleField: "displayOrder",
  fields: [
    { key: "imageUrl", label: "Desktop image", kind: "image", required: true, helper: "Background image for the National AI Hackathon section. Add several and they fade between each other." },
    { key: "mobileImageUrl", label: "Mobile image (optional)", kind: "image" },
    { key: "displayOrder", label: "Display order", kind: "text", required: true, placeholder: "1", helper: "Order in which images appear (1, 2, 3...)" },
    { key: "textTone", label: "Text colour on this image", kind: "select", options: ["light", "dark"], helper: "Look at the image and pick: 'light' for white text (dark photos), 'dark' for black text (bright photos)." },
    { key: "overlayOpacity", label: "Darken/lighten for legibility", kind: "select", options: ["0", "10", "20", "30", "40"], helper: "Leave at 0 to show the photo untouched. Raise it only if the text is hard to read — the wash follows the text colour you picked." },
  ],
  fallback: () => [],
});

// Homepage section ordering and visibility (admin-manageable)
CONTENT_SCHEMAS.push({
  type: "home-section",
  label: "Homepage sections",
  singular: "Section",
  titleField: "label",
  isSingleton: false,
  fields: [
    { key: "type", label: "Section type", kind: "select", required: true, options: [
      "hero", "trust", "flagship", "hackathon-partners", "solutions", "courses", "tech", "team", "cta", "testimonials"
    ]},
    { key: "label", label: "Display name", kind: "text", required: true },
    { key: "enabled", label: "Visible on page", kind: "check" },
  ],
  fallback: () => [
    { slug: "hero", data: { type: "hero", label: "Hero", enabled: true } },
    { slug: "trust", data: { type: "trust", label: "Trust strip", enabled: true } },
    { slug: "flagship", data: { type: "flagship", label: "Flagship program", enabled: true } },
    { slug: "hackathon-partners", data: { type: "hackathon-partners", label: "Hackathon partners", enabled: true } },
    { slug: "solutions", data: { type: "solutions", label: "Solutions overview", enabled: true } },
    { slug: "courses", data: { type: "courses", label: "Courses overview", enabled: true } },
    { slug: "tech", data: { type: "tech", label: "Tech delivery", enabled: true } },
    { slug: "team", data: { type: "team", label: "Team overview", enabled: true } },
    { slug: "cta", data: { type: "cta", label: "Final CTA", enabled: true } },
    { slug: "testimonials", data: { type: "testimonials", label: "Testimonials", enabled: true } },
  ],
});

const schemaMap = new Map(CONTENT_SCHEMAS.map((s) => [s.type, s]));

export function getSchema(type: string): ContentSchema {
  const schema = schemaMap.get(type);
  if (!schema) throw new Error(`Unknown content type: ${type}`);
  return schema;
}


