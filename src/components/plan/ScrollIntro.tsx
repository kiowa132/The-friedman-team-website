import React, { useEffect, useRef, useState } from 'react';
import type { MotionValue } from 'motion/react';
import { m, useMotionValueEvent, useReducedMotion, useScroll, useTransform } from 'motion/react';
import { ArrowRight } from 'lucide-react';

// Scroll-scrubbed footage: a real home-tour video, cut into frames, drawn on a
// canvas by scroll position. Scroll down and it plays forward; scroll up and
// it rewinds. The frames are pre-cut into public/images/marketing-plan/scrub
// (see notes/footage-permissions.md in the brain for the source and credit).
const FRAMES = {
  desktop: { dir: '/images/marketing-plan/scrub/d/', count: 175, perChapter: 35, w: 1280, h: 720 },
  mobile: { dir: '/images/marketing-plan/scrub/m/', count: 105, perChapter: 21, w: 720, h: 406 },
};
const frameUrl = (set: 'desktop' | 'mobile', n: number) => `${FRAMES[set].dir}${String(n).padStart(4, '0')}.webp`;

const CREDIT_URL = 'https://www.graceandnell.com/';
const CREDIT_TEXT = 'Home tour footage courtesy of Grace & Nell Homes, Artisan Home Tour, Greater Kansas City';

interface Chapter {
  kicker: string;
  title: string;
  text: string;
}

const CHAPTERS: Chapter[] = [
  { kicker: 'The Friedman Team', title: "Let's sell your home the right way.", text: 'Scroll to see how we do it. Then build your own plan in a few easy steps.' },
  { kicker: 'Step one', title: 'First, we get it ready.', text: 'Your Home Prep Advisor walks the home, tells you what is worth doing, and lines up the vendors.' },
  { kicker: 'Step two', title: 'Then we show it off.', text: 'Beautiful photos, 3D tours, drone views and video that make buyers stop scrolling.' },
  { kicker: 'Step three', title: 'Then we get it seen.', text: 'Every major site, our buyer network and paid reach put your home in front of the right people.' },
  { kicker: 'Step four', title: 'Then we bring buyers through the door.', text: 'Open houses, showings, feedback within 48 hours, and a negotiation plan set before the first offer.' },
];

const N = CHAPTERS.length;

const GRAIN =
  "url(\"data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='160' height='160'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='.9' numOctaves='2' stitchTiles='stitch'/></filter><rect width='100%' height='100%' filter='url(%23n)'/></svg>\")";

