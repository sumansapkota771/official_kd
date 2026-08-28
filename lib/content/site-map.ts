/**
 * The one place that records what the website is made of.
 *
 * Every visible band on the site is a *module*: a named piece of the page
 * plus the list of content types that fill it. The admin is generated from
 * this — the homepage screen, the per-page screens, the "Edit" links — so
 * adding a section to the site means adding an entry here rather than
 * writing another admin screen by hand.
 *
 * It holds no data and touches no database. It is the map from
 *
 *     frontend section  <->  CMS content type  <->  admin editor route
 *
 * and nothing else, which is what keeps it cheap enough to import into every
 * admin page and safe to render when Postgres is unreachable.
 */

import { getSchema } from "@/lib/content/schemas";

/** One editable content type inside a module. */
export type ModulePart = {
  type: string;
  /** What this part is called *within this module* — "Heading", "Cards",
   *  "Slides". The schema's own label is what it is called globally, which
   *  is often too generic to tell two parts of one section apart. */
  label: string;
  /** For `section-heading` and `page-hero`, which row of that type this
   *  module uses. Turns the link into a direct edit rather than a list. */
  slug?: string;
  /** One line saying what editing this part changes on the page. */
  hint?: string;
};

export type SiteModule = {
  /** Matches the `type` on the module's `home-section` row where it has
   *  one, so the admin can line the two up. */
  key: string;
  label: string;
  description: string;
  /** Where this band sits on the live site, for the Preview link. */
  preview: string;
  parts: ModulePart[];
  /**
   * Sections whose design is deliberately frozen. The admin still edits
   * their content; it just says so, so nobody "tidies up" a section that was
   * signed off as-is.
   */
  locked?: boolean;
};

export type SitePage = {
  /** Slug used by `page-hero` and `page-seo` rows for this page. */
  key: string;
  label: string;
  path: string;
  description: string;
  /** True when the page is assembled from `home-section` rows rather than a
   *  fixed list of modules. */
  isHomepage?: boolean;
  modules: SiteModule[];
};

// ---------------------------------------------------------------------------
// Homepage
// ---------------------------------------------------------------------------

/**
 * The homepage, section by section, keyed by the `home-section` row type.
 *
 * The *order* here is only the shipped default — the live order comes from
 * the `home-section` rows, which the admin can drag. This map answers "what
 * is inside this section", not "where does it go".
 */
