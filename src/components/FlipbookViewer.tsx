import React, { useState, useEffect, useMemo } from 'react';
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
// 2, and stays closed until clicked.
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

  const goPrev = () => bookRef.current?.pageFlip()?.flipPrev();
  const goNext = () => bookRef.current?.pageFlip()?.flipNext();

  // Memoized so the children array keeps a stable reference across
  // re-renders (e.g. when onFlip updates currentPage/hasOpened below).
  // Without this, every state update created a brand-new children array,
  // which combined with the library's default re-render behavior was
  // resetting the whole book back to the cover on every flip - this is
  // the actual cause of "stuck on page 1."
  const bookPages = useMemo(
    () =>
      pages.map((src, i) => (
        <div key={i} className="bg-white relative">
          <img src={src} alt={`${title} - page ${i + 1}`} className="w-full h-full object-contain" />
          {i === 0 && (
            <div className="absolute inset-0 flex items-end justify-center pb-6 pointer-events-none">
              <span
                className="flex items-center gap-2 px-4 py-2 bg-[#0D2226]/90 text-[#C9A96A] text-[11px] font-bold uppercase tracking-widest rounded-full shadow-lg animate-pulse cover-hint"
              >
                <Hand className="w-3.5 h-3.5" />
                Click to Open
              </span>
            </div>
          )}
        </div>
      )),
    [pages, title]
  );

  if (pages.length === 0) return null;

  return (
    <div className="flex flex-col items-center gap-5 w-full">
      <style>{`.cover-hint { transition: opacity 300ms; } .book-opened .cover-hint { opacity: 0; }`}</style>

      {/* Stage - soft radial backdrop, full width so "stretch" sizing has
          an actual container to fill instead of shrink-wrapping to the
          book's own default size. */}
      <div
        className="w-full flex justify-center py-10 px-4 rounded-xs relative"
        style={{
          background: 'radial-gradient(ellipse at center, rgba(201,169,106,0.14) 0%, rgba(201,169,106,0.04) 55%, transparent 80%)',
        }}
      >
        <div className={`relative w-full max-w-[1100px] ${hasOpened ? 'book-opened' : ''}`}>
          <div
            className="absolute left-1/2 -translate-x-1/2 bottom-[-14px] w-[85%] h-5 rounded-full blur-md"
            style={{ background: 'rgba(13,34,38,0.35)' }}
          />

          <div className="relative rounded-xs shadow-2xl w-full flex justify-center">
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
              startPage={0}
              drawShadow={true}
              flippingTime={650}
              maxShadowOpacity={0.6}
              mobileScrollSupport={true}
              renderOnlyPageLengthChange={true}
              onFlip={(e: any) => {
                setCurrentPage(e.data);
                setHasOpened(true);
              }}
            >
              {bookPages}
            </HTMLFlipBook>
          </div>
        </div>
      </div>

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
