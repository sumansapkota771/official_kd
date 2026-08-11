import { Container } from "@/components/ui/container";
import { stats } from "@/lib/data/content";

export function TrustStrip() {
  return (
    <section className="border-y border-border bg-surface">
      <Container className="flex flex-wrap items-center justify-center gap-x-16 gap-y-6 py-8 sm:justify-between">
        <p className="text-sm font-semibold text-text-muted">
          Trusted by growing businesses and academic partners across Nepal
        </p>
        <div className="flex items-center gap-10">
          {stats.map((stat) => (
            <div key={stat.label} className="text-center">
              <p className="text-2xl font-bold text-brand-green-hover sm:text-3xl">{stat.value}</p>
              <p className="text-xs font-medium text-text-muted sm:text-sm">{stat.label}</p>
            </div>
          ))}
        </div>
      </Container>
    </section>
  );
}