// Draws the footage. Frames load in a smart order (a sparse pass first so
// scrubbing works almost immediately, then the gaps), and the canvas blends
// between neighbouring frames so motion looks smooth, not stepped.
const FootageStage: React.FC<{ progressRef: React.MutableRefObject<number>; mobile: boolean }> = ({ progressRef, mobile }) => {
  const wrapRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const set = mobile ? 'mobile' : 'desktop';

  useEffect(() => {
    const wrap = wrapRef.current;
    const canvas = canvasRef.current;
    if (!wrap || !canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const cfg = FRAMES[set];
    const total = cfg.count;
    const imgs: (HTMLImageElement | null)[] = new Array(total).fill(null);
    let dirty = true;
    let cancelled = false;

    // Load order: every 6th frame first, then everything else.
    const order: number[] = [];
    for (let i = 0; i < total; i += 6) order.push(i);
    for (let i = 0; i < total; i++) if (i % 6 !== 0) order.push(i);
    let next = 0;
    const worker = async () => {
      while (!cancelled && next < order.length) {
        const i = order[next++];
        await new Promise<void>((resolve) => {
          const im = new Image();
          im.decoding = 'async';
          im.onload = () => {
            imgs[i] = im;
            dirty = true;
            resolve();
          };
          im.onerror = () => resolve();
          im.src = frameUrl(set, i + 1);
        });
      }
    };
    for (let k = 0; k < 6; k++) void worker();

    const nearest = (i: number): HTMLImageElement | null => {
      if (imgs[i]) return imgs[i];
      for (let d = 1; d < total; d++) {
        if (i - d >= 0 && imgs[i - d]) return imgs[i - d];
        if (i + d < total && imgs[i + d]) return imgs[i + d];
      }
      return null;
    };

    const dpr = Math.min(window.devicePixelRatio || 1, 1.75);
    const size = () => {
      canvas.width = Math.max(1, Math.round(wrap.clientWidth * dpr));
      canvas.height = Math.max(1, Math.round(wrap.clientHeight * dpr));
      dirty = true;
    };
    size();
    const ro = new ResizeObserver(size);
    ro.observe(wrap);

    const drawCover = (im: HTMLImageElement, alpha: number) => {
      const cw = canvas.width;
      const ch = canvas.height;
      const s = Math.max(cw / im.naturalWidth, ch / im.naturalHeight);
      const w = im.naturalWidth * s;
      const h = im.naturalHeight * s;
      ctx.globalAlpha = alpha;
      ctx.drawImage(im, (cw - w) / 2, (ch - h) / 2, w, h);
    };

    let visible = true;
    const io = new IntersectionObserver((e) => {
      visible = e.some((x) => x.isIntersecting);
    });
    io.observe(wrap);

    let cur = progressRef.current;
    let shown = -1;
    let raf = 0;
    const tick = () => {
      raf = requestAnimationFrame(tick);
      if (!visible) return;
      cur += (progressRef.current - cur) * 0.14;
      if (Math.abs(progressRef.current - cur) < 0.00005) cur = progressRef.current;
      if (!dirty && Math.abs(cur - shown) < 0.00012) return;
      shown = cur;
      dirty = false;
      const pos = Math.min(1, Math.max(0, cur)) * (total - 1);
      const i0 = Math.floor(pos);
      const f = pos - i0;
      const a = nearest(i0);
      const b = nearest(Math.min(total - 1, i0 + 1));
      if (!a) return;
      ctx.globalCompositeOperation = 'source-over';
      drawCover(a, 1);
      if (b && b !== a && f > 0.02) drawCover(b, f);
      ctx.globalAlpha = 1;
    };
    raf = requestAnimationFrame(tick);

    return () => {
      cancelled = true;
      cancelAnimationFrame(raf);
      ro.disconnect();
      io.disconnect();
    };
  }, [set, progressRef]);

  return (
    <div ref={wrapRef} className="absolute inset-0">
      {/* The first frame shows instantly while the rest load. */}
      <img src={frameUrl(set, 1)} alt="" className="absolute inset-0 w-full h-full object-cover" />
      <canvas ref={canvasRef} className="absolute inset-0 w-full h-full" />
    </div>
  );
};

// One chapter of copy, scrubbed by scroll position.
const TextLayer: React.FC<{ progress: MotionValue<number>; index: number; chapter: Chapter; onStart: () => void }> = ({ progress, index, chapter, onStart }) => {
  const s = index / N;
  const e = (index + 1) / N;
  const first = index === 0;
  const last = index === N - 1;

  const textOpacity = useTransform(
    progress,
    first ? [0, e - 0.07, e - 0.02] : last ? [s + 0.02, s + 0.07, 1] : [s + 0.02, s + 0.07, e - 0.07, e - 0.02],
    first ? [1, 1, 0] : last ? [0, 1, 1] : [0, 1, 1, 0]
  );
  const textY = useTransform(progress, first ? [0, 0.001] : [s + 0.02, s + 0.08], first ? [0, 0] : [48, 0]);

  return (
    <div className="absolute inset-0 pointer-events-none">
      <div className="relative h-full max-w-6xl mx-auto px-4 sm:px-8 flex items-end sm:items-center pb-28 sm:pb-0 pt-16">
        <m.div
          style={{ opacity: textOpacity, y: textY }}
          className="max-w-md sm:max-w-lg space-y-4 bg-white/75 backdrop-blur-md border border-white/70 shadow-[0_20px_60px_-20px_rgba(13,34,38,0.35)] rounded-sm p-6 sm:p-8"
        >
          <span className="text-xs font-bold uppercase tracking-[0.3em] text-[#0F5C63]">{chapter.kicker}</span>
          <h1 className="font-serif text-3xl sm:text-5xl font-bold leading-[1.05] text-[#0D2226]">{chapter.title}</h1>
          <p className="text-sm sm:text-lg text-[#1C2B2E]/80 leading-relaxed">{chapter.text}</p>
          {last && (
            <button
              onClick={onStart}
              className="pointer-events-auto inline-flex items-center gap-2 px-8 py-4 bg-[#0F5C63] hover:bg-[#0D2226] text-[#FAF8F5] font-bold text-xs uppercase tracking-widest rounded-xs shadow-xl transition-all hover:-translate-y-0.5"
            >
              Build my plan
              <ArrowRight className="w-4 h-4" />
            </button>
          )}
        </m.div>
      </div>
    </div>
  );
};

const Credit: React.FC<{ className?: string }> = ({ className = '' }) => (
  <a
    href={CREDIT_URL}
    target="_blank"
    rel="noopener noreferrer"
    className={'text-[10px] leading-snug text-[#0D2226]/80 hover:text-[#0F5C63] bg-white/70 backdrop-blur px-3 py-1.5 rounded-full underline-offset-2 hover:underline ' + className}
  >
    {CREDIT_TEXT}
  </a>
);

export const ScrollIntro: React.FC<{ onStart: () => void }> = ({ onStart }) => {
  const reduce = !!useReducedMotion();
  const ref = useRef<HTMLDivElement>(null);
  const progressRef = useRef(0);
  const [mobile] = useState(() => typeof window !== 'undefined' && window.innerWidth < 768);

  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end end'] });
  useMotionValueEvent(scrollYProgress, 'change', (v) => {
    progressRef.current = v;
  });
  const barScale = useTransform(scrollYProgress, [0, 1], [0, 1]);
  const cueOpacity = useTransform(scrollYProgress, [0, 0.06], [1, 0]);

  // Reduced motion: a plain stack of chapters with a still from each.
  if (reduce) {
    const set = mobile ? 'mobile' : 'desktop';
    return (
      <div className="bg-[#FAF8F5] pt-24 pb-16 space-y-12 max-w-3xl mx-auto px-5">
        {CHAPTERS.map((c, i) => (
          <div key={c.title} className="space-y-3">
            <img src={frameUrl(set, FRAMES[set].perChapter * i + 1)} alt="" className="w-full aspect-video object-cover rounded-xs" />
            <p className="text-xs font-bold uppercase tracking-[0.3em] text-[#0F5C63]">{c.kicker}</p>
            <h2 className="font-serif text-3xl font-bold text-[#0D2226]">{c.title}</h2>
            <p className="text-sm text-[#1C2B2E]/80">{c.text}</p>
          </div>
        ))}
        <Credit className="inline-block" />
        <div>
          <button onClick={onStart} className="inline-flex items-center gap-2 px-8 py-4 bg-[#0F5C63] text-[#FAF8F5] font-bold text-xs uppercase tracking-widest rounded-xs">
            Build my plan
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    );
  }

  return (
    <div ref={ref} className="relative bg-[#FAF8F5]" style={{ height: `${N * 110 + 40}vh` }}>
      <div className="sticky top-0 h-screen overflow-hidden bg-[#E9E3D6]">
        <FootageStage progressRef={progressRef} mobile={mobile} />

        {/* Legibility + finish: soft light wash on the text side, vignette, film grain */}
        <div className="absolute inset-0 pointer-events-none bg-gradient-to-r from-[#FAF8F5]/55 via-[#FAF8F5]/10 to-transparent" />
        <div className="absolute inset-0 pointer-events-none" style={{ background: 'radial-gradient(ellipse at center, rgba(0,0,0,0) 60%, rgba(13,34,38,0.28) 100%)' }} />
        <div className="absolute inset-0 pointer-events-none opacity-[0.07] mix-blend-overlay" style={{ backgroundImage: GRAIN }} />

        {CHAPTERS.map((c, i) => (
          <TextLayer key={c.title} progress={scrollYProgress} index={i} chapter={c} onStart={onStart} />
        ))}

        {/* Progress line */}
        <div className="absolute left-0 right-0 bottom-0 h-1 bg-[#0D2226]/10 pointer-events-none">
          <m.div className="h-full bg-[#0F5C63] origin-left" style={{ scaleX: barScale }} />
        </div>

        {/* Scroll cue */}
        <m.div style={{ opacity: cueOpacity }} className="absolute bottom-8 left-5 sm:left-8 flex items-center gap-3 text-[#0F5C63] text-xs font-bold uppercase tracking-[0.3em] pointer-events-none">
          <span className="inline-block w-px h-10 bg-[#0F5C63] animate-pulse" />
          Scroll
        </m.div>

        {/* Footage credit */}
        <Credit className="absolute bottom-3 right-3 sm:right-6 max-w-[62%] sm:max-w-md text-right" />

        <button onClick={onStart} className="absolute top-24 right-5 sm:right-8 text-[11px] font-bold uppercase tracking-widest text-[#0D2226]/70 hover:text-[#0F5C63] underline underline-offset-4">
          Skip the intro
        </button>
      </div>
    </div>
  );
};
