export type NavLink = {
  label: string;
  href: string;
  description?: string;
};

export type NavGroup = {
  label: string;
  href: string;
  items: NavLink[];
};

export const navGroups: NavGroup[] = [
  {
    label: "Solutions",
    href: "/solutions",
    items: [
      { label: "Web & Mobile Apps", href: "/solutions/web-mobile-apps", description: "Product-grade apps for web and mobile." },
      { label: "SaaS Products", href: "/solutions/saas-products", description: "Multi-tenant platforms built to scale." },
      { label: "AI & Automation", href: "/solutions/ai-automation", description: "Applied AI that removes manual work." },
      { label: "Custom Software", href: "/solutions/custom-software", description: "Purpose-built systems for your workflow." },
      { label: "Cloud", href: "/solutions/cloud", description: "Architecture, migration and cost control." },
      { label: "DevOps & Security", href: "/solutions/devops-security", description: "Ship faster, safer, with less downtime." },
      { label: "Domain & Hosting", href: "/solutions/domain-hosting", description: "Reliable domains, hosting and infrastructure." },
      { label: "SEO", href: "/solutions/seo", description: "Search optimisation that builds organic traffic." },
      { label: "Graphic Design", href: "/solutions/graphic-design", description: "Brand identity, creatives and print assets." },
      { label: "UI/UX Design", href: "/solutions/ui-ux-design", description: "Interfaces users find intuitive and enjoyable." },
      { label: "Digital Marketing", href: "/solutions/digital-marketing", description: "Campaigns and strategy that drive results." },
    ],
  },
  /* The Learn group is deliberately absent. Every one of its entries was a
     course detail page, and courses are presented on the homepage only —
     leaving the dropdown would put six links to pages the design no longer
     sends anyone to. */
  {
    label: "Company",
    href: "/about",
    items: [
      { label: "About", href: "/about", description: "Mission, values and how we work." },
      { label: "Team", href: "/team", description: "The people behind KodeDristi." },
      { label: "Careers", href: "/careers", description: "Open roles and how we hire." },
      { label: "News / Insights", href: "/insights", description: "Updates, articles and case notes." },
      { label: "Contact", href: "/contact", description: "Start a conversation with us." },
    ],
  },
  {
    label: "Partners",
    href: "/partners",
    items: [
      { label: "Institutional Partners", href: "/partners#institutional", description: "Universities and training bodies we work with." },
      { label: "Become a Partner", href: "/partners#become-a-partner", description: "Partner with KodeDristi." },
    ],
  },
  {
    label: "Work",
    href: "/projects",
    items: [
      { label: "All Projects", href: "/projects", description: "Case studies from problem to business result." },
      { label: "Solutions", href: "/solutions", description: "The delivery tracks behind the work." },
    ],
  },
  {
    label: "Products",
    href: "/products",
    items: [
      { label: "Okil.ai", href: "/products/okil-ai", description: "AI-assisted workspace for teams." },
      { label: "Billing Software", href: "/products/billing-software", description: "Invoicing and billing, simplified." },
      { label: "Accounting Software", href: "/products/accounting-software", description: "Books, reconciled and always current." },
      { label: "LMS", href: "/products/lms", description: "Learning management for institutions." },
    ],
  },
];
