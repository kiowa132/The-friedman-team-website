import React, { useState, useEffect } from 'react';
import HTMLFlipBook from 'react-pageflip-enhanced';
import { ChevronLeft, ChevronRight, Hand } from 'lucide-react';

interface FlipbookViewerProps {
  pages: string[];
  title: string;
}

// Renders pre-converted page images (one per PDF page, generated once ahead
// of time - never rendered live from a PDF in the visitor's browser, which
// is what keeps this fast and smooth instead of clunky). The first page
// acts as a real closed book cover: it displays alone, not paired with page
// 2, and stays closed until clicked - matching a real book, not just a
// flat image sequence.
export const FlipbookViewer: React.FC<FlipbookViewerProps> = ({ pages, title }) => {
  const [isMobile, setIsMobile] = useState(false);
  const [currentPage, setCurrentPage] = useState(0);
  const [hasOpened, setHasOpened] = useState(false);
  const bookRef = React.useRef<any>(null);

  useEffect(() => {
    const checkWidth = () => setIsMobile(window.innerWidth < 640);
    checkWidth();
    window.addEventListener('resize', checkWidth);
    return () => window.removeEventListener('resize', checkWidth);
  }, []);

  if (pages.length === 0) return null;

  const goPrev = () => bookRef.current?.pageFlip()?.flipPrev();
  const goNext = () => {
    bookRef.current?.pageFlip()?.flipNext();
    setHasOpened(true);
  };

  return (
    <div className="flex flex-col items-center gap-5">
      {/* Stage - soft radial backdrop so the book feels like an object
          sitting on a surface, not a flat image floating on the page */}
      <div
        className="w-full flex justify-center py-10 px-4 rounded-xs relative"
        style={{
          background: 'radial-gradient(ellipse at center, rgba(201,169,106,0.14) 0%, rgba(201,169,106,0.04) 55%, transparent 80%)',
        }}
      >
        <div className="relative">
          {/* Book shadow - grounds it visually instead of looking flat */}
          <div
            className="absolute left-1/2 -translate-x-1/2 bottom-[-14px] w-[85%] h-5 rounded-full blur-md"
            style={{ background: 'rgba(13,34,38,0.35)' }}
          />

          <div className="relative" style={{ filter: 'drop-shadow(0 25px 35px rgba(13,34,38,0.35))' }}>
            <HTMLFlipBook
              ref={bookRef}
              width={750}
              height={560}
              size="stretch"
              minWidth={340}
              maxWidth={1100}
              minHeight={280}
              maxHeight={820}
              singlePage={isMobile}
              usePortrait={isMobile}
              showCover={true}
              className=""
              style={{}}
              startPage={0}
              drawShadow={true}
              flippingTime={650}
              maxShadowOpacity={0.6}
              mobileScrollSupport={true}
              onFlip={(e: any) => {
                setCurrentPage(e.data);
                setHasOpened(true);
              }}
            >
              {pages.map((src, i) => (
                <div key={i} className="bg-white relative">
                  <img src={src} alt={`${title} - page ${i + 1}`} className="w-full h-full object-contain" />
                  {/* "Click to open" cue - purely decorative (pointer-events-none)
                      so it never intercepts the library's own click-to-flip
                      handling underneath. It fades out via CSS once opened,
                      rather than being removed from the DOM mid-flip - that
                      DOM removal during an active flip was what caused the
                      page to snap back to the cover instead of completing
                      the turn. */}
                  {i === 0 && (
                    <div
                      className={`absolute inset-0 flex items-end justify-center pb-6 pointer-events-none transition-opacity duration-300 ${
                        hasOpened ? 'opacity-0' : 'opacity-100'
                      }`}
                    >
                      <span className="flex items-center gap-2 px-4 py-2 bg-[#0D2226]/90 text-[#C9A96A] text-[11px] font-bold uppercase tracking-widest rounded-full shadow-lg animate-pulse">
                        <Hand className="w-3.5 h-3.5" />
                        Click to Open
                      </span>
                    </div>
                  )}
                </div>
              ))}
            </HTMLFlipBook>
          </div>
        </div>
      </div>

      {/* Controls + page counter */}
      <div className="flex items-center gap-5">
        <button
          onClick={goPrev}
          aria-label="Previous page"
          className="w-11 h-11 rounded-full bg-[#0D2226] text-[#C9A96A] flex items-center justify-center shadow-lg hover:bg-[#0F5C63] hover:scale-105 transition-all"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>
        <span className="text-xs text-[#1C2B2E]/60 uppercase tracking-widest min-w-[110px] text-center">
          {hasOpened ? `Page ${Math.min(currentPage + 1, pages.length)} of ${pages.length}` : 'Tap to Turn Pages'}
        </span>
        <button
          onClick={goNext}
          aria-label="Next page"
          className="w-11 h-11 rounded-full bg-[#0D2226] text-[#C9A96A] flex items-center justify-center shadow-lg hover:bg-[#0F5C63] hover:scale-105 transition-all"
        >
          <ChevronRight className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
};
