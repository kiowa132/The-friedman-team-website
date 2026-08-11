import React from 'react';
import { Phone } from 'lucide-react';
import { usePageMeta } from '../lib/usePageMeta';

interface TeamPageProps {
  onOpenConsultation: () => void;
}

export const TeamPage: React.FC<TeamPageProps> = ({ onOpenConsultation }) => {
  usePageMeta(
    'Meet the Team | The Friedman Team',
    'Your Listing Agent, Home Prep Advisor, and Transaction Coordinator: the full team behind every Friedman Team sale.'
  );

  return (
    <div className="pt-28 pb-20 bg-[#FAF8F5]">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 space-y-4 text-center mb-16">
        <h1 className="font-serif text-4xl sm:text-5xl font-bold text-[#0D2226]">Your Team</h1>
        <p className="text-sm sm:text-base text-[#1C2B2E]/80 leading-relaxed">
          Your team is tremendously important. No single person can deliver the care and results you deserve.
        </p>
      </div>

      <div className="max-w-3xl mx-auto px-4 sm:px-6 space-y-14">

        <div className="grid grid-cols-1 sm:grid-cols-12 gap-6 items-start">
          <div className="sm:col-span-3">
            <div className="aspect-square rounded-full overflow-hidden border-2 border-[#C9A96A] shadow-md">
              <img src="/images/kyle-portrait.jpg" alt="Kyle Friedman" className="w-full h-full object-cover" />
            </div>
          </div>
          <div className="sm:col-span-9 space-y-2">
            <h2 className="font-serif text-2xl font-bold text-[#0D2226]">Listing Agent</h2>
            <p className="text-sm text-[#1C2B2E]/80 leading-relaxed">
              Your Listing Agent leads the team, ensuring success throughout the entire process. This includes collaboration with the rest of the team and providing advice and guidance at each step. Your Listing Agent negotiates every point of the contract on your behalf.
            </p>
            <p className="text-xs font-bold text-[#0F5C63]">Kyle Friedman, The Friedman Team</p>
          </div>
        </div>

        {/*
          Home Prep Advisor and Transaction Coordinator below use a generic
          placeholder icon, not a fabricated photo - Kyle Friedman doesn't currently
          have named people filling these specific roles. If he brings on a
          stager, contractor, or transaction coordinator he works with
          regularly, swap in their real photo and name here.
        */}
        <div className="grid grid-cols-1 sm:grid-cols-12 gap-6 items-start">
          <div className="sm:col-span-3">
            <div className="aspect-square rounded-full bg-[#0D2226]/5 border-2 border-[#C9A96A]/30 flex items-center justify-center">
              <span className="font-serif text-3xl text-[#C9A96A]/50">?</span>
            </div>
          </div>
          <div className="sm:col-span-9 space-y-2">
            <h2 className="font-serif text-2xl font-bold text-[#0D2226]">Home Prep Advisor</h2>
            <p className="text-sm text-[#1C2B2E]/80 leading-relaxed">
              Your Home Prep Advisor makes recommendations for preparing your home for the market. An initial impression is a lasting one, and your Home Prep Advisor helps your home show its best to create a genuine emotional response from buyers.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-12 gap-6 items-start">
          <div className="sm:col-span-3">
            <div className="aspect-square rounded-full bg-[#0D2226]/5 border-2 border-[#C9A96A]/30 flex items-center justify-center">
              <span className="font-serif text-3xl text-[#C9A96A]/50">?</span>
            </div>
          </div>
          <div className="sm:col-span-9 space-y-2">
            <h2 className="font-serif text-2xl font-bold text-[#0D2226]">Transaction Coordinator</h2>
            <p className="text-sm text-[#1C2B2E]/80 leading-relaxed">
              A real estate contract contains dozens of pages of legal guidelines. Your Transaction Coordinator makes sure every party complies with every obligation, on time, from the beginning of the process through closing.
            </p>
          </div>
        </div>

      </div>

      <div className="max-w-3xl mx-auto px-4 sm:px-6 text-center pt-16">
        <button
          onClick={onOpenConsultation}
          className="inline-flex items-center gap-2 px-8 py-4 bg-[#0D2226] hover:bg-[#0F5C63] text-[#FAF8F5] font-bold text-xs uppercase tracking-widest rounded-xs shadow-lg transition-colors"
        >
          <Phone className="w-4 h-4" />
          Schedule a Consultation
        </button>
      </div>
    </div>
  );
};
