import React, { useEffect, useRef, useState } from 'react';
import { Navigate, useNavigate, useParams } from 'react-router-dom';
import { AnimatePresence, m, useReducedMotion } from 'motion/react';
import { ArrowLeft, ArrowRight, CheckCircle2, Phone, Plus, Sparkles, ShieldCheck } from 'lucide-react';
import { usePageMeta } from '../lib/usePageMeta';
import { EASE_PREMIUM } from '../lib/motion';
import { submitLead } from '../lib/leads';
import { TcpaConsent } from '../components/TcpaConsent';
import { ScrollIntro } from '../components/plan/ScrollIntro';
import {
  ADVISOR_BULLETS,
  CANCEL_LINE,
  DEFAULT_EXTRAS,
  DEFAULT_PREP_PICK,
  FOUNDATION,
  GUARANTEE_POINTS,
  PLAN_STEPS,
  SAME_KYLE,
  TEAM,
  TIERS,
  ZS_NOTE,
  itemsForStep,
  pickCost,
  statusFor,
  tierForValue,
} from '../data/marketingPlan';
import type { Item, PlanStep, Status, StepSlug, TierId } from '../data/marketingPlan';

interface MarketingPlanPageProps {
  onOpenValuation: () => void;
  onOpenConsultation: () => void;
}

const BASE = '/sell/marketing-plan';
const STORE_KEY = 'friedman.sellerPlan.v1';

interface Saved {
  address?: string;
  value?: number | null;
  prepPick?: string;
  picks?: string[] | null;
}

function loadSaved(): Saved {
  try {
    const raw = sessionStorage.getItem(STORE_KEY);
    return raw ? (JSON.parse(raw) as Saved) : {};
  } catch {
    return {};
  }
}

function money(n: number): string {
  return '$' + n.toLocaleString('en-US');
}

const isIncluded = (s: Status) => s === 'included' || s === 'rec' || s === 'zs' || s === 'zsplus';

const Tag: React.FC<{ status: Status }> = ({ status }) => {
  if (status === 'zs' || status === 'zsplus') {
    return <span className="shrink-0 text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 bg-[#0F5C63] text-white rounded-xs">{status === 'zsplus' ? 'ZS+' : 'ZS'}</span>;
  }
  if (status === 'rec') {
    return <span className="shrink-0 text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 bg-[#C9A96A]/30 text-[#0D2226] rounded-xs">When recommended</span>;
  }
  return null;
};

const slide = {
  enter: (dir: number) => ({ opacity: 0, x: dir * 48 }),
  center: { opacity: 1, x: 0, transition: { duration: 0.5, ease: EASE_PREMIUM } },
  exit: (dir: number) => ({ opacity: 0, x: dir * -48, transition: { duration: 0.25, ease: EASE_PREMIUM } }),
};

