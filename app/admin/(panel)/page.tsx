import Link from "next/link";
import { getAnalytics, listSubmissions, listUsersWithCourses } from "@/lib/db/queries";
import { getTypeSummary } from "@/lib/content/store";
import {
  EyeIcon,
  UserMultipleIcon,
  Calendar01Icon,
  ChartUpIcon,
  ChartBarLineIcon,
  ContentWritingIcon,
  InboxUnreadIcon,
  GraduationScrollIcon,
  ArrowRight01Icon,
} from "hugeicons-react";

export const dynamic = "force-dynamic";

export default async function AdminDashboard() {
  const [analytics, submissions, users, content] = await Promise.all([
    getAnalytics(),
    listSubmissions(),
    listUsersWithCourses(),
    getTypeSummary(),
  ]);

  const maxDaily = Math.max(1, ...analytics.daily.map((d) => d.visitors));
  const contentCount = content.reduce((sum, c) => sum + c.count, 0);

  const stats = [
    { label: "Total page views", value: analytics.totalViews, icon: EyeIcon },
    { label: "Unique visitors", value: analytics.uniqueVisitors, icon: UserMultipleIcon },
    { label: "Today", value: analytics.today, icon: Calendar01Icon },
    { label: "Last 7 days", value: analytics.last7Days, icon: ChartUpIcon },
  ];

  const shortcuts = [
    {
      href: "/admin/content",
      label: "Manage content",
      description: `${contentCount} items across ${content.length} types`,
      icon: ContentWritingIcon,
    },
    {
      href: "/admin/submissions",
      label: "View submissions",
      description: `${submissions.length} enquiry${submissions.length === 1 ? "" : "s"}`,
      icon: InboxUnreadIcon,
    },
    {
      href: "/admin/users",
      label: "Manage users",
      description: `${users.length} account${users.length === 1 ? "" : "s"}`,
      icon: GraduationScrollIcon,
    },
  ];

  return (
    <div className="flex flex-col gap-8">
      <div>
        <h1 className="text-2xl font-semibold text-text-primary sm:text-3xl">Dashboard</h1>
        <p className="mt-1 text-sm text-text-muted">Analytics and site health at a glance.</p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((s) => (
          <div key={s.label} className="card flex items-center gap-4 p-5">
            <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-brand-blue/10 text-link">
              <s.icon className="h-7.5 w-7.5" />
            </span>
            <div>
              <p className="text-2xl font-semibold text-text-primary">{s.value}</p>
              <p className="text-xs text-text-muted">{s.label}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        {shortcuts.map((sc) => (
          <Link
            key={sc.href}
            href={sc.href}
            className="focus-ring group card card-hover flex items-center justify-between gap-3 p-5"
          >
            <div className="flex items-center gap-3">
              <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-brand-green/10 text-brand-green-hover">
                <sc.icon className="h-7.5 w-7.5" />
              </span>
              <div>
                <p className="text-sm font-semibold text-text-primary">{sc.label}</p>
                <p className="text-xs text-text-muted">{sc.description}</p>
              </div>
            </div>
            <ArrowRight01Icon className="h-6 w-6 shrink-0 text-text-muted transition-transform group-hover:translate-x-0.5 group-hover:text-link" />
          </Link>
        ))}
      </div>

      <div className="grid gap-6 lg:grid-cols-5">
        <section className="card p-6 lg:col-span-3">
          <h2 className="text-sm font-semibold text-text-primary">Visitors · last 14 days</h2>
          <div className="mt-5 flex h-40 items-end gap-1.5">
            {analytics.daily.length === 0 && (
              <p className="text-sm text-text-muted">No visits recorded yet.</p>
            )}
            {analytics.daily.map((d) => (
              <div
                key={d.day}
                className="group flex flex-1 flex-col items-center gap-1"
                title={`${d.day} — ${d.visitors} unique / ${d.views} views`}
              >
                <div className="relative flex w-full flex-1 items-end">
                  <div
                    className="w-full rounded-t-md bg-brand-blue/80 transition-colors group-hover:bg-brand-blue"
                    style={{ height: `${Math.max(4, (d.visitors / maxDaily) * 100)}%` }}
                  />
                </div>
                <span className="text-[9px] text-text-muted">{d.day.slice(5)}</span>
              </div>
            ))}
          </div>
        </section>

        <section className="card p-6 lg:col-span-2">
          <h2 className="text-sm font-semibold text-text-primary">Top pages</h2>
          <ul className="mt-4 flex flex-col divide-y divide-border">
            {analytics.topPages.length === 0 && <li className="py-2 text-sm text-text-muted">No data yet.</li>}
            {analytics.topPages.map((p) => (
              <li key={p.page} className="flex items-center justify-between gap-3 py-2.5">
                <span className="truncate text-sm text-text-secondary">{p.page}</span>
                <span className="rounded-full bg-background-secondary px-2 py-0.5 text-xs font-semibold text-text-muted">
                  {p.views}
                </span>
              </li>
            ))}
          </ul>
        </section>
      </div>

      <section className="card p-6">
        <div className="flex items-center gap-2">
          <ChartBarLineIcon className="h-6 w-6 text-link" />
          <h2 className="text-sm font-semibold text-text-primary">Recent visits</h2>
        </div>
        <div className="mt-4 overflow-x-auto">
          <table className="w-full min-w-[640px] text-left text-sm">
            <thead>
              <tr className="border-b border-border text-xs uppercase tracking-wider text-text-muted">
                <th className="pb-2 pr-4 font-semibold">Time</th>
                <th className="pb-2 pr-4 font-semibold">IP</th>
                <th className="pb-2 pr-4 font-semibold">Page</th>
                <th className="pb-2 font-semibold">User agent</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {analytics.recent.length === 0 && (
                <tr>
                  <td colSpan={4} className="py-4 text-text-muted">
                    No visits recorded yet.
                  </td>
                </tr>
              )}
              {analytics.recent.map((v) => (
                <tr key={v.id} className="text-text-secondary">
                  <td className="whitespace-nowrap py-2.5 pr-4">{v.created_at.toLocaleString()}</td>
                  <td className="whitespace-nowrap py-2.5 pr-4">{v.ip ?? "—"}</td>
                  <td className="max-w-[200px] truncate py-2.5 pr-4">{v.page ?? "—"}</td>
                  <td className="max-w-[260px] truncate py-2.5 text-text-muted">{v.userAgent ?? "—"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}
