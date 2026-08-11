import type { LucideIcon } from "lucide-react";
import { Sparkles, Receipt, Calculator, GraduationCap } from "lucide-react";

export type Product = {
  slug: string;
  name: string;
  tagline: string;
  icon: LucideIcon;
  accent: "blue" | "green";
  description: string;
  features: string[];
  audience: string;
};

export const products: Product[] = [
  {
    slug: "okil-ai",
    name: "Okil.ai",
    tagline: "An AI-assisted workspace that keeps teams moving.",
    icon: Sparkles,
    accent: "blue",
    description:
      "Okil.ai brings AI-assisted drafting, summarisation and task automation into one workspace, so teams spend less time on repetitive writing and coordination work.",
    features: [
      "AI-assisted document drafting & summarisation",
      "Task and workflow automation",
      "Team workspaces with shared context",
      "Integrations via API",
    ],
    audience: "Growing teams that want AI leverage without building it in-house.",
  },
  {
    slug: "billing-software",
    name: "Billing Software",
    tagline: "Invoicing and billing, simplified for growing businesses.",
    icon: Receipt,
    accent: "green",
    description:
      "A billing platform for recurring invoices, payment tracking and client management, built for businesses that have outgrown spreadsheets.",
    features: [
      "Recurring & one-off invoicing",
      "Payment tracking and reminders",
      "Client and product catalogue",
      "Exportable financial reports",
    ],
    audience: "SMEs and service businesses managing recurring client billing.",
  },
  {
    slug: "accounting-software",
    name: "Accounting Software",
    tagline: "Books that stay reconciled and always current.",
    icon: Calculator,
    accent: "blue",
    description:
      "A straightforward accounting system covering ledgers, reconciliation and reporting — built for teams that need clarity without an enterprise-grade learning curve.",
    features: [
      "General ledger & chart of accounts",
      "Bank reconciliation",
      "Tax-ready financial reports",
      "Multi-user roles & approvals",
    ],
    audience: "Finance teams that need reliable books without enterprise overhead.",
  },
  {
    slug: "lms",
    name: "LMS",
    tagline: "Learning management built for institutions and training providers.",
    icon: GraduationCap,
    accent: "green",
    description:
      "A learning management system for course delivery, cohort tracking and assessments — the same platform behind KodeDristi's own course programs.",
    features: [
      "Course & cohort management",
      "Assignments, quizzes and grading",
      "Progress tracking and certificates",
      "Payment and enrollment workflows",
    ],
    audience: "Training institutes, universities and corporate learning teams.",
  },
];

export function getProduct(slug: string) {
  return products.find((p) => p.slug === slug);
}
