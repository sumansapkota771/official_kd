"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import {
  ArrowLeft01Icon,
  ArrowRight01Icon,
  QuoteUpIcon,
  VolumeHighIcon,
  VolumeOffIcon,
} from "hugeicons-react";
import { useReducedMotion } from "framer-motion";
import { useFinePointer } from "@/lib/hooks/use-fine-pointer";
import { cn } from "@/lib/utils";

export type TestimonialItem = {
  slug: string;
  name: string;
  role: string;
  quote: string;
  videoUrl?: string;
  posterUrl?: string;
};

/**
 * Classify a testimonial video URL.
 *
 * A `<video>` element can only play a direct media file (mp4/webm/…). Pasting
 * a YouTube/Vimeo link into it fails silently, so those are rewritten into
 * their embed players instead. The embed URL is built with muted autoplay so
 * the clip still behaves like the file-based rail.
 */
type VideoSource = { kind: "file" } | { kind: "embed"; src: string };

function videoSource(url?: string): VideoSource {
  if (!url) return { kind: "file" };
  const youtube = url.match(
    /(?:youtube\.com\/(?:watch\?.*v=|shorts\/|embed\/)|youtu\.be\/)([A-Za-z0-9_-]{6,})/
  );
  if (youtube) {
    const id = youtube[1];
    return {
      kind: "embed",
      src: `https://www.youtube-nocookie.com/embed/${id}?autoplay=1&mute=1&loop=1&playlist=${id}&playsinline=1&rel=0`,
    };
  }
  const vimeo = url.match(/vimeo\.com\/(\d+)/);
  if (vimeo) {
    return {
      kind: "embed",
      src: `https://player.vimeo.com/video/${vimeo[1]}?autoplay=1&muted=1&loop=1`,
    };
  }
  return { kind: "file" };
}

/**
 * Video testimonial rail.
 *
 * Audio model — the part worth understanding before changing anything:
 *
 *  - Every clip autoplays **muted**. This is not a preference; browsers only
 *    permit unattended playback when muted, so muted-by-default is the only
 *    state that can start on its own.
 *  - Exactly one clip may be audible at a time. Two people talking over each
 *    other is the failure mode this guards against.
 *  - Sound is opt-in via the header toggle. Until the visitor turns it on,
 *    hovering and tapping change nothing audible — a page that starts talking
 *    at you is the fastest way to get closed.
 *  - With sound on: desktop unmutes on hover, touch unmutes on tap. Hover
 *    doesn't exist on touch, and tap-to-play is what that audience expects.
 */
