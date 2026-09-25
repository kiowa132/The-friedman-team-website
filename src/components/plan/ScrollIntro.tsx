import React, { useEffect, useRef, useState } from 'react';
import type { MotionValue } from 'motion/react';
import { m, useMotionValueEvent, useReducedMotion, useScroll, useTransform } from 'motion/react';
import { ArrowRight } from 'lucide-react';

// Cinematic intro: one continuous home-tour shot (a drone descending to the
// front door, then a walk through the house). Your scroll position IS the
// playhead, so you control it: scroll down to travel forward, up to go back,
// fast or slow. Each chapter holds the camera on a beautiful stop while the
// text is up, then the next stretch of scroll flies the camera to the next
// stop. The clip is encoded with a keyframe every few frames so scrubbing stays
// smooth in both directions (see the technique notes in scroll-craft, MIT).
// Source, permission and credit terms: notes/footage-permissions.md in the brain.
const VIDEO = { desktop: '/video/scrub-1080.mp4', mobile: '/video/scrub-720.mp4' };
const still = (i: number) => `/images/marketing-plan/still-${i}.jpg`;

// Seconds into the (trimmed) video where the camera rests for each chapter:
// aerial, arched front door, dining room, great room, kitchen.
const STOPS = [0, 8.4, 14, 25, 35];
const STOP_LABELS = ['The aerial', 'Front door', 'Dining room', 'Great room', 'Kitchen'];

const CREDIT_TEXT = 'Home tour footage courtesy of Brent Sledd, The Rob Ellerman Team, Reece Nichols Real Estate';

interface Chapter {
  kicker: string;
  title: string;
  text: string;
}

const CHAPTERS: Chapter[] = [
  { kicker: 'The Friedman Team', title: "Let's sell your home the right way.", text: 'Scroll to follow the tour from the air, through the front door and room by room. Then build your own plan in a few easy steps.' },
  { kicker: 'Step one', title: 'First, we get it ready.', text: 'Your Home Prep Advisor walks the home, tells you what is worth doing, and lines up the vendors.' },
  { kicker: 'Step two', title: 'Then we show it off.', text: 'Beautiful photos, 3D tours, drone views and video that make buyers stop scrolling.' },
  { kicker: 'Step three', title: 'Then we get it seen.', text: 'Every major site, our buyer network and paid reach put your home in front of the right people.' },
  { kicker: 'Step four', title: 'Then we bring buyers through every room.', text: 'Open houses, showings, feedback within 48 hours, and a negotiation plan set before the first offer.' },
];

const N = CHAPTERS.length;
const CELL_VH = 110; // scroll per chapter
const HOLD = 0.4; // first 40% of each chapter: camera rests, text is up. The rest: fly to the next stop.

const clamp01 = (x: number) => Math.min(1, Math.max(0, x));
const lin = (v: number, a: number, b: number) => clamp01((v - a) / (b - a));

// Scroll progress (0..1 over the whole intro) to a video time in seconds.
const timeAt = (p: number) => {
  const q = clamp01(p) * N;
  const i = Math.min(N - 1, Math.floor(q));
  if (i === N - 1) return STOPS[N - 1];
  const f = q - i;
  if (f < HOLD) return STOPS[i];
  const s = (f - HOLD) / (1 - HOLD);
  const eased = 0.5 * s + 0.5 * (s * s * (3 - 2 * s)); // gentle ease in and out
  return STOPS[i] + (STOPS[i + 1] - STOPS[i]) * eased;
};

const GRAIN =
  "url(\"data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='160' height='160'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='.9' numOctaves='2' stitchTiles='stitch'/></filter><rect width='100%' height='100%' filter='url(%23n)'/></svg>\")";

