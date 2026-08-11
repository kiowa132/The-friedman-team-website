import React from 'react';
import { Link } from 'react-router-dom';
import { Calculator, ShieldCheck, Camera, Sparkles, Globe, DollarSign, BarChart3, ArrowRight, CheckCircle2 } from 'lucide-react';
import { usePageMeta } from '../lib/usePageMeta';

interface SellPageProps {
  onOpenValuation: () => void;
  onOpenConsultation: () => void;
}

export const SellPage: React.FC<SellPageProps> = ({
  onOpenValuation,
  onOpenConsultation
}) => {
  usePageMeta(
    'Sell Your Home in Carroll or Baltimore County, MD | The Friedman Team',
    'Get a data-driven pricing strategy and marketing plan to sell your home for more in Carroll, Howard, Frederick, or Baltimore County.'
  );

  const pillars = [
    {
      num: '01',
      title: 'Data-Backed Pricing Strategy',
      icon: <BarChart3 className="w-6 h-6 text-[#C9A96A]" />,
      description: 'A pricing strategy built from real comparable sales and current market trends, with scenarios laid out so you know your actual options, not a single guess.'
    },
    {
      num: '02',
      title: 'Professional Photography & Marketing',
      icon: <Camera className="w-6 h-6 text-[#C9A96A]" />,
      description: 'Professional photography and a marketing plan built for how buyers actually search today, not just an MLS entry and a sign in the yard.'
    },
    {
      num: '03',
      title: 'Multi-Platform Launch',
      icon: <Sparkles className="w-6 h-6 text-[#C9A96A]" />,
      description: 'Coordinated launch across the MLS, Zillow, Redfin, and a dedicated property website built specifically for your home.'
    },
    {
      num: '04',
      title: 'Network & Targeted Reach',
      icon: <Globe className="w-6 h-6 text-[#C9A96A]" />,
      description: 'A targeted email campaign to our network of past clients and active buyers, paired with digital reach designed to put your home in front of the right people.'
    },
    {
      num: '05',
      title: 'Negotiation That Protects You',
      icon: <ShieldCheck className="w-6 h-6 text-[#C9A96A]" />,
      description: 'Every point of the contract, including price, terms, and contingencies, negotiated with your equity and your outcome in mind.'
    },
    {
      num: '06',
      title: 'Clear, Responsive Communication',
      icon: <DollarSign className="w-6 h-6 text-[#C9A96A]" />,
      description: "Straightforward updates from listing to closing, so you always know exactly where things stand. No guessing, no silence."
    }
  ];

  return (
    <div className="pt-28 pb-20 space-y-20">
      
      {/* Hero Header */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-6">
        <span className="text-xs font-bold uppercase tracking-[0.25em] text-[#0F5C63] bg-[#0F5C63]/10 px-4 py-1.5 border border-[#0F5C63]/30 inline-block">
          For Sellers
        </span>

        <h1 className="font-serif text-4xl sm:text-6xl font-bold text-[#0D2226] max-w-4xl mx-auto leading-tight">
          Sell for More, With a Strategy Behind Every Decision
        </h1>

        <p className="text-sm sm:text-base text-[#1C2B2E]/80 max-w-2xl mx-auto font-normal leading-relaxed">
          Pricing a home isn't a formula. It's a strategy. The Friedman Team starts with real comparable data and market trends, then builds a marketing plan and negotiation approach designed to bring the right buyers and the strongest offers. From condos and townhomes to single-family homes, every listing gets professional photography, a clear pricing strategy, and a plan for where buyers are actually looking.
        </p>

        <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-4">
          <button
            onClick={onOpenValuation}
            id="sell-valuation-cta"
            className="w-full sm:w-auto px-8 py-4 bg-[#C9A96A] hover:bg-[#D4AF37] text-[#0D2226] font-bold text-xs uppercase tracking-widest rounded-xs shadow-xl transition-all flex items-center justify-center gap-2"
          >
            <Calculator className="w-4 h-4" />
            <span>Get Your Free Home Valuation</span>
          </button>

          <button
            onClick={onOpenConsultation}
            className="w-full sm:w-auto px-8 py-4 bg-[#0F5C63] hover:bg-[#0D2226] text-[#FAF8F5] font-bold text-xs uppercase tracking-widest rounded-xs transition-colors shadow-lg"
          >
            Schedule Seller Strategy Session
          </button>
        </div>

        <div className="pt-4 flex items-center justify-center gap-2 text-xs text-[#1C2B2E]/60">
          <ShieldCheck className="w-4 h-4 text-[#0F5C63]" />
          <span>Cancel your listing agreement any time. No lengthy contract, no risk.</span>
        </div>
      </section>

      {/* 6 Strategic Pillars Grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        <div className="text-center max-w-3xl mx-auto space-y-2">
          <span className="text-xs font-bold uppercase tracking-widest text-[#0F5C63]">
            How We Sell Your Home
          </span>
          <h2 className="font-serif text-3xl sm:text-4xl font-bold text-[#0D2226]">
            A Strategy Behind Every Step
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {pillars.map((p, i) => (
            <div
              key={i}
              className="bg-[#FAF8F5] border border-[#C9A96A]/30 p-8 rounded-xs shadow-md space-y-4 relative group hover:border-[#0F5C63] transition-all"
            >
              <div className="flex items-center justify-between">
                <div className="p-3 bg-[#0D2226] rounded-xs border border-[#C9A96A]/40">
                  {p.icon}
                </div>
                <span className="font-serif text-3xl font-bold text-[#C9A96A]/40">
                  {p.num}
                </span>
              </div>

              <h3 className="font-serif text-xl font-bold text-[#0D2226]">
                {p.title}
              </h3>

              <p className="text-xs text-[#1C2B2E]/80 leading-relaxed font-normal">
                {p.description}
              </p>
            </div>
          ))}
        </div>

        <div className="text-center pt-2">
          <Link
            to="/sell/marketing-strategy"
            className="inline-flex items-center gap-2 text-sm font-bold text-[#0F5C63] hover:text-[#C9A96A] transition-colors border-b border-[#0F5C63]/40 pb-1"
          >
            <span>See Exactly What Happens, Step by Step, When You List With Us</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </section>

      {/* Comparison Section: Traditional vs. Friedman Strategic */}
      <section className="bg-[#0D2226] text-[#FAF8F5] py-20 border-y border-[#C9A96A]/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          
          <div className="text-center max-w-3xl mx-auto space-y-2">
            <span className="text-xs font-bold uppercase tracking-widest text-[#C9A96A]">
              Execution Matters
            </span>
            <h2 className="font-serif text-3xl sm:text-4xl font-bold text-[#FAF8F5]">
              Traditional Agent vs. Friedman Strategic Launch
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            
            {/* Traditional Agent */}
            <div className="bg-[#1A2E33] border border-[#FAF8F5]/10 p-8 rounded-xs space-y-4">
              <h3 className="font-serif text-xl font-bold text-[#FAF8F5]/60 border-b border-[#FAF8F5]/10 pb-3">
                Traditional Real Estate Approach
              </h3>
              <ul className="space-y-3 text-xs text-[#A8B2A1]">
                <li className="flex items-start gap-2">
                  <span className="text-red-400 font-bold">✕</span>
                  <span>Basic phone photos or low-budget photography</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-red-400 font-bold">✕</span>
                  <span>Generic automated pricing based strictly on ZIP code averages</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-red-400 font-bold">✕</span>
                  <span>Passive reliance on standard MLS syndication alone</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-red-400 font-bold">✕</span>
                  <span>Unscreened public open houses</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-red-400 font-bold">✕</span>
                  <span>Reactive negotiation only once an offer comes in</span>
                </li>
              </ul>
            </div>

            {/* Friedman Strategic */}
            <div className="bg-[#0F5C63] border border-[#C9A96A] p-8 rounded-xs space-y-4 shadow-2xl relative">
              <span className="absolute -top-3 right-6 bg-[#C9A96A] text-[#0D2226] text-[10px] font-bold uppercase px-3 py-1">
                The Friedman Standard
              </span>

              <h3 className="font-serif text-xl font-bold text-[#FAF8F5] border-b border-[#C9A96A]/30 pb-3">
                The Friedman Team Approach
              </h3>
              <ul className="space-y-3 text-xs text-[#FAF8F5]">
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-[#C9A96A] shrink-0 mt-0.5" />
                  <span>Professional photography built for how buyers search today</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-[#C9A96A] shrink-0 mt-0.5" />
                  <span>Pricing grounded in real comps, not a ZIP-code average</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-[#C9A96A] shrink-0 mt-0.5" />
                  <span>Coordinated launch across MLS, Zillow, Redfin, and your own property site</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-[#C9A96A] shrink-0 mt-0.5" />
                  <span>Off-market and coming-soon exposure where it makes sense</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-[#C9A96A] shrink-0 mt-0.5" />
                  <span>A negotiation strategy in place before an offer ever comes in</span>
                </li>
              </ul>
            </div>

          </div>

        </div>
      </section>

      {/* Final Valuation CTA */}
      <section className="max-w-5xl mx-auto px-4 text-center space-y-6">
        <div className="bg-[#FAF8F5] border border-[#C9A96A] p-10 rounded-xs shadow-xl space-y-4">
          <h2 className="font-serif text-3xl font-bold text-[#0D2226]">
            Curious What Your Home Is Worth in Today's Market?
          </h2>
          <p className="text-xs sm:text-sm text-[#1C2B2E]/80 max-w-xl mx-auto">
            Tell Kyle Friedman a bit about your property, and he'll personally follow up with a real comparative market analysis built from current comps, not an automated guess.
          </p>
          <button
            onClick={onOpenValuation}
            className="px-8 py-4 bg-[#C9A96A] hover:bg-[#D4AF37] text-[#0D2226] font-bold text-xs uppercase tracking-widest rounded-xs shadow-lg transition-colors"
          >
            Get Your Free Home Valuation
          </button>
        </div>
      </section>

    </div>
  );
};
