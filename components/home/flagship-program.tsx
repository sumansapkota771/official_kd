import { ArrowRight01Icon, Award01Icon, UserMultipleIcon, Calendar01Icon } from "hugeicons-react";
import { Container } from "@/components/ui/container";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { getHomeFlagshipData } from "@/lib/content/resolvers";

export async function FlagshipProgram() {
  const content = await getHomeFlagshipData();

  return (
    <section className="py-20 sm:py-24">
      <Container>
        <div className="relative overflow-hidden rounded-3xl border-[0.5px] border-border bg-brand-blue px-6 py-12 text-white sm:px-12 sm:py-16">
          <div className="relative flex flex-col gap-8 lg:flex-row lg:items-center lg:justify-between">
            <div className="max-w-xl">
              <Badge tone="green" className="bg-white/15 text-white">
                <Award01Icon className="h-3.5 w-3.5" /> {content.badge}
              </Badge>
              <h2 className="mt-4 text-3xl font-semibold leading-tight tracking-[-0.02em] sm:text-4xl">
                {content.title}
              </h2>
              <p className="mt-3 text-base leading-relaxed text-white/85 sm:text-lg">
                {content.description}
              </p>
              <div className="mt-6 flex flex-wrap gap-6 text-sm text-white/90">
                <span className="flex items-center gap-2">
                  <UserMultipleIcon className="h-4 w-4" /> {content.point1}
                </span>
                <span className="flex items-center gap-2">
                  <Calendar01Icon className="h-4 w-4" /> {content.point2}
                </span>
              </div>
            </div>
            <Button href={content.ctaHref} size="lg" className="w-fit shrink-0 bg-white text-brand-blue hover:bg-white/90">
              {content.ctaLabel} <ArrowRight01Icon className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </Container>
    </section>
  );
}
