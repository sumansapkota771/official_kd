# KodeDristi Admin Panel — Content Management Guide

## Accessing the Admin Panel

1. Go to `https://official-kd.vercel.app/admin/login`
2. Sign in with the admin email and password (set in `.env.local` as `ADMIN_EMAIL` and `ADMIN_PASSWORD`)
3. You will be redirected to the Dashboard at `/admin`

The admin sidebar has 5 sections: **Dashboard**, **Content**, **Media**, **Submissions**, **Users**.

---

## Dashboard (`/admin`)

Shows analytics overview: total views, unique visitors, today's traffic, last 7 days, a visitor chart for the last 14 days, top pages, and recent visits.

---

## Content Management (`/admin/content`)

The Content page lists all content types grouped by section. Each type shows its item count and published count. Click any type to see its items, or click **Seed all content** to populate the database with default fallback data.

### How to Edit Content

1. Go to **Content** in the sidebar
2. Click on the content type you want to edit (e.g., "Courses", "Team", "Articles")
3. You will see a list of all items of that type
4. Click any item to edit it, or click **New** to create a new item
5. Fill in the fields and click **Save**

### How to Reorder Content

On a content type list page, drag and drop items to reorder them. The order is reflected on the live site.

### How to Publish/Unpublish

Each item has a published toggle. Unpublished items are hidden from the public site but remain in the admin.

### How to Delete Content

Click the delete button on any item. Deleted items are soft-deleted (recoverable).

---

## Content Types Reference

### Site-Wide

#### Navigation (`nav`)
**Singleton** — only one item. Controls the entire site navigation menu.

| Field | Description |
|-------|-------------|
| Nav groups (JSON) | Array of `{ label, href, items: [{ label, href, description }] }` |

The default navigation has 5 groups: Solutions (11 items), Learn (6 items), Company (5 items), Partners (2 items), Products (4 items).

**To edit the navigation:**
1. Go to Content then Navigation
2. Click the "main" item
3. Edit the JSON field — each group has a `label`, `href`, and `items` array
4. Save

#### Page Heroes (`page-hero`)
Controls the hero banner at the top of each page. Each page hero is identified by its slug.

| Field | Required | Description |
|-------|----------|-------------|
| Eyebrow | No | Small label above the title (e.g., "Company", "Learn") |
| Title | Yes | Main heading |
| Description | No | Subtitle text |
| Eyebrow tone | No | Color tone: "blue" or "green" |

**Existing slugs:** `about`, `team`, `careers`, `partners`, `learn`, `insights`, `products`, `solutions`, `contact`, `hackathon`

**To change a page's hero text:**
1. Go to Content then Page heroes
2. Find the page by its slug (e.g., "about")
3. Edit the title, description, or eyebrow
4. Save

---

### Homepage

#### Homepage Sections (`home-section`)
Controls which sections appear on the homepage and their order.

| Field | Required | Description |
|-------|----------|-------------|
| Section type | Yes | Which section component to render |
| Display name | Yes | Label shown in admin |
| Visible on page | No | Toggle to show or hide this section |

**Section types:** hero, trust, flagship, solutions, courses, tech, team, cta, testimonials

**To hide a section from the homepage:**
1. Go to Content then Homepage sections
2. Find the section (e.g., "Testimonials")
3. Uncheck "Visible on page"
4. Save

> Homepage sections no longer carry background images. The scroll-driven
> background system ("Cinematic backgrounds" / visual chapters) has been
> removed; each section now paints its own background from the theme.

#### Home Hero (`home-hero`)
**Singleton** — controls the main hero section on the homepage.

| Field | Required | Description |
|-------|----------|-------------|
| Eyebrow | No | Small label (e.g., "#WithYouEveryStep") |
| Title | Yes | Main heading |
| Paragraph | No | Body text |
| Primary button label | No | CTA button text |
| Primary button link | No | CTA button URL |
| Secondary button label | No | Second CTA text |
| Secondary button link | No | Second CTA URL |
| Tertiary link label | No | Text link below buttons |
| Tertiary link href | No | Text link URL |

#### Trust Strip (`home-trust`)
**Singleton** — the thin banner below the hero.

| Field | Required | Description |
|-------|----------|-------------|
| Trust text | Yes | The text shown (e.g., "Trusted by growing businesses...") |

#### Flagship Banner (`home-flagship`)
**Singleton** — promotes the flagship program (e.g., National AI Hackathon).

| Field | Required | Description |
|-------|----------|-------------|
| Badge | No | Small label above title |
| Title | Yes | Main heading |
| Description | No | Body text |
| Highlight point 1 | No | Feature bullet |
| Highlight point 2 | No | Feature bullet |
| Button label | No | CTA text |
| Button link | No | CTA URL |

#### Final CTA (`home-final-cta`)
**Singleton** — the call-to-action banner at the bottom of the homepage.

