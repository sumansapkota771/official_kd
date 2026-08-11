import { notFound } from "next/navigation";
import { listContentRaw } from "@/lib/content/store";
import { getSchema } from "@/lib/content/schemas";
import { ContentList } from "@/components/admin/content/content-list";

export const dynamic = "force-dynamic";

export default async function AdminContentTypePage({
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
  const items = await listContentRaw(type);

  return (
    <ContentList
      type={type}
      label={schema.label}
      singular={schema.singular}
      isSingleton={Boolean(schema.isSingleton)}
      titleField={schema.titleField}
      subtitleField={schema.subtitleField ?? ""}
      iconField={schema.iconField ?? ""}
      items={items.map((i) => ({
        ...i,
        createdAt: i.createdAt.toISOString(),
        updatedAt: i.updatedAt.toISOString(),
      }))}
    />
  );
}
