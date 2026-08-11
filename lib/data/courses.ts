export type Course = {
  slug: string;
  name: string;
  summary: string;
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

export const courses: Course[] = [
  {
    slug: "ai-machine-learning",
    name: "AI & Machine Learning",
    summary: "Go from Python fundamentals to deployed ML models and applied LLM workflows.",
    level: "Intermediate",
    duration: "10 weeks",
    format: "Live online, 2 sessions / week + weekend lab",
    curriculum: [
      "Python for data & ML",
      "Statistics and model fundamentals",
      "Supervised & unsupervised learning",
      "Deep learning with PyTorch",
      "LLM applications and RAG",
      "Capstone project & deployment",
    ],
    prerequisites: "Basic programming experience (any language).",
    fee: "NPR 25,000",
    nextStartDate: "1 September 2026",
    instructor: "KodeDristi AI Engineering Team",
    outcomes: [
      "Ship a trained model to a working API",
      "Build a retrieval-augmented LLM application",
      "Portfolio-ready capstone project",
    ],
  },
  {
    slug: "full-stack-web-development",
    name: "Full-Stack Web Development",
    summary: "Production practice with Next.js and Laravel — not toy tutorials.",
    level: "Beginner",
    duration: "12 weeks",
    format: "Live online, 3 sessions / week",
    curriculum: [
      "HTML, CSS & modern JavaScript",
      "React & Next.js fundamentals",
      "APIs with Laravel",
      "Databases & authentication",
      "Deployment & CI/CD",
      "Team capstone project",
    ],
    prerequisites: "None — beginner friendly.",
    fee: "NPR 22,000",
    nextStartDate: "15 September 2026",
    instructor: "KodeDristi Web Engineering Team",
    outcomes: [
      "Build and deploy a full-stack application",
      "Working knowledge of Git, CI/CD and testing",
      "A live capstone project for your portfolio",
    ],
  },
  {
    slug: "cloud-devops",
    name: "Cloud & DevOps",
    summary: "Deploy and operate real infrastructure on AWS with CI/CD and monitoring.",
    level: "Intermediate",
    duration: "8 weeks",
    format: "Live online, 2 sessions / week",
    curriculum: [
      "Cloud fundamentals (AWS)",
      "Docker & containers",
      "CI/CD pipelines",
      "Infrastructure as code (Terraform)",
      "Monitoring & incident response",
    ],
    prerequisites: "Comfortable with the command line.",
    fee: "NPR 20,000",
    nextStartDate: "22 September 2026",
    instructor: "KodeDristi Platform Team",
    outcomes: [
      "Provision infrastructure with Terraform",
      "Build a CI/CD pipeline from scratch",
      "Set up monitoring and alerting for a live app",
    ],
  },
  {
    slug: "mobile-app-development",
    name: "Mobile App Development",
    summary: "Flutter from first widget to a published app store listing.",
    level: "Beginner",
    duration: "10 weeks",
    format: "Live online, 2 sessions / week",
    curriculum: [
      "Dart & Flutter fundamentals",
      "State management",
      "APIs & local storage",
      "Native device features",
      "Publishing to app stores",
    ],
    prerequisites: "Basic programming experience recommended.",
    fee: "NPR 20,000",
    nextStartDate: "6 October 2026",
    instructor: "KodeDristi Mobile Team",
    outcomes: [
      "Build a cross-platform app in Flutter",
      "Understand app store submission",
      "A published or store-ready capstone app",
    ],
  },
  {
    slug: "data-analytics",
    name: "Data Analytics",
    summary: "Python, SQL and dashboards that turn raw data into decisions.",
    level: "Beginner",
    duration: "8 weeks",
    format: "Live online, 2 sessions / week",
    curriculum: [
      "Python for analytics (Pandas)",
      "SQL for analysts",
      "Data visualisation",
      "Dashboarding tools",
      "Analytics capstone",
    ],
    prerequisites: "None — beginner friendly.",
    fee: "NPR 18,000",
    nextStartDate: "13 October 2026",
    instructor: "KodeDristi Data Team",
    outcomes: [
      "Query and clean real-world datasets",
      "Build an interactive analytics dashboard",
      "Present findings clearly to stakeholders",
    ],
  },
  {
    slug: "ui-ux-for-product-teams",
    name: "UI/UX for Product Teams",
    summary: "Design systems, product thinking and prototyping for builders.",
    level: "Beginner",
    duration: "6 weeks",
    format: "Live online, 2 sessions / week",
    curriculum: [
      "Product & UX fundamentals",
      "Wireframing & prototyping in Figma",
      "Design systems",
      "Usability testing",
      "Portfolio project",
    ],
    prerequisites: "None — beginner friendly.",
    fee: "NPR 15,000",
    nextStartDate: "20 October 2026",
    instructor: "KodeDristi Design Team",
    outcomes: [
      "Ship a working design system",
      "Run a usability test end-to-end",
      "A polished case study for your portfolio",
    ],
  },
];

export function getCourse(slug: string) {
  return courses.find((c) => c.slug === slug);
}