export const HOMEPAGE_MODULES: SiteModule[] = [
  {
    key: "hero",
    label: "Hero",
    description: "The opening banner: headline, paragraph, three buttons and the rotating slides beneath them.",
    preview: "/",
    parts: [
      { type: "home-hero", label: "Headline & buttons", hint: "Eyebrow, title, paragraph and the three call-to-action buttons." },
      { type: "home-hero-slide", label: "Slides", hint: "The rotating panels on the rail at the foot of the hero." },
    ],
  },
  {
    key: "trust",
    label: "Trust strip",
    description: "The one-line trust statement and the numbers beside it.",
    preview: "/",
    parts: [
      { type: "home-trust", label: "Trust line", hint: "The sentence above the numbers." },
      { type: "stat", label: "Numbers", hint: "Each figure and its label." },
    ],
  },
  {
    key: "flagship",
    label: "Flagship program",
    description: "The National AI Hackathon promo band.",
    preview: "/",
    parts: [
      { type: "home-flagship", label: "Copy & button", hint: "Badge, title, description, both bullet points and the button." },
    ],
  },
  {
    key: "gallery",
    label: "Galleries",
    description: "Photo collections shown two-up, each linking to its own gallery page.",
    preview: "/",
    parts: [
      { type: "section-heading", slug: "gallery", label: "Heading", hint: "Eyebrow, title and description above the cards." },
      { type: "gallery", label: "Collections", hint: "Each collection's name, description, cover image and button label." },
      { type: "gallery-photo", label: "Photos", hint: "The pictures inside each collection." },
    ],
  },
  {
    key: "hackathon-partners",
    label: "Trusted By Leading Organizations",
    description: "The logo wall of institutions, sponsors and community partners.",
    preview: "/",
    parts: [
      { type: "section-heading", slug: "hackathon-partners", label: "Heading", hint: "Eyebrow, title and description above the logo cards." },
      { type: "hackathon-partner", label: "Organizations", hint: "Each organisation's name, logo, tier and website." },
    ],
  },
  {
    key: "academia",
    label: "Industry-Academia Partnership",
    description: "Signed MOUs with universities and colleges.",
    preview: "/",
    locked: true,
    parts: [
      { type: "section-heading", slug: "academia-partnership", label: "Heading", hint: "Eyebrow, title and description above the agreements." },
      { type: "mou-partnership", label: "Agreements", hint: "Each institution, its photo, caption and signing date." },
    ],
  },
  {
    key: "lagani",
    label: "Dristi Lagani",
    description: "The investment programme promo band.",
    preview: "/",
    parts: [
      { type: "home-lagani", label: "Copy & button", hint: "Badge, title, description, both bullet points and the button." },
    ],
  },
  {
    key: "projects",
    label: "Remarkable projects",
    description: "The case-study grid.",
    preview: "/",
    parts: [
      { type: "section-heading", slug: "projects-overview", label: "Heading", hint: "Eyebrow, title and description above the grid." },
      { type: "project", label: "Projects", hint: "Every case study — also the source of /projects and each project page." },
    ],
  },
  {
    key: "solutions",
    label: "Solutions overview",
    description: "The service cards.",
    preview: "/",
    parts: [
      { type: "section-heading", slug: "solutions-overview", label: "Heading", hint: "Eyebrow, title and description above the cards." },
      { type: "solution", label: "Solutions", hint: "Each service — also the source of /solutions and the nav dropdown." },
    ],
  },
  {
    key: "courses",
    label: "Courses overview",
    description: "The course cards.",
    preview: "/",
    parts: [
      { type: "section-heading", slug: "courses-overview", label: "Heading", hint: "Eyebrow, title and description above the cards." },
      { type: "course", label: "Courses", hint: "Each programme — also the source of /learn." },
    ],
  },
  {
    key: "tech",
    label: "Tech & delivery",
    description: "The technology list and the delivery steps beside it.",
    preview: "/",
    parts: [
      { type: "section-heading", slug: "tech-delivery", label: "Heading", hint: "Eyebrow, title and description." },
      { type: "tech", label: "Technologies", hint: "The names in the stack list." },
      { type: "delivery-step", label: "Delivery steps", hint: "Each step's title and description." },
    ],
  },
  {
    key: "team",
    label: "Team overview",
    description: "The leadership cards.",
    preview: "/",
    parts: [
      { type: "section-heading", slug: "team-overview", label: "Heading", hint: "Eyebrow, title and description above the cards." },
      { type: "team-member", label: "People", hint: "Everyone on the team. Tick 'Leadership' to show someone here as well as on /team." },
    ],
  },
  {
    key: "cta",
    label: "Final call to action",
    description: "The closing band with both buttons.",
    preview: "/",
    parts: [
      { type: "home-final-cta", label: "Copy & buttons", hint: "Title, description and both buttons." },
    ],
  },
  {
    key: "testimonials",
    label: "Testimonials",
    description: "The client quote rail.",
    preview: "/",
    parts: [
      { type: "section-heading", slug: "testimonials", label: "Heading", hint: "Eyebrow, title and description above the rail." },
      { type: "testimonial", label: "Quotes", hint: "Each quote, who said it, and the optional video." },
    ],
  },
];

const homepageByKey = new Map(HOMEPAGE_MODULES.map((m) => [m.key, m]));

export function getHomepageModule(key: string): SiteModule | null {
  return homepageByKey.get(key) ?? null;
}

// ---------------------------------------------------------------------------
// The rest of the site
// ---------------------------------------------------------------------------

/** Every interior page opens with the same masthead, so the part that edits
 *  it is written once here rather than thirteen times below. */
function hero(slug: string): ModulePart {
  return {
    type: "page-hero",
    slug,
    label: "Page hero",
    hint: "The eyebrow, headline and standfirst at the top of the page.",
  };
}

