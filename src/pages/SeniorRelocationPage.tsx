import React from 'react';
import { Link } from 'react-router-dom';
import {
  Home, PaintRoller, Handshake, Truck, Users2, Phone,
  Boxes, Archive, Warehouse, HeartHandshake, Wallet, Clock,
} from 'lucide-react';
import { usePageMeta } from '../lib/usePageMeta';
import { ReviewsSection } from '../components/ReviewsSection';

interface SeniorRelocationPageProps {
  onOpenConsultation: () => void;
}

// Real service commitments and a real referral network Kyle can actually
// deliver - not a claimed formal certification (SRES or similar), since
// that hasn't been confirmed. Every FAQ answer here describes process,
// not a credential.
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

  const whyDifferent = [
    { icon: Wallet, title: 'Fixed-Income Realities', description: 'This isn\u2019t a job-driven move. Proceeds, timing, and tax considerations get weighed differently when a sale needs to support retirement, not just fund the next purchase.' },
    { icon: Clock, title: 'No Artificial Deadline', description: 'There\u2019s rarely a start-date forcing this. That means the timeline should be set by what actually works for you, not a typical 30-day listing push.' },
    { icon: HeartHandshake, title: 'Decades, Not Boxes', description: 'A starter home move is logistics. This is sorting through a lifetime of belongings, memories, and decisions about what comes next \u2014 that takes a different kind of patience.' },
  ];

  const partners = [
    { icon: Boxes, title: 'Decluttering & Organizing', description: 'Professionals who help sort, pack, and decide what to keep, without you having to do it alone.' },
    { icon: Archive, title: 'Estate Sale Companies', description: 'Trusted local partners for liquidating what\u2019s not moving to the next home.' },
    { icon: Warehouse, title: 'Movers & Storage', description: 'Reliable moving companies and short- or long-term storage solutions, coordinated around your timeline.' },
  ];

  const faqs = [
    { q: 'Do I need to fix up the house before we even talk?', a: 'No. Start with a conversation. Kyle Friedman will walk the property with you and give honest, practical guidance on what\u2019s actually worth doing, if anything, before it\u2019s time to sell.' },
    { q: 'What if I\u2019m not ready to decide yet?', a: 'That\u2019s completely normal, and there\u2019s no pressure to commit to anything. Many families start this conversation months, even years, before an actual move.' },
    { q: 'Can my adult children be part of this process?', a: 'Yes, whenever that\u2019s helpful. Kyle Friedman is glad to include family members in conversations, walkthroughs, and planning, at whatever level you\u2019re comfortable with.' },
    { q: 'What happens to belongings that aren\u2019t moving with me?', a: 'Kyle Friedman can connect you with trusted local estate sale companies, donation resources, and decluttering professionals to help sort through what stays, what goes, and where it goes.' },
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
          Leaving a longtime home is more than a real estate transaction. It's a major life transition, and it deserves a process that respects that. Kyle Friedman works with homeowners and their families to make right-sizing and later-life relocation as thoughtful and unhurried as it needs to be.
        </p>
      </div>

      {/* Why this is different */}
      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-20">
        <h2 className="font-serif text-2xl font-bold text-[#0D2226] text-center mb-3">Why This Move Is Different</h2>
        <p className="text-sm text-[#1C2B2E]/65 text-center mb-10 max-w-2xl mx-auto">
          Moving later in life isn't a smaller version of a typical move. The considerations are genuinely different.
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-8">
          {whyDifferent.map((w) => (
            <div key={w.title} className="bg-white border border-[#C9A96A]/25 p-7 text-center">
              <div className="w-12 h-12 rounded-full border border-[#C9A96A]/40 flex items-center justify-center mx-auto text-[#0F5C63]">
                <w.icon className="w-5 h-5" />
              </div>
              <h3 className="font-serif text-base font-bold text-[#0D2226] mt-4">{w.title}</h3>
              <p className="text-xs text-[#1C2B2E]/65 leading-relaxed mt-2">{w.description}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Five services */}
      <div className="bg-white py-20">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <h2 className="font-serif text-2xl font-bold text-[#0D2226] text-center mb-10">What's Included</h2>
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
      </div>

      {/* Trusted partner network */}
      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-20">
        <h2 className="font-serif text-2xl font-bold text-[#0D2226] text-center mb-3">A Trusted Partner Network</h2>
        <p className="text-sm text-[#1C2B2E]/65 text-center mb-10 max-w-2xl mx-auto">
          You don't have to coordinate this alone. Kyle Friedman can connect you with local professionals for every part of the transition.
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-8">
          {partners.map((p) => (
            <div key={p.title} className="flex gap-4">
              <div className="w-11 h-11 rounded-full border border-[#C9A96A]/40 flex items-center justify-center shrink-0 text-[#0F5C63]">
                <p.icon className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-serif text-base font-bold text-[#0D2226]">{p.title}</h3>
                <p className="text-xs text-[#1C2B2E]/65 leading-relaxed mt-1">{p.description}</p>
              </div>
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

      {/* FAQ */}
      <div className="max-w-3xl mx-auto px-4 sm:px-6 py-20">
        <h2 className="font-serif text-2xl font-bold text-[#0D2226] text-center mb-10">Common Questions</h2>
        <div className="space-y-6">
          {faqs.map((f) => (
            <div key={f.q} className="border-b border-[#C9A96A]/20 pb-6">
              <h3 className="font-serif text-base font-bold text-[#0D2226]">{f.q}</h3>
              <p className="text-sm text-[#1C2B2E]/70 leading-relaxed mt-2">{f.a}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Real reviews - same genuine Google reviews shown elsewhere on the
          site, not written specifically for this page. */}
      <ReviewsSection />

      {/* CTA */}
      <div className="max-w-3xl mx-auto px-4 sm:px-6 pt-20 pb-24 text-center">
        <h2 className="font-serif text-2xl font-bold text-[#0D2226]">Let's Talk Through Your Timeline</h2>
        <p className="text-sm text-[#1C2B2E]/70 mt-3 max-w-lg mx-auto">
          No pressure, no deadline. Just a conversation about what's next, whenever you're ready to have it.
        </p>
        <button
          onClick={onOpenConsultation}
          className="inline-flex items-center gap-2 mt-7 px-10 py-4 bg-[#0D2226] hover:bg-[#0F5C63] text-[#FAF8F5] font-bold text-xs uppercase tracking-widest rounded-xs shadow-lg transition-colors"
        >
          <Phone className="w-4 h-4" />
          Talk to Kyle Friedman
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
