import { Container } from "@/components/ui/container";
import { cn } from "@/lib/utils";

export function PageHero({
  eyebrow,
  eyebrowTone = "blue",
  title,
  description,
  children,
  className,
}: {
  eyebrow?: string;
  eyebrowTone?: "blue" | "green";
  title: React.ReactNode;
  description?: React.ReactNode;
  children?: React.ReactNode;
  className?: string;
}) {
  return (
    <section className={cn("relative overflow-hidden bg-background-secondary", className)}>
      <Container className="relative flex flex-col items-start gap-5 py-16 sm:py-20">
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
        <h1 className="max-w-2xl text-4xl font-semibold leading-[1.05] tracking-[-0.03em] text-text-primary sm:text-5xl">
          {title}
        </h1>
        {description && (
          <p className="max-w-2xl text-base leading-relaxed text-text-secondary sm:text-lg">
            {description}
          </p>
        )}
        {children}
      </Container>
    </section>
  );
}
