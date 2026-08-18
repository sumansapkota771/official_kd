"use client";

import { usePathname } from "next/navigation";
import dynamic from "next/dynamic";

const CinematicBackground = dynamic(() => import("@/components/cinematic-background2"), { ssr: false });

export function GlobalChrome({
  navbar,
  footer,
  children,
  visualChapters,
}: {
  navbar: React.ReactNode;
  footer: React.ReactNode;
  children: React.ReactNode;
  visualChapters?: any[];
}) {
  const pathname = usePathname();
  const isAdmin = pathname.startsWith("/admin");

  return (
    <>
      {!isAdmin && <CinematicBackground initialChapters={visualChapters ?? []} />}
      {!isAdmin && navbar}
      <main id="main-content" className="relative z-10 flex-1">
        {children}
      </main>
      {!isAdmin && footer}
    </>
  );
}
