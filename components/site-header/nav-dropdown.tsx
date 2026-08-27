"use client";

import Link from "next/link";
import { useState, useRef, useEffect, useCallback } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { createPortal } from "react-dom";
import type { NavGroup } from "@/lib/data/nav";
import { DURATION, EASE } from "@/lib/motion";
import { cn } from "@/lib/utils";

/**
 * Every primary-nav trigger, plus the single dropdown panel they share.
 *
 * This used to be one independent `NavDropdown` per group — its own local
 * `open` state, its own portal, its own panel. Moving the pointer from a
 * short group (two links, one row) to a tall one (eleven links, four rows)
 * unmounted one panel and mounted a differently-sized one in its place: a
 * visible jump in the panel's own height, not a transition, and because
 * each group ran its own independent close timer the old and new panels
 * could briefly both be mounted at once.
 *
 * There is now exactly one panel and one shared `active` label. Every
 * group's content is stacked in the same CSS grid cell, so the parent's
 * height is always the *tallest* group's height — fixed the moment the
 * panel first opens, for as long as it stays open — and switching groups
 * just fades one layer out and the next in. The box never moves; only the
 * text does.
 */
export function NavGroups({ groups }: { groups: NavGroup[] }) {
  const [active, setActive] = useState<string | null>(null);
  const [headerEl, setHeaderEl] = useState<HTMLElement | null>(null);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const navRef = useRef<HTMLElement>(null);

  useEffect(() => {
    setHeaderEl(navRef.current?.closest("header") ?? null);
  }, []);

  const openGroup = useCallback((label: string) => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    setActive(label);
  }, []);

  const cancelClose = useCallback(() => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
  }, []);

  const scheduleClose = useCallback(() => {
    timeoutRef.current = setTimeout(() => setActive(null), 150);
  }, []);

  useEffect(
    () => () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    },
    []
  );

  const activeGroup = groups.find((g) => g.label === active);

  return (
    <>
      <nav aria-label="Primary" ref={navRef} className="hidden items-center gap-7 lg:flex">
        {groups.map((group) => (
          <div
            key={group.label}
            className="relative"
            onMouseEnter={() => openGroup(group.label)}
            onMouseLeave={scheduleClose}
          >
            {/* No background on hover or open — by request. Layout stability
                comes from the border always being reserved space (2px,
                transparent by default) rather than appearing on hover; only
                its colour transitions, so nothing in the row shifts width or
                position. */}
            <Link
              href={group.href}
              className={cn(
                "focus-ring flex cursor-pointer items-center gap-1 border-b-2 border-transparent px-3 py-1.5 text-sm font-medium text-nav-text-muted transition-colors duration-200",
                active === group.label
                  ? "border-brand-green text-nav-text"
                  : "hover:border-nav-border hover:text-nav-text"
              )}
            >
              <span>{group.label}</span>
            </Link>
          </div>
        ))}
      </nav>

      {typeof window !== "undefined" &&
        headerEl &&
        createPortal(
          <>
            <AnimatePresence>
              {activeGroup && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1, transition: { duration: DURATION.reveal, ease: EASE.outQuint } }}
                  exit={{ opacity: 0, transition: { duration: DURATION.reveal, ease: EASE.outQuint } }}
                  aria-hidden
                  /* A muted, blurred wash of the page's own background — not
                     a dark scrim — matching apple.com's own curtain
                     (confirmed live: rgba(232,232,237,0.4) + blur(20px) on a
                     light page). `bg-black/20` read as the page dimming;
                     this reads as the page frosting behind glass, and it
                     flips correctly with the theme since it rides
                     `--background` rather than a fixed black. Sits at z-40,
                     below the bar's own z-50, so the bar itself never gets
                     painted over by its own curtain. */
                  className="pointer-events-none fixed inset-0 z-40 bg-background/60 backdrop-blur-xl"
                />
              )}
            </AnimatePresence>
            <AnimatePresence>
              {activeGroup && (
                <motion.div
                  /* No `scale` — a size change on top of a position change is
                     what reads as "popping in" rather than sliding smoothly.
                     Slowed from DURATION.ui/micro (0.32s/0.18s, and
                     asymmetric) to a matching 0.5s both ways — open and
                     close now read as the same deliberate motion in either
                     direction, not a quick snap-shut after a slower open. */
                  initial={{ opacity: 0, y: -8 }}
                  animate={{
                    opacity: 1,
                    y: 0,
                    transition: { duration: DURATION.reveal, ease: EASE.outQuint },
                  }}
                  exit={{
                    opacity: 0,
                    y: -8,
                    transition: { duration: DURATION.reveal, ease: EASE.outQuint },
                  }}
                  className="absolute inset-x-0 top-full z-50 origin-top"
                  onMouseEnter={cancelClose}
                  onMouseLeave={scheduleClose}
                >
                  {/* Solid, not translucent — `bg-nav-bg/95` plus
                      backdrop-blur meant this panel and the bar above it,
                      despite sharing the exact same base color and opacity,
                      could still render as visibly different colors, because
                      backdrop-blur composites with whatever page content sits
                      *behind each of them*, and the panel sits over
                      different content (further down the page) than the bar
                      does. A flat, fully opaque fill has nothing behind it to
                      pick up — the only way to guarantee the two are the same
                      color regardless of what the page underneath looks
                      like. */}
                  <div className="border-b border-nav-border bg-nav-bg">
                    <div className="mx-auto max-w-[1720px] px-5 py-6 sm:px-8 lg:px-14">
                      {/* Every group occupies the same grid cell — an implicit
                          grid row sizes to its tallest occupant, so stacking
                          all of them here (rather than swapping which one is
                          mounted) is what pins the panel to one fixed height
                          regardless of which group is showing. */}
                      <div className="grid">
                        {groups.map((group) => {
                          const isActive = group.label === active;
                          return (
                            <div
                              key={group.label}
                              style={{ gridArea: "1 / 1" }}
                              inert={!isActive}
                              aria-hidden={!isActive}
                              className={cn(
                                "transition-opacity duration-150 ease-out",
                                isActive ? "opacity-100" : "pointer-events-none opacity-0"
                              )}
                            >
                              <div className="mb-3">
                                <p className="text-[11px] font-semibold uppercase tracking-[0.12em] text-nav-text-muted">
                                  {group.label}
                                </p>
                              </div>
                              <div
                                className={cn(
                                  "grid gap-x-8 gap-y-1",
                                  group.items.length > 4 ? "grid-cols-3" : "grid-cols-2"
                                )}
                              >
                                {group.items.map((item) => (
                                  <Link
                                    key={item.href}
                                    href={item.href}
                                    onClick={() => setActive(null)}
                                    className="focus-ring group flex cursor-pointer flex-col gap-0.5 rounded-lg px-3 py-3 transition-colors"
                                  >
                                    <p className="text-sm font-semibold text-nav-text-muted transition-colors group-hover:text-nav-text">
                                      {item.label}
                                    </p>
                                    {item.description && (
                                      <p className="text-xs leading-relaxed text-nav-text-muted/80">
                                        {item.description}
                                      </p>
                                    )}
                                  </Link>
                                ))}
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </>,
          headerEl
        )}
    </>
  );
}
