import type { Metadata } from "next";
import { Clock, Mail, MapPin, Phone } from "lucide-react";
import { PageHero } from "@/components/ui/page-hero";
import { Container } from "@/components/ui/container";
import { EnquiryForm } from "@/components/contact/enquiry-form";

export const metadata: Metadata = {
  title: "Contact",
  description:
    "Start a project, apply for a course, or propose a partnership with KodeDristi Software.",
};

const CONTACT_DETAILS = [
  { icon: Phone, label: "Phone", value: "+977 9842863398", href: "tel:+9779842863398" },
  { icon: Mail, label: "Email", value: "hello@kodedristi.com", href: "mailto:hello@kodedristi.com" },
  { icon: MapPin, label: "Location", value: "Kathmandu, Nepal" },
  { icon: Clock, label: "Hours", value: "9:00 AM – 7:00 PM, Sun–Fri" },
];

export default function ContactPage() {
  return (
    <>
      <PageHero
        eyebrow="Contact"
        title="Let's talk about what you're building"
        description="Whether it's a project, a course seat, or a partnership — tell us the details and we'll follow up within one business day."
      />

      <section className="py-16 sm:py-20">
        <Container className="grid gap-10 lg:grid-cols-[1fr_320px]">
          <EnquiryForm />

          <aside className="flex flex-col gap-4">
            {CONTACT_DETAILS.map((detail) => (
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