export const SITE_PAGES: SitePage[] = [
  {
    key: "home",
    label: "Homepage",
    path: "/",
    description: "Assembled from the homepage sections, in the order set there.",
    isHomepage: true,
    modules: HOMEPAGE_MODULES,
  },
  {
    key: "about",
    label: "About",
    path: "/about",
    description: "Who the company is, what it values and what it can do.",
    modules: [
      {
        key: "about-hero",
        label: "Hero",
        description: "The masthead.",
        preview: "/about",
        parts: [hero("about")],
      },
      {
        key: "about-values",
        label: "What we value",
        description: "The values cards.",
        preview: "/about",
        parts: [{ type: "value", label: "Values", hint: "Each value's title and description." }],
      },
      {
        key: "about-leadership",
        label: "Leadership",
        description: "Who runs the company.",
        preview: "/about",
        parts: [{ type: "team-member", label: "People", hint: "Tick 'Leadership' on a person to show them here." }],
      },
      {
        key: "about-capabilities",
        label: "Capabilities",
        description: "What the team is built to do.",
        preview: "/about",
        parts: [{ type: "capability", label: "Capabilities", hint: "One line each." }],
      },
    ],
  },
  {
    key: "team",
    label: "Team",
    path: "/team",
    description: "The full bench.",
    modules: [
      { key: "team-hero", label: "Hero", description: "The masthead.", preview: "/team", parts: [hero("team")] },
      {
        key: "team-people",
        label: "People",
        description: "Every team member's card.",
        preview: "/team",
        parts: [{ type: "team-member", label: "People", hint: "Name, role, bio and both portraits." }],
      },
    ],
  },
  {
    key: "careers",
    label: "Careers",
    path: "/careers",
    description: "Why to join and what is open.",
    modules: [
      { key: "careers-hero", label: "Hero", description: "The masthead.", preview: "/careers", parts: [hero("careers")] },
      {
        key: "careers-perks",
        label: "Why join",
        description: "The perk cards.",
        preview: "/careers",
        parts: [{ type: "perk", label: "Perks", hint: "Each perk's title and description." }],
      },
      {
        key: "careers-roles",
        label: "Open roles",
        description: "Current openings.",
        preview: "/careers",
        parts: [{ type: "role", label: "Roles", hint: "Job title and the employment type line under it." }],
      },
    ],
  },
  {
    key: "solutions",
    label: "Solutions",
    path: "/solutions",
    description: "The service catalogue and every service's own page.",
    modules: [
      { key: "solutions-hero", label: "Hero", description: "The masthead.", preview: "/solutions", parts: [hero("solutions")] },
      {
        key: "solutions-list",
        label: "Solutions",
        description: "Each service card and the page behind it.",
        preview: "/solutions",
        parts: [{ type: "solution", label: "Solutions", hint: "Problem, approach, deliverables, timeline, tags and proof." }],
      },
    ],
  },
  {
    key: "products",
    label: "Products",
    path: "/products",
    description: "In-house software, its reviews and its questions.",
    modules: [
      { key: "products-hero", label: "Hero", description: "The masthead.", preview: "/products", parts: [hero("products")] },
      {
        key: "products-list",
        label: "Products",
        description: "Each product card and the page behind it.",
        preview: "/products",
        parts: [{ type: "product", label: "Products", hint: "Name, tagline, description, features and audience." }],
      },
      {
        key: "products-trust",
        label: "Trusted organizations",
        description: "The logo strip partway down the page.",
        preview: "/products",
        parts: [{ type: "partner", label: "Organizations", hint: "Name, logo and website for each." }],
      },
      {
        key: "products-faq",
        label: "Questions & reviews",
        description: "The FAQ column and the quotes beside it.",
        preview: "/products",
        parts: [
          { type: "faq", label: "Questions", hint: "Set a question's group to 'products' to show it here." },
          { type: "testimonial", label: "Reviews", hint: "The same quotes the homepage rail uses." },
        ],
      },
    ],
  },
  {
    key: "projects",
    label: "Projects / Case studies",
    path: "/projects",
    description: "Every case study and the page behind each one.",
    modules: [
      { key: "projects-hero", label: "Hero", description: "The masthead.", preview: "/projects", parts: [hero("projects")] },
      {
        key: "projects-list",
        label: "Case studies",
        description: "Each project's card and full study.",
        preview: "/projects",
        parts: [{ type: "project", label: "Projects", hint: "Client, category, gallery, the six narrative chapters, stack and result." }],
      },
    ],
  },
  {
    key: "learn",
    label: "Learn",
    path: "/learn",
    description: "The course catalogue, how enrolment works and the FAQ.",
    modules: [
      { key: "learn-hero", label: "Hero", description: "The masthead.", preview: "/learn", parts: [hero("learn")] },
      {
        key: "learn-courses",
        label: "Courses",
        description: "The catalogue and each course's page.",
        preview: "/learn",
        parts: [{ type: "course", label: "Courses", hint: "Level, duration, format, curriculum, fee, dates and outcomes." }],
      },
      {
        key: "learn-process",
        label: "How enrolment works",
        description: "The numbered steps.",
        preview: "/learn",
        parts: [{ type: "process-step", label: "Steps", hint: "Each step's title and description." }],
      },
      {
        key: "learn-faq",
        label: "Common questions",
        description: "The accordion.",
        preview: "/learn",
        parts: [{ type: "faq", label: "Questions", hint: "Set a question's group to 'learn' to show it here." }],
      },
    ],
  },
  {
    key: "insights",
    label: "Blog / Insights",
    path: "/insights",
    description: "Articles, and the page each one gets. /blog redirects here.",
    modules: [
      { key: "insights-hero", label: "Hero", description: "The masthead.", preview: "/insights", parts: [hero("insights")] },
      {
        key: "insights-articles",
        label: "Articles",
        description: "Each post's card and page.",
        preview: "/insights",
        parts: [{ type: "article", label: "Articles", hint: "Title, excerpt, image, category, date, read time and body." }],
      },
    ],
  },
  {
    key: "partners",
    label: "Partners",
    path: "/partners",
    description: "Who the company works with and what partnership involves.",
    modules: [
      { key: "partners-hero", label: "Hero", description: "The masthead.", preview: "/partners", parts: [hero("partners")] },
      {
        key: "partners-list",
        label: "Trusted By Leading Organizations",
        description: "The logo wall.",
        preview: "/partners#institutional",
        parts: [{ type: "partner", label: "Organizations", hint: "Name, logo, alt text and website for each." }],
      },
      {
        key: "partners-benefits",
        label: "What partnership looks like",
        description: "The benefit cards.",
        preview: "/partners#become-a-partner",
        parts: [{ type: "partner-benefit", label: "Benefits", hint: "Each benefit's title and description." }],
      },
    ],
  },
  {
    key: "hackathon",
    label: "Hackathon",
    path: "/hackathon",
    description: "The National AI Hackathon page.",
    modules: [
      { key: "hackathon-hero", label: "Hero", description: "The masthead.", preview: "/hackathon", parts: [hero("hackathon")] },
      {
        key: "hackathon-highlights",
        label: "Highlights",
        description: "The strip under the masthead.",
        preview: "/hackathon",
        parts: [{ type: "hackathon-highlight", label: "Highlights", hint: "An icon and a label each." }],
      },
      {
        key: "hackathon-tracks",
        label: "Tracks",
        description: "The ways to compete.",
        preview: "/hackathon#tracks",
        parts: [{ type: "hackathon-track", label: "Tracks", hint: "Each track's title and description." }],
      },
      {
        key: "hackathon-timeline",
        label: "Schedule",
        description: "How the weekend runs.",
        preview: "/hackathon",
        parts: [{ type: "hackathon-timeline", label: "Timeline", hint: "Each entry's label and detail." }],
      },
      {
        key: "hackathon-background",
        label: "Background images",
        description: "The rotating photographs behind the banner.",
        preview: "/hackathon",
        parts: [
          { type: "hackathon-slideshow-settings", label: "Rotation", hint: "How long each image holds, and whether it rotates at all." },
          { type: "hackathon-slideshow-image", label: "Images", hint: "Desktop and mobile image, order, text colour and wash." },
        ],
      },
    ],
  },
  {
    key: "dristi-lagani",
    label: "Dristi Lagani",
    path: "/dristi-lagani",
    description: "The investment programme page.",
    modules: [
      { key: "lagani-hero", label: "Hero", description: "The masthead.", preview: "/dristi-lagani", parts: [hero("dristi-lagani")] },
      {
        key: "lagani-highlights",
        label: "Highlights",
        description: "The strip under the masthead.",
        preview: "/dristi-lagani",
        parts: [{ type: "lagani-highlight", label: "Highlights", hint: "An icon and a label each." }],
      },
      {
        key: "lagani-focus",
        label: "Focus areas",
        description: "What the programme backs.",
        preview: "/dristi-lagani#focus",
        parts: [{ type: "lagani-focus", label: "Focus areas", hint: "Each area's title and description." }],
      },
      {
        key: "lagani-process",
        label: "How funding works",
        description: "The numbered process.",
        preview: "/dristi-lagani",
        parts: [{ type: "lagani-process", label: "Steps", hint: "Each step's label and detail." }],
      },
      {
        key: "lagani-portfolio",
        label: "Portfolio",
        description: "Companies backed so far.",
        preview: "/dristi-lagani",
        parts: [
          { type: "section-heading", slug: "lagani-portfolio", label: "Heading", hint: "Eyebrow, title and description above the tiles." },
          { type: "lagani-portfolio", label: "Companies", hint: "Name, logo, stage and website." },
        ],
      },
      {
        key: "lagani-background",
        label: "Background images",
        description: "The rotating photographs behind the banner.",
        preview: "/dristi-lagani",
        parts: [
          { type: "lagani-slideshow-settings", label: "Rotation", hint: "How long each image holds, and whether it rotates at all." },
          { type: "lagani-slideshow-image", label: "Images", hint: "Desktop and mobile image, order, text colour and wash." },
        ],
      },
    ],
  },
  {
    key: "contact",
    label: "Contact",
    path: "/contact",
    description: "The enquiry form and the details beside it.",
    modules: [
      { key: "contact-hero", label: "Hero", description: "The masthead.", preview: "/contact", parts: [hero("contact")] },
      {
        key: "contact-details",
        label: "Contact details",
        description: "Phone, email, location and office hours.",
        preview: "/contact",
        parts: [
          { type: "site-settings", label: "Company details", hint: "Phone, email, address and office hours — also used by the footer." },
          { type: "contact-detail", label: "Detail cards", hint: "The cards beside the form, in order." },
        ],
      },
    ],
  },
  {
    key: "gallery",
    label: "Gallery pages",
    path: "/gallery",
    description: "Each collection's own page at /gallery/<name>.",
    modules: [
      {
        key: "gallery-collections",
        label: "Collections",
        description: "The collections and their photographs.",
        preview: "/",
        parts: [
          { type: "gallery", label: "Collections", hint: "Name, description, cover image and button label." },
          { type: "gallery-photo", label: "Photos", hint: "Each photo's image, title, description and which collection it belongs to." },
        ],
      },
    ],
  },
];

