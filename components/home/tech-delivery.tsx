import { Container } from "@/components/ui/container";
import { SectionHeading } from "@/components/ui/section-heading";
import { Reveal, RevealGroup, RevealItem } from "@/components/motion/reveal";
import {
  getDeliveryApproach,
  getSectionHeading,
  getTechStack,
} from "@/lib/content/resolvers";
import { cn } from "@/lib/utils";

const SDLC_STEPS = ["Plan", "Design", "Build", "Test", "Deploy", "Support"];

export async function TechDelivery({ className, imageUrl, mobileImageUrl }: { className?: string; imageUrl?: string; mobileImageUrl?: string }) {
  const [techStack, deliveryApproach, heading] = await Promise.all([
    getTechStack(),
    getDeliveryApproach(),
    getSectionHeading("tech-delivery"),
  ]);

  return (
    <section data-section-key="tech-delivery" data-image-url={imageUrl || undefined} data-mobile-image-url={mobileImageUrl || undefined} className={cn("section", className)}>
      <Container className="flex flex-col gap-20">
        <Reveal className="flex flex-col gap-8">
          <SectionHeading
            eyebrow={heading?.eyebrow ?? "Technology"}
            eyebrowTone={heading?.eyebrowTone}
            title={heading?.title ?? "A stack chosen for reliability, not resume-padding"}
            description={heading?.description || undefined}
          />
          {/* Tech chips lift individually on hover — a small acknowledgement
              that rewards scanning without implying they are clickable. */}
          <RevealGroup className="flex flex-wrap gap-2" stagger={0.02}>
            {techStack.map((tech) => (
              <RevealItem key={tech.slug}>
                <span className="inline-block rounded-[var(--radius-sm)] border border-border bg-surface px-3 py-1.5 font-mono text-xs font-medium text-text-secondary transition-[border-color,color] duration-micro ease-out-quint hover:border-brand-blue/40 hover:text-text-primary">
                  {tech.name}
                </span>
              </RevealItem>
            ))}
          </RevealGroup>
        </Reveal>

        <div className="grid gap-10 lg:grid-cols-2">
          <Reveal className="flex flex-col gap-6" from="left">
            <h3 className="text-xl font-semibold text-text-primary">Delivery approach</h3>
            <div className="flex flex-col gap-5">
              {deliveryApproach.map((step, i) => (
                <div key={step.slug} className="flex gap-4">
                  <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-[var(--radius-sm)] bg-brand-blue text-xs font-bold text-white">
                    {i + 1}
                  </span>
                  <div>
                    <p className="font-semibold text-text-primary">{step.title}</p>
                    <p className="mt-1 text-sm leading-relaxed text-text-muted">
                      {step.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </Reveal>

          <Reveal className="panel flex flex-col gap-7 p-8 sm:p-10" from="right">
            <h3 className="text-xl font-semibold text-text-primary">SDLC methodology</h3>
            <p className="text-sm leading-relaxed text-text-muted">
              An iterative software development lifecycle with a visible checkpoint at every
              stage — so you always know exactly what&apos;s shipped and what&apos;s next.
            </p>
            <ol className="flex flex-wrap gap-1.5">
              {SDLC_STEPS.map((step, i) => (
                <li key={step} className="flex items-center gap-1.5">
                  <span className="rounded-[var(--radius-sm)] bg-brand-green-light px-2.5 py-1 text-xs font-semibold text-brand-green-hover">
                    {step}
                  </span>
                  {i < SDLC_STEPS.length - 1 && (
                    <span className="text-text-muted" aria-hidden>
                      →
                    </span>
                  )}
                </li>
              ))}
            </ol>
          </Reveal>
        </div>
      </Container>
    </section>
  );
}
