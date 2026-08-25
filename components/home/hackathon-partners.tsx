import Image from "next/image";
import { Container } from "@/components/ui/container";
import { SectionHeading } from "@/components/ui/section-heading";
import { Button } from "@/components/ui/button";
import { Reveal, RevealGroup, RevealItem } from "@/components/motion/reveal";
import { showcaseGridOuter } from "@/components/ui/showcase-card";
import { getHackathonPartners, getSectionHeading } from "@/lib/content/resolvers";
import type { HackathonPartnerData } from "@/lib/content/schemas";
import { cn } from "@/lib/utils";

/**
 * The partner wall that follows the hackathon banner.
 *
 * Deliberately a filled band inset by the same gutter as the banner above,
 * not a full-width `.section`: the two read as one programme block that way,
 * and a logo wall floated on the page background has nothing to hold it
 * together.
 *
 * The marks sit straight on the panel fill with no tile behind them. The
 * band is the only surface in play, so it carries the separation from the
 * page on its own — which it does in both themes, page → panel.
 *
 * Renders nothing when the list is empty. A sponsor wall with no sponsors is
 * worse than no sponsor wall.
 */
export async function HackathonPartners({ className }: { className?: string }) {
  const [partners, heading] = await Promise.all([
    getHackathonPartners(),
    getSectionHeading("hackathon-partners"),
  ]);

  if (partners.length === 0) return null;

  return (
    <section className={cn("py-3 sm:py-4", className)}>
      {/* Horizontal gutter only — the vertical rhythm comes from the section,
          exactly as the banner above sets it, so the seam between the two is
          the same one that runs between showcase tiles. */}
      <div className={cn(showcaseGridOuter, "py-0")}>
        <div className="bg-background-secondary py-14 sm:py-20">
          <Container className="flex flex-col gap-12 sm:gap-14">
            <Reveal className="flex flex-col items-start justify-between gap-6 sm:flex-row sm:items-end">
              <SectionHeading
                eyebrow={heading?.eyebrow ?? "Hackathon Partners"}
                eyebrowTone={heading?.eyebrowTone ?? "green"}
                title={heading?.title ?? "The organisations behind the hackathon"}
                description={
                  heading?.description ??
                  "Sponsors, academic hosts and community partners who put up the prizes, the mentors and the rooms."
                }
              />
              <Button href="/contact" variant="pill-outline" size="lg" className="shrink-0">
                Become a partner
              </Button>
            </Reveal>

            {/* Two up on a phone so a wordmark still gets a readable line
                length, four on desktop so a long roster stays two rows. */}
            <RevealGroup
              as="ul"
              stagger={0.04}
              className="grid grid-cols-2 gap-x-8 gap-y-12 sm:grid-cols-3 sm:gap-x-12 lg:grid-cols-4"
            >
              {partners.map((partner) => (
                <RevealItem key={partner.slug} as="li" className="flex">
                  <PartnerTile partner={partner} />
                </RevealItem>
              ))}
            </RevealGroup>
          </Container>
        </div>
      </div>
    </section>
  );
}

const tileClasses =
  "flex w-full flex-col items-center justify-center text-center";

/**
 * One partner: the mark and nothing else.
 *
 * No panel behind it — give every logo its own tile and the wall reads as a
 * grid of boxes rather than as a row of partners. The fixed well is what
 * holds the alignment instead: a tall logo, a wide logo and a plain wordmark
 * all occupy the same optical height, so the row scans as one line rather
 * than as ransom-note.
 */
function PartnerTile({ partner }: { partner: HackathonPartnerData & { slug: string } }) {
  const mark = (
    <>
      <div className="relative flex h-16 w-full items-center justify-center sm:h-20">
        {partner.logo ? (
          <Image
            src={partner.logo}
            alt={partner.name}
            fill
            sizes="(min-width: 1024px) 20vw, (min-width: 640px) 28vw, 42vw"
            className="object-contain object-center"
          />
        ) : (
          /* No logo yet: set the name as a wordmark rather than show a
             placeholder glyph. It is the partner's name either way, so the
             tile is finished, not pending. */
          <span className="text-[17px] font-semibold leading-tight tracking-[-0.02em] text-balance text-text-primary sm:text-[19px]">
            {partner.name}
          </span>
        )}
      </div>

      {partner.tier && (
        <p className="mt-4 text-[11px] font-semibold uppercase tracking-wider text-text-muted sm:text-xs">
          {partner.tier}
        </p>
      )}
    </>
  );

  if (partner.url?.trim()) {
    return (
      <a
        href={partner.url}
        target="_blank"
        rel="noreferrer noopener"
        className={cn(
          tileClasses,
          /* `.card-hover` warms a fill; there is no fill any more, so the
             mark itself is what responds. */
          "focus-ring transition-opacity duration-ui ease-out-quint hover:opacity-70"
        )}
      >
        {mark}
      </a>
    );
  }

  return <div className={tileClasses}>{mark}</div>;
}
