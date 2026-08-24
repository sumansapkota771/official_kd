import type { Metadata } from "next";
import { PageHero } from "@/components/ui/page-hero";
import { Container } from "@/components/ui/container";
import { EnquiryForm } from "@/components/contact/enquiry-form";
import { getContactDetails } from "@/lib/content/resolvers";
import { getPageHero } from "@/lib/content/resolvers";

export const revalidate = 3600;

export const metadata: Metadata = {
  title: "Contact",
  description:
    "Start a project, apply for a course, or propose a partnership with KodeDristi Software.",
};

export default async function ContactPage() {
  const [contactDetails, hero] = await Promise.all([
    getContactDetails(),
    getPageHero("contact"),
  ]);

  return (
    <>
      <PageHero
        eyebrow={hero?.eyebrow ?? "Contact"}
        title={hero?.title ?? "Let's talk about what you're building"}
        description={
          hero?.description ??
          "Whether it's a project, a course seat, or a partnership — tell us the details and we'll follow up within one business day."
        }
      />

      <section className="section">
        <Container className="grid gap-8 lg:grid-cols-[1fr_320px]">
          <EnquiryForm />

          <aside className="flex flex-col gap-3">
            {contactDetails.map((detail) => (
              <div key={detail.label} className="flex items-start gap-2.5 card p-4">
                <detail.icon className="h-5 w-5 shrink-0 text-link" />
                <div>
                  <p className="text-[11px] font-medium uppercase tracking-wider text-text-muted">{detail.label}</p>
                  {detail.href ? (
                    <a href={detail.href} className="text-sm font-semibold text-text-primary hover:text-link">
                      {detail.value}
                    </a>
                  ) : (
                    <p className="text-sm font-semibold text-text-primary">{detail.value}</p>
                  )}
                </div>
              </div>
            ))}
          </aside>
        </Container>
      </section>
    </>
  );
}
