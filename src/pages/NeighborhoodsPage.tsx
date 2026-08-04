import React from 'react';
import { Link } from 'react-router-dom';
import { TOWNS } from '../data/towns';
import { usePageMeta } from '../lib/usePageMeta';
import { Phone, Facebook, Instagram, Linkedin } from 'lucide-react';

interface NeighborhoodsPageProps {
  onOpenConsultation: () => void;
}

export const NeighborhoodsPage: React.FC<NeighborhoodsPageProps> = ({
  onOpenConsultation,
}) => {
  usePageMeta(
    'Maryland Neighborhoods & Towns | The Friedman Team',
    'Explore real, local neighborhood guides across Carroll, Baltimore, Howard, and Frederick County, with real demographics, walkability, schools, and live listings for every town.'
  );

  return (
    <div className="pb-20 space-y-16">

      {/* Full-bleed hero, matching Canopy's neighborhoods page header */}
      <div className="relative h-[420px] w-full overflow-hidden flex flex-col items-center justify-center text-center">
        <img
          src="/images/hero/neighborhoods-hero.jpg"
          alt="Maryland Neighborhoods"
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-[#0D2226]/45" />
        <div className="relative z-10 px-4">
          <h1 className="font-serif text-4xl sm:text-6xl font-light uppercase tracking-[0.2em] text-[#FAF8F5]">
            Neighborhoods
          </h1>
          <div className="flex items-center justify-center gap-3 mt-6">
            <a href="https://www.facebook.com/kyle.friedman132" target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full border border-[#FAF8F5]/50 flex items-center justify-center text-[#FAF8F5] hover:bg-[#FAF8F5]/10 transition-colors">
              <Facebook className="w-4 h-4" />
            </a>
            <a href="https://www.instagram.com/keysbykyle/" target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full border border-[#FAF8F5]/50 flex items-center justify-center text-[#FAF8F5] hover:bg-[#FAF8F5]/10 transition-colors">
              <Instagram className="w-4 h-4" />
            </a>
            <a href="https://www.linkedin.com/in/kyle-friedman-415029168/?skipRedirect=true" target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full border border-[#FAF8F5]/50 flex items-center justify-center text-[#FAF8F5] hover:bg-[#FAF8F5]/10 transition-colors">
              <Linkedin className="w-4 h-4" />
            </a>
          </div>
        </div>
      </div>

      <section className="max-w-3xl mx-auto px-4 sm:px-6 text-center">
        <h2 className="font-serif text-2xl sm:text-3xl font-bold text-[#0D2226] mb-2">
          Areas of Expertise
        </h2>
        <p className="text-sm text-[#1C2B2E]/70">
          Real local data, including demographics, walkability, schools, and live listings, for towns across Carroll, Baltimore, Howard, and Frederick County.
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
            The Friedman Team covers all of Carroll, Baltimore, Howard, and Frederick County. Reach out directly for a full picture of any specific area, including off-market opportunities.
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
