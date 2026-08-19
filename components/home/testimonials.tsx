import { Container } from "@/components/ui/container";
import { SectionHeading } from "@/components/ui/section-heading";
import { Reveal } from "@/components/motion/reveal";
import { TestimonialRail } from "@/components/home/testimonial-rail";
import { getSectionHeading, getTestimonials } from "@/lib/content/resolvers";
import { cn } from "@/lib/utils";

export async function Testimonials({ className, imageUrl, mobileImageUrl }: { className?: string; imageUrl?: string; mobileImageUrl?: string }) {
  const [testimonials, heading] = await Promise.all([
    getTestimonials(),
    getSectionHeading("testimonials"),
  ]);

  if (testimonials.length === 0) return null;

  return (
    <section data-section-key="testimonials" data-image-url={imageUrl || undefined} data-mobile-image-url={mobileImageUrl || undefined} className={cn("section", className)}>
      <Container className="flex flex-col gap-10">
        <Reveal>
          <SectionHeading
            eyebrow={heading?.eyebrow ?? "Testimonials"}
            eyebrowTone={heading?.eyebrowTone}
            title={heading?.title ?? "In their own words"}
            description={
              heading?.description ??
              "Short clips recorded by the people we've worked with — not paraphrased copy."
            }
          />
        </Reveal>

        {/* Data is fetched on the server; only the player is a client island. */}
        <Reveal from="none">
          <TestimonialRail
            items={testimonials.map((t) => ({
              slug: t.slug,
              name: t.name,
              role: t.role,
              quote: t.quote,
              videoUrl: t.videoUrl,
              posterUrl: t.posterUrl,
            }))}
          />
        </Reveal>
      </Container>
    </section>
  );
}
