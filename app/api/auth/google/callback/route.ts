import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { encodeSession, SESSION_COOKIE, SESSION_MAX_AGE, isSuperAdminEmail } from "@/lib/auth";
import { upsertUser } from "@/lib/db/queries";
import { resolveRedirectUri } from "@/lib/oauth";

export const runtime = "nodejs";

const SITE = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";

export async function GET(req: Request) {
  const url = new URL(req.url);
  const code = url.searchParams.get("code");
  const state = url.searchParams.get("state");
  const store = await cookies();
  const expectedState = store.get("kd_oauth_state")?.value;
  const clientId = process.env.GOOGLE_CLIENT_ID;
  const clientSecret = process.env.GOOGLE_CLIENT_SECRET;
  const redirectUri = resolveRedirectUri(url.host);

  if (!clientId || !clientSecret || !code || !state || state !== expectedState) {
    return NextResponse.redirect(new URL("/admin/login?error=google_failed", SITE));
  }

  const tokenRes = await fetch("https://oauth2.googleapis.com/token", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      code,
      client_id: clientId,
      client_secret: clientSecret,
      redirect_uri: redirectUri,
      grant_type: "authorization_code",
    }),
  });
  const token = await tokenRes.json().catch(() => null);
  if (!tokenRes.ok || !token?.access_token) {
    return NextResponse.redirect(new URL("/admin/login?error=google_failed", SITE));
  }

  const userRes = await fetch("https://www.googleapis.com/oauth2/v2/userinfo", {
    headers: { Authorization: `Bearer ${token.access_token}` },
  });
  const profile = await userRes.json().catch(() => null);
  const email = typeof profile?.email === "string" ? profile.email : null;
  if (!email) {
    return NextResponse.redirect(new URL("/admin/login?error=google_failed", SITE));
  }

  try {
    await upsertUser({
      email,
      name: typeof profile.name === "string" ? profile.name : null,
      avatar: typeof profile.picture === "string" ? profile.picture : null,
      googleId: profile.id != null ? String(profile.id) : null,
    });
  } catch {
    return NextResponse.redirect(new URL("/admin/login?error=google_failed", SITE));
  }

  const role = isSuperAdminEmail(email) ? "admin" : "user";
  const res = NextResponse.redirect(new URL(role === "admin" ? "/admin" : "/profile", SITE));
  res.cookies.set(
    SESSION_COOKIE,
    encodeSession({
      email,
      name: typeof profile.name === "string" ? profile.name : null,
      avatar: typeof profile.picture === "string" ? profile.picture : null,
      role,
    }),
    {
      httpOnly: true,
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
      path: "/",
      maxAge: SESSION_MAX_AGE,
    }
  );
  res.cookies.delete("kd_oauth_state");
  return res;
}
