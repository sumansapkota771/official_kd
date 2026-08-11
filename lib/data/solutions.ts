import type { LucideIcon } from "lucide-react";
import { Smartphone, Layers, Workflow, Wrench, Cloud, ShieldCheck, Globe, Search, Palette, Frame, Megaphone } from "lucide-react";

export type Solution = {
  slug: string;
  name: string;
  tagline: string;
  icon: LucideIcon;
  accent: "blue" | "green";
  problem: string;
  approach: string;
  deliverables: string[];
  timeline: string;
  tags: string[];
  proof: string;
};

export const solutions: Solution[] = [
  {
    slug: "web-mobile-apps",
    name: "Web & Mobile Apps",
    tagline: "Product-grade apps your users actually enjoy using.",
    icon: Smartphone,
    accent: "blue",
    problem:
      "Ideas stall because in-house teams lack the bandwidth or specialised skill to ship a polished web and mobile experience on schedule.",
    approach:
      "We pair a dedicated product engineer with a designer from day one, working in two-week cycles with a demo at the end of every sprint so direction is validated early, not at the finish line.",
    deliverables: [
      "Production web app (Next.js / React)",
      "Cross-platform mobile app (Flutter)",
      "Design system and component library",
      "CI/CD pipeline and staging environment",
    ],
    timeline: "6 – 14 weeks",
    tags: ["Next.js", "React", "Flutter", "TypeScript"],
    proof: "12 consumer and business apps shipped to production across 4 industries.",
  },
  {
    slug: "saas-products",
    name: "SaaS Products",
    tagline: "Multi-tenant platforms engineered to scale from 10 to 10,000 accounts.",
    icon: Layers,
    accent: "green",
    problem:
      "Founders need a defensible SaaS product but risk burning runway on infrastructure decisions that don't hold up past the first hundred customers.",
    approach:
      "We start from a multi-tenant reference architecture — auth, billing, roles and observability solved up front — so your team's time goes into the product's actual differentiation.",
    deliverables: [
      "Multi-tenant architecture with role-based access",
      "Subscription billing integration",
      "Admin and analytics dashboards",
      "API documentation for integrations",
    ],
    timeline: "8 – 20 weeks",
    tags: ["Next.js", "PostgreSQL", "Stripe", "Multi-tenant"],
    proof: "SaaS platforms supporting recurring billing for regional and international clients.",
  },
  {
    slug: "ai-automation",
    name: "AI & Automation",
    tagline: "Applied AI that removes hours of manual work, not a chatbot demo.",
    icon: Workflow,
    accent: "blue",
    problem:
      "Teams are drowning in repetitive document, data-entry or support work that a well-scoped automation or AI workflow could remove entirely.",
    approach:
      "We map the workflow end-to-end, identify the highest-leverage automation point, and ship a narrow, reliable AI or rules-based system rather than an over-engineered general assistant.",
    deliverables: [
      "Workflow audit and automation roadmap",
      "Custom AI / LLM integration",
      "Automation pipeline with monitoring",
      "Handover documentation and training",
    ],
    timeline: "4 – 10 weeks",
    tags: ["Python", "LLM APIs", "RAG", "Automation"],
    proof: "Automation pipelines processing thousands of documents per month for operations teams.",
  },
  {
    slug: "custom-software",
    name: "Custom Software",
    tagline: "Purpose-built systems designed around how your team actually works.",
    icon: Wrench,
    accent: "green",
    problem:
      "Off-the-shelf software forces your team into someone else's workflow, creating spreadsheet workarounds and manual reconciliation.",
    approach:
      "We spend the first phase modelling your real operating process, then build a system that fits it — rather than asking your team to adapt to generic software.",
    deliverables: [
      "Requirements and process mapping",
      "Custom-built application",
      "Data migration from legacy systems",
      "Ongoing support agreement",
    ],
    timeline: "8 – 18 weeks",
    tags: ["Laravel", "Python", "PostgreSQL", "Custom"],
    proof: "Bespoke systems in production across logistics, education and retail operations.",
  },
  {
    slug: "cloud",
    name: "Cloud",
    tagline: "Architecture, migration and cost control that holds up under real load.",
    icon: Cloud,
    accent: "blue",
    problem:
      "Growing infrastructure costs and fragile deployments slow teams down and put uptime at risk during traffic spikes.",
    approach:
      "We audit current infrastructure, design a right-sized cloud architecture, and migrate in staged, reversible steps so there's no big-bang cutover risk.",
    deliverables: [
      "Cloud architecture assessment",
      "Migration plan and execution",
      "Infrastructure-as-code setup",
      "Cost optimisation report",
    ],
    timeline: "4 – 12 weeks",
    tags: ["AWS", "Azure", "Terraform", "Docker"],
    proof: "Infrastructure supporting workloads with materially reduced monthly cloud spend.",
  },
  {
    slug: "devops-security",
    name: "DevOps & Security",
    tagline: "Ship faster and safer, with fewer 2 a.m. incidents.",
    icon: ShieldCheck,
    accent: "green",
    problem:
      "Manual deployments and thin security practices slow releases and create risk that only surfaces after something breaks.",
    approach:
      "We introduce CI/CD, automated testing gates and a security baseline (secrets management, access review, dependency scanning) fitted to your team's current maturity.",
    deliverables: [
      "CI/CD pipeline implementation",
      "Security audit and hardening",
      "Monitoring and alerting setup",
      "Incident response runbook",
    ],
    timeline: "3 – 8 weeks",
    tags: ["CI/CD", "Security", "Monitoring", "DevOps"],
    proof: "Deployment pipelines cutting release time from days to minutes for partner teams.",
  },
  {
    slug: "domain-hosting",
    name: "Domain & Hosting",
    tagline: "Reliable domain registration, hosting and infrastructure that stays up.",
    icon: Globe,
    accent: "blue",
    problem:
      "The wrong domain or hosting setup leads to downtime, slow load times and security risk that quietly costs you customers.",
    approach:
      "We register, configure and manage domains and hosting on fast, secure infrastructure — SSL, backups and monitoring all handled for you.",
    deliverables: [
      "Domain registration & transfer",
      "Managed hosting setup",
      "SSL certificates & security",
      "Backups & uptime monitoring",
    ],
    timeline: "1 – 4 weeks",
    tags: ["Domains", "Hosting", "SSL", "Monitoring"],
    proof: "Managed hosting keeping client sites and apps online with 99.9% uptime.",
  },
  {
    slug: "seo",
    name: "SEO",
    tagline: "Search optimisation that moves your site up the rankings and keeps it there.",
    icon: Search,
    accent: "green",
    problem:
      "Great websites go unnoticed when they don't appear in search results — losing organic traffic and leads to competitors.",
    approach:
      "We audit your site, fix technical SEO, and build content and link strategies that grow rankings and organic traffic over time.",
    deliverables: [
      "Technical SEO audit",
      "On-page optimisation",
      "Content & keyword strategy",
      "Monthly performance reports",
    ],
    timeline: "Ongoing / 8+ weeks",
    tags: ["SEO", "Content", "Analytics", "Rankings"],
    proof: "Search visibility improvements driving sustained organic growth for partner businesses.",
  },
  {
    slug: "graphic-design",
    name: "Graphic Design",
    tagline: "Brand visuals, marketing creatives and assets that look professionally done.",
    icon: Palette,
    accent: "blue",
    problem:
      "Inconsistent or amateur visuals undermine brand credibility across your website, social media and print materials.",
    approach:
      "Our in-house designers create a cohesive visual identity — logos, social creatives, banners and print-ready assets that match your brand.",
    deliverables: [
      "Logo & brand identity",
      "Social media creatives",
      "Marketing banners & posters",
      "Print-ready assets",
    ],
    timeline: "2 – 6 weeks",
    tags: ["Branding", "Creatives", "Social", "Print"],
    proof: "Design systems and creatives shipped for startups, NGOs and enterprises.",
  },
  {
    slug: "ui-ux-design",
    name: "UI/UX Design",
    tagline: "Interfaces and experiences users find intuitive, fast and enjoyable.",
    icon: Frame,
    accent: "green",
    problem:
      "Products lose users when the interface is confusing, slow or inconsistent with the brand they trust.",
    approach:
      "We research user needs, define the information architecture, and deliver polished, tested UI screens developers can build from directly.",
    deliverables: [
      "UX research & user flows",
      "Wireframes & prototypes",
      "UI design & design system",
      "Usability testing",
    ],
    timeline: "3 – 8 weeks",
    tags: ["UX", "UI", "Prototyping", "Design systems"],
    proof: "Design systems that cut build time and lifted conversion on client products.",
  },
  {
    slug: "digital-marketing",
    name: "Digital Marketing",
    tagline: "Campaigns and strategy that turn attention into customers.",
    icon: Megaphone,
    accent: "blue",
    problem:
      "Marketing spend without clear targeting, messaging or measurement wastes budget and produces nothing measurable.",
    approach:
      "We build a channel strategy, run campaigns across social and search, and report on what actually drives results — not vanity metrics.",
    deliverables: [
      "Marketing strategy",
      "Social media management",
      "Paid campaign management",
      "Analytics & reporting",
    ],
    timeline: "Ongoing / 4+ weeks",
    tags: ["Social media", "Paid ads", "Strategy", "Analytics"],
    proof: "Campaigns that grew engagement and leads for partners across education and retail.",
  },
];

export function getSolution(slug: string) {
  return solutions.find((s) => s.slug === slug);
}
