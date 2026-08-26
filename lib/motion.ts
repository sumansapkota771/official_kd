/**
 * Motion language — the JS half of the tokens declared in globals.css.
 *
 * Four duration tiers, each with a job. Keeping them named (rather than
 * scattering magic numbers through components) is what keeps timing
 * consistent as the site grows: a card hover and a section reveal should
 * never accidentally share a duration.
 */

export const DURATION = {
  /** Hover, icon nudge, underline draw. */
  micro: 0.18,
  /** Dropdowns, toggles, state swaps. */
  ui: 0.32,
  /** Section entrances that are not the hero. */
  section: 0.72,
  /** Scroll reveals. Shorter than `section` on purpose: the hero is the
   *  only thing on this site that performs, and a reveal at 0.72s on every
   *  section reads as a queue of animations rather than as content
   *  settling into place. */
  reveal: 0.5,
  /** Hero entrance only. */
  cinematic: 1.1,
} as const;

/**
 * Front-loaded curves: motion covers most of its distance early, then
 * settles. This is what makes an interface feel responsive rather than
 * sluggish, even at longer durations.
 */
export const EASE = {
  outExpo: [0.16, 1, 0.3, 1],
  outQuint: [0.22, 1, 0.36, 1],
  inOutQuint: [0.83, 0, 0.17, 1],
} as const;

/** Travel distance for reveals. Deliberately small, and smaller than it was:
 *  the point of a supporting reveal is that content arrives already composed.
 *  Distance is what turns that into a slideshow. */
export const REVEAL_DISTANCE = 10;

/**
 * Stagger between siblings in a revealing group. Long enough to read as
 * sequence, short enough that the last child isn't left waiting.
 */
export const STAGGER = 0.06;

/**
 * Viewport margin for scroll reveals: start the animation slightly before
 * the element reaches the fold so it is already settling when it arrives,
 * instead of visibly popping in after the user has looked at it.
 */
export const VIEWPORT_MARGIN = "0px 0px -12% 0px";