const pageByKey = new Map(SITE_PAGES.map((p) => [p.key, p]));

export function getSitePage(key: string): SitePage | null {
  return pageByKey.get(key) ?? null;
}

// ---------------------------------------------------------------------------
// Admin routing
// ---------------------------------------------------------------------------

/**
 * Where a part's "Edit" button goes.
 *
 * A singleton has exactly one row, so it opens straight into its form. A
 * part pinned to a `slug` — a section heading, a page hero — resolves that
 * slug to its row on the server and opens the same form. Everything else is
 * a list, because "which one" is a real question there.
 *
 * The slug route is a redirect rather than a lookup here so that this file
 * stays free of database access: a link can be rendered without waiting on
 * Postgres, and the one query happens only when someone clicks it.
 */
export function editHref(part: ModulePart): string {
  if (part.slug) return `/admin/content/${part.type}/slug/${part.slug}`;
  return `/admin/content/${part.type}`;
}

/** Whether the part's Edit link lands on a form (rather than a list). */
export function partOpensEditor(part: ModulePart): boolean {
  if (part.slug) return true;
  try {
    return Boolean(getSchema(part.type).isSingleton);
  } catch {
    return false;
  }
}

/** How many rows a list-style part holds, for the count badge. Singletons
 *  and slug-pinned parts return null — "1 of 1" is noise. */
export function partIsCountable(part: ModulePart): boolean {
  return !partOpensEditor(part);
}
