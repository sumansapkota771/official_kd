import { revalidatePath } from "next/cache";

/**
 * Drop the cached HTML for every public route after a content change.
 *
 * `invalidateCache` in the content store only clears the store's own
 * in-memory read cache. It does nothing about Next's route cache, and every
 * public page is `export const revalidate = 3600` — so without this an admin
 * saves a change and the site keeps serving the old HTML for up to an hour.
 *
 * The sweep is deliberately wide. One content type feeds several routes
 * (a course shows on /learn, on /learn/[slug], and on the home page), and
 * mapping types to routes would be a table nobody remembers to update when a
 * new section is added. Revalidating the root layout costs a re-render on
 * next request and cannot go stale by omission.
 */
export function revalidatePublicRoutes() {
  revalidatePath("/", "layout");
}
