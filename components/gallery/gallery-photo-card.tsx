import Image from "next/image";
import type { GalleryPhotoView } from "@/lib/content/resolvers";
import { cn } from "@/lib/utils";

/**
 * One photograph in a gallery.
 *
 * The caption behaves differently by input, not by screen size in the
 * decorative sense: on a device with a real pointer the photo carries the
 * frame alone and the caption arrives on hover, while on a touch screen
 * there is no hover to reveal it with, so the caption is simply always
 * there beneath the image.
 *
 * That split is done with `lg:` rather than a media query on `hover:` for a
 * deliberate reason — the caption is content, and it has to be laid out and
 * readable at every width even in the cases `any-hover` gets wrong (a
 * touchscreen laptop, a tablet with a trackpad). At narrow widths it is
 * plain static text under the picture; only at `lg` and up does it become an
 * overlay that hides until hovered.
 *
 * `group-focus-within` mirrors every hover rule so the caption is reachable
 * by keyboard, and the overlay is moved with `opacity`/`translate` rather
 * than `hidden`, so it stays in the accessibility tree and is announced
 * normally whatever the pointer is doing.
 */
export function GalleryPhotoCard({ photo }: { photo: GalleryPhotoView }) {
  const hasCaption = Boolean(photo.title || photo.description);

  return (
    <figure
      className={cn(
        "group/photo relative isolate flex w-full flex-col overflow-hidden",
        "rounded-[var(--radius-tile)] border border-brand-blue/15 bg-surface",
        "transition-colors duration-ui ease-out-quint hover:border-brand-blue/50",
        "focus-within:border-brand-blue/50"
      )}
    >
      <div className="relative aspect-4/3 w-full overflow-hidden bg-background-secondary">
        <Image
          src={photo.image}
          alt={photo.title || ""}
          fill
          sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
          className={cn(
            "object-cover object-center",
            "transition-transform duration-700 ease-out-expo",
            "group-hover/photo:scale-[1.04] group-focus-within/photo:scale-[1.04]",
            "motion-reduce:transition-none motion-reduce:group-hover/photo:scale-100"
          )}
        />

        {/* Desktop overlay. Hidden below lg, where the caption is rendered as
            static text instead — two presentations of the same content, only
            ever one of them visible at a time. */}
        {hasCaption && (
          <figcaption
            className={cn(
              "absolute inset-x-0 bottom-0 hidden p-5 lg:block",
              /* Its own ground: the photograph behind it is arbitrary, so
                 legibility cannot depend on what happens to be in the
                 picture at that corner. */
              "bg-surface-ink/92",
              "translate-y-full transition-transform duration-500 ease-out-expo",
              "group-hover/photo:translate-y-0 group-focus-within/photo:translate-y-0",
              /* Reduced motion keeps the reveal but drops the travel. */
              "motion-reduce:translate-y-0 motion-reduce:opacity-0",
              "motion-reduce:transition-opacity motion-reduce:group-hover/photo:opacity-100",
              "motion-reduce:group-focus-within/photo:opacity-100"
            )}
          >
            <p className="text-[15px] font-semibold leading-snug text-white text-pretty">
              {photo.title}
            </p>
            {photo.description && (
              <p className="mt-1.5 text-[13px] leading-relaxed text-white/75 text-pretty">
                {photo.description}
              </p>
            )}
          </figcaption>
        )}
      </div>

      {/* Mobile / tablet caption — always visible, because there is no hover
          to reveal the overlay above with. */}
      {hasCaption && (
        <figcaption className="flex flex-col gap-1.5 p-4 sm:p-5 lg:hidden">
          <p className="text-[15px] font-semibold leading-snug tracking-[-0.01em] text-text-primary text-pretty">
            {photo.title}
          </p>
          {photo.description && (
            <p className="text-[13px] leading-relaxed text-text-muted text-pretty">
              {photo.description}
            </p>
          )}
        </figcaption>
      )}
    </figure>
  );
}
