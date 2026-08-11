import Link from "next/link";
import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth";
import { getAnalytics, listSubmissions, listUsersWithCourses } from "@/lib/db/queries";
import { SubmissionsPanel } from "@/components/admin/submissions-panel";
import { LogoutButton } from "@/components/admin/logout-button";
import {
  EyeIcon,
  UserMultipleIcon,
  Calendar01Icon,
  ChartUpIcon,
  ChartBarLineIcon,
  ArrowLeft01Icon,
  GraduationScrollIcon,
} from "hugeicons-react";

export const metadata = {
  title: "Admin Dashboard",
  robots: { index: false, follow: false },
};

export const dynamic = "force-dynamic";

export default async function AdminDashboard() {
  const session = await getSession();
  if (!session || session.role !== "admin") redirect("/admin/login");

  const [analytics, submissions, users] = await Promise.all([
    getAnalytics(),
    listSubmissions(),
    listUsersWithCourses(),
  ]);

  const maxDaily = Math.max(1, ...analytics.daily.map((d) => d.visitors));
  const sectionCounts = submissions.reduce<Record<string, number>>((acc, s) => {
    acc[s.section] = (acc[s.section] ?? 0) + 1;
    return acc;
  }, {});

  const stats = [
    { label: "Total page views", value: analytics.totalViews, icon: EyeIcon },
    { label: "Unique visitors", value: analytics.uniqueVisitors, icon: UserMultipleIcon },
    { label: "Today", value: analytics.today, icon: Calendar01Icon },
    { label: "Last 7 days", value: analytics.last7Days, icon: ChartUpIcon },
  ];

  return (
    <main className="min-h-screen bg-background-secondary px-5 py-8 sm:py-12">
      <div className="mx-auto max-w-7xl">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-text-muted">
              {session.name}
            </p>
            <h1 className="mt-1 text-2xl font-semibold text-text-primary sm:text-3xl">
              Admin Dashboard
            </h1>
          </div>
          <div className="flex items-center gap-2">
            <Link
              href="/"
              className="focus-ring inline-flex h-10 items-center gap-2 rounded-full border border-border bg-background px-4 text-sm font-semibold text-text-secondary transition-colors hover:bg-background-secondary"
            >
              <ArrowLeft01Icon className="h-4 w-4" /> View site
            </Link>
            <LogoutButton />
          </div>
        </div>

        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {stats.map((s) => (
            <div key={s.label} className="card flex items-center gap-4 p-5">
              <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-brand-blue/10 text-brand-blue">
                <s.icon className="h-5 w-5" />
              </span>
              <div>
                <p className="text-2xl font-semibold text-text-primary">{s.value}</p>
                <p className="text-xs text-text-muted">{s.label}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-6 grid gap-6 lg:grid-cols-5">
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
                  <span className="text-[9px] text-text-muted">
                    {d.day.slice(5)}
                  </span>
                </div>
              ))}
            </div>
          </section>

          <section className="card p-6 lg:col-span-2">
            <h2 className="text-sm font-semibold text-text-primary">Top pages</h2>
            <ul className="mt-4 flex flex-col divide-y divide-border">
              {analytics.topPages.length === 0 && (
                <li className="py-2 text-sm text-text-muted">No data yet.</li>
              )}
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

        <section className="card mt-6 p-6">
          <div className="flex items-center gap-2">
            <ChartBarLineIcon className="h-4 w-4 text-brand-blue" />
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
                    <td className="py-2.5 pr-4 whitespace-nowrap">
                      {v.created_at.toLocaleString()}
                    </td>
                    <td className="py-2.5 pr-4 whitespace-nowrap">{v.ip ?? "—"}</td>
                    <td className="max-w-[200px] truncate py-2.5 pr-4">{v.page ?? "—"}</td>
                    <td className="max-w-[260px] truncate py-2.5 text-text-muted">
                      {v.userAgent ?? "—"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        <section className="mt-6">
          <div className="flex items-center gap-2">
            <GraduationScrollIcon className="h-4 w-4 text-brand-blue" />
            <h2 className="text-sm font-semibold text-text-primary">Contact submissions</h2>
            <span className="rounded-full bg-brand-blue/10 px-2 py-0.5 text-xs font-semibold text-brand-blue">
              {submissions.length}
            </span>
          </div>
          <SubmissionsPanel
            submissions={submissions.map((s) => ({
              ...s,
              created_at: s.created_at.toLocaleString(),
            }))}
            sectionCounts={sectionCounts}
          />
        </section>

        <section className="mt-6">
          <div className="flex items-center gap-2">
            <UserMultipleIcon className="h-4 w-4 text-brand-blue" />
            <h2 className="text-sm font-semibold text-text-primary">Users &amp; courses</h2>
            <span className="rounded-full bg-brand-blue/10 px-2 py-0.5 text-xs font-semibold text-brand-blue">
              {users.length}
            </span>
          </div>
          <div className="card mt-4 divide-y divide-border">
            {users.length === 0 && (
              <p className="p-6 text-sm text-text-muted">
                No users yet — they appear once they sign in with Google.
              </p>
            )}
            {users.map((u) => (
              <div key={u.id} className="flex flex-col gap-3 p-5 sm:flex-row sm:items-center sm:justify-between">
                <div className="flex items-center gap-3">
                  {u.avatar ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={u.avatar}
                      alt=""
                      className="h-10 w-10 rounded-full object-cover"
                      referrerPolicy="no-referrer"
                    />
                  ) : (
                    <span className="flex h-10 w-10 items-center justify-center rounded-full bg-brand-blue text-sm font-bold text-white">
                      {(u.name ?? u.email).charAt(0).toUpperCase()}
                    </span>
                  )}
                  <div>
                    <p className="text-sm font-semibold text-text-primary">{u.name ?? "—"}</p>
                    <p className="text-xs text-text-muted">{u.email}</p>
                  </div>
                </div>
                <div className="flex flex-wrap items-center gap-2">
                  <span className="rounded-full bg-background-secondary px-2.5 py-1 text-xs font-medium text-text-secondary">
                    {u.courses.length} course{u.courses.length === 1 ? "" : "s"}
                  </span>
                  <span className="rounded-full bg-background-secondary px-2.5 py-1 text-xs font-medium text-text-muted">
                    Joined {u.created_at.toLocaleDateString()}
                  </span>
                </div>
                {u.courses.length > 0 && (
                  <div className="w-full sm:max-w-md">
                    <ul className="flex flex-col gap-1">
                      {u.courses.map((c) => (
                        <li key={c.id} className="flex items-center justify-between gap-2 text-xs">
                          <span className="truncate text-text-secondary">{c.course_name}</span>
                          <span className="rounded-full bg-brand-green/10 px-2 py-0.5 font-semibold text-brand-green">
                            {c.status}
                          </span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            ))}
          </div>
        </section>
      </div>
    </main>
  );
}