// The scrubbed video. The whole clip is fetched into memory first so seeking is
// instant (no network range requests), then the playhead eases toward the
// scroll-driven target each frame; a new seek is never queued while one is
// still resolving, so a fast flick can't jam the decoder.
const TourVideo: React.FC<{ progressRef: React.MutableRefObject<number>; mobile: boolean }> = ({ progressRef, mobile }) => {
  const vref = useRef<HTMLVideoElement>(null);
  const panRef = useRef<HTMLDivElement>(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const v = vref.current;
    if (!v) return;
    let cancelled = false;
    let raf = 0;
    let url = '';
    let cur = STOPS[0];
    let seekStart = 0;

    fetch(mobile ? VIDEO.mobile : VIDEO.desktop)
      .then((r) => {
        if (!r.ok) throw new Error(String(r.status));
        return r.blob();
      })
      .then((blob) => {
        if (cancelled) return;
        url = URL.createObjectURL(blob);
        v.src = url;
        v.load();
        const start = () => {
          if (cancelled) return;
          try {
            v.currentTime = 0.001;
          } catch {
            /* ignore */
          }
          setReady(true);
          raf = requestAnimationFrame(tick);
        };
        v.addEventListener('loadeddata', start, { once: true });
      })
      .catch(() => {
        /* poster stays; the copy still works */
      });

    const tick = () => {
      raf = requestAnimationFrame(tick);
      const dur = v.duration;
      if (!dur || !isFinite(dur)) return;
      const target = Math.min(dur - 0.05, timeAt(progressRef.current));
      cur += (target - cur) * 0.2;
      if (Math.abs(target - cur) < 0.004) cur = target;
      if (v.seeking) {
        // A seek stuck for over 700ms would freeze the clip through this guard, so nudge it.
        if (performance.now() - seekStart > 700) {
          try {
            v.currentTime = v.currentTime + 0.001;
          } catch {
            /* ignore */
          }
          seekStart = performance.now();
        }
        return;
      }
      if (Math.abs(v.currentTime - cur) > 1 / 60) {
        seekStart = performance.now();
        try {
          v.currentTime = cur;
        } catch {
          /* ignore */
        }
      }
    };

    return () => {
      cancelled = true;
      cancelAnimationFrame(raf);
      if (url) URL.revokeObjectURL(url);
    };
  }, [mobile, progressRef]);

  // Cursor parallax: the picture drifts a little as the mouse moves, so the scene feels alive.
  useEffect(() => {
    if (mobile) return;
    const el = panRef.current;
    if (!el) return;
    const move = (e: MouseEvent) => {
      const x = e.clientX / window.innerWidth - 0.5;
      const y = e.clientY / window.innerHeight - 0.5;
      el.style.transform = `translate3d(${(-x * 34).toFixed(1)}px, ${(-y * 20).toFixed(1)}px, 0) scale(1.06)`;
    };
    window.addEventListener('mousemove', move);
    return () => window.removeEventListener('mousemove', move);
  }, [mobile]);

  return (
    <div className="absolute inset-0 bg-[#E9E3D6] overflow-hidden">
      <div ref={panRef} className="absolute inset-0 transition-transform duration-500 ease-out" style={mobile ? undefined : { transform: 'scale(1.06)' }}>
        {/* The poster shows until the clip has loaded, so there is never a blank frame. */}
        <img src={still(0)} alt="" className="absolute inset-0 w-full h-full object-cover" />
        <video
          ref={vref}
          muted
          playsInline
          preload="auto"
          disablePictureInPicture
          className={'absolute inset-0 w-full h-full object-cover transition-opacity duration-500 ' + (ready ? 'opacity-100' : 'opacity-0')}
        />
      </div>
    </div>
  );
};

// One chapter of copy: up while the camera rests on its stop, gone while it flies.
const TextLayer: React.FC<{ progress: MotionValue<number>; index: number; chapter: Chapter; mobile: boolean; onStart: () => void }> = ({ progress, index, chapter, mobile, onStart }) => {
  const first = index === 0;
  const last = index === N - 1;
  const textOpacity = useTransform(progress, (p) => {
    const f = p * N - index; // 0..1 across this chapter
    const fadeIn = first ? 1 : lin(f, 0.04, 0.16);
    const fadeOut = last ? 1 : 1 - lin(f, HOLD - 0.1, HOLD + 0.04);
    return fadeIn * fadeOut;
  });
  const textY = useTransform(progress, (p) => {
    const f = p * N - index;
    return first ? 0 : 40 * (1 - lin(f, 0.04, 0.16));
  });
  const interactive = useTransform(textOpacity, (o) => (o > 0.6 ? 'auto' : 'none'));

  return (
    <div className="absolute inset-0 pointer-events-none">
      <div
        className={mobile ? 'absolute left-0 right-0 px-4' : 'relative h-full max-w-6xl mx-auto px-4 sm:px-8 flex items-center pt-16'}
        style={mobile ? { top: 'calc(4.5rem + 56.25vw + 0.9rem)' } : undefined}
      >
        <m.div
          style={{ opacity: textOpacity, y: textY }}
          className="max-w-md sm:max-w-lg space-y-3 sm:space-y-4 bg-white/80 backdrop-blur-md border border-white/70 shadow-[0_20px_60px_-20px_rgba(13,34,38,0.35)] rounded-sm p-5 sm:p-8"
        >
          <span className="text-xs font-bold uppercase tracking-[0.3em] text-[#0F5C63]">{chapter.kicker}</span>
          <h1 className="font-serif text-2xl sm:text-5xl font-bold leading-[1.08] text-[#0D2226]">{chapter.title}</h1>
          <p className="text-sm sm:text-lg text-[#1C2B2E]/80 leading-relaxed">{chapter.text}</p>
          {last && (
            <m.button
              style={{ pointerEvents: interactive }}
              onClick={onStart}
              className="inline-flex items-center gap-2 px-8 py-4 bg-[#0F5C63] hover:bg-[#0D2226] text-[#FAF8F5] font-bold text-xs uppercase tracking-widest rounded-xs shadow-xl transition-colors"
            >
              Build my plan
              <ArrowRight className="w-4 h-4" />
            </m.button>
          )}
        </m.div>
      </div>
    </div>
  );
};

