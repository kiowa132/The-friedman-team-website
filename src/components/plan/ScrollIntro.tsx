import React, { useEffect, useRef, useState } from 'react';
import { m, useMotionValueEvent, useReducedMotion, useScroll, useTransform } from 'motion/react';
import { ArrowRight } from 'lucide-react';

// Cinematic intro: one continuous home-tour shot (a drone descending to the
// front door, then a walk through the house) played as real video. Scrolling
// into a new chapter plays the camera forward to that chapter's stopping
// point, where it holds for the text; scrolling back jumps to the earlier stop
// with a soft dip. Real video (not scrubbed stills) keeps it smooth and sharp.
// Source, permission and credit terms: notes/footage-permissions.md in the brain.
const VIDEO = { desktop: '/video/tour-1080.mp4', mobile: '/video/tour-720.mp4' };
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

const GRAIN =
  "url(\"data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='160' height='160'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='.9' numOctaves='2' stitchTiles='stitch'/></filter><rect width='100%' height='100%' filter='url(%23n)'/></svg>\")";

// Plays the camera toward the target chapter's stop. Reports -1 while moving
// and the chapter index once it has arrived and is holding.
const TourVideo: React.FC<{ target: number; mobile: boolean; onArrive: (i: number) => void }> = ({ target, mobile, onArrive }) => {
  const vref = useRef<HTMLVideoElement>(null);
  const [dip, setDip] = useState(false);
  const panRef = useRef<HTMLDivElement>(null);
  const arriveRef = useRef(onArrive);
  arriveRef.current = onArrive;

  useEffect(() => {
    const v = vref.current;
    if (!v) return;
    const t = STOPS[target];
    let raf = 0;
    let timer = 0;
    let cancelled = false;

    const arrive = () => {
      if (cancelled) return;
      v.pause();
      v.currentTime = t;
      arriveRef.current(target);
    };

    if (Math.abs(v.currentTime - t) < 0.06) {
      arrive();
      return;
    }
    arriveRef.current(-1);

    if (t > v.currentTime) {
      // Fast fly-through that eases to a stop: speed follows the distance left.
      let rate = 5;
      let manual = false;
      let last = performance.now();
      const loop = (now: number) => {
        if (cancelled) return;
        rate = Math.min(5, Math.max(0.9, (t - v.currentTime) * 2));
        v.playbackRate = rate;
        if (manual) {
          v.currentTime = Math.min(t, v.currentTime + ((now - last) / 1000) * rate);
        }
        last = now;
        if (v.currentTime >= t - 0.02) {
          arrive();
          return;
        }
        raf = requestAnimationFrame(loop);
      };
      const p = v.play();
      if (p) p.catch(() => (manual = true)); // e.g. low-power mode blocks play(): step time by hand
      raf = requestAnimationFrame(loop);
    } else {
      // Going back: dip to cream, jump to the earlier stop, dip back in.
      setDip(true);
      timer = window.setTimeout(() => {
        if (cancelled) return;
        v.pause();
        const done = () => {
          v.removeEventListener('seeked', done);
          if (cancelled) return;
          setDip(false);
          timer = window.setTimeout(arrive, 250);
        };
        v.addEventListener('seeked', done);
        v.currentTime = t;
      }, 260);
    }

    return () => {
      cancelled = true;
      cancelAnimationFrame(raf);
      window.clearTimeout(timer);
      v.pause();
    };
  }, [target]);

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
      <video
        ref={vref}
        src={mobile ? VIDEO.mobile : VIDEO.desktop}
        poster={still(0)}
        muted
        playsInline
        preload="auto"
        disablePictureInPicture
        className="absolute inset-0 w-full h-full object-cover"
      />
      </div>
      <div className={'absolute inset-0 bg-[#FAF8F5] pointer-events-none transition-opacity duration-300 ' + (dip ? 'opacity-100' : 'opacity-0')} />
    </div>
  );
};

