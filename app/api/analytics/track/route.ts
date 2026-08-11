import { NextResponse } from "next/server";
import { trackVisit } from "@/lib/db/queries";

export const runtime = "nodejs";

export async function POST(req: Request) {
  const body = await req.json().catch(() => ({}));
  const ip =
    req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ??
    req.headers.get("x-real-ip") ??
    null;
  const page = typeof body.page === "string" ? body.page.slice(0, 500) : "/";

  try {
    await trackVisit({
      ip,
      userAgent: req.headers.get("user-agent"),
      page,
      referrer: req.headers.get("referer"),
      visitorId: typeof body.visitorId === "string" ? body.visitorId : null,
    });
  } catch {
    return NextResponse.json({ ok: false }, { status: 500 });
  }
  return NextResponse.json({ ok: true });
}
