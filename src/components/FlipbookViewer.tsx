import React, { useState, useEffect, useMemo, useRef } from 'react';
import HTMLFlipBook from 'react-pageflip-enhanced';
import { ChevronLeft, ChevronRight, Hand, X, Maximize2 } from 'lucide-react';

interface FlipbookViewerProps {
  pages: string[];
  title: string;
}

// Renders pre-converted page images (one per PDF page, generated once ahead
// of time - never rendered live from a PDF in the visitor's browser, which
// is what keeps this fast and smooth instead of clunky).
//
// Two distinct states, not one component doing both:
//   1. Closed: a real static, centered cover image with a "click to open"
//      cue - full control over how it looks, no wasted space.
//   2. Open: the actual page-flip book, using normal two-page spreads
//      (not "cover mode", which reserves a matching blank half for a
//      single cover page - that's what was making everything look small
//      and lopsided).
export const FlipbookViewer: React.FC<FlipbookViewerProps> = ({ pages, title }) => {
  const [isMobile, setIsMobile] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(0);
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);
  const bookRef = React.useRef<any>(null);
  const touchStartX = useRef<number | null>(null);

  useEffect(() => {
    const checkWidth = () => setIsMobile(window.innerWidth < 640);
    checkWidth();
    window.addEventListener('resize', checkWidth);
    return () => window.removeEventListener('resize', checkWidth);
  }, []);

  const goPrev = () => {
    if (isMobile) {
      setCurrentPage((p) => Math.max(0, p - 1));
    } else {
      bookRef.current?.pageFlip()?.flipPrev();
    }
  };
  const goNext = () => {
    if (isMobile) {
      setCurrentPage((p) => Math.min(pages.length - 1, p + 1));
    } else {
      bookRef.current?.pageFlip()?.flipNext();
    }
  };

  // Stable reference across re-renders - without this, updating
  // currentPage on every flip regenerates this array, which combined with
  // the library's default behavior can reset the book back to page 1.
  const bookPages = useMemo(
    () =>
      pages.map((src, i) => (
        <div key={i} className="bg-[#0D2226]">
          <img src={src} alt={`${title} - page ${i + 1}`} className="w-full h-full object-contain" />
        </div>
      )),
    [pages, title]
  );

  if (pages.length === 0) return null;

  return (
    <div className="flex flex-col items-center gap-5 w-full">
      <div
        className="w-full flex justify-center py-10 px-4 rounded-xs relative"
        style={{
          background: 'radial-gradient(ellipse at center, rgba(201,169,106,0.14) 0%, rgba(201,169,106,0.04) 55%, transparent 80%)',
        }}
      >
        {!isOpen ? (
          // CLOSED: real static cover, centered, sized generously - looks
          // like an actual closed book, not a widget waiting to render.
          <div className="relative w-full max-w-[560px]">
            <div
              className="absolute left-1/2 -translate-x-1/2 bottom-[-14px] w-[85%] h-5 rounded-full blur-md"
              style={{ background: 'rgba(13,34,38,0.35)' }}
            />
            <button
              onClick={() => setIsOpen(true)}
              className="relative w-full rounded-lg shadow-2xl overflow-hidden block hover:brightness-95 transition-all hover:scale-[1.01] border-2 border-[#C9A96A]"
            >
              <img src={pages[0]} alt={title} className="w-full h-auto block" />
              <div className="absolute inset-x-0 bottom-0 pb-6 flex justify-center bg-gradient-to-t from-black/25 to-transparent pt-10">
                <span className="flex items-center gap-2 px-5 py-2.5 bg-[#0D2226]/90 text-[#C9A96A] text-xs font-bold uppercase tracking-widest rounded-full shadow-lg animate-pulse">
                  <Hand className="w-4 h-4" />
                  Click to Open
                </span>
              </div>
            </button>
          </div>
        ) : isMobile ? (
          // OPEN, MOBILE: a plain, full-width single image with tap
          // navigation - no flip-book library involved at all, so there's
          // no aspect-ratio math to get wrong. Guaranteed to size correctly
          // since it's just a normal <img>.
          <div className="relative w-full max-w-[480px]">
            <div
              className="absolute left-1/2 -translate-x-1/2 bottom-[-14px] w-[85%] h-5 rounded-full blur-md"
              style={{ background: 'rgba(13,34,38,0.35)' }}
            />
            <button
              onClick={() => setLightboxIndex(currentPage)}
              className="relative w-full rounded-lg shadow-2xl overflow-hidden border-4 border-[#0F5C63] bg-[#0D2226] block"
            >
              <img
                src={pages[currentPage]}
                alt={`${title} - page ${currentPage + 1}`}
                className="w-full h-auto block"
              />
              <div className="absolute bottom-2 right-2 flex items-center gap-1.5 px-3 py-1.5 bg-[#0D2226]/85 text-[#C9A96A] text-[10px] font-bold uppercase tracking-wider rounded-full shadow-lg">
                <Maximize2 className="w-3 h-3" />
                Tap to Enlarge
              </div>
            </button>
          </div>
        ) : (
          // OPEN, DESKTOP: the real flip book, normal spreads, full
          // stretch width - no reserved blank half since we're not using
          // cover mode here.
          <div className="relative w-full max-w-[1550px]">
            <div
              className="absolute left-1/2 -translate-x-1/2 bottom-[-14px] w-[85%] h-5 rounded-full blur-md"
              style={{ background: 'rgba(13,34,38,0.35)' }}
            />
            <div className="relative rounded-lg shadow-2xl w-full flex justify-center overflow-hidden border-4 border-[#0F5C63]">
              <HTMLFlipBook
                ref={bookRef}
                width={750}
                height={422}
                size="stretch"
                minWidth={500}
                maxWidth={800}
                minHeight={281}
                maxHeight={450}
                singlePage={false}
                usePortrait={false}
                showCover={false}
                startPage={0}
                drawShadow={true}
                flippingTime={650}
                maxShadowOpacity={0.6}
                mobileScrollSupport={true}
                renderOnlyPageLengthChange={true}
                onFlip={(e: any) => setCurrentPage(e.data)}
              >
                {bookPages}
              </HTMLFlipBook>

              {/* Purely decorative depth cues - pointer-events-none so they
                  can never interfere with the library's click/flip
                  detection, which broke once already from a similar overlay. */}

              {/* Center spine/gutter shadow - sells "these are two bound
                  pages," not two flat images sitting side by side. */}
              <div
                className="absolute top-0 bottom-0 left-1/2 -translate-x-1/2 w-16 pointer-events-none"
                style={{
                  background: 'linear-gradient(to right, transparent, rgba(13,34,38,0.16) 45%, rgba(13,34,38,0.22) 50%, rgba(13,34,38,0.16) 55%, transparent)',
                }}
              />

              {/* Outer edge depth - suggests a stack of paper, not a single flat sheet */}
              <div
                className="absolute top-0 bottom-0 left-0 w-3 pointer-events-none"
                style={{ background: 'linear-gradient(to right, rgba(13,34,38,0.18), transparent)' }}
              />
              <div
                className="absolute top-0 bottom-0 right-0 w-3 pointer-events-none"
                style={{ background: 'linear-gradient(to left, rgba(13,34,38,0.18), transparent)' }}
              />

              {/* Small page-curl hint, bottom-right - an extra invitation to
                  flip, on top of the arrow buttons */}
              <div
                className="absolute bottom-0 right-0 w-8 h-8 pointer-events-none"
                style={{
                  background: 'linear-gradient(135deg, transparent 50%, rgba(201,169,106,0.35) 50%, rgba(201,169,106,0.5) 100%)',
                  borderBottomRightRadius: '0.5rem',
                }}
              />
            </div>
          </div>
        )}
      </div>

      {isOpen && (
        <div className="flex items-center gap-5">
          <button
            onClick={goPrev}
            aria-label="Previous page"
            className="w-11 h-11 rounded-full bg-[#0D2226] text-[#C9A96A] flex items-center justify-center shadow-lg hover:bg-[#0F5C63] hover:scale-105 transition-all"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <span className="text-xs text-[#1C2B2E]/60 uppercase tracking-widest min-w-[110px] text-center">
            Page {Math.min(currentPage + 1, pages.length)} of {pages.length}
          </span>
          <button
            onClick={goNext}
            aria-label="Next page"
            className="w-11 h-11 rounded-full bg-[#0D2226] text-[#C9A96A] flex items-center justify-center shadow-lg hover:bg-[#0F5C63] hover:scale-105 transition-all"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>
      )}

      {/* Fullscreen lightbox - opened by tapping the mobile page image.
          Swipe left/right to move between pages while enlarged. */}
      {lightboxIndex !== null && (
        <div
          className="fixed inset-0 z-50 bg-black/95 flex items-center justify-center"
          onClick={() => {
            setCurrentPage(lightboxIndex);
            setLightboxIndex(null);
          }}
          onTouchStart={(e) => {
            touchStartX.current = e.touches[0].clientX;
          }}
          onTouchEnd={(e) => {
            if (touchStartX.current === null) return;
            const delta = e.changedTouches[0].clientX - touchStartX.current;
            const SWIPE_THRESHOLD = 50;
            if (delta > SWIPE_THRESHOLD) {
              setLightboxIndex((i) => (i !== null ? Math.max(0, i - 1) : i));
            } else if (delta < -SWIPE_THRESHOLD) {
              setLightboxIndex((i) => (i !== null ? Math.min(pages.length - 1, i + 1) : i));
            }
            touchStartX.current = null;
          }}
        >
          <button
            onClick={(e) => {
              e.stopPropagation();
              setCurrentPage(lightboxIndex);
              setLightboxIndex(null);
            }}
            aria-label="Close"
            className="absolute top-5 right-5 w-11 h-11 rounded-full bg-white/10 text-white flex items-center justify-center hover:bg-white/20 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>

          <img
            src={pages[lightboxIndex]}
            alt={`${title} - page ${lightboxIndex + 1}`}
            className="max-w-full max-h-[80vh] object-contain px-4"
            onClick={(e) => e.stopPropagation()}
          />

          {lightboxIndex > 0 && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                setLightboxIndex((i) => (i !== null ? Math.max(0, i - 1) : i));
              }}
              aria-label="Previous page"
              className="absolute left-3 sm:left-6 top-1/2 -translate-y-1/2 w-11 h-11 rounded-full bg-white/10 text-white flex items-center justify-center hover:bg-white/20 transition-colors"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
          )}
          {lightboxIndex < pages.length - 1 && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                setLightboxIndex((i) => (i !== null ? Math.min(pages.length - 1, i + 1) : i));
              }}
              aria-label="Next page"
              className="absolute right-3 sm:right-6 top-1/2 -translate-y-1/2 w-11 h-11 rounded-full bg-white/10 text-white flex items-center justify-center hover:bg-white/20 transition-colors"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          )}

          <span className="absolute bottom-5 left-1/2 -translate-x-1/2 text-white/70 text-xs uppercase tracking-widest">
            Page {lightboxIndex + 1} of {pages.length}
          </span>
        </div>
      )}
    </div>
  );
};
