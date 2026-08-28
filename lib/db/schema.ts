import { db } from "@/lib/db";
import { runContentMigrations } from "@/lib/content/migrations";

const SCHEMA = `
CREATE TABLE IF NOT EXISTS users (
  id bigserial PRIMARY KEY,
  email text UNIQUE NOT NULL,
  name text,
  avatar text,
  google_id text,
  role text NOT NULL DEFAULT 'user',
  created_at timestamptz NOT NULL DEFAULT now(),
  last_login_at timestamptz
);

CREATE TABLE IF NOT EXISTS visits (
  id bigserial PRIMARY KEY,
  ip text,
  user_agent text,
  page text,
  referrer text,
  visitor_id text,
  created_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS idx_visits_ip_time ON visits (ip, created_at);
CREATE INDEX IF NOT EXISTS idx_visits_created ON visits (created_at);

CREATE TABLE IF NOT EXISTS contact_submissions (
  id bigserial PRIMARY KEY,
  section text NOT NULL,
  data jsonb NOT NULL DEFAULT '{}',
  created_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS idx_submissions_section ON contact_submissions (section);

CREATE TABLE IF NOT EXISTS user_courses (
  id bigserial PRIMARY KEY,
  email text NOT NULL,
  course_slug text,
  course_name text NOT NULL,
  status text NOT NULL DEFAULT 'applied',
  progress integer NOT NULL DEFAULT 0,
  enrolled_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS idx_user_courses_email ON user_courses (email);

CREATE TABLE IF NOT EXISTS content_items (
  id serial PRIMARY KEY,
  type text NOT NULL,
  slug text,
  data jsonb NOT NULL DEFAULT '{}',
  position integer NOT NULL DEFAULT 0,
  published boolean NOT NULL DEFAULT true,
  deleted_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (type, slug)
);

CREATE TABLE IF NOT EXISTS media_assets (
  id bigserial PRIMARY KEY,
  filename text NOT NULL,
  original_name text NOT NULL,
  url text NOT NULL,
  mime_type text NOT NULL,
  size_bytes integer NOT NULL,
  width integer,
  height integer,
  alt text DEFAULT '',
  caption text DEFAULT '',
  focal_x real DEFAULT 0.5,
  focal_y real DEFAULT 0.5,
  uploaded_by text,
  created_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS idx_media_mime ON media_assets (mime_type);
CREATE INDEX IF NOT EXISTS idx_media_created ON media_assets (created_at);
`;

let schemaReady: Promise<void> | null = null;

export function ensureSchema(): Promise<void> {
  if (!schemaReady) {
    /* Data migrations are chained onto the table creation rather than run
       separately, so everything that reads content — all of which already
       awaits this — sees the corrected rows. They never reject: see
       runContentMigrations. */
    schemaReady = db.query(SCHEMA).then(
      () => runContentMigrations(),
      (err) => {
        schemaReady = null;
        throw err;
      }
    );
  }
  return schemaReady;
}
