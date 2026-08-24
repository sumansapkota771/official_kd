import { Container } from "@/components/ui/container";
import { Button } from "@/components/ui/button";
import { Reveal } from "@/components/motion/reveal";
import { getHomeFlagshipData } from "@/lib/content/resolvers";
import { listContent } from "@/lib/content/store";
import { SectionBackdropSlideshow } from "@/components/home/section-backdrop-slideshow";
import { showcaseGridOuter } from "@/components/ui/showcase-card";
import type { HackathonSlideshowData } from "@/lib/content/schemas";
import { cn } from "@/lib/utils";

/**
 * Full-bleed programme banner: the picture is the section, and the copy sits
 * in a left column over a wash that clears by mid-frame.
 *
 * There is no panel behind the text. A filled card would cover the third of
 * the image people actually look at, which is the opposite of what a banner
 * is for — the gradient does the same legibility job while leaving the
 * photograph intact.
 */
export async function FlagshipProgram({ className }: { className?: string }) {
  const content = await getHomeFlagshipData();

  let slideshowImages: HackathonSlideshowData[] = [];
  let slideshowSettings: { intervalSeconds: number; autoPlay: boolean } | null =
    null;

  try {
    const images = await listContent<{
      imageUrl: string;
      mobileImageUrl?: string;
      displayOrder: number;
    }>("hackathon-slideshow-image");
    slideshowImages = images.map((item) => item.data);

    const settings = await listContent<{
      intervalSeconds: number;
      autoPlay: boolean;
    }>("hackathon-slideshow-settings");
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
            /* 16:8 — half the width, so the banner is a 2:1 letterbox.
               `max()` against a floor because a strict ratio collapses on a
               phone: 50vw of a 390px screen is 195px, nowhere near enough for
               the copy. And it stays a *min*-height rather than
               `aspect-[2/1]`, so an unusually long headline stretches the
               banner instead of being clipped by the overflow-hidden. */
            "min-h-[max(560px,50vw)]",
          )}
        >
          <SectionBackdropSlideshow
            slides={slideshowImages}
            intervalSeconds={Number(slideshowSettings?.intervalSeconds) || 6}
            autoPlay={slideshowSettings?.autoPlay !== false}
          >
            {/* Pushes the copy to the foot of the frame.
              This used to carry a fixed 70%-of-height floor to force the copy
              into the bottom third, but a floor and a fixed ratio cannot both
              hold — the floor would make the banner taller than 2:1 on every
              screen. The ratio wins, so the spacer just absorbs whatever the
              copy does not use, and how far down the copy sits follows from
              the viewport width. */}
            <div aria-hidden className="grow" />

            <Container className="pb-10 sm:pb-12 lg:pb-14">
              <Reveal className="max-w-xl">
                {content.badge && (
                  <p className="text-[13px] font-semibold uppercase tracking-[0.16em]">
                    {content.badge}
                  </p>
                )}

                {/* `text-inherit` is required on the heading specifically: the
                  base layer gives h1-h6 an explicit colour, which beats
                  inheritance from the tone wrapper. */}
                <h2 className="mt-4 text-[40px] font-extrabold leading-[0.95] tracking-[-0.025em] text-inherit text-balance sm:text-[56px] lg:text-[68px]">
                  {content.title}
                </h2>

                <p className="mt-5 max-w-lg text-[19px] leading-[1.35] text-pretty sm:text-[21px]">
                  {content.description}
                </p>

                {points.length > 0 && (
                  <p className="mt-4 text-[15px] opacity-80">
                    {points.join("  ·  ")}
                  </p>
                )}

                <div className="mt-8">
                  {/* The fill flips with the active slide. Done through a
                    data-attribute variant rather than state so the button
                    stays server-rendered — the group-data selector carries
                    higher specificity than the variant's own colours. */}
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
