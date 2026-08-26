import Image from "next/image";
import type { FeaturedItemData } from "@/lib/content/schemas";
import { cn } from "@/lib/utils";

export type FeaturedItem = FeaturedItemData & { slug: string };

/** Seconds each image holds before the row glides to the next. Multiplied
 *  by the row's own count, so a bigger row still gives each image a
 *  comparable dwell rather than racing through it. Raised from 3.4s to
 *  give each image real dwell time rather than reading as a ticker. */
const SECONDS_PER_STEP = 5.5;

/** Fraction of each step spent gliding; the rest is the hold. Lowered
 *  alongside the longer step above — the glide itself stays brisk while
 *  the hold, in both relative and absolute terms, gets longer. */
const GLIDE_PORTION = 0.1;

/**
 * Builds a `@keyframes` rule that steps through `count` positions and holds
 * at each, rather than scrolling continuously.
 *
 * Two same-value stops placed close together *are* the hold — nothing plays
 * between two identical keyframe values, so the row visibly stops there.
 * The gap left before the next pair is where the browser actually
 * interpolates, which is the glide. Direction is which end of the range the
 * track starts and ends at: "right" runs -50% -> 0% (content drifts left to
 * right, revealing new material from the left edge); "left" runs the same
 * span backwards.
 *
 * The loop itself needs no special handling at the seam: the track holds a
 * doubled copy of the list, so the frame at 0% (-50%, the second copy at
 * its natural position) and the frame at 100% (0%, the first copy at its
 * own natural position — an exact duplicate of the second) render identical
 * pixels. `animation-iteration-count: infinite` jumping from one to the
 * other is therefore invisible.
 */
function stepKeyframes(name: string, count: number, direction: "left" | "right"): string {
  const stepPct = 100 / count;
  const holdEndOffset = stepPct * (1 - GLIDE_PORTION);
  const valueAt = (i: number) => {
    const travelled = (i * 50) / count;
    return direction === "right" ? -50 + travelled : -travelled;
  };

  const stops: string[] = [];
  for (let i = 0; i < count; i++) {
    const v = valueAt(i).toFixed(3);
    stops.push(`${(i * stepPct).toFixed(3)}% { transform: translateX(${v}%); }`);
    stops.push(`${(i * stepPct + holdEndOffset).toFixed(3)}% { transform: translateX(${v}%); }`);
  }
  stops.push(`100% { transform: translateX(${valueAt(count).toFixed(3)}%); }`);

  return `@keyframes ${name} { ${stops.join(" ")} }`;
}

/**
 * One ambient, self-driving image row — "slide, hold, slide, hold" rather
 * than a continuous scroll — with no controls of any kind. There is nothing
 * to operate: this is texture, the way the hero's dot grid or the loading
 * screen's breathing halo are texture, and giving it arrows or a pause
 * button would misdescribe it as content that expects interaction.
 *
 * A plain server component: the keyframe is computed from the actual item
 * count at render time and shipped as a small scoped `<style>` tag, so the
 * motion is running in the very first paint rather than waiting on
 * hydration — nothing here needs JavaScript at all.
 */
export function FeaturedCarousel({
  items,
  size,
  className,
}: {
  items: FeaturedItem[];
  size: "large" | "small";
  className?: string;
}) {
  if (items.length === 0) return null;

  const direction = size === "large" ? "right" : "left";
  const animName = `fc-${size}-${items.length}`;
  const duration = Math.max(6, items.length * SECONDS_PER_STEP);
  const doubled = items.length > 1 ? [...items, ...items] : items;

  // Decorative and self-driving, with nothing to operate — the same
  // treatment SectionBackdropSlideshow already gives its own rotating
  // images. `aria-label` would be meaningless on an aria-hidden element,
  // so it is not one.
  return (
    <div aria-hidden="true" className={cn("overflow-hidden", className)}>
      {items.length > 1 && <style>{stepKeyframes(animName, items.length, direction)}</style>}
      {/* One gap value for every row, matching the vertical seam between
          the two rows in the section wrapper — the whole block reads off
          one spacing unit rather than two different rhythms. */}
      <div
        className={cn("flex gap-3 sm:gap-4")}
        style={
          items.length > 1
            ? { animation: `${animName} ${duration}s cubic-bezier(0.65,0,0.35,1) infinite`, width: "max-content" }
            : undefined
        }
      >
        {doubled.map((item, i) => (
          <div
            key={`${item.slug}-${i}`}
            className={cn(
              "relative shrink-0 overflow-hidden bg-surface-ink",
              size === "large"
                ? "aspect-[16/10] w-[82vw] sm:w-[31vw] sm:max-w-[460px]"
                : "aspect-[4/3] w-[46vw] sm:w-[15vw] sm:max-w-[210px]"
            )}
          >
            <Image
              src={item.image}
              alt={item.name}
              fill
              sizes={size === "large" ? "(min-width: 640px) 31vw, 82vw" : "(min-width: 640px) 15vw, 46vw"}
              className="object-cover object-center"
              /* Every image in the row is a legitimate first paint, not a
                 lazy off-screen one: the whole point of a self-driving row
                 is that it is already moving when the section arrives. */
              priority={i < items.length}
            />
          </div>
        ))}
      </div>
    </div>
  );
}
