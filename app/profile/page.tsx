import Link from "next/link";
import { getSession } from "@/lib/auth";
import { getUserByEmail, getEnrollmentsByEmail } from "@/lib/db/queries";
import { GoogleLogo } from "@/components/ui/google-logo";
import { LogoutButton } from "@/components/admin/logout-button";
import { GraduationScrollIcon, DashboardSquare01Icon, Mail01Icon, Calendar02Icon } from "hugeicons-react";

export const metadata = {
  title: "My Profile",
};

export const dynamic = "force-dynamic";

export default async function ProfilePage() {
  const session = await getSession();

  if (!session) {
    return (
      <main className="flex min-h-[60vh] items-center justify-center px-5 py-16">
        <div className="card flex max-w-md flex-col items-center gap-4 p-10 text-center">
          <GraduationScrollIcon className="h-10 w-10 text-brand-blue" />
          <h1 className="text-xl font-semibold text-text-primary">You&apos;re not signed in</h1>
          <p className="text-sm leading-relaxed text-text-muted">
            Sign in with Google to see your profile and the courses you&apos;ve applied for.
          </p>
          <a
            href="/api/auth/google"
            className="focus-ring inline-flex h-11 items-center gap-2 rounded-full bg-white px-6 text-sm font-semibold text-text-primary shadow-sm transition-colors hover:bg-background-secondary"
          >
            <GoogleLogo className="h-4 w-4" /> Sign in with Google
          </a>
        </div>
      </main>
    );
  }

  const user = await getUserByEmail(session.email);
  const courses = await getEnrollmentsByEmail(session.email);

  return (
    <main className="px-5 py-10 sm:py-14">
      <div className="mx-auto max-w-4xl">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div className="flex items-center gap-4">
            {session.avatar ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={session.avatar}
                alt=""
                className="h-16 w-16 rounded-full object-cover"
                referrerPolicy="no-referrer"
              />
            ) : (
              <span className="flex h-16 w-16 items-center justify-center rounded-full bg-brand-blue text-2xl font-bold text-white">
                {(session.name ?? session.email).charAt(0).toUpperCase()}
              </span>
            )}
            <div>
              <h1 className="text-2xl font-semibold text-text-primary">
                {session.name ?? "KodeDristi member"}
              </h1>
              <p className="mt-0.5 flex items-center gap-1.5 text-sm text-text-muted">
                <Mail01Icon className="h-3.5 w-3.5" /> {session.email}
              </p>
              <p className="mt-1 text-xs text-text-muted">
                Member since {user ? user.created_at.toLocaleDateString() : "—"}
              </p>
            </div>
          </div>
          <div className="flex flex-col items-start gap-2 sm:items-end">
            {session.role === "admin" && (
              <Link
                href="/admin"
                className="focus-ring inline-flex h-10 items-center gap-2 rounded-full bg-brand-blue px-5 text-sm font-semibold text-white transition-colors hover:bg-brand-blue-hover"
              >
                <DashboardSquare01Icon className="h-4 w-4" /> Admin dashboard
              </Link>
            )}
            <LogoutButton />
          </div>
        </div>

        <section className="card mt-8 p-6 sm:p-8">
          <div className="flex items-center gap-2">
            <GraduationScrollIcon className="h-5 w-5 text-brand-green" />
            <h2 className="text-lg font-semibold text-text-primary">My courses</h2>
          </div>
          {courses.length === 0 ? (
            <div className="mt-5 rounded-xl border border-dashed border-border p-8 text-center">
              <p className="text-sm text-text-secondary">
                You haven&apos;t applied for any courses yet.
              </p>
              <Link
                href="/learn"
                className="focus-ring mt-4 inline-flex h-10 items-center rounded-full bg-brand-blue px-5 text-sm font-semibold text-white transition-colors hover:bg-brand-blue-hover"
              >
                Browse courses
              </Link>
            </div>
          ) : (
            <ul className="mt-5 grid gap-4 sm:grid-cols-2">
              {courses.map((c) => (
                <li key={c.id} className="panel p-5">
                  <div className="flex items-start justify-between gap-3">
                    <h3 className="text-sm font-semibold text-text-primary">{c.course_name}</h3>
                    <span className="shrink-0 rounded-full bg-brand-green/10 px-2 py-0.5 text-xs font-semibold text-brand-green">
                      {c.status}
                    </span>
                  </div>
                  <p className="mt-2 flex items-center gap-1.5 text-xs text-text-muted">
                    <Calendar02Icon className="h-3.5 w-3.5" /> Applied {c.enrolled_at.toLocaleDateString()}
                  </p>
                  {c.course_slug && (
                    <Link
                      href={`/learn/${c.course_slug}`}
                      className="focus-ring mt-3 inline-block text-xs font-semibold text-brand-blue hover:underline"
                    >
                      View course →
                    </Link>
                  )}
                </li>
              ))}
            </ul>
          )}
        </section>
      </div>
    </main>
  );
}
