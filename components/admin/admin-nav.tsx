"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  DashboardSquare01Icon,
  InboxUnreadIcon,
  UserMultipleIcon,
  GlobeIcon,
  Image01Icon,
  ContentWritingIcon,
  ArrowDown01Icon,
  Search01Icon,
  Menu01Icon,
  Cancel01Icon,
} from "hugeicons-react";
import { LogoutButton } from "@/components/admin/logout-button";
import type { AdminNavGroup } from "@/lib/content/schemas";
import { cn } from "@/lib/utils";

const PRIMARY = [
  { href: "/admin", label: "Dashboard", icon: DashboardSquare01Icon, exact: true },
  { href: "/admin/content", label: "All content", icon: ContentWritingIcon, exact: true },
  { href: "/admin/media", label: "Media", icon: Image01Icon, exact: false },
  { href: "/admin/submissions", label: "Submissions", icon: InboxUnreadIcon, exact: false },
  { href: "/admin/users", label: "Users", icon: UserMultipleIcon, exact: false },
];

/**
 * Admin navigation, built so any section is at most two clicks away.
 *
 * The content types used to sit behind an index page, which put every edit
 * three clicks out: Content, then the type, then the item. Hoisting the whole
 * tree into the sidebar removes that first hop — a collection is one click to
 * its list and two to an item, and a singleton, having exactly one item to
 * edit, skips the list and opens its editor on the first click.
 *
 * Thirty-odd types only stay navigable because they are grouped and
 * filterable, so both are load-bearing here rather than decoration.
 */
