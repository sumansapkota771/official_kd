import Image from "next/image";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type Tone = "light" | "ink";

export type ShowcaseAction = { label: string; href: string };

/**
 * Layout for a showcase grid, kept as classes rather than a wrapper component
 * so the home sections can hand the inner class to `RevealGroup` and get the
 * motion, while plain pages hand it to a `div` — one definition either way.
 *
 * The outer padding equals the inner gap on purpose: the frame around the
 * pair then reads as the same seam that runs between them, which is what
 * makes a full-bleed pair look deliberate rather than merely wide.
 */
export const showcaseGridOuter = "p-3 sm:p-4";
export const showcaseGridInner = "grid gap-3 sm:gap-4 lg:grid-cols-2";

/**
 * Checkerboards light and ink down a two-column grid so a long run has a
 * rhythm instead of reading as one slab.
 */
export function showcaseTone(i: number): Tone {
  return (Math.floor(i / 2) + (i % 2)) % 2 === 1 ? "ink" : "light";
}

/**
 * The full-bleed showcase tile: centred copy stacked above an image well,
 * two per row, sized so a pair fills the viewport.
 *
 * The image well is always laid out, image or not. Reserving it up front is
 * the whole point — artwork can be dropped in later without the grid
 * resizing, and an empty tile still reads as a finished object rather than a
 * broken one.
 *
 * Copy runs at full strength rather than muted: at this scale a grey subhead
 * under a 36px headline reads as unfinished, not as hierarchy. The size gap
 * is already doing that work.
 */
export function ShowcaseCard({
  eyebrow,
  title,
  description,
  meta,
  href,
  actionLabel = "Learn more",
  secondary,
  tone = "light",
  image,
  imageAlt = "",
  imageFit = "cover",
  className,
}: {
  eyebrow?: string;
  title: string;
  description?: string;
  meta?: React.ReactNode;
  href: string;
  actionLabel?: string;
  secondary?: ShowcaseAction;
  tone?: Tone;
  image?: string;
  imageAlt?: string;
  imageFit?: "cover" | "contain";
  className?: string;
}) {
  const isInk = tone === "ink";

  return (
    <article
      className={cn(
        "group/tile relative isolate flex min-h-[580px] w-full flex-col overflow-hidden text-center sm:min-h-[700px] lg:min-h-[780px]",
        isInk ? "card-ink" : "card card-hover",
        className
      )}
    >
      <div className="px-6 pt-9 pb-8 sm:px-10 sm:pt-10">
        {eyebrow && (
          <p
            className={cn(
              "mb-3 text-[17px] font-semibold tracking-[-0.01em]",
              isInk ? "text-tile-ink-accent" : "text-link"
            )}
          >
            {eyebrow}
          </p>
        )}

        <h3
          className={cn(
            "text-[24px] font-semibold leading-[1.08] tracking-[-0.02em] text-balance sm:text-[30px] lg:text-[36px]",
            isInk ? "text-white" : "text-text-primary"
          )}
        >
          {title}
        </h3>

        {description && (
          <p
            className={cn(
              "mx-auto mt-3 max-w-[36ch] text-[16px] leading-[1.35] tracking-[-0.01em] text-pretty sm:text-[17px] lg:text-[18px]",
              isInk ? "text-white" : "text-text-primary"
            )}
          >
            {description}
          </p>
        )}

        {meta && (
          <div
            className={cn(
              "mt-5 flex flex-wrap items-center justify-center gap-x-5 gap-y-2 text-[15px]",
              isInk ? "text-white/70" : "text-text-muted"
            )}
          >
            {meta}
          </div>
        )}

        <div className="mt-7 flex flex-wrap items-center justify-center gap-3">
          {/* Stretched: the ::after is the tile-wide hit area.
              `after:z-1` is load-bearing. The image well below is
              `position: relative` (next/image `fill` needs it) and comes
              later in DOM order, so at z-auto it paints over this overlay
              and swallows every click on the bottom half of the tile. */}
          <Button
            href={href}
            variant={isInk ? "pill-ink" : "pill"}
            size="md"
            className="after:absolute after:inset-0 after:z-1 after:content-['']"
          >
            {actionLabel}
          </Button>
          {secondary && (
            /* Above the overlay, or the primary action eats this click. */
            <Button
              href={secondary.href}
              variant={isInk ? "pill-ink-outline" : "pill-outline"}
              size="md"
              className="z-2"
            >
              {secondary.label}
            </Button>
          )}
        </div>
      </div>

      {/* Image well — laid out whether or not there is an image yet. */}
      <div
        data-image-slot
        className={cn(
          "relative mt-auto min-h-[260px] w-full flex-1 sm:min-h-[320px]",
          !image && (isInk ? "bg-white/4" : "bg-text-primary/4")
        )}
      >
        {image ? (
          <Image
            src={image}
            alt={imageAlt}
            fill
            sizes="(min-width: 1024px) 50vw, (min-width: 640px) 50vw, 100vw"
            className={cn(
              imageFit === "contain" ? "object-contain" : "object-cover",
              "object-center"
            )}
          />
        ) : (
          <PlaceholderGlyph isInk={isInk} />
        )}
      </div>
    </article>
  );
}

/**
 * Marks an empty image well without shouting "broken". Faint enough to look
 * deliberate if a tile ships before its artwork does.
 */
function PlaceholderGlyph({ isInk }: { isInk: boolean }) {
  return (
    <span
      aria-hidden
      className={cn(
        "absolute inset-0 flex items-center justify-center",
        isInk ? "text-white/12" : "text-text-primary/12"
      )}
    >
      <svg
        viewBox="0 0 24 24"
        className="h-12 w-12"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <rect x="3" y="4" width="18" height="16" rx="2.5" />
        <circle cx="8.5" cy="9.5" r="1.5" />
        <path d="m4 17 4.5-4.5a2 2 0 0 1 2.8 0L16 17" />
        <path d="m14.5 15.5 1.8-1.8a2 2 0 0 1 2.8 0L20 15" />
      </svg>
    </span>
  );
}