| Field | Required | Description |
|-------|----------|-------------|
| Title | Yes | Main heading |
| Description | No | Body text |
| Primary button label | No | CTA text |
| Primary button link | No | CTA URL |
| Secondary button label | No | Second CTA text |
| Secondary button link | No | Second CTA URL |

#### Stats (`stat`)
The numbers shown in the trust strip area.

| Field | Required | Description |
|-------|----------|-------------|
| Value | Yes | Number (e.g., "10+", "50+") |
| Label | Yes | Description (e.g., "Projects delivered") |

#### Section Headings (`section-heading`)
Controls the title and eyebrow for each homepage section.

| Field | Required | Description |
|-------|----------|-------------|
| Eyebrow | No | Small label above title |
| Title | Yes | Section heading |
| Description | No | Subtitle |
| Eyebrow tone | No | "blue" or "green" |

**Existing slugs:** `solutions-overview`, `courses-overview`, `tech-delivery`, `team-overview`, `testimonials`

#### Solutions (`solution`)
Each solution card on the Solutions overview section.

| Field | Required | Description |
|-------|----------|-------------|
| Name | Yes | Solution name |
| Tagline | Yes | Short description |
| Icon | No | Icon identifier |
| Accent color | No | "blue" or "green" |
| Problem statement | No | The problem this solves |
| Approach | No | How you solve it |
| Deliverables | No | One per line |
| Timeline | No | Estimated delivery time |
| Tags | No | One per line |
| Proof | No | Evidence / case study snippet |

#### Courses (`course`)
Each course card on the Courses overview and the Learn page.

| Field | Required | Description |
|-------|----------|-------------|
| Name | Yes | Course name |
| Summary | No | Short description |
| Level | No | Beginner, Intermediate, or Advanced |
| Duration | No | e.g., "12 weeks" |
| Format | No | e.g., "Live cohort" |
| Curriculum | No | One topic per line |
| Prerequisites | No | What students need to know |
| Fee | No | e.g., "NPR 25,000" |
| Next start date | No | e.g., "2026-09-01" |
| Instructor | No | Instructor name |
| Outcomes | No | One per line |

#### Tech Stack (`tech`)
Technology names shown in the Tech delivery section.

| Field | Required | Description |
|-------|----------|-------------|
| Name | Yes | Technology name (e.g., "React", "Node.js") |

#### Delivery Steps (`delivery-step`)
Steps shown in the Tech delivery section.

| Field | Required | Description |
|-------|----------|-------------|
| Title | Yes | Step name |
| Description | No | Step details |

#### Team Members (`team-member`)
People shown on the Team page and homepage team section.

| Field | Required | Description |
|-------|----------|-------------|
| Name | Yes | Full name |
| Role | No | Job title |
| Bio | No | Short biography |
| Show in leadership | No | Check to show in leadership sections |

#### Testimonials (`testimonial`)
Client quotes shown on the homepage.

| Field | Required | Description |
|-------|----------|-------------|
| Quote | Yes | Client testimonial text |
| Name | Yes | Client name |
| Role | No | Client title / company |
| Video URL | No | Vertical 9:16 MP4 clip |
| Video poster image | No | Frame shown before video loads |

---

### Learn

#### Enrollment Steps (`process-step`)
Steps shown on the Learn page enrollment flow.

| Field | Required | Description |
|-------|----------|-------------|
| Title | Yes | Step name |
| Description | No | Step details |

#### FAQs (`faq`)
Frequently asked questions shown on the Learn and Products pages.

| Field | Required | Description |
|-------|----------|-------------|
| Question | Yes | The question |
| Answer | No | The answer |
| Section | No | "learn" or "products" |

---

### About

#### Company Values (`value`)
Values shown on the About page.

| Field | Required | Description |
|-------|----------|-------------|
| Title | Yes | Value name |
| Description | No | What this value means |

#### Capabilities (`capability`)
Capabilities listed on the About page.

| Field | Required | Description |
|-------|----------|-------------|
| Capability | Yes | e.g., "Web & mobile product engineering" |

---

### Careers

#### Perks (`perk`)
Benefits shown on the Careers page.

| Field | Required | Description |
|-------|----------|-------------|
| Title | Yes | Perk name |
| Description | No | Details |

#### Open Roles (`role`)
Job listings on the Careers page.

| Field | Required | Description |
|-------|----------|-------------|
| Title | Yes | Job title |
| Type / location | No | e.g., "Full-time, Kathmandu" |

---

### Insights

#### Articles (`article`)
Blog posts shown on the News and Insights page.

| Field | Required | Description |
|-------|----------|-------------|
| Title | Yes | Article title |
| Excerpt | No | Short preview |
| Category | No | e.g., "AI", "Engineering" |
| Date | No | Publication date (YYYY-MM-DD) |
| Read time | No | e.g., "5 min read" |
| Body | No | One paragraph per line |

