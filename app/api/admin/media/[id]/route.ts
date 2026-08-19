import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { updateMedia, deleteMedia, type MediaAsset } from "@/lib/media";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

async function requireAdmin(): Promise<boolean> {
  const session = await getSession();
  return Boolean(session && session.role === "admin");
}

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  if (!(await requireAdmin())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;
  const body = await request.json();
  const patch: Partial<Pick<MediaAsset, "alt" | "caption" | "focal_x" | "focal_y">> = {};

  if ("alt" in body) patch.alt = body.alt;
  if ("caption" in body) patch.caption = body.caption;
  if ("focal_x" in body) patch.focal_x = body.focal_x;
  if ("focal_y" in body) patch.focal_y = body.focal_y;

  const updated = await updateMedia(parseInt(id, 10), patch);
  if (!updated) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }
  return NextResponse.json(updated);
}

export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  if (!(await requireAdmin())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;
  const deleted = await deleteMedia(parseInt(id, 10));
  if (!deleted) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }
  return NextResponse.json({ ok: true });
}
