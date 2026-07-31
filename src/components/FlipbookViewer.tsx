import React, { useState, useEffect } from 'react';
import HTMLFlipBook from 'react-pageflip-enhanced';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface FlipbookViewerProps {
  pages: string[];
  title: string;
}

// Renders pre-converted page images (one per PDF page, generated once ahead
// of time - never rendered live from a PDF in the visitor's browser, which
// is what keeps this fast and smooth instead of clunky). Automatically
// switches to single-page mode on narrow screens for a proper mobile
// reading experience.
export const FlipbookViewer: React.FC<FlipbookViewerProps> = ({ pages, title }) => {
  const [isMobile, setIsMobile] = useState(false);
  const bookRef = React.useRef<any>(null);

  useEffect(() => {
    const checkWidth = () => setIsMobile(window.innerWidth < 640);
    checkWidth();
    window.addEventListener('resize', checkWidth);
    return () => window.removeEventListener('resize', checkWidth);
  }, []);

  if (pages.length === 0) return null;

  const goPrev = () => bookRef.current?.pageFlip()?.flipPrev();
  const goNext = () => bookRef.current?.pageFlip()?.flipNext();

  return (
    <div className="flex flex-col items-center gap-4">
      <div className="w-full flex justify-center">
        <HTMLFlipBook
          ref={bookRef}
          width={620}
          height={480}
          size="stretch"
          minWidth={320}
          maxWidth={900}
          minHeight={260}
          maxHeight={720}
          singlePage={isMobile}
          usePortrait={isMobile}
          showCover={true}
          className="shadow-2xl"
          style={{}}
          startPage={0}
          drawShadow={true}
          flippingTime={600}
          maxShadowOpacity={0.5}
          mobileScrollSupport={true}
        >
          {pages.map((src, i) => (
            <div key={i} className="bg-white">
              <img src={src} alt={`${title} - page ${i + 1}`} className="w-full h-full object-contain" />
            </div>
          ))}
        </HTMLFlipBook>
      </div>

      {/* Explicit tap targets in addition to swipe - some readers won't
          discover the swipe/click-corner gesture on their own. */}
      <div className="flex items-center gap-4">
        <button
          onClick={goPrev}
          aria-label="Previous page"
          className="w-10 h-10 rounded-full bg-[#0D2226] text-[#C9A96A] flex items-center justify-center shadow-md hover:bg-[#0F5C63] transition-colors"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>
        <span className="text-xs text-[#1C2B2E]/50 uppercase tracking-widest">Tap to Turn Pages</span>
        <button
          onClick={goNext}
          aria-label="Next page"
          className="w-10 h-10 rounded-full bg-[#0D2226] text-[#C9A96A] flex items-center justify-center shadow-md hover:bg-[#0F5C63] transition-colors"
        >
          <ChevronRight className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
};
