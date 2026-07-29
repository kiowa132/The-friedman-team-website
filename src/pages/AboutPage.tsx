import React from 'react';
import { ShieldCheck, Award, CheckCircle2, Phone, Calendar, ArrowRight, Compass, MapPin, Building2, Landmark, GraduationCap } from 'lucide-react';

interface AboutPageProps {
  onOpenConsultation: () => void;
  setActiveTab: (tab: string) => void;
}

export const AboutPage: React.FC<AboutPageProps> = ({
  onOpenConsultation,
  setActiveTab
}) => {
  const specializations = [
    {
      title: 'Luxury Homes & Residences',
      description: 'Strategic representation for distinctive estates, custom architectural homes, and high-end suburban sanctuaries.'
    },
    {
      title: 'Farms, Acreage & Estates',
      description: 'Deep technical knowledge of Maryland land preservation, MALPF easements, equestrian facilities, and agricultural zoning.'
    },
    {
      title: 'Strategic Marketing & Production',
      description: 'Cinematic drone video, architectural photography, targeted digital exposure to out-of-state buyers, and press placements.'
    },
    {
      title: 'Master Negotiation & Protection',
      description: 'Protecting seller equity through disciplined offer structures, contract contingencies, and fiduciary advocacy.'
    },
    {
      title: 'Discreet Off-Market Placement',
      description: 'Private listing distribution to ultra-high-net-worth buyer networks without public MLS broadcasting when desired.'
    }
  ];

  const timelineMilestones = [
    {
      year: '2016',
      title: 'Foundations in Maryland Real Estate',
      description: 'Began real estate career with a focus on land development, farm acquisitions, and residential representation in Carroll County.'
    },
    {
      year: '2019',
      title: 'Establishment of The Friedman Team',
      description: 'Expanded team coverage into Baltimore County’s Green Spring Valley and Howard County’s Fulton luxury corridors.'
    },
    {
      year: '2022',
      title: 'eXp Realty Partnership & Global Reach',
      description: 'Partnered with eXp Realty to leverage cloud technology, international buyer networks, and proprietary digital tools.'
    },
    {
      year: '2025 - Present',
      title: '$150M+ Sales Volume Milestone',
      description: 'Recognized among top 1% luxury advisors in Maryland, representing generational horse farms, historic manors, and luxury estates.'
    }
  ];

  return (
    <div className="pt-28 pb-20 space-y-20">
      
      {/* Hero Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-[#0D2226] text-[#FAF8F5] border border-[#C9A96A]/40 p-8 sm:p-14 rounded-xs shadow-2xl grid grid-cols-1 lg:grid-cols-12 gap-10 items-center relative overflow-hidden">
          
          <div className="lg:col-span-7 space-y-6 z-10">
            <span className="text-xs font-bold uppercase tracking-[0.25em] text-[#C9A96A] bg-[#0F5C63] px-3.5 py-1 border border-[#C9A96A]/30 inline-block">
              Fiduciary Leadership & Advisory
            </span>

            <h1 className="font-serif text-4xl sm:text-6xl font-bold tracking-tight text-[#FAF8F5]">
              Kyle Friedman
            </h1>

            <p className="text-sm sm:text-base text-[#A8B2A1] font-light leading-relaxed">
              Principal Advisor • The Friedman Team • eXp Realty
            </p>

            <p className="text-xs sm:text-sm text-[#FAF8F5]/90 leading-relaxed font-normal pt-2">
              "My objective is simple: to deliver strategic clarity, uncompromising negotiation, and exceptional financial outcomes for Maryland homeowners. Real estate is not merely a transaction—it is a critical wealth event that demands bespoke execution."
            </p>

            <div className="pt-4 flex flex-wrap items-center gap-4">
              <button
                onClick={onOpenConsultation}
                id="about-consult-btn"
                className="px-8 py-3.5 bg-[#C9A96A] hover:bg-[#D4AF37] text-[#0D2226] font-bold text-xs uppercase tracking-widest rounded-xs transition-all shadow-lg flex items-center gap-2"
              >
                <Phone className="w-4 h-4" />
                <span>Schedule a Private Consultation</span>
              </button>
            </div>
          </div>

          <div className="lg:col-span-5 relative z-10">
            <div className="relative rounded-xs overflow-hidden border-2 border-[#C9A96A] aspect-[4/5] shadow-2xl">
              <img
                src="/images/kyle-portrait.jpg"
                alt="Kyle Friedman Real Estate Advisor"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#0D2226]/80 via-transparent to-transparent" />
            </div>
          </div>

        </div>
      </section>

      {/* Specialization Areas */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        <div className="text-center max-w-3xl mx-auto space-y-3">
          <span className="text-xs font-bold uppercase tracking-widest text-[#0F5C63]">
            Core Competencies
          </span>
          <h2 className="font-serif text-3xl sm:text-4xl font-bold text-[#0D2226]">
            Areas of Strategic Advisory Specialization
          </h2>
          <p className="text-sm text-[#1C2B2E]/80">
            Expertise tailored specifically for high-net-worth residential and agricultural markets in Maryland.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {specializations.map((spec, i) => (
            <div
              key={i}
              className="bg-[#FAF8F5] border border-[#C9A96A]/30 p-6 rounded-xs shadow-md space-y-3 hover:border-[#0F5C63] transition-colors"
            >
              <div className="w-10 h-10 bg-[#0F5C63] text-[#C9A96A] flex items-center justify-center rounded-xs font-serif font-bold">
                0{i + 1}
              </div>
              <h3 className="font-serif text-xl font-bold text-[#0D2226]">
                {spec.title}
              </h3>
              <p className="text-xs text-[#1C2B2E]/80 leading-relaxed">
                {spec.description}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Mission Statement & Values */}
      <section className="bg-[#0D2226] text-[#FAF8F5] py-16 border-y border-[#C9A96A]/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          
          <div className="max-w-4xl mx-auto text-center space-y-4">
            <span className="text-xs font-bold uppercase tracking-[0.25em] text-[#C9A96A]">
              Our Guiding Principles
            </span>
            <h2 className="font-serif text-3xl sm:text-5xl font-bold text-[#FAF8F5]">
              Mission & Fiduciary Commitment
            </h2>
            <p className="text-sm sm:text-base text-[#A8B2A1] font-light leading-relaxed">
              "To advise every client with the same rigour, privacy, and dedication required for a major corporate transaction. We treat your property equity as our absolute fiduciary responsibility."
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 text-center">
            <div className="p-6 bg-[#1A2E33] border border-[#FAF8F5]/10 rounded-xs space-y-2">
              <ShieldCheck className="w-8 h-8 text-[#C9A96A] mx-auto" />
              <h4 className="font-serif font-bold text-lg text-[#FAF8F5]">Fiduciary Duty</h4>
              <p className="text-xs text-[#A8B2A1]">Unwavering loyalty to client financial interests above all else.</p>
            </div>

            <div className="p-6 bg-[#1A2E33] border border-[#FAF8F5]/10 rounded-xs space-y-2">
              <Landmark className="w-8 h-8 text-[#C9A96A] mx-auto" />
              <h4 className="font-serif font-bold text-lg text-[#FAF8F5]">Discreet Privacy</h4>
              <p className="text-xs text-[#A8B2A1]">Protecting public exposure for high-profile estate sales.</p>
            </div>

            <div className="p-6 bg-[#1A2E33] border border-[#FAF8F5]/10 rounded-xs space-y-2">
              <Award className="w-8 h-8 text-[#C9A96A] mx-auto" />
              <h4 className="font-serif font-bold text-lg text-[#FAF8F5]">Market Rigour</h4>
              <p className="text-xs text-[#A8B2A1]">Wall Street-grade analysis of historical comps & micro-trends.</p>
            </div>

            <div className="p-6 bg-[#1A2E33] border border-[#FAF8F5]/10 rounded-xs space-y-2">
              <Compass className="w-8 h-8 text-[#C9A96A] mx-auto" />
              <h4 className="font-serif font-bold text-lg text-[#FAF8F5]">Local Mastery</h4>
              <p className="text-xs text-[#A8B2A1]">Deep ties to Carroll, Baltimore, and Howard county communities.</p>
            </div>
          </div>

        </div>
      </section>

      {/* Timeline Section */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="text-center space-y-2">
          <span className="text-xs font-bold uppercase tracking-widest text-[#0F5C63]">
            Track Record
          </span>
          <h2 className="font-serif text-3xl font-bold text-[#0D2226]">
            Milestones of Excellence
          </h2>
        </div>

        <div className="space-y-6">
          {timelineMilestones.map((m, idx) => (
            <div key={idx} className="bg-[#FAF8F5] border border-[#C9A96A]/30 p-6 rounded-xs flex flex-col sm:flex-row items-start gap-4 shadow-sm">
              <div className="bg-[#0F5C63] text-[#C9A96A] font-serif font-bold text-xl px-4 py-2 rounded-xs shrink-0">
                {m.year}
              </div>
              <div className="space-y-1">
                <h3 className="font-serif text-xl font-bold text-[#0D2226]">{m.title}</h3>
                <p className="text-xs text-[#1C2B2E]/80 leading-relaxed">{m.description}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* CTA Footer Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <div className="bg-[#0F5C63] text-[#FAF8F5] p-10 rounded-xs shadow-2xl space-y-4 border border-[#C9A96A]/40">
          <h2 className="font-serif text-3xl font-bold">
            Ready to Discuss Your Maryland Real Estate Goals?
          </h2>
          <p className="text-xs sm:text-sm text-[#FAF8F5]/90 max-w-xl mx-auto">
            Schedule a 1-on-1 confidential strategy session with Kyle Friedman to analyze your home valuation or discuss property purchasing options.
          </p>
          <button
            onClick={onOpenConsultation}
            className="px-8 py-3.5 bg-[#C9A96A] hover:bg-[#D4AF37] text-[#0D2226] font-bold text-xs uppercase tracking-widest rounded-xs transition-colors"
          >
            Request Private Advisory Session
          </button>
        </div>
      </section>

    </div>
  );
};
