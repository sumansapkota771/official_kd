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
  eyebrowTone?: "blue" | "green" | "amber";
  title: React.ReactNode;
  description?: React.ReactNode;
  children?: React.ReactNode;
  className?: string;
}) {
  return (
    <section className={cn("relative overflow-hidden bg-background-secondary border-b border-border", className)}>
      {/* Decorative corner accent — breaks the blank-hero template feel */}
      <div
        aria-hidden
        className="pointer-events-none absolute -right-20 -top-20 h-64 w-64 rounded-full opacity-[0.04]"
        style={{
          background: "radial-gradient(circle, var(--brand-blue) 0%, transparent 70%)",
        }}
      />
      <Container className="relative flex flex-col items-start gap-5 py-16 sm:py-20 lg:py-24">
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
        <h1 className="display-lg max-w-3xl font-semibold text-text-primary">{title}</h1>
        {description && (
          <p className="max-w-2xl text-base leading-relaxed text-text-muted sm:text-lg">
            {description}
          </p>
        )}
        {children}
      </Container>
    </section>
  );
}
