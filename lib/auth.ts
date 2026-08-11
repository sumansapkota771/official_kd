import { createHmac, timingSafeEqual } from "node:crypto";
import { cookies } from "next/headers";

export type SessionUser = {
  email: string;
  name: string | null;
  avatar: string | null;
  role: "admin" | "user";
};

export const SESSION_COOKIE = "kd_session";
export const SESSION_MAX_AGE = 60 * 60 * 24 * 7; // 7 days

const SECRET = process.env.SESSION_SECRET ?? "dev-secret-change-me";

function sign(payload: string): string {
  return createHmac("sha256", SECRET).update(payload).digest("base64url");
}

export function encodeSession(user: SessionUser): string {
  const payload = Buffer.from(JSON.stringify(user)).toString("base64url");
  return `${payload}.${sign(payload)}`;
}

export function decodeSession(token: string): SessionUser | null {
  const [payload, mac] = token.split(".");
  if (!payload || !mac) return null;
  const expected = sign(payload);
  const a = Buffer.from(mac);
  const b = Buffer.from(expected);
  if (a.length !== b.length || !timingSafeEqual(a, b)) return null;
  try {
    return JSON.parse(Buffer.from(payload, "base64url").toString("utf8")) as SessionUser;
  } catch {
    return null;
  }
}

export function isSuperAdminEmail(email: string | null | undefined): boolean {
  if (!email || !process.env.ADMIN_EMAIL) return false;
  return email.toLowerCase() === process.env.ADMIN_EMAIL.toLowerCase();
}

export async function getSession(): Promise<SessionUser | null> {
  const store = await cookies();
  const token = store.get(SESSION_COOKIE)?.value;
  if (!token) return null;
  return decodeSession(token);
}
