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
 * Panel band outside, white cards inside. Three surfaces in sequence — page,
 * panel, card — which is the pairing the rest of the site uses and the only
 * one that holds up in both themes. The cards also give every logo the white
 * ground it was drawn for, which a tinted panel does not.
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
                eyebrow={heading?.eyebrow ?? "Partners"}
                eyebrowTone={heading?.eyebrowTone ?? "green"}
                title={heading?.title ?? "Trusted By Leading Organizations"}
                description={
                  heading?.description ??
                  "Institutions, sponsors and community partners we build, teach and run programmes with."
                }
              />
              <Button href="/contact" variant="pill-outline" size="lg" className="shrink-0">
                Become a partner
              </Button>
            </Reveal>

            {/* Two up on a phone, then three, then four. The gap is uniform
                in both axes now that these are cards again — the old
                asymmetric gutters existed to separate bare marks floating on
                the panel, and a card supplies its own edge. */}
            <RevealGroup
              as="ul"
              stagger={0.04}
              className="grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4 lg:grid-cols-4"
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
  "flex h-full w-full flex-col items-center justify-center gap-3 px-4 py-7 text-center sm:px-5 sm:py-8";

/**
 * One partner, as a card.
 *
 * Every mark gets the same box and the same fixed well, which is the only
 * thing that makes a mixed roster — a wide wordmark, a square badge, a name
 * with no logo at all — read as one set rather than as whatever each partner
 * happened to send. The card supplies the edge, so the marks no longer need
 * exaggerated gutters to look separated.
 *
 * White surface with a drawn border, matching the project cards: on a panel
 * band the fill alone would not separate them, and a logo needs a white
 * ground far more than a tinted one.
 */
function PartnerTile({ partner }: { partner: HackathonPartnerData & { slug: string } }) {
  const mark = (
    <>
      <div className="relative flex h-12 w-full items-center justify-center sm:h-14">
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
          <span className="text-[15px] font-semibold leading-tight tracking-[-0.02em] text-balance text-text-primary sm:text-[17px]">
            {partner.name}
          </span>
        )}
      </div>

      {/* Always rendered, even when empty. Only some partners carry a tier,
          and letting the line appear and vanish made rows of cards differ in
          height by ~30px — which is exactly the raggedness a uniform card
          grid exists to remove. An empty paragraph reserves the space and
          announces nothing. */}
      <p className="min-h-[15px] text-[10px] font-semibold uppercase leading-[15px] tracking-wider text-text-muted sm:min-h-[17px] sm:text-[11px] sm:leading-[17px]">
        {partner.tier}
      </p>
    </>
  );

  const surface =
    "rounded-[var(--radius-tile)] border border-brand-blue/15 bg-white transition-colors duration-ui ease-out-quint";

  if (partner.url?.trim()) {
    return (
      <a
        href={partner.url}
        target="_blank"
        rel="noreferrer noopener"
        className={cn(tileClasses, surface, "focus-ring hover:border-brand-blue/50")}
      >
        {mark}
      </a>
    );
  }

  return <div className={cn(tileClasses, surface)}>{mark}</div>;
}