export function TestimonialRail({ items }: { items: TestimonialItem[] }) {
  const railRef = useRef<HTMLUListElement>(null);
  const videosRef = useRef(new Map<string, HTMLVideoElement>());

  const finePointer = useFinePointer();
  const reduceMotion = useReducedMotion();

  const [soundOn, setSoundOn] = useState(false);
  const [activeSlug, setActiveSlug] = useState<string | null>(null);
  const [atStart, setAtStart] = useState(true);
  const [atEnd, setAtEnd] = useState(true);
  const [canScroll, setCanScroll] = useState(false);

  /** Mute every clip except `keep`, and unmute `keep` when sound is enabled. */
  const applyAudio = useCallback((keep: string | null, enabled: boolean) => {
    for (const [slug, video] of videosRef.current) {
      const audible = enabled && slug === keep;
      video.muted = !audible;
      if (audible) {
        // Unmuting can still be refused if the page has had no interaction.
        // Failing silently back to muted video is the right degradation.
        video.play().catch(() => {
          video.muted = true;
        });
      }
    }
  }, []);

  const activate = useCallback(
    (slug: string | null) => {
      setActiveSlug(slug);
      applyAudio(slug, soundOn);
    },
    [applyAudio, soundOn]
  );

  const toggleSound = useCallback(() => {
    setSoundOn((on) => {
      const next = !on;
      applyAudio(next ? activeSlug : null, next);
      return next;
    });
  }, [applyAudio, activeSlug]);

  /** Tap target on touch: focus this card's audio, and bring it fully into view. */
  const handleCardActivate = useCallback(
    (slug: string, node: HTMLLIElement | null) => {
      activate(activeSlug === slug ? null : slug);
      node?.scrollIntoView({
        behavior: reduceMotion ? "auto" : "smooth",
        inline: "center",
        block: "nearest",
      });
    },
    [activate, activeSlug, reduceMotion]
  );

  const updateArrows = useCallback(() => {
    const rail = railRef.current;
    if (!rail) return;
    const scrollable = rail.scrollWidth > rail.clientWidth + 8;
    setCanScroll(scrollable);
    setAtStart(rail.scrollLeft <= 8);
    setAtEnd(rail.scrollLeft + rail.clientWidth >= rail.scrollWidth - 8);
  }, []);

  useEffect(() => {
    const rail = railRef.current;
    if (!rail) return;

    updateArrows();
    rail.addEventListener("scroll", updateArrows, { passive: true });

    // A one-shot measurement on mount goes stale: web fonts land, video
    // posters decode, and the card count can change with the CMS. Observing
    // the rail keeps the arrows honest about what is actually scrollable.
    const observer = new ResizeObserver(updateArrows);
    observer.observe(rail);
    for (const child of rail.children) observer.observe(child);

    return () => {
      rail.removeEventListener("scroll", updateArrows);
      observer.disconnect();
    };
  }, [updateArrows]);

  const scrollByCard = (direction: 1 | -1) => {
    const rail = railRef.current;
    if (!rail) return;
    const card = rail.querySelector("li");
    const step = card ? card.clientWidth + 20 : rail.clientWidth * 0.8;
    rail.scrollBy({
      left: step * direction,
      behavior: reduceMotion ? "auto" : "smooth",
    });
  };

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between gap-4">
        <button
          type="button"
          onClick={toggleSound}
          aria-pressed={soundOn}
          className="focus-ring inline-flex items-center gap-2 rounded-full border-[0.5px] border-border bg-surface px-4 py-2 text-sm font-semibold text-text-secondary transition-colors duration-micro hover:border-brand-blue/40 hover:text-text-primary"
        >
          {soundOn ? (
            <VolumeHighIcon className="h-6 w-6 text-link" />
          ) : (
            <VolumeOffIcon className="h-6 w-6" />
          )}
          {soundOn ? "Sound on" : "Sound off"}
        </button>

        {/* Hidden outright when everything already fits. Two permanently
            greyed-out arrows are visual debris that imply content which
            isn't there. */}
        {canScroll && (
          <div className="flex items-center gap-2">
            <RailButton
              label="Previous testimonials"
              disabled={atStart}
              onClick={() => scrollByCard(-1)}
            >
              <ArrowLeft01Icon className="h-6 w-6" />
            </RailButton>
            <RailButton
              label="More testimonials"
              disabled={atEnd}
              onClick={() => scrollByCard(1)}
            >
              <ArrowRight01Icon className="h-6 w-6" />
            </RailButton>
          </div>
        )}
      </div>

      <ul
        ref={railRef}
        // `snap-x` plus per-card `snap-start` keeps arrow scrolling and free
        // swiping landing on the same positions, so the two input methods
        // never disagree about where a card sits.
        // No `scroll-smooth` class here: it would force smooth scrolling even
        // when scrollByCard deliberately passes behavior "auto" for
        // reduced-motion users. Behaviour is decided per call instead.
        className="-mx-5 flex snap-x snap-mandatory gap-5 overflow-x-auto px-5 pb-2 sm:mx-0 sm:px-0"
      >
        {items.map((item) => (
          <TestimonialCard
            key={item.slug}
            item={item}
            isActive={activeSlug === item.slug}
            soundOn={soundOn}
            finePointer={finePointer}
            reduceMotion={reduceMotion ?? false}
            registerVideo={(el) => {
              if (el) videosRef.current.set(item.slug, el);
              else videosRef.current.delete(item.slug);
            }}
            onHoverIn={() => finePointer && activate(item.slug)}
            onHoverOut={() => finePointer && activate(null)}
            onActivate={handleCardActivate}
          />
        ))}
      </ul>
    </div>
  );
}

function RailButton({
  label,
  disabled,
  onClick,
  children,
}: {
  label: string;
  disabled: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      aria-label={label}
      className="focus-ring inline-flex h-9 w-9 items-center justify-center rounded-full border-[0.5px] border-border bg-surface text-text-secondary transition-colors duration-micro hover:border-brand-blue/40 hover:text-link disabled:pointer-events-none disabled:opacity-35"
    >
      {children}
    </button>
  );
}

