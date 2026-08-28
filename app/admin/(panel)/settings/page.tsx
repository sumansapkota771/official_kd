import Link from "next/link";
import { listContentRaw } from "@/lib/content/store";
import { getSchema } from "@/lib/content/schemas";
import { ContentEditor } from "@/components/admin/content/content-editor";

export const dynamic = "force-dynamic";

/**
 * Site settings, opened straight into its form.
 *
 * There is exactly one row, so a list of it would be a screen whose only
 * purpose is to be clicked through. Rendering the editor here makes the
 * phone number a one-click edit from anywhere in the admin — which matters
 * because it is one of the few fields that is genuinely urgent when it is
 * wrong.
 */
export default async function AdminSettingsPage() {
  const schema = getSchema("site-settings");
  const items = await listContentRaw("site-settings");

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-semibold text-text-primary">Site settings</h1>
        <p className="mt-1 max-w-2xl text-sm text-text-muted">
          The company details that appear in more than one place. Saving here
          updates the footer, the contact page and the structured data search
          engines read — all at once.
        </p>
      </div>

      <ContentEditor
        type="site-settings"
        singular={schema.singular}
        fields={schema.fields}
        isSingleton
        singletonSlug={schema.singletonSlug}
        backHref="/admin"
        initial={items[0] ?? null}
      />

      <div className="flex flex-wrap gap-2">
        <Link
          href="/admin/content/nav"
          className="focus-ring inline-flex h-9 items-center rounded-full border border-border bg-background px-3.5 text-xs font-semibold text-text-secondary transition-colors hover:border-brand-blue hover:text-link"
        >
          Edit the navigation menu
        </Link>
        <Link
          href="/admin/content/contact-detail"
          className="focus-ring inline-flex h-9 items-center rounded-full border border-border bg-background px-3.5 text-xs font-semibold text-text-secondary transition-colors hover:border-brand-blue hover:text-link"
        >
          Edit the contact page cards
        </Link>
        <Link
          href="/admin/content"
          className="focus-ring inline-flex h-9 items-center rounded-full border border-border bg-background px-3.5 text-xs font-semibold text-text-secondary transition-colors hover:border-brand-blue hover:text-link"
        >
          All content types
        </Link>
      </div>
    </div>
  );
}
