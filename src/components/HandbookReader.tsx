import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { ChevronLeft, ChevronRight, X, Menu, Download, Expand } from 'lucide-react';
import { HandbookGuide } from '../data/guides/buyer-handbook-2026';

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

function buildViews(pages: HandbookGuide['pages'], isMobile: boolean): number[][] {
  if (isMobile) {
    return pages.map((_, i) => [i]);
  }
  const views: number[][] = [];
  const last = pages.length - 1;
  views.push([0]);
  let i = 1;
  while (i < last) {
    if (i + 1 < last) {
      views.push([i, i + 1]);
      i += 2;
    } else {
      views.push([i]);
      i += 1;
    }
  }
  views.push([last]);
  return views;
}

// Fullscreen mobile lightbox - tap a page to open it large, swipe left or
// right to move between pages. Independent of the reader's own "views"
// grouping since on mobile those are already one page each.
const MobileLightbox: React.FC<{
  pages: HandbookGuide['pages'];
  startIndex: number;
  onClose: () => void;
}> = ({ pages, startIndex, onClose }) => {
  const [index, setIndex] = useState(startIndex);
  const touchStartX = useRef<number | null>(null);

  useEffect(() => {
    const original = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = original; };
  }, []);

  const onTouchStart = (e: React.TouchEvent) => { touchStartX.current = e.touches[0].clientX; };
  const onTouchEnd = (e: React.TouchEvent) => {
    if (touchStartX.current === null) return;
    const delta = e.changedTouches[0].clientX - touchStartX.current;
    if (delta < -50 && index < pages.length - 1) setIndex(index + 1);
    if (delta > 50 && index > 0) setIndex(index - 1);
    touchStartX.current = null;
  };

  return (
    <div
      className="fixed inset-0 z-[70] bg-black flex flex-col"
      onTouchStart={onTouchStart}
      onTouchEnd={onTouchEnd}
    >
      <div className="shrink-0 flex items-center justify-between px-4 py-3">
        <span className="text-xs text-white/60 tabular-nums">{index + 1} / {pages.length}</span>
        <button onClick={onClose} className="w-9 h-9 rounded-full bg-white/10 flex items-center justify-center" aria-label="Close">
          <X className="w-4 h-4 text-white" />
        </button>
      </div>
      <div className="flex-1 flex items-center justify-center overflow-hidden px-2">
        <img
          key={index}
          src={pages[index].image}
          alt={pages[index].label}
          className="max-w-full max-h-full object-contain animate-[fadeIn_0.25s_ease]"
        />
      </div>
      <div className="shrink-0 text-center text-[11px] text-white/40 pb-4">Swipe to browse</div>
    </div>
  );
};

