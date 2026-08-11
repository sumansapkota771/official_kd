import { notFound } from "next/navigation";
import { getSchema } from "@/lib/content/schemas";
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

  return (
    <ContentEditor
      type={type}
      singular={schema.singular}
      fields={schema.fields}
      isSingleton={schema.isSingleton}
      singletonSlug={schema.singletonSlug}
      initial={null}
    />
  );
}
