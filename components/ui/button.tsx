import * as React from "react";
import Link from "next/link";
import { cn } from "@/lib/utils";

type ButtonVariant = "primary" | "secondary" | "outline" | "ghost" | "amber";
type ButtonSize = "sm" | "md" | "lg";

const variantClasses: Record<ButtonVariant, string> = {
  primary:
    "bg-brand-blue text-white hover:bg-brand-blue-hover border border-transparent hover:border-brand-blue-hover",
  secondary:
    "bg-brand-green text-text-on-green hover:bg-brand-green-hover hover:text-white border border-transparent",
  outline:
    "bg-transparent text-brand-blue border border-brand-blue/20 hover:border-brand-blue/50 hover:bg-brand-blue-light",
  ghost:
    "bg-transparent text-brand-blue hover:bg-brand-blue-light border border-transparent",
  amber:
    "bg-brand-amber text-white hover:bg-brand-amber-hover border border-transparent",
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
  "group/btn focus-ring inline-flex items-center justify-center rounded-[var(--radius-control)] font-medium tracking-tight transition-[transform,background-color,border-color,box-shadow,color] duration-ui ease-out-quint whitespace-nowrap disabled:opacity-50 disabled:pointer-events-none active:scale-[0.97]";

export function Button({
  variant = "primary",
  size = "md",
  className,
  children,
  ...props
}: ButtonProps) {
  const classes = cn(base, variantClasses[variant], sizeClasses[size], className);

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
