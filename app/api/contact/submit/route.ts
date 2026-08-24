import { NextResponse } from "next/server";
import { createSubmission, getUserByEmail, upsertUser, upsertEnrollment } from "@/lib/db/queries";

export const runtime = "nodejs";

const VALID_SECTIONS = new Set(["project", "course", "partnership", "product_talk"]);
const MAX_LEN = 5000;

export async function POST(req: Request) {
  const body = await req.json().catch(() => ({}));
  const section = String(body.section ?? "");

  if (!VALID_SECTIONS.has(section)) {
    return NextResponse.json({ error: "Invalid section" }, { status: 400 });
  }

  const data: Record<string, unknown> = {};
  for (const [k, v] of Object.entries(body)) {
    if (k === "section") continue;
    data[k] = typeof v === "string" ? v.slice(0, MAX_LEN) : v;
  }

  try {
    await createSubmission(section, data);

    if (section === "course") {
      const rawContact = typeof data.contact === "string" ? data.contact : "";
      const email =
        (typeof data.email === "string" ? data.email : "") ||
        (rawContact.includes("@") ? rawContact : "");
      if (email && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        let user = await getUserByEmail(email);
        if (!user) {
          user = await upsertUser({ email });
        }
        await upsertEnrollment({
          email,
          courseSlug: typeof data.courseSlug === "string" ? data.courseSlug : undefined,
          courseName:
            String(data.course ?? data.selectedCourse ?? "Course").slice(0, 200) || "Course",
        });
      }
    }
  } catch {
    return NextResponse.json({ error: "Failed to save" }, { status: 500 });
  }

  return NextResponse.json({ ok: true });
}
