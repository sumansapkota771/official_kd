import type { ContentField } from "@/lib/content/schemas";
import { getSchema } from "@/lib/content/schemas";
import { listContentRaw } from "@/lib/content/store";

/**
 * Fills in any `select` field declared with `optionsFrom`, using the live
 * slugs of the referenced content type.
 *
 * Runs on the server, immediately before the admin editor renders, so a
 * dropdown that points at user-created rows reflects what exists right now
 * rather than what existed when the schema was written. Without this, adding
 * a gallery in the admin would leave it unselectable on the photo form.
 *
 * `listContentRaw` rather than `listContent`: an admin assigning a photo to a
 * gallery needs to see unpublished galleries too — those are exactly the ones
 * still being set up.
 *
 * A failure here degrades to an empty dropdown rather than a broken page. The
 * editor already refuses to save a required field left blank, so the admin
 * gets "this is required" instead of a crash, and the rest of the form — the
 * image, the caption — stays usable.
 */
export async function resolveFieldOptions(fields: ContentField[]): Promise<ContentField[]> {
  const dynamic = fields.filter((f) => f.optionsFrom);
  if (dynamic.length === 0) return fields;

  type Resolved = { options: string[]; optionLabels: Record<string, string> };

  const sources = [...new Set(dynamic.map((f) => f.optionsFrom!))];
  const loaded = await Promise.all(
    sources.map(async (type): Promise<[string, Resolved]> => {
      try {
        const schema = getSchema(type);
        const rows = await listContentRaw(type);
        const options: string[] = [];
        const optionLabels: Record<string, string> = {};
        for (const row of rows) {
          if (!row.slug) continue;
          options.push(row.slug);
          const title = (row.data as Record<string, unknown>)?.[schema.titleField];
          // Fall back to the slug when the row has no title yet — a
          // half-filled draft still has to be selectable.
          optionLabels[row.slug] =
            typeof title === "string" && title.trim() ? title : row.slug;
        }
        return [type, { options, optionLabels }];
      } catch {
        return [type, { options: [], optionLabels: {} }];
      }
    })
  );

  const byType = new Map(loaded);

  return fields.map((field) => {
    if (!field.optionsFrom) return field;
    const found = byType.get(field.optionsFrom);
    if (!found) return field;
    return { ...field, options: found.options, optionLabels: found.optionLabels };
  });
}
