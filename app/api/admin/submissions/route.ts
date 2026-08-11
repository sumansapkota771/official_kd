import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { listSubmissions } from "@/lib/db/queries";

export const runtime = "nodejs";

export async function GET() {
  const session = await getSession();
  if (!session || session.role !== "admin") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  try {
    const submissions = await listSubmissions();
    return NextResponse.json({ submissions });
  } catch {
    return NextResponse.json({ error: "Failed to load submissions" }, { status: 500 });
  }
}
