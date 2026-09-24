import React, { useRef } from 'react';
import type { MotionValue } from 'motion/react';
import { m, useReducedMotion, useScroll, useTransform } from 'motion/react';
import { ArrowRight } from 'lucide-react';

interface Chapter {
  image: string;
  kicker: string;
  title: string;
  text: string;
}

const CHAPTERS: Chapter[] = [
  {
    image: '/images/marketing-plan/hero-day.jpg',
    kicker: 'The Friedman Team',
    title: "Let's sell your home the right way.",
    text: 'Scroll to see how we do it. Then build your own plan in a few easy steps.',
  },
  {
    image: '/images/marketing-plan/step-1.jpg',
    kicker: 'Step one',
    title: 'First, we get it ready.',
    text: 'Your Home Prep Advisor walks the home, tells you what is worth doing, and lines up the vendors.',
  },
  {
    image: '/images/marketing-plan/step-2.jpg',
    kicker: 'Step two',
    title: 'Then we show it off.',
    text: 'Beautiful photos, 3D tours, drone views and video that make buyers stop scrolling.',
  },
  {
    image: '/images/marketing-plan/desk-day.jpg',
    kicker: 'Step three',
    title: 'Then we get it seen.',
    text: 'Every major site, our buyer network and paid reach put your home in front of the right people.',
  },
  {
    image: '/images/marketing-plan/door-day.jpg',
    kicker: 'Step four',
    title: 'Then we bring buyers through the door.',
    text: 'Open houses, showings, feedback within 48 hours, and a negotiation plan set before the first offer.',
  },
];

const N = CHAPTERS.length;

// One full-screen chapter. Everything here is driven directly by scroll
// position (scrubbed), not by time: scroll down and the scene zooms in,
// the next one melts in, and the words rise. Scroll back up and it rewinds.
const Layer: React.FC<{ progress: MotionValue<number>; index: number; chapter: Chapter; onStart: () => void }> = ({
  progress,
  index,
  chapter,
  onStart,
}) => {
  const s = index / N;
  const e = (index + 1) / N;
  const first = index === 0;
  const last = index === N - 1;

  const opacity = useTransform(
    progress,
    first ? [0, e - 0.05, e + 0.05] : last ? [s - 0.05, s + 0.05, 1] : [s - 0.05, s + 0.05, e - 0.05, e + 0.05],
    first ? [1, 1, 0] : last ? [0, 1, 1] : [0, 1, 1, 0]
  );
  const scale = useTransform(progress, [Math.max(0, s - 0.05), Math.min(1, e + 0.05)], [1.02, 1.28]);
  const imgY = useTransform(progress, [Math.max(0, s - 0.05), Math.min(1, e + 0.05)], ['0%', '-6%']);

  const textOpacity = useTransform(
    progress,
    first ? [0, e - 0.07, e - 0.02] : last ? [s + 0.02, s + 0.07, 1] : [s + 0.02, s + 0.07, e - 0.07, e - 0.02],
    first ? [1, 1, 0] : last ? [0, 1, 1] : [0, 1, 1, 0]
  );
  const textY = useTransform(progress, first ? [0, 0.001] : [s + 0.02, s + 0.08], first ? [0, 0] : [48, 0]);

  return (
    <m.div className="absolute inset-0" style={{ opacity }}>
      <m.div className="absolute inset-0" style={{ scale, y: imgY }}>
        <img src={chapter.image} alt="" className="w-full h-full object-cover" />
      </m.div>
      <div className="absolute inset-0 bg-gradient-to-r from-[#FAF8F5]/95 via-[#FAF8F5]/60 to-transparent" />
      <div className="absolute inset-0 bg-gradient-to-t from-[#FAF8F5]/70 via-transparent to-transparent" />

      <div className="relative h-full max-w-6xl mx-auto px-5 sm:px-8 flex items-center pt-16">
        <m.div style={{ opacity: textOpacity, y: textY }} className="max-w-xl space-y-5">
          <span className="text-xs font-bold uppercase tracking-[0.3em] text-[#0F5C63]">{chapter.kicker}</span>
          <h1 className="font-serif text-4xl sm:text-6xl font-bold leading-[1.05] text-[#0D2226]">{chapter.title}</h1>
          <p className="text-base sm:text-lg text-[#1C2B2E]/80 leading-relaxed">{chapter.text}</p>
          {last && (
            <button
              onClick={onStart}
              className="inline-flex items-center gap-2 px-8 py-4 bg-[#0F5C63] hover:bg-[#0D2226] text-[#FAF8F5] font-bold text-xs uppercase tracking-widest rounded-xs shadow-xl transition-all hover:-translate-y-0.5"
            >
              Build my plan
              <ArrowRight className="w-4 h-4" />
            </button>
          )}
        </m.div>
      </div>
    </m.div>
  );
};

export const ScrollIntro: React.FC<{ onStart: () => void }> = ({ onStart }) => {
  const reduce = !!useReducedMotion();
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end end'] });
  const barScale = useTransform(scrollYProgress, [0, 1], [0, 1]);
  const cueOpacity = useTransform(scrollYProgress, [0, 0.06], [1, 0]);

  // Reduced motion: a plain stack of chapters, no scrubbing.
  if (reduce) {
    return (
      <div className="bg-[#FAF8F5] pt-24 pb-16 space-y-12 max-w-3xl mx-auto px-5">
        {CHAPTERS.map((c) => (
          <div key={c.title} className="space-y-3">
            <img src={c.image} alt="" className="w-full aspect-video object-cover rounded-xs" />
            <p className="text-xs font-bold uppercase tracking-[0.3em] text-[#0F5C63]">{c.kicker}</p>
            <h2 className="font-serif text-3xl font-bold text-[#0D2226]">{c.title}</h2>
            <p className="text-sm text-[#1C2B2E]/80">{c.text}</p>
          </div>
        ))}
        <button
          onClick={onStart}
          className="inline-flex items-center gap-2 px-8 py-4 bg-[#0F5C63] text-[#FAF8F5] font-bold text-xs uppercase tracking-widest rounded-xs"
        >
          Build my plan
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    );
  }

  return (
    <div ref={ref} className="relative bg-[#FAF8F5]" style={{ height: `${N * 110 + 40}vh` }}>
      <div className="sticky top-0 h-screen overflow-hidden">
        {CHAPTERS.map((c, i) => (
          <Layer key={c.title} progress={scrollYProgress} index={i} chapter={c} onStart={onStart} />
        ))}

        {/* Progress line */}
        <div className="absolute left-0 right-0 bottom-0 h-1 bg-[#0D2226]/10">
          <m.div className="h-full bg-[#0F5C63] origin-left" style={{ scaleX: barScale }} />
        </div>

        {/* Scroll cue */}
        <m.div style={{ opacity: cueOpacity }} className="absolute bottom-8 left-5 sm:left-8 flex items-center gap-3 text-[#0F5C63] text-xs font-bold uppercase tracking-[0.3em]">
          <span className="inline-block w-px h-10 bg-[#0F5C63] animate-pulse" />
          Scroll
        </m.div>

        <button
          onClick={onStart}
          className="absolute top-24 right-5 sm:right-8 text-[11px] font-bold uppercase tracking-widest text-[#0D2226]/70 hover:text-[#0F5C63] underline underline-offset-4"
        >
          Skip the intro
        </button>
      </div>
    </div>
  );
};
