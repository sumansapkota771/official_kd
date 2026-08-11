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
  eyebrowTone?: "blue" | "green";
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
            "text-[13px] font-semibold uppercase tracking-[0.12em]",
            eyebrowTone === "blue" ? "text-brand-blue" : "text-brand-green-hover"
          )}
        >
          {eyebrow}
        </span>
      )}
      <h2 className="max-w-2xl text-3xl font-semibold leading-tight tracking-[-0.02em] text-text-primary sm:text-4xl">
        {title}
      </h2>
      {description && (
        <p className="max-w-2xl text-base leading-relaxed text-text-secondary sm:text-[17px] sm:leading-relaxed">
          {description}
        </p>
      )}
    </div>
  );
}
