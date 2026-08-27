import { Container } from "@/components/ui/container";
import { SectionHeading } from "@/components/ui/section-heading";
import { Button } from "@/components/ui/button";
import { Reveal, RevealGroup, RevealItem } from "@/components/motion/reveal";
import { getHackathonPartners, getSectionHeading } from "@/lib/content/resolvers";
import type { HackathonPartnerData } from "@/lib/content/schemas";
import { cn } from "@/lib/utils";

const ROW_COUNT = 4;

/**
 * Splits the roster into `ROW_COUNT` roughly-even groups, front-loaded (a
 * remainder lands on the last row rather than the first) — the row count is
 * a layout decision independent of how many partners happen to exist, so it
 * has to hold whether the roster has 8 or 80, not just the current 19.
 */
function chunkIntoRows<T>(items: T[], rows: number): T[][] {
  const perRow = Math.ceil(items.length / rows);
  const result: T[][] = [];
  for (let i = 0; i < items.length; i += perRow) {
    result.push(items.slice(i, i + perRow));
  }
  return result;
}

/**
 * The partner wall that follows the hackathon banner.
 *
 * A bare logo wall on the page's own white, not a tinted panel of cards —
 * every mark sits at its own natural size on a shared baseline height, the
 * way a press/"as seen in" strip is conventionally built. No border, no
 * fill, no per-mark caption: the marks alone are what a wall like this is
 * for, and a card around each one would be furniture the reference design
 * does not have.
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
    <section className={cn("section", className)}>
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

        {/* Four explicit rows, not a single flex-wrap list left to break
            wherever the viewport happens to end a line — each row is its own
            list (an outer <ul> holding grouped <div>s of <li>s is not valid
            markup), so the stagger animation runs per row too.

            Each row is a grid of exactly as many equal-width columns as it
            has marks, not a flex row sized to content — flex-wrap left every
            row only as wide as its own logos plus gaps, so the shorter rows
            stopped well short of the right edge instead of lining up under
            the ones above them. Equal `1fr` tracks stretch every row to the
            full container width and keep columns aligned down the section;
            each mark still sits at the *start* of its own column rather than
            being centred or stretched, so the row reads as a wall of marks,
            not a wall of boxes. */}
        <div className="flex flex-col gap-y-8 sm:gap-y-10">
          {chunkIntoRows(partners, ROW_COUNT).map((row, i) => (
            <div key={i} style={{ "--row-cols": row.length } as React.CSSProperties}>
              <RevealGroup
                as="ul"
                stagger={0.03}
                className="grid grid-cols-2 items-center justify-items-start gap-x-6 gap-y-6 sm:grid-cols-3 sm:gap-x-10 lg:grid-cols-[repeat(var(--row-cols),1fr)] lg:gap-x-14"
              >
                {row.map((partner) => (
                  <RevealItem key={partner.slug} as="li" className="flex">
                    <PartnerMark partner={partner} />
                  </RevealItem>
                ))}
              </RevealGroup>
            </div>
          ))}
        </div>
      </Container>
    </section>
  );
}

/**
 * One partner, as a bare mark.
 *
 * A plain `<img>`, not `next/image`: the fixed-box `fill` approach forces
 * every logo into the same width and height, which is exactly the uniform
 * card footprint this redesign is dropping. A fixed *height* with `w-auto`
 * lets each mark keep its own natural proportions — a wordmark reads wide,
 * a badge reads square — while every mark still sits on the same baseline,
 * which is what actually reads as "one wall" rather than the box did.
 */
function PartnerMark({ partner }: { partner: HackathonPartnerData & { slug: string } }) {
  const mark = partner.logo ? (
    <img
      src={partner.logo}
      alt={partner.name}
      className="h-9 w-auto object-contain sm:h-11"
      loading="lazy"
    />
  ) : (
    /* No logo yet: set the name as a wordmark rather than show a
       placeholder glyph. It is the partner's name either way. */
    <span className="text-[15px] font-semibold leading-tight tracking-[-0.02em] text-text-primary sm:text-[17px]">
      {partner.name}
    </span>
  );

  if (partner.url?.trim()) {
    return (
      <a
        href={partner.url}
        target="_blank"
        rel="noreferrer noopener"
        className="focus-ring flex items-center opacity-90 transition-opacity duration-ui ease-out-quint hover:opacity-100"
      >
        {mark}
      </a>
    );
  }

  return <div className="flex items-center">{mark}</div>;
}
