import { listUsersWithCourses } from "@/lib/db/queries";

export const dynamic = "force-dynamic";

export default async function AdminUsersPage() {
  const users = await listUsersWithCourses();
  const totalCourses = users.reduce((sum, u) => sum + u.courses.length, 0);

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-semibold text-text-primary">Users</h1>
        <p className="mt-1 text-sm text-text-muted">
          {users.length} account{users.length === 1 ? "" : "s"} · {totalCourses} course
          enrollment{totalCourses === 1 ? "" : "s"}
        </p>
      </div>

      <div className="card divide-y divide-border">
        {users.length === 0 && (
          <p className="p-6 text-sm text-text-muted">
            No users yet — they appear once they sign in with Google.
          </p>
        )}

        {users.map((u) => (
          <div key={u.id} className="flex flex-col gap-3 p-5 sm:flex-row sm:items-start sm:justify-between">
            <div className="flex min-w-0 items-center gap-3">
              {u.avatar ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={u.avatar}
                  alt=""
                  className="h-11 w-11 rounded-full object-cover"
                  referrerPolicy="no-referrer"
                />
              ) : (
                <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-brand-blue text-sm font-bold text-white">
                  {(u.name ?? u.email).charAt(0).toUpperCase()}
                </span>
              )}
              <div className="min-w-0">
                <div className="flex flex-wrap items-center gap-2">
                  <p className="truncate text-sm font-semibold text-text-primary">{u.name ?? "—"}</p>
                  {u.google_id && (
                    <span className="rounded-full bg-brand-green/10 px-2 py-0.5 text-[11px] font-semibold text-brand-green-hover">
                      Google
                    </span>
                  )}
                </div>
                <p className="truncate text-xs text-text-muted">{u.email}</p>
                <p className="mt-0.5 text-xs text-text-muted">
                  Joined {u.created_at.toLocaleDateString()} · Last sign-in{" "}
                  {u.last_login_at ? u.last_login_at.toLocaleString() : "—"}
                </p>
              </div>
            </div>

            <div className="w-full shrink-0 sm:w-72">
              {u.courses.length === 0 ? (
                <p className="text-xs text-text-muted">No course enrollments</p>
              ) : (
                <ul className="flex flex-col gap-1.5">
                  {u.courses.map((c) => (
                    <li
                      key={c.id}
                      className="flex items-center justify-between gap-2 rounded-lg border-[0.5px] border-border bg-background px-3 py-2"
                    >
                      <span className="truncate text-xs font-medium text-text-secondary">{c.course_name}</span>
                      <span className="shrink-0 rounded-full bg-brand-green/10 px-2 py-0.5 text-[11px] font-semibold text-brand-green-hover">
                        {c.status}
                      </span>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
