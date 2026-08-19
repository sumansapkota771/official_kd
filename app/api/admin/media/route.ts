import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { listMedia, getMediaCount } from "@/lib/media";
import { writeFile, mkdir } from "fs/promises";
import { join } from "path";
import { randomBytes } from "crypto";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

async function requireAdmin(): Promise<boolean> {
  const session = await getSession();
  return Boolean(session && session.role === "admin");
}

const MAX_SIZE = 5 * 1024 * 1024;
const ALLOWED = new Set(["image/jpeg", "image/png", "image/webp", "image/gif", "image/svg+xml"]);

export async function GET(request: Request) {
  if (!(await requireAdmin())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const url = new URL(request.url);
  const mime = url.searchParams.get("mime") || undefined;
  const limit = Math.min(parseInt(url.searchParams.get("limit") || "50", 10), 100);
  const offset = parseInt(url.searchParams.get("offset") || "0", 10);

  const [items, total] = await Promise.all([
    listMedia({ mime, limit, offset }),
    getMediaCount(mime),
  ]);

  return NextResponse.json({ items, total, limit, offset });
}

export async function POST(request: Request) {
  if (!(await requireAdmin())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const form = await request.formData();
    const file = form.get("file");
    if (!file || !(file instanceof File)) {
      return NextResponse.json({ error: "No file" }, { status: 400 });
    }
    if (file.size > MAX_SIZE) {
      return NextResponse.json({ error: "File too large (max 5 MB)" }, { status: 400 });
    }
    if (!ALLOWED.has(file.type)) {
      return NextResponse.json({ error: "Unsupported file type" }, { status: 400 });
    }

    const ext = file.name.split(".").pop() || "bin";
    const id = randomBytes(8).toString("hex");
    const filename = `${id}.${ext}`;
    const uploadsDir = join(process.cwd(), "public", "uploads");
    await mkdir(uploadsDir, { recursive: true });

    const buffer = Buffer.from(await file.arrayBuffer());
    await writeFile(join(uploadsDir, filename), buffer);

    const { createMedia } = await import("@/lib/media");
    const alt = form.get("alt")?.toString() || "";
    const caption = form.get("caption")?.toString() || "";

    const asset = await createMedia({
      filename,
      original_name: file.name,
      url: `/uploads/${filename}`,
      mime_type: file.type,
      size_bytes: file.size,
      alt,
      caption,
    });

    return NextResponse.json(asset);
  } catch (err) {
    console.error("[media/upload]", err);
    return NextResponse.json({ error: "Upload failed" }, { status: 500 });
  }
}
