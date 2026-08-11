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
  {
    label: "Learn",
    href: "/learn",
    items: [
      { label: "AI & Machine Learning", href: "/learn/ai-machine-learning", description: "Applied AI/ML for working developers." },
      { label: "Full-Stack Web Development", href: "/learn/full-stack-web-development", description: "Next.js, Laravel and production practice." },
      { label: "Cloud & DevOps", href: "/learn/cloud-devops", description: "Deploy and operate real infrastructure." },
      { label: "Mobile App Development", href: "/learn/mobile-app-development", description: "Flutter, from idea to app store." },
      { label: "Data Analytics", href: "/learn/data-analytics", description: "Python, SQL and decision-ready dashboards." },
      { label: "UI/UX for Product Teams", href: "/learn/ui-ux-for-product-teams", description: "Design systems and product thinking." },
    ],
  },
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
