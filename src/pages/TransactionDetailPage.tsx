import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { usePageMeta } from '../lib/usePageMeta';
import { MENTOR_TRANSACTIONS, MENTOR_NAME, MENTOR_AFFILIATION } from '../data/mentorTransactions';
import { Bed, Bath, Maximize2, ChevronRight, Phone } from 'lucide-react';

interface TransactionDetailPageProps {
  onOpenConsultation: () => void;
}

export const TransactionDetailPage: React.FC<TransactionDetailPageProps> = ({ onOpenConsultation }) => {
  const { slug } = useParams<{ slug: string }>();
  const transaction = MENTOR_TRANSACTIONS.find((t) => t.slug === slug);
  const [activeImage, setActiveImage] = useState(0);

  usePageMeta(
    transaction ? `${transaction.address}, ${transaction.cityStateZip} | The Friedman Team` : 'Transaction | The Friedman Team',
    transaction ? `${transaction.address} sold for ${transaction.priceDisplay}.` : ''
  );

  if (!transaction) {
    return (
      <div className="pt-32 pb-20 text-center space-y-4">
        <p className="text-sm text-[#1C2B2E]/70">We couldn't find that transaction.</p>
        <Link to="/past-transactions" className="inline-block px-6 py-3 bg-[#0D2226] text-[#FAF8F5] font-bold text-xs uppercase tracking-widest rounded-xs">
          Back to Experience &amp; Transactions
        </Link>
      </div>
    );
  }

  const t = transaction;
  const gallery = t.image ? [t.image, ...(t.images || [])] : (t.images || []);
  const pricePerSqft = t.sqft > 0 ? Math.round(parseFloat(t.priceDisplay.replace(/[$,]/g, '')) / t.sqft) : null;

  return (
    <div className="pt-28 pb-20 bg-[#FAF8F5]">
      <div className="max-w-4xl mx-auto px-4 sm:px-6">

        <div className="flex items-center gap-2 text-xs text-[#1C2B2E]/60 mb-6">
          <Link to="/past-transactions" className="hover:text-[#0F5C63] transition-colors">Experience &amp; Transactions</Link>
          <ChevronRight className="w-3 h-3" />
          <span>{t.address}</span>
        </div>

        {/* Photo gallery */}
        <div className="relative aspect-[16/10] overflow-hidden bg-[#0D2226]/10 border border-[#C9A96A]/20 flex items-center justify-center">
          {gallery.length > 0 ? (
            <img src={gallery[activeImage]} alt={t.address} className="w-full h-full object-cover" />
          ) : (
            <span className="text-[#1C2B2E]/30 text-sm uppercase tracking-widest">No photo yet</span>
          )}
          <div className="absolute bottom-4 right-4 px-3 py-1.5 bg-[#C9A96A] text-[#0D2226] text-xs font-bold uppercase tracking-widest">
            Sold
          </div>
        </div>
        {gallery.length > 1 && (
          <div className="flex gap-2 mt-2">
            {gallery.map((img, i) => (
              <button
                key={i}
                onClick={() => setActiveImage(i)}
                className={`w-16 h-16 shrink-0 overflow-hidden border-2 transition-colors ${i === activeImage ? 'border-[#C9A96A]' : 'border-transparent'}`}
              >
                <img src={img} alt="" loading="lazy" className="w-full h-full object-cover" />
              </button>
            ))}
          </div>
        )}

        {/* Address & price */}
        <div className="mt-8 flex flex-wrap items-start justify-between gap-4">
          <div>
            <h1 className="font-serif text-3xl sm:text-4xl font-bold text-[#0D2226]">{t.address}</h1>
            <p className="text-sm text-[#1C2B2E]/60 mt-1">{t.cityStateZip}</p>
          </div>
          <div className="text-3xl font-bold text-[#0F5C63] font-serif">{t.priceDisplay}</div>
        </div>

        {/* Property overview */}
        <div className="flex items-center gap-6 mt-6 py-6 border-y border-[#C9A96A]/25 text-sm text-[#1C2B2E]/80 font-semibold">
          <span className="flex items-center gap-2"><Bed className="w-4 h-4 text-[#C9A96A]" /> {t.beds} Beds</span>
          <span className="flex items-center gap-2"><Bath className="w-4 h-4 text-[#C9A96A]" /> {t.baths} Baths</span>
          <span className="flex items-center gap-2"><Maximize2 className="w-4 h-4 text-[#C9A96A]" /> {t.sqft.toLocaleString()} Sq.Ft.</span>
        </div>

        {/* Market snapshot - only real, directly computed figures (price
            per sqft from the actual sale price and sqft above), never a
            fabricated trend or narrative for a market outside where Kyle
            actually tracks data. */}
        {pricePerSqft && (
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mt-6">
            <div className="bg-white border border-[#C9A96A]/30 p-4">
              <div className="text-[10px] uppercase tracking-widest text-[#1C2B2E]/50 font-bold mb-1">Sale Price</div>
              <div className="font-serif text-lg font-bold text-[#0D2226]">{t.priceDisplay}</div>
            </div>
            <div className="bg-white border border-[#C9A96A]/30 p-4">
              <div className="text-[10px] uppercase tracking-widest text-[#1C2B2E]/50 font-bold mb-1">Price / Sq.Ft.</div>
              <div className="font-serif text-lg font-bold text-[#0D2226]">${pricePerSqft.toLocaleString()}</div>
            </div>
            <div className="bg-white border border-[#C9A96A]/30 p-4">
              <div className="text-[10px] uppercase tracking-widest text-[#1C2B2E]/50 font-bold mb-1">Status</div>
              <div className="font-serif text-lg font-bold text-[#0D2226]">Sold</div>
            </div>
          </div>
        )}

        {/* Transaction history - explicit, accurate attribution */}
        <div className="mt-10 bg-white border border-[#C9A96A]/30 p-6 sm:p-8">
          <h2 className="text-[11px] uppercase tracking-widest text-[#C9A96A] font-bold mb-3">Transaction History</h2>
          <p className="text-sm text-[#1C2B2E]/80 leading-relaxed">
            Represented by {MENTOR_NAME}, {MENTOR_AFFILIATION}.
          </p>
        </div>

        <div className="mt-10 bg-[#0D2226] text-[#FAF8F5] p-8 text-center">
          <h2 className="font-serif text-2xl font-bold mb-3">Thinking About Buying or Selling?</h2>
          <p className="text-sm text-[#A8B2A1] max-w-lg mx-auto mb-6">
            Talk to Kyle directly about strategy, pricing, and what it takes to get a deal like this done.
          </p>
          <button
            onClick={onOpenConsultation}
            className="inline-flex items-center gap-2 px-8 py-3 bg-[#C9A96A] hover:bg-[#D4AF37] text-[#0D2226] font-bold text-xs uppercase tracking-widest transition-colors"
          >
            <Phone className="w-4 h-4" />
            Talk to Kyle
          </button>
        </div>

      </div>
    </div>
  );
};
