import React, { useEffect, useRef, useState } from 'react';
import { ChevronLeft, ChevronRight, Expand } from 'lucide-react';

const SLIDE_MS = 6000;
const PAN_VARIANTS = ['animate-kb-zoom', 'animate-kb-pan-left', 'animate-kb-pan-right', 'animate-kb-pan-up'];

interface Props {
  photos: string[];
  alt: string;
  onExpand: (index: number) => void;
}

// A Zillow-Showcase-style hero carousel: auto-advances through a curated set
// of photos, each one doing a slow Ken Burns pan (a different direction per
// slide so it doesn't feel like the same motion repeating), with a thin
// segmented progress bar (click a segment to jump) and prev/next arrows.
// Clicking the photo (or the expand button) opens the full lightbox.
export const HeroCarousel: React.FC<Props> = ({ photos, alt, onExpand }) => {
  const [index, setIndex] = useState(0);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const n = photos.length;

  useEffect(() => {
    if (n <= 1) return;
    timerRef.current = setInterval(() => {
      setIndex((i) => (i + 1) % n);
    }, SLIDE_MS);
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
    // Restarting the interval on every index change keeps the segment
    // that was just clicked/arrowed-to visible for a full SLIDE_MS,
    // instead of cutting it short mid-cycle.
  }, [n, index]);

  if (n === 0) return null;

  const goTo = (i: number) => setIndex(((i % n) + n) % n);

  return (
    <div className="relative w-full h-full overflow-hidden group/hero">
      <img
        key={index}
        src={photos[index]}
        alt={`${alt} photo ${index + 1}`}
        className={`absolute inset-0 w-full h-full object-cover cursor-zoom-in ${PAN_VARIANTS[index % PAN_VARIANTS.length]}`}
        style={{ '--kb-duration': `${SLIDE_MS + 800}ms` } as React.CSSProperties}
        onClick={() => onExpand(index)}
      />

      {n > 1 && (
        <>
          <button
            type="button"
            aria-label="Previous photo"
            onClick={() => goTo(index - 1)}
            className="absolute left-3 top-1/2 -translate-y-1/2 z-20 w-9 h-9 rounded-full bg-[#0D2226]/40 hover:bg-[#0D2226]/70 backdrop-blur-sm text-[#FAF8F5] flex items-center justify-center opacity-0 group-hover/hero:opacity-100 transition-opacity"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <button
            type="button"
            aria-label="Next photo"
            onClick={() => goTo(index + 1)}
            className="absolute right-3 top-1/2 -translate-y-1/2 z-20 w-9 h-9 rounded-full bg-[#0D2226]/40 hover:bg-[#0D2226]/70 backdrop-blur-sm text-[#FAF8F5] flex items-center justify-center opacity-0 group-hover/hero:opacity-100 transition-opacity"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </>
      )}

      <button
        type="button"
        aria-label="View full size"
        onClick={() => onExpand(index)}
        className="absolute right-3 top-28 z-20 w-9 h-9 rounded-full bg-[#0D2226]/40 hover:bg-[#0D2226]/70 backdrop-blur-sm text-[#FAF8F5] flex items-center justify-center"
      >
        <Expand className="w-4 h-4" />
      </button>

      {n > 1 && (
        <div className="absolute left-0 right-0 bottom-0 z-20 flex gap-1.5 px-3 pb-3">
          {photos.map((_, i) => (
            <button
              key={i}
              type="button"
              aria-label={`Go to photo ${i + 1}`}
              onClick={() => goTo(i)}
              className="flex-1 h-1 rounded-full bg-[#FAF8F5]/30 overflow-hidden"
            >
              <span
                className={`block h-full bg-[#C9A96A] transition-[width] ${
                  i === index ? 'w-full duration-[6000ms] ease-linear' : i < index ? 'w-full' : 'w-0'
                }`}
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
};
