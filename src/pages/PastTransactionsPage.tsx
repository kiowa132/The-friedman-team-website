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
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-1 gap-y-10">
              {PAST_TRANSACTIONS.map((t, i) => (
                <div key={i} className="group relative h-[460px] overflow-hidden">
                  {t.image ? (
                    <img src={t.image} alt={t.address} className="absolute inset-0 w-full h-full object-cover transition-all duration-500 group-hover:scale-105 group-hover:brightness-[0.5]" />
                  ) : (
                    <div className="absolute inset-0 w-full h-full flex items-center justify-center bg-[#0D2226]">
                      <img src="/images/brand/friedman-f-mark.png" alt="" className="h-16 w-auto opacity-40" />
                    </div>
                  )}
                  <div className="absolute top-4 left-4 px-2.5 py-1 bg-[#0D2226] text-[#C9A96A] text-[10px] font-bold uppercase tracking-widest">
                    Sold
                  </div>
                  {/* Caption overlay - always present at the bottom of the
                      full-height image (never a separate box below it, so
                      the card's total height never changes). Small and
                      white by default; on hover it grows taller with a
                      dark scrim and reveals the extra details, but always
                      fully covers down to the card's bottom edge, so
                      there's never a gap of bare image or blank space. */}
                  <div className="absolute inset-x-0 bottom-0 bg-white group-hover:bg-transparent group-hover:bg-gradient-to-t group-hover:from-black/90 group-hover:via-black/60 group-hover:to-transparent px-5 py-5 group-hover:pt-20 transition-all duration-300">
                    <div className="font-serif text-lg font-bold text-[#0D2226] group-hover:text-white transition-colors">{t.address}</div>
                    <div className="text-xs text-[#1C2B2E]/60 group-hover:text-white/70 transition-colors mb-2">{t.city}, {t.county}</div>
                    <div className="flex items-center justify-between mb-1 group-hover:mb-3 transition-all">
                      <span className="font-semibold text-[#0F5C63] group-hover:text-[#C9A96A] transition-colors">{t.priceDisplay}</span>
                      <span className="text-[11px] text-[#1C2B2E]/50 group-hover:text-white/60 transition-colors">{t.soldDate}</span>
                    </div>
                    {(t.beds || t.baths || t.sqft) && (
                      <div className="hidden group-hover:flex items-center gap-3 text-xs text-white/80 mb-2">
                        {t.beds && <span className="flex items-center gap-1"><Bed className="w-3.5 h-3.5" /> {t.beds}</span>}
                        {t.baths && <span className="flex items-center gap-1"><Bath className="w-3.5 h-3.5" /> {t.baths}</span>}
                        {t.sqft && <span className="flex items-center gap-1"><Maximize2 className="w-3.5 h-3.5" /> {t.sqft.toLocaleString()} sqft</span>}
                      </div>
                    )}
                    <div className="text-[10px] uppercase tracking-widest text-[#C9A96A] font-bold">{t.role}</div>
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

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-1 gap-y-10">
          {MENTOR_TRANSACTIONS.map((t, i) => (
            <Link key={i} to={`/transactions/${t.slug}`} className="group block relative h-[460px] overflow-hidden">
              {t.image ? (
                <img src={t.image} alt={t.address} loading="lazy" className="absolute inset-0 w-full h-full object-cover transition-all duration-500 group-hover:scale-105 group-hover:brightness-[0.5]" />
              ) : (
                <div className="absolute inset-0 w-full h-full flex items-center justify-center bg-[#0D2226]">
                  <span className="text-[#A8B2A1]/40 text-xs uppercase tracking-widest">No photo yet</span>
                </div>
              )}
              <div className="absolute top-4 left-4 px-2.5 py-1 bg-[#0D2226] text-[#C9A96A] text-[10px] font-bold uppercase tracking-widest">
                Sold
              </div>
              {/* Caption overlay - always covers the bottom of the image,
                  grows and darkens on hover, never leaves blank space
                  since the card's total height never changes. */}
              <div className="absolute inset-x-0 bottom-0 bg-white group-hover:bg-transparent group-hover:bg-gradient-to-t group-hover:from-black/90 group-hover:via-black/60 group-hover:to-transparent px-5 py-5 group-hover:pt-20 transition-all duration-300">
                <div className="font-serif text-lg font-bold text-[#0D2226] group-hover:text-white transition-colors">{t.address}</div>
                <div className="text-xs text-[#1C2B2E]/60 group-hover:text-white/70 transition-colors mb-2">{t.cityStateZip}</div>
                <div className="font-semibold text-[#0F5C63] group-hover:text-[#C9A96A] transition-colors mb-1 group-hover:mb-3">{t.priceDisplay}</div>
                <div className="hidden group-hover:flex items-center gap-3 text-xs text-white/80 mb-2">
                  <span className="flex items-center gap-1"><Bed className="w-3.5 h-3.5" /> {t.beds}</span>
                  <span className="flex items-center gap-1"><Bath className="w-3.5 h-3.5" /> {t.baths}</span>
                  <span className="flex items-center gap-1"><Maximize2 className="w-3.5 h-3.5" /> {t.sqft.toLocaleString()} sqft</span>
                </div>
                <div className="text-[11px] text-[#1C2B2E]/45 group-hover:text-white/60 transition-colors">
                  {t.mentorRole && t.mentorOfficeAtSale
                    ? `${t.mentorRole === 'Listing Agent' ? "Seller's" : "Buyer's"} agent: ${MENTOR_NAME}`
                    : `Transaction completed by ${MENTOR_NAME}`}
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
