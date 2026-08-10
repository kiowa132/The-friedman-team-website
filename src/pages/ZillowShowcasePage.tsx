import React from 'react';
import { Link } from 'react-router-dom';
import { Camera, Boxes, MapPinned, Users, TrendingUp, Clock3, Award, CheckCircle2, XCircle, Phone } from 'lucide-react';
import { usePageMeta } from '../lib/usePageMeta';

interface ZillowShowcasePageProps {
  onOpenConsultation: () => void;
}

// Everything cited on this page is a real, published statistic from
// Zillow/ShowingTime+'s own official Showcase data page - see the source
// link in the stats section. Nothing here is Kyle's own claimed result;
// he doesn't have Showcase-specific outcome data of his own yet, so this
// page explains the real product and its real, sourced numbers rather
// than implying a personal track record that doesn't exist.
export const ZillowShowcasePage: React.FC<ZillowShowcasePageProps> = ({ onOpenConsultation }) => {
  usePageMeta(
    'Zillow Showcase | The Friedman Team',
    'Zillow Showcase gives eligible listings premium placement, interactive floor plans, and professional media on Zillow - available for select Friedman Team listings.'
  );

  const included = [
    { icon: Camera, title: 'High-Resolution Photography', description: 'Professional photography built for the larger, more prominent hero image Showcase listings get.' },
    { icon: Boxes, title: 'Interactive Floor Plans & 3D Tours', description: 'Buyers can explore the actual layout room by room, not just scroll through static photos.' },
    { icon: MapPinned, title: 'Priority Placement', description: 'Special map callouts and prioritized position in personalized Zillow search results.' },
    { icon: Users, title: 'Direct Buyer Access', description: 'Interested buyers can contact Kyle directly from the listing, with exposure to Zillow\u2019s own user base.' },
  ];

  const stats = [
    { icon: TrendingUp, stat: '2% higher', description: 'average sale price compared to similar non-Showcase listings' },
    { icon: Clock3, stat: '~20% more likely', description: 'to go pending within the first 14 days on market' },
    { icon: Award, stat: '20% more listings won', description: 'by agents using Showcase, compared to similar non-Showcase agents' },
    { icon: Users, stat: '75%+ average increase', description: 'in saves, shares, and page views compared to similar nearby listings' },
  ];

  return (
    <div className="bg-[#FAF8F5]">

      {/* Hero */}
      <div className="pt-32 pb-16 max-w-4xl mx-auto px-4 sm:px-6 text-center">
        <span className="text-xs font-bold uppercase tracking-[0.3em] text-[#C9A96A]">The Friedman Team</span>
        <h1 className="font-serif text-4xl sm:text-6xl font-bold text-[#0D2226] leading-tight mt-3">
          Zillow Showcase
        </h1>
        <p className="text-base sm:text-lg text-[#1C2B2E]/80 leading-relaxed mt-5 max-w-2xl mx-auto font-light">
          A premium listing placement on Zillow, available to roughly 10% of listings in a given market. When a property qualifies, Kyle uses it as part of the marketing plan, at no extra cost to you.
        </p>
      </div>

      {/* What's included */}
      <div className="max-w-5xl mx-auto px-4 sm:px-6 pb-20">
        <h2 className="font-serif text-2xl font-bold text-[#0D2226] text-center mb-10">What Showcase Includes</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-10 gap-y-8">
          {included.map((item) => (
            <div key={item.title} className="flex gap-4">
              <div className="w-11 h-11 rounded-full border border-[#C9A96A]/40 flex items-center justify-center shrink-0 text-[#0F5C63]">
                <item.icon className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-serif text-lg font-bold text-[#0D2226]">{item.title}</h3>
                <p className="text-sm text-[#1C2B2E]/70 leading-relaxed mt-1">{item.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Standard vs Showcase - built in the site's own visual language,
          not a reproduction of Zillow's own branded comparison graphic. */}
      <div className="bg-[#0D2226] py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6">
          <h2 className="font-serif text-2xl sm:text-3xl font-bold text-[#FAF8F5] text-center mb-12">
            Standard Listing vs. Showcase
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div className="bg-[#1A2E33] border border-[#FAF8F5]/10 p-7">
              <span className="text-xs font-bold uppercase tracking-widest text-[#A8B2A1]">Standard Listing</span>
              <ul className="mt-5 space-y-3">
                {['Standard photo gallery', 'Basic property details', 'Blends in with nearby listings'].map((t) => (
                  <li key={t} className="flex items-start gap-2.5 text-sm text-[#FAF8F5]/70">
                    <XCircle className="w-4 h-4 text-[#FAF8F5]/30 shrink-0 mt-0.5" />
                    {t}
                  </li>
                ))}
              </ul>
            </div>
            <div className="bg-[#0F5C63] border border-[#C9A96A]/40 p-7">
              <span className="text-xs font-bold uppercase tracking-widest text-[#C9A96A]">Showcase Listing</span>
              <ul className="mt-5 space-y-3">
                {['Larger, high-impact hero image', 'Interactive floor plan & 3D tour', 'Priority placement & buyer alerts'].map((t) => (
                  <li key={t} className="flex items-start gap-2.5 text-sm text-[#FAF8F5]">
                    <CheckCircle2 className="w-4 h-4 text-[#C9A96A] shrink-0 mt-0.5" />
                    {t}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* Real, sourced stats */}
      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-20">
        <h2 className="font-serif text-2xl font-bold text-[#0D2226] text-center mb-2">The Real Numbers</h2>
        <p className="text-xs text-[#1C2B2E]/50 text-center mb-10">
          Published Zillow / ShowingTime+ data, compared to similar non-Showcase listings - not a Friedman Team-specific result.
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          {stats.map((s) => (
            <div key={s.description} className="bg-white border border-[#C9A96A]/25 p-6 flex gap-4 items-start">
              <s.icon className="w-6 h-6 text-[#0F5C63] shrink-0 mt-0.5" />
              <div>
                <div className="font-serif text-xl font-bold text-[#0D2226]">{s.stat}</div>
                <p className="text-xs text-[#1C2B2E]/70 mt-1">{s.description}</p>
              </div>
            </div>
          ))}
        </div>
        <p className="text-[11px] text-[#1C2B2E]/45 text-center mt-6">
          Source:{' '}
          <a href="https://showingtimeplus.com/solutions/listing-showcase-facts" target="_blank" rel="noopener noreferrer" className="underline hover:text-[#0F5C63]">
            showingtimeplus.com/solutions/listing-showcase-facts
          </a>
        </p>
      </div>

      {/* CTA */}
      <div className="max-w-3xl mx-auto px-4 sm:px-6 pb-24 text-center">
        <h2 className="font-serif text-2xl font-bold text-[#0D2226]">See If Your Home Qualifies</h2>
        <p className="text-sm text-[#1C2B2E]/70 mt-3 max-w-lg mx-auto">
          Not every listing is eligible for Showcase, but if yours is, it's included in the marketing plan. Let's talk about your property.
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
