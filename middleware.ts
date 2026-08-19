import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const SESSION_COOKIE = "kd_session";
const ADMIN_PREFIXES = ["/admin"];
const API_ADMIN_PREFIXES = ["/api/admin"];

function readSessionRole(token: string): string | null {
  try {
    const [payload] = token.split(".");
    if (!payload) return null;
    const json = JSON.parse(Buffer.from(payload, "base64url").toString("utf8"));
    return json?.role ?? null;
  } catch {
    return null;
  }
}

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const isAdminPage = ADMIN_PREFIXES.some((p) => pathname === p || pathname.startsWith(p + "/"));
  const isAdminApi = API_ADMIN_PREFIXES.some((p) => pathname.startsWith(p));

  if (!isAdminPage && !isAdminApi) {
    return NextResponse.next();
  }

  if (pathname === "/admin/login") {
    return NextResponse.next();
  }

  const token = request.cookies.get(SESSION_COOKIE)?.value;
  if (!token || readSessionRole(token) !== "admin") {
    if (isAdminApi) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    const loginUrl = new URL("/admin/login", request.url);
    loginUrl.searchParams.set("from", pathname);
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*", "/api/admin/:path*"],
};
