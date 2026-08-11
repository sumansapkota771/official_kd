import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth";
import { LoginForm } from "./login-form";

export const metadata = {
  title: "Admin Sign in",
  robots: { index: false, follow: false },
};

export default async function AdminLoginPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  const session = await getSession();
  if (session?.role === "admin") redirect("/admin");

  const { error } = await searchParams;
  const googleConfigured = Boolean(
    process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET
  );

  return (
    <div className="flex min-h-[70vh] items-center justify-center px-5 py-16">
      <LoginForm
        googleConfigured={googleConfigured}
        error={typeof error === "string" ? error : undefined}
      />
    </div>
  );
}
