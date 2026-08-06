import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { usePageMeta } from '../lib/usePageMeta';
import { MENTOR_TRANSACTIONS, MENTOR_NAME, MENTOR_AFFILIATION } from '../data/mentorTransactions';
import { MARYLAND_COUNTIES } from '../lib/calculators';
import { EmbeddedHomeSaleEstimate } from '../components/EmbeddedHomeSaleEstimate';
import { EmbeddedAffordabilityEstimate } from '../components/EmbeddedAffordabilityEstimate';
import { KyleContactCard } from '../components/KyleContactCard';
import { Bed, Bath, Maximize2, ChevronRight, ChevronLeft, Phone, MapPin } from 'lucide-react';

interface TransactionDetailPageProps {
  onOpenConsultation: () => void;
}

// A single stat row, spacious and editorial like the reference - bold caps
// label on the left, plain value on the right, a hairline divider under
// each. Only renders when the value is actually present.
const Stat: React.FC<{ label: string; value: React.ReactNode }> = ({ label, value }) =>
  value === undefined || value === null || value === '' ? null : (
    <div className="flex justify-between items-baseline py-3.5 border-b border-[#C9A96A]/20">
      <span className="text-xs font-bold uppercase tracking-widest text-[#1C2B2E]/70">{label}</span>
      <span className="text-sm text-[#0D2226] text-right">{value}</span>
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
  const numericPrice = parseFloat(t.priceDisplay.replace(/[$,]/g, ''));
  const hasSchoolInfo = t.schoolDistrict || t.elementarySchool || t.middleSchool || t.highSchool;
  const hasExterior = t.stories || t.waterSource || t.parking || t.heatType || t.airConditioning || t.sewer || t.exteriorFeatures;
  const hasFinancial = t.taxAnnualDisplay || t.hoaFeeDisplay || pricePerSqft;
  const hasListingInfo = t.listingAgentName || t.closeDate || t.daysOnMarket;

  const mdCountyName = t.county?.replace(', MD', '').trim();
  const matchingMdCounty = MARYLAND_COUNTIES.find((c) => c.name === mdCountyName);
  const mapsUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(`${t.address}, ${t.cityStateZip}`)}`;

  const nextImage = () => setActiveImage((i) => (i + 1) % gallery.length);
  const prevImage = () => setActiveImage((i) => (i - 1 + gallery.length) % gallery.length);

  return (
    <div className="pt-28 pb-20 bg-[#FAF8F5]">
      <div className="max-w-5xl mx-auto px-4 sm:px-6">

        <div className="flex items-center gap-2 text-xs text-[#1C2B2E]/60 mb-6">
          <Link to="/past-transactions" className="hover:text-[#0F5C63] transition-colors">Experience &amp; Transactions</Link>
          <ChevronRight className="w-3 h-3" />
          <span>{t.address}</span>
        </div>

        {/* Header: address/price/photo navigation sit above the photo,
            matching the reference's layout, rather than being buried
            below a small boxed image. */}
        <div className="flex flex-wrap items-start justify-between gap-6 mb-4">
          <div>
            <p className="text-xs uppercase tracking-widest text-[#1C2B2E]/50 mb-1">{t.address}, {t.cityStateZip}</p>
            <h1 className="font-serif text-4xl sm:text-5xl font-bold text-[#0D2226] leading-none">{t.address}</h1>
            {gallery.length > 1 && (
              <div className="flex items-center gap-3 mt-4">
                <button onClick={prevImage} className="w-9 h-9 rounded-full bg-[#0D2226] text-[#FAF8F5] flex items-center justify-center hover:bg-[#0F5C63] transition-colors">
                  <ChevronLeft className="w-4 h-4" />
                </button>
                <span className="text-sm text-[#1C2B2E]/60 tabular-nums">{activeImage + 1} / {gallery.length}</span>
                <button onClick={nextImage} className="w-9 h-9 rounded-full bg-[#0D2226] text-[#FAF8F5] flex items-center justify-center hover:bg-[#0F5C63] transition-colors">
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            )}
          </div>
          <div className="text-right">
            <div className="text-3xl sm:text-4xl font-bold text-[#0F5C63] font-serif">{t.priceDisplay}</div>
            <a href={mapsUrl} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1.5 text-xs text-[#1C2B2E]/60 hover:text-[#0F5C63] mt-2 transition-colors">
              <MapPin className="w-3.5 h-3.5" />
              View on map
            </a>
          </div>
        </div>

        {/* Large, full-bleed photo */}
        <div className="relative aspect-[16/10] overflow-hidden bg-[#0D2226]/10">
          {gallery.length > 0 ? (
            <img src={gallery[activeImage]} alt={t.address} className="w-full h-full object-cover" />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <span className="text-[#1C2B2E]/30 text-sm uppercase tracking-widest">No photo yet</span>
            </div>
          )}
          <div className="absolute bottom-4 right-4 px-3 py-1.5 bg-[#C9A96A] text-[#0D2226] text-xs font-bold uppercase tracking-widest">
            Sold
          </div>
        </div>
        {t.listingOfficeName && (
          <p className="text-xs text-[#1C2B2E]/40 mt-2">Courtesy of {t.listingOfficeName}</p>
        )}

        {/* Description - sized to actually read as the lead editorial
            copy on the page, not a small caption. */}
        {t.description && (
          <div className="mt-10 max-w-3xl">
            <p className="text-base sm:text-lg text-[#1C2B2E]/85 leading-relaxed">{t.description}</p>
          </div>
        )}

        {/* Big, spacious stat rows, matching the reference's scale */}
        <div className="mt-8 grid grid-cols-1 sm:grid-cols-3 gap-x-8 border-t border-[#C9A96A]/25">
          <div className="flex items-center gap-2 py-4 border-b border-[#C9A96A]/25 text-sm font-semibold text-[#0D2226]">
            <Bed className="w-4 h-4 text-[#C9A96A]" /> {t.beds} Beds
          </div>
          <div className="flex items-center gap-2 py-4 border-b border-[#C9A96A]/25 text-sm font-semibold text-[#0D2226] sm:border-l sm:pl-8">
            <Bath className="w-4 h-4 text-[#C9A96A]" /> {t.fullBaths || t.baths} Full Baths{t.halfBaths ? `, ${t.halfBaths} Half` : ''}
          </div>
          <div className="flex items-center gap-2 py-4 border-b border-[#C9A96A]/25 text-sm font-semibold text-[#0D2226] sm:border-l sm:pl-8">
            <Maximize2 className="w-4 h-4 text-[#C9A96A]" /> {t.sqft.toLocaleString()} Sq.Ft.
          </div>
          <div className="py-4 border-b border-[#C9A96A]/25 text-sm font-semibold text-[#0D2226]">Sold</div>
          <div className="py-4 border-b border-[#C9A96A]/25 text-sm font-semibold text-[#0D2226] sm:border-l sm:pl-8">
            {t.yearBuilt ? `${t.yearBuilt} Built` : '\u2014'}
          </div>
          <div className="py-4 border-b border-[#C9A96A]/25 text-sm font-semibold text-[#0D2226] sm:border-l sm:pl-8">
            {t.lotSizeDisplay || '\u2014'}
          </div>
        </div>

        {/* Kyle's own contact card - standard lead-capture practice on any
            property page, including ones representing another agent's
            deal. The per-transaction attribution (who actually handled
            this specific deal) is folded into the card itself as a
            distinct labeled block, rather than a separate section, since
            the card already covers it. */}
        <div className="mt-10">
          <KyleContactCard
            onCtaClick={onOpenConsultation}
            ctaLabel="Talk to Kyle"
            dealContextText={
              t.mentorRole && t.mentorOfficeAtSale
                ? `${MENTOR_NAME} represented ${t.mentorRole === 'Listing Agent' ? 'the seller' : 'the buyer'} on this transaction. Kyle Friedman trained directly under ${MENTOR_NAME}, and this deal is shown as context for that mentorship, not as part of Kyle's or The Friedman Team's own sales record.`
                : `Kyle Friedman trained directly under ${MENTOR_NAME}. This deal is shown as context for that mentorship, not as part of Kyle's or The Friedman Team's own sales record.`
            }
          />
        </div>

        {/* Features & Amenities - big, spacious, matching the reference's
            scale, with Area & Lot and Interior as the two primary columns
            and any additional real data (Schools, Exterior, Financial,
            Listing Details) following underneath. */}
        <div className="mt-16">
          <h2 className="font-serif text-3xl sm:text-4xl font-bold text-[#0D2226] mb-10">Features &amp; Amenities</h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-16">
            <div>
              <h3 className="text-lg font-serif font-bold text-[#0D2226] mb-3">Area &amp; Lot</h3>
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
              {hasSchoolInfo && (
                <>
                  <Stat label="School District" value={t.schoolDistrict} />
                  <Stat label="Elementary School" value={t.elementarySchool} />
                  <Stat label="Middle School" value={t.middleSchool} />
                  <Stat label="High School" value={t.highSchool} />
                </>
              )}
            </div>

            <div>
              <h3 className="text-lg font-serif font-bold text-[#0D2226] mb-3 mt-10 sm:mt-0">Interior</h3>
              <Stat label="Total Bedrooms" value={t.beds} />
              <Stat label="Full Bathrooms" value={t.fullBaths} />
              <Stat label="Half Bathrooms" value={t.halfBaths} />
              <Stat label="Interior Features" value={t.interiorFeatures} />

              {hasExterior && (
                <>
                  <h3 className="text-lg font-serif font-bold text-[#0D2226] mb-3 mt-10">Exterior</h3>
                  <Stat label="Stories" value={t.stories} />
                  <Stat label="Water Source" value={t.waterSource} />
                  <Stat label="Sewer" value={t.sewer} />
                  <Stat label="Parking" value={t.parking} />
                  <Stat label="Heat Type" value={t.heatType} />
                  <Stat label="Air Conditioning" value={t.airConditioning} />
                  <Stat label="Exterior Features" value={t.exteriorFeatures} />
                </>
              )}
            </div>
          </div>

          {(hasFinancial || hasListingInfo) && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-16 mt-10">
              {hasFinancial && (
                <div>
                  <h3 className="text-lg font-serif font-bold text-[#0D2226] mb-3">Financial</h3>
                  <Stat label="Sale Price" value={t.priceDisplay} />
                  <Stat label="Price / Sq.Ft." value={pricePerSqft ? `$${pricePerSqft.toLocaleString()}` : undefined} />
                  <Stat label="Real Estate Taxes" value={t.taxAnnualDisplay ? `${t.taxAnnualDisplay}${t.taxYear ? ` (${t.taxYear})` : ''}` : undefined} />
                  <Stat label="HOA Fee" value={t.hoaFeeDisplay} />
                </div>
              )}
              {hasListingInfo && (
                <div>
                  <h3 className="text-lg font-serif font-bold text-[#0D2226] mb-3 mt-10 sm:mt-0">Listing Details</h3>
                  <Stat label="Listing Agent" value={t.listingAgentName} />
                  <Stat label="Listing Office" value={t.listingOfficeName} />
                  <Stat label="Close Date" value={t.closeDate} />
                  <Stat label="Days on Market" value={t.daysOnMarket} />
                </div>
              )}
            </div>
          )}
        </div>

        {/* Live, embedded calculators - Home Sale and Affordability, the
            same pairing shown on comparable sites, pre-filled with this
            property's real price where relevant. */}
        <div className="mt-16">
          <EmbeddedHomeSaleEstimate initialPrice={numericPrice} mdCountyName={matchingMdCounty?.name} />
          <EmbeddedAffordabilityEstimate />
        </div>

      </div>
    </div>
  );
};
