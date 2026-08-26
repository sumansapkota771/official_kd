import { Container } from "@/components/ui/container";
import { SectionHeading } from "@/components/ui/section-heading";
import { Reveal } from "@/components/motion/reveal";
import { FeaturedCarousel } from "@/components/home/featured-carousel";
import { getFeaturedItems, getSectionHeading } from "@/lib/content/resolvers";
import { cn } from "@/lib/utils";

/**
 * The featured-content gallery: two independent, self-driving image rows,
 * stacked — a large three-image row above a denser six-image row.
 *
 * The two rows share one content type (`featured-item`) and are told apart
 * purely by `row`, then rendered through the same `FeaturedCarousel` at two
 * different `size` settings. A row with nothing in it simply does not
 * render — the two are independent, so the top row can be live while the
 * bottom is still empty, or the reverse.
 *
 * Each row is a plain, decorative, self-driving strip — no arrows, dots or
 * pause control, and no per-card title/description/CTA. That is not this
 * component under-using a richer card type; the brief for this pass is
 * explicitly an ambient image row, so the extra fields on `featured-item`
 * (category, CTA, badge, metadata) simply go unread here.
 *
 * The heading stays inside the page's normal Container; the two rows sit
 * outside it, full viewport width — a carousel that peters out at the same
 * margin as body copy reads as a content block, not as the edge-to-edge
 * strip this is meant to be.
 */
export async function FlagshipGallerySection({ className }: { className?: string }) {
  const [items, heading] = await Promise.all([
    getFeaturedItems(),
    getSectionHeading("flagship-gallery"),
  ]);

  const top = items.filter((i) => i.row !== "bottom");
  const bottom = items.filter((i) => i.row === "bottom");

  if (top.length === 0 && bottom.length === 0) return null;

  return (
    <section className={cn("section", className)}>
      <Container className="mb-10 sm:mb-14">
        <Reveal>
          <SectionHeading
            eyebrow={heading?.eyebrow ?? "Gallery"}
            eyebrowTone={heading?.eyebrowTone}
            title={heading?.title ?? "Moments from the programme"}
            description={
              heading?.description ??
              "A running look at the people and the work — cohorts, sessions and the days that do not make it into a case study."
            }
          />
        </Reveal>
      </Container>

      {/* The same gap value drives every seam here — between images within
          a row, and between the top row and the bottom row — so the whole
          block reads as one uniform grid of spacing rather than a loose
          horizontal rhythm sitting inside a generous vertical one. */}
      <div className="flex w-full flex-col gap-3 sm:gap-4">
        {top.length > 0 && <FeaturedCarousel items={top} size="large" />}
        {bottom.length > 0 && <FeaturedCarousel items={bottom} size="small" />}
      </div>
    </section>
  );
}
