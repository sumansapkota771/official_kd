import { NextResponse } from "next/server";
import { revalidatePublicRoutes } from "@/lib/content/revalidate";
import { getSession } from "@/lib/auth";
import { reorderContent } from "@/lib/content/store";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  const session = await getSession();
  if (!session || session.role !== "admin") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  try {
    const body = (await request.json()) as { type?: string; ids?: number[] };
    if (!body.type || !Array.isArray(body.ids)) {
      return NextResponse.json({ error: "type and ids are required" }, { status: 400 });
    }
    await reorderContent(body.type, body.ids);
    revalidatePublicRoutes();
    return NextResponse.json({ ok: true });
  } catch (err) {
    return NextResponse.json({ error: (err as Error).message }, { status: 500 });
  }
}
