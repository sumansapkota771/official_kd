"use client";

import { useEffect, useRef, useState } from "react";
import { ArrowLeft01Icon, ArrowRight01Icon } from "hugeicons-react";

export type HackathonSlideshowProps = {
  images: Array<{
    imageUrl: string;
    mobileImageUrl?: string;
    displayOrder: number;
  }>;
  intervalSeconds?: number;
  autoPlay?: boolean;
};

export function HackathonSlideshow({
  images,
  intervalSeconds = 5,
  autoPlay = true,
}: HackathonSlideshowProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAutoPlayActive, setIsAutoPlayActive] = useState(autoPlay);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // Sort images by display order
  const sortedImages = [...images].sort(
    (a, b) => a.displayOrder - b.displayOrder
  );

  if (sortedImages.length === 0) {
    return null;
  }

  const currentImage = sortedImages[currentIndex];
  const isMobile =
    typeof window !== "undefined" ? window.innerWidth < 768 : false;
  const imageUrl = isMobile && currentImage.mobileImageUrl 
    ? currentImage.mobileImageUrl 
    : currentImage.imageUrl;

  const goToNext = () => {
    setCurrentIndex((prev) => (prev + 1) % sortedImages.length);
    setIsAutoPlayActive(false);
  };

  const goToPrev = () => {
    setCurrentIndex((prev) =>
      prev === 0 ? sortedImages.length - 1 : prev - 1
    );
    setIsAutoPlayActive(false);
  };

  const goToSlide = (index: number) => {
    setCurrentIndex(index);
    setIsAutoPlayActive(false);
  };

  // Auto-play effect
  useEffect(() => {
    if (isAutoPlayActive && sortedImages.length > 1) {
      timerRef.current = setInterval(() => {
        setCurrentIndex((prev) => (prev + 1) % sortedImages.length);
      }, (intervalSeconds || 5) * 1000);
    }

    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, [isAutoPlayActive, intervalSeconds, sortedImages.length]);

  return (
    <div
      ref={containerRef}
      className="relative h-96 w-full overflow-hidden rounded-card bg-background-secondary md:h-[500px] lg:h-[600px]"
      role="region"
      aria-label="Hackathon showcase carousel"
      aria-live="polite"
    >
      {/* Background image with smooth fade transition */}
      <div className="absolute inset-0 overflow-hidden">
        {sortedImages.map((image, index) => (
          <div
            key={index}
            className={`absolute inset-0 transition-opacity duration-700 ease-out ${
              index === currentIndex ? "opacity-100" : "opacity-0"
            }`}
            style={{
              backgroundImage: `url("${
                index === currentIndex
                  ? isMobile && image.mobileImageUrl
                    ? image.mobileImageUrl
                    : image.imageUrl
                  : ""
              }")`,
              backgroundSize: "cover",
              backgroundPosition: "center",
            }}
            aria-hidden={index !== currentIndex}
          />
        ))}
      </div>

      {/* Overlay gradient for text readability */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-black/20 to-transparent" />

      {/* Navigation arrows */}
      {sortedImages.length > 1 && (
        <>
          <button
            type="button"
            onClick={goToPrev}
            className="focus-ring absolute left-4 top-1/2 z-10 -translate-y-1/2 transform rounded-full bg-white/20 p-2 text-white transition-all duration-fast hover:bg-white/30 hover:backdrop-blur-md md:left-6"
            aria-label="Previous slide"
            title="Previous slide"
          >
            <ArrowLeft01Icon className="h-6 w-6 md:h-7 md:w-7" />
          </button>

          <button
            type="button"
            onClick={goToNext}
            className="focus-ring absolute right-4 top-1/2 z-10 -translate-y-1/2 transform rounded-full bg-white/20 p-2 text-white transition-all duration-fast hover:bg-white/30 hover:backdrop-blur-md md:right-6"
            aria-label="Next slide"
            title="Next slide"
          >
            <ArrowRight01Icon className="h-6 w-6 md:h-7 md:w-7" />
          </button>
        </>
      )}

      {/* Slide indicators and controls */}
      {sortedImages.length > 1 && (
        <div className="absolute bottom-4 left-0 right-0 z-10 flex items-center justify-center gap-2 md:bottom-6">
          {sortedImages.map((_, index) => (
            <button
              key={index}
              type="button"
              onClick={() => goToSlide(index)}
              className={`transition-all duration-fast rounded-full ${
                index === currentIndex
                  ? "h-2.5 w-8 bg-white"
                  : "h-2 w-2 bg-white/50 hover:bg-white/75"
              }`}
              aria-label={`Go to slide ${index + 1}`}
              aria-current={index === currentIndex}
            />
          ))}
        </div>
      )}

      {/* Auto-play toggle */}
      {sortedImages.length > 1 && (
        <button
          type="button"
          onClick={() => setIsAutoPlayActive(!isAutoPlayActive)}
          className="focus-ring absolute right-4 top-4 z-10 rounded-full bg-white/20 px-3 py-1.5 text-xs font-medium text-white transition-all duration-fast hover:bg-white/30 hover:backdrop-blur-md md:right-6 md:top-6"
          title={isAutoPlayActive ? "Pause slideshow" : "Play slideshow"}
        >
          {isAutoPlayActive ? "Pause" : "Play"}
        </button>
      )}
    </div>
  );
}
