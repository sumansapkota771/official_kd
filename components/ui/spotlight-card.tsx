"use client";

import Link from "next/link";
import { cn } from "@/lib/utils";

/**
 * A link card used for grids of destinations (solutions, courses, products).
 * Hover effect: border-left accent appears + background warms — not the
 * generic 4px lift that makes every card feel identical.
 */
export function SpotlightCard({
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
        "focus-ring group/card card relative isolate overflow-hidden p-7 transition-[border-color,background-color] duration-ui ease-out-quint",
        "border-l-2 border-l-transparent hover:border-l-brand-blue hover:bg-brand-blue-light/30",
        className
      )}
    >
      {children}
    </Link>
  );
}

/**
 * The "keep going" affordance at the bottom of a card.
 *
 * Always rendered at full opacity — the previous pattern faded it in on
 * hover, which meant touch users never saw it at all, and it silently
 * reserved layout space for something invisible. Here the *arrow* carries
 * the hover feedback instead, which works on every input type.
 */
export function CardCue({
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
        "mt-auto flex items-center gap-1.5 pt-3 text-sm font-semibold",
        tone === "blue" ? "text-brand-blue" : "text-brand-green-hover",
        className
      )}
    >
      {label}
      <svg
        aria-hidden
        viewBox="0 0 16 16"
        className="h-4 w-4 transition-transform duration-micro ease-out-quint group-hover/card:translate-x-1"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M3 8h9M8.5 4.5 12 8l-3.5 3.5" />
      </svg>
    </span>
  );
}
