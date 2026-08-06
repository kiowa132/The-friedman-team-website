import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { usePageMeta } from '../lib/usePageMeta';
import { MENTOR_TRANSACTIONS, MENTOR_NAME, MENTOR_AFFILIATION } from '../data/mentorTransactions';
import { Bed, Bath, Maximize2, ChevronRight, Phone, Calculator, TrendingUp } from 'lucide-react';

interface TransactionDetailPageProps {
  onOpenConsultation: () => void;
}

const Stat: React.FC<{ label: string; value: React.ReactNode }> = ({ label, value }) =>
  value === undefined || value === null || value === '' ? null : (
    <div className="flex justify-between py-2 border-b border-[#C9A96A]/15 text-sm">
      <span className="text-[#1C2B2E]/60">{label}</span>
      <span className="font-semibold text-[#0D2226] text-right">{value}</span>
    </div>
  );

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
  const pricePerSqft = t.pricePerSqft ?? (t.sqft > 0 ? Math.round(parseFloat(t.priceDisplay.replace(/[$,]/g, '')) / t.sqft) : null);
  const priceParam = t.priceDisplay.replace(/[$,]/g, '');
  const hasSchoolInfo = t.schoolDistrict || t.elementarySchool || t.middleSchool || t.highSchool;
  const hasAreaLot = t.mlsId || t.yearBuilt || t.architectureStyle || t.lotSizeDisplay || t.county || t.subdivision || t.propertyType;
  const hasInterior = t.fullBaths || t.halfBaths || t.interiorFeatures;
  const hasExterior = t.stories || t.waterSource || t.parking || t.heatType || t.airConditioning || t.sewer || t.exteriorFeatures;
  const hasFinancial = t.taxAnnualDisplay || t.hoaFeeDisplay || pricePerSqft;
  const hasListingInfo = t.listingAgentName || t.closeDate || t.daysOnMarket;

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
          <div className="flex gap-2 mt-2 overflow-x-auto pb-1">
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
        <div className="flex flex-wrap items-center gap-6 mt-6 py-6 border-y border-[#C9A96A]/25 text-sm text-[#1C2B2E]/80 font-semibold">
          <span className="flex items-center gap-2"><Bed className="w-4 h-4 text-[#C9A96A]" /> {t.beds} Beds</span>
          <span className="flex items-center gap-2"><Bath className="w-4 h-4 text-[#C9A96A]" /> {t.baths} Baths</span>
          <span className="flex items-center gap-2"><Maximize2 className="w-4 h-4 text-[#C9A96A]" /> {t.sqft.toLocaleString()} Sq.Ft.</span>
          {t.yearBuilt && <span>Built {t.yearBuilt}</span>}
        </div>

        {/* Description */}
        {t.description && (
          <div className="mt-8">
            <h2 className="text-[11px] uppercase tracking-widest text-[#C9A96A] font-bold mb-3">About This Home</h2>
            <p className="text-sm text-[#1C2B2E]/80 leading-relaxed">{t.description}</p>
          </div>
        )}

        {/* Area & Lot / Interior / Exterior / Financial - each only renders
            if real data exists for it. */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-10 gap-y-8 mt-10">
          {hasAreaLot && (
            <div>
              <h2 className="text-[11px] uppercase tracking-widest text-[#C9A96A] font-bold mb-2">Area &amp; Lot</h2>
              <Stat label="Status" value="Sold" />
              <Stat label="Living Space" value={`${t.sqft.toLocaleString()} Sq.Ft.`} />
              <Stat label="Lot Size" value={t.lotSizeDisplay} />
              <Stat label="MLS ID" value={t.mlsId} />
              <Stat label="Type" value={t.propertyType} />
              <Stat label="Structure" value={t.structureType} />
              <Stat label="Year Built" value={t.yearBuilt} />
              <Stat label="Architecture Style" value={t.architectureStyle} />
              <Stat label="County" value={t.county} />
              <Stat label="Subdivision" value={t.subdivision} />
            </div>
          )}

          {hasSchoolInfo && (
            <div>
              <h2 className="text-[11px] uppercase tracking-widest text-[#C9A96A] font-bold mb-2">Schools</h2>
              <Stat label="School District" value={t.schoolDistrict} />
              <Stat label="Elementary School" value={t.elementarySchool} />
              <Stat label="Middle School" value={t.middleSchool} />
              <Stat label="High School" value={t.highSchool} />
            </div>
          )}

          {hasInterior && (
            <div>
              <h2 className="text-[11px] uppercase tracking-widest text-[#C9A96A] font-bold mb-2">Interior</h2>
              <Stat label="Total Bedrooms" value={t.beds} />
              <Stat label="Full Bathrooms" value={t.fullBaths} />
              <Stat label="Half Bathrooms" value={t.halfBaths} />
              <Stat label="Interior Features" value={t.interiorFeatures} />
            </div>
          )}

          {hasExterior && (
            <div>
              <h2 className="text-[11px] uppercase tracking-widest text-[#C9A96A] font-bold mb-2">Exterior</h2>
              <Stat label="Stories" value={t.stories} />
              <Stat label="Water Source" value={t.waterSource} />
              <Stat label="Sewer" value={t.sewer} />
              <Stat label="Parking" value={t.parking} />
              <Stat label="Heat Type" value={t.heatType} />
              <Stat label="Air Conditioning" value={t.airConditioning} />
              <Stat label="Exterior Features" value={t.exteriorFeatures} />
            </div>
          )}

          {hasFinancial && (
            <div>
              <h2 className="text-[11px] uppercase tracking-widest text-[#C9A96A] font-bold mb-2">Financial</h2>
              <Stat label="Sale Price" value={t.priceDisplay} />
              <Stat label="Price / Sq.Ft." value={pricePerSqft ? `$${pricePerSqft.toLocaleString()}` : undefined} />
              <Stat label="Real Estate Taxes" value={t.taxAnnualDisplay ? `${t.taxAnnualDisplay}${t.taxYear ? ` (${t.taxYear})` : ''}` : undefined} />
              <Stat label="HOA Fee" value={t.hoaFeeDisplay} />
            </div>
          )}

          {hasListingInfo && (
            <div>
              <h2 className="text-[11px] uppercase tracking-widest text-[#C9A96A] font-bold mb-2">Listing Details</h2>
              <Stat label="Listing Agent" value={t.listingAgentName} />
              <Stat label="Listing Office" value={t.listingOfficeName} />
              <Stat label="Close Date" value={t.closeDate} />
              <Stat label="Days on Market" value={t.daysOnMarket} />
            </div>
          )}
        </div>

        {/* Transaction history - explicit, accurate attribution, using the
            specific role and brokerage for this exact deal when known
            (these vary transaction to transaction), falling back to the
            general mentorship line when they aren't. */}
        <div className="mt-10 bg-white border border-[#C9A96A]/30 p-6 sm:p-8">
          <h2 className="text-[11px] uppercase tracking-widest text-[#C9A96A] font-bold mb-3">Transaction History</h2>
          <p className="text-sm text-[#1C2B2E]/80 leading-relaxed">
            {t.mentorRole && t.mentorOfficeAtSale
              ? `Represented as ${t.mentorRole === 'Listing Agent' ? "the seller's" : "the buyer's"} agent by ${MENTOR_NAME}, ${t.mentorOfficeAtSale}.`
              : `Represented by ${MENTOR_NAME}, ${MENTOR_AFFILIATION}.`}
          </p>
        </div>

        {/* Cross-link to Kyle's own calculators, using this property's real
            sale price as the starting point. */}
        <div className="mt-10 grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Link
            to={`/calculators/mortgage?price=${priceParam}`}
            className="flex items-center gap-3 bg-white border border-[#C9A96A]/30 p-5 hover:border-[#0F5C63] transition-colors"
          >
            <Calculator className="w-6 h-6 text-[#0F5C63] shrink-0" />
            <div>
              <div className="font-semibold text-sm text-[#0D2226]">What Would This Cost Today?</div>
              <div className="text-xs text-[#1C2B2E]/60">Estimate a monthly payment at this price</div>
            </div>
          </Link>
          <Link
            to={`/calculators/net-proceeds?price=${priceParam}`}
            className="flex items-center gap-3 bg-white border border-[#C9A96A]/30 p-5 hover:border-[#0F5C63] transition-colors"
          >
            <TrendingUp className="w-6 h-6 text-[#0F5C63] shrink-0" />
            <div>
              <div className="font-semibold text-sm text-[#0D2226]">Selling at This Price?</div>
              <div className="text-xs text-[#1C2B2E]/60">See what you could walk away with</div>
            </div>
          </Link>
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
