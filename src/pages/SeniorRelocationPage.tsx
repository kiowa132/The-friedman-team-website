import React from 'react';
import { Link } from 'react-router-dom';
import { Home, PaintRoller, Handshake, Truck, Users2, Phone } from 'lucide-react';
import { usePageMeta } from '../lib/usePageMeta';

interface SeniorRelocationPageProps {
  onOpenConsultation: () => void;
}

// Real service commitments, matching what's shown in Kyle's own
// commissioned infographic - not a claimed formal certification (SRES or
// similar), since that hasn't been confirmed. See the note on the
// Luxury page for the same reasoning.
export const SeniorRelocationPage: React.FC<SeniorRelocationPageProps> = ({ onOpenConsultation }) => {
  usePageMeta(
    'Senior Relocation Services | The Friedman Team',
    'A thoughtful, expertly handled transition for homeowners downsizing or relocating later in life - right-sizing guidance, home preparation, sale strategy, and coordinated moving support.'
  );

  const services = [
    { icon: Home, title: 'Right-Sizing & Downsizing', description: 'Helping determine what comes next and preparing for the transition.' },
    { icon: PaintRoller, title: 'Home Preparation', description: 'Strategic guidance on repairs, updates, organization, and preparing your home for market.' },
    { icon: Handshake, title: 'Sale & Negotiation', description: 'Professional pricing, marketing, showings, and negotiation to maximize your home\u2019s value.' },
    { icon: Truck, title: 'Coordinated Relocation', description: 'Helping coordinate the moving process and keeping the transition organized from start to finish.' },
    { icon: Users2, title: 'Family Communication', description: 'Keeping everyone informed and helping families navigate important decisions together.' },
  ];

  const journey = [
    { title: 'Longtime Home', description: 'A place filled with memories.' },
    { title: 'The Transition', description: 'Guidance, support, and a clear plan.' },
    { title: 'A New Chapter', description: 'A fresh start. A new beginning.' },
  ];

  return (
    <div className="bg-[#FAF8F5]">

      {/* Hero banner - Kyle's own commissioned graphic */}
      <div className="max-w-5xl mx-auto px-4 sm:px-6 pt-32">
        <img
          src="/images/senior-relocation/banner-crop.jpg"
          alt="Senior Relocation Services - The Friedman Team"
          className="w-full h-auto rounded-sm shadow-lg"
        />
      </div>

      {/* Intro */}
      <div className="max-w-3xl mx-auto px-4 sm:px-6 pt-16 text-center">
        <p className="text-base sm:text-lg text-[#1C2B2E]/80 leading-relaxed font-light">
          Leaving a longtime home is more than a real estate transaction. It's a major life transition, and it deserves a process that respects that. Kyle works with homeowners and their families to make right-sizing and later-life relocation as thoughtful and unhurried as it needs to be.
        </p>
      </div>

      {/* Five services */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-16">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-8">
          {services.map((s) => (
            <div key={s.title} className="text-center">
              <div className="w-14 h-14 rounded-full border border-[#C9A96A]/40 flex items-center justify-center mx-auto text-[#0F5C63]">
                <s.icon className="w-6 h-6" />
              </div>
              <h3 className="font-serif text-sm font-bold text-[#0D2226] mt-4 uppercase tracking-wide">{s.title}</h3>
              <p className="text-xs text-[#1C2B2E]/65 leading-relaxed mt-2">{s.description}</p>
            </div>
          ))}
        </div>
      </div>

      {/* The journey */}
      <div className="bg-[#0D2226] py-20">
        <div className="max-w-5xl mx-auto px-4 sm:px-6">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            {journey.map((j) => (
              <div key={j.title} className="bg-[#1A2E33] border border-[#C9A96A]/25 p-7 text-center">
                <h3 className="font-serif text-lg font-bold text-[#FAF8F5] uppercase tracking-wide">{j.title}</h3>
                <p className="text-sm text-[#F5F1E8]/70 italic mt-2">{j.description}</p>
              </div>
            ))}
          </div>
          <p className="font-serif italic text-lg text-[#C9A96A] text-center mt-12">
            More than a move. A plan for what's next.
          </p>
        </div>
      </div>

      {/* Full infographic, for anyone who wants the complete overview */}
      <div className="max-w-3xl mx-auto px-4 sm:px-6 py-20">
        <img src="/images/senior-relocation/full-infographic.jpg" alt="The Friedman Team Senior Relocation Services overview" className="w-full rounded-sm shadow-lg" />
      </div>

      {/* CTA */}
      <div className="max-w-3xl mx-auto px-4 sm:px-6 pb-24 text-center">
        <h2 className="font-serif text-2xl font-bold text-[#0D2226]">Let's Talk Through Your Timeline</h2>
        <p className="text-sm text-[#1C2B2E]/70 mt-3 max-w-lg mx-auto">
          No pressure, no deadline. Just a conversation about what's next, whenever you're ready to have it.
        </p>
        <button
          onClick={onOpenConsultation}
          className="inline-flex items-center gap-2 mt-7 px-10 py-4 bg-[#0D2226] hover:bg-[#0F5C63] text-[#FAF8F5] font-bold text-xs uppercase tracking-widest rounded-xs shadow-lg transition-colors"
        >
          <Phone className="w-4 h-4" />
          Talk to Kyle
        </button>
        <div className="mt-6">
          <Link to="/luxury" className="text-xs text-[#0F5C63] hover:text-[#C9A96A] font-bold underline">
            Back to Fine Homes & Estate Properties
          </Link>
        </div>
      </div>

    </div>
  );
};
