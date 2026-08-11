import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { getAnalytics } from "@/lib/db/queries";

export const runtime = "nodejs";

export async function GET() {
  const session = await getSession();
  if (!session || session.role !== "admin") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  try {
    const analytics = await getAnalytics();
    return NextResponse.json(analytics);
  } catch {
    return NextResponse.json({ error: "Failed to load analytics" }, { status: 500 });
  }
}
