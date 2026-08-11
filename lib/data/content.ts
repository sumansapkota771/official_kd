export const testimonials = [
  {
    quote:
      "KodeDristi rebuilt our booking platform in under three months and it hasn't gone down once since launch. They think like an in-house team, not a vendor.",
    name: "Anjali Rana",
    role: "COO, Himal Logistics",
  },
  {
    quote:
      "The AI automation they built cut our document processing time from two days to under an hour. Genuinely changed how our operations team works.",
    name: "Suresh Bhattarai",
    role: "Founder, Ledger Point",
  },
  {
    quote:
      "Our developers came out of the Full-Stack cohort ready to ship in production, not just follow tutorials. That's the difference with KodeDristi's training.",
    name: "Nisha Gurung",
    role: "Engineering Lead, Everest Fintech",
  },
];

export const techStack = [
  { name: "Next.js" },
  { name: "Laravel" },
  { name: "Python" },
  { name: "Flutter" },
  { name: "React" },
  { name: "JavaScript" },
  { name: "PostgreSQL" },
  { name: "AWS" },
];

export const deliveryApproach = [
  {
    title: "Discovery",
    description:
      "We reverse-engineer your entire system — analyzing architecture, data flow, and dependencies to uncover hidden bottlenecks.",
  },
  {
    title: "Architecture",
    description:
      "We design robust, modular architectures aligned with your business logic — ensuring high performance and long-term scalability.",
  },
  {
    title: "Engineering",
    description:
      "Our engineers build with clean, maintainable code using modern stacks — optimized for speed, security, and seamless integration.",
  },
  {
    title: "Deployment",
    description:
      "We implement CI/CD pipelines and deploy with precision — ensuring smooth rollouts, zero downtime, and production-grade reliability.",
  },
  {
    title: "Evolution",
    description:
      "We continuously monitor, analyze, and refine your system — adapting to scale and evolving with your business needs.",
  },
];

export const leadership = [
  {
    name: "Prabin Kumar Bogati",
    role: "CEO & AI/ML Engineer",
    bio: "Leads product and engineering strategy across KodeDristi's client work, courses and in-house products.",
  },
  {
    name: "Nabin Dhami",
    role: "Senior Software Developer",
    bio: "Oversees delivery quality across every service track, from web apps to AI automation.",
  },
  {
    name: "Suman Sapkota",
    role: "Frontend & UI/UX Designer",
    bio: "Designs the curriculum and instructor bench for KodeDristi's IT courses.",
  },
];

export const stats = [
  { value: "10+", label: "Projects delivered" },
  { value: "4+", label: "Institutional partners" },
];

export const articles = [
  {
    slug: "ai-software-development-in-nepal",
    title: "What AI Software Development Actually Looks Like in Nepal Right Now",
    excerpt:
      "Beyond the hype — where AI is genuinely reducing cost and time for Nepali businesses today, and where it still isn't ready.",
    category: "AI & Automation",
    date: "2026-07-14",
    readTime: "6 min read",
    body: [
      "Most of the AI conversation happening around Nepali businesses right now is still hype — chatbots bolted onto a website with no clear owner, or vague promises of 'AI transformation' with no measurable outcome attached.",
      "The projects that actually work share a pattern: a narrow, well-defined task that used to take a person hours, now handled reliably in minutes. Document parsing, invoice reconciliation, first-pass customer support triage, report summarisation — unglamorous, high-volume, repetitive work.",
      "Where AI still isn't ready for most teams here is anything requiring nuanced judgment without a human in the loop — final approval on financial decisions, unsupervised customer-facing negotiation, or anything where a wrong answer is costly and hard to detect.",
      "Our recommendation to clients evaluating AI: start with a workflow audit, not a technology choice. Find the highest-volume repetitive task first, then decide whether AI, simple automation, or a process change actually solves it.",
    ],
  },
  {
    slug: "custom-software-vs-off-the-shelf",
    title: "Custom Software vs. Off-the-Shelf: A Practical Decision Framework",
    excerpt:
      "A structured way to decide when a bespoke system pays for itself and when it's an expensive way to reinvent a solved problem.",
    category: "Custom Software",
    date: "2026-06-30",
    readTime: "7 min read",
    body: [
      "The default answer to 'should we build custom software?' should usually be no — until a specific set of conditions makes off-the-shelf software actively work against you.",
      "Off-the-shelf makes sense when your workflow is close enough to the standard case that configuration, not code, closes the gap. Custom software earns its cost when your process is genuinely different, when integration between multiple existing systems is the real problem, or when the workflow itself is your competitive advantage.",
      "A useful test: if your team has built more than two spreadsheet workarounds to compensate for what the off-the-shelf tool can't do, that's usually the signal it's time to scope a custom build.",
      "The real risk in custom software isn't cost — it's scope creep and vague requirements. We spend the first phase of every custom engagement mapping the actual operating process before writing a line of code, specifically to avoid that risk.",
    ],
  },
  {
    slug: "choosing-a-cloud-migration-partner",
    title: "Five Questions to Ask Before You Choose a Cloud Migration Partner",
    excerpt:
      "Migrations fail on planning, not technology. Here's what to interrogate before you sign a statement of work.",
    category: "Cloud",
    date: "2026-06-09",
    readTime: "5 min read",
    body: [
      "Cloud migrations rarely fail because of the technology — AWS, Azure and GCP are all mature platforms. They fail because of planning gaps: unclear rollback plans, underestimated data-transfer time, or a big-bang cutover with no staged validation.",
      "Before signing a statement of work, ask any migration partner: What's the rollback plan if something breaks mid-migration? How is downtime during cutover minimised? What does cost after migration actually look like, modelled against your real traffic? Who owns monitoring in the first 30 days post-migration? What's staged versus big-bang in the plan?",
      "A partner who can't answer these specifically — with numbers, not reassurances — is planning to learn on your production environment.",
    ],
  },
  {
    slug: "from-bootcamp-to-production",
    title: "From Bootcamp to Production: What Our Full-Stack Cohort Actually Builds",
    excerpt:
      "A behind-the-scenes look at the capstone projects from our latest Full-Stack Web Development cohort.",
    category: "Learn",
    date: "2026-05-22",
    readTime: "4 min read",
    body: [
      "Every KodeDristi Full-Stack Web Development cohort ends with a team capstone — a real application, deployed, not a local-only tutorial project.",
      "Our most recent cohort shipped a shared expense-tracking app with authentication, a Postgres-backed API, and CI/CD to a live staging environment. Students who came in with zero backend experience left having shipped and debugged something running with real users.",
      "That's the deliberate difference in how we teach: the same production standard our client delivery team holds to is the standard cohort projects are graded against.",
    ],
  },
];

export const partners = [
  { name: "Boxmandu" },
  { name: "Unigo" },
  { name: "Linking Dreams" },
  { name: "Renaissance Library" },
  { name: "Kidzee" },
  { name: "Career Academy" },
  { name: "Aristotle Academy" },
];
