"use client";

import Link from "next/link";
import Image from "next/image";
import { useState, useRef } from "react";
import { motion, AnimatePresence, useScroll, useMotionValueEvent } from "framer-motion";
import { usePathname } from "next/navigation";
import { Menu01Icon, Call02Icon, Time02Icon, Cancel01Icon, ArrowRight01Icon } from "hugeicons-react";
import type { NavGroup } from "@/lib/data/nav";
import { NavGroups } from "@/components/site-header/nav-dropdown";
import { ThemeToggle } from "@/components/site-header/theme-toggle";
import { MobileMenu } from "@/components/site-header/mobile-menu";
import { SignInButton } from "@/components/auth/sign-in-button";

export function Navbar({ navGroups }: { navGroups: NavGroup[] }) {
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

  const hamburger = (
    <button
      onClick={() => setMobileOpen(true)}
      aria-label="Open menu"
      className="focus-ring inline-flex h-9 w-9 items-center justify-center rounded-[var(--radius-sm)] border border-nav-border text-nav-text-muted transition-colors hover:border-nav-text hover:text-nav-text lg:hidden"
    >
      <Menu01Icon className="h-6.25 w-6.25" />
    </button>
  );

  return (
    /* The whole stack — promo banner excepted, which keeps its own bright
       green so a limited-seats offer still pops — shares one flat, fully
       opaque --nav-bg, so hovering a nav item extends the exact same colour
       rather than a translucent one that would pick up a slightly different
       tint from whatever page content happens to sit behind it. */
    <header className="sticky top-0 z-50 w-full border-b border-nav-border bg-nav-bg">
      {/* Announcement bar */}
      <AnimatePresence initial={false}>
        {topBarsVisible && announcementOpen && (
          <motion.div
            key="announcement"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.22, ease: "easeInOut" }}
            /* Positioned + z-50: the dropdown's own curtain is a sibling
               elsewhere in this header at z-40, and without an explicit
               stacking order here that curtain paints over this bar's own
               content (position:fixed layers ignore DOM order). Every piece
               of the header's own chrome needs this, not just the row the
               dropdown hangs from, since this bar can be visible at the
               same time as an open dropdown. */
            className="relative z-50 overflow-hidden bg-announcement text-white"
          >
            <div className="mx-auto flex max-w-7xl items-center justify-center gap-2 px-5 py-2 text-center text-[11px] font-medium sm:gap-3 sm:text-xs">
              <span className="hidden rounded-full bg-white/15 px-2 py-0.5 font-semibold uppercase tracking-wide sm:inline">
                Next cohort
              </span>
              <span>AI &amp; Machine Learning Bootcamp starts 1 September — limited seats.</span>
              {/* Points at contact, not at the course page. Courses are
                  presented on the homepage now and their detail pages are no
                  longer linked from anywhere in the header. */}
              <Link
                href="/contact"
                className="inline-flex shrink-0 items-center gap-1 font-semibold underline underline-offset-2 hover:no-underline"
              >
                Enquire <ArrowRight01Icon className="h-4.5 w-4.5" />
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
            className="relative z-50 overflow-hidden border-b border-nav-border bg-nav-bg"
          >
            <div className="mx-auto flex max-w-[1720px] items-center justify-between gap-4 px-5 py-2 text-xs sm:px-8 lg:px-14">
              <span className="hidden truncate font-semibold tracking-[0.16em] text-nav-text-muted sm:inline">
                ONE PARTNER. EVERY SOLUTION. EVERY STEP OF THE WAY.
              </span>
              <div className="flex items-center gap-3 text-nav-text-muted sm:gap-4">
                <a href="tel:+9779842863398" className="flex items-center gap-1.5 font-medium transition-colors hover:text-nav-text">
                  <Call02Icon className="h-5.25 w-5.25" />
                  <span className="hidden sm:inline">+977 9842863398</span>
                </a>
                <span className="hidden items-center gap-1.5 md:flex">
                  <Time02Icon className="h-5.25 w-5.25" /> 9:00 AM – 7:00 PM
                </span>
                <ThemeToggle className="border-nav-border text-nav-text-muted hover:border-nav-text hover:text-nav-text" />
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* One fixed row: mark, nav, actions.

          This used to be a 168px block on the homepage with the logo centred,
          shrinking to 54px and sliding left on scroll. It is gone. A header
          that resizes itself as you scroll moves the nav out from under the
          pointer mid-reach, and it cost the hero the top sixth of the first
          viewport to do it. The mark sits left at one size, always. */}
      {/* Two elements, not one: the bar's fill has to span the full viewport
          while its contents stay inside the 1720px measure. The fill also has
          to live on this wrapper rather than being inherited from <header>,
          because the dropdown's curtain is a fixed z-40 layer *inside* the
          header — it paints over the header's own background, so a
          transparent row here would be tinted by it while the dropdown panel,
          which carries its own fill, stayed pure white. That mismatch is
          exactly the "colour difference" between bar and panel. */}
      <div className="relative z-50 bg-nav-bg">
        {/* 44px — apple.com's own primary bar height, down from the previous
            62px. Everything inside is sized to sit comfortably within that,
            not just centred over the leftover space. */}
        <div className="mx-auto flex h-11 max-w-[1720px] items-center gap-6 px-5 sm:px-8 lg:px-14">
          <Link
            href="/"
            aria-label="KodeDristi home"
            className="focus-ring flex shrink-0 items-center gap-2.5"
          >
            <span className="relative block h-7 w-[62px]">
              <Image
                src="/images/logo.png"
                alt=""
                fill
                priority
                className="object-contain"
                sizes="62px"
              />
            </span>
          </Link>

          <NavGroups groups={navGroups} />

          <div className="ml-auto flex items-center gap-3">
            <SignInButton compact />
            {hamburger}
          </div>
        </div>
      </div>

      <MobileMenu open={mobileOpen} onClose={() => setMobileOpen(false)} navGroups={navGroups} />
    </header>
  );
}
