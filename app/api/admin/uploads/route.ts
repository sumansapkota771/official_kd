import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { writeFile, mkdir } from "fs/promises";
import { join } from "path";
import { randomBytes } from "crypto";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

async function requireAdmin(): Promise<boolean> {
  const session = await getSession();
  return Boolean(session && session.role === "admin");
}

const MAX_SIZE = 5 * 1024 * 1024; // 5 MB
const ALLOWED = new Set([
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/gif",
  "image/svg+xml",
]);

export async function POST(request: Request) {
  if (!(await requireAdmin())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const form = await request.formData();
    const file = form.get("file");
    if (!file || !(file instanceof File)) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
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

    return NextResponse.json({ url: `/uploads/${filename}` });
  } catch (err) {
    console.error("[upload]", err);
    return NextResponse.json({ error: "Upload failed" }, { status: 500 });
  }
}
