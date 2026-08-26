"use client";

import Link from "next/link";
import { useState, useRef, useEffect, useCallback } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { createPortal } from "react-dom";
import type { NavGroup } from "@/lib/data/nav";
import { cn } from "@/lib/utils";

export function NavDropdown({
  group,
}: {
  group: NavGroup;
}) {
  const [open, setOpen] = useState(false);
  const [headerEl, setHeaderEl] = useState<HTMLElement | null>(null);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const triggerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setHeaderEl(triggerRef.current?.closest("header") ?? null);
  }, []);

  const handleEnter = useCallback(() => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    setOpen(true);
  }, []);

  const handleLeave = useCallback(() => {
    timeoutRef.current = setTimeout(() => setOpen(false), 150);
  }, []);

  useEffect(() => () => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
  }, []);

  const panel = (
    <>
      {typeof window !== "undefined" &&
        createPortal(
          <AnimatePresence>
            {open && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1, transition: { duration: 0.25, ease: "easeOut" } }}
                exit={{ opacity: 0, transition: { duration: 0.3, ease: "easeOut" } }}
                aria-hidden
                className="pointer-events-none fixed inset-0 z-40 bg-black/20 backdrop-blur-md"
              />
            )}
          </AnimatePresence>,
          document.body
        )}
      {open &&
        headerEl &&
        createPortal(
          <AnimatePresence>
            <motion.div
              initial={{ opacity: 0, y: -12, scale: 0.98 }}
              animate={{
                opacity: 1,
                y: 0,
                scale: 1,
                transition: { type: "spring", stiffness: 380, damping: 32, mass: 0.8 },
              }}
              exit={{
                opacity: 0,
                y: -8,
                scale: 0.99,
                transition: { duration: 0.28, ease: [0.32, 0.72, 0, 1] },
              }}
              className="absolute inset-x-0 top-full z-50 origin-top"
              onMouseEnter={handleEnter}
              onMouseLeave={handleLeave}
            >
              {/* Same bg-nav-bg/95 + backdrop-blur-xl the header itself uses, at
                  the same opacity — the point is that this reads as the bar
                  continuing downward, not as a separate card that opened. */}
              <div className="border-b border-nav-border bg-nav-bg/95 backdrop-blur-xl shadow-menu supports-backdrop-filter:bg-nav-bg/85">
                <div className="mx-auto max-w-[1720px] px-5 py-6 sm:px-8 lg:px-14">
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
                    {group.items.map((item, index) => (
                      <motion.div
                        key={item.href}
                        initial={{ opacity: 0, y: 8 }}
                        animate={{
                          opacity: 1,
                          y: 0,
                          transition: { duration: 0.25, ease: "easeOut", delay: 0.03 * index },
                        }}
                        exit={{
                          opacity: 0,
                          y: 4,
                          transition: { duration: 0.18, ease: "easeInOut", delay: 0.02 * index },
                        }}
                      >
                        <Link
                          href={item.href}
                          onClick={() => setOpen(false)}
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
                      </motion.div>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          </AnimatePresence>,
          headerEl
        )}
    </>
  );

  return (
    <div
      ref={triggerRef}
      className="relative"
      onMouseEnter={handleEnter}
      onMouseLeave={handleLeave}
    >
      {/* No background on hover or open — by request. Layout stability
          comes from the border always being reserved space (2px, transparent
          by default) rather than appearing on hover; only its colour
          transitions, so nothing in the row shifts width or position. */}
      <Link
        href={group.href}
        className={cn(
          "focus-ring flex cursor-pointer items-center gap-1 border-b-2 border-transparent px-3 py-1.5 text-sm font-medium text-nav-text-muted transition-colors duration-200",
          open ? "border-brand-green text-nav-text" : "hover:border-nav-border hover:text-nav-text"
        )}
      >
        <span>{group.label}</span>
      </Link>

      {panel}
    </div>
  );
}
