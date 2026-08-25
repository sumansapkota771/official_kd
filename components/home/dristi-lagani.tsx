import { Container } from "@/components/ui/container";
import { Button } from "@/components/ui/button";
import { Reveal } from "@/components/motion/reveal";
import { getHomeLaganiData } from "@/lib/content/resolvers";
import { listContent } from "@/lib/content/store";
import { SectionBackdropSlideshow } from "@/components/home/section-backdrop-slideshow";
import { showcaseGridOuter } from "@/components/ui/showcase-card";
import type { LaganiSlideshowData } from "@/lib/content/schemas";
import { cn } from "@/lib/utils";

/**
 * The Dristi Lagani banner — the investment programme's counterpart to the
 * hackathon banner, and deliberately built the same way: full-bleed picture,
 * copy in a left column at the foot of the frame, no panel behind the text.
 *
 * The two are siblings on the homepage, so matching them is the point. A
 * second programme banner invented in its own style would read as a different
 * site rather than as the other half of a pair.
 */
export async function DristiLagani({ className }: { className?: string }) {
  const content = await getHomeLaganiData();

  let slideshowImages: LaganiSlideshowData[] = [];
  let slideshowSettings: { intervalSeconds: number; autoPlay: boolean } | null = null;

  try {
    const images = await listContent<LaganiSlideshowData>("lagani-slideshow-image");
    slideshowImages = images.map((item) => item.data);

    const settings = await listContent<{
      intervalSeconds: number;
      autoPlay: boolean;
    }>("lagani-slideshow-settings");
    if (settings.length > 0) {
      slideshowSettings = settings[0].data;
    }
  } catch {
    // Slideshow data not available — the banner falls back to its ink ground.
  }

  const points = [content.point1, content.point2].filter(Boolean);

  return (
    <section className={cn("py-3 sm:py-4", className)}>
      <div className={cn(showcaseGridOuter, "py-0")}>
        <div
          className={cn(
            "relative isolate flex flex-col overflow-hidden rounded-[var(--radius-tile)]",
            /* Ink ground underneath: with no images set the banner is still a
               dark band rather than white copy on nothing. */
            "bg-surface-ink",
            /* Same 2:1 letterbox as the hackathon banner, with the same floor
               so the copy still fits on a phone. */
            "min-h-[max(560px,50vw)]"
          )}
        >
          <SectionBackdropSlideshow
            slides={slideshowImages}
            intervalSeconds={Number(slideshowSettings?.intervalSeconds) || 6}
            autoPlay={slideshowSettings?.autoPlay !== false}
          >
            <div aria-hidden className="grow" />

            <Container className="pb-10 sm:pb-12 lg:pb-14">
              <Reveal className="max-w-xl">
                {content.badge && (
                  <p className="text-[13px] font-semibold uppercase tracking-[0.16em]">
                    {content.badge}
                  </p>
                )}

                {/* `text-inherit` is required: the base layer gives h1-h6 an
                    explicit colour, which beats inheritance from the tone
                    wrapper that follows the active slide. */}
                <h2 className="mt-4 text-[40px] font-extrabold leading-[0.95] tracking-[-0.025em] text-inherit text-balance sm:text-[56px] lg:text-[68px]">
                  {content.title}
                </h2>

                <p className="mt-5 max-w-lg text-[19px] leading-[1.35] text-pretty sm:text-[21px]">
                  {content.description}
                </p>

                {points.length > 0 && (
                  <p className="mt-4 text-[15px] opacity-80">{points.join("  ·  ")}</p>
                )}

                <div className="mt-8">
                  {/* The fill flips with the active slide through a
                      data-attribute variant, so the button stays
                      server-rendered. */}
                  <Button
                    href={content.ctaHref}
                    variant="banner"
                    size="lg"
                    className="group-data-[tone=dark]/tone:bg-surface-ink group-data-[tone=dark]/tone:text-white group-data-[tone=dark]/tone:hover:bg-surface-ink/90"
                  >
                    {content.ctaLabel}
                  </Button>
                </div>
              </Reveal>
            </Container>
          </SectionBackdropSlideshow>
        </div>
      </div>
    </section>
  );
}
