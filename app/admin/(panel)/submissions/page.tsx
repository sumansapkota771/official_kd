import { listSubmissions } from "@/lib/db/queries";
import { SubmissionsPanel } from "@/components/admin/submissions-panel";

export const dynamic = "force-dynamic";

export default async function AdminSubmissionsPage() {
  const submissions = await listSubmissions();

  const sectionCounts = submissions.reduce<Record<string, number>>((acc, s) => {
    acc[s.section] = (acc[s.section] ?? 0) + 1;
    return acc;
  }, {});

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-semibold text-text-primary">Submissions</h1>
        <p className="mt-1 text-sm text-text-muted">
          Enquiries, course applications and partnership requests sent through the site.
        </p>
      </div>
      <SubmissionsPanel
        submissions={submissions.map((s) => ({
          ...s,
          created_at: s.created_at.toLocaleString(),
        }))}
        sectionCounts={sectionCounts}
      />
    </div>
  );
}
