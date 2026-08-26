import Link from "next/link";
import Image from "next/image";
import { Mail01Icon, Location01Icon, Call02Icon } from "hugeicons-react";
import { Container } from "@/components/ui/container";
import { navGroups } from "@/lib/data/nav";

export function Footer() {
  const year = new Date().getFullYear();

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
            One platform for software delivery, applied AI and technical learning.
            <span className="block font-semibold text-footer-text">#WithYouEveryStep</span>
          </p>
          <div className="flex flex-col gap-1.5 text-sm text-footer-text-muted">
            <a href="tel:+9779842863398" className="flex items-center gap-2 hover:text-footer-heading">
              <Call02Icon className="h-5 w-5 text-brand-green" /> +977 9842863398
            </a>
            <a href="mailto:hello@kodedristi.com" className="flex items-center gap-2 hover:text-footer-heading">
              <Mail01Icon className="h-5 w-5 text-brand-green" /> hello@kodedristi.com
            </a>
            <span className="flex items-center gap-2">
              <Location01Icon className="h-5 w-5 text-brand-green" /> Kathmandu, Nepal
            </span>
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
          <p>&copy; {year} KodeDristi Software Pvt. Ltd. All rights reserved.</p>
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
