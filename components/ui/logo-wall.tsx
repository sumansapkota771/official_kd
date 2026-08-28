import { RevealGroup, RevealItem } from "@/components/motion/reveal";
import { cn } from "@/lib/utils";

export type LogoWallItem = {
  /** Stable key, and the fallback wordmark when there is no logo file. */
  name: string;
  logo?: string;
  /** Overrides the accessible name where the mark reads differently from the
   *  organisation's name. */
  alt?: string;
  url?: string;
};

/**
 * A wall of organisation logos in equal-size cards.
 *
 * The problem this solves is that supplied logo files never agree: one is a
 * wide wordmark, the next a square badge, the next a small mark centred on a
 * large transparent canvas. Sized by height they end up at wildly different
 * visual weights; sized by width the tall ones tower. So the *card* is the
 * constant — one fixed rectangle, one padding, everywhere — and each mark is
 * fitted inside it with `object-contain`, which scales to whichever axis
 * runs out first and never stretches or crops. A logo is a trademark; a
 * squashed one is the wrong logo.
 *
 * Deliberately plain: square corners, one hairline border, no fill and no
 * shadow. The grid is the structure, and a shadow under each tile would make
 * a wall of marks read as a wall of buttons.
 *
 * Two columns on a phone is the floor — one column wastes the width, three
 * makes each mark too small to identify — and the counts step up from there
 * rather than jumping straight to the desktop grid, so a tablet never has to
 * scroll sideways to see a row.
 */
export function LogoWall({
  items,
  className,
  columns = "wide",
}: {
  items: LogoWallItem[];
  className?: string;
  /** `wide` fills a full-bleed section; `compact` suits a narrower column. */
  columns?: "wide" | "compact";
}) {
  if (items.length === 0) return null;

  return (
    <RevealGroup
      as="ul"
      stagger={0.03}
      className={cn(
        // `minmax(0,1fr)` rather than a bare `1fr`: a grid track's default
        // minimum is its content, so one stubborn wide logo would push the
        // row past the viewport and give the whole page a horizontal
        // scrollbar. This lets every track shrink instead.
        "grid grid-cols-2 gap-3 sm:gap-4",
        "[grid-template-columns:repeat(2,minmax(0,1fr))]",
        columns === "wide"
          ? "sm:[grid-template-columns:repeat(3,minmax(0,1fr))] lg:[grid-template-columns:repeat(4,minmax(0,1fr))] xl:[grid-template-columns:repeat(5,minmax(0,1fr))]"
          : "sm:[grid-template-columns:repeat(3,minmax(0,1fr))] lg:[grid-template-columns:repeat(4,minmax(0,1fr))]",
        className
      )}
    >
      {items.map((item) => (
        <RevealItem key={item.name} as="li">
          <LogoCard item={item} />
        </RevealItem>
      ))}
    </RevealGroup>
  );
}

function LogoCard({ item }: { item: LogoWallItem }) {
  const inner = item.logo ? (
    /* A plain <img>, not next/image: these are small, already optimised, and
       the fill/sizes dance next/image needs inside a flexible card buys
       nothing here. `max-h-full max-w-full` with `object-contain` is what
       guarantees the mark is fitted rather than filled. */
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={item.logo}
      alt={item.alt?.trim() || item.name}
      loading="lazy"
      className="max-h-full max-w-full object-contain"
    />
  ) : (
    /* No file yet: set the name. It is the organisation either way, and a
       grey placeholder box would say less than the name does. */
    <span className="text-center text-[13px] font-semibold leading-tight tracking-[-0.01em] text-text-secondary sm:text-sm">
      {item.name}
    </span>
  );

  /* `aspect-3/2` fixes every card to one rectangle regardless of what is
     inside it, so rows line up top and bottom down the whole grid — the
     alignment cannot drift as logos are added or swapped. */
  const shell =
    "flex aspect-3/2 items-center justify-center rounded-none border-[0.5px] border-border bg-surface p-5 sm:p-6";

  if (item.url?.trim()) {
    return (
      <a
        href={item.url}
        target="_blank"
        rel="noreferrer noopener"
        title={item.name}
        className={cn(
          shell,
          "focus-ring transition-colors duration-ui ease-out-quint hover:border-text-muted/40"
        )}
      >
        {inner}
      </a>
    );
  }

  return (
    <div title={item.name} className={shell}>
      {inner}
    </div>
  );
}
