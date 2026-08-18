import { db } from "@/lib/db";
import { ensureSchema } from "@/lib/db/schema";

function logFallback(what: string, err: unknown) {
  console.warn(`[db] "${what}" not readable from DB, using empty fallback.`, err);
}

export type DbUser = {
  id: number;
  email: string;
  name: string | null;
  avatar: string | null;
  google_id: string | null;
  role: string;
  created_at: Date;
  last_login_at: Date | null;
};

export type DbEnrollment = {
  id: number;
  email: string;
  course_slug: string | null;
  course_name: string;
  status: string;
  progress: number;
  enrolled_at: Date;
  updated_at: Date;
};

export async function upsertUser(input: {
  email: string;
  name?: string | null;
  avatar?: string | null;
  googleId?: string | null;
}): Promise<DbUser> {
  await ensureSchema();
  const res = await db.query<DbUser>(
    `INSERT INTO users (email, name, avatar, google_id, last_login_at)
     VALUES ($1, $2, $3, $4, now())
     ON CONFLICT (email) DO UPDATE SET
       name = COALESCE(EXCLUDED.name, users.name),
       avatar = COALESCE(EXCLUDED.avatar, users.avatar),
       google_id = COALESCE(EXCLUDED.google_id, users.google_id),
       last_login_at = now()
     RETURNING *`,
    [input.email, input.name ?? null, input.avatar ?? null, input.googleId ?? null]
  );
  return res.rows[0];
}

export async function getUserByEmail(email: string): Promise<DbUser | null> {
  await ensureSchema();
  const res = await db.query<DbUser>("SELECT * FROM users WHERE email = $1", [email]);
  return res.rows[0] ?? null;
}

export async function createSubmission(
  section: string,
  data: Record<string, unknown>
): Promise<void> {
  await ensureSchema();
  await db.query("INSERT INTO contact_submissions (section, data) VALUES ($1, $2)", [
    section,
    JSON.stringify(data),
  ]);
}

export async function upsertEnrollment(input: {
  email: string;
  courseSlug?: string;
  courseName: string;
}): Promise<void> {
  await ensureSchema();
  await db.query(
    `INSERT INTO user_courses (email, course_slug, course_name, status)
     VALUES ($1, $2, $3, 'applied')
     ON CONFLICT DO NOTHING`,
    [input.email, input.courseSlug ?? null, input.courseName]
  );
}

export async function trackVisit(input: {
  ip: string | null;
  userAgent: string | null;
  page: string;
  referrer: string | null;
  visitorId: string | null;
}): Promise<void> {
  await ensureSchema();
  await db.query(
    `INSERT INTO visits (ip, user_agent, page, referrer, visitor_id)
     SELECT $1, $2, $3, $4, $5
     WHERE NOT EXISTS (
       SELECT 1 FROM visits WHERE ip = $1 AND created_at > now() - interval '30 minutes'
     )`,
    [input.ip, input.userAgent, input.page, input.referrer, input.visitorId]
  );
}

export type Analytics = {
  totalViews: number;
  uniqueVisitors: number;
  today: number;
  last7Days: number;
  topPages: { page: string; views: number }[];
  daily: { day: string; visitors: number; views: number }[];
  recent: {
    id: number;
    ip: string | null;
    page: string | null;
    userAgent: string | null;
    created_at: Date;
  }[];
};

const emptyAnalytics: Analytics = {
  totalViews: 0,
  uniqueVisitors: 0,
  today: 0,
  last7Days: 0,
  topPages: [],
  daily: [],
  recent: [],
};

export async function getAnalytics(): Promise<Analytics> {
  try {
    return await getAnalyticsFromDb();
  } catch (err) {
    logFallback("analytics", err);
    return emptyAnalytics;
  }
}

async function getAnalyticsFromDb(): Promise<Analytics> {
  await ensureSchema();
  const [total, unique, today, last7, topPages, daily, recent] = await Promise.all([
    db.query<{ count: number }>("SELECT count(*)::int AS count FROM visits"),
    db.query<{ count: number }>("SELECT count(DISTINCT ip)::int AS count FROM visits"),
    db.query<{ count: number }>(
      "SELECT count(DISTINCT ip)::int AS count FROM visits WHERE created_at::date = current_date"
    ),
    db.query<{ count: number }>(
      "SELECT count(DISTINCT ip)::int AS count FROM visits WHERE created_at >= now() - interval '7 days'"
    ),
    db.query<{ page: string; views: number }>(
      "SELECT page, count(*)::int AS views FROM visits GROUP BY page ORDER BY views DESC LIMIT 10"
    ),
    db.query<{ day: string; visitors: number; views: number }>(
      `SELECT to_char(created_at, 'YYYY-MM-DD') AS day,
              count(DISTINCT ip)::int AS visitors,
              count(*)::int AS views
       FROM visits
       WHERE created_at >= now() - interval '14 days'
       GROUP BY day ORDER BY day`
    ),
    db.query<{
      id: number;
      ip: string | null;
      page: string | null;
      userAgent: string | null;
      created_at: Date;
    }>(
      "SELECT id, ip, page, user_agent, created_at FROM visits ORDER BY id DESC LIMIT 25"
    ),
  ]);

  return {
    totalViews: total.rows[0]?.count ?? 0,
    uniqueVisitors: unique.rows[0]?.count ?? 0,
    today: today.rows[0]?.count ?? 0,
    last7Days: last7.rows[0]?.count ?? 0,
    topPages: topPages.rows,
    daily: daily.rows,
    recent: recent.rows,
  };
}

export async function listSubmissions(): Promise<
  { id: number; section: string; data: Record<string, unknown>; created_at: Date }[]
> {
  try {
    await ensureSchema();
    const res = await db.query<{
      id: number;
      section: string;
      data: Record<string, unknown>;
      created_at: Date;
    }>("SELECT id, section, data, created_at FROM contact_submissions ORDER BY id DESC LIMIT 300");
    return res.rows;
  } catch (err) {
    logFallback("submissions", err);
    return [];
  }
}

export async function listUsersWithCourses(): Promise<
  (DbUser & { courses: DbEnrollment[] })[]
> {
  try {
    await ensureSchema();
    const users = await db.query<DbUser>("SELECT * FROM users ORDER BY created_at DESC");
    const courses = await db.query<DbEnrollment>(
      "SELECT * FROM user_courses ORDER BY enrolled_at DESC"
    );
    return users.rows.map((u) => ({
      ...u,
      courses: courses.rows.filter((c) => c.email === u.email),
    }));
  } catch (err) {
    logFallback("users", err);
    return [];
  }
}

export async function getEnrollmentsByEmail(email: string): Promise<DbEnrollment[]> {
  await ensureSchema();
  const res = await db.query<DbEnrollment>(
    "SELECT * FROM user_courses WHERE email = $1 ORDER BY enrolled_at DESC",
    [email]
  );
  return res.rows;
}
