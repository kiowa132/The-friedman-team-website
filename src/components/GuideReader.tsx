import React, { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  ChevronLeft, ChevronRight, X, Menu, Download,
  Wallet, Users, FileText, Key, DollarSign, MessageCircle,
  ShieldCheck, TrendingUp, Repeat, MapPin, Phone, Calculator,
} from 'lucide-react';
import { GuideContent, GuideSection } from '../types/guide';

const ICONS: Record<string, React.FC<{ className?: string }>> = {
  wallet: Wallet,
  users: Users,
  'file-text': FileText,
  key: Key,
  'dollar-sign': DollarSign,
  'message-circle': MessageCircle,
  'shield-check': ShieldCheck,
  'trending-up': TrendingUp,
  repeat: Repeat,
  'map-pin': MapPin,
};

const Icon: React.FC<{ name: string; className?: string }> = ({ name, className }) => {
  const Cmp = ICONS[name] || FileText;
  return <Cmp className={className} />;
};

interface GuideReaderProps {
  guide: GuideContent;
  onOpenConsultation: () => void;
}

const CTA_ACTION_ICON: Record<string, React.FC<{ className?: string }>> = {
  consultation: Phone,
  'mortgage-calculator': Calculator,
  'affordability-calculator': Calculator,
  listings: MapPin,
};

const CTA_ACTION_HREF: Record<string, string> = {
  'mortgage-calculator': '/calculators/mortgage',
  'affordability-calculator': '/calculators/affordability',
  listings: '/listings',
};

