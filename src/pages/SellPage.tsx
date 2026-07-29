import React from 'react';
import { Calculator, ShieldCheck, Camera, Sparkles, Globe, DollarSign, BarChart3, ArrowRight, CheckCircle2 } from 'lucide-react';

interface SellPageProps {
  onOpenValuation: () => void;
  onOpenConsultation: () => void;
}

export const SellPage: React.FC<SellPageProps> = ({
  onOpenValuation,
  onOpenConsultation
}) => {
  const pillars = [
    {
      num: '01',
      title: 'Strategic Pricing Analysis',
      icon: <BarChart3 className="w-6 h-6 text-[#C9A96A]" />,
      description: 'We go beyond basic MLS comps. Our valuation model evaluates hyper-local absorption rates, land preservation easements, equestrian capital value, and historical seasonal buyers.'
    },
    {
      num: '02',
      title: 'Professional Cinema & Drone Production',
      icon: <Camera className="w-6 h-6 text-[#C9A96A]" />,
      description: 'High-net-worth buyers purchase narratives. We deploy architectural cinema, twilight photography, 4K aerial drone mapping, and Matterport 3D virtual walkthroughs.'
    },
    {
      num: '03',
      title: 'Luxury Marketing Campaign',
      icon: <Sparkles className="w-6 h-6 text-[#C9A96A]" />,
      description: 'Bespoke print editorial brochures, targeted architectural publications, and custom social storytelling designed to showcase your home like a fine art collectible.'
    },
    {
      num: '04',
      title: 'Targeted Digital & Private Network Exposure',
      icon: <Globe className="w-6 h-6 text-[#C9A96A]" />,
      description: 'Algorithmic digital targeting reaches high-earning relocations from D.C., New York, and international wealth corridors, alongside discrete off-market previews.'
    },
    {
      num: '05',
      title: 'Negotiation Strategy & Asset Protection',
      icon: <ShieldCheck className="w-6 h-6 text-[#C9A96A]" />,
      description: 'Fiduciary advocacy designed to protect your purchase price, minimize inspection vulnerabilities, and secure non-refundable earnest deposits.'
    },
    {
      num: '06',
      title: 'Real-Time Market Intelligence',
      icon: <DollarSign className="w-6 h-6 text-[#C9A96A]" />,
      description: 'Continuous monitoring of competing inventory, interest rate shifts, and local market sentiment to adjust positioning dynamically during launch windows.'
    }
  ];

  return (
    <div className="pt-28 pb-20 space-y-20">
      
      {/* Hero Header */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-6">
        <span className="text-xs font-bold uppercase tracking-[0.25em] text-[#0F5C63] bg-[#0F5C63]/10 px-4 py-1.5 border border-[#0F5C63]/30 inline-block">
          Fiduciary Seller Advisory
        </span>

        <h1 className="font-serif text-4xl sm:text-6xl font-bold text-[#0D2226] max-w-4xl mx-auto leading-tight">
          The Difference Between Listing a Home and Selling It Strategically.
        </h1>

        <p className="text-sm sm:text-base text-[#1C2B2E]/80 max-w-2xl mx-auto font-normal leading-relaxed">
          In Maryland’s luxury and rural estate markets, maximum net proceeds are achieved through strategic launch timing, architectural narrative, and targeted high-net-worth exposure.
        </p>

        <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-4">
          <button
            onClick={onOpenValuation}
            id="sell-valuation-cta"
            className="w-full sm:w-auto px-8 py-4 bg-[#C9A96A] hover:bg-[#D4AF37] text-[#0D2226] font-bold text-xs uppercase tracking-widest rounded-xs shadow-xl transition-all flex items-center justify-center gap-2"
          >
            <Calculator className="w-4 h-4" />
            <span>Request Your Complimentary Home Valuation</span>
          </button>

          <button
            onClick={onOpenConsultation}
            className="w-full sm:w-auto px-8 py-4 bg-[#0F5C63] hover:bg-[#0D2226] text-[#FAF8F5] font-bold text-xs uppercase tracking-widest rounded-xs transition-colors shadow-lg"
          >
            Schedule Seller Strategy Session
          </button>
        </div>
      </section>

      {/* 6 Strategic Pillars Grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        <div className="text-center max-w-3xl mx-auto space-y-2">
          <span className="text-xs font-bold uppercase tracking-widest text-[#0F5C63]">
            Our Seller Framework
          </span>
          <h2 className="font-serif text-3xl sm:text-4xl font-bold text-[#0D2226]">
            The 6 Pillars of Strategic Home Representation
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
                  <span>Basic iPhone photos or low-budget photography</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-red-400 font-bold">✕</span>
                  <span>Generic automated pricing based strictly on ZIP code averages</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-red-400 font-bold">✕</span>
                  <span>Passive reliance on standard MLS syndication</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-red-400 font-bold">✕</span>
                  <span>Unscreened public open houses</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-red-400 font-bold">✕</span>
                  <span>Standard reactive negotiation during inspection phases</span>
                </li>
              </ul>
            </div>

            {/* Friedman Strategic */}
            <div className="bg-[#0F5C63] border border-[#C9A96A] p-8 rounded-xs space-y-4 shadow-2xl relative">
              <span className="absolute -top-3 right-6 bg-[#C9A96A] text-[#0D2226] text-[10px] font-bold uppercase px-3 py-1">
                The Friedman Standard
              </span>

              <h3 className="font-serif text-xl font-bold text-[#FAF8F5] border-b border-[#C9A96A]/30 pb-3">
                Friedman Strategic Representation
              </h3>
              <ul className="space-y-3 text-xs text-[#FAF8F5]">
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-[#C9A96A] shrink-0 mt-0.5" />
                  <span>Cinematic 4K drone, Matterport 3D & twilight architectural photography</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-[#C9A96A] shrink-0 mt-0.5" />
                  <span>Custom land easement & equestrian valuation modeling</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-[#C9A96A] shrink-0 mt-0.5" />
                  <span>Targeted digital placement reaching out-of-state wealth migration</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-[#C9A96A] shrink-0 mt-0.5" />
                  <span>Pre-vetted private previews & discrete off-market placement option</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-[#C9A96A] shrink-0 mt-0.5" />
                  <span>Fiduciary negotiation strategy driving structured competitive offer windows</span>
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
            Ready to Discover Your Home’s Strategic Market Valuation?
          </h2>
          <p className="text-xs sm:text-sm text-[#1C2B2E]/80 max-w-xl mx-auto">
            Take 2 minutes to enter your property details for an instant preliminary market calculation and request a 1-on-1 confidential valuation review with Kyle Friedman.
          </p>
          <button
            onClick={onOpenValuation}
            className="px-8 py-4 bg-[#C9A96A] hover:bg-[#D4AF37] text-[#0D2226] font-bold text-xs uppercase tracking-widest rounded-xs shadow-lg transition-colors"
          >
            Request Complimentary Home Valuation
          </button>
        </div>
      </section>

    </div>
  );
};
