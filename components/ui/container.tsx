import { cn } from "@/lib/utils";

export function Container({
  className,
  children,
}: {
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <div
      className={cn(
        /* Full-screen width with one shared gutter, rather than a 1280px
           column floating in the middle of a 1920px display. The cap is a
           backstop for very wide monitors, not a column: past ~1720px a
           section stops reading as a band and starts reading as a stretched
           one. Prose keeps its own max-width at the element level, so
           widening the shell never widens a paragraph past its measure. */
        "mx-auto w-full max-w-[1720px] px-5 sm:px-8 lg:px-14",
        className
      )}
    >
      {children}
    </div>
  );
}
