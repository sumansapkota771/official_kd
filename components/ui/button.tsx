import * as React from "react";
import Link from "next/link";
import { cn } from "@/lib/utils";

type ButtonVariant = "primary" | "secondary" | "outline" | "ghost";
type ButtonSize = "sm" | "md" | "lg";

const variantClasses: Record<ButtonVariant, string> = {
  primary:
    "bg-brand-blue text-white hover:bg-brand-blue-hover shadow-sm shadow-brand-blue/20 hover:shadow-lg hover:shadow-brand-blue/30",
  secondary:
    "bg-brand-green text-text-on-green hover:bg-brand-green-hover hover:text-white shadow-sm shadow-brand-green/20 hover:shadow-lg hover:shadow-brand-green/30",
  outline:
    "bg-transparent text-brand-blue border border-brand-blue/30 hover:border-brand-blue/60 hover:bg-brand-blue-light",
  ghost:
    "bg-transparent text-brand-blue hover:underline underline-offset-4 decoration-brand-blue/50",
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

const base =
  "focus-ring inline-flex items-center justify-center rounded-[var(--radius-control)] font-medium tracking-tight transition-all duration-300 ease-out whitespace-nowrap disabled:opacity-50 disabled:pointer-events-none active:scale-[0.97] hover:-translate-y-px";

export function Button({
  variant = "primary",
  size = "md",
  className,
  children,
  ...props
}: ButtonProps) {
  const classes = cn(base, variantClasses[variant], sizeClasses[size], className);

  if ("href" in props && props.href) {
    const { href, ...rest } = props as ButtonAsLink;
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
