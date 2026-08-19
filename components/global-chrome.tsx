"use client";

import { usePathname } from "next/navigation";
import dynamic from "next/dynamic";
import type { ContentItem } from "@/lib/content/schemas";

const CinematicBackground = dynamic(() => import("@/components/cinematic-background2"), { ssr: false });

type VisualChapter = ContentItem<{ sectionKey?: string; imageUrl?: string; focal?: string; overlayOpacity?: string | number; mobileImageUrl?: string; sourceUrl?: string }>;

export function GlobalChrome({
  navbar,
  footer,
  children,
  visualChapters,
}: {
  navbar: React.ReactNode;
  footer: React.ReactNode;
  children: React.ReactNode;
  visualChapters?: VisualChapter[];
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
