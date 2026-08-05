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
    'Mentor Track Record | The Friedman Team',
    `Kyle Friedman trained directly under ${MENTOR_NAME} of ${MENTOR_AFFILIATION}. A look at ${MENTOR_NAME}'s real closed transactions.`
  );

  return (
    <div className="pt-28 pb-20 bg-[#FAF8F5]">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">

        {/* Kyle's own transactions, only shown once real ones exist */}
        {PAST_TRANSACTIONS.length > 0 && (
          <div className="mb-24">
            <div className="mb-12 text-center">
              <span className="text-[11px] uppercase tracking-[0.25em] text-[#C9A96A] font-bold">Track Record</span>
              <h1 className="font-serif text-4xl sm:text-5xl font-bold text-[#0D2226] mt-2">My Transactions</h1>
              <p className="text-sm text-[#1C2B2E]/70 mt-3 max-w-2xl mx-auto">
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

        {/* Mentor track record - the page's main content for now. James's
            name is the headline treatment up top (impossible to miss), plus
            a quiet per-card line under each listing so attribution still
            holds even if a card is viewed or shared out of context. */}
        <div className="text-center mb-4">
          <span className="text-[11px] uppercase tracking-[0.25em] text-[#C9A96A] font-bold">Mentor Track Record</span>
          <h1 className="font-serif text-4xl sm:text-5xl font-bold text-[#0D2226] mt-2">
            {MENTOR_NAME}
          </h1>
          <p className="text-sm text-[#1C2B2E]/70 mt-3 max-w-2xl mx-auto">
            Kyle trained directly under {MENTOR_NAME} of {MENTOR_AFFILIATION}. The transactions below are {MENTOR_NAME}'s own closed deals, shown here as context for the mentorship behind The Friedman Team's approach.
          </p>
        </div>

        {PAST_TRANSACTIONS.length === 0 && (
          <div className="text-center mb-12">
            <button
              onClick={onOpenConsultation}
              className="inline-flex items-center gap-2 px-8 py-3 bg-[#0D2226] hover:bg-[#0F5C63] text-[#FAF8F5] font-bold text-xs uppercase tracking-widest rounded-xs transition-colors"
            >
              <Phone className="w-4 h-4" />
              Ask Kyle About His Own Sales
            </button>
          </div>
        )}

        <div className="mt-12 grid grid-cols-1 sm:grid-cols-2 gap-8">
          {MENTOR_TRANSACTIONS.map((t, i) => (
            <div key={i}>
              <div className="relative aspect-[4/3] overflow-hidden bg-[#0D2226]/10 flex items-center justify-center border border-[#C9A96A]/20">
                {t.image ? (
                  <img src={t.image} alt={t.address} className="w-full h-full object-cover" />
                ) : (
                  <span className="text-[#1C2B2E]/30 text-xs uppercase tracking-widest">No photo yet</span>
                )}
                <div className="absolute bottom-3 right-3 px-3 py-1 bg-[#C9A96A] text-[#0D2226] text-[10px] font-bold uppercase tracking-widest">
                  Sold
                </div>
              </div>
              <div className="pt-4">
                <div className="font-serif text-xl font-bold text-[#0D2226] uppercase tracking-wide">{t.address}</div>
                <div className="font-semibold text-[#0F5C63] mt-1">{t.priceDisplay}</div>
                <div className="text-xs text-[#1C2B2E]/60 mt-2 uppercase tracking-wide">{t.address}, {t.cityStateZip}</div>
                <div className="flex items-center gap-3 text-xs text-[#1C2B2E]/70 mt-2 font-semibold">
                  <span>{t.beds} Beds</span>
                  <span>|</span>
                  <span>{t.baths} Baths</span>
                  <span>|</span>
                  <span>{t.sqft.toLocaleString()} Sq.Ft.</span>
                </div>
                <div className="text-[10px] uppercase tracking-widest text-[#1C2B2E]/40 font-bold mt-2">
                  Sold by {MENTOR_NAME}
                </div>
              </div>
            </div>
          ))}
        </div>

        <p className="text-[11px] text-[#1C2B2E]/50 text-center mt-12 max-w-2xl mx-auto">
          All transactions above were represented by {MENTOR_NAME}, not Kyle Friedman or The Friedman Team. Shown with {MENTOR_NAME}'s permission as context for Kyle's training and mentorship.
        </p>

      </div>
    </div>
  );
};
