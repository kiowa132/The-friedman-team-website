import React from 'react';
import { usePageMeta } from '../lib/usePageMeta';
import { MENTOR_TRANSACTIONS, MENTOR_NAME, MENTOR_AFFILIATION } from '../data/mentorTransactions';
import { Bed, Bath, Maximize2, Phone } from 'lucide-react';

interface PastTransactionsPageProps {
  onOpenConsultation: () => void;
}

export const PastTransactionsPage: React.FC<PastTransactionsPageProps> = ({ onOpenConsultation }) => {
  usePageMeta(
    'A Proven System | The Friedman Team',
    `The marketing strategy, systems, and process behind The Friedman Team - trained directly under ${MENTOR_NAME}, whose results are shown below.`
  );

  return (
    <div className="pt-28 pb-20 bg-[#0D2226]">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">

        {/* Framed around the system/training, not a claim to these deals -
            results are always attributed to James Buckley by name, on every
            card and in the page copy itself. */}
        <div className="mb-12 text-center max-w-2xl mx-auto">
          <span className="text-[11px] uppercase tracking-[0.25em] text-[#C9A96A] font-bold">A Proven System</span>
          <h1 className="font-serif text-4xl sm:text-5xl font-bold text-[#FAF8F5] mt-2">
            The Marketing Strategy Behind The Friedman Team
          </h1>
          <p className="text-sm text-[#A8B2A1] mt-4 leading-relaxed">
            Kyle trained directly under {MENTOR_NAME} of {MENTOR_AFFILIATION}, and brings that same marketing strategy, systems, and process to every Friedman Team client. The results below are {MENTOR_NAME}'s own closed transactions, shown as real evidence of what that system produces.
          </p>
        </div>

        {MENTOR_TRANSACTIONS.length > 0 && (
          <>
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
              All transactions above were represented by {MENTOR_NAME}, not Kyle Friedman or The Friedman Team. Shown with {MENTOR_NAME}'s permission as real evidence of the training and system behind Kyle's approach.
            </p>
          </>
        )}

        <div className="text-center pt-16">
          <button
            onClick={onOpenConsultation}
            className="inline-flex items-center gap-2 px-8 py-4 bg-[#C9A96A] hover:bg-[#D4AF37] text-[#0D2226] font-bold text-xs uppercase tracking-widest rounded-xs shadow-lg transition-colors"
          >
            <Phone className="w-4 h-4" />
            Put This System to Work For You
          </button>
        </div>

      </div>
    </div>
  );
};
