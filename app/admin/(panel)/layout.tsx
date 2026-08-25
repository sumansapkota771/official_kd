import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth";
import { AdminNav } from "@/components/admin/admin-nav";
import { getAdminContentNav } from "@/lib/content/schemas";

export const dynamic = "force-dynamic";

export default async function AdminPanelLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getSession();
  if (!session || session.role !== "admin") redirect("/admin/login");

  return (
    <div className="flex min-h-dvh flex-col bg-background-secondary lg:flex-row">
      <AdminNav
        adminName={session.name ?? session.email}
        contentGroups={getAdminContentNav()}
      />
      <div className="min-w-0 flex-1 px-5 py-8 sm:px-8 lg:py-10">{children}</div>
    </div>
  );
}
