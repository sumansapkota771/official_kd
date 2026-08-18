import { cn } from "@/lib/utils";

export function Badge({
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
        "inline-flex items-center gap-1.5 rounded-[var(--radius-sm)] px-2.5 py-1 text-[11px] font-semibold tracking-wide",
        tone === "blue"
          ? "bg-badge-blue-bg text-badge-blue-text"
          : tone === "green"
            ? "bg-badge-green-bg text-badge-green-text"
            : "bg-badge-amber-bg text-badge-amber-text",
        className
      )}
    >
      {children}
    </span>
  );
}
