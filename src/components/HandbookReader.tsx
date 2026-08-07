import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ChevronLeft, ChevronRight, X, Menu, Download } from 'lucide-react';
import { HandbookGuide } from '../data/guides/buyer-handbook-2026';

interface HandbookReaderProps {
  guide: HandbookGuide;
}

// Groups pages into "views": the cover and back-cover CTA stand alone,
// interior pages pair up into two-page spreads on desktop (single page on
// mobile, handled with CSS rather than a second layout branch).
function buildViews(pages: HandbookGuide['pages']): number[][] {
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

export const HandbookReader: React.FC<HandbookReaderProps> = ({ guide }) => {
  const views = buildViews(guide.pages);
  const [viewIndex, setViewIndex] = useState(0);
  const [tocOpen, setTocOpen] = useState(false);

  const goTo = (i: number) => setViewIndex(Math.max(0, Math.min(views.length - 1, i)));
  const next = () => goTo(viewIndex + 1);
  const prev = () => goTo(viewIndex - 1);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight') next();
      if (e.key === 'ArrowLeft') prev();
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [viewIndex]);

  const jumpToPage = (pageIdx: number) => {
    const vi = views.findIndex((v) => v.includes(pageIdx));
    if (vi >= 0) goTo(vi);
    setTocOpen(false);
  };

  const currentPages = views[viewIndex];

  return (
    <div className="fixed inset-0 z-50 flex flex-col" style={{ background: 'radial-gradient(ellipse at center, #1a2a2d 0%, #0D2226 70%)' }}>
      {/* Top bar */}
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

      {/* TOC drawer */}
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

      {/* Page spread */}
      <div className="flex-1 flex items-center justify-center px-4 sm:px-16 overflow-hidden">
        <div key={viewIndex} className="flex gap-2 sm:gap-3 items-center justify-center max-h-full animate-[fadeIn_0.4s_ease]">
          {currentPages.map((pageIdx) => (
            <img
              key={pageIdx}
              src={guide.pages[pageIdx].image}
              alt={guide.pages[pageIdx].label}
              className="max-h-[75vh] w-auto object-contain rounded-sm shadow-[0_30px_80px_rgba(0,0,0,0.6)]"
            />
          ))}
        </div>
      </div>

      {/* Bottom: thumbnail strip + nav */}
      <div className="shrink-0 px-4 sm:px-8 py-4">
        <div className="flex items-center justify-center gap-4 mb-3">
          <button onClick={prev} disabled={viewIndex === 0} className="w-9 h-9 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center disabled:opacity-30 disabled:pointer-events-none transition-colors">
            <ChevronLeft className="w-4 h-4 text-white" />
          </button>
          <span className="text-xs text-white/50 tabular-nums">{viewIndex + 1} / {views.length}</span>
          <button onClick={next} disabled={viewIndex === views.length - 1} className="w-9 h-9 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center disabled:opacity-30 disabled:pointer-events-none transition-colors">
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
    </div>
  );
};
