import { Container } from "@/components/ui/container";
import { RevealGroup, RevealItem } from "@/components/motion/reveal";
import { cn } from "@/lib/utils";

/**
 * The masthead every interior page opens with.
 *
 * Its parts arrive in reading order — eyebrow, headline, standfirst, then any
 * actions — rather than as one block. The stagger is the site's own default,
 * so a page opens with the same cadence the homepage sections settle in with
 * instead of the interior pages appearing fully formed while the homepage
 * animates.
 *
 * The rule down the leading edge is deliberately left out of the animation:
 * it is the page's spine, and a spine that slides in reads as decoration.
 */
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
      {/* A solid rule down the leading edge, not a radial wash in the
          corner. It answers the same "do not ship a blank hero" problem
          without fading one colour into another, and it marks the same left
          spine the copy is set against. */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-y-0 left-0 w-1 bg-brand-blue"
      />
      <Container className="relative py-16 sm:py-20 lg:py-24">
        <RevealGroup className="flex flex-col items-start gap-5">
          {eyebrow && (
            <RevealItem>
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
            </RevealItem>
          )}
          <RevealItem>
            <h1 className="display-lg max-w-3xl font-semibold text-text-primary">{title}</h1>
          </RevealItem>
          {description && (
            <RevealItem>
              <p className="max-w-2xl text-base leading-relaxed text-text-muted sm:text-lg">
                {description}
              </p>
            </RevealItem>
          )}
          {children && <RevealItem>{children}</RevealItem>}
        </RevealGroup>
      </Container>
    </section>
  );
}
