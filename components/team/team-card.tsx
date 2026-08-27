import Image from "next/image";
import { TeamCardLetter } from "@/components/team/team-card-letter";
import type { TeamMemberData } from "@/lib/content/schemas";
import { cn } from "@/lib/utils";

export type TeamCardPerson = TeamMemberData & { slug?: string };

/** First letter of the given name, used as the card's oversized mark. */
function initial(name: string): string {
  return name.trim().charAt(0).toUpperCase() || "?";
}

/**
 * One person, as a full-bleed portrait tile.
 *
 * Chrome-free by design: no border, no radius, no shadow. The photograph is
 * the card, and the name sits on it rather than in a panel underneath — the
 * arrangement a portrait wall uses, where any frame around each face turns a
 * group of people into a grid of boxes.
 *
 * The oversized green initial and the name share one row at the foot of the
 * card, the initial to the left of the name rather than behind it. Behind is
 * where it started, and behind a full-bleed photograph means invisible on
 * every card that actually has one; beside it, the letter reads on a portrait
 * and on a bare tile alike.
 *
 * It carries the whole card when there is no photograph — a wall of grey
 * placeholder avatars is what this arrangement exists to avoid, and a large
 * letter is a deliberate-looking answer where an empty frame is not. Its size
 * does not change between the two cases: whether a portrait has been uploaded
 * is not something the reader should be able to infer from the typography.
 *
 * A bottom scrim sits under that row wherever there is a photograph, because
 * the text is laid directly on an image this component does not control. It
 * fades rather than bands, so the picture stays readable beneath it.
 */
export function TeamCard({
  person,
  className,
}: {
  person: TeamCardPerson;
  className?: string;
}) {
  const hasPhoto = Boolean(person.image);
  const hasHoverPhoto = Boolean(person.hoverImage);

  return (
    <article
      className={cn(
        "group/member relative isolate flex aspect-4/5 w-full overflow-hidden",
        // The ground the initial is drawn on, and the fallback surface for
        // anyone without a photograph yet.
        "bg-surface-ink",
        className
      )}
    >
      {person.image && (
        <Image
          src={person.image}
          alt={person.name}
          fill
          sizes="(min-width: 1024px) 25vw, (min-width: 640px) 50vw, 100vw"
          className={cn(
            "object-cover object-top transition-[opacity,transform] duration-700 ease-out-expo",
            // With a second photo the first fades out; with only one it pushes
            // in instead, so every card answers the pointer either way.
            hasHoverPhoto
              ? "group-hover/member:opacity-0 group-focus-within/member:opacity-0"
              : "group-hover/member:scale-105 group-focus-within/member:scale-105",
            "motion-reduce:transition-none motion-reduce:group-hover/member:scale-100"
          )}
        />
      )}

      {person.hoverImage && (
        <Image
          src={person.hoverImage}
          alt=""
          fill
          sizes="(min-width: 1024px) 25vw, (min-width: 640px) 50vw, 100vw"
          className={cn(
            "object-cover object-top opacity-0 transition-opacity duration-700 ease-out-expo",
            "group-hover/member:opacity-100 group-focus-within/member:opacity-100",
            "motion-reduce:transition-none"
          )}
        />
      )}

      {/* Legibility scrim. Only where there is a photograph — over the plain
          ink fallback it would just darken an already-dark tile. */}
      {hasPhoto && (
        <div
          aria-hidden
          className="pointer-events-none absolute inset-x-0 bottom-0 h-2/5 bg-linear-to-t from-surface-ink via-surface-ink/70 to-transparent"
        />
      )}

      {/* Foot row: initial, then name and role. `items-end` sets them on one
          baseline, and `leading-[0.7]` pulls the letter's own slack out so it
          sits level with the name rather than floating above it.

          One letter size for every card, photograph or not — the letter is
          the card's constant, and scaling it by whether a portrait happens to
          have been uploaded made an unphotographed row read as a different
          component. */}
      <div className="relative mt-auto flex w-full items-end gap-2.5 p-4 sm:gap-4 sm:p-6">
        <TeamCardLetter
          letter={initial(person.name)}
          className="text-[40px] font-black leading-[0.7] tracking-tighter text-brand-green sm:text-[64px]"
        />

        <div className="min-w-0 flex-1">
          <h3 className="text-[15px] font-bold leading-tight tracking-[-0.01em] text-white text-pretty sm:text-[18px]">
            {person.name}
          </h3>
          {person.role && (
            <p className="mt-0.5 text-[11px] font-medium leading-snug text-white/70 sm:text-[13px]">
              {person.role}
            </p>
          )}
        </div>
      </div>
    </article>
  );
}
