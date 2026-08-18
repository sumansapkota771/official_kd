# Kodedristi Site Design Audit Report

## 1. Site Structure Map

### Tech Stack
- **Framework:** Next.js 16.3.0, React 19, TypeScript 5
- **Styling:** Tailwind CSS v4 (with `@theme inline`), CSS custom properties
- **Animation:** Framer Motion + custom CSS keyframes
- **Icons:** Lucide React + HugeIcons React
- **Scroll:** Lenis smooth scroll
- **Theme:** next-themes (dark mode support)
- **Data:** Supabase/PostgreSQL, CMS with hardcoded fallbacks

### Public Pages (12)
| Route | Component | Sections |
|-------|-----------|----------|
| `/` | `app/page.tsx` | Hero, TrustStrip, FlagshipProgram, SolutionsOverview, CoursesOverview, TechDelivery, TeamOverview, FinalCta, Testimonials |
| `/about` | `app/about/page.tsx` | PageHero, Mission/Values cards, Values grid, Leadership+Capabilities, Location/Culture, CTA |
| `/team` | `app/team/page.tsx` | PageHero, Team grid |
| `/careers` | `app/careers/page.tsx` | PageHero, Perks grid, Open Roles list |
| `/contact` | `app/contact/page.tsx` | PageHero, EnquiryForm + Contact details |
| `/solutions` | `app/solutions/page.tsx` | PageHero, Solutions grid |
| `/learn` | `app/learn/page.tsx` | PageHero, Course grid, Enrollment steps, FAQ+CTA |
| `/products` | `app/products/page.tsx` | PageHero, Products grid, Partners strip, FAQ+Reviews, Product talk form |
| `/insights` | `app/insights/page.tsx` | PageHero, Article grid |
| `/partners` | `app/partners/page.tsx` | PageHero, Partners display, Benefits grid, CTA |
| `/hackathon` | `app/hackathon/page.tsx` | PageHero, Highlights strip, Tracks grid, Timeline, CTA |

### Admin Pages (7)
- `/admin/login`, `/admin` (dashboard), `/admin/content`, `/admin/content/[type]`, `/admin/content/[type]/[id]`, `/admin/content/[type]/new`, `/admin/submissions`, `/admin/users`

### Shared Components
- **Site Chrome:** navbar (sticky, shrink-on-scroll), footer (5-col grid), mobile-menu, nav-dropdown
- **UI Primitives:** Button (4 variants), Badge, Card, Container, SectionHeading, PageHero, SpotlightCard, FaqAccordion
- **Motion:** Reveal, RevealGroup, RevealItem, Magnetic, Counter, FirstLoadSplash, SmoothScroll

---

## 2. Functional Systems (DO NOT BREAK)

| System | Files | Dependencies |
|--------|-------|-------------|
| Routing | All `app/*/page.tsx` | Next.js file-based routing |
| Forms | `components/contact/enquiry-form.tsx`, `product-talk-form.tsx` | API routes, validation |
| Auth | `components/auth/sign-in-button.tsx`, `analytics-tracker.tsx`, `cookie-consent.tsx` | HMAC cookies, Google OAuth |
| API Calls | `app/api/**/*` | Supabase, contact submission, analytics |
| Animations | `components/motion/reveal.tsx`, `hero-backdrop.tsx` | Framer Motion, `prefers-reduced-motion` |
| SEO | `layout.tsx` metadata, per-page metadata | Next.js Metadata API |
| Accessibility | Skip link, `aria-label`, `aria-expanded`, `sr-only` classes, `prefers-reduced-motion` | CSS + HTML attributes |
| Responsive | Tailwind breakpoints (`sm:`, `lg:`) | Container max-w-7xl |
| Theme | `components/theme-provider.tsx`, `theme-toggle.tsx` | next-themes |

**Critical:** All class names used by `data-*` attributes, JS hooks, or aria-linked IDs must be preserved or updated in lockstep.

---

## 3. AI-Look Audit — Every Instance Found

### 3.1 Generic System Font Stack
**File:** `app/globals.css:179-180`
```
--font-sans: -apple-system, BlinkMacSystemFont, "SF Pro Display", "SF Pro Text",
  "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
```
**Impact:** HIGH. This is the single biggest AI tell. Every heading and body on the site uses the same system-ui stack. There is zero typographic personality — no display face, no contrast between headings and body. A design agency's website using system fonts undermines credibility.

### 3.2 Uniform Indigo-Blue + Green Two-Hue Palette
**File:** `app/globals.css:13-18`
```
--brand-blue: #2e3192;
--brand-green: #2bb673;
```
Every element across the entire site alternates between these two colors. Blue for primary, green for secondary. No accent color, no warm tone, no third hue to create visual tension. The result: every section looks like a recolor of the same template.

### 3.3 Uniform Rounded Corners + Drop Shadows Everywhere
**File:** `app/globals.css:60-63`
```
--radius-card: 18px;
--radius-control: 999px;
--shadow-card: 0 1px 2px rgba(17, 24, 39, 0.05), 0 12px 24px -16px rgba(17, 24, 39, 0.12);
```
- **Cards:** All use `rounded-card` (18px) — solutions, courses, team, values, perks, tracks, partners, insights, every single card
- **Buttons:** All use `rounded-[var(--radius-control)]` (999px pill) — every button on every page
- **Badges:** All `rounded-full`
- **Numbered steps:** All `rounded-full`
- **Result:** Every interactive and static element has the same curvature. No visual hierarchy between clickable and non-clickable, important and secondary.

