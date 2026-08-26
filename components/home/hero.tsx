import { HeroSlides, type HeroSlide } from "@/components/home/hero-slides";
import { cn } from "@/lib/utils";
import type { HomeHeroData } from "@/lib/content/schemas";

/**
 * The hero: a flat ink field, copy set hard left, and a numbered rail across
 * the foot that advances through what KodeDristi actually sells.
 *
 * Left-aligned, not centred. Centred copy over a full-bleed field has no
 * anchor and drifts with the viewport; a left edge shared with every section
 * below gives the page one spine to read down.
 *
 * The ground is a single solid colour on purpose — no gradient, no wash, no
 * blend. Depth here comes from the type scale and from the ink field meeting
 * the light page beneath it, not from colour fading into colour.
 *
 * Rotation and its rail live in the client island; everything else, including
 * the CMS read, stays on the server.
 */
export function Hero({
  content,
  slides,
  className,
}: {
  content: HomeHeroData;
  slides: HeroSlide[];
  className?: string;
}) {
  /* The singleton hero is the fallback when no slides exist, so the section
     can never render empty and an admin who deletes every slide gets the
     original one-message hero back rather than a hole. */
  const resolved: HeroSlide[] =
    slides.length > 0
      ? slides
      : [
          {
            slug: "main",
            label: "Build with us",
            title: content.title,
            paragraph: content.paragraph,
            ctaLabel: content.primaryLabel,
            ctaHref: content.primaryHref,
          },
        ];

  return (
    <section className={cn("relative isolate overflow-hidden bg-surface-ink", className)}>
      <HeroSlides slides={resolved} />
    </section>
  );
}
