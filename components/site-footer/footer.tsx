import Link from "next/link";
import Image from "next/image";
import { Mail01Icon, Location01Icon, Call02Icon, Clock01Icon } from "hugeicons-react";
import { Container } from "@/components/ui/container";
import { getSiteSettings } from "@/lib/content/resolvers";
import type { NavGroup } from "@/lib/data/nav";

/**
 * Contact details come from the `site-settings` row rather than from this
 * file, so the phone number and opening hours are one edit in the admin
 * instead of three edits across the footer, the contact page and the
 * structured data.
 */
export async function Footer({ navGroups }: { navGroups: NavGroup[] }) {
  const settings = await getSiteSettings();
  const year = new Date().getFullYear();
  const hours = [settings.officeHours, settings.officeDays]
    .filter((part) => part && part.trim())
    .join(" · ");

  return (
    <footer
      // Column count is derived from navGroups so it can never desync from the
      // data again — a hardcoded repeat(4) dropped the fifth group onto a
      // second row. Set here because custom properties inherit into Container.
      style={
        {
          "--footer-cols": `1.4fr repeat(${navGroups.length}, minmax(0, 1fr))`,
        } as React.CSSProperties
      }
      className="relative z-10 border-t border-border bg-footer-bg text-footer-text"
    >
      <Container className="grid gap-8 py-12 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-(--footer-cols)">
        <div className="flex flex-col gap-3 sm:col-span-2 md:col-span-3 lg:col-span-1">
          <div className="relative h-10 w-[89px]">
            <Image
              src="/images/logo.png"
              alt="KodeDristi Software Pvt. Ltd."
              fill
              sizes="89px"
              className="object-contain object-left"
            />
          </div>
          <p className="max-w-xs text-sm leading-relaxed text-footer-text-muted">
            {settings.tagline}
            {settings.footerNote && (
              <span className="block font-semibold text-footer-text">{settings.footerNote}</span>
            )}
          </p>
          <div className="flex flex-col gap-1.5 text-sm text-footer-text-muted">
            {/* A `tel:` link, so tapping the number on a phone dials it. The
                printed number stays local; the href carries the country
                code, which is why the two are stored separately. */}
            <a href={settings.phoneHref} className="flex items-center gap-2 hover:text-footer-heading">
              <Call02Icon className="h-5 w-5 text-brand-green" /> {settings.phone}
            </a>
            <a href={`mailto:${settings.email}`} className="flex items-center gap-2 hover:text-footer-heading">
              <Mail01Icon className="h-5 w-5 text-brand-green" /> {settings.email}
            </a>
            <span className="flex items-center gap-2">
              <Location01Icon className="h-5 w-5 text-brand-green" /> {settings.address}
            </span>
            {hours && (
              <span className="flex items-center gap-2">
                <Clock01Icon className="h-5 w-5 text-brand-green" /> {hours}
              </span>
            )}
          </div>
        </div>

        {navGroups.map((group) => (
          <div key={group.label} className="flex flex-col gap-3">
            <h3 className="text-sm font-semibold text-footer-heading">{group.label}</h3>
            <ul className="flex flex-col gap-2">
              {group.items.map((item) => (
                <li key={item.href}>
                  <Link href={item.href} className="text-sm text-footer-text-muted hover:text-brand-green">
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </Container>

      <div className="border-t border-footer-divider">
        <Container className="flex flex-col items-center justify-between gap-2 py-4 text-xs text-footer-text-muted sm:flex-row">
          <p>&copy; {year} {settings.companyName} All rights reserved.</p>
          <div className="flex items-center gap-4">
            <Link href="/hackathon" className="hover:text-brand-green">
              National AI Hackathon
            </Link>
            <Link href="/dristi-lagani" className="hover:text-brand-green">
              Dristi Lagani
            </Link>
            <Link href="/insights" className="hover:text-brand-green">
              Articles
            </Link>
            <Link href="/contact" className="hover:text-brand-green">
              Contact
            </Link>
          </div>
        </Container>
      </div>
    </footer>
  );
}
