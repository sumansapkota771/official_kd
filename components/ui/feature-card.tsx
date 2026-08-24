import Link from "next/link";
import { cn } from "@/lib/utils";

/**
 * The marketing grid tile.
 *
 * The compact counterpart to `ShowcaseCard`: same material (`.card`), same
 * hover, but sized for a three-up grid rather than a full-bleed pair.
 *
 * Hover moves the fill and the chevron, never the box. Nothing shifts
 * position under the cursor, so a dense grid stays still while you scan it.
 */
export function FeatureCard({
  href,
  children,
  className,
}: {
  href: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <Link
      href={href}
      className={cn(
        "focus-ring group/card card card-hover relative isolate flex w-full flex-col overflow-hidden p-8 sm:p-9",
        className
      )}
    >
      {children}
    </Link>
  );
}

/** Small colour-coded label above a tile's headline. */
export function TileLabel({
  children,
  tone = "blue",
  className,
}: {
  children: React.ReactNode;
  tone?: "blue" | "green" | "amber";
  className?: string;
}) {
  return (
    <span
      className={cn(
        "text-[13px] font-semibold tracking-[-0.01em]",
        tone === "blue"
          ? "text-link"
          : tone === "green"
            ? "text-brand-green-hover"
            : "text-brand-amber-text",
        className
      )}
    >
      {children}
    </span>
  );
}

/** Tile headline. Large, tightly tracked, and never more than two lines. */
export function TileTitle({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <h3
      className={cn(
        "text-[21px] font-semibold leading-[1.19] tracking-[-0.022em] text-text-primary text-balance",
        className
      )}
    >
      {children}
    </h3>
  );
}

/** Tile body copy. */
export function TileBody({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <p className={cn("text-[15px] leading-[1.47] text-text-muted", className)}>
      {children}
    </p>
  );
}

/**
 * The "keep going" affordance, as a bare chevron rather than a full arrow —
 * the shorter glyph sits quieter next to the label and lets the tile's
 * headline stay the loudest thing in the box.
 *
 * Rendered at full opacity rather than faded in on hover, so it exists for
 * touch users too; the chevron's travel carries the hover feedback.
 */
export function TileCue({
  label,
  tone = "blue",
  className,
}: {
  label: string;
  tone?: "blue" | "green";
  className?: string;
}) {
  return (
    <span
      className={cn(
        "mt-auto flex items-center gap-1.5 pt-7 text-[15px] font-normal",
        tone === "blue" ? "text-link" : "text-brand-green-hover",
        className
      )}
    >
      {label}
      <svg
        aria-hidden
        viewBox="0 0 10 16"
        className="h-3.5 w-2 shrink-0 transition-transform duration-micro ease-out-quint group-hover/card:translate-x-0.5"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="m2 2 6 6-6 6" />
      </svg>
    </span>
  );
}
