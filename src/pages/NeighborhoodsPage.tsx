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

      {/* Areas of Expertise - real towns, grouped by county, photo cards
          with hover "Learn More" prompt matching Canopy's pattern */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {(['Carroll County', 'Baltimore County', 'Howard County', 'Frederick County'] as const).map((county) => (
          <div key={county} className="mb-14">
            <h2 className="font-serif text-xl font-bold text-[#0D2226] mb-6 border-b border-[#C9A96A]/20 pb-2">
              {county}
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-10">
              {TOWNS.filter((t) => t.county === county).map((town) => (
                <Link key={town.slug} to={`/neighborhoods/${town.slug}`} className="group block">
                  <div className="relative aspect-[3/2] overflow-hidden">
                    <img
                      src={town.image}
                      alt={town.name}
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-[#0D2226]/0 group-hover:bg-[#0D2226]/25 transition-colors" />
                    <span className="absolute bottom-4 right-4 px-4 py-2 border border-[#FAF8F5] text-[#FAF8F5] text-[10px] font-bold uppercase tracking-widest opacity-0 group-hover:opacity-100 transition-opacity bg-[#0D2226]/60">
                      Learn More
                    </span>
                  </div>
                  <h3 className="text-center mt-4 text-lg font-light uppercase tracking-[0.15em] text-[#0D2226] group-hover:text-[#0F5C63] transition-colors">
                    {town.name}
                  </h3>
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
