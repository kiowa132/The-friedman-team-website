import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import HTMLFlipBook from 'react-pageflip-enhanced';
import { ChevronLeft, ChevronRight, X, Menu, Download, Expand } from 'lucide-react';
import { HandbookGuide } from '../types/handbook';

interface HandbookReaderProps {
  guide: HandbookGuide;
}

function useIsMobile(): boolean {
  const [isMobile, setIsMobile] = useState(() => typeof window !== 'undefined' && window.innerWidth < 640);
  useEffect(() => {
    const handler = () => setIsMobile(window.innerWidth < 640);
    window.addEventListener('resize', handler);
    return () => window.removeEventListener('resize', handler);
  }, []);
  return isMobile;
}

// Fullscreen lightbox - shared by both the mobile single-page view and
// the "expand" button on desktop pages.
const Lightbox: React.FC<{ pages: HandbookGuide['pages']; startIndex: number; onClose: () => void }> = ({ pages, startIndex, onClose }) => {
  const [index, setIndex] = useState(startIndex);
  const touchStartX = useRef<number | null>(null);

  useEffect(() => {
    const original = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = original; };
  }, []);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight' && index < pages.length - 1) setIndex(index + 1);
      if (e.key === 'ArrowLeft' && index > 0) setIndex(index - 1);
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [index, pages.length, onClose]);

  const onTouchStart = (e: React.TouchEvent) => { touchStartX.current = e.touches[0].clientX; };
  const onTouchEnd = (e: React.TouchEvent) => {
    if (touchStartX.current === null) return;
    const delta = e.changedTouches[0].clientX - touchStartX.current;
    if (delta < -50 && index < pages.length - 1) setIndex(index + 1);
    if (delta > 50 && index > 0) setIndex(index - 1);
    touchStartX.current = null;
  };

  return (
    <div className="fixed inset-0 z-[70] bg-black flex flex-col" onTouchStart={onTouchStart} onTouchEnd={onTouchEnd}>
      <div className="shrink-0 flex items-center justify-between px-4 py-3">
        <span className="text-xs text-white/60 tabular-nums">{index + 1} / {pages.length}</span>
        <button onClick={onClose} className="w-9 h-9 rounded-full bg-white/10 flex items-center justify-center" aria-label="Close">
          <X className="w-4 h-4 text-white" />
        </button>
      </div>
      <div className="flex-1 flex items-center justify-center overflow-hidden px-2 relative">
        {index > 0 && (
          <button onClick={() => setIndex(index - 1)} className="absolute left-2 w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center">
            <ChevronLeft className="w-5 h-5 text-white" />
          </button>
        )}
        <img key={index} src={pages[index].image} alt={pages[index].label} className="max-w-full max-h-full object-contain" />
        {index < pages.length - 1 && (
          <button onClick={() => setIndex(index + 1)} className="absolute right-2 w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center">
            <ChevronRight className="w-5 h-5 text-white" />
          </button>
        )}
      </div>
      <div className="shrink-0 text-center text-[11px] text-white/40 pb-4">Swipe to browse</div>
    </div>
  );
};

