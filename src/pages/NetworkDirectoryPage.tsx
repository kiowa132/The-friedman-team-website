import React, { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { Search, ArrowRight } from 'lucide-react';
import { usePageMeta } from '../lib/usePageMeta';
import { NETWORK_MEMBERS, isPlaceholder } from '../data/network';
import { FieldValue } from '../components/FieldValue';

export const NetworkDirectoryPage: React.FC = () => {
  usePageMeta(
    'Directory | Maryland Professional Network',
    'Search the Maryland Professional Network by name, industry, county, or specialty to find a trusted professional.'
  );

  const [query, setQuery] = useState('');
  const [industryFilter, setIndustryFilter] = useState('All');

  const industries = useMemo(() => {
    const real = NETWORK_MEMBERS.map((m) => m.industry).filter((i) => !isPlaceholder(i));
    return ['All', ...Array.from(new Set(real))];
  }, []);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return NETWORK_MEMBERS.filter((m) => {
      const matchesIndustry = industryFilter === 'All' || m.industry === industryFilter;
      if (!q) return matchesIndustry;
      const haystack = [m.name, m.industry, m.county, ...m.lookingToMeet, ...m.canHelpWith]
        .filter((v) => !isPlaceholder(v))
        .join(' ')
        .toLowerCase();
      return matchesIndustry && haystack.includes(q);
    });
  }, [query, industryFilter]);

  return (
    <div className="bg-[#FAF8F5] min-h-screen">

      <div className="pt-32 pb-10 max-w-3xl mx-auto px-4 sm:px-6 text-center">
        <h1 className="font-serif text-4xl font-bold text-[#0D2226]">Member Directory</h1>
        <p className="text-sm text-[#1C2B2E]/70 mt-3">
          Search by name, industry, county, or who a member is looking to meet.
        </p>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 pb-8 flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-[#1C2B2E]/40 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search members..."
            className="w-full border border-[#0D2226]/20 bg-white pl-10 pr-4 py-3 text-sm focus:border-[#0F5C63] focus:outline-none"
          />
        </div>
        <select
          value={industryFilter}
          onChange={(e) => setIndustryFilter(e.target.value)}
          className="border border-[#0D2226]/20 bg-white px-4 py-3 text-sm focus:border-[#0F5C63] focus:outline-none"
        >
          {industries.map((i) => (
            <option key={i} value={i}>{i}</option>
          ))}
        </select>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 pb-24">
        {filtered.length === 0 ? (
          <p className="text-sm text-[#1C2B2E]/60 text-center py-16">No members match that search yet.</p>
        ) : (
          <div className="space-y-4">
            {filtered.map((m) => (
              <Link
                key={m.id}
                to={`/network/members/${m.slug}`}
                className="block border border-[#C9A96A]/25 bg-white p-6 hover:border-[#C9A96A] transition-colors"
              >
                <div className="flex items-center justify-between gap-4">
                  <div className="flex items-center gap-4">
                    <div className="w-14 h-14 rounded-full bg-[#0F5C63]/10 flex items-center justify-center shrink-0 text-[#0F5C63] font-serif text-lg font-bold overflow-hidden">
                      {isPlaceholder(m.headshot) ? m.name.split(' ').map((n) => n[0]).join('') : (
                        <img src={m.headshot} alt={m.name} className="w-full h-full object-cover object-[center_15%]" />
                      )}
                    </div>
                    <div>
                      <h3 className="font-serif text-base font-bold text-[#0D2226]">{m.name}</h3>
                      <FieldValue value={m.title} className="text-xs text-[#1C2B2E]/65 block" />
                      <p className="text-xs text-[#0F5C63] mt-0.5">{m.industry}</p>
                    </div>
                  </div>
                  <ArrowRight className="w-4 h-4 text-[#C9A96A] shrink-0" />
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>

    </div>
  );
};