function TestimonialCard({
  item,
  isActive,
  soundOn,
  finePointer,
  reduceMotion,
  registerVideo,
  onHoverIn,
  onHoverOut,
  onActivate,
}: {
  item: TestimonialItem;
  isActive: boolean;
  soundOn: boolean;
  finePointer: boolean;
  reduceMotion: boolean;
  registerVideo: (el: HTMLVideoElement | null) => void;
  onHoverIn: () => void;
  onHoverOut: () => void;
  onActivate: (slug: string, node: HTMLLIElement | null) => void;
}) {
  const cardRef = useRef<HTMLLIElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const hasVideo = Boolean(item.videoUrl);
  const source = videoSource(item.videoUrl);
  const isEmbed = source.kind === "embed";

  // Only play what is on screen. A rail of autoplaying clips that continues
  // decoding off-screen is a battery and bandwidth cost with nothing to show
  // for it — and on mobile data that cost is the visitor's.
  useEffect(() => {
    const card = cardRef.current;
    if (!card || !hasVideo || reduceMotion) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        const video = videoRef.current;
        if (!video) return;
        if (entry.isIntersecting) video.play().catch(() => {});
        else video.pause();
      },
      { threshold: 0.5 }
    );
    observer.observe(card);
    return () => observer.disconnect();
  }, [hasVideo, reduceMotion]);

  const audible = isActive && soundOn;

  return (
    <li
      ref={cardRef}
      className="w-[68vw] max-w-70 shrink-0 snap-start sm:w-60 lg:w-65"
      onMouseEnter={onHoverIn}
      onMouseLeave={onHoverOut}
    >
      <div
        className={cn(
          "group/clip relative aspect-9/16 overflow-hidden rounded-2xl border-[0.5px] border-border bg-surface-elevated transition-[transform,box-shadow,border-color] duration-ui ease-out-quint",
          isActive ? "border-brand-blue/50 shadow-elevated" : "shadow-card"
        )}
      >
        {isEmbed ? (
          /* YouTube/Vimeo links can't feed a `<video>` element; the embed
             player (muted autoplay) handles them instead. */
          <>
            <iframe
              src={source.src}
              title={`Video testimonial from ${item.name}, ${item.role}`}
              className="absolute inset-0 h-full w-full border-0 object-cover"
              allow="autoplay; fullscreen; picture-in-picture"
              allowFullScreen
              loading="lazy"
            />

            <div
              aria-hidden
              className="pointer-events-none absolute inset-x-0 bottom-0 h-2/5 bg-black/60"
            />

            <span
              aria-hidden
              className="absolute right-3 top-3 z-20 inline-flex h-8 w-8 items-center justify-center rounded-full bg-black/45 text-white/85 backdrop-blur"
            >
              <VolumeOffIcon className="h-5.25 w-5.25" />
            </span>

            <figcaption className="pointer-events-none absolute inset-x-0 bottom-0 z-20 p-4 text-white">
              <p className="text-sm font-semibold">{item.name}</p>
              <p className="text-xs text-white/75">{item.role}</p>
            </figcaption>
          </>
        ) : hasVideo ? (
          <>
            <video
              ref={(el) => {
                videoRef.current = el;
                registerVideo(el);
              }}
              src={item.videoUrl}
              poster={item.posterUrl}
              muted
              loop
              playsInline
              preload="metadata"
              // Autoplay is skipped under reduced motion; the clip then shows
              // its poster with native controls, so the content is still
              // reachable without unrequested movement.
              autoPlay={!reduceMotion}
              controls={reduceMotion}
              aria-label={`Video testimonial from ${item.name}, ${item.role}`}
              className="absolute inset-0 h-full w-full object-cover"
            />

            {/* Tap layer for touch. Hidden from pointer devices, where hover
                already does this job and an overlay would only swallow clicks. */}
            {!finePointer && !reduceMotion && (
              <button
                type="button"
                onClick={() => onActivate(item.slug, cardRef.current)}
                aria-label={
                  audible
                    ? `Mute ${item.name}'s testimonial`
                    : `Play sound for ${item.name}'s testimonial`
                }
                className="absolute inset-0 z-10"
              />
            )}

            <div
              aria-hidden
              className="pointer-events-none absolute inset-x-0 bottom-0 h-2/5 bg-black/60"
            />

            <span
              aria-hidden
              className={cn(
                "absolute right-3 top-3 z-20 inline-flex h-8 w-8 items-center justify-center rounded-full backdrop-blur transition-colors duration-micro",
                audible ? "bg-brand-blue text-white" : "bg-black/45 text-white/85"
              )}
            >
              {audible ? (
                <VolumeHighIcon className="h-5.25 w-5.25" />
              ) : (
                <VolumeOffIcon className="h-5.25 w-5.25" />
              )}
            </span>

            <figcaption className="pointer-events-none absolute inset-x-0 bottom-0 z-20 p-4 text-white">
              <p className="text-sm font-semibold">{item.name}</p>
              <p className="text-xs text-white/75">{item.role}</p>
            </figcaption>
          </>
        ) : (
          /* No clip supplied — the written quote fills the same 9:16 frame so
             the rail keeps its rhythm instead of showing a gap. */
          <figure className="flex h-full flex-col p-5">
            <QuoteUpIcon className="h-7.5 w-7.5 shrink-0 text-brand-green" />
            {/* Centred in the leftover space. Top-aligned, a short quote in a
                9:16 frame leaves an obvious hole under it. */}
            <blockquote className="flex flex-1 items-center overflow-y-auto py-4 text-sm leading-relaxed text-text-secondary">
              {item.quote}
            </blockquote>
            <figcaption className="shrink-0">
              <p className="text-sm font-semibold text-text-primary">{item.name}</p>
              <p className="text-xs text-text-muted">{item.role}</p>
            </figcaption>
          </figure>
        )}
      </div>
    </li>
  );
}