export const GuideReader: React.FC<GuideReaderProps> = ({ guide, onOpenConsultation }) => {
  const [index, setIndex] = useState(0);
  const [tocOpen, setTocOpen] = useState(false);
  const total = guide.sections.length;

  const goTo = (i: number) => setIndex(Math.max(0, Math.min(total - 1, i)));
  const next = () => goTo(index + 1);
  const prev = () => goTo(index - 1);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight') next();
      if (e.key === 'ArrowLeft') prev();
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [index]);

  const ctaForCurrentSection = useMemo(
    () => guide.ctas.find((c) => c.afterSectionIndex === index),
    [guide.ctas, index]
  );

  const sectionLabel = (s: GuideSection, i: number): string => {
    if (s.type === 'cover') return 'Cover';
    if (s.type === 'overview') return s.title;
    if (s.type === 'phase') return s.title;
    if (s.type === 'profile') return s.title;
    return `Section ${i + 1}`;
  };

  return (
    <div className="fixed inset-0 z-50 bg-[#FAF8F5] flex flex-col">
      <div className="shrink-0 border-b border-[#C9A96A]/25 bg-[#FAF8F5]">
        <div className="h-1 bg-[#C9A96A]/15">
          <div
            className="h-full bg-[#C9A96A] transition-all duration-500"
            style={{ width: `${((index + 1) / total) * 100}%` }}
          />
        </div>
        <div className="flex items-center justify-between px-4 sm:px-8 py-3">
          <button onClick={() => setTocOpen(true)} className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-[#1C2B2E]/70 hover:text-[#0F5C63] transition-colors">
            <Menu className="w-4 h-4" /> <span className="hidden sm:inline">Contents</span>
          </button>
          <div className="text-center flex-1 px-4">
            <span className="text-xs font-semibold text-[#1C2B2E]/60 truncate">{guide.title}</span>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-[11px] text-[#1C2B2E]/50 tabular-nums hidden sm:inline">{index + 1} / {total}</span>
            <Link to="/guides" className="w-8 h-8 rounded-full flex items-center justify-center hover:bg-[#0D2226]/5 transition-colors" aria-label="Close guide">
              <X className="w-4 h-4 text-[#1C2B2E]/70" />
            </Link>
          </div>
        </div>
      </div>

      {tocOpen && (
        <div className="fixed inset-0 z-10 flex">
          <div className="absolute inset-0 bg-[#0D2226]/60" onClick={() => setTocOpen(false)} />
          <div className="relative w-full max-w-xs bg-white h-full p-6 overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <span className="text-xs font-bold uppercase tracking-widest text-[#C9A96A]">Table of Contents</span>
              <button onClick={() => setTocOpen(false)}><X className="w-4 h-4" /></button>
            </div>
            <div className="space-y-1">
              {guide.sections.map((s, i) => (
                <button
                  key={i}
                  onClick={() => { goTo(i); setTocOpen(false); }}
                  className={`block w-full text-left px-3 py-2.5 text-sm rounded-xs transition-colors ${i === index ? 'bg-[#0F5C63]/10 text-[#0F5C63] font-semibold' : 'text-[#1C2B2E]/70 hover:bg-[#0D2226]/5'}`}
                >
                  {sectionLabel(s, i)}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      <div className="flex-1 overflow-y-auto">
        <div key={index} className="min-h-full flex flex-col justify-center px-4 sm:px-8 py-12">
          <div className="max-w-4xl mx-auto w-full">
            <SectionRenderer section={guide.sections[index]} />
          </div>

          {ctaForCurrentSection && (
            <div className="max-w-4xl mx-auto w-full mt-10">
              <GuideCtaCard cta={ctaForCurrentSection} onOpenConsultation={onOpenConsultation} />
            </div>
          )}
        </div>
      </div>

      <div className="shrink-0 border-t border-[#C9A96A]/25 bg-[#FAF8F5] px-4 sm:px-8 py-4 flex items-center justify-between">
        <button
          onClick={prev}
          disabled={index === 0}
          className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-widest text-[#1C2B2E]/70 hover:text-[#0F5C63] disabled:opacity-30 disabled:pointer-events-none transition-colors"
        >
          <ChevronLeft className="w-4 h-4" /> Back
        </button>
        {guide.pdfUrl && (
          <a href={guide.pdfUrl} download className="hidden sm:flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-[#0F5C63] hover:text-[#C9A96A] transition-colors">
            <Download className="w-4 h-4" /> Download PDF
          </a>
        )}
        <button
          onClick={next}
          disabled={index === total - 1}
          className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-widest text-[#1C2B2E]/70 hover:text-[#0F5C63] disabled:opacity-30 disabled:pointer-events-none transition-colors"
        >
          Next <ChevronRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};

const GuideCtaCard: React.FC<{ cta: GuideContent['ctas'][0]; onOpenConsultation: () => void }> = ({ cta, onOpenConsultation }) => {
  const CtaIcon = CTA_ACTION_ICON[cta.action] || Phone;
  const href = CTA_ACTION_HREF[cta.action];
  const content = (
    <div className="flex items-center gap-4 bg-[#0F5C63]/8 border border-[#0F5C63]/20 p-5 hover:border-[#0F5C63]/40 transition-colors cursor-pointer">
      <div className="w-10 h-10 rounded-full bg-[#0F5C63]/15 flex items-center justify-center shrink-0">
        <CtaIcon className="w-5 h-5 text-[#0F5C63]" />
      </div>
      <div className="flex-1">
        <div className="text-sm font-bold text-[#0D2226]">{cta.label}</div>
        <div className="text-xs text-[#1C2B2E]/60">{cta.description}</div>
      </div>
      <span className="text-xs font-bold text-[#0F5C63] whitespace-nowrap">{cta.buttonLabel} →</span>
    </div>
  );
  if (href) return <Link to={href}>{content}</Link>;
  return <div onClick={onOpenConsultation}>{content}</div>;
};

const SectionRenderer: React.FC<{ section: GuideSection }> = ({ section }) => {
  switch (section.type) {
    case 'cover':
      return (
        <div className="text-center py-12">
          <span className="text-xs font-bold uppercase tracking-[0.3em] text-[#C9A96A]">{section.eyebrow}</span>
          <h1 className="font-serif text-4xl sm:text-6xl font-bold text-[#0D2226] mt-4 leading-tight">{section.title}</h1>
          <p className="text-lg text-[#1C2B2E]/70 mt-5 max-w-xl mx-auto">{section.subtitle}</p>
          <div className="w-16 h-px bg-[#C9A96A] mx-auto mt-8 mb-6" />
          <p className="text-sm text-[#1C2B2E]/60">{section.meta}</p>
        </div>
      );

    case 'overview':
      return (
        <div>
          <h2 className="font-serif text-3xl sm:text-4xl font-bold text-[#0D2226]">{section.title}</h2>
          <p className="text-base text-[#1C2B2E]/75 leading-relaxed mt-5 max-w-2xl">{section.body}</p>
          <div className="flex flex-wrap gap-6 mt-10">
            {section.phases.map((p, i) => (
              <div key={i} className="flex flex-col items-center gap-3">
                <div className="w-16 h-16 rounded-full bg-[#0F5C63]/10 border-2 border-[#A8B2A1] flex items-center justify-center">
                  <Icon name={p.icon} className="w-6 h-6 text-[#0F5C63]" />
                </div>
                <span className="text-sm font-semibold text-[#0D2226]">{p.label}</span>
              </div>
            ))}
          </div>
        </div>
      );

    case 'phase':
      return (
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-[#0F5C63]/10 text-xs font-bold uppercase tracking-widest text-[#0F5C63] mb-4">
            <Icon name={section.phaseIcon} className="w-3.5 h-3.5" /> {section.phaseLabel}
          </div>
          <h2 className="font-serif text-3xl sm:text-4xl font-bold text-[#0D2226] mb-8">{section.title}</h2>

          {section.layout === 'featured' && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div className="bg-[#C9A96A]/25 border border-[#C9A96A]/40 p-6 sm:row-span-2">
                <div className="text-xs font-bold uppercase tracking-widest text-[#8B7355] mb-2">Step {section.steps[0].number}</div>
                <h3 className="font-serif text-xl font-bold text-[#0D2226] mb-3">{section.steps[0].title}</h3>
                <p className="text-sm text-[#1C2B2E]/75 leading-relaxed">{section.steps[0].body}</p>
              </div>
              <div className="space-y-5">
                {section.steps.slice(1).map((s) => (
                  <div key={s.number}>
                    <div className="text-xs font-bold uppercase tracking-widest text-[#C9A96A] mb-1">Step {s.number}</div>
                    <h3 className="font-serif text-lg font-bold text-[#0D2226] mb-2">{s.title}</h3>
                    <p className="text-sm text-[#1C2B2E]/75 leading-relaxed">{s.body}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {section.layout === 'list' && (
            <div className="space-y-3">
              {section.steps.map((s) => (
                <div key={s.number} className="flex gap-4 bg-[#EFEBE2] border border-[#C9A96A]/25 p-4">
                  <div className="w-8 h-8 rounded-full bg-[#0D2226] text-[#C9A96A] flex items-center justify-center text-sm font-bold shrink-0">{s.number}</div>
                  <div>
                    <h3 className="text-sm font-bold text-[#0D2226]">{s.title}</h3>
                    <p className="text-xs text-[#1C2B2E]/65 mt-0.5">{s.body}</p>
                  </div>
                </div>
              ))}
            </div>
          )}

          {section.layout === 'cards' && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              {section.steps.map((s) => (
                <div key={s.number} className="border-l-4 border-[#A8B2A1] bg-white p-5">
                  <h3 className="font-serif text-base font-bold text-[#0D2226] mb-2">Step {s.number}: {s.title}</h3>
                  <p className="text-sm text-[#1C2B2E]/70 leading-relaxed">{s.body}</p>
                </div>
              ))}
            </div>
          )}

          {section.layout === 'columns' && (
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
              {section.steps.map((s, i) => (
                <div key={s.number}>
                  <div className="text-xs text-[#C9A96A] font-bold mb-1">{String(i + 1).padStart(2, '0')}</div>
                  <div className="w-full h-px bg-[#C9A96A]/40 mb-3" />
                  <h3 className="font-serif text-base font-bold text-[#0D2226] mb-2">Step {s.number}: {s.title}</h3>
                  <p className="text-sm text-[#1C2B2E]/70 leading-relaxed">{s.body}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      );

    case 'callout':
      return (
        <div className="flex items-center gap-3 bg-[#EFEBE2] border border-[#C9A96A]/30 p-5">
          <Icon name={section.icon} className="w-5 h-5 text-[#0F5C63] shrink-0" />
          <p className="text-sm text-[#1C2B2E]/80">{section.body}</p>
        </div>
      );

    case 'profile':
      return (
        <div>
          <h2 className="font-serif text-3xl sm:text-4xl font-bold text-[#0D2226] mb-2">{section.title}</h2>
          <p className="text-base text-[#1C2B2E]/75 mb-8">{section.body}</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 mb-8">
            {section.stats.map((s, i) => (
              <div key={i} className="flex gap-3">
                <Icon name={s.icon} className="w-5 h-5 text-[#C9A96A] shrink-0 mt-0.5" />
                <div>
                  <div className="text-sm font-bold text-[#0D2226]">{s.label}</div>
                  <div className="text-xs text-[#1C2B2E]/65 mt-0.5">{s.body}</div>
                </div>
              </div>
            ))}
          </div>
          {section.disclosure && (
            <p className="text-[11px] text-[#1C2B2E]/45 italic border-t border-[#C9A96A]/20 pt-4">{section.disclosure}</p>
          )}
        </div>
      );

    default:
      return null;
  }
};
