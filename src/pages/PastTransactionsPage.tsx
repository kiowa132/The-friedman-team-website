import React from 'react';
import { Link } from 'react-router-dom';
import { usePageMeta } from '../lib/usePageMeta';
import { PAST_TRANSACTIONS } from '../data/pastTransactions';
import { MENTOR_TRANSACTIONS, MENTOR_NAME, MENTOR_AFFILIATION } from '../data/mentorTransactions';
import { Bed, Bath, Maximize2, Phone } from 'lucide-react';

interface PastTransactionsPageProps {
  onOpenConsultation: () => void;
}

export const PastTransactionsPage: React.FC<PastTransactionsPageProps> = ({ onOpenConsultation }) => {
  usePageMeta(
    'Mentorship & Team Experience | The Friedman Team',
    'Building on proven strategies, systems, and transaction experience from experienced real estate professionals within eXp Realty.'
  );

  return (
    <div className="pt-28 pb-20 bg-[#FAF8F5]">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">

        {/* Hero - the page's positioning is Kyle's access to mentorship and
            proven systems, not a bio page for anyone else. */}
        <div className="mb-16 text-center max-w-3xl mx-auto">
          <span className="text-[11px] uppercase tracking-[0.25em] text-[#C9A96A] font-bold">Track Record</span>
          <h1 className="font-serif text-4xl sm:text-5xl font-bold text-[#0D2226] mt-2">Mentorship &amp; Team Experience</h1>
          <p className="text-sm sm:text-base text-[#1C2B2E]/70 mt-4 leading-relaxed">
            Building on proven strategies, systems, and transaction experience from experienced real estate professionals within eXp Realty.
          </p>
          <p className="text-sm text-[#1C2B2E]/70 mt-4 leading-relaxed">
            As part of my continued growth as a real estate advisor, I have had the opportunity to learn from and study the strategies, marketing systems, negotiation techniques, and transaction processes used by experienced eXp Realty professionals.
          </p>
        </div>

        {/* Kyle's own transactions, only shown once real ones exist */}
        {PAST_TRANSACTIONS.length > 0 && (
          <div className="mb-24">
            <div className="mb-10">
              <h2 className="font-serif text-2xl sm:text-3xl font-bold text-[#0D2226]">My Transactions</h2>
              <p className="text-sm text-[#1C2B2E]/70 mt-2 max-w-2xl">
                Real closed deals Kyle has personally represented, as listing agent or buyer's agent, across Carroll, Baltimore, Howard, and Frederick counties.
              </p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {PAST_TRANSACTIONS.map((t, i) => (
                <div key={i} className="bg-white border border-[#C9A96A]/25 overflow-hidden shadow-md">
                  <div className="relative aspect-[16/10] overflow-hidden bg-[#0D2226] flex items-center justify-center">
                    {t.image ? (
                      <img src={t.image} alt={t.address} className="w-full h-full object-cover" />
                    ) : (
                      <img src="/images/brand/friedman-f-mark.png" alt="" className="h-16 w-auto opacity-40" />
                    )}
                    <div className="absolute top-3 left-3 px-2.5 py-1 bg-[#0D2226] text-[#C9A96A] text-[10px] font-bold uppercase tracking-widest">
                      Sold
                    </div>
                  </div>
                  <div className="p-5">
                    <div className="font-serif text-lg font-bold text-[#0D2226]">{t.address}</div>
                    <div className="text-xs text-[#1C2B2E]/60 mb-2">{t.city}, {t.county}</div>
                    <div className="flex items-center justify-between mb-3">
                      <span className="font-semibold text-[#0F5C63]">{t.priceDisplay}</span>
                      <span className="text-[11px] text-[#1C2B2E]/50">{t.soldDate}</span>
                    </div>
                    {(t.beds || t.baths || t.sqft) && (
                      <div className="flex items-center gap-3 text-xs text-[#1C2B2E]/60 border-t border-[#C9A96A]/20 pt-3">
                        {t.beds && <span className="flex items-center gap-1"><Bed className="w-3.5 h-3.5" /> {t.beds}</span>}
                        {t.baths && <span className="flex items-center gap-1"><Bath className="w-3.5 h-3.5" /> {t.baths}</span>}
                        {t.sqft && <span className="flex items-center gap-1"><Maximize2 className="w-3.5 h-3.5" /> {t.sqft.toLocaleString()} sqft</span>}
                      </div>
                    )}
                    <div className="text-[10px] uppercase tracking-widest text-[#C9A96A] font-bold mt-3">{t.role}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Experience & Transactions - real deals from Kyle's mentor, styled
            like the rest of the site's property cards. Attribution is a
            small line under each card, not a loud claim over the photo. */}
        <div className="mb-10">
          <h2 className="font-serif text-2xl sm:text-3xl font-bold text-[#0D2226]">Experience &amp; Transactions</h2>
          <p className="text-sm text-[#1C2B2E]/70 mt-2 max-w-2xl">
            A sample of real transactions completed within our professional network, reflecting the caliber of strategy and execution behind the systems The Friedman Team builds on.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {MENTOR_TRANSACTIONS.map((t, i) => (
            <Link key={i} to={`/transactions/${t.slug}`} className="group block bg-white border border-[#C9A96A]/25 overflow-hidden shadow-md">
              <div className="relative aspect-[4/3] overflow-hidden bg-[#0D2226]/10 flex items-center justify-center">
                {t.image ? (
                  <img src={t.image} alt={t.address} loading="lazy" className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
                ) : (
                  <span className="text-[#1C2B2E]/30 text-xs uppercase tracking-widest">No photo yet</span>
                )}
                <div className="absolute top-3 left-3 px-2.5 py-1 bg-[#0D2226] text-[#C9A96A] text-[10px] font-bold uppercase tracking-widest">
                  Sold
                </div>
              </div>
              <div className="p-5">
                <div className="font-serif text-lg font-bold text-[#0D2226] group-hover:text-[#0F5C63] transition-colors">{t.address}</div>
                <div className="text-xs text-[#1C2B2E]/60 mb-2">{t.cityStateZip}</div>
                <div className="font-semibold text-[#0F5C63] mb-3">{t.priceDisplay}</div>
                <div className="flex items-center gap-3 text-xs text-[#1C2B2E]/60 border-t border-[#C9A96A]/20 pt-3">
                  <span className="flex items-center gap-1"><Bed className="w-3.5 h-3.5" /> {t.beds}</span>
                  <span className="flex items-center gap-1"><Bath className="w-3.5 h-3.5" /> {t.baths}</span>
                  <span className="flex items-center gap-1"><Maximize2 className="w-3.5 h-3.5" /> {t.sqft.toLocaleString()} sqft</span>
                </div>
                <div className="text-[11px] text-[#1C2B2E]/45 mt-3">
                  Transaction completed by {MENTOR_NAME} | {MENTOR_AFFILIATION}
                </div>
              </div>
            </Link>
          ))}
        </div>

        <div className="mt-16 text-center">
          <button
            onClick={onOpenConsultation}
            className="inline-flex items-center gap-2 px-8 py-3 bg-[#0D2226] hover:bg-[#0F5C63] text-[#FAF8F5] font-bold text-xs uppercase tracking-widest rounded-xs transition-colors"
          >
            <Phone className="w-4 h-4" />
            Talk to Kyle
          </button>
        </div>

      </div>
    </div>
  );
};
