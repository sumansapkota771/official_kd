import Image from "next/image";
import Link from "next/link";
import { cn } from "@/lib/utils";
import type { ProjectData } from "@/lib/content/schemas";

export type ProjectCardData = ProjectData & { slug: string };

/**
 * The project tile, used by both the homepage six and the full index so the
 * two grids can never drift apart.
 *
 * The image well is always laid out, artwork or not — the grid must not
 * resize when a case study finally gets its screenshot. On hover the fill
 * warms and the picture pushes into a fixed crop, which is the same
 * behaviour the showcase tiles use: the card is a window onto the work, and
 * nothing around it moves.
 */
export function ProjectCard({ project }: { project: ProjectCardData }) {
  const meta = [project.client, project.industry, project.year].filter(Boolean);

  return (
    <Link
      href={`/projects/${project.slug}`}
      className={cn(
        "focus-ring group/proj flex w-full flex-col overflow-hidden",
        /* White surface with a drawn edge, rather than the site's default
           borderless tile. Separation here comes from the stroke, not from a
           fill that differs from the page — so the fill stays put on hover
           and the border is what responds. Elevation is declared once: a
           border, no shadow. */
        "rounded-[var(--radius-tile)] border border-brand-blue/25 bg-surface",
        "transition-colors duration-ui ease-out-quint hover:border-brand-blue"
      )}
    >
      {/* A padded white well, and the artwork is contained inside it rather
          than cropped to fill it. What clients supply here is a logo or a
          wordmark, not a photograph — `object-cover` was slicing the edges
          off marks whose aspect did not happen to match 16:10. Contain costs
          some empty space on tall marks; cutting a client's logo in half is
          not a trade worth making. */}
      <div
        className={cn(
          "relative aspect-[16/10] w-full overflow-hidden border-b border-brand-blue/15 bg-white p-6",
          !project.image && "bg-text-primary/[0.04]"
        )}
      >
        {project.image ? (
          <Image
            src={project.image}
            alt=""
            fill
            sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
            className="object-contain object-center p-2 transition-transform duration-700 ease-out-expo group-hover/proj:scale-[1.03] motion-reduce:transition-none motion-reduce:group-hover/proj:scale-100"
          />
        ) : (
          <span
            aria-hidden
            className="absolute inset-0 flex items-center justify-center text-text-primary/15"
          >
            <svg viewBox="0 0 24 24" className="h-10 w-10" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <rect x="3" y="4" width="18" height="16" rx="2.5" />
              <path d="m4 17 4.5-4.5a2 2 0 0 1 2.8 0L16 17" />
              <circle cx="8.5" cy="9.5" r="1.5" />
            </svg>
          </span>
        )}
      </div>

      <div className="flex flex-1 flex-col p-6">
        {meta.length > 0 && (
          <p className="text-[11px] font-semibold uppercase tracking-wider text-text-muted">
            {meta.join("  ·  ")}
          </p>
        )}
        <h3 className="mt-2 text-[20px] font-semibold leading-tight tracking-[-0.02em] text-text-primary">
          {project.name}
        </h3>
        <p className="mt-2 text-sm leading-relaxed text-text-muted">{project.tagline}</p>
        <span className="mt-4 text-sm font-semibold text-link">Read the case study</span>
      </div>
    </Link>
  );
}