const Credit: React.FC<{ className?: string; style?: React.CSSProperties }> = ({ className = '', style }) => (
  <span style={style} className={'text-[10px] leading-snug text-[#0D2226]/80 bg-white/75 backdrop-blur px-3 py-1.5 rounded-full ' + className}>
    {CREDIT_TEXT}
  </span>
);

export const ScrollIntro: React.FC<{ onStart: () => void }> = ({ onStart }) => {
  const reduce = !!useReducedMotion();
  const ref = useRef<HTMLDivElement>(null);
  const progressRef = useRef(0);
  const [mobile] = useState(() => typeof window !== 'undefined' && window.innerWidth < 768);
  const [active, setActive] = useState(0);

  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end end'] });
  useMotionValueEvent(scrollYProgress, 'change', (p) => {
    progressRef.current = p;
    setActive(Math.min(N - 1, Math.max(0, Math.floor(p * N + 0.2))));
  });
  const barScale = useTransform(scrollYProgress, [0, 1], [0, 1]);
  const cueOpacity = useTransform(scrollYProgress, (p) => 1 - lin(p, 0.01, 0.05));

  const jumpTo = (i: number) => {
    const el = ref.current;
    if (!el) return;
    const total = el.offsetHeight - window.innerHeight;
    const top = el.getBoundingClientRect().top + window.scrollY;
    window.scrollTo({ top: top + (i / N) * total + 4, behavior: 'smooth' });
  };

  // Reduced motion: a plain stack of chapters with a still from each.
  if (reduce) {
    return (
      <div className="bg-[#FAF8F5] pt-24 pb-16 space-y-12 max-w-3xl mx-auto px-5">
        {CHAPTERS.map((c, i) => (
          <div key={c.title} className="space-y-3">
            <img src={still(i)} alt="" className="w-full aspect-video object-cover rounded-xs" />
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
    <div ref={ref} className="relative bg-[#FAF8F5]" style={{ height: `${N * CELL_VH + 100}vh` }}>
      <div className="sticky top-0 h-screen overflow-hidden bg-[#E9E3D6]">
        {/* Desktop: footage fills the screen. Phones: a 16:9 window so nothing is cropped or blown up. */}
        {mobile ? (
          <div className="absolute left-0 right-0 aspect-video overflow-hidden shadow-xl" style={{ top: '4.5rem' }}>
            <TourVideo progressRef={progressRef} mobile />
          </div>
        ) : (
          <TourVideo progressRef={progressRef} mobile={false} />
        )}

        {/* Legibility + finish (desktop): soft light wash on the text side, vignette, film grain */}
        {!mobile && (
          <>
            <div className="absolute inset-0 pointer-events-none bg-gradient-to-r from-[#FAF8F5]/55 via-[#FAF8F5]/10 to-transparent" />
            <div className="absolute inset-0 pointer-events-none" style={{ background: 'radial-gradient(ellipse at center, rgba(0,0,0,0) 60%, rgba(13,34,38,0.22) 100%)' }} />
            <div className="absolute inset-0 pointer-events-none opacity-[0.05] mix-blend-overlay" style={{ backgroundImage: GRAIN }} />
          </>
        )}

        {CHAPTERS.map((c, i) => (
          <TextLayer key={c.title} progress={scrollYProgress} index={i} chapter={c} mobile={mobile} onStart={onStart} />
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

        {/* Room jump: tap to fly to any stop */}
        <nav aria-label="Tour stops" className={mobile ? 'absolute right-4 bottom-16 flex gap-2.5 z-10' : 'absolute right-8 top-1/2 -translate-y-1/2 flex flex-col gap-3 items-end z-10'}>
          {STOP_LABELS.map((label, i) => (
            <button key={label} onClick={() => jumpTo(i)} aria-label={label} className="group flex items-center gap-3 pointer-events-auto">
              {!mobile && (
                <span className={'text-[11px] font-bold uppercase tracking-widest transition-opacity drop-shadow text-white ' + (active === i ? 'opacity-100' : 'opacity-0 group-hover:opacity-100')}>
                  {label}
                </span>
              )}
              <span className={'block rounded-full border-2 border-white shadow transition-all ' + (active === i ? 'w-3.5 h-3.5 bg-[#C9A84C]' : 'w-3 h-3 bg-white/40 hover:bg-white')} />
            </button>
          ))}
        </nav>

        {/* Footage credit */}
        {mobile ? (
          <Credit className="absolute left-2 right-2 text-center pointer-events-none" style={{ top: 'calc(4.5rem + 56.25vw - 2.6rem)' }} />
        ) : (
          <Credit className="absolute bottom-3 right-6 max-w-md text-right pointer-events-none" />
        )}

        <button
          onClick={onStart}
          className={
            'absolute right-4 sm:right-8 text-[11px] font-bold uppercase tracking-widest underline underline-offset-4 ' +
            (mobile ? 'top-[4.9rem] text-white drop-shadow' : 'top-24 text-[#0D2226]/70 hover:text-[#0F5C63]')
          }
        >
          Skip the intro
        </button>
      </div>
    </div>
  );
};
