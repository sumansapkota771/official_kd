import Image from "next/image";
import { Container } from "@/components/ui/container";
import { SectionHeading } from "@/components/ui/section-heading";
import { Button } from "@/components/ui/button";
import { Reveal, RevealGroup, RevealItem } from "@/components/motion/reveal";
import {
  getGalleries,
  getGalleryPhotoCounts,
  getSectionHeading,
} from "@/lib/content/resolvers";
import type { GalleryView } from "@/lib/content/resolvers";
import { cn } from "@/lib/utils";

/**
 * The gallery section: one card per collection, side by side.
 *
 * This replaces the two ambient carousels that used to sit here. Those
 * showed photographs with no way to say what any of them were and no way to
 * see the rest; a card that names the collection and links to it does both,
 * and the photographs get a page with room to carry their own captions.
 *
 * Two-up on desktop by design, but the grid is driven by the row count
 * rather than hardcoded to two — a third gallery added in the admin lands
 * in a sensible layout instead of breaking the row.
 *
 * Renders nothing when there are no galleries. An empty gallery section is
 * worse than no gallery section.
 */
export async function GalleryShowcase({ className }: { className?: string }) {
  const [galleries, counts, heading] = await Promise.all([
    getGalleries(),
    getGalleryPhotoCounts(),
    getSectionHeading("gallery"),
  ]);

  if (galleries.length === 0) return null;

  return (
    <section className={cn("section", className)}>
      <Container className="flex flex-col gap-12 sm:gap-14">
        <Reveal>
          <SectionHeading
            eyebrow={heading?.eyebrow ?? "Gallery"}
            eyebrowTone={heading?.eyebrowTone}
            title={heading?.title ?? "Moments from the programmes"}
            description={
              heading?.description ??
              "A running look at the people and the work — cohorts, sessions and the days that do not make it into a case study."
            }
          />
        </Reveal>

        <RevealGroup
          as="ul"
          stagger={0.08}
          className={cn(
            "grid gap-6 sm:gap-8",
            galleries.length === 1 ? "lg:grid-cols-1" : "lg:grid-cols-2"
          )}
        >
          {galleries.map((gallery) => (
            <RevealItem key={gallery.slug} as="li" className="flex">
              <GalleryCard gallery={gallery} photoCount={counts[gallery.slug] ?? 0} />
            </RevealItem>
          ))}
        </RevealGroup>
      </Container>
    </section>
  );
}

/**
 * One gallery, as a card: image well, then name, then the "what is it" line,
 * then the action pinned bottom-right.
 *
 * `mt-auto` on the action row is what actually holds the button to the
 * bottom — the two cards carry descriptions of different lengths, and
 * without it each button would float directly under its own paragraph and
 * the pair would sit at visibly different heights.
 */
function GalleryCard({
  gallery,
  photoCount,
}: {
  gallery: GalleryView;
  photoCount: number;
}) {
  return (
    <article className="card card-hover group/gal flex w-full flex-col overflow-hidden">
      {/* Laid out whether or not a cover exists yet, so uploading one later
          never resizes the row. */}
      <div
        className={cn(
          "relative aspect-16/10 w-full shrink-0 overflow-hidden",
          !gallery.coverImage && "bg-text-primary/4"
        )}
      >
        {gallery.coverImage ? (
          <Image
            src={gallery.coverImage}
            alt=""
            fill
            sizes="(min-width: 1024px) 50vw, 100vw"
            className="object-cover object-center transition-transform duration-700 ease-out-expo group-hover/gal:scale-[1.03] motion-reduce:transition-none motion-reduce:group-hover/gal:scale-100"
          />
        ) : (
          <span
            aria-hidden
            className="absolute inset-0 flex items-center justify-center text-text-primary/15"
          >
            <svg viewBox="0 0 24 24" className="h-12 w-12" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <rect x="3" y="4" width="18" height="16" rx="2.5" />
              <circle cx="8.5" cy="9.5" r="1.5" />
              <path d="m4 17 4.5-4.5a2 2 0 0 1 2.8 0L16 17" />
            </svg>
          </span>
        )}
      </div>

      <div className="flex flex-1 flex-col p-6 sm:p-8">
        <h3 className="text-[22px] font-semibold leading-tight tracking-[-0.02em] text-text-primary sm:text-[26px]">
          {gallery.name}
        </h3>
        <p className="mt-3 text-[15px] leading-relaxed text-text-secondary text-pretty sm:text-base">
          {gallery.description}
        </p>

        {/* Bottom row: the count sits left so the button has something to be
            aligned against, rather than floating alone at the edge. */}
        <div className="mt-auto flex items-end justify-between gap-4 pt-8">
          <p className="text-[13px] font-medium text-text-muted">
            {photoCount > 0
              ? `${photoCount} ${photoCount === 1 ? "photo" : "photos"}`
              : "Coming soon"}
          </p>
          <Button
            href={`/gallery/${gallery.slug}`}
            variant="pill-outline"
            size="md"
            className="shrink-0"
          >
            {gallery.ctaLabel?.trim() || "View Gallery"}
          </Button>
        </div>
      </div>
    </article>
  );
}
