import React from 'react';
import { usePageMeta } from '../lib/usePageMeta';
import { PAST_TRANSACTIONS } from '../data/pastTransactions';
import { Bed, Bath, Maximize2, Phone } from 'lucide-react';

interface PastTransactionsPageProps {
  onOpenConsultation: () => void;
}

export const PastTransactionsPage: React.FC<PastTransactionsPageProps> = ({ onOpenConsultation }) => {
  usePageMeta(
    'Past Transactions | The Friedman Team',
    "A record of homes Kyle Friedman has personally represented as listing agent or buyer's agent across Carroll, Baltimore, Howard, and Frederick counties."
  );

  return (
    <div className="pt-28 pb-20 bg-[#FAF8F5]">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="mb-12 text-center">
          <span className="text-[11px] uppercase tracking-[0.25em] text-[#C9A96A] font-bold">Track Record</span>
          <h1 className="font-serif text-4xl sm:text-5xl font-bold text-[#0D2226] mt-2">Past Transactions</h1>
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
      </div>
    </div>
  );
};
