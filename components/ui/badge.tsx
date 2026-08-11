import { cn } from "@/lib/utils";

export function Badge({
  children,
  tone = "blue",
  className,
}: {
  children: React.ReactNode;
  tone?: "blue" | "green";
  className?: string;
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold tracking-wide",
        tone === "blue"
          ? "bg-badge-blue-bg text-badge-blue-text"
          : "bg-badge-green-bg text-badge-green-text",
        className
      )}
    >
      {children}
    </span>
  );
}