// One chapter of copy; visible only while the camera is holding on its stop.
const TextLayer: React.FC<{ index: number; chapter: Chapter; visible: boolean; mobile: boolean; onStart: () => void }> = ({ index, chapter, visible, mobile, onStart }) => {
  const last = index === N - 1;
  return (
    <div className="absolute inset-0 pointer-events-none">
      <div
        className={mobile ? 'absolute left-0 right-0 px-4' : 'relative h-full max-w-6xl mx-auto px-4 sm:px-8 flex items-center pt-16'}
        style={mobile ? { top: 'calc(4.5rem + 56.25vw + 0.9rem)' } : undefined}
      >
        <div
          className={
            'max-w-md sm:max-w-lg space-y-3 sm:space-y-4 bg-white/80 backdrop-blur-md border border-white/70 shadow-[0_20px_60px_-20px_rgba(13,34,38,0.35)] rounded-sm p-5 sm:p-8 transition-all duration-700 ease-out ' +
            (visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6')
          }
        >
          <span className="text-xs font-bold uppercase tracking-[0.3em] text-[#0F5C63]">{chapter.kicker}</span>
          <h1 className="font-serif text-2xl sm:text-5xl font-bold leading-[1.08] text-[#0D2226]">{chapter.title}</h1>
          <p className="text-sm sm:text-lg text-[#1C2B2E]/80 leading-relaxed">{chapter.text}</p>
          {last && (
            <button
              onClick={onStart}
              tabIndex={visible ? 0 : -1}
              className={
                'inline-flex items-center gap-2 px-8 py-4 bg-[#0F5C63] hover:bg-[#0D2226] text-[#FAF8F5] font-bold text-xs uppercase tracking-widest rounded-xs shadow-xl transition-all hover:-translate-y-0.5 ' +
                (visible ? 'pointer-events-auto' : 'pointer-events-none')
              }
            >
              Build my plan
              <ArrowRight className="w-4 h-4" />
            </button>
          )}
        </div>
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
  const [mobile] = useState(() => typeof window !== 'undefined' && window.innerWidth < 768);
  const [target, setTarget] = useState(0);
  const [shown, setShown] = useState(0);

  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end end'] });
  useMotionValueEvent(scrollYProgress, 'change', (v) => {
    setTarget(Math.min(N - 1, Math.max(0, Math.floor(v * N))));
  });
  const jumpTo = (i: number) => {
    const el = ref.current;
    if (!el) return;
    const total = el.offsetHeight - window.innerHeight;
    const top = el.getBoundingClientRect().top + window.scrollY;
    window.scrollTo({ top: top + (i / N) * total + 4, behavior: 'smooth' });
  };
  const barScale = useTransform(scrollYProgress, [0, 1], [0, 1]);

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
    <div ref={ref} className="relative bg-[#FAF8F5]" style={{ height: `${N * 70 + 30}vh` }}>
      <div className="sticky top-0 h-screen overflow-hidden bg-[#E9E3D6]">
        {/* Desktop: footage fills the screen. Phones: a 16:9 window so nothing is cropped or blown up. */}
        {mobile ? (
          <div className="absolute left-0 right-0 aspect-video overflow-hidden shadow-xl" style={{ top: '4.5rem' }}>
            <TourVideo target={target} mobile onArrive={setShown} />
          </div>
        ) : (
          <TourVideo target={target} mobile={false} onArrive={setShown} />
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
          <TextLayer key={c.title} index={i} chapter={c} visible={shown === i} mobile={mobile} onStart={onStart} />
        ))}

        {/* Progress line */}
        <div className="absolute left-0 right-0 bottom-0 h-1 bg-[#0D2226]/10 pointer-events-none">
          <m.div className="h-full bg-[#0F5C63] origin-left" style={{ scaleX: barScale }} />
        </div>

        {/* Scroll cue: shown only on the opening view */}
        <div
          className={
            'absolute bottom-8 left-5 sm:left-8 flex items-center gap-3 text-[#0F5C63] text-xs font-bold uppercase tracking-[0.3em] pointer-events-none transition-opacity duration-500 ' +
            (shown === 0 && target === 0 ? 'opacity-100' : 'opacity-0')
          }
        >
          <span className="inline-block w-px h-10 bg-[#0F5C63] animate-pulse" />
          Scroll
        </div>

        {/* Room jump: tap to fly to any stop */}
        <nav
          aria-label="Tour stops"
          className={mobile ? 'absolute right-4 bottom-16 flex gap-2.5 z-10' : 'absolute right-8 top-1/2 -translate-y-1/2 flex flex-col gap-3 items-end z-10'}
        >
          {STOP_LABELS.map((label, i) => (
            <button
              key={label}
              onClick={() => jumpTo(i)}
              aria-label={label}
              className="group flex items-center gap-3 pointer-events-auto"
            >
              {!mobile && (
                <span className={'text-[11px] font-bold uppercase tracking-widest transition-opacity drop-shadow ' + (target === i ? 'opacity-100 text-white' : 'opacity-0 group-hover:opacity-100 text-white')}>
                  {label}
                </span>
              )}
              <span className={'block rounded-full border-2 border-white shadow transition-all ' + (target === i ? 'w-3.5 h-3.5 bg-[#C9A84C]' : 'w-3 h-3 bg-white/40 hover:bg-white')} />
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
