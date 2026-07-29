import React from 'react';
import { ShieldCheck, Key, Search, Compass, MapPin, Building2, Phone, CheckCircle2, ArrowRight } from 'lucide-react';

interface BuyersPageProps {
  onOpenConsultation: () => void;
  setActiveTab: (tab: string) => void;
}

export const BuyersPage: React.FC<BuyersPageProps> = ({
  onOpenConsultation,
  setActiveTab
}) => {
  const buyerPillars = [
    {
      icon: <Key className="w-6 h-6 text-[#C9A96A]" />,
      title: 'Private Off-Market Access',
      description: 'Nearly 30% of high-end estates in Maryland trade off-market. Our private network grants clients access to confidential listings before public MLS broadcast.'
    },
    {
      icon: <Search className="w-6 h-6 text-[#C9A96A]" />,
      title: 'Hyper-Local Market Expertise',
      description: 'Deep knowledge of Carroll, Baltimore, and Howard county enclaves, school clusters, zoning regulations, and agricultural preservation easements.'
    },
    {
      icon: <ShieldCheck className="w-6 h-6 text-[#C9A96A]" />,
      title: 'Fiduciary Negotiation Protection',
      description: 'Rigorous protection during contract drafting, contingency management, structural inspections, and appraisal negotiations.'
    },
    {
      icon: <Compass className="w-6 h-6 text-[#C9A96A]" />,
      title: 'Relocation Advisory Services',
      description: 'Tailored transition guidance for executives, physician groups, and families relocating to Maryland wealth corridors.'
    }
  ];

  return (
    <div className="pt-28 pb-20 space-y-20">
      
      {/* Hero Header */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-6">
        <span className="text-xs font-bold uppercase tracking-[0.25em] text-[#0F5C63] bg-[#0F5C63]/10 px-4 py-1.5 border border-[#0F5C63]/30 inline-block">
          Bespoke Buyer Advisory
        </span>

        <h1 className="font-serif text-4xl sm:text-6xl font-bold text-[#0D2226] max-w-4xl mx-auto leading-tight">
          Unlocking Maryland’s Most Distinctive Properties.
        </h1>

        <p className="text-sm sm:text-base text-[#1C2B2E]/80 max-w-2xl mx-auto font-normal leading-relaxed">
          Acquiring a luxury residence, horse farm, or historic estate requires seasoned advisory, off-market network access, and precise negotiation advocacy.
        </p>

        <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-4">
          <button
            onClick={() => setActiveTab('listings')}
            className="w-full sm:w-auto px-8 py-4 bg-[#0F5C63] hover:bg-[#0D2226] text-[#FAF8F5] font-bold text-xs uppercase tracking-widest rounded-xs transition-colors shadow-lg flex items-center justify-center gap-2"
          >
            <span>Browse Featured Listings</span>
            <ArrowRight className="w-4 h-4 text-[#C9A96A]" />
          </button>

          <button
            onClick={onOpenConsultation}
            className="w-full sm:w-auto px-8 py-4 bg-[#C9A96A] hover:bg-[#D4AF37] text-[#0D2226] font-bold text-xs uppercase tracking-widest rounded-xs transition-colors shadow-xl"
          >
            Schedule Buyer Strategy Call
          </button>
        </div>
      </section>

      {/* Pillars Grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        <div className="text-center max-w-3xl mx-auto space-y-2">
          <span className="text-xs font-bold uppercase tracking-widest text-[#0F5C63]">
            The Buyer Advantage
          </span>
          <h2 className="font-serif text-3xl sm:text-4xl font-bold text-[#0D2226]">
            Why Discerning Buyers Partner with Kyle Friedman
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {buyerPillars.map((p, i) => (
            <div
              key={i}
              className="bg-[#FAF8F5] border border-[#C9A96A]/30 p-8 rounded-xs shadow-md space-y-3 hover:border-[#0F5C63] transition-colors"
            >
              <div className="p-3 bg-[#0D2226] rounded-xs inline-block border border-[#C9A96A]/40">
                {p.icon}
              </div>
              <h3 className="font-serif text-2xl font-bold text-[#0D2226]">
                {p.title}
              </h3>
              <p className="text-xs text-[#1C2B2E]/80 leading-relaxed">
                {p.description}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Off-Market Placement Banner */}
      <section className="bg-[#0D2226] text-[#FAF8F5] py-16 border-y border-[#C9A96A]/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-6">
          <span className="text-xs font-bold uppercase tracking-[0.25em] text-[#C9A96A]">
            Confidential Representation
          </span>
          <h2 className="font-serif text-3xl sm:text-5xl font-bold max-w-3xl mx-auto">
            Seeking Off-Market Farms or Luxury Estates in Carroll or Baltimore County?
          </h2>
          <p className="text-xs sm:text-sm text-[#A8B2A1] max-w-2xl mx-auto leading-relaxed">
            Many of Maryland’s finest properties are never broadcast to public real estate portals. Register your confidential purchasing criteria to receive private placement notifications.
          </p>
          <button
            onClick={onOpenConsultation}
            className="px-8 py-3.5 bg-[#C9A96A] hover:bg-[#D4AF37] text-[#0D2226] font-bold text-xs uppercase tracking-widest rounded-xs transition-colors"
          >
            Register Private Buyer Profile
          </button>
        </div>
      </section>

    </div>
  );
};
