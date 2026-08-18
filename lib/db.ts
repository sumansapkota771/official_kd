import { Pool } from "pg";

declare global {
  var __kdDbPool: Pool | undefined;
}

const connectionString = process.env.DATABASE_URL;

if (!connectionString) {
  throw new Error("DATABASE_URL is not set. Add it to .env.local");
}

export const db =
  global.__kdDbPool ??
  new Pool({
    connectionString,
    max: 10,
    idleTimeoutMillis: 30_000,
    // Serverless Postgres (Supabase) can take well over 10s to wake a paused
    // project or establish a fresh TLS connection. 10s was short enough that
    // admin writes (which have no fallback) failed with "connection timeout"
    // whenever the DB was cold.
    connectionTimeoutMillis: 60_000,
    query_timeout: 60_000,
    statement_timeout: 60_000,
    keepAlive: true,
    ssl: process.env.DATABASE_SSL === "false" ? false : { rejectUnauthorized: false },
  });

db.on("error", (err) => {
  console.error("[db] unexpected error on idle client", err);
});

if (process.env.NODE_ENV !== "production") global.__kdDbPool = db;
