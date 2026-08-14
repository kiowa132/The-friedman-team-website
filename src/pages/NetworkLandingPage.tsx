import React from 'react';
import { Link } from 'react-router-dom';
import { Users, Handshake, Share2, TrendingUp } from 'lucide-react';
import { usePageMeta } from '../lib/usePageMeta';
import { NETWORK_MEMBERS, isPlaceholder } from '../data/network';
import { FieldValue } from '../components/FieldValue';

export const NetworkLandingPage: React.FC = () => {
  usePageMeta(
    'Maryland Professional Network | Friedman Real Estate Team',
    'A curated network of trusted Maryland professionals connecting, referring business, and helping one another grow.'
  );

  const loop = [
    { icon: Users, label: 'Meet' },
    { icon: Handshake, label: 'Connect' },
    { icon: Share2, label: 'Refer' },
    { icon: TrendingUp, label: 'Grow' },
  ];

  return (
    <div className="bg-[#FAF8F5]">

      {/* Hero */}
      <div className="pt-32 pb-16 max-w-3xl mx-auto px-4 sm:px-6 text-center">
        <span className="text-xs font-bold uppercase tracking-[0.3em] text-[#C9A96A]">Connect. Refer. Grow.</span>
        <h1 className="font-serif text-4xl sm:text-6xl font-bold text-[#0D2226] leading-tight mt-3">
          The Maryland Professional Network
        </h1>
        <p className="text-base sm:text-lg text-[#1C2B2E]/80 leading-relaxed mt-5 font-light">
          A curated network of Maryland professionals committed to building meaningful relationships, exchanging referrals, and helping one another grow.
        </p>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 mt-8">
          <Link
            to="/network/directory"
            className="inline-flex items-center gap-2 px-8 py-3.5 bg-[#0D2226] hover:bg-[#0F5C63] text-[#FAF8F5] font-bold text-xs uppercase tracking-widest rounded-xs transition-colors"
          >
            Find a Professional
          </Link>
          <Link
            to="/network/join"
            className="inline-flex items-center gap-2 px-8 py-3.5 border border-[#0D2226]/30 hover:border-[#C9A96A] text-[#0D2226] hover:text-[#0F5C63] font-bold text-xs uppercase tracking-widest rounded-xs transition-colors"
          >
            Apply to Join
          </Link>
        </div>
      </div>

      {/* Meet -> Connect -> Refer -> Grow */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 pb-10">
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {loop.map((step) => (
            <div key={step.label} className="text-center border border-[#C9A96A]/30 rounded-xs py-6 px-3 bg-white">
              <div className="w-14 h-14 rounded-full border border-[#C9A96A]/40 flex items-center justify-center mx-auto text-[#0F5C63]">
                <step.icon className="w-6 h-6" />
              </div>
              <p className="font-serif text-sm font-bold text-[#0D2226] mt-3 uppercase tracking-wide">{step.label}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Current members preview */}
      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-10">
        <h2 className="font-serif text-2xl font-bold text-[#0D2226] text-center mb-10">Current Members</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          {NETWORK_MEMBERS.map((m) => (
            <Link
              key={m.id}
              to={`/network/members/${m.slug}`}
              className="block border border-[#C9A96A]/30 bg-white p-7 hover:border-[#C9A96A] transition-colors"
            >
              <div className="flex items-center gap-4">
                <div className="w-20 h-20 rounded-full bg-[#0F5C63]/10 flex items-center justify-center shrink-0 text-[#0F5C63] font-serif text-xl font-bold overflow-hidden">
                  {isPlaceholder(m.headshot) ? m.name.split(' ').map((n) => n[0]).join('') : (
                    <img src={m.headshot} alt={m.name} className="w-full h-full object-cover object-[center_15%]" />
                  )}
                </div>
                <div>
                  <h3 className="font-serif text-lg font-bold text-[#0D2226]">{m.name}</h3>
                  <FieldValue value={m.title} className="text-xs text-[#1C2B2E]/65 block" />
                  <span className="inline-block mt-1 text-[10px] font-bold uppercase tracking-wider text-[#C9A96A]">{m.status}</span>
                </div>
              </div>
              {!isPlaceholder(m.bio) && (
                <p className="text-xs text-[#1C2B2E]/70 leading-relaxed mt-4 line-clamp-3">{m.bio}</p>
              )}
              <span className="inline-block mt-3 text-xs font-bold text-[#0F5C63]">
                Read Full Profile &rarr;
              </span>
            </Link>
          ))}

          {/* Future member preview slots */}
          {['CPA', 'Estate Attorney', 'Lender'].map((category) => (
            <div key={category} className="border border-dashed border-[#0D2226]/15 p-7 flex items-center justify-center text-center">
              <p className="text-xs text-[#1C2B2E]/40 italic">Future category: {category}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Why curated */}
      <div className="bg-[#0D2226] py-20">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 text-center">
          <h2 className="font-serif text-2xl sm:text-3xl font-bold text-[#FAF8F5]">Intentionally Curated, Not Open</h2>
          <p className="text-sm sm:text-base text-[#F5F1E8]/80 leading-relaxed mt-5 font-light">
            This isn't an open directory or a general networking group. It's a small, growing group of Maryland professionals who take relationships seriously - quality over quantity. Every member is here because they're someone worth introducing to the rest of the network.
          </p>
          <p className="text-xs text-[#A8B2A1] mt-6">Founded by Kyle Friedman</p>
        </div>
      </div>

    </div>
  );
};
