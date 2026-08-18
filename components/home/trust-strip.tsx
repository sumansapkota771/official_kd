import { Container } from "@/components/ui/container";
import { Counter } from "@/components/motion/counter";
import { Reveal } from "@/components/motion/reveal";
import { getHomeTrustData, getStats } from "@/lib/content/resolvers";
import { cn } from "@/lib/utils";

export async function TrustStrip({ className }: { className?: string }) {
  const [trust, stats] = await Promise.all([getHomeTrustData(), getStats()]);

  return (
    <section data-section-key="home-trust" className={cn("border-y border-border bg-surface", className)}>
      <Container className="flex flex-wrap items-center justify-center gap-x-16 gap-y-6 py-8 sm:justify-between sm:py-10">
        <Reveal from="none">
          <p className="text-xs font-semibold uppercase tracking-widest text-text-muted">{trust.label}</p>
        </Reveal>
        <div className="flex items-center gap-10 sm:gap-14">
          {stats.map((stat) => (
            <div key={stat.slug} className="text-center">
              <Counter
                value={stat.value}
                className="block text-2xl font-bold tabular-nums text-brand-green sm:text-3xl"
              />
              <p className="mt-0.5 text-[11px] font-medium uppercase tracking-wider text-text-muted sm:text-xs">{stat.label}</p>
            </div>
          ))}
        </div>
      </Container>
    </section>
  );
}