### 3.4 Icon-in-a-Circle Feature Grids
**Files:**
- `components/home/solutions-overview.tsx:41-57` — 6 cards, each with icon + title + tagline + CardCue
- `components/home/courses-overview.tsx:36-54` — same pattern
- `app/about/page.tsx:79-88` — 4 value cards, icon + title + description
- `app/careers/page.tsx:40-48` — 4 perk cards, title + description (no icon but same shape)
- `app/hackathon/page.tsx:64-72` — 3 track cards
- `app/partners/page.tsx:59-66` — 3 benefit cards
- `app/learn/page.tsx:81-93` — 4 enrollment step cards with numbered circles

Every section uses identical card dimensions, identical padding (`p-6` or `p-7`), identical text hierarchy (font-semibold title + text-sm text-text-muted description). The rhythm is: icon → title → 1-2 line description → done. Repeat 3-4 times.

### 3.5 Centered Symmetric Hero + Gradient CTA Pattern
**File:** `components/home/hero.tsx:38-143`
The hero is well-designed with the robot backdrop, but the overall pattern across the site is: centered eyebrow → centered headline → centered paragraph → centered CTA buttons. This is repeated on every PageHero usage (`app/about/page.tsx:32-48`, `app/contact/page.tsx:24-31`, `app/careers/page.tsx:23-36`, etc.).

### 3.6 Numbered Step Lists with Circular Badges
**Files:**
- `components/home/tech-delivery.tsx:46-58` — delivery approach, numbered 1-N with `rounded-full bg-brand-blue-light`
- `components/home/tech-delivery.tsx:68-81` — SDLC steps with `rounded-full bg-brand-green-light`
- `app/hackathon/page.tsx:80-92` — timeline with numbered `rounded-full bg-brand-green-light`
- `app/learn/page.tsx:82-93` — enrollment steps with numbered `rounded-full bg-brand-blue-light`

This is a classic AI template pattern: circle with number → title → description. Identical treatment across 4 different sections.

### 3.7 Monogram Avatars (Initials in Circles)
**Files:**
- `components/home/team-overview.tsx:39-44` — `rounded-full bg-brand-blue-light` with initials
- `app/team/page.tsx:37-39` — identical pattern
- `app/about/page.tsx:99-101` — identical pattern

Every person on the site is represented by the same light-blue circle with dark-blue initials. No photos, no variation, no personality.

### 3.8 Uniform Card Hover Effect
**File:** `app/globals.css:310-319`
```css
.card-hover:hover {
  transform: translateY(-4px);
  box-shadow: var(--shadow-elevated);
}
```
Every card on the site that uses `card-hover` does the same 4px upward lift. Solutions, courses, products, articles, insights — all identical. The `SpotlightCard` comment even acknowledges this is a problem ("when every card on a site does the same 4px hop, the page reads as one template repeated") but the fix is just a different name for the same effect.

### 3.9 Generic Dark Mode Colors
**File:** `app/globals.css:86-116`
```
--background: #080b14;
--surface: #111827;
--surface-elevated: #172033;
```
These are the standard near-black blue-grays that every AI-generated dark mode uses. The dark mode is functional but visually indistinguishable from thousands of other sites.

### 3.10 Placeholder-Sounding Copy
- `"One Platform. Every Solution."` — `layout.tsx:15` — vague, says nothing specific
- `"Software and skills, built together"` — `app/about/page.tsx:34` — clever but empty
- `"From a single web app to a full AI-driven platform — pick a starting point, or let us scope the right mix."` — `components/home/solutions-overview.tsx:26` — generic agency speak
- `"A stack chosen for reliability, not resume-padding"` — `components/home/tech-delivery.tsx:27` — slightly better but still vague
- `"In their own words"` — `components/home/testimonials.tsx:22` — generic
- `"Notes from our engineering and delivery teams — practical, not promotional."` — `app/insights/page.tsx:21` — better but could be more specific

### 3.11 No Distinct Visual Identity
The site has no:
- Custom illustration style beyond the hero robot
- Photography or real imagery
- Texture, grain, or material quality
- Distinctive layout rhythm (every section is centered, same padding)
- Brand-specific decorative elements
- Color logic beyond "blue = primary, green = secondary"

### 3.12 Uniform Section Spacing
Almost every section uses `py-20 sm:py-24` or the `.section` class which resolves to `clamp(5.5rem, 3.5rem + 7vw, 8.5rem)`. There is no variation in density — no tight sections next to loose ones, no asymmetric padding. Every section breathes the same amount.

---

## Summary of AI Tells (Priority Order)

1. **System font stack** — no typographic personality at all
2. **Two-hue palette** — blue + green with no accent or warmth
3. **Uniform rounded corners** — 18px cards, 999px buttons, everywhere
4. **Identical card grids** — same structure repeated across 8+ sections
5. **Numbered circle steps** — classic AI template pattern, 4 instances
6. **Monogram avatars** — no real imagery, same blue circle everywhere
7. **Uniform hover effects** — same 4px lift on every card
8. **Centered symmetric layouts** — no asymmetry or visual tension
9. **Generic copy** — vague agency speak, no specificity
10. **No visual identity** — nothing ties the design to what Kodedristi actually is
