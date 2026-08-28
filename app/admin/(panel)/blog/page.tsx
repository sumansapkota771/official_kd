import { CollectionScreen } from "@/components/admin/collection-screen";

export const dynamic = "force-dynamic";

/**
 * "Blog" is the word people use; /blog is a redirect to /insights, which is
 * what the site calls it. The admin says both so neither reader is stuck
 * looking for the other's name.
 */
export default function AdminBlogPage() {
  return (
    <CollectionScreen
      type="article"
      title="Blog"
      description="Articles published at /insights — /blog redirects there. Each post gets its own page; pick one to edit its title, excerpt, image, category, date and body."
      viewHref="/insights"
      viewLabel="View blog"
      extra={[
        { href: "/admin/content/page-hero/slug/insights", label: "Edit the blog hero" },
        { href: "/admin/content/page-seo/slug/insights", label: "Search listing" },
      ]}
    />
  );
}