export const HandbookReader: React.FC<HandbookReaderProps> = ({ guide }) => {
  const isMobile = useIsMobile();
  const views = useMemo(() => buildViews(guide.pages, isMobile), [guide.pages, isMobile]);
  const [viewIndex, setViewIndex] = useState(0);
  const [tocOpen, setTocOpen] = useState(false);
  const [lightboxOpen, setLightboxOpen] = useState(false);

  // Page-turn animation state (desktop only). Only the single page that
  // is actually "turning" animates - the right-hand page of the outgoing
  // spread for "next", the left-hand page for "prev" - matching how a
  // real book turns, rather than rotating the whole spread as one block.
  //
  // Critically, the base layer switches to the TARGET content the moment
  // the flip starts, not after the animation finishes - the turning page
  // sits on top of it and rotates away, so the new page is progressively
  // revealed underneath as it goes, instead of snapping into place at
  // the end.
  const [flip, setFlip] = useState<{ direction: 'next' | 'prev'; fromIndex: number; targetIndex: number; turningPageIdx: number } | null>(null);
  const flipTimeout = useRef<number | null>(null);

  const displayIndex = flip ? flip.targetIndex : viewIndex;
  const currentFirstPage = views[displayIndex]?.[0] ?? 0;
  useEffect(() => {
    const newIndex = views.findIndex((v) => v.includes(currentFirstPage));
    setViewIndex(newIndex >= 0 ? newIndex : 0);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isMobile]);

  const goTo = (i: number) => {
    const target = Math.max(0, Math.min(views.length - 1, i));
    if (target === viewIndex || flip) return;
    if (isMobile) {
      setViewIndex(target);
      return;
    }
    const direction = target > viewIndex ? 'next' : 'prev';
    const fromPages = views[viewIndex];
    const turningPageIdx = direction === 'next' ? fromPages[fromPages.length - 1] : fromPages[0];
    setFlip({ direction, fromIndex: viewIndex, targetIndex: target, turningPageIdx });
    if (flipTimeout.current) window.clearTimeout(flipTimeout.current);
    flipTimeout.current = window.setTimeout(() => {
      setViewIndex(target);
      setFlip(null);
    }, 500);
  };
  const next = () => goTo(viewIndex + 1);
  const prev = () => goTo(viewIndex - 1);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight') next();
      if (e.key === 'ArrowLeft') prev();
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [viewIndex, isMobile, views.length]);

  const jumpToPage = (pageIdx: number) => {
    const vi = views.findIndex((v) => v.includes(pageIdx));
    if (vi >= 0) goTo(vi);
    setTocOpen(false);
  };

  const currentPages = views[displayIndex];

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
                  className={`block w-full text-left px-3 py-2.5 text-sm rounded-xs transition-colors ${currentPages.includes(i) ? 'bg-[#0F5C63]/10 text-[#0F5C63] font-semibold' : 'text-[#1C2B2E]/70 hover:bg-[#0D2226]/5'}`}
                >
                  {p.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Page spread, with a real page-turn animation on desktop */}
      <div className="flex-1 flex items-center justify-center px-4 sm:px-16 overflow-hidden" style={{ perspective: '2000px' }}>
        <div
          key={displayIndex}
          className={`relative flex gap-2 sm:gap-3 items-center justify-center max-h-full ${!flip ? 'animate-[fadeIn_0.3s_ease]' : ''}`}
          style={flip ? { transformStyle: 'preserve-3d' } : undefined}
        >
          {currentPages.map((pageIdx) => (
            <div key={pageIdx} className="relative">
              <img
                src={guide.pages[pageIdx].image}
                alt={guide.pages[pageIdx].label}
                onClick={() => isMobile && setLightboxOpen(true)}
                className="max-h-[75vh] w-auto object-contain rounded-sm shadow-[0_30px_80px_rgba(0,0,0,0.6)]"
              />
              {isMobile && (
                <div className="absolute bottom-3 right-3 w-8 h-8 rounded-full bg-black/50 flex items-center justify-center pointer-events-none">
                  <Expand className="w-3.5 h-3.5 text-white" />
                </div>
              )}
            </div>
          ))}

          {/* The outgoing spread's turning page only - the other page in
              the spread (if any) is an invisible same-size placeholder,
              just to keep the layout aligned, since the new spread
              underneath already shows the correct content there. */}
          {flip && (
            <div className="absolute inset-0 flex gap-2 sm:gap-3 items-center justify-center">
              {views[flip.fromIndex].map((pageIdx) => {
                if (pageIdx !== flip.turningPageIdx) {
                  return (
                    <img
                      key={pageIdx}
                      src={guide.pages[pageIdx].image}
                      alt=""
                      className="max-h-[75vh] w-auto object-contain rounded-sm opacity-0"
                    />
                  );
                }
                return (
                  <div
                    key={pageIdx}
                    className="relative"
                    style={{
                      transformOrigin: flip.direction === 'next' ? 'left center' : 'right center',
                      backfaceVisibility: 'hidden',
                      WebkitBackfaceVisibility: 'hidden',
                      animation: `${flip.direction === 'next' ? 'pageTurnNext' : 'pageTurnPrev'} 0.5s ease-in-out forwards`,
                    }}
                  >
                    <img
                      src={guide.pages[pageIdx].image}
                      alt=""
                      className="max-h-[75vh] w-auto object-contain rounded-sm shadow-[0_30px_80px_rgba(0,0,0,0.6)]"
                    />
                    <div
                      className="absolute inset-0 bg-gradient-to-r from-black/0 via-black/40 to-black/0 rounded-sm"
                      style={{ animation: 'pageTurnShadow 0.5s ease-in-out forwards' }}
                    />
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      <div className="shrink-0 px-4 sm:px-8 py-4">
        <div className="flex items-center justify-center gap-4 mb-3">
          <button onClick={prev} disabled={displayIndex === 0} className="w-9 h-9 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center disabled:opacity-30 disabled:pointer-events-none transition-colors">
            <ChevronLeft className="w-4 h-4 text-white" />
          </button>
          <span className="text-xs text-white/50 tabular-nums">{displayIndex + 1} / {views.length}</span>
          <button onClick={next} disabled={displayIndex === views.length - 1} className="w-9 h-9 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center disabled:opacity-30 disabled:pointer-events-none transition-colors">
            <ChevronRight className="w-4 h-4 text-white" />
          </button>
        </div>
        <div className="flex items-center justify-center gap-1.5 overflow-x-auto pb-1">
          {guide.pages.map((p, i) => (
            <button
              key={i}
              onClick={() => jumpToPage(i)}
              className={`shrink-0 w-8 h-11 rounded-[2px] overflow-hidden border transition-all ${currentPages.includes(i) ? 'border-[#C9A96A] opacity-100' : 'border-white/10 opacity-50 hover:opacity-80'}`}
            >
              <img src={p.image} alt="" className="w-full h-full object-cover" />
            </button>
          ))}
        </div>
      </div>

      {isMobile && lightboxOpen && (
        <MobileLightbox
          pages={guide.pages}
          startIndex={currentFirstPage}
          onClose={() => setLightboxOpen(false)}
        />
      )}

      <style>{`
        @keyframes pageTurnNext {
          0% { transform: rotateY(0deg); }
          100% { transform: rotateY(-100deg); }
        }
        @keyframes pageTurnPrev {
          0% { transform: rotateY(0deg); }
          100% { transform: rotateY(100deg); }
        }
        @keyframes pageTurnShadow {
          0% { opacity: 0; }
          55% { opacity: 1; }
          100% { opacity: 0; }
        }
      `}</style>
    </div>
  );
};
