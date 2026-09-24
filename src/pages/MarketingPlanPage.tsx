import React, { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { AnimatePresence, m, useInView, useMotionValueEvent, useReducedMotion, useScroll, useTransform } from 'motion/react';
import { CheckCircle2, Phone, Calculator, ShieldCheck, Sparkles, ArrowRight, Plus } from 'lucide-react';
import { usePageMeta } from '../lib/usePageMeta';
import { EASE_PREMIUM } from '../lib/motion';
import { Reveal, RevealItem } from '../components/Reveal';
import {
  ADVISOR_BULLETS,
  CANCEL_LINE,
  CATEGORIES,
  DEFAULT_EXTRAS,
  DEFAULT_PREP_PICK,
  FOUNDATION,
  ITEMS,
  PERFORMANCE_NOTE,
  SAME_KYLE,
  STEPS,
  TEAM,
  TIERS,
  ZS_NOTE,
  pickCost,
  statusFor,
} from '../data/marketingPlan';
import type { Item, Status, Step, TierId } from '../data/marketingPlan';

interface MarketingPlanPageProps {
  onOpenValuation: () => void;
  onOpenConsultation: () => void;
}

function groupByCategory(list: Item[]) {
  return CATEGORIES.map((c) => ({ category: c, items: list.filter((i) => i.category === c) })).filter((g) => g.items.length > 0);
}

// Counts up from 0 to `target` once `start` is true. Skips the animation
// entirely for anyone who prefers reduced motion.
function useCountUp(target: number, start: boolean, skip: boolean): number {
  const [value, setValue] = useState(skip ? target : 0);
  useEffect(() => {
    if (skip) {
      setValue(target);
      return;
    }
    if (!start) return;
    let raf = 0;
    const t0 = performance.now();
    const duration = 1400;
    const tick = (now: number) => {
      const p = Math.min(1, (now - t0) / duration);
      const eased = 1 - Math.pow(1 - p, 3);
      setValue(Math.round(target * eased));
      if (p < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [target, start, skip]);
  return value;
}

// Headline that rises in word by word.
const Words: React.FC<{ text: string; className?: string; delay?: number }> = ({ text, className, delay = 0 }) => (
  <span className={className} aria-label={text}>
    {text.split(' ').map((w, i) => (
      <span key={i} aria-hidden="true" className="inline-block overflow-hidden align-bottom pb-1 mr-[0.25em]">
        <m.span
          className="inline-block"
          initial={{ y: '110%' }}
          animate={{ y: 0 }}
          transition={{ duration: 0.8, delay: delay + i * 0.07, ease: EASE_PREMIUM }}
        >
          {w}
        </m.span>
      </span>
    ))}
  </span>
);

const Chip: React.FC<{ status: Status }> = ({ status }) => {
  if (status === 'zs' || status === 'zsplus') {
    return (
      <span className="shrink-0 text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 bg-[#0F5C63] text-[#FAF8F5] rounded-xs">
        {status === 'zsplus' ? 'ZS+' : 'ZS'}
      </span>
    );
  }
  if (status === 'rec') {
    return (
      <span className="shrink-0 text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 bg-[#C9A96A]/25 text-[#0D2226] rounded-xs">
        When recommended
      </span>
    );
  }
  return null;
};

// One animated stat tile: counts up when it scrolls into view.
const StatTile: React.FC<{ value: number | string; suffix?: string; label: string; reduce: boolean }> = ({ value, suffix, label, reduce }) => {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: '-60px' });
  const numeric = typeof value === 'number';
  const n = useCountUp(numeric ? (value as number) : 0, inView, reduce);
  return (
    <div ref={ref} className="border border-[#C9A96A]/30 bg-[#0D2226]/60 p-6 text-center rounded-xs">
      <div className="font-serif text-4xl sm:text-5xl font-bold text-[#C9A96A] leading-none">
        {numeric ? n : value}
        {suffix && <span className="text-2xl ml-1 text-[#FAF8F5]/80">{suffix}</span>}
      </div>
      <p className="text-xs uppercase tracking-widest text-[#A8B2A1] mt-3">{label}</p>
    </div>
  );
};

// The items a step covers, shown for the seller's chosen price range.
const StepItems: React.FC<{ step: Step; tierId: TierId }> = ({ step, tierId }) => {
  const rows = ITEMS.filter((i) => step.categories.includes(i.category))
    .map((i) => ({ item: i, status: statusFor(i, tierId) }))
    .filter((r) => r.status !== 'na')
    .slice(0, 7);
  if (rows.length === 0) return null;
  return (
    <ul className="space-y-2">
      {rows.map(({ item, status }) => {
        const isExtra = status === 'extra' || status === 'extra2';
        const isAsk = status === 'ask';
        return (
          <li key={item.name} className="flex items-start gap-2 text-sm text-[#FAF8F5]/90">
            {isAsk ? (
              <Sparkles className="w-4 h-4 text-[#C9A96A] shrink-0 mt-0.5" />
            ) : isExtra ? (
              <Plus className="w-4 h-4 text-[#C9A96A] shrink-0 mt-0.5" />
            ) : (
              <CheckCircle2 className="w-4 h-4 text-[#5FC2C9] shrink-0 mt-0.5" />
            )}
            <span>
              {item.name}
              {isExtra && <span className="ml-2 text-[10px] font-bold uppercase tracking-wider text-[#C9A96A]">Extra</span>}
              {isAsk && <span className="ml-2 text-[10px] font-bold uppercase tracking-wider text-[#C9A96A]">Ask Kyle</span>}
              {(status === 'zs' || status === 'zsplus') && (
                <span className="ml-2 text-[10px] font-bold uppercase tracking-wider text-[#5FC2C9]">{status === 'zsplus' ? 'ZS+' : 'ZS'}</span>
              )}
            </span>
          </li>
        );
      })}
    </ul>
  );
};

export const MarketingPlanPage: React.FC<MarketingPlanPageProps> = ({ onOpenValuation, onOpenConsultation }) => {
  usePageMeta(
    'Your Marketing Plan | The Friedman Team',
    'See exactly what is included when you list with The Friedman Team, personalized to your home price, plus the extras you can choose.'
  );

  const reduceRaw = useReducedMotion();
  const reduce = !!reduceRaw;

  const [tierId, setTierId] = useState<TierId>('t2');
  const [prepPick, setPrepPick] = useState<string>(DEFAULT_PREP_PICK);
  const [picks, setPicks] = useState<string[]>(DEFAULT_EXTRAS['t2']);

  const tier = TIERS.find((t) => t.id === tierId) || TIERS[1];
  const isCustom = tierId === 't5';

  const chooseTier = (id: TierId) => {
    setTierId(id);
    setPrepPick(DEFAULT_PREP_PICK);
    setPicks(DEFAULT_EXTRAS[id]);
  };

  // Page scroll progress bar.
  const { scrollYProgress: pageProgress } = useScroll();

  // Hero parallax.
  const heroRef = useRef<HTMLElement>(null);
  const { scrollYProgress: heroP } = useScroll({ target: heroRef, offset: ['start start', 'end start'] });
  const heroY = useTransform(heroP, [0, 1], reduce ? ['0%', '0%'] : ['0%', '22%']);
  const heroScale = useTransform(heroP, [0, 1], reduce ? [1, 1] : [1.06, 1.24]);
  const heroFade = useTransform(heroP, [0, 0.75], [1, 0]);

  // Sticky scroll story.
  const storyRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress: storyP } = useScroll({ target: storyRef, offset: ['start start', 'end end'] });
  const [active, setActive] = useState(0);
  useMotionValueEvent(storyP, 'change', (v) => {
    const i = Math.min(STEPS.length - 1, Math.max(0, Math.floor(v * STEPS.length)));
    setActive((prev) => (prev === i ? prev : i));
  });

  const includedItems = ITEMS.filter((i) => {
    const s = statusFor(i, tierId);
    return s === 'included' || s === 'rec' || s === 'zs' || s === 'zsplus';
  });
  const prepItems = ITEMS.filter((i) => statusFor(i, tierId) === 'swap');
  const extraItems = ITEMS.filter((i) => {
    const s = statusFor(i, tierId);
    return s === 'extra' || s === 'extra2';
  });
  const askItems = ITEMS.filter((i) => statusFor(i, tierId) === 'ask');
  const hasZs = includedItems.some((i) => {
    const s = statusFor(i, tierId);
    return s === 'zs' || s === 'zsplus';
  });

  const used = picks.reduce((sum, name) => {
    const it = ITEMS.find((i) => i.name === name);
    return sum + (it ? pickCost(statusFor(it, tierId)) : 0);
  }, 0);

  const togglePick = (it: Item) => {
    const cost = pickCost(statusFor(it, tierId));
    if (picks.includes(it.name)) {
      setPicks(picks.filter((p) => p !== it.name));
    } else if (used + cost <= tier.extras) {
      setPicks([...picks, it.name]);
    }
  };

  const hasPrep = prepItems.length > 0 && !isCustom;
  const hasExtras = extraItems.length > 0 && tier.extras > 0 && !isCustom;

  return (
    <div className="bg-[#FAF8F5]">
      {/* Scroll progress */}
      <m.div
        aria-hidden="true"
        className="fixed top-0 left-0 right-0 h-[3px] bg-[#C9A96A] origin-left z-[60]"
        style={{ scaleX: pageProgress }}
      />

      {/* Hero */}
      <section ref={heroRef} className="relative min-h-[640px] h-[100svh] overflow-hidden bg-[#0D2226] text-[#FAF8F5] flex items-center">
        <m.div className="absolute inset-0" style={{ y: heroY, scale: heroScale }}>
          <img src="/images/marketing-plan/hero.jpg" alt="" className="w-full h-full object-cover" />
        </m.div>
        <div className="absolute inset-0 bg-gradient-to-t from-[#0D2226] via-[#0D2226]/55 to-[#0D2226]/40" />
        <div className="absolute inset-0 bg-gradient-to-r from-[#0D2226]/80 via-transparent to-transparent" />
        <div className="pointer-events-none absolute -top-24 -left-24 w-[28rem] h-[28rem] rounded-full bg-[#0F5C63]/40 blur-3xl animate-pulse" />
        <div className="pointer-events-none absolute -bottom-32 right-0 w-[26rem] h-[26rem] rounded-full bg-[#C9A96A]/20 blur-3xl animate-pulse" />

        <m.div style={{ opacity: heroFade }} className="relative max-w-6xl mx-auto px-4 sm:px-6 w-full pt-24">
          <m.span
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: EASE_PREMIUM }}
            className="text-xs font-bold uppercase tracking-[0.3em] text-[#C9A96A]"
          >
            The Friedman Team &middot; For Sellers
          </m.span>
          <h1 className="font-serif text-5xl sm:text-7xl lg:text-8xl font-bold leading-[1.02] mt-5 max-w-4xl">
            <Words text="Your marketing plan," delay={0.15} />
            <br />
            <Words text="built around your home." delay={0.5} className="text-[#C9A96A]" />
          </h1>
          <m.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 1.1, ease: EASE_PREMIUM }}
            className="text-base sm:text-lg text-[#F5F1E8]/85 max-w-xl mt-7 leading-relaxed"
          >
            Choose your price range and watch exactly what is included, what you can pick, and what we add when we talk. No hidden fees and no locked-in choices.
          </m.p>
          <m.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 1.6 }}
            className="mt-12 flex items-center gap-3 text-[#C9A96A] text-xs font-bold uppercase tracking-[0.3em]"
          >
            <span className="inline-block w-px h-10 bg-[#C9A96A] animate-pulse" />
            Scroll
          </m.div>
        </m.div>
      </section>

      {/* Everything below keeps the sticky range bar in view */}
      <div>
        <div className="sticky top-20 z-30 bg-[#0D2226]/90 backdrop-blur-md border-y border-[#C9A96A]/30">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 py-3 flex items-center gap-3 overflow-x-auto">
            <span className="text-[10px] font-bold uppercase tracking-widest text-[#C9A96A] shrink-0 hidden sm:inline">Your price range</span>
            {TIERS.map((t) => {
              const activeTier = t.id === tierId;
              return (
                <button
                  key={t.id}
                  type="button"
                  aria-pressed={activeTier}
                  onClick={() => chooseTier(t.id)}
                  className={
                    'shrink-0 px-4 py-2 text-xs font-bold tracking-wide rounded-full border transition-all duration-300 ' +
                    (activeTier
                      ? 'bg-[#C9A96A] text-[#0D2226] border-[#C9A96A] shadow-[0_0_24px_rgba(201,169,106,0.55)]'
                      : 'bg-transparent text-[#FAF8F5]/80 border-[#FAF8F5]/25 hover:border-[#C9A96A] hover:text-[#FAF8F5]')
                  }
                >
                  {t.range}
                </button>
              );
            })}
          </div>
        </div>

        {/* Scroll story */}
        <section className="bg-[#0D2226] text-[#FAF8F5]">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 pt-20 pb-10 text-center space-y-3">
            <span className="text-xs font-bold uppercase tracking-[0.3em] text-[#C9A96A]">{tier.name} plan</span>
            <h2 className="font-serif text-3xl sm:text-5xl font-bold">What happens when you list with us</h2>
            <p className="text-sm sm:text-base text-[#A8B2A1] max-w-2xl mx-auto">
              Five stages, start to finish. Below each one, see what your {tier.range} plan includes. {SAME_KYLE}
            </p>
          </div>

          {/* Desktop: sticky scene that changes as you scroll */}
          {!reduce && (
            <div ref={storyRef} className="relative hidden lg:block" style={{ height: `${STEPS.length * 90}vh` }}>
              <div className="sticky top-0 h-screen pt-40 pb-10">
                <div className="max-w-6xl mx-auto px-6 h-full grid grid-cols-12 gap-10 items-center">
                  <div className="col-span-6 relative h-[62vh] rounded-xs overflow-hidden border border-[#C9A96A]/30 shadow-2xl">
                    {STEPS.map((st, i) => (
                      <m.div
                        key={st.title}
                        className="absolute inset-0"
                        initial={false}
                        animate={{ opacity: active === i ? 1 : 0, scale: active === i ? 1 : 1.1 }}
                        transition={{ duration: 0.9, ease: EASE_PREMIUM }}
                      >
                        <img src={st.image} alt="" loading="lazy" className="w-full h-full object-cover" />
                        <div className="absolute inset-0 bg-gradient-to-t from-[#0D2226]/70 via-transparent to-transparent" />
                      </m.div>
                    ))}
                    <span className="absolute bottom-4 left-5 font-serif text-7xl font-bold text-[#FAF8F5]/90 leading-none">
                      0{active + 1}
                    </span>
                  </div>

                  <div className="col-span-5 min-h-[62vh] flex items-center">
                    <AnimatePresence mode="wait">
                      <m.div
                        key={active}
                        initial={{ opacity: 0, y: 28 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        transition={{ duration: 0.45, ease: EASE_PREMIUM }}
                        className="space-y-5"
                      >
                        <h3 className="font-serif text-3xl xl:text-4xl font-bold">{STEPS[active].title}</h3>
                        <p className="text-sm text-[#F5F1E8]/80 leading-relaxed">{STEPS[active].text}</p>
                        <div className="border-t border-[#C9A96A]/30 pt-4 space-y-3">
                          <p className="text-[10px] font-bold uppercase tracking-[0.25em] text-[#C9A96A]">In your {tier.range} plan</p>
                          <StepItems step={STEPS[active]} tierId={tierId} />
                        </div>
                      </m.div>
                    </AnimatePresence>
                  </div>

                  <div className="col-span-1 flex flex-col items-center gap-3">
                    {STEPS.map((st, i) => (
                      <span
                        key={st.title}
                        className={
                          'block rounded-full transition-all duration-500 ' +
                          (active === i ? 'w-3 h-8 bg-[#C9A96A]' : 'w-3 h-3 bg-[#FAF8F5]/25')
                        }
                      />
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Mobile and reduced motion: stacked cards */}
          <div className={(reduce ? '' : 'lg:hidden ') + 'max-w-3xl mx-auto px-4 sm:px-6 pb-16 space-y-10'}>
            {STEPS.map((st, i) => (
              <Reveal key={st.title} className="space-y-4">
                <div className="relative rounded-xs overflow-hidden border border-[#C9A96A]/30 aspect-video">
                  <img src={st.image} alt="" loading="lazy" className="w-full h-full object-cover" />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#0D2226]/70 via-transparent to-transparent" />
                  <span className="absolute bottom-3 left-4 font-serif text-5xl font-bold text-[#FAF8F5]/90 leading-none">0{i + 1}</span>
                </div>
                <h3 className="font-serif text-2xl font-bold">{st.title}</h3>
                <p className="text-sm text-[#F5F1E8]/80 leading-relaxed">{st.text}</p>
                <StepItems step={st} tierId={tierId} />
              </Reveal>
            ))}
          </div>
        </section>

        {/* Plan builder */}
        <section className="max-w-6xl mx-auto px-4 sm:px-6 py-20 grid grid-cols-1 lg:grid-cols-3 gap-10">
          <m.div
            key={tierId}
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: EASE_PREMIUM }}
            className="lg:col-span-2 space-y-14"
          >
            <div className="space-y-2">
              <span className="text-xs font-bold uppercase tracking-[0.25em] text-[#0F5C63]">{tier.name} plan &middot; {tier.range}</span>
              <h2 className="font-serif text-3xl sm:text-4xl font-bold text-[#0D2226]">Build your plan</h2>
              <p className="text-sm text-[#1C2B2E]/75">{tier.blurb}</p>
            </div>

            {/* Foundation */}
            <div className="space-y-4">
              <h3 className="font-serif text-2xl font-bold text-[#0D2226]">Included With Every Listing</h3>
              <Reveal stagger className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {FOUNDATION.map((f) => (
                  <RevealItem key={f.name} className="flex items-start gap-3 bg-white border border-[#C9A96A]/30 p-4 rounded-xs hover:border-[#0F5C63] transition-colors">
                    <CheckCircle2 className="w-4 h-4 text-[#0F5C63] shrink-0 mt-0.5" />
                    <div>
                      <p className="text-sm font-bold text-[#0D2226]">{f.name}</p>
                      <p className="text-xs text-[#1C2B2E]/70 mt-0.5 leading-relaxed">{f.detail}</p>
                    </div>
                  </RevealItem>
                ))}
              </Reveal>
            </div>

            {/* Included at this price */}
            {includedItems.length > 0 && (
              <div className="space-y-4">
                <h3 className="font-serif text-2xl font-bold text-[#0D2226]">Also Included at {tier.range}</h3>
                {hasZs && <p className="text-xs text-[#1C2B2E]/70 leading-relaxed bg-[#0F5C63]/5 border border-[#0F5C63]/20 p-3 rounded-xs">{ZS_NOTE}</p>}
                {groupByCategory(includedItems).map((g) => (
                  <div key={g.category} className="space-y-2">
                    <h4 className="text-xs font-bold uppercase tracking-widest text-[#C9A96A]">{g.category}</h4>
                    {g.items.map((it) => (
                      <div key={it.name} className="flex items-start justify-between gap-3 bg-white border border-[#C9A96A]/25 p-4 rounded-xs">
                        <div className="flex items-start gap-3">
                          <CheckCircle2 className="w-4 h-4 text-[#0F5C63] shrink-0 mt-0.5" />
                          <div>
                            <p className="text-sm font-bold text-[#0D2226]">{it.name}</p>
                            {it.detail && <p className="text-xs text-[#1C2B2E]/70 mt-0.5">{it.detail}</p>}
                          </div>
                        </div>
                        <Chip status={statusFor(it, tierId)} />
                      </div>
                    ))}
                  </div>
                ))}
              </div>
            )}

            {/* Prep pick */}
            {hasPrep && (
              <div className="space-y-4">
                <h3 className="font-serif text-2xl font-bold text-[#0D2226]">Your Prep Pick</h3>
                <p className="text-sm text-[#1C2B2E]/75 leading-relaxed">
                  One prep service is on us. We start you with professional cleaning, and you can swap it for something your home needs more. Want more than one? That is a conversation with Kyle.
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {prepItems.map((it) => {
                    const activePick = prepPick === it.name;
                    return (
                      <label
                        key={it.name}
                        className={
                          'flex items-center gap-3 p-4 border rounded-xs cursor-pointer transition-all ' +
                          (activePick ? 'bg-[#0F5C63]/10 border-[#0F5C63]' : 'bg-white border-[#C9A96A]/30 hover:border-[#0F5C63]')
                        }
                      >
                        <input type="radio" name="prep-pick" checked={activePick} onChange={() => setPrepPick(it.name)} className="accent-[#0F5C63]" />
                        <span className="text-sm text-[#0D2226] font-medium">{it.name}</span>
                      </label>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Extras */}
            {hasExtras && (
              <div className="space-y-4">
                <div className="flex items-end justify-between gap-4 flex-wrap">
                  <h3 className="font-serif text-2xl font-bold text-[#0D2226]">Your Extras</h3>
                  <span className="text-xs font-bold uppercase tracking-widest text-[#0F5C63]">
                    {used} of {tier.extras} chosen
                  </span>
                </div>
                <p className="text-sm text-[#1C2B2E]/75 leading-relaxed">
                  We picked a starting point we would recommend for a home like yours. Change it any time. Bigger items count as 2.
                </p>
                {groupByCategory(extraItems).map((g) => (
                  <div key={g.category} className="space-y-2">
                    <h4 className="text-xs font-bold uppercase tracking-widest text-[#C9A96A]">{g.category}</h4>
                    {g.items.map((it) => {
                      const cost = pickCost(statusFor(it, tierId));
                      const selected = picks.includes(it.name);
                      const blocked = !selected && used + cost > tier.extras;
                      return (
                        <label
                          key={it.name}
                          className={
                            'flex items-center justify-between gap-3 p-4 border rounded-xs transition-all ' +
                            (selected
                              ? 'bg-[#0F5C63]/10 border-[#0F5C63] cursor-pointer'
                              : blocked
                                ? 'bg-[#FAF8F5] border-[#C9A96A]/20 opacity-50 cursor-not-allowed'
                                : 'bg-white border-[#C9A96A]/30 hover:border-[#0F5C63] cursor-pointer')
                          }
                        >
                          <span className="flex items-center gap-3">
                            <input type="checkbox" checked={selected} disabled={blocked} onChange={() => togglePick(it)} className="accent-[#0F5C63]" />
                            <span className="text-sm text-[#0D2226] font-medium">{it.name}</span>
                          </span>
                          {cost === 2 && (
                            <span className="shrink-0 text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 bg-[#C9A96A]/25 text-[#0D2226] rounded-xs">
                              Counts as 2
                            </span>
                          )}
                        </label>
                      );
                    })}
                  </div>
                ))}
              </div>
            )}

            {isCustom && (
              <div className="bg-[#0D2226] text-[#FAF8F5] p-8 rounded-xs space-y-3">
                <h3 className="font-serif text-2xl font-bold">A Custom Plan for Your Home</h3>
                <p className="text-sm text-[#A8B2A1] leading-relaxed">
                  Homes at this level get everything in the Premier plan and a marketing plan designed with Kyle around what makes your property special. Let us build it together.
                </p>
              </div>
            )}

            {askItems.length > 0 && (
              <div className="space-y-4">
                <h3 className="font-serif text-2xl font-bold text-[#0D2226]">Ask Kyle</h3>
                <p className="text-sm text-[#1C2B2E]/75 leading-relaxed">
                  These are available for your home too. Book a strategy session and we will talk about what makes sense.
                </p>
                <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {askItems.map((it) => (
                    <li key={it.name} className="flex items-start gap-2 text-sm text-[#0D2226] bg-white border border-[#C9A96A]/25 p-3 rounded-xs">
                      <Sparkles className="w-4 h-4 text-[#C9A96A] shrink-0 mt-0.5" />
                      <span>{it.name}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Advisor */}
            <div className="bg-white border border-[#C9A96A]/40 p-8 rounded-xs space-y-4">
              <h3 className="font-serif text-2xl font-bold text-[#0D2226]">Your Home Prep Advisor</h3>
              <p className="text-sm text-[#1C2B2E]/80 leading-relaxed">
                Not every home needs one, and we will tell you honestly whether yours does. When it does, this is the first step.
              </p>
              <ul className="space-y-2">
                {ADVISOR_BULLETS.map((b) => (
                  <li key={b} className="flex items-start gap-2 text-sm text-[#0D2226]">
                    <CheckCircle2 className="w-4 h-4 text-[#0F5C63] shrink-0 mt-0.5" />
                    <span>{b}</span>
                  </li>
                ))}
              </ul>
              <p className="text-sm text-[#0F5C63] font-semibold leading-relaxed">
                Choose what you think your home needs today. After your Home Prep Advisor walkthrough, swap any prep item for something better suited to your home. You are never locked in.
              </p>
            </div>
          </m.div>

          {/* Summary */}
          <aside className="lg:col-span-1">
            <div className="lg:sticky lg:top-44 bg-[#0D2226] text-[#FAF8F5] p-7 rounded-xs space-y-5 border border-[#C9A96A]/40 shadow-2xl">
              <div>
                <p className="text-[10px] font-bold uppercase tracking-[0.25em] text-[#C9A96A]">Your plan</p>
                <h3 className="font-serif text-2xl font-bold mt-1">{tier.name}</h3>
                <p className="text-xs text-[#A8B2A1]">{tier.range}</p>
              </div>

              <ul className="space-y-2 text-sm">
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-[#C9A96A] shrink-0 mt-0.5" />
                  <span>Everything included with every listing</span>
                </li>
                {includedItems.length > 0 && (
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-[#C9A96A] shrink-0 mt-0.5" />
                    <span>{includedItems.length} more included at your price</span>
                  </li>
                )}
                {hasPrep && (
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-[#C9A96A] shrink-0 mt-0.5" />
                    <span>Prep pick: {prepPick}</span>
                  </li>
                )}
                <AnimatePresence initial={false}>
                  {hasExtras &&
                    picks.map((name) => (
                      <m.li
                        key={name}
                        initial={{ opacity: 0, x: -12 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: 12 }}
                        transition={{ duration: 0.3, ease: EASE_PREMIUM }}
                        className="flex items-start gap-2"
                      >
                        <CheckCircle2 className="w-4 h-4 text-[#C9A96A] shrink-0 mt-0.5" />
                        <span>{name}</span>
                      </m.li>
                    ))}
                </AnimatePresence>
              </ul>

              <p className="text-xs text-[#A8B2A1] leading-relaxed">Everything can change after your Home Prep Advisor walkthrough.</p>

              <div className="space-y-3">
                <button
                  onClick={onOpenConsultation}
                  className="w-full px-6 py-4 bg-[#C9A96A] hover:bg-[#D4AF37] text-[#0D2226] font-bold text-xs uppercase tracking-widest rounded-xs shadow-lg transition-all hover:-translate-y-0.5 flex items-center justify-center gap-2"
                >
                  <Phone className="w-4 h-4" />
                  Book Your Strategy Session
                </button>
                <button
                  onClick={onOpenValuation}
                  className="w-full px-6 py-3 border border-[#FAF8F5]/30 hover:border-[#C9A96A] text-[#FAF8F5] font-bold text-xs uppercase tracking-widest rounded-xs transition-colors flex items-center justify-center gap-2"
                >
                  <Calculator className="w-4 h-4" />
                  Free Home Valuation
                </button>
              </div>

              <p className="text-xs text-[#C9A96A] leading-relaxed">
                Want more than your plan includes? That is a conversation, not a price tag. Book your strategy session and we will build in everything your home deserves.
              </p>
            </div>
          </aside>
        </section>

        {/* Communication guarantee, animated stats */}
        <section className="bg-[#0D2226] text-[#FAF8F5] py-20">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 space-y-10">
            <Reveal className="text-center space-y-3">
              <span className="text-xs font-bold uppercase tracking-[0.3em] text-[#C9A96A]">Our Communication Guarantee</span>
              <h2 className="font-serif text-3xl sm:text-4xl font-bold">You will never wonder where things stand</h2>
              <p className="text-sm text-[#A8B2A1] max-w-2xl mx-auto">
                Poor communication is the number one complaint sellers have about their agent. So we guarantee it.
              </p>
            </Reveal>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              <StatTile value={48} suffix="hrs" label="Showing feedback" reduce={reduce} />
              <StatTile value="Weekly" label="Activity and pricing call" reduce={reduce} />
              <StatTile value={6} suffix="days" label="Available, Mon to Sat" reduce={reduce} />
              <StatTile value="Same day" label="Calls and emails returned" reduce={reduce} />
            </div>
            <p className="text-xs text-center text-[#A8B2A1]">Often within the hour.</p>
          </div>
        </section>

        {/* Team + numbers */}
        <section className="max-w-5xl mx-auto px-4 sm:px-6 py-20 grid grid-cols-1 md:grid-cols-2 gap-8">
          <Reveal className="bg-white border border-[#C9A96A]/40 p-8 rounded-xs space-y-4">
            <h2 className="font-serif text-2xl font-bold text-[#0D2226]">Your Team, Not Just One Person</h2>
            <p className="text-sm text-[#1C2B2E]/80 leading-relaxed">You are not relying on a single overloaded agent. You get:</p>
            <ul className="space-y-3">
              {TEAM.map((t) => (
                <li key={t.role} className="text-sm text-[#0D2226]">
                  <span className="font-bold">{t.role}.</span> <span className="text-[#1C2B2E]/75">{t.detail}</span>
                </li>
              ))}
            </ul>
          </Reveal>
          <Reveal className="bg-white border border-[#C9A96A]/40 p-8 rounded-xs space-y-3">
            <h2 className="font-serif text-2xl font-bold text-[#0D2226]">The Numbers That Matter</h2>
            <p className="text-sm text-[#1C2B2E]/80 leading-relaxed">{PERFORMANCE_NOTE}</p>
          </Reveal>
        </section>

        {/* Final call to action */}
        <section className="relative overflow-hidden bg-[#0D2226] text-[#FAF8F5] py-24">
          <div className="pointer-events-none absolute -top-32 left-1/4 w-[30rem] h-[30rem] rounded-full bg-[#0F5C63]/40 blur-3xl animate-pulse" />
          <div className="pointer-events-none absolute -bottom-40 right-1/4 w-[26rem] h-[26rem] rounded-full bg-[#C9A96A]/20 blur-3xl animate-pulse" />
          <Reveal className="relative max-w-3xl mx-auto px-4 sm:px-6 text-center space-y-6">
            <h2 className="font-serif text-4xl sm:text-5xl font-bold leading-tight">Ready to see this for your home?</h2>
            <p className="text-sm sm:text-base text-[#A8B2A1]">
              Book your strategy session and we will build the plan around your home, together.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <button
                onClick={onOpenConsultation}
                className="px-8 py-4 bg-[#C9A96A] hover:bg-[#D4AF37] text-[#0D2226] font-bold text-xs uppercase tracking-widest rounded-xs shadow-xl transition-all hover:-translate-y-0.5 flex items-center gap-2"
              >
                <Phone className="w-4 h-4" />
                Book Your Strategy Session
                <ArrowRight className="w-4 h-4" />
              </button>
              <button
                onClick={onOpenValuation}
                className="px-8 py-4 border border-[#FAF8F5]/30 hover:border-[#C9A96A] text-[#FAF8F5] font-bold text-xs uppercase tracking-widest rounded-xs transition-colors flex items-center gap-2"
              >
                <Calculator className="w-4 h-4" />
                Free Home Valuation
              </button>
            </div>
            <div className="pt-4 inline-flex items-center gap-2 text-sm text-[#F5F1E8]/90 font-semibold">
              <ShieldCheck className="w-5 h-5 text-[#C9A96A]" />
              <span>{CANCEL_LINE}</span>
            </div>
            <p className="text-xs text-[#A8B2A1]">
              Want to know more about Showcase?{' '}
              <Link to="/zillow-showcase" className="text-[#C9A96A] font-bold underline hover:text-[#FAF8F5]">
                Read about Zillow Showcase
              </Link>
              .
            </p>
          </Reveal>
        </section>
      </div>
    </div>
  );
};
