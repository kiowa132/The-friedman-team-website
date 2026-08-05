import React from 'react';
import { usePageMeta } from '../lib/usePageMeta';
import { PAST_TRANSACTIONS } from '../data/pastTransactions';
import { MENTOR_TRANSACTIONS, MENTOR_NAME, MENTOR_AFFILIATION } from '../data/mentorTransactions';
import { Bed, Bath, Maximize2, Phone } from 'lucide-react';

interface PastTransactionsPageProps {
  onOpenConsultation: () => void;
}

export const PastTransactionsPage: React.FC<PastTransactionsPageProps> = ({ onOpenConsultation }) => {
  usePageMeta(
    'Past Transactions | The Friedman Team',
    "A record of homes Kyle Friedman has personally represented, plus the track record of his mentor James Buckley."
  );

  return (
    <div className="pt-28 pb-20 bg-[#FAF8F5]">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">

        {/* Section 1: Kyle's own transactions */}
        <div className="mb-12 text-center">
          <span className="text-[11px] uppercase tracking-[0.25em] text-[#C9A96A] font-bold">Track Record</span>
          <h1 className="font-serif text-4xl sm:text-5xl font-bold text-[#0D2226] mt-2">My Transactions</h1>
          <p className="text-sm text-[#1C2B2E]/70 mt-3 max-w-2xl mx-auto">
            Real closed deals Kyle has personally represented, as listing agent or buyer's agent, across Carroll, Baltimore, Howard, and Frederick counties.
          </p>
        </div>

        {PAST_TRANSACTIONS.length === 0 ? (
          <div className="max-w-xl mx-auto text-center border border-[#C9A96A]/30 bg-white p-10">
            <p className="text-sm text-[#1C2B2E]/70 mb-6">
              This page is being built out with Kyle's closed transactions. In the meantime, reach out directly for references and recent sales in your area.
            </p>
            <button
              onClick={onOpenConsultation}
              className="inline-flex items-center gap-2 px-8 py-3 bg-[#0D2226] hover:bg-[#0F5C63] text-[#FAF8F5] font-bold text-xs uppercase tracking-widest rounded-xs transition-colors"
            >
              <Phone className="w-4 h-4" />
              Talk to Kyle
            </button>
          </div>
        ) : (
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
        )}

        {/* Section 2: Backed by Experience - James Buckley's own transactions,
            clearly and repeatedly attributed to him, never Kyle's. Visually
            distinct (different background, explicit heading and per-card
            byline) so there is no way to mistake this for Kyle's record. */}
        {MENTOR_TRANSACTIONS.length > 0 && (
          <div className="mt-24 -mx-4 sm:-mx-6 px-4 sm:px-6 py-16 bg-[#0D2226]">
            <div className="max-w-6xl mx-auto">
              <div className="mb-12 text-center">
                <span className="text-[11px] uppercase tracking-[0.25em] text-[#C9A96A] font-bold">Backed by Experience</span>
                <h2 className="font-serif text-3xl sm:text-4xl font-bold text-[#FAF8F5] mt-2">
                  {MENTOR_NAME}'s Track Record
                </h2>
                <p className="text-sm text-[#A8B2A1] mt-3 max-w-2xl mx-auto">
                  Kyle trained directly under {MENTOR_NAME} of {MENTOR_AFFILIATION}. The transactions below are {MENTOR_NAME}'s own closed deals, not Kyle's, shown here as context for the mentorship behind The Friedman Team's approach.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {MENTOR_TRANSACTIONS.map((t, i) => (
                  <div key={i} className="bg-[#FAF8F5]/5 border border-[#C9A96A]/25 overflow-hidden">
                    <div className="relative aspect-[16/10] overflow-hidden bg-[#0D2226]/60 flex items-center justify-center border-b border-[#C9A96A]/20">
                      {t.image ? (
                        <img src={t.image} alt={t.address} className="w-full h-full object-cover" />
                      ) : (
                        <span className="text-[#A8B2A1]/40 text-xs uppercase tracking-widest">No photo</span>
                      )}
                      <div className="absolute top-3 left-3 px-2.5 py-1 bg-[#C9A96A] text-[#0D2226] text-[10px] font-bold uppercase tracking-widest">
                        Sold by {MENTOR_NAME}
                      </div>
                    </div>
                    <div className="p-5">
                      <div className="font-serif text-base font-bold text-[#FAF8F5]">{t.address}</div>
                      <div className="text-xs text-[#A8B2A1] mb-2">{t.cityStateZip}</div>
                      <div className="font-semibold text-[#C9A96A] mb-3">{t.priceDisplay}</div>
                      <div className="flex items-center gap-3 text-xs text-[#A8B2A1] border-t border-[#C9A96A]/15 pt-3">
                        <span className="flex items-center gap-1"><Bed className="w-3.5 h-3.5" /> {t.beds}</span>
                        <span className="flex items-center gap-1"><Bath className="w-3.5 h-3.5" /> {t.baths}</span>
                        <span className="flex items-center gap-1"><Maximize2 className="w-3.5 h-3.5" /> {t.sqft.toLocaleString()} sqft</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <p className="text-[11px] text-[#A8B2A1]/70 text-center mt-8 max-w-2xl mx-auto">
                All transactions above were represented by {MENTOR_NAME}, not Kyle Friedman or The Friedman Team. Shown with {MENTOR_NAME}'s permission as context for Kyle's training and mentorship.
              </p>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};
