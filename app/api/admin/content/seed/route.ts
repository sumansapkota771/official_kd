import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { seedContent } from "@/lib/content/store";
import { revalidatePublicRoutes } from "@/lib/content/revalidate";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  const session = await getSession();
  if (!session || session.role !== "admin") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  try {
    const body = (await request.json()) as { type?: string };
    const results = await seedContent(body.type);
    revalidatePublicRoutes();
    return NextResponse.json({ results });
  } catch (err) {
    return NextResponse.json({ error: (err as Error).message }, { status: 500 });
  }
}
