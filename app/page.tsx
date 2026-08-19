import { SectionRenderer } from "@/components/section-renderer";
import { OrganizationJsonLd, WebSiteJsonLd } from "@/components/seo/json-ld";

export const revalidate = 3600;

export default async function Home() {
  return (
    <>
      <OrganizationJsonLd />
      <WebSiteJsonLd />
      <SectionRenderer />
    </>
  );
}
