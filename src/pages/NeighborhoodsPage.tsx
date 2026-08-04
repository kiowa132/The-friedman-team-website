import React from 'react';
import { Link } from 'react-router-dom';
import { TOWNS } from '../data/towns';
import { usePageMeta } from '../lib/usePageMeta';
import { Phone } from 'lucide-react';

interface NeighborhoodsPageProps {
  onOpenConsultation: () => void;
}

export const NeighborhoodsPage: React.FC<NeighborhoodsPageProps> = ({
  onOpenConsultation,
}) => {
  usePageMeta(
    'Maryland Neighborhoods & Towns | The Friedman Team',
    'Explore real, local neighborhood guides across Carroll, Baltimore, Howard, and Frederick County - real demographics, walkability, schools, and live listings for every town.'
  );

  return (
    <div className="pt-28 pb-20 space-y-16">

      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-4">
        <span className="text-xs font-bold uppercase tracking-[0.25em] text-[#0F5C63] bg-[#0F5C63]/10 px-4 py-1.5 border border-[#0F5C63]/30 inline-block">
          Local Market Intelligence
        </span>
        <h1 className="font-serif text-4xl sm:text-6xl font-bold text-[#0D2226]">
          Maryland Neighborhoods & Towns
        </h1>
        <p className="text-sm text-[#1C2B2E]/80 max-w-2xl mx-auto font-normal">
          Real local data - demographics, walkability, schools, and live listings - for towns across Carroll, Baltimore, Howard, and Frederick County.
        </p>
      </section>

      {/* Areas of Expertise - real towns, grouped by county, linking to
          real per-town data pages */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {(['Carroll County', 'Baltimore County', 'Howard County', 'Frederick County'] as const).map((county) => (
          <div key={county} className="mb-10">
            <h2 className="font-serif text-xl font-bold text-[#0D2226] mb-3 border-b border-[#C9A96A]/20 pb-2">
              {county}
            </h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2">
              {TOWNS.filter((t) => t.county === county).map((town) => (
                <Link
                  key={town.slug}
                  to={`/neighborhoods/${town.slug}`}
                  className="px-4 py-3 bg-white border border-[#C9A96A]/25 hover:border-[#0F5C63] text-sm text-[#0D2226] hover:text-[#0F5C63] transition-colors rounded-xs text-center"
                >
                  {town.name}
                </Link>
              ))}
            </div>
          </div>
        ))}
      </section>

      {/* Off-market CTA */}
      <section className="max-w-3xl mx-auto px-4 sm:px-6 text-center">
        <div className="bg-[#0D2226] border border-[#C9A96A]/40 rounded-xs p-8 space-y-4">
          <h2 className="font-serif text-2xl font-bold text-[#FAF8F5]">
            Don't See Your Town?
          </h2>
          <p className="text-xs text-[#A8B2A1]">
            The Friedman Team covers all of Carroll, Baltimore, Howard, and Frederick County - reach out directly for a full picture of any specific area, including off-market opportunities.
          </p>
          <button
            onClick={onOpenConsultation}
            className="px-8 py-3 bg-[#C9A96A] hover:bg-[#D4AF37] text-[#0D2226] font-bold text-xs uppercase tracking-widest rounded-xs transition-colors inline-flex items-center gap-2"
          >
            <Phone className="w-4 h-4" />
            <span>Talk to Kyle Friedman</span>
          </button>
        </div>
      </section>

    </div>
  );
};
