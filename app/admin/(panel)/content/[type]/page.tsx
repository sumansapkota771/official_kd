import { notFound } from "next/navigation";
import { listContentRaw } from "@/lib/content/store";
import { getSchema } from "@/lib/content/schemas";
import { ContentList } from "@/components/admin/content/content-list";
import { ContentEditor } from "@/components/admin/content/content-editor";

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

  /* A singleton is one row that always exists, so a list of it is a page
     whose only purpose is to be clicked through. Rendering the editor here
     puts these one click from anywhere in the sidebar. */
  if (schema.isSingleton) {
    return (
      <ContentEditor
        type={type}
        singular={schema.singular}
        fields={schema.fields}
        isSingleton
        singletonSlug={schema.singletonSlug}
        backHref="/admin/content"
        initial={items[0] ?? null}
      />
    );
  }

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
