import Image from "next/image";

/**
 * Route-level loader, shown while a dynamic page's server components resolve.
 *
 * Restrained on purpose: a thin indeterminate sweep at the very top (green,
 * the same "system" accent as the scrollbar thumb) and a quiet mark in the
 * centre. No spinner — a spinner implies a deadline the page can't promise.
 * Under `prefers-reduced-motion` the sweep freezes off-canvas and the pulse
 * holds, so the loader quietly disappears rather than demanding attention.
 */
export default function Loading() {
  return (
    <div className="relative flex min-h-[70vh] flex-col items-center justify-center gap-6">
      <div className="fixed inset-x-0 top-0 z-[60] h-0.5 overflow-hidden">
        <div className="loader-bar h-full w-2/5 bg-brand-green" />
      </div>

      <div className="flex flex-col items-center gap-4">
        <div className="relative h-12 w-[107px]">
          <Image
            src="/images/logo.png"
            alt="KodeDristi Software Pvt. Ltd."
            fill
            priority
            className="object-contain object-center"
            sizes="107px"
          />
        </div>
        <p className="loader-pulse text-[11px] font-semibold uppercase tracking-[0.22em] text-text-muted">
          Loading
        </p>
      </div>
    </div>
  );
}
