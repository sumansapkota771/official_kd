import type { Metadata } from "next";
import { SectionRenderer } from "@/components/section-renderer";
import { OrganizationJsonLd, WebSiteJsonLd } from "@/components/seo/json-ld";
import { buildPageMetadata } from "@/lib/content/seo";

export const revalidate = 3600;

/**
 * The homepage's own SEO row, falling back to the site-wide title and
 * description the root layout declares.
 */
export async function generateMetadata(): Promise<Metadata> {
  return buildPageMetadata("home", {
    title: "KodeDristi Software — Software Delivery, AI & Courses",
    description:
      "KodeDristi Software Pvt. Ltd. builds web & mobile apps, SaaS products, AI automation and custom software, and runs applied IT courses — #WithYouEveryStep.",
    path: "/",
    absoluteTitle: true,
  });
}

export default async function Home() {
  return (
    <>
      <OrganizationJsonLd />
      <WebSiteJsonLd />
      <SectionRenderer />
    </>
  );
}
