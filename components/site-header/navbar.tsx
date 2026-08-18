"use client";

import Link from "next/link";
import Image from "next/image";
import { useState, useRef } from "react";
import { motion, AnimatePresence, useScroll, useMotionValueEvent } from "framer-motion";
import { usePathname } from "next/navigation";
import { Menu01Icon, Call02Icon, Time02Icon, Cancel01Icon, ArrowRight01Icon } from "hugeicons-react";
import { navGroups } from "@/lib/data/nav";
import { NavDropdown } from "@/components/site-header/nav-dropdown";
import { ThemeToggle } from "@/components/site-header/theme-toggle";
import { MobileMenu } from "@/components/site-header/mobile-menu";
import { SignInButton } from "@/components/auth/sign-in-button";
import { cn } from "@/lib/utils";

export function Navbar() {
  const pathname = usePathname();
  const isHome = pathname === "/";
  const [scrolled, setScrolled] = useState(false);
  const [hidden, setHidden] = useState(false);
  const [announcementOpen, setAnnouncementOpen] = useState(true);
  const [mobileOpen, setMobileOpen] = useState(false);
  const prevScrollRef = useRef(0);
  const scrolledRef = useRef(false);
  const { scrollY } = useScroll();

  useMotionValueEvent(scrollY, "change", (latest) => {
    const prev = prevScrollRef.current;
    prevScrollRef.current = latest;
    if (latest > 8 && !scrolledRef.current) {
      scrolledRef.current = true;
      setScrolled(true);
    } else if (latest < 2 && scrolledRef.current) {
      scrolledRef.current = false;
      setScrolled(false);
    }
    if (latest > prev + 2 && latest > 120) {
      setHidden(true);
    } else if (prev > latest + 2) {
      setHidden(false);
    }
  });

  const topBarsVisible = isHome ? !scrolled : !hidden;

  const navLinks = (
    <nav aria-label="Primary" className="hidden items-center gap-7 lg:flex">
      {navGroups.map((group) => (
        <NavDropdown key={group.label} group={group} />
      ))}
    </nav>
  );

  const hamburger = (
    <button
      onClick={() => setMobileOpen(true)}
      aria-label="Open menu"
      className="focus-ring inline-flex h-10 w-10 items-center justify-center rounded-[var(--radius-sm)] border border-border text-text-secondary lg:hidden"
    >
      <Menu01Icon className="h-6.75 w-6.75" />
    </button>
  );

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border bg-background/95 backdrop-blur supports-backdrop-filter:bg-background/85">
      {/* Announcement bar */}
      <AnimatePresence initial={false}>
        {topBarsVisible && announcementOpen && (
          <motion.div
            key="announcement"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.22, ease: "easeInOut" }}
            className="overflow-hidden bg-announcement text-white"
          >
            <div className="mx-auto flex max-w-7xl items-center justify-center gap-2 px-5 py-2 text-center text-[11px] font-medium sm:gap-3 sm:text-xs">
              <span className="hidden rounded-full bg-white/15 px-2 py-0.5 font-semibold uppercase tracking-wide sm:inline">
                Next cohort
              </span>
              <span>AI &amp; Machine Learning Bootcamp starts 1 September — limited seats.</span>
              <Link
                href="/learn/ai-machine-learning"
                className="inline-flex shrink-0 items-center gap-1 font-semibold underline underline-offset-2 hover:no-underline"
              >
                See the course <ArrowRight01Icon className="h-4.5 w-4.5" />
              </Link>
              <button
                onClick={() => setAnnouncementOpen(false)}
                aria-label="Dismiss announcement"
                className="focus-ring ml-1 shrink-0 rounded-full p-0.5 hover:bg-white/15"
              >
                <Cancel01Icon className="h-5.25 w-5.25" />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Utility bar */}
      <AnimatePresence initial={false}>
        {topBarsVisible && (
          <motion.div
            key="utility"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.22, ease: "easeInOut" }}
            className="overflow-hidden border-b border-border bg-background-secondary"
          >
            <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-5 py-2 text-xs">
              <span className="hidden truncate font-semibold tracking-[0.16em] text-text-muted sm:inline">
                ONE PARTNER. EVERY SOLUTION. EVERY STEP OF THE WAY.
              </span>
              <div className="flex items-center gap-3 text-text-secondary sm:gap-4">
                <a href="tel:+9779851362001" className="flex items-center gap-1.5 font-medium hover:text-brand-blue">
                  <Call02Icon className="h-5.25 w-5.25" />
                  <span className="hidden sm:inline">+977 9851362001</span>
                </a>
                <span className="hidden items-center gap-1.5 md:flex">
                  <Time02Icon className="h-5.25 w-5.25" /> 9:00 AM – 7:00 PM
                </span>
                <ThemeToggle />
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Logo + nav row — single DOM structure with absolute positioning for smooth CSS animation */}
      <div
        className={cn(
          "mx-auto max-w-7xl relative transition-all duration-500 ease-[cubic-bezier(0.22,1,0.36,1)]",
          isHome ? (scrolled ? "h-[64px]" : "h-[172px] sm:h-[188px]") : "h-[64px]"
        )}
      >
        <Link
          href="/"
          aria-label="KodeDristi home"
          className={cn(
            "absolute z-10 block shrink-0 transition-all duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] will-change-transform",
            isHome
              ? scrolled
                ? "left-5 top-1/2 -translate-y-1/2 h-10 w-[130px]"
                : "left-1/2 -translate-x-1/2 top-4 h-20 w-[220px] sm:h-24 sm:w-[260px]"
              : "left-5 top-1/2 -translate-y-1/2 h-10 w-[130px]"
          )}
        >
          <Image
            src="/images/logo.png"
            alt="KodeDristi Software Pvt. Ltd."
            fill
            priority
            className="object-contain object-center"
            sizes="260px"
          />
        </Link>

        <div
          className={cn(
            "absolute left-5 right-5 flex items-center justify-between transition-all duration-500 ease-[cubic-bezier(0.22,1,0.36,1)]",
            isHome
              ? scrolled
                ? "top-1/2 -translate-y-1/2 pl-[140px] sm:pl-[160px]"
                : "bottom-4 pt-3"
              : "top-1/2 -translate-y-1/2 pl-[140px] sm:pl-[160px]"
          )}
        >
          {navLinks}
          <div className="ml-auto flex items-center gap-3">
            <SignInButton />
            {hamburger}
          </div>
        </div>
      </div>

      <MobileMenu open={mobileOpen} onClose={() => setMobileOpen(false)} />
    </header>
  );
}
