"use client";

import { usePathname } from "next/navigation";

export function GlobalChrome({
  navbar,
  footer,
  children,
}: {
  navbar: React.ReactNode;
  footer: React.ReactNode;
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const isAdmin = pathname.startsWith("/admin");

  return (
    <>
      {!isAdmin && navbar}
      <main id="main-content" className="relative z-10 flex-1">
        {children}
      </main>
      {!isAdmin && footer}
    </>
  );
}
