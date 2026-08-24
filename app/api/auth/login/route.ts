import { NextResponse } from "next/server";
import { encodeSession, SESSION_COOKIE, SESSION_MAX_AGE } from "@/lib/auth";

export const runtime = "nodejs";

export async function POST(req: Request) {
  const { email, password } = await req.json().catch(() => ({}));
  const adminEmail = process.env.ADMIN_EMAIL;
  const adminPassword = process.env.ADMIN_PASSWORD;

  if (
    !email ||
    !password ||
    !adminEmail ||
    !adminPassword ||
    email.toLowerCase() !== adminEmail.toLowerCase() ||
    password !== adminPassword
  ) {
    return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });
  }

  const res = NextResponse.json({ ok: true });
  res.cookies.set(
    SESSION_COOKIE,
    encodeSession({ email: adminEmail, name: "Super Admin", avatar: null, role: "admin" }),
    {
      httpOnly: true,
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
      path: "/",
      maxAge: SESSION_MAX_AGE,
    }
  );
  return res;
}
