import * as React from "react";
import Link from "next/link";
import { cn } from "@/lib/utils";

type ButtonVariant =
  | "primary"
  | "secondary"
  | "outline"
  | "ghost"
  | "amber"
  | "pill"
  | "pill-outline"
  | "pill-ink"
  | "pill-ink-outline"
  | "banner"
  | "banner-ink";
type ButtonSize = "sm" | "md" | "lg";

const variantClasses: Record<ButtonVariant, string> = {
  primary:
    "bg-brand-blue text-white hover:bg-brand-blue-hover border border-transparent hover:border-brand-blue-hover",
  secondary:
    "bg-brand-green text-text-on-green hover:bg-brand-green-hover hover:text-white border border-transparent",
  outline:
    "bg-transparent text-link border border-brand-blue/20 hover:border-brand-blue/50 hover:bg-brand-blue-light",
  ghost:
    "bg-transparent text-link hover:bg-brand-blue-light border border-transparent",
  /* Dark label, not white: the amber fill is light in both themes, so white
     sits at 2.4:1 on it while --surface-ink clears 7.7:1. */
  amber:
    "bg-brand-amber text-surface-ink hover:bg-brand-amber-hover border border-transparent",
  /* Pill pair — fully-rounded, chrome-free controls for marketing sections.
     Deliberately lighter in weight than `primary`: the shape carries the
     emphasis, so the type does not have to shout to be read as a control. */
  pill:
    "bg-brand-blue text-white hover:bg-brand-blue-hover border border-transparent font-normal",
  "pill-outline":
    "bg-transparent text-link border border-brand-blue hover:bg-brand-blue hover:text-white font-normal",
  /* Ink-tile pills. --brand-blue is near-black indigo in light mode and sits
     at ~2.2:1 on an ink tile, so these get their own lifted blues: the fill
     clears 3:1 against the tile and still carries white text at ~5:1. */
  "pill-ink":
    "bg-tile-ink-pill text-white hover:bg-tile-ink-pill-hover border border-transparent font-normal",
  "pill-ink-outline":
    "bg-transparent text-tile-ink-accent border border-tile-ink-accent hover:bg-tile-ink-accent hover:text-[#0f1219] font-normal",
  /* Square, solid-white banner CTA for copy sitting over photography. The
     hard corners are the point: against a soft photographic ground a
     rounded button reads as part of the picture, a square one reads as
     interface. */
  banner:
    "bg-white text-surface-ink hover:bg-white/90 border border-transparent font-semibold uppercase tracking-[0.1em]",
  /* The banner CTA inverted, for copy set in black over a bright photograph. */
  "banner-ink":
    "bg-surface-ink text-white hover:bg-surface-ink/90 border border-transparent font-semibold uppercase tracking-[0.1em]",
};

const bannerSizeClasses: Record<ButtonSize, string> = {
  sm: "h-10 px-6 text-[12px] gap-2",
  md: "h-12 px-8 text-[13px] gap-2",
  lg: "h-14 px-10 text-[14px] gap-2",
};

/* Pills need more air at the sides than a rectangle does — the curve eats
   into the visual padding, so the same value reads tighter. */
const pillSizeClasses: Record<ButtonSize, string> = {
  sm: "h-9 px-5 text-[13px] gap-1.5",
  md: "h-11 px-6 text-[15px] gap-2",
  lg: "h-12 px-7 text-[17px] gap-2",
};

const sizeClasses: Record<ButtonSize, string> = {
  sm: "h-9 px-4 text-[13px] gap-1.5",
  md: "h-10 px-5 text-[15px] gap-2",
  lg: "h-13 px-7 text-[17px] gap-2",
};

type CommonProps = {
  variant?: ButtonVariant;
  size?: ButtonSize;
  className?: string;
  children: React.ReactNode;
};

type ButtonAsButton = CommonProps &
  React.ButtonHTMLAttributes<HTMLButtonElement> & { href?: undefined };

type ButtonAsLink = CommonProps &
  Omit<React.ComponentProps<typeof Link>, "href" | "className"> & {
    href: string;
  };

export type ButtonProps = ButtonAsButton | ButtonAsLink;

/**
 * `group/btn` is declared here so any icon inside a Button can respond to the
 * button's own hover (e.g. an arrow that travels forward) without each call
 * site having to remember to add the group. The named group avoids colliding
 * with the card-level `group` that buttons are often nested inside.
 *
 * Press feedback uses a scale-down rather than a color change: it reads as
 * physical, and it survives being placed on any background.
 */
const base =
  "group/btn focus-ring inline-flex items-center justify-center font-medium tracking-tight transition-[transform,background-color,border-color,box-shadow,color] duration-ui ease-out-quint whitespace-nowrap disabled:opacity-50 disabled:pointer-events-none active:scale-[0.97]";

export function Button({
  variant = "primary",
  size = "md",
  className,
  children,
  ...props
}: ButtonProps) {
  const isPill = variant.startsWith("pill");
  const isBanner = variant.startsWith("banner");
  const classes = cn(
    base,
    // Emitted here rather than inside `base` + a variant override:
    // tailwind-merge does not recognise `rounded-pill` as conflicting with
    // `rounded-[var(--radius-control)]`, so an override would leave both in
    // the class list and let CSS source order decide the shape.
    isPill
      ? "rounded-[var(--radius-pill)]"
      : isBanner
        ? "rounded-none"
        : "rounded-[var(--radius-control)]",
    variantClasses[variant],
    (isPill ? pillSizeClasses : isBanner ? bannerSizeClasses : sizeClasses)[size],
    className
  );

  if ("href" in props) {
    const { href, ...rest } = props as ButtonAsLink;
    // A link control with no target is not a control. Empty hrefs can arrive
    // from CMS content fields, and rendering `<button href="">` (or a link to
    // "/") is a React error and a dead control. Render nothing instead.
    if (!href.trim()) return null;
    return (
      <Link href={href} className={classes} {...rest}>
        {children}
      </Link>
    );
  }

  const rest = props as React.ButtonHTMLAttributes<HTMLButtonElement>;
  return (
    <button className={classes} {...rest}>
      {children}
    </button>
  );
}