export const HandbookReader: React.FC<HandbookReaderProps> = ({ guide }) => {
  const isMobile = useIsMobile();
  const bookRef = useRef<any>(null);
  const [currentPage, setCurrentPage] = useState(0);
  const [tocOpen, setTocOpen] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);
  const total = guide.pages.length;

  const goToPage = (i: number) => {
    if (isMobile) {
      setCurrentPage(Math.max(0, Math.min(total - 1, i)));
    } else {
      bookRef.current?.pageFlip()?.flip(i);
    }
  };
  const next = () => {
    if (isMobile) {
      setCurrentPage((p) => Math.min(total - 1, p + 1));
    } else {
      bookRef.current?.pageFlip()?.flipNext();
    }
  };
  const prev = () => {
    if (isMobile) {
      setCurrentPage((p) => Math.max(0, p - 1));
    } else {
      bookRef.current?.pageFlip()?.flipPrev();
    }
  };

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (lightboxIndex !== null) return;
      if (e.key === 'ArrowRight') next();
      if (e.key === 'ArrowLeft') prev();
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentPage, lightboxIndex, isMobile]);

  const jumpToPage = (i: number) => {
    goToPage(i);
    setTocOpen(false);
  };

  // Stable reference across re-renders - regenerating this array on every
  // page flip can reset the book back to page 1 with this library.
  const bookPages = useMemo(
    () =>
      guide.pages.map((p, i) => (
        <div key={i} className="bg-[#0D2226]">
          <img src={p.image} alt={p.label} className="w-full h-full object-contain" draggable={false} />
        </div>
      )),
    [guide.pages]
  );

  return (
    <div className="fixed inset-0 z-50 flex flex-col" style={{ background: 'radial-gradient(ellipse at center, #1a2a2d 0%, #0D2226 70%)' }}>
      <div className="shrink-0 flex items-center justify-between px-4 sm:px-8 py-4">
        <button onClick={() => setTocOpen(true)} className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-white/70 hover:text-[#C9A96A] transition-colors">
          <Menu className="w-4 h-4" /> <span className="hidden sm:inline">Contents</span>
        </button>
        <span className="text-xs font-semibold text-white/50 text-center px-4 truncate">{guide.title}</span>
        <div className="flex items-center gap-3">
          <a href={guide.pdfUrl} download className="hidden sm:flex items-center gap-1.5 text-xs font-bold uppercase tracking-widest text-white/70 hover:text-[#C9A96A] transition-colors">
            <Download className="w-4 h-4" />
          </a>
          <Link to="/guides" className="w-8 h-8 rounded-full flex items-center justify-center hover:bg-white/10 transition-colors" aria-label="Close">
            <X className="w-4 h-4 text-white/70" />
          </Link>
        </div>
      </div>

      {tocOpen && (
        <div className="fixed inset-0 z-10 flex">
          <div className="absolute inset-0 bg-black/60" onClick={() => setTocOpen(false)} />
          <div className="relative w-full max-w-xs bg-[#FAF8F5] h-full p-6 overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <span className="text-xs font-bold uppercase tracking-widest text-[#C9A96A]">Table of Contents</span>
              <button onClick={() => setTocOpen(false)}><X className="w-4 h-4" /></button>
            </div>
            <div className="space-y-1">
              {guide.pages.map((p, i) => (
                <button
                  key={i}
                  onClick={() => jumpToPage(i)}
                  className={`block w-full text-left px-3 py-2.5 text-sm rounded-xs transition-colors ${currentPage === i ? 'bg-[#0F5C63]/10 text-[#0F5C63] font-semibold' : 'text-[#1C2B2E]/70 hover:bg-[#0D2226]/5'}`}
                >
                  {p.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      <div className="flex-1 flex items-start sm:items-center justify-center px-2 sm:px-8 overflow-hidden">
        {isMobile ? (
          // Mobile: bypass the flip library entirely - a plain image with
          // tap-to-lightbox. Proven simpler and more reliable than trying
          // to configure the library's own portrait mode. Aligned to the
          // top (items-start above) rather than centered - every page's
          // title bar sits near the top of the image, and on shorter
          // phone viewports the full page is often taller than the
          // visible area, so centering it clipped the title itself.
          // Aligning top means any overflow is cropped from the bottom
          // instead, and the full page is always one tap away in the
          // lightbox anyway.
          <div className="relative w-full max-w-[480px] mt-2">
            <button
              onClick={() => setLightboxIndex(currentPage)}
              className="relative w-full rounded-lg shadow-2xl overflow-hidden border-4 border-[#0F5C63] bg-[#0D2226] block"
            >
              <img src={guide.pages[currentPage].image} alt={guide.pages[currentPage].label} className="w-full h-auto block" />
              <div className="absolute bottom-2 right-2 flex items-center gap-1.5 px-3 py-1.5 bg-[#0D2226]/85 text-[#C9A96A] text-[10px] font-bold uppercase tracking-wider rounded-full shadow-lg">
                <Expand className="w-3 h-3" />
                Tap to Enlarge
              </div>
            </button>
          </div>
        ) : (
          // Desktop: the real flip book - drag a corner to curl it, or
          // click near an edge. showCover/usePortrait/singlePage are all
          // false on purpose - true here reserves a matching blank half
          // for the cover, which looks small and lopsided.
          <div className="relative w-full max-w-[1000px]">
            <div className="relative rounded-lg shadow-2xl w-full flex justify-center overflow-hidden border-4 border-[#0F5C63]">
              <HTMLFlipBook
                ref={bookRef}
                width={430}
                height={608}
                size="stretch"
                minWidth={300}
                maxWidth={550}
                minHeight={424}
                maxHeight={778}
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

              {/* Purely decorative depth cues - pointer-events-none so
                  they never interfere with the library's own click/drag
                  detection. */}
              <div
                className="absolute top-0 bottom-0 left-1/2 -translate-x-1/2 w-16 pointer-events-none"
                style={{ background: 'linear-gradient(to right, transparent, rgba(13,34,38,0.16) 45%, rgba(13,34,38,0.22) 50%, rgba(13,34,38,0.16) 55%, transparent)' }}
              />
              <div className="absolute top-0 bottom-0 left-0 w-3 pointer-events-none" style={{ background: 'linear-gradient(to right, rgba(13,34,38,0.18), transparent)' }} />
              <div className="absolute top-0 bottom-0 right-0 w-3 pointer-events-none" style={{ background: 'linear-gradient(to left, rgba(13,34,38,0.18), transparent)' }} />
              <div
                className="absolute bottom-0 right-0 w-8 h-8 pointer-events-none"
                style={{ background: 'linear-gradient(135deg, transparent 50%, rgba(201,169,106,0.35) 50%, rgba(201,169,106,0.5) 100%)', borderBottomRightRadius: '0.5rem' }}
              />
            </div>

            <button
              onClick={() => setLightboxIndex(currentPage)}
              className="absolute top-3 right-3 w-9 h-9 rounded-full bg-black/50 hover:bg-black/70 flex items-center justify-center transition-colors z-20"
              aria-label="View full size"
            >
              <Expand className="w-4 h-4 text-white" />
            </button>
          </div>
        )}
      </div>

      <div className="shrink-0 px-4 sm:px-8 py-4">
        <div className="flex items-center justify-center gap-4 mb-3">
          <button onClick={prev} disabled={currentPage === 0} className="w-9 h-9 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center disabled:opacity-30 disabled:pointer-events-none transition-colors">
            <ChevronLeft className="w-4 h-4 text-white" />
          </button>
          <span className="text-xs text-white/50 tabular-nums">{isMobile ? currentPage + 1 : Math.min(currentPage + 2, total)} / {total}</span>
          <button onClick={next} disabled={isMobile ? currentPage === total - 1 : currentPage + 2 >= total} className="w-9 h-9 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center disabled:opacity-30 disabled:pointer-events-none transition-colors">
            <ChevronRight className="w-4 h-4 text-white" />
          </button>
        </div>
        <div className="flex items-center justify-center gap-1.5 overflow-x-auto pb-1">
          {guide.pages.map((p, i) => (
            <button
              key={i}
              onClick={() => jumpToPage(i)}
              className={`shrink-0 w-8 h-11 rounded-[2px] overflow-hidden border transition-all ${currentPage === i ? 'border-[#C9A96A] opacity-100' : 'border-white/10 opacity-50 hover:opacity-80'}`}
            >
              <img src={p.image} alt={p.label} className="w-full h-full object-cover" />
            </button>
          ))}
        </div>
      </div>

      {lightboxIndex !== null && (
        <Lightbox pages={guide.pages} startIndex={lightboxIndex} onClose={() => setLightboxIndex(null)} />
      )}
    </div>
  );
};