export const MarketingPlanPage: React.FC<MarketingPlanPageProps> = ({ onOpenValuation, onOpenConsultation }) => {
  usePageMeta(
    'Build Your Marketing Plan | The Friedman Team',
    'Build your home selling plan step by step with The Friedman Team: prep, photos, exposure and launch, personalized to your home.'
  );

  const { step } = useParams<{ step?: string }>();
  const navigate = useNavigate();
  const reduce = !!useReducedMotion();

  const saved = useRef<Saved>(loadSaved()).current;
  const [address, setAddress] = useState<string>(saved.address || '');
  const [value, setValueState] = useState<number | null>(typeof saved.value === 'number' ? saved.value : null);
  const [prepPick, setPrepPick] = useState<string>(saved.prepPick || DEFAULT_PREP_PICK);
  const [picks, setPicks] = useState<string[] | null>(saved.picks ?? null);

  // Contact form (final step)
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const tierId: TierId = value == null ? 't2' : tierForValue(value);
  const tier = TIERS.find((t) => t.id === tierId) || TIERS[1];
  const effectivePicks = picks ?? DEFAULT_EXTRAS[tierId];

  const setValue = (v: number | null) => {
    const before = value == null ? null : tierForValue(value);
    const after = v == null ? null : tierForValue(v);
    setValueState(v);
    if (before !== after) {
      setPicks(null);
      setPrepPick(DEFAULT_PREP_PICK);
    }
  };

  useEffect(() => {
    try {
      sessionStorage.setItem(STORE_KEY, JSON.stringify({ address, value, prepPick, picks }));
    } catch {
      /* private mode etc.: the flow still works without saving */
    }
  }, [address, value, prepPick, picks]);

  // Steps that have something to show at this price. The seller never sees
  // why a step is shorter or missing: they just see their options.
  const steps: PlanStep[] = PLAN_STEPS.filter((s) => s.slug === 'home' || s.slug === 'plan' || itemsForStep(s, tierId).length > 0);
  const idx = steps.findIndex((s) => s.slug === step);

  const lastIdx = useRef(idx);
  const dir = idx >= lastIdx.current ? 1 : -1;
  useEffect(() => {
    lastIdx.current = idx;
  }, [idx]);

  const go = (slug: StepSlug) => navigate(`${BASE}/${slug}`);

  if (!step) return <ScrollIntro onStart={() => go('home')} />;
  if (idx === -1) return <Navigate to={BASE} replace />;
  const cur = steps[idx];
  if (cur.slug !== 'home' && value == null) return <Navigate to={`${BASE}/home`} replace />;

  const stepItems = itemsForStep(cur, tierId);
  const includedItems = stepItems.filter((i) => isIncluded(statusFor(i, tierId)));
  const swapItems = stepItems.filter((i) => statusFor(i, tierId) === 'swap');
  const extraItems = stepItems.filter((i) => {
    const s = statusFor(i, tierId);
    return s === 'extra' || s === 'extra2';
  });
  const askItems = stepItems.filter((i) => statusFor(i, tierId) === 'ask');

  const used = effectivePicks.reduce((sum, n) => {
    // Look the item up across every step so the counter is global.
    const it = PLAN_STEPS.flatMap((s) => itemsForStep(s, tierId)).find((i) => i.name === n);
    return sum + (it ? pickCost(statusFor(it, tierId)) : 0);
  }, 0);
  const hasPicks = tier.extras > 0 && tierId !== 't5';

  const togglePick = (it: Item) => {
    const cost = pickCost(statusFor(it, tierId));
    if (effectivePicks.includes(it.name)) setPicks(effectivePicks.filter((p) => p !== it.name));
    else if (used + cost <= tier.extras) setPicks([...effectivePicks, it.name]);
  };

  const goNext = () => {
    if (idx < steps.length - 1) go(steps[idx + 1].slug);
  };
  const goBack = () => {
    if (idx > 0) go(steps[idx - 1].slug);
    else navigate(BASE);
  };

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSending(true);
    setError(null);
    const allItems = PLAN_STEPS.flatMap((s) => itemsForStep(s, tierId));
    const chosen = effectivePicks.filter((n) => allItems.some((i) => i.name === n));
    const message = [
      'Seller plan builder',
      address ? `Property: ${address}` : null,
      value != null ? `Seller estimate: ${money(value)}` : null,
      `Plan level (internal): ${tier.name}`,
      allItems.some((i) => statusFor(i, tierId) === 'swap') ? `Prep pick: ${prepPick}` : null,
      chosen.length ? `Extras chosen: ${chosen.join('; ')}` : null,
    ]
      .filter(Boolean)
      .join('\n');
    const res = await submitLead({ name, email, phone, type: 'Seller Inquiry', message });
    setSending(false);
    if (res.ok) setSent(true);
    else setError(res.error || 'Something went wrong. Please call or email Kyle directly.');
  };

  const isPlan = cur.slug === 'plan';
  const isHome = cur.slug === 'home';

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#FAF8F5] via-[#F3EFE6] to-[#FAF8F5] pt-28 pb-24">
      <div className="max-w-3xl mx-auto px-4 sm:px-6">
        {/* Stepper */}
        <ol className="flex items-center justify-between gap-1 mb-8">
          {steps.map((s, i) => {
            const done = i < idx;
            const active = i === idx;
            return (
              <li key={s.slug} className="flex-1 flex flex-col items-center gap-2 relative">
                {i > 0 && <span className={'absolute top-[13px] right-1/2 w-full h-[2px] -z-0 ' + (i <= idx ? 'bg-[#0F5C63]' : 'bg-[#0D2226]/15')} />}
                <span
                  className={
                    'relative z-10 w-7 h-7 rounded-full text-xs font-bold flex items-center justify-center border-2 transition-colors duration-300 ' +
                    (done ? 'bg-[#0F5C63] border-[#0F5C63] text-white' : active ? 'bg-white border-[#0F5C63] text-[#0F5C63]' : 'bg-white border-[#0D2226]/20 text-[#0D2226]/40')
                  }
                >
                  {done ? <CheckCircle2 className="w-4 h-4" /> : i + 1}
                </span>
                <span className={'hidden sm:block text-[10px] font-bold uppercase tracking-wider text-center ' + (active ? 'text-[#0F5C63]' : 'text-[#0D2226]/40')}>{s.label}</span>
              </li>
            );
          })}
        </ol>

        <AnimatePresence mode="wait" custom={dir} initial={false}>
          <m.div key={cur.slug} custom={dir} variants={reduce ? undefined : slide} initial={reduce ? false : 'enter'} animate="center" exit={reduce ? undefined : 'exit'}>
            <div className="bg-white border border-[#C9A96A]/30 shadow-[0_20px_60px_-20px_rgba(13,34,38,0.25)] rounded-xs p-6 sm:p-10 space-y-8">
              <header className="space-y-2">
                <span className="text-xs font-bold uppercase tracking-[0.25em] text-[#0F5C63]">
                  Step {idx + 1} of {steps.length}
                </span>
                <h1 className="font-serif text-3xl sm:text-4xl font-bold text-[#0D2226] leading-tight">{cur.title}</h1>
                <p className="text-sm sm:text-base text-[#1C2B2E]/75 leading-relaxed">{cur.intro}</p>
              </header>

              {/* HOME */}
              {isHome && (
                <div className="space-y-6">
                  <label className="block space-y-2">
                    <span className="text-xs font-bold uppercase tracking-widest text-[#0D2226]/70">Property address (optional)</span>
                    <input
                      value={address}
                      onChange={(e) => setAddress(e.target.value)}
                      placeholder="123 Main St, Westminster, MD"
                      autoComplete="street-address"
                      className="w-full border border-[#0D2226]/20 focus:border-[#0F5C63] outline-none px-4 py-3 text-base rounded-xs bg-[#FAF8F5]"
                    />
                  </label>
                  <div className="space-y-3">
                    <span className="text-xs font-bold uppercase tracking-widest text-[#0D2226]/70">About what is your home worth?</span>
                    <div className="flex items-baseline gap-3">
                      <span className="font-serif text-4xl sm:text-5xl font-bold text-[#0F5C63]">{value == null ? '$ ---' : money(value)}</span>
                    </div>
                    <input
                      type="range"
                      min={100000}
                      max={2000000}
                      step={10000}
                      value={value ?? 400000}
                      onChange={(e) => setValue(Number(e.target.value))}
                      onPointerDown={() => value == null && setValue(400000)}
                      className="w-full accent-[#0F5C63]"
                      aria-label="Estimated home value"
                    />
                    <div className="flex justify-between text-[11px] text-[#0D2226]/50">
                      <span>$100K</span>
                      <span>$2M+</span>
                    </div>
                    <label className="block space-y-1">
                      <span className="text-xs text-[#0D2226]/60">Or type it</span>
                      <input
                        inputMode="numeric"
                        value={value == null ? '' : value.toLocaleString('en-US')}
                        onChange={(e) => {
                          const n = Number(e.target.value.replace(/[^0-9]/g, ''));
                          setValue(n > 0 ? n : null);
                        }}
                        placeholder="e.g. 425,000"
                        className="w-full border border-[#0D2226]/20 focus:border-[#0F5C63] outline-none px-4 py-3 text-base rounded-xs bg-[#FAF8F5]"
                      />
                    </label>
                  </div>
                  <p className="text-sm text-[#1C2B2E]/70 leading-relaxed">
                    Not sure? No problem. Kyle confirms the real number with recent comparable sales.{' '}
                    <button type="button" onClick={onOpenValuation} className="text-[#0F5C63] font-bold underline underline-offset-2 hover:text-[#0D2226]">
                      Get a free home valuation
                    </button>
                    .
                  </p>
                </div>
              )}

              {/* PREP */}
              {cur.slug === 'prep' && (
                <div className="space-y-7">
                  <div className="bg-[#0F5C63]/5 border border-[#0F5C63]/20 p-5 rounded-xs space-y-3">
                    <h2 className="font-serif text-xl font-bold text-[#0D2226]">Your Home Prep Advisor</h2>
                    <p className="text-sm text-[#1C2B2E]/80">Not every home needs one, and we will tell you honestly whether yours does.</p>
                    <ul className="space-y-1.5">
                      {ADVISOR_BULLETS.slice(0, 4).map((b) => (
                        <li key={b} className="flex items-start gap-2 text-sm text-[#0D2226]">
                          <CheckCircle2 className="w-4 h-4 text-[#0F5C63] shrink-0 mt-0.5" />
                          <span>{b}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {includedItems.length > 0 && <IncludedList title="Included for you" items={includedItems} tierId={tierId} />}

                  {swapItems.length > 0 && (
                    <div className="space-y-3">
                      <h2 className="font-serif text-xl font-bold text-[#0D2226]">Choose your prep service</h2>
                      <p className="text-sm text-[#1C2B2E]/75 leading-relaxed">
                        One prep service is on us. We start you with professional cleaning. Pick what you think your home needs today. After your Advisor walkthrough you can swap it for something better suited, so you are never stuck.
                      </p>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        {swapItems.map((it) => {
                          const on = prepPick === it.name;
                          return (
                            <label key={it.name} className={'flex items-center gap-3 p-4 border rounded-xs cursor-pointer transition-all ' + (on ? 'bg-[#0F5C63]/10 border-[#0F5C63]' : 'bg-white border-[#0D2226]/15 hover:border-[#0F5C63]')}>
                              <input type="radio" name="prep-pick" checked={on} onChange={() => setPrepPick(it.name)} className="accent-[#0F5C63]" />
                              <span className="text-sm font-medium text-[#0D2226]">{it.name}</span>
                            </label>
                          );
                        })}
                      </div>
                    </div>
                  )}
                  {askItems.length > 0 && <AskList items={askItems} />}
                </div>
              )}

              {/* VISUALS / REACH / LAUNCH */}
              {(cur.slug === 'visuals' || cur.slug === 'reach' || cur.slug === 'launch') && (
                <div className="space-y-7">
                  {includedItems.some((i) => statusFor(i, tierId) === 'zs' || statusFor(i, tierId) === 'zsplus') && (
                    <p className="text-xs text-[#1C2B2E]/70 leading-relaxed bg-[#0F5C63]/5 border border-[#0F5C63]/20 p-3 rounded-xs">{ZS_NOTE}</p>
                  )}
                  {includedItems.length > 0 && <IncludedList title="Included for you" items={includedItems} tierId={tierId} />}

                  {extraItems.length > 0 && hasPicks && (
                    <div className="space-y-3">
                      <div className="flex items-end justify-between gap-3 flex-wrap">
                        <h2 className="font-serif text-xl font-bold text-[#0D2226]">Choose your extras</h2>
                        <span className="text-xs font-bold uppercase tracking-widest text-[#0F5C63]">
                          {used} of {tier.extras} chosen
                        </span>
                      </div>
                      <p className="text-sm text-[#1C2B2E]/75">We picked a starting point we would recommend for a home like yours. Change it any time. Bigger items count as 2.</p>
                      <div className="grid grid-cols-1 gap-3">
                        {extraItems.map((it) => {
                          const cost = pickCost(statusFor(it, tierId));
                          const on = effectivePicks.includes(it.name);
                          const blocked = !on && used + cost > tier.extras;
                          return (
                            <label
                              key={it.name}
                              className={
                                'flex items-center justify-between gap-3 p-4 border rounded-xs transition-all ' +
                                (on ? 'bg-[#0F5C63]/10 border-[#0F5C63] cursor-pointer' : blocked ? 'opacity-45 border-[#0D2226]/10 cursor-not-allowed' : 'bg-white border-[#0D2226]/15 hover:border-[#0F5C63] cursor-pointer')
                              }
                            >
                              <span className="flex items-center gap-3">
                                <input type="checkbox" checked={on} disabled={blocked} onChange={() => togglePick(it)} className="accent-[#0F5C63]" />
                                <span className="text-sm font-medium text-[#0D2226]">{it.name}</span>
                              </span>
                              {cost === 2 && <span className="shrink-0 text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 bg-[#C9A96A]/30 text-[#0D2226] rounded-xs">Counts as 2</span>}
                            </label>
                          );
                        })}
                      </div>
                    </div>
                  )}
                  {askItems.length > 0 && <AskList items={askItems} />}
                </div>
              )}

              {/* PLAN */}
              {isPlan && (
                <div className="space-y-8">
                  <PlanSummary tierId={tierId} prepPick={prepPick} picks={effectivePicks} />

                  <div className="bg-[#0F5C63]/5 border border-[#0F5C63]/20 p-5 rounded-xs space-y-3">
                    <h2 className="font-serif text-xl font-bold text-[#0D2226]">Our communication guarantee</h2>
                    <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      {GUARANTEE_POINTS.map((g) => (
                        <li key={g} className="flex items-start gap-2 text-sm text-[#0D2226]">
                          <CheckCircle2 className="w-4 h-4 text-[#0F5C63] shrink-0 mt-0.5" />
                          <span>{g}</span>
                        </li>
                      ))}
                    </ul>
                    <p className="text-sm text-[#1C2B2E]/75 pt-1">
                      {TEAM.map((t) => t.role).join(', ')}: a whole team behind your sale, not just one person.
                    </p>
                  </div>

                  <p className="text-sm text-[#0F5C63] font-semibold">
                    Everything here can change after your Home Prep Advisor walkthrough. Want more than your plan includes? That is a conversation, not a price tag. Book your strategy session and we will build in everything your home deserves.
                  </p>

                  {sent ? (
                    <div className="bg-[#0F5C63] text-white p-6 rounded-xs space-y-2">
                      <h2 className="font-serif text-2xl font-bold">Thank you, {name.split(' ')[0] || 'friend'}!</h2>
                      <p className="text-sm text-white/90">Kyle has your plan and will be in touch soon to book your strategy session.</p>
                    </div>
                  ) : (
                    <form onSubmit={submit} className="space-y-4 border-t border-[#0D2226]/10 pt-6">
                      <h2 className="font-serif text-xl font-bold text-[#0D2226]">Where should we send your plan?</h2>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <input required value={name} onChange={(e) => setName(e.target.value)} placeholder="Your name" autoComplete="name" className="sm:col-span-2 border border-[#0D2226]/20 focus:border-[#0F5C63] outline-none px-4 py-3 text-base rounded-xs bg-[#FAF8F5]" />
                        <input required type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Email" autoComplete="email" className="border border-[#0D2226]/20 focus:border-[#0F5C63] outline-none px-4 py-3 text-base rounded-xs bg-[#FAF8F5]" />
                        <input required type="tel" value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="Phone" autoComplete="tel" className="border border-[#0D2226]/20 focus:border-[#0F5C63] outline-none px-4 py-3 text-base rounded-xs bg-[#FAF8F5]" />
                      </div>
                      <TcpaConsent />
                      {error && <p className="text-sm text-red-600">{error}</p>}
                      <button type="submit" disabled={sending} className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-4 bg-[#0F5C63] hover:bg-[#0D2226] disabled:opacity-60 text-white font-bold text-xs uppercase tracking-widest rounded-xs shadow-lg transition-colors">
                        <Phone className="w-4 h-4" />
                        {sending ? 'Sending...' : 'Book my strategy session'}
                      </button>
                      <p className="flex items-center gap-2 text-xs text-[#0D2226]/70">
                        <ShieldCheck className="w-4 h-4 text-[#0F5C63]" />
                        {CANCEL_LINE}
                      </p>
                    </form>
                  )}
                  <p className="text-xs text-[#0D2226]/50">{SAME_KYLE}</p>
                </div>
              )}

              {/* Footer nav */}
              <footer className="flex items-center justify-between gap-4 pt-2 border-t border-[#0D2226]/10">
                <button onClick={goBack} className="inline-flex items-center gap-2 px-5 py-3 text-xs font-bold uppercase tracking-widest text-[#0D2226]/70 hover:text-[#0F5C63] transition-colors">
                  <ArrowLeft className="w-4 h-4" />
                  {idx === 0 ? 'Intro' : 'Back'}
                </button>
                {!isPlan && (
                  <button
                    onClick={goNext}
                    disabled={isHome && value == null}
                    className="inline-flex items-center gap-2 px-7 py-3 bg-[#0F5C63] hover:bg-[#0D2226] disabled:opacity-40 text-white font-bold text-xs uppercase tracking-widest rounded-xs shadow-md transition-all hover:-translate-y-0.5"
                  >
                    {isHome ? 'See my plan' : 'Next'}
                    <ArrowRight className="w-4 h-4" />
                  </button>
                )}
              </footer>
            </div>
          </m.div>
        </AnimatePresence>

        <p className="text-center text-xs text-[#0D2226]/50 mt-6">
          Want to talk it through?{' '}
          <button onClick={onOpenConsultation} className="text-[#0F5C63] font-bold underline underline-offset-2 hover:text-[#0D2226]">
            Book a strategy session
          </button>
        </p>
      </div>
    </div>
  );
};

// A checked list of what's included in a step.
const IncludedList: React.FC<{ title: string; items: Item[]; tierId: TierId }> = ({ title, items, tierId }) => (
  <div className="space-y-3">
    <h2 className="font-serif text-xl font-bold text-[#0D2226]">{title}</h2>
    <ul className="space-y-2">
      {items.map((it) => (
        <li key={it.name} className="flex items-start justify-between gap-3 bg-[#FAF8F5] border border-[#0D2226]/10 p-3.5 rounded-xs">
          <div className="flex items-start gap-3">
            <CheckCircle2 className="w-4 h-4 text-[#0F5C63] shrink-0 mt-0.5" />
            <div>
              <p className="text-sm font-bold text-[#0D2226]">{it.name}</p>
              {it.detail && <p className="text-xs text-[#1C2B2E]/65 mt-0.5">{it.detail}</p>}
            </div>
          </div>
          <Tag status={statusFor(it, tierId)} />
        </li>
      ))}
    </ul>
  </div>
);

const AskList: React.FC<{ items: Item[] }> = ({ items }) => (
  <div className="space-y-2">
    <h2 className="font-serif text-lg font-bold text-[#0D2226]">Also available when we talk</h2>
    <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2">
      {items.map((it) => (
        <li key={it.name} className="flex items-start gap-2 text-sm text-[#0D2226] bg-[#C9A96A]/10 border border-[#C9A96A]/30 p-3 rounded-xs">
          <Sparkles className="w-4 h-4 text-[#C9A96A] shrink-0 mt-0.5" />
          <span>{it.name}</span>
        </li>
      ))}
    </ul>
  </div>
);

// Everything in one place on the last step.
const PlanSummary: React.FC<{ tierId: TierId; prepPick: string; picks: string[] }> = ({ tierId, prepPick, picks }) => {
  const groups = PLAN_STEPS.filter((s) => s.categories.length > 0).map((s) => ({ step: s, items: itemsForStep(s, tierId) }));
  const hasPrep = groups.some((g) => g.items.some((i) => statusFor(i, tierId) === 'swap'));
  const chosenPicks = picks.filter((n) => groups.some((g) => g.items.some((i) => i.name === n)));
  return (
    <div className="space-y-6">
      <details className="group border border-[#0D2226]/10 rounded-xs bg-[#FAF8F5]">
        <summary className="cursor-pointer list-none flex items-center justify-between gap-3 p-4 font-serif text-xl font-bold text-[#0D2226]">
          <span>With every listing ({FOUNDATION.length} services)</span>
          <span className="text-xs font-sans font-bold uppercase tracking-widest text-[#0F5C63] group-open:hidden">Show</span>
          <span className="text-xs font-sans font-bold uppercase tracking-widest text-[#0F5C63] hidden group-open:inline">Hide</span>
        </summary>
        <ul className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-1.5 px-4 pb-4">
          {FOUNDATION.map((f) => (
            <li key={f.name} className="flex items-start gap-2 text-sm text-[#0D2226]">
              <CheckCircle2 className="w-4 h-4 text-[#0F5C63] shrink-0 mt-0.5" />
              <span>{f.name}</span>
            </li>
          ))}
        </ul>
      </details>
      {groups.map((g) => {
        const inc = g.items.filter((i) => isIncluded(statusFor(i, tierId)));
        if (inc.length === 0) return null;
        return (
          <div key={g.step.slug} className="space-y-2">
            <h2 className="font-serif text-xl font-bold text-[#0D2226]">{g.step.label}</h2>
            <ul className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-1.5">
              {inc.map((i) => (
                <li key={i.name} className="flex items-start gap-2 text-sm text-[#0D2226]">
                  <CheckCircle2 className="w-4 h-4 text-[#0F5C63] shrink-0 mt-0.5" />
                  <span>{i.name}</span>
                </li>
              ))}
            </ul>
          </div>
        );
      })}
      {(hasPrep || chosenPicks.length > 0) && (
        <div className="space-y-2 bg-[#C9A96A]/10 border border-[#C9A96A]/30 p-4 rounded-xs">
          <h2 className="font-serif text-xl font-bold text-[#0D2226]">Your choices</h2>
          <ul className="space-y-1.5">
            {hasPrep && (
              <li className="flex items-start gap-2 text-sm text-[#0D2226]">
                <Plus className="w-4 h-4 text-[#C9A96A] shrink-0 mt-0.5" />
                <span>Prep: {prepPick}</span>
              </li>
            )}
            {chosenPicks.map((n) => (
              <li key={n} className="flex items-start gap-2 text-sm text-[#0D2226]">
                <Plus className="w-4 h-4 text-[#C9A96A] shrink-0 mt-0.5" />
                <span>{n}</span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};
