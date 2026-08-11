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
                className="pointer-events-none fixed inset-0 z-40 bg-black/20"
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
              <div className="border-b-[0.5px] border-border bg-surface-elevated/90 backdrop-blur-xl shadow-menu">
                <div className="mx-auto max-w-7xl px-5 py-6">
                  <div className="mb-3">
                    <p className="text-[11px] font-semibold uppercase tracking-[0.12em] text-text-muted">
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
                          <p className="text-sm font-semibold text-text-secondary transition-colors group-hover:text-text-primary">
                            {item.label}
                          </p>
                          {item.description && (
                            <p className="text-xs leading-relaxed text-text-muted">
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
      <Link
        href={group.href}
        className={cn(
          "focus-ring flex cursor-pointer items-center gap-1 px-3 py-2 text-sm font-medium text-text-secondary transition-colors duration-200",
          open ? "text-text-primary" : "hover:text-text-primary"
        )}
      >
        <span>{group.label}</span>
      </Link>

      {panel}
    </div>
  );
}
