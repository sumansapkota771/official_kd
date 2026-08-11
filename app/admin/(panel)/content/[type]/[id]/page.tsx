import { notFound } from "next/navigation";
import { listContentRaw } from "@/lib/content/store";
import { getSchema } from "@/lib/content/schemas";
import { ContentEditor } from "@/components/admin/content/content-editor";

export const dynamic = "force-dynamic";

export default async function AdminContentEditPage({
  params,
}: {
  params: Promise<{ type: string; id: string }>;
}) {
  const { type, id } = await params;
  let schema;
  try {
    schema = getSchema(type);
  } catch {
    notFound();
  }

  const items = await listContentRaw(type);
  const item = items.find((i) => String(i.id) === id) ?? null;
  if (!item) notFound();

  return (
    <ContentEditor
      type={type}
      singular={schema.singular}
      fields={schema.fields}
      isSingleton={schema.isSingleton}
      singletonSlug={schema.singletonSlug}
      initial={item}
    />
  );
}