export function AdminNav({
  adminName,
  contentGroups,
}: {
  adminName: string;
  contentGroups: AdminNavGroup[];
}) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [toggled, setToggled] = useState<Record<string, boolean>>({});

  // `/admin/content/<type>` and everything nested under it.
  const activeType = pathname.startsWith("/admin/content/")
    ? pathname.split("/")[3] ?? null
    : null;

  // Every link closes the drawer, which on a phone is otherwise left parked
  // over the page it just navigated to. Done on the click rather than as an
  // effect watching `pathname`: the click is the event, and reacting to the
  // route afterwards is the cascading-render pattern React now warns about.
  const close = () => setOpen(false);

  const q = query.trim().toLowerCase();
  const groups = useMemo(() => {
    if (!q) return contentGroups;
    return contentGroups
      .map((g) => ({
        ...g,
        items: g.items.filter(
          (i) =>
            i.label.toLowerCase().includes(q) ||
            i.singular.toLowerCase().includes(q) ||
            i.type.includes(q)
        ),
      }))
      .filter((g) => g.items.length > 0);
  }, [contentGroups, q]);

  function groupIsOpen(group: string): boolean {
    // A filtered tree is already short, and collapsing it would hide the hits.
    if (q) return true;
    const manual = toggled[group];
    if (manual !== undefined) return manual;
    /* Open by default, deliberately. Expanding only the active group reads
       tidier but costs a click to reach anything else — and from the
       dashboard, where no group is active, it would collapse the entire tree
       and put every collection item three clicks away again, which is the
       whole problem this nav exists to solve. Collapsing stays available as
       a per-group preference. */
    return true;
  }

  return (
    <>
      {/* Mobile bar. The old nav scrolled horizontally, which a thirty-item
          tree cannot do legibly, so small screens get a drawer instead. */}
      <div className="flex items-center gap-3 border-b border-border bg-surface px-4 py-3 lg:hidden">
        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          aria-expanded={open}
          aria-controls="admin-nav-panel"
          className="focus-ring flex h-10 w-10 items-center justify-center rounded-xl border border-border text-text-secondary"
        >
          {open ? <Cancel01Icon className="h-6 w-6" /> : <Menu01Icon className="h-6 w-6" />}
          <span className="sr-only">{open ? "Close menu" : "Open menu"}</span>
        </button>
        <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-brand-blue text-sm font-bold text-white">
          KD
        </span>
        <p className="truncate text-sm font-semibold text-text-primary">KodeDristi admin</p>
      </div>

      <aside
        id="admin-nav-panel"
        className={cn(
          "w-full flex-col border-border bg-surface lg:sticky lg:top-0 lg:flex lg:h-dvh lg:w-72 lg:shrink-0 lg:border-r",
          open ? "flex border-b" : "hidden"
        )}
      >
        <div className="hidden items-center gap-3 px-5 py-5 lg:flex">
          <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-brand-blue text-sm font-bold text-white">
            KD
          </span>
          <div className="min-w-0">
            <p className="truncate text-sm font-semibold text-text-primary">KodeDristi</p>
            <p className="truncate text-xs text-text-muted">{adminName}</p>
          </div>
        </div>

        {/* One scroll region for links, filter and tree together, so the
            footer stays pinned however long the tree gets. */}
        <div className="flex min-h-0 flex-1 flex-col gap-4 overflow-y-auto px-3 pb-4 pt-3 lg:pt-0">
          <nav className="flex flex-col gap-1">
            {PRIMARY.map((link) => {
              const active = link.exact
                ? pathname === link.href
                : pathname.startsWith(link.href);
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={close}
                  className={cn(
                    "focus-ring flex items-center gap-2.5 rounded-xl px-3 py-2.5 text-sm font-medium transition-colors",
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

          <div className="flex flex-col gap-2">
            <div className="relative">
              <Search01Icon className="pointer-events-none absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-text-muted" />
              <input
                type="search"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Find a section..."
                aria-label="Filter content sections"
                className="focus-ring w-full rounded-xl border-[0.5px] border-border bg-background py-2 pl-9 pr-3 text-sm text-text-primary placeholder:text-text-muted focus-visible:border-brand-blue"
              />
            </div>

            {groups.length === 0 && (
              <p className="px-3 py-4 text-sm text-text-muted">No section matches that.</p>
            )}

            {groups.map((g) => {
              const expanded = groupIsOpen(g.group);
              return (
                <div key={g.group} className="flex flex-col">
                  <button
                    type="button"
                    onClick={() => setToggled((prev) => ({ ...prev, [g.group]: !expanded }))}
                    aria-expanded={expanded}
                    className="focus-ring flex items-center justify-between gap-2 rounded-lg px-3 py-1.5 text-left text-[11px] font-semibold uppercase tracking-wider text-text-muted transition-colors hover:text-text-secondary"
                  >
                    {g.group}
                    <ArrowDown01Icon
                      className={cn(
                        "h-5 w-5 transition-transform duration-micro",
                        !expanded && "-rotate-90"
                      )}
                    />
                  </button>

                  {expanded && (
                    <ul className="flex flex-col">
                      {g.items.map((item) => {
                        const active = item.type === activeType;
                        return (
                          <li key={item.type}>
                            <Link
                              href={`/admin/content/${item.type}`}
                              onClick={close}
                              className={cn(
                                "focus-ring flex items-center justify-between gap-2 rounded-lg py-2 pl-3 pr-2.5 text-sm transition-colors",
                                active
                                  ? "bg-brand-blue-light font-semibold text-link"
                                  : "text-text-secondary hover:bg-background-secondary hover:text-text-primary"
                              )}
                            >
                              <span className="truncate">{item.label}</span>
                              {/* Marks the types that open straight into an
                                  editor, so the one-click ones read as such
                                  before you click them. */}
                              {item.isSingleton && (
                                <span
                                  title="Opens straight into its editor"
                                  className="shrink-0 rounded-full bg-background-secondary px-1.5 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-text-muted"
                                >
                                  1
                                </span>
                              )}
                            </Link>
                          </li>
                        );
                      })}
                    </ul>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        <div className="mt-auto flex flex-col gap-1.5 border-t border-border p-3">
          <Link
            href="/"
            onClick={close}
            className="focus-ring flex items-center gap-2.5 rounded-xl px-3 py-2.5 text-sm font-medium text-text-secondary transition-colors hover:bg-background-secondary hover:text-text-primary"
          >
            <GlobeIcon className="h-6.75 w-6.75" /> View site
          </Link>
          <LogoutButton />
        </div>
      </aside>
    </>
  );
}
