import { notFound, redirect } from "next/navigation";
import { getSchema } from "@/lib/content/schemas";
import { listContentRaw } from "@/lib/content/store";

export const dynamic = "force-dynamic";

/**
 * Opens one known row by its slug.
 *
 * The admin links to section headings and page heroes by slug — "the heading
 * above the logo wall" — but the editor is addressed by database id, which
 * nothing outside the database knows. Resolving that here is what lets the
 * homepage and page screens link straight into a form: without it every one
 * of those links would have to land on a list first, and the three-click
 * rule would be a four-click rule everywhere a heading is edited.
 *
 * A slug with no row falls back to the type's list rather than 404ing. The
 * row may simply not be seeded yet, and the list is where it gets created.
 */
export default async function AdminContentBySlugPage({
  params,
}: {
  params: Promise<{ type: string; slug: string }>;
}) {
  const { type, slug } = await params;
  try {
    getSchema(type);
  } catch {
    notFound();
  }

  const items = await listContentRaw(type);
  const item = items.find((i) => i.slug === slug);
  if (!item) redirect(`/admin/content/${type}`);
  redirect(`/admin/content/${type}/${item.id}`);
}