---

### Contact

#### Contact Details (`contact-detail`)
Information shown on the Contact page.

| Field | Required | Description |
|-------|----------|-------------|
| Icon | No | Icon identifier |
| Label | Yes | e.g., "Phone", "Email" |
| Value | Yes | e.g., "+977 9842863398" |
| Link | No | tel:, mailto:, or URL |

---

### Partners

#### Partners (`partner`)
Partner logos/names shown on the Partners page.

| Field | Required | Description |
|-------|----------|-------------|
| Name | Yes | Partner name |

#### Partner Benefits (`partner-benefit`)
Benefits listed on the Partners page.

| Field | Required | Description |
|-------|----------|-------------|
| Title | Yes | Benefit name |
| Description | No | Details |

---

### Products

#### Products (`product`)
Product cards on the Products page.

| Field | Required | Description |
|-------|----------|-------------|
| Name | Yes | Product name |
| Tagline | Yes | Short description |
| Icon | No | Icon identifier |
| Accent color | No | "blue" or "green" |
| Description | No | Full description |
| Features | No | One per line |
| Audience | No | Who it is for |

---

### Hackathon

#### Highlights (`hackathon-highlight`)
Feature highlights on the Hackathon page.

| Field | Required | Description |
|-------|----------|-------------|
| Icon | No | Icon identifier |
| Label | Yes | e.g., "Teams of 2-4" |

#### Tracks (`hackathon-track`)
Competition tracks.

| Field | Required | Description |
|-------|----------|-------------|
| Title | Yes | Track name |
| Description | No | Track details |

#### Timeline (`hackathon-timeline`)
Event timeline steps.

| Field | Required | Description |
|-------|----------|-------------|
| Label | Yes | Step name (e.g., "Registrations open") |
| Detail | No | Date or additional info |

---


---

## Media Library (`/admin/media`)

The Media library shows all uploaded images in a grid.

### Upload an Image
1. Click **Upload image** in the top right
2. Select an image (JPEG, PNG, WebP, GIF, or SVG — max 5 MB)
3. The image appears in the grid

### Edit Image Metadata
1. Click any image in the grid
2. Edit the **Alt text** (important for accessibility and SEO)
3. Edit the **Caption** (optional)
4. Click **Save**

### Delete an Image
1. Click any image in the grid
2. Click **Delete**
3. Confirm

### Filter by Type
Use the dropdown to filter by JPEG, PNG, WebP, GIF, or SVG.

---

## Submissions (`/admin/submissions`)

Shows all form submissions from the Contact page and other forms. Each submission shows the section it came from and the submitted data.

---

## Users (`/admin/users`)

Lists all user accounts with avatar, name, email, join date, last sign-in, and course enrollments.

---

## Quick Reference: Common Tasks

| Task | Where to go |
|------|-------------|
| Change the homepage hero text | Content then Home hero |
| Add a new course | Content then Courses then New |
| Edit team member info | Content then Team then click member |
| Change a page's heading | Content then Page heroes then find page slug |
| Add a blog article | Content then Insights / Articles then New |
| Change the navigation menu | Content then Navigation then "main" |
| Hide a homepage section | Content then Homepage sections then uncheck "Visible on page" |
| Change a background image | Content then Homepage sections then upload image in "Background image (desktop)" |
| Add a background to any section | Content then Homepage sections then set bgMode to "image" and upload image |
| Make a section transparent | Content then Homepage sections then set "Background mode" to "image" |
| Upload an image for use in content | Media then Upload image |
| View contact form submissions | Submissions |
| Seed default content into DB | Content then "Seed all content" button |

---

## Field Types Reference

| Field type | What it means |
|------------|---------------|
| `text` | Single-line text input |
| `textarea` | Multi-line text input |
| `url` | URL input (validated) |
| `select` | Dropdown with fixed options |
| `check` | Checkbox (true/false) |
| `list` | Multi-line text area — one item per line, stored as a JSON array |
| `json` | Raw JSON editor |
| `icon` | Icon picker (hugeicons-react) |
| `tone` | Color tone selector ("blue" or "green") |
| `image` | Image upload or URL input — returns a URL like `/uploads/filename.jpg` |

---

## Tips

- **Singletons** (nav, home-hero, home-trust, home-flagship, home-final-cta) only have one item. Click it to edit.
- **Non-singletons** (courses, solutions, team, articles, etc.) can have multiple items. Use New to add more.
- Changes take effect immediately on the live site (force-dynamic rendering, 30-second cache TTL).
- If the database is down, the site automatically falls back to hardcoded default data.
- The "Seed all content" button populates the database with defaults. It does not overwrite existing items (uses ON CONFLICT DO NOTHING).
