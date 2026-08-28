import { CollectionScreen } from "@/components/admin/collection-screen";

export const dynamic = "force-dynamic";

export default function AdminProjectsPage() {
  return (
    <CollectionScreen
      type="project"
      title="Projects / Case studies"
      description="Every case study — the card on the homepage and on /projects, and the full study at its own URL. Pick one to edit its client, gallery, narrative, stack, result and search listing."
      viewHref="/projects"
      viewLabel="View projects"
      extra={[
        { href: "/admin/content/page-hero/slug/projects", label: "Edit the /projects hero" },
        { href: "/admin/content/page-seo/slug/projects", label: "Search listing" },
      ]}
    />
  );
}
