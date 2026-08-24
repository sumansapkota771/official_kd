"use client";

import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowDown01Icon, Cancel01Icon } from "hugeicons-react";
import { navGroups } from "@/lib/data/nav";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/site-header/theme-toggle";
import { LangToggle } from "@/components/site-header/lang-toggle";
import { SignInButton } from "@/components/auth/sign-in-button";
import { cn } from "@/lib/utils";

export function MobileMenu({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  const [openGroup, setOpenGroup] = useState<string | null>(null);

  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 z-50 bg-black/40 lg:hidden"
          />
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "tween", duration: 0.25, ease: "easeOut" }}
            className="fixed inset-y-0 right-0 z-50 flex h-dvh w-[86%] max-w-sm flex-col bg-surface shadow-2xl lg:hidden"
          >
            <div className="flex items-center justify-between border-b border-border px-5 py-4">
              <div className="relative h-9 w-32">
                <Image
                  src="/images/logo.png"
                  alt="KodeDristi"
                  fill
                  className="object-contain object-left"
                />
              </div>
              <button
                onClick={onClose}
                aria-label="Close menu"
                className="focus-ring inline-flex h-9 w-9 items-center justify-center rounded-full border-[0.5px] border-border text-text-secondary"
              >
                <Cancel01Icon className="h-6 w-6" />
              </button>
            </div>

            <div className="min-h-0 flex-1 overflow-y-auto px-5 py-4">
              {navGroups.map((group) => {
                const isOpen = openGroup === group.label;
                return (
                  <div key={group.label} className="border-b border-border py-2">
                    <button
                      onClick={() => setOpenGroup(isOpen ? null : group.label)}
                      className="flex w-full items-center justify-between py-2.5 text-left text-sm font-semibold text-text-primary"
                    >
                      {group.label}
                      <ArrowDown01Icon
                        className={cn(
                          "h-6 w-6 text-text-muted transition-transform",
                          isOpen && "rotate-180"
                        )}
                      />
                    </button>
                    <AnimatePresence initial={false}>
                      {isOpen && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: "auto", opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          className="overflow-hidden"
                        >
                          <div className="flex flex-col gap-1 pb-2">
                            {group.items.map((item) => (
                              <Link
                                key={item.href}
                                href={item.href}
                                onClick={onClose}
                                className="rounded-lg px-3 py-2 text-sm text-text-secondary hover:bg-background-secondary hover:text-link"
                              >
                                {item.label}
                              </Link>
                            ))}
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                );
              })}
            </div>

            <div className="flex flex-col gap-4 border-t-[0.5px] border-border px-5 py-5">
              <div className="flex items-center justify-between">
                <LangToggle />
                <ThemeToggle />
              </div>
              <div className="flex items-center justify-between gap-3">
                <SignInButton compact />
                <Button href="/contact" onClick={onClose} className="flex-1">
                  Start Now
                </Button>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
