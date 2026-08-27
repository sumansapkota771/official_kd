import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { PageHero } from "@/components/ui/page-hero";
import { Container } from "@/components/ui/container";
import { RevealGroup, RevealItem } from "@/components/motion/reveal";
import { GalleryPhotoCard } from "@/components/gallery/gallery-photo-card";
import { getGalleries, getGallery, getGalleryPhotos } from "@/lib/content/resolvers";

export const revalidate = 3600;

export async function generateStaticParams() {
  const galleries = await getGalleries();
  return galleries.map((g) => ({ slug: g.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const gallery = await getGallery(slug);
  if (!gallery) return {};
  return {
    title: gallery.name,
    description: gallery.description,
  };
}

export default async function GalleryDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const gallery = await getGallery(slug);
  if (!gallery) notFound();

  const [photos, all] = await Promise.all([getGalleryPhotos(slug), getGalleries()]);
  const others = all.filter((g) => g.slug !== gallery.slug);

  return (
    <>
      <PageHero eyebrow="Gallery" title={gallery.name} description={gallery.description} />

      <section className="section">
        <Container className="flex flex-col gap-12">
          {photos.length > 0 ? (
            <RevealGroup
              as="ul"
              stagger={0.04}
              className="grid gap-4 sm:grid-cols-2 sm:gap-5 lg:grid-cols-3"
            >
              {photos.map((photo) => (
                <RevealItem key={photo.slug} as="li" className="flex">
                  <GalleryPhotoCard photo={photo} />
                </RevealItem>
              ))}
            </RevealGroup>
          ) : (
            /* The gallery exists but has no photographs yet. Saying so plainly
               is better than an empty page — and better than inventing
               placeholder images for an event that has its own real record. */
            <p className="max-w-prose text-base leading-relaxed text-text-muted">
              Photographs from this programme are being collected and will
              appear here shortly.
            </p>
          )}

          {others.length > 0 && (
            <div className="flex flex-col gap-4 border-t border-border pt-10">
              <p className="text-sm font-semibold text-text-primary">Other galleries</p>
              <ul className="flex flex-wrap gap-x-6 gap-y-3">
                {others.map((g) => (
                  <li key={g.slug}>
                    <Link
                      href={`/gallery/${g.slug}`}
                      className="focus-ring inline-flex items-center gap-1.5 text-sm font-medium text-link hover:underline"
                    >
                      {g.name}
                      <ArrowRight className="h-3.5 w-3.5" />
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </Container>
      </section>
    </>
  );
}
