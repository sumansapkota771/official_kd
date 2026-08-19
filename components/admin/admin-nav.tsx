"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  DashboardSquare01Icon,
  ContentWritingIcon,
  InboxUnreadIcon,
  UserMultipleIcon,
  GlobeIcon,
  Image01Icon,
} from "hugeicons-react";
import { LogoutButton } from "@/components/admin/logout-button";
import { cn } from "@/lib/utils";

const LINKS = [
  { href: "/admin", label: "Dashboard", icon: DashboardSquare01Icon, exact: true },
  { href: "/admin/content", label: "Content", icon: ContentWritingIcon },
  { href: "/admin/media", label: "Media", icon: Image01Icon },
  { href: "/admin/submissions", label: "Submissions", icon: InboxUnreadIcon },
  { href: "/admin/users", label: "Users", icon: UserMultipleIcon },
];

export function AdminNav({ adminName }: { adminName: string }) {
  const pathname = usePathname();

  return (
    <aside className="flex w-full flex-col border-b border-border bg-surface lg:sticky lg:top-0 lg:h-dvh lg:w-60 lg:shrink-0 lg:border-b-0 lg:border-r">
      <div className="flex items-center gap-3 px-5 py-5">
        <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-brand-blue text-sm font-bold text-white">
          KD
        </span>
        <div className="min-w-0">
          <p className="truncate text-sm font-semibold text-text-primary">KodeDristi</p>
          <p className="truncate text-xs text-text-muted">{adminName}</p>
        </div>
      </div>

      <nav className="flex gap-1 overflow-x-auto px-3 pb-3 lg:flex-col lg:overflow-visible lg:pb-0">
        {LINKS.map((link) => {
          const active = link.exact ? pathname === link.href : pathname.startsWith(link.href);
          return (
            <Link
              key={link.href}
              href={link.href}
              className={cn(
                "focus-ring flex shrink-0 items-center gap-2.5 rounded-xl px-3 py-2.5 text-sm font-medium transition-colors",
                active
                  ? "bg-brand-blue text-white"
                  : "text-text-secondary hover:bg-background-secondary hover:text-text-primary"
              )}
            >
              <link.icon className="h-6.75 w-6.75" />
              {link.label}
            </Link>
          );
        })}
      </nav>

      <div className="mt-auto hidden gap-1.5 border-t border-border p-3 lg:flex lg:flex-col">
        <Link
          href="/"
          className="focus-ring flex items-center gap-2.5 rounded-xl px-3 py-2.5 text-sm font-medium text-text-secondary transition-colors hover:bg-background-secondary hover:text-text-primary"
        >
          <GlobeIcon className="h-6.75 w-6.75" /> View site
        </Link>
        <LogoutButton />
      </div>

      <div className="flex items-center gap-2 border-t border-border px-4 py-3 lg:hidden">
        <Link
          href="/"
          className="focus-ring flex flex-1 items-center justify-center gap-2 rounded-full border border-border bg-background px-4 py-2 text-sm font-semibold text-text-secondary transition-colors hover:bg-background-secondary"
        >
          <GlobeIcon className="h-6 w-6" /> View site
        </Link>
        <LogoutButton />
      </div>
    </aside>
  );
}
