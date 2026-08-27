import Image from "next/image";
import { Container } from "@/components/ui/container";
import { SectionHeading } from "@/components/ui/section-heading";
import { Reveal, RevealGroup, RevealItem } from "@/components/motion/reveal";
import { getMouPartnerships, getSectionHeading } from "@/lib/content/resolvers";
import type { MouPartnershipData } from "@/lib/content/schemas";
import { cn } from "@/lib/utils";

/**
 * Signed agreements with universities and colleges.
 *
 * The artefact leads: each card carries the institution's own mark, and the
 * explanation of what the agreement actually permits is held back until
 * hover or focus. That ordering is deliberate — a wall of paragraphs about
 * partnership reads as marketing, whereas a wall of institutional marks
 * reads as evidence, and the words are there the moment anyone wants them.
 *
 * Every mark is `object-contain`, never cropped, inside a fixed well — the
 * roster mixes near-square crests with whatever aspect a given institution's
 * logo happens to be, and letting `object-cover` fill the box the way a
 * photograph would sliced pieces off some of them.
 *
 * Hidden until real agreements exist. Naming an institution KodeDristi has
 * not signed with would be a false claim about somebody else.
 */
export async function AcademiaPartnership({ className }: { className?: string }) {
  const [mous, heading] = await Promise.all([
    getMouPartnerships(),
    getSectionHeading("academia-partnership"),
  ]);

  if (mous.length === 0) return null;

  return (
    <section className={cn("section", className)}>
      <Container className="flex flex-col gap-12">
        <Reveal>
          <SectionHeading
            eyebrow={heading?.eyebrow ?? "Academia"}
            eyebrowTone={heading?.eyebrowTone}
            title={heading?.title ?? "Industry Academia Partnership"}
            description={
              heading?.description ??
              "Formal agreements with universities and colleges — shared curriculum, internships and live project work, so students graduate having built something real."
            }
          />
        </Reveal>

        <RevealGroup
          as="ul"
          stagger={0.05}
          className="grid gap-3 sm:grid-cols-2 sm:gap-4 lg:grid-cols-3"
        >
          {mous.map((mou) => (
            <RevealItem key={mou.slug} as="li" className="flex">
              <MouCard mou={mou} />
            </RevealItem>
          ))}
        </RevealGroup>
      </Container>
    </section>
  );
}

/**
 * One agreement.
 *
 * The caption panel slides up from the foot of the image and the image dims
 * behind it. Two details make it behave rather than merely animate:
 *
 * `group-focus-within` mirrors every hover rule, so a keyboard reaches the
 * caption too — a hover-only reveal hides content from anyone not using a
 * mouse, which on a card carrying the substance of the section is a real
 * loss, not a cosmetic one.
 *
 * And the panel is always in the DOM at full opacity for screen readers,
 * moved out of view by transform rather than `display` or `hidden`, so the
 * text is announced normally regardless of pointer state.
 *
 * The caption panel carries its own solid ground rather than leaning on a
 * dimmed backdrop image: with the mark now `object-contain`, most of the well
 * behind the panel is bare `--background-secondary`, not photo content, so
 * there is nothing to darken for contrast — the panel has to bring its own.
 */
function MouCard({ mou }: { mou: MouPartnershipData & { slug: string } }) {
  return (
    <article
      className={cn(
        "group/mou relative isolate flex w-full flex-col overflow-hidden",
        "rounded-[var(--radius-tile)] border border-brand-blue/15 bg-white",
        "transition-colors duration-ui ease-out-quint hover:border-brand-blue/50",
        "focus-within:border-brand-blue/50"
      )}
    >
      <div className="relative aspect-[4/3] w-full overflow-hidden bg-background-secondary">
        {mou.image ? (
          <Image
            src={mou.image}
            alt={`${mou.institution} memorandum of understanding`}
            fill
            sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
            className={cn(
              /* Padding lives on the image itself, not the well — a wrapper's
                 own padding is ignored by an absolutely-positioned `fill`
                 child, which paints edge to edge regardless. Every mark gets
                 the same content box to scale down into, so a wide wordmark
                 and a square crest read at a comparable size instead of
                 whichever one happens to fill more of an uncropped box. */
              "object-contain object-center p-10 sm:p-12",
              "transition-transform duration-700 ease-out-expo",
              "group-hover/mou:scale-[1.03] group-focus-within/mou:scale-[1.03]",
              "motion-reduce:transition-none motion-reduce:group-hover/mou:scale-100"
            )}
          />
        ) : (
          <span
            aria-hidden
            className="absolute inset-0 flex items-center justify-center text-text-primary/15"
          >
            <svg viewBox="0 0 24 24" className="h-10 w-10" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M14 3H7a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V8z" />
              <path d="M14 3v5h5M9 13h6M9 17h4" />
            </svg>
          </span>
        )}

        {/* The caption. Travels rather than fades: sliding up from the edge it
            is anchored to reads as one panel arriving, where a cross-fade
            would read as two states swapping. */}
        <div
          className={cn(
            "absolute inset-x-0 bottom-0 bg-surface-ink/92 p-4 sm:p-5",
            "translate-y-full transition-transform duration-500 ease-out-expo",
            "group-hover/mou:translate-y-0 group-focus-within/mou:translate-y-0",
            /* Reduced motion keeps the reveal but drops the travel: the
               caption is content, so it must still be reachable. */
            "motion-reduce:translate-y-0 motion-reduce:opacity-0",
            "motion-reduce:transition-opacity motion-reduce:group-hover/mou:opacity-100",
            "motion-reduce:group-focus-within/mou:opacity-100"
          )}
        >
          <p className="text-[14px] leading-[1.5] text-white text-pretty">
            {mou.caption}
          </p>
        </div>
      </div>

      <div className="flex items-baseline justify-between gap-3 px-4 py-4 sm:px-5">
        <h3 className="text-[16px] font-semibold leading-tight tracking-[-0.02em] text-text-primary">
          {mou.institution}
        </h3>
        {mou.signedOn && (
          <span className="shrink-0 text-[11px] font-semibold uppercase tracking-wider text-text-muted">
            {mou.signedOn}
          </span>
        )}
      </div>
    </article>
  );
}
