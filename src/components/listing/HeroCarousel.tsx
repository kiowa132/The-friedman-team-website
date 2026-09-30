import React, { useEffect, useMemo, useRef, useState } from 'react';
import { ChevronLeft, ChevronRight, Expand } from 'lucide-react';

const SLIDE_MS = 6000;
const VIDEO_FALLBACK_MS = 15000; // safety net if the video never fires onEnded (blocked autoplay, network error)
const PAN_VARIANTS = ['animate-kb-zoom', 'animate-kb-pan-left', 'animate-kb-pan-right', 'animate-kb-pan-up'];

type Slide = { type: 'photo' | 'video'; src: string };

interface Props {
  photos: string[];
  videoUrl?: string; // inserted as the second slide (right after the hero photo) when set
  alt: string;
  onExpand: (src: string) => void; // the clicked photo's src, not a slide index - the video
  // insertion shifts every later slide's position, so a plain index would
  // resolve to the wrong photo in the caller's own (video-free) array.
}

// A Zillow-Showcase-style hero carousel: auto-advances through a curated set
// of photos (plus an optional video slide), each photo doing a slow Ken
// Burns pan (a different direction per slide so it doesn't feel like the
// same motion repeating), with a thin segmented progress bar (click a
// segment to jump) and prev/next arrows. Clicking a photo (or the expand
// button) opens the full lightbox; the video slide plays inline instead
// since the lightbox only handles photos.
export const HeroCarousel: React.FC<Props> = ({ photos, videoUrl, alt, onExpand }) => {
  const [index, setIndex] = useState(0);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const slides: Slide[] = useMemo(() => {
    const base: Slide[] = photos.map((src) => ({ type: 'photo', src }));
    if (videoUrl) base.splice(1, 0, { type: 'video', src: videoUrl });
    return base;
  }, [photos, videoUrl]);

  const n = slides.length;
  const current = slides[index];

  useEffect(() => {
    if (n <= 1) return;
    // The video slide advances itself via onEnded (so it plays in full
    // instead of being cut off at a fixed 6s); this timer is just a
    // fallback in case that never fires.
    const duration = current?.type === 'video' ? VIDEO_FALLBACK_MS : SLIDE_MS;
    timerRef.current = setTimeout(() => {
      setIndex((i) => (i + 1) % n);
    }, duration);
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
    // Restarting the timer on every index change keeps the segment that
    // was just clicked/arrowed-to visible for a full duration, instead of
    // cutting it short mid-cycle.
  }, [n, index, current?.type]);

  if (n === 0) return null;

  const goTo = (i: number) => setIndex(((i % n) + n) % n);

  return (
    <div className="relative w-full h-full overflow-hidden group/hero">
      {current.type === 'video' ? (
        <video
          key={index}
          src={current.src}
          autoPlay
          muted
          playsInline
          className="absolute inset-0 w-full h-full object-cover bg-black"
          onEnded={() => goTo(index + 1)}
        />
      ) : (
        <img
          key={index}
          src={current.src}
          alt={`${alt} photo ${index + 1}`}
          className={`absolute inset-0 w-full h-full object-cover cursor-zoom-in ${PAN_VARIANTS[index % PAN_VARIANTS.length]}`}
          style={{ '--kb-duration': `${SLIDE_MS + 800}ms` } as React.CSSProperties}
          onClick={() => onExpand(current.src)}
        />
      )}

      {n > 1 && (
        <>
          <button
            type="button"
            aria-label="Previous slide"
            onClick={() => goTo(index - 1)}
            className="absolute left-3 top-1/2 -translate-y-1/2 z-20 w-9 h-9 rounded-full bg-[#0D2226]/40 hover:bg-[#0D2226]/70 backdrop-blur-sm text-[#FAF8F5] flex items-center justify-center opacity-0 group-hover/hero:opacity-100 transition-opacity"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <button
            type="button"
            aria-label="Next slide"
            onClick={() => goTo(index + 1)}
            className="absolute right-3 top-1/2 -translate-y-1/2 z-20 w-9 h-9 rounded-full bg-[#0D2226]/40 hover:bg-[#0D2226]/70 backdrop-blur-sm text-[#FAF8F5] flex items-center justify-center opacity-0 group-hover/hero:opacity-100 transition-opacity"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </>
      )}

      {/* The lightbox only handles photos, so there's nothing sensible for
          this button to open on the video slide. */}
      {current.type === 'photo' && (
        <button
          type="button"
          aria-label="View full size"
          onClick={() => onExpand(current.src)}
          className="absolute right-3 top-28 z-20 w-9 h-9 rounded-full bg-[#0D2226]/40 hover:bg-[#0D2226]/70 backdrop-blur-sm text-[#FAF8F5] flex items-center justify-center"
        >
          <Expand className="w-4 h-4" />
        </button>
      )}

      {n > 1 && (
        <div className="absolute left-0 right-0 bottom-0 z-20 flex gap-1.5 px-3 pb-3">
          {slides.map((s, i) => (
            <button
              key={i}
              type="button"
              aria-label={`Go to ${s.type === 'video' ? 'video' : `photo ${i + 1}`}`}
              onClick={() => goTo(i)}
              className="flex-1 h-1 rounded-full bg-[#FAF8F5]/30 overflow-hidden"
            >
              <span
                className={`block h-full bg-[#C9A96A] transition-[width] ${
                  i === index
                    ? `w-full ease-linear ${s.type === 'video' ? 'duration-[9000ms]' : 'duration-[6000ms]'}`
                    : i < index
                      ? 'w-full'
                      : 'w-0'
                }`}
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
};
