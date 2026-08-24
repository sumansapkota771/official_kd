import { cn } from "@/lib/utils";

export function SectionHeading({
  eyebrow,
  eyebrowTone = "blue",
  title,
  description,
  align = "left",
  className,
}: {
  eyebrow?: string;
  eyebrowTone?: "blue" | "green" | "amber";
  title: React.ReactNode;
  description?: React.ReactNode;
  align?: "left" | "center";
  className?: string;
}) {
  return (
    <div
      className={cn(
        "flex flex-col gap-4",
        align === "center" && "items-center text-center",
        className
      )}
    >
      {eyebrow && (
        <span
          className={cn(
            "eyebrow",
            eyebrowTone === "blue"
              ? "text-link"
              : eyebrowTone === "green"
                ? "text-brand-green-hover"
                : "text-brand-amber-text"
          )}
        >
          {eyebrow}
        </span>
      )}
      <h2 className="display-md font-semibold text-text-primary">{title}</h2>
      {description && (
        <p className="max-w-2xl text-[15px] leading-relaxed text-text-muted sm:text-base">
          {description}
        </p>
      )}
    </div>
  );
}
