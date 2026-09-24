import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { CheckCircle2, Phone, Calculator, ShieldCheck, Sparkles } from 'lucide-react';
import { usePageMeta } from '../lib/usePageMeta';
import {
  ADVISOR_BULLETS,
  CANCEL_LINE,
  CATEGORIES,
  DEFAULT_EXTRAS,
  DEFAULT_PREP_PICK,
  FOUNDATION,
  GUARANTEE_POINTS,
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
import type { Item, Status, TierId } from '../data/marketingPlan';

interface MarketingPlanPageProps {
  onOpenValuation: () => void;
  onOpenConsultation: () => void;
}

function groupByCategory(list: Item[]) {
  return CATEGORIES.map((c) => ({ category: c, items: list.filter((i) => i.category === c) })).filter((g) => g.items.length > 0);
}

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

export const MarketingPlanPage: React.FC<MarketingPlanPageProps> = ({ onOpenValuation, onOpenConsultation }) => {
  usePageMeta(
    'Your Marketing Plan | The Friedman Team',
    'See exactly what is included when you list with The Friedman Team, personalized to your home price, plus the extras you can choose.'
  );

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
    <div className="pt-28 pb-20 space-y-16">
      {/* Hero */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 text-center space-y-5">
        <span className="text-xs font-bold uppercase tracking-[0.25em] text-[#0F5C63] bg-[#0F5C63]/10 px-4 py-1.5 border border-[#0F5C63]/30 inline-block">
          For Sellers
        </span>
        <h1 className="font-serif text-4xl sm:text-6xl font-bold text-[#0D2226] leading-tight">
          Your Marketing Plan, Built Around Your Home
        </h1>
        <p className="text-sm sm:text-base text-[#1C2B2E]/80 max-w-2xl mx-auto leading-relaxed">
          Choose your price range and see exactly what is included, what you can pick, and what we can add when we talk. Nothing hidden and no locked-in choices.
        </p>
        <p className="text-sm font-semibold text-[#0F5C63] max-w-2xl mx-auto">{SAME_KYLE}</p>
      </section>

      {/* Range chooser */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6 space-y-4">
        <h2 className="font-serif text-xl font-bold text-[#0D2226] text-center">What is your home worth?</h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
          {TIERS.map((t) => {
            const active = t.id === tierId;
            return (
              <button
                key={t.id}
                type="button"
                aria-pressed={active}
                onClick={() => chooseTier(t.id)}
                className={
                  'text-left p-4 border rounded-xs transition-all ' +
                  (active
                    ? 'bg-[#0F5C63] border-[#0F5C63] text-[#FAF8F5] shadow-lg'
                    : 'bg-[#FAF8F5] border-[#C9A96A]/40 text-[#0D2226] hover:border-[#0F5C63]')
                }
              >
                <span className="block text-[10px] font-bold uppercase tracking-widest opacity-70">{t.name}</span>
                <span className="block font-serif text-sm font-bold mt-1 leading-snug">{t.range}</span>
              </button>
            );
          })}
        </div>
        <p className="text-sm text-center text-[#1C2B2E]/70">{tier.blurb}</p>
      </section>

      <section className="max-w-6xl mx-auto px-4 sm:px-6 grid grid-cols-1 lg:grid-cols-3 gap-10">
        <div className="lg:col-span-2 space-y-12">
          {/* Foundation */}
          <div className="space-y-4">
            <h2 className="font-serif text-2xl font-bold text-[#0D2226]">Included With Every Listing</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {FOUNDATION.map((f) => (
                <div key={f.name} className="flex items-start gap-3 bg-[#FAF8F5] border border-[#C9A96A]/30 p-4 rounded-xs">
                  <CheckCircle2 className="w-4 h-4 text-[#0F5C63] shrink-0 mt-0.5" />
                  <div>
                    <p className="text-sm font-bold text-[#0D2226]">{f.name}</p>
                    <p className="text-xs text-[#1C2B2E]/70 mt-0.5 leading-relaxed">{f.detail}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Included at this price */}
          {includedItems.length > 0 && (
            <div className="space-y-4">
              <h2 className="font-serif text-2xl font-bold text-[#0D2226]">Also Included at {tier.range}</h2>
              {hasZs && <p className="text-xs text-[#1C2B2E]/70 leading-relaxed bg-[#0F5C63]/5 border border-[#0F5C63]/20 p-3 rounded-xs">{ZS_NOTE}</p>}
              {groupByCategory(includedItems).map((g) => (
                <div key={g.category} className="space-y-2">
                  <h3 className="text-xs font-bold uppercase tracking-widest text-[#C9A96A]">{g.category}</h3>
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
              <h2 className="font-serif text-2xl font-bold text-[#0D2226]">Your Prep Pick</h2>
              <p className="text-sm text-[#1C2B2E]/75 leading-relaxed">
                One prep service is on us. We start you with professional cleaning, and you can swap it for something your home needs more. Want more than one? That is a conversation with Kyle.
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {prepItems.map((it) => {
                  const active = prepPick === it.name;
                  return (
                    <label
                      key={it.name}
                      className={
                        'flex items-center gap-3 p-4 border rounded-xs cursor-pointer transition-all ' +
                        (active ? 'bg-[#0F5C63]/10 border-[#0F5C63]' : 'bg-white border-[#C9A96A]/30 hover:border-[#0F5C63]')
                      }
                    >
                      <input
                        type="radio"
                        name="prep-pick"
                        checked={active}
                        onChange={() => setPrepPick(it.name)}
                        className="accent-[#0F5C63]"
                      />
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
                <h2 className="font-serif text-2xl font-bold text-[#0D2226]">Your Extras</h2>
                <span className="text-xs font-bold uppercase tracking-widest text-[#0F5C63]">
                  {used} of {tier.extras} chosen
                </span>
              </div>
              <p className="text-sm text-[#1C2B2E]/75 leading-relaxed">
                We have picked a starting point we would recommend for a home like yours. Change it any time. Bigger items count as 2.
              </p>
              {groupByCategory(extraItems).map((g) => (
                <div key={g.category} className="space-y-2">
                  <h3 className="text-xs font-bold uppercase tracking-widest text-[#C9A96A]">{g.category}</h3>
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
                          <input
                            type="checkbox"
                            checked={selected}
                            disabled={blocked}
                            onChange={() => togglePick(it)}
                            className="accent-[#0F5C63]"
                          />
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

          {/* Custom / ask */}
          {isCustom && (
            <div className="bg-[#0D2226] text-[#FAF8F5] p-8 rounded-xs space-y-3">
              <h2 className="font-serif text-2xl font-bold">A Custom Plan for Your Home</h2>
              <p className="text-sm text-[#A8B2A1] leading-relaxed">
                Homes at this level get everything in the Premier plan and a marketing plan designed with Kyle around what makes your property special. Let us build it together.
              </p>
            </div>
          )}

          {askItems.length > 0 && (
            <div className="space-y-4">
              <h2 className="font-serif text-2xl font-bold text-[#0D2226]">Ask Kyle</h2>
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
          <div className="bg-[#FAF8F5] border border-[#C9A96A]/40 p-8 rounded-xs space-y-4">
            <h2 className="font-serif text-2xl font-bold text-[#0D2226]">Your Home Prep Advisor</h2>
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
        </div>

        {/* Summary */}
        <aside className="lg:col-span-1">
          <div className="lg:sticky lg:top-28 bg-[#0D2226] text-[#FAF8F5] p-7 rounded-xs space-y-5 border border-[#C9A96A]/40">
            <div>
              <p className="text-[10px] font-bold uppercase tracking-[0.25em] text-[#C9A96A]">Your plan</p>
              <h2 className="font-serif text-2xl font-bold mt-1">
                {tier.name}
              </h2>
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
              {hasExtras &&
                picks.map((name) => (
                  <li key={name} className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-[#C9A96A] shrink-0 mt-0.5" />
                    <span>{name}</span>
                  </li>
                ))}
            </ul>

            <p className="text-xs text-[#A8B2A1] leading-relaxed">
              Everything can change after your Home Prep Advisor walkthrough.
            </p>

            <div className="space-y-3">
              <button
                onClick={onOpenConsultation}
                className="w-full px-6 py-4 bg-[#C9A96A] hover:bg-[#D4AF37] text-[#0D2226] font-bold text-xs uppercase tracking-widest rounded-xs shadow-lg transition-colors flex items-center justify-center gap-2"
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

      {/* How it unfolds */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6 space-y-8">
        <div className="text-center space-y-2">
          <span className="text-xs font-bold uppercase tracking-widest text-[#0F5C63]">The Seller Process</span>
          <h2 className="font-serif text-3xl sm:text-4xl font-bold text-[#0D2226]">What Happens When You List With Us</h2>
          <p className="text-sm text-[#1C2B2E]/70 max-w-2xl mx-auto">
            Most agents talk about marketing in buzzwords. Here is what actually happens, step by step. Your plan above decides how much of it is included and which extras you add.
          </p>
        </div>
        <div className="space-y-4">
          {STEPS.map((st, idx) => (
            <div key={st.title} className="flex gap-5 bg-[#FAF8F5] border border-[#C9A96A]/30 p-6 rounded-xs">
              <span className="font-serif text-3xl font-bold text-[#C9A96A]/60 shrink-0 w-10">{idx + 1}</span>
              <div className="space-y-1">
                <h3 className="font-serif text-xl font-bold text-[#0D2226]">{st.title}</h3>
                <p className="text-sm text-[#1C2B2E]/80 leading-relaxed">{st.text}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Guarantee + team */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6 grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="bg-[#0D2226] text-[#FAF8F5] p-8 rounded-xs space-y-4 border border-[#C9A96A]/40">
          <h2 className="font-serif text-2xl font-bold">Our Communication Guarantee</h2>
          <p className="text-sm text-[#A8B2A1] leading-relaxed">
            Poor communication is the number one complaint sellers have about their agent. So we guarantee:
          </p>
          <ul className="space-y-2 text-sm">
            {GUARANTEE_POINTS.map((g) => (
              <li key={g} className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-[#C9A96A] shrink-0 mt-0.5" />
                <span>{g}</span>
              </li>
            ))}
          </ul>
        </div>
        <div className="bg-[#FAF8F5] border border-[#C9A96A]/40 p-8 rounded-xs space-y-4">
          <h2 className="font-serif text-2xl font-bold text-[#0D2226]">Your Team, Not Just One Person</h2>
          <p className="text-sm text-[#1C2B2E]/80 leading-relaxed">
            You are not relying on a single overloaded agent. You get:
          </p>
          <ul className="space-y-3">
            {TEAM.map((t) => (
              <li key={t.role} className="text-sm text-[#0D2226]">
                <span className="font-bold">{t.role}.</span> <span className="text-[#1C2B2E]/75">{t.detail}</span>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* Numbers note */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6">
        <div className="bg-[#FAF8F5] border border-[#C9A96A]/40 p-8 rounded-xs space-y-3 text-center">
          <h2 className="font-serif text-2xl font-bold text-[#0D2226]">The Numbers That Matter</h2>
          <p className="text-sm text-[#1C2B2E]/80 leading-relaxed">{PERFORMANCE_NOTE}</p>
        </div>
      </section>

      {/* Easy exit + links */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 text-center space-y-4">
        <div className="inline-flex items-center gap-2 text-sm text-[#0D2226] font-semibold">
          <ShieldCheck className="w-5 h-5 text-[#0F5C63]" />
          <span>{CANCEL_LINE}</span>
        </div>
        <p className="text-xs text-[#1C2B2E]/60">
          Want to know more about Showcase?{' '}
          <Link to="/zillow-showcase" className="text-[#0F5C63] font-bold underline hover:text-[#C9A96A]">
            Read about Zillow Showcase
          </Link>
          .
        </p>
      </section>
    </div>
  );
};
