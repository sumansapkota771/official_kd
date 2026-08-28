import type { Metadata } from "next";
import { getPageSeo } from "@/lib/content/resolvers";

export const SITE_URL = "https://official-kd.vercel.app";

/**
 * Builds a page's `<head>` from its CMS row, falling back to what the page
 * already declared.
 *
 * Every field is a fallback rather than an override in the other direction:
 * a page that nobody has touched in the admin keeps exactly the title and
 * description it shipped with, and filling one field in the admin changes
 * that one field only. That is what makes it safe to seed a row for every
 * page up front — thirteen empty rows change nothing until someone types
 * into them.
 *
 * `robots` is only set when the admin has ticked "hide from search engines".
 * Emitting `index, follow` explicitly the rest of the time would override
 * the site-wide default for no reason, and quietly break the day that
 * default changes.
 */
export async function buildPageMetadata(
  page: string,
  defaults: {
    title: string;
    description: string;
    path: string;
    /**
     * Set for the homepage, whose title is the whole site's title. Interior
     * pages want the root layout's "%s — KodeDristi Software" template
     * wrapped around theirs; the homepage would come out saying the company
     * name twice.
     */
    absoluteTitle?: boolean;
  }
): Promise<Metadata> {
  let seo: Awaited<ReturnType<typeof getPageSeo>> = null;
  try {
    seo = await getPageSeo(page);
  } catch {
    // Database unreachable — the shipped title is still a correct title.
  }

  const title = pick(seo?.seoTitle) ?? defaults.title;
  const description = pick(seo?.metaDescription) ?? defaults.description;
  const canonical = pick(seo?.canonicalUrl) ?? defaults.path;
  const ogImage = pick(seo?.ogImage);

  const metadata: Metadata = {
    title: defaults.absoluteTitle ? { absolute: title } : title,
    description,
    alternates: { canonical },
    openGraph: {
      title: pick(seo?.ogTitle) ?? title,
      description: pick(seo?.ogDescription) ?? description,
      url: canonical,
      type: "website",
      ...(ogImage
        ? { images: [{ url: ogImage, alt: pick(seo?.ogImageAlt) ?? title }] }
        : {}),
    },
  };

  if (seo?.noIndex) {
    metadata.robots = { index: false, follow: true };
  }

  return metadata;
}

function pick(value?: string): string | undefined {
  const trimmed = value?.trim();
  return trimmed ? trimmed : undefined;
}
