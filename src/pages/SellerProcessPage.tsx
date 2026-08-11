import React from 'react';
import { Calculator, Phone, CheckCircle2 } from 'lucide-react';
import { usePageMeta } from '../lib/usePageMeta';

interface SellerProcessPageProps {
  onOpenValuation: () => void;
  onOpenConsultation: () => void;
}

export const SellerProcessPage: React.FC<SellerProcessPageProps> = ({ onOpenValuation, onOpenConsultation }) => {
  usePageMeta(
    "What Actually Happens When You List | The Friedman Team",
    "Step by step, here's exactly what happens when you list your home with The Friedman Team, from pre-launch prep to closing day."
  );

  return (
    <div className="pt-28 pb-20 space-y-16">

      <section className="max-w-4xl mx-auto px-4 sm:px-6 text-center space-y-6">
        <span className="text-xs font-bold uppercase tracking-[0.25em] text-[#0F5C63] bg-[#0F5C63]/10 px-4 py-1.5 border border-[#0F5C63]/30 inline-block">
          The Seller Process
        </span>
        <h1 className="font-serif text-4xl sm:text-6xl font-bold text-[#0D2226] leading-tight">
          What Actually Happens When You List With Us
        </h1>
        <p className="text-sm sm:text-base text-[#1C2B2E]/80 max-w-2xl mx-auto leading-relaxed">
          Most agents talk about marketing in buzzwords. Here's what actually happens, step by step, when you list your home with The Friedman Team, so you know exactly what you're getting.
        </p>
      </section>

      <section className="max-w-4xl mx-auto px-4 sm:px-6 space-y-10">

        <div className="bg-[#FAF8F5] border border-[#C9A96A]/30 p-8 rounded-xs space-y-3">
          <h2 className="font-serif text-2xl font-bold text-[#0D2226]">Before We Go Live</h2>
          <p className="text-sm text-[#1C2B2E]/80 leading-relaxed">
            Every listing starts with a "Coming Soon" phase to build early buzz and, when useful, test pricing, paired with a targeted print postcard campaign, professional signage with a QR code for instant lead capture, and a full staging consultation covering decluttering, furniture placement, and virtual staging where it helps a room show better.
          </p>
        </div>

        <div className="bg-[#FAF8F5] border border-[#C9A96A]/30 p-8 rounded-xs space-y-3">
          <h2 className="font-serif text-2xl font-bold text-[#0D2226]">Imagery & Launch</h2>
          <p className="text-sm text-[#1C2B2E]/80 leading-relaxed">
            Professional daytime photography, a full 3D virtual tour, walkthrough video, and floor plans, followed by a coordinated launch across the MLS, Zillow, Redfin, and a dedicated property website built specifically for your home.
          </p>
        </div>

        <div className="bg-[#FAF8F5] border border-[#C9A96A]/30 p-8 rounded-xs space-y-3">
          <h2 className="font-serif text-2xl font-bold text-[#0D2226]">Getting the Word Out</h2>
          <p className="text-sm text-[#1C2B2E]/80 leading-relaxed">
            A targeted email campaign goes to our full network, including past clients, active buyers, and agents across surrounding brokerages, along with a Brokers Open where local agents tour the home in person and receive a social media kit to help push it to their own buyers.
          </p>
        </div>

        <div className="bg-[#FAF8F5] border border-[#C9A96A]/30 p-8 rounded-xs space-y-3">
          <h2 className="font-serif text-2xl font-bold text-[#0D2226]">Paid Reach & Personal Network</h2>
          <p className="text-sm text-[#1C2B2E]/80 leading-relaxed">
            This is where we go further than most: a paid digital and social media campaign puts your home in front of targeted buyers across Maryland, backed by a personal phone campaign to agents and neighbors to surface buyers who haven't seen it online yet.
          </p>
        </div>

        <div className="bg-[#FAF8F5] border border-[#C9A96A]/30 p-8 rounded-xs space-y-3">
          <h2 className="font-serif text-2xl font-bold text-[#0D2226]">Zillow Showcase</h2>
          <p className="text-sm text-[#1C2B2E]/80 leading-relaxed">
            Zillow's premium, AI-powered listing placement gives your home an elevated, immersive design with an interactive floor plan and virtual tour, and it isn't available on every listing.{' '}
            <a href="https://www.zillow.com/premier-agent/showcase/" target="_blank" rel="noopener noreferrer" className="text-[#0F5C63] font-bold underline hover:text-[#C9A96A]">
              See how it works →
            </a>
          </p>
        </div>

        {/*
          "The Numbers That Matter" section - INTENTIONALLY built without
          specific figures for now. The source doc for this page listed
          101.6% list-to-sale, 7-day average days on market, 80,000 views/
          35,000 unique viewers on a listing, and years-of-experience - but
          flagged all of these as unverified (the experience figure alone
          had two conflicting numbers in the source docs: 8 vs 17 years).
          Once Kyle Friedman confirms real, current numbers (and the correct
          reporting period/source), replace the qualitative bullets below
          with the actual figures.
        */}
        <div className="bg-[#0D2226] text-[#FAF8F5] border border-[#C9A96A]/40 p-8 rounded-xs space-y-4">
          <h2 className="font-serif text-2xl font-bold">The Numbers That Matter</h2>
          <p className="text-sm text-[#A8B2A1] leading-relaxed">
            Real performance data from recent listings. Ask Kyle Friedman directly for current, verified numbers on list to sale ratio, average days on market, and listing reach, sourced from Bright MLS for the most recent reporting period.
          </p>
          <ul className="space-y-2 text-sm">
            <li className="flex items-start gap-2">
              <CheckCircle2 className="w-4 h-4 text-[#C9A96A] shrink-0 mt-0.5" />
              <span>Homes consistently priced and positioned to sell at a strong percentage of list price</span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle2 className="w-4 h-4 text-[#C9A96A] shrink-0 mt-0.5" />
              <span>A marketing and pricing approach built to move faster than a passive listing</span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle2 className="w-4 h-4 text-[#C9A96A] shrink-0 mt-0.5" />
              <span>Years of hands-on experience across residential sales and property transactions</span>
            </li>
          </ul>
        </div>

        <div className="bg-[#FAF8F5] border border-[#C9A96A]/30 p-8 rounded-xs space-y-3">
          <h2 className="font-serif text-2xl font-bold text-[#0D2226]">Our Communication Guarantee</h2>
          <p className="text-sm text-[#1C2B2E]/80 leading-relaxed">
            Poor communication is the #1 complaint sellers have about their agent. So we guarantee: feedback within 48 hours of every showing, a weekly call to review activity and pricing, availability for your calls Monday through Saturday, and same day returned calls and emails, often within the hour.
          </p>
        </div>

        <div className="bg-[#FAF8F5] border border-[#C9A96A]/30 p-8 rounded-xs space-y-3">
          <h2 className="font-serif text-2xl font-bold text-[#0D2226]">Your Team, Not Just One Person</h2>
          <p className="text-sm text-[#1C2B2E]/80 leading-relaxed">
            You're not relying on a single overloaded agent. You get a Listing Agent leading strategy and negotiation, a Home Prep Advisor trained to help your home show its best, and a dedicated Transaction Coordinator managing every deadline and document.
          </p>
        </div>

        <div className="bg-[#FAF8F5] border border-[#C9A96A]/30 p-8 rounded-xs space-y-3">
          <h2 className="font-serif text-2xl font-bold text-[#0D2226]">We Never Miss a Buyer Call</h2>
          <p className="text-sm text-[#1C2B2E]/80 leading-relaxed">
            Every sign includes a QR code and a 24-hour info line. Buyers can reach us any time, day or night, and their contact information is captured immediately, so no interested buyer slips through the cracks.
          </p>
        </div>

        {/* "Restrictions apply" per source doc - confirm exact terms with
            Kyle Friedman before this goes live, this is placeholder-safe language
            until confirmed. */}
        <div className="bg-[#FAF8F5] border border-[#C9A96A]/30 p-8 rounded-xs space-y-3">
          <h2 className="font-serif text-2xl font-bold text-[#0D2226]">The Easy Exit Guarantee</h2>
          <p className="text-sm text-[#1C2B2E]/80 leading-relaxed">
            If you're ever not fully satisfied, you can cancel the listing agreement. No lengthy contract, no risk. Ask Kyle Friedman for the full details.
          </p>
        </div>

      </section>

      <section className="max-w-4xl mx-auto px-4 sm:px-6 text-center space-y-6 pt-6">
        <h2 className="font-serif text-2xl sm:text-3xl font-bold text-[#0D2226]">
          Curious what this looks like for your home specifically?
        </h2>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <button
            onClick={onOpenValuation}
            className="px-8 py-4 bg-[#C9A96A] hover:bg-[#D4AF37] text-[#0D2226] font-bold text-xs uppercase tracking-widest rounded-xs shadow-lg transition-colors flex items-center gap-2"
          >
            <Calculator className="w-4 h-4" />
            Get Your Free Home Valuation
          </button>
          <button
            onClick={onOpenConsultation}
            className="px-8 py-4 bg-[#0D2226] hover:bg-[#0F5C63] text-[#FAF8F5] font-bold text-xs uppercase tracking-widest rounded-xs shadow-lg transition-colors flex items-center gap-2"
          >
            <Phone className="w-4 h-4" />
            Schedule a Consultation
          </button>
        </div>
      </section>

    </div>
  );
};
