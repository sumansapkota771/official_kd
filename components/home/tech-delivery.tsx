import { Container } from "@/components/ui/container";
import { SectionHeading } from "@/components/ui/section-heading";
import {
  getDeliveryApproach,
  getSectionHeading,
  getTechStack,
} from "@/lib/content/resolvers";

const SDLC_STEPS = ["Plan", "Design", "Build", "Test", "Deploy", "Support"];

export async function TechDelivery() {
  const [techStack, deliveryApproach, heading] = await Promise.all([
    getTechStack(),
    getDeliveryApproach(),
    getSectionHeading("tech-delivery"),
  ]);

  return (
    <section className="py-20 sm:py-24">
      <Container className="flex flex-col gap-16">
        <div className="flex flex-col gap-8">
          <SectionHeading
            eyebrow={heading?.eyebrow ?? "Technology"}
            eyebrowTone={heading?.eyebrowTone}
            title={heading?.title ?? "A stack chosen for reliability, not resume-padding"}
            description={heading?.description || undefined}
          />
          <div className="flex flex-wrap gap-3">
            {techStack.map((tech) => (
              <span
                key={tech.slug}
                className="rounded-full border-[0.5px] border-border bg-surface px-4 py-2 font-mono text-sm font-medium text-text-secondary"
              >
                {tech.name}
              </span>
            ))}
          </div>
        </div>

        <div className="grid gap-10 lg:grid-cols-2">
          <div className="flex flex-col gap-6">
            <h3 className="text-xl font-semibold text-text-primary">Delivery approach</h3>
            <div className="flex flex-col gap-5">
              {deliveryApproach.map((step, i) => (
                <div key={step.slug} className="flex gap-4">
                  <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-brand-blue-light text-sm font-bold text-brand-blue">
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
          </div>

          <div className="flex flex-col gap-6 panel p-6 sm:p-8">
            <h3 className="text-xl font-semibold text-text-primary">SDLC methodology</h3>
            <p className="text-sm leading-relaxed text-text-muted">
              An iterative software development lifecycle with a visible checkpoint at every
              stage — so you always know exactly what&apos;s shipped and what&apos;s next.
            </p>
            <ol className="flex flex-wrap gap-2">
              {SDLC_STEPS.map((step, i) => (
                <li key={step} className="flex items-center gap-2">
                  <span className="rounded-full bg-brand-green-light px-3 py-1.5 text-xs font-semibold text-brand-green-hover">
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
          </div>
        </div>
      </Container>
    </section>
  );
}
