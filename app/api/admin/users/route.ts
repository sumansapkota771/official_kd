import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { listUsersWithCourses } from "@/lib/db/queries";

export const runtime = "nodejs";

export async function GET() {
  const session = await getSession();
  if (!session || session.role !== "admin") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  try {
    const users = await listUsersWithCourses();
    return NextResponse.json({ users });
  } catch {
    return NextResponse.json({ error: "Failed to load users" }, { status: 500 });
  }
}
