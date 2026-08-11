import type { Metadata } from "next";
import { PageHero } from "@/components/ui/page-hero";
import { Container } from "@/components/ui/container";
import { EnquiryForm } from "@/components/contact/enquiry-form";
import { getContactDetails } from "@/lib/content/resolvers";
import { getPageHero } from "@/lib/content/resolvers";

export const dynamic = "force-dynamic";

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

      <section className="py-16 sm:py-20">
        <Container className="grid gap-10 lg:grid-cols-[1fr_320px]">
          <EnquiryForm />

          <aside className="flex flex-col gap-4">
            {contactDetails.map((detail) => (
              <div key={detail.label} className="flex items-start gap-3 card p-5">
                <detail.icon className="h-4.5 w-4.5 shrink-0 text-brand-blue" />
                <div>
                  <p className="text-xs font-medium text-text-muted">{detail.label}</p>
                  {detail.href ? (
                    <a href={detail.href} className="text-sm font-semibold text-text-primary hover:text-brand-blue">
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
