import { notFound } from "next/navigation";
import { getSchema, slugify } from "@/lib/content/schemas";
import { listContentRaw } from "@/lib/content/store";
import { ContentEditor } from "@/components/admin/content/content-editor";

export const dynamic = "force-dynamic";

export default async function AdminContentNewPage({
  params,
}: {
  params: Promise<{ type: string }>;
}) {
  const { type } = await params;
  let schema;
  try {
    schema = getSchema(type);
  } catch {
    notFound();
  }

  // First free "<singular>-N". Saving now rejects a duplicate slug outright,
  // so handing over one that is already taken would just bounce the admin.
  let suggestedSlug: string | undefined;
  if (!schema.isSingleton) {
    const base = slugify(schema.singular) || slugify(type);
    try {
      const taken = new Set((await listContentRaw(type)).map((i) => i.slug));
      let n = taken.size + 1;
      while (taken.has(`${base}-${n}`)) n += 1;
      suggestedSlug = `${base}-${n}`;
    } catch {
      // DB unreachable — leave the field empty rather than guess a collision.
    }
  }

  return (
    <ContentEditor
      type={type}
      singular={schema.singular}
      fields={schema.fields}
      isSingleton={schema.isSingleton}
      singletonSlug={schema.singletonSlug}
      suggestedSlug={suggestedSlug}
      initial={null}
    />
  );
}
