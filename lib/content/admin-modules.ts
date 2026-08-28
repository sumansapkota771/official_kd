import {
  editHref,
  partOpensEditor,
  type ModulePart,
  type SiteModule,
} from "@/lib/content/site-map";
import type { ManagerPart } from "@/components/admin/homepage-manager";

/**
 * Resolves a module's parts into plain links the admin can render.
 *
 * Done on the server so the browser never has to load the content schemas:
 * whether a part opens a form or a list is a question about the schema, and
 * answering it here keeps a 1,500-line module out of the client bundle for
 * the sake of one boolean per row.
 */
export function resolveParts(
  parts: ModulePart[],
  counts: Map<string, number>
): ManagerPart[] {
  return parts.map((part) => {
    const direct = partOpensEditor(part);
    return {
      label: part.label,
      hint: part.hint,
      href: editHref(part),
      direct,
      count: direct ? null : counts.get(part.type) ?? 0,
    };
  });
}

/** Every content type a module touches, for the "N items" totals. */
export function moduleTypes(module: SiteModule): string[] {
  return [...new Set(module.parts.map((p) => p.type))];
}
