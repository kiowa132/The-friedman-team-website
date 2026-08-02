import React, { useState, useEffect } from 'react';
import { useParams, useLocation, useNavigate, Link } from 'react-router-dom';
import { Listing } from '../types';
import { fetchMlsListings } from '../lib/mlsApi';
import { ListingCard } from '../components/ListingCard';
import { usePageMeta } from '../lib/usePageMeta';
import {
  ChevronRight, Bed, Bath, Maximize2, Calendar, ShieldCheck, Heart, Share2, Check,
  Calculator, CheckCircle2, DollarSign, Hammer, Car, Home as HomeIcon
} from 'lucide-react';

interface ListingDetailPageProps {
  savedListings: string[];
  onToggleSave: (id: string) => void;
  onScheduleShowing: (listing: Listing) => void;
}

export const ListingDetailPage: React.FC<ListingDetailPageProps> = ({
  savedListings,
  onToggleSave,
  onScheduleShowing,
}) => {
  const { mlsNumber } = useParams<{ mlsNumber: string }>();
  const location = useLocation();
  const navigate = useNavigate();

  const stateListing = (location.state as { listing?: Listing } | null)?.listing;
  const [listing, setListing] = useState<Listing | null>(stateListing || null);
  const [loadStatus, setLoadStatus] = useState<'ok' | 'loading' | 'not_found' | 'error'>(stateListing ? 'ok' : 'loading');
  const [similarListings, setSimilarListings] = useState<Listing[]>([]);

  // If we arrived here via a direct URL or page refresh (no navigation
  // state), re-fetch the listing by its MLS number so the page still
  // works as a real, shareable/bookmarkable URL - not just something that
  // only works when clicked from within the app.
  useEffect(() => {
    if (stateListing) return;
    if (!mlsNumber) {
      setLoadStatus('not_found');
      return;
    }
    let cancelled = false;
    (async () => {
      const result = await fetchMlsListings({ q: mlsNumber, top: 5 });
      if (cancelled) return;
      if (result.status === 'ok') {
        const match = result.listings.find((l) => l.mlsNumber === mlsNumber) || result.listings[0];
        if (match) {
          setListing(match);
          setLoadStatus('ok');
        } else {
          setLoadStatus('not_found');
        }
      } else {
        setLoadStatus('error');
      }
    })();
    return () => { cancelled = true; };
  }, [mlsNumber, stateListing]);

  // Similar properties - same county, nearby price range, excluding this listing
  useEffect(() => {
    if (!listing) return;
    let cancelled = false;
    (async () => {
      const result = await fetchMlsListings({
        county: listing.county,
        minPrice: Math.round(listing.price * 0.75),
        maxPrice: Math.round(listing.price * 1.25),
        top: 8,
      });
      if (cancelled) return;
      if (result.status === 'ok') {
        setSimilarListings(result.listings.filter((l) => l.id !== listing.id).slice(0, 4));
      }
    })();
    return () => { cancelled = true; };
  }, [listing]);

  usePageMeta(
    listing ? `${listing.title} | The Friedman Team` : 'Listing | The Friedman Team',
    listing ? `${listing.formattedPrice} - ${listing.beds} bed, ${listing.baths} bath, ${listing.sqft.toLocaleString()} sq.ft. in ${listing.city}, MD.` : 'View this listing with The Friedman Team.'
  );

  const [copied, setCopied] = useState(false);
  const [showMortgageCalc, setShowMortgageCalc] = useState(false);
  const [downPercent, setDownPercent] = useState(20);
  const [interestRate, setInterestRate] = useState(6.5);
  const [loanYears, setLoanYears] = useState(30);

  const [showingDate, setShowingDate] = useState('');
  const [showingTime, setShowingTime] = useState('Morning');
  const [visitorName, setVisitorName] = useState('');
  const [visitorEmail, setVisitorEmail] = useState('');
  const [visitorPhone, setVisitorPhone] = useState('');
  const [showingSubmitted, setShowingSubmitted] = useState(false);

  if (loadStatus === 'loading') {
    return <div className="pt-32 pb-20 text-center text-sm text-[#1C2B2E]/60">Loading listing...</div>;
  }
  if (loadStatus === 'not_found' || loadStatus === 'error' || !listing) {
    return (
      <div className="pt-32 pb-20 text-center space-y-4">
        <p className="text-sm text-[#1C2B2E]/70">We couldn't find that listing - it may have sold or come off the market.</p>
        <Link to="/listings" className="inline-block px-6 py-3 bg-[#0D2226] text-[#FAF8F5] font-bold text-xs uppercase tracking-widest rounded-xs">
          Search Live Listings
        </Link>
      </div>
    );
  }

  const downPayment = (listing.price * downPercent) / 100;
  const loanAmount = listing.price - downPayment;
  const monthlyRate = interestRate / 100 / 12;
  const totalPayments = loanYears * 12;
  const monthlyPrincipalAndInterest =
    monthlyRate > 0
      ? (loanAmount * monthlyRate * Math.pow(1 + monthlyRate, totalPayments)) / (Math.pow(1 + monthlyRate, totalPayments) - 1)
      : loanAmount / totalPayments;
  const estPropertyTax = listing.taxAnnualAmount ? listing.taxAnnualAmount / 12 : (listing.price * 0.011) / 12;
  const estInsurance = (listing.price * 0.003) / 12;
  const totalEstMonthly = Math.round(monthlyPrincipalAndInterest + estPropertyTax + estInsurance);
  const pricePerSqft = listing.sqft > 0 ? Math.round(listing.price / listing.sqft) : null;

  const handleCopyLink = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 3000);
  };

  const handleShowingSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setShowingSubmitted(true);
  };

  const galleryPreview = listing.gallery.filter((img) => img !== listing.heroImage).slice(0, 4);

  // Additional Information rows - only fields actually present, never a
  // fabricated placeholder for missing data.
  const additionalInfo: Array<[string, string]> = [];
  if (listing.subdivisionName) additionalInfo.push(['Subdivision', listing.subdivisionName]);
  if (listing.architecturalStyle) additionalInfo.push(['Architectural Style', listing.architecturalStyle]);
  if (listing.waterSource) additionalInfo.push(['Water Source', listing.waterSource]);
  if (listing.sewer) additionalInfo.push(['Sewer', listing.sewer]);
  if (listing.zoning) additionalInfo.push(['Zoning', listing.zoning]);
  if (typeof listing.garageSpaces === 'number') additionalInfo.push(['Garage Spaces', String(listing.garageSpaces)]);
  if (typeof listing.daysOnMarket === 'number') additionalInfo.push(['Days on Market', String(listing.daysOnMarket)]);
  if (typeof listing.taxAnnualAmount === 'number') additionalInfo.push(['Annual Taxes', `$${listing.taxAnnualAmount.toLocaleString()}`]);
  if (typeof listing.associationFee === 'number' && listing.associationFee > 0) additionalInfo.push(['HOA Fee', `$${listing.associationFee.toLocaleString()}/mo`]);
  if (listing.listOfficeName) additionalInfo.push(['Listed By', listing.listOfficeName]);

  return (
    <div className="pt-28 pb-20 max-w-6xl mx-auto px-4 sm:px-6">

      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-xs text-[#1C2B2E]/60 mb-6">
        <Link to="/listings" className="hover:text-[#0F5C63] transition-colors">Home Search</Link>
        <ChevronRight className="w-3 h-3" />
        <span className="text-[#0D2226] font-medium">{listing.title}</span>
      </div>

      {/* Photo Grid - Lofty's search feed currently only ever returns one
          photo per listing (confirmed against real raw output), so this
          gracefully shows a single clean photo rather than faking a grid
          with the same image repeated. If Lofty's feed ever returns
          additional photos, the grid below will use them automatically. */}
      <div className={`relative grid grid-cols-1 ${galleryPreview.length > 0 ? 'sm:grid-cols-2' : ''} gap-2 rounded-xs overflow-hidden mb-8`}>
        <div className={`${galleryPreview.length > 0 ? 'sm:row-span-2' : ''} aspect-[16/9] sm:aspect-auto overflow-hidden`}>
          <img src={listing.heroImage} alt={listing.title} className="w-full h-full object-cover" />
        </div>
        {galleryPreview.map((imgUrl, idx) => (
          <div key={idx} className="aspect-[4/3] sm:aspect-auto overflow-hidden hidden sm:block">
            <img src={imgUrl} alt={`${listing.title} ${idx + 2}`} className="w-full h-full object-cover" />
          </div>
        ))}
        <div className="absolute top-4 left-4 bg-[#0F5C63] text-[#FAF8F5] text-xs font-bold uppercase px-3 py-1 border border-[#C9A96A]/40">
          {listing.status}
        </div>
        <div className="absolute top-4 right-4 flex items-center gap-2">
          <button onClick={handleCopyLink} className="w-9 h-9 rounded-full bg-white/90 flex items-center justify-center text-[#0D2226] hover:text-[#0F5C63] transition-colors shadow-md" title="Share Link">
            {copied ? <Check className="w-4 h-4 text-green-600" /> : <Share2 className="w-4 h-4" />}
          </button>
          <button onClick={() => onToggleSave(listing.id)} className={`w-9 h-9 rounded-full bg-white/90 flex items-center justify-center transition-colors shadow-md ${savedListings.includes(listing.id) ? 'text-[#C9A96A]' : 'text-[#0D2226] hover:text-[#0F5C63]'}`} title="Save Listing">
            <Heart className={`w-4 h-4 ${savedListings.includes(listing.id) ? 'fill-current' : ''}`} />
          </button>
        </div>
      </div>

      {/* Beds/Baths/Sqft + Price */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-2">
        <div>
          <h1 className="font-serif text-2xl sm:text-3xl font-bold text-[#0D2226]">{listing.title}</h1>
          <p className="text-xs text-[#1C2B2E]/60 mt-1">MLS #{listing.mlsNumber} • {listing.county}</p>
        </div>
        <div className="text-3xl font-serif font-bold text-[#0D2226]">{listing.formattedPrice}</div>
      </div>

      <div className="flex items-center gap-6 text-sm text-[#0D2226] font-semibold py-4 border-y border-[#C9A96A]/20 mb-8">
        <span className="flex items-center gap-1.5"><Bed className="w-4 h-4 text-[#C9A96A]" /> {listing.beds} Beds</span>
        <span className="flex items-center gap-1.5"><Bath className="w-4 h-4 text-[#C9A96A]" /> {listing.baths} Baths</span>
        <span className="flex items-center gap-1.5"><Maximize2 className="w-4 h-4 text-[#C9A96A]" /> {listing.sqft.toLocaleString()} Sq.Ft.</span>
        {typeof listing.garageSpaces === 'number' && (
          <span className="flex items-center gap-1.5"><Car className="w-4 h-4 text-[#C9A96A]" /> {listing.garageSpaces} Garage</span>
        )}
      </div>

      {/* Mini stat cards */}
      <div className="grid grid-cols-3 gap-3 mb-10">
        <div className="border border-[#C9A96A]/30 rounded-xs p-4 text-center bg-white">
          <DollarSign className="w-4 h-4 text-[#C9A96A] mx-auto mb-1" />
          <div className="text-[10px] uppercase tracking-wider text-[#1C2B2E]/50">Price per Sq.Ft.</div>
          <div className="text-sm font-bold text-[#0D2226] mt-0.5">{pricePerSqft ? `$${pricePerSqft.toLocaleString()}` : '—'}</div>
        </div>
        <div className="border border-[#C9A96A]/30 rounded-xs p-4 text-center bg-white">
          <Hammer className="w-4 h-4 text-[#C9A96A] mx-auto mb-1" />
          <div className="text-[10px] uppercase tracking-wider text-[#1C2B2E]/50">Built In</div>
          <div className="text-sm font-bold text-[#0D2226] mt-0.5">{listing.yearBuilt || '—'}</div>
        </div>
        <div className="border border-[#C9A96A]/30 rounded-xs p-4 text-center bg-white">
          <HomeIcon className="w-4 h-4 text-[#C9A96A] mx-auto mb-1" />
          <div className="text-[10px] uppercase tracking-wider text-[#1C2B2E]/50">Property Type</div>
          <div className="text-sm font-bold text-[#0D2226] mt-0.5">{listing.propertyType}</div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">

        <div className="lg:col-span-7 space-y-6">
          <div>
            <h3 className="text-xs font-bold uppercase tracking-widest text-[#0F5C63]">Overview</h3>
            <p className="text-sm text-[#1C2B2E] leading-relaxed mt-2 font-normal">{listing.description}</p>
          </div>

          {listing.highlights.length > 0 && (
            <div>
              <h3 className="text-xs font-bold uppercase tracking-widest text-[#0F5C63] mb-3">Features & Highlights</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {listing.highlights.map((feat, i) => (
                  <div key={i} className="flex items-start gap-2 text-xs text-[#0D2226] bg-white p-2.5 border border-[#C9A96A]/20 rounded-xs">
                    <ShieldCheck className="w-4 h-4 text-[#C9A96A] shrink-0 mt-0.5" />
                    <span className="font-medium">{feat}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Additional Information - only shows fields that actually came
              back from the feed */}
          <div className="bg-white border border-[#C9A96A]/30 p-4 rounded-xs">
            <h4 className="text-xs font-bold uppercase tracking-widest text-[#0D2226] mb-3">Additional Information</h4>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-y-3 text-xs">
              <div><span className="text-[#0F5C63] block font-semibold">City / Location:</span><span className="font-medium">{listing.city}, MD</span></div>
              <div><span className="text-[#0F5C63] block font-semibold">County:</span><span className="font-medium">{listing.county}</span></div>
              <div><span className="text-[#0F5C63] block font-semibold">Year Built:</span><span className="font-medium">{listing.yearBuilt || '—'}</span></div>
              {additionalInfo.map(([label, value]) => (
                <div key={label}>
                  <span className="text-[#0F5C63] block font-semibold">{label}:</span>
                  <span className="font-medium">{value}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="pt-2">
            <button
              onClick={() => setShowMortgageCalc(!showMortgageCalc)}
              className="text-xs font-bold uppercase tracking-wider text-[#0F5C63] hover:text-[#C9A96A] flex items-center gap-2 border-b border-[#0F5C63] pb-1 transition-colors"
            >
              <Calculator className="w-4 h-4" />
              <span>{showMortgageCalc ? 'Hide' : 'Estimate'} Monthly Payment</span>
            </button>

            {showMortgageCalc && (
              <div className="mt-4 bg-[#0D2226] text-[#FAF8F5] p-5 rounded-xs space-y-4 text-xs">
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-[#A8B2A1] mb-1">Down Payment ({downPercent}%)</label>
                    <input type="range" min={0} max={100} value={downPercent} onChange={(e) => setDownPercent(Number(e.target.value))} className="w-full accent-[#C9A96A]" />
                    <span className="font-bold text-[#C9A96A] mt-1 block">${downPayment.toLocaleString(undefined, { maximumFractionDigits: 0 })}</span>
                  </div>
                  <div>
                    <label className="block text-[#A8B2A1] mb-1">Interest Rate</label>
                    <input type="range" min={3} max={9} step={0.1} value={interestRate} onChange={(e) => setInterestRate(Number(e.target.value))} className="w-full accent-[#C9A96A]" />
                    <span className="font-bold text-[#C9A96A] mt-1 block">{interestRate}%</span>
                  </div>
                  <div>
                    <label className="block text-[#A8B2A1] mb-1">Loan Term ({loanYears} Years)</label>
                    <select value={loanYears} onChange={(e) => setLoanYears(Number(e.target.value))} className="bg-[#1A2E33] border border-[#C9A96A]/40 p-2 text-xs w-full text-[#FAF8F5]">
                      <option value={15}>15-Year Fixed</option>
                      <option value={30}>30-Year Fixed</option>
                    </select>
                  </div>
                </div>
                <div className="pt-3 border-t border-[#FAF8F5]/10 flex items-center justify-between">
                  <div>
                    <span className="text-xs text-[#A8B2A1] block">Estimated Monthly Payment</span>
                    <span className="text-2xl font-serif text-[#C9A96A] font-bold">${totalEstMonthly.toLocaleString()} / mo</span>
                  </div>
                  <span className="text-[10px] text-[#A8B2A1]/70 max-w-xs text-right">
                    {listing.taxAnnualAmount ? 'Includes est. principal, interest, actual property taxes & insurance.' : 'Includes est. principal, interest, estimated property taxes & insurance.'}
                  </span>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Right Column: Showing Request */}
        <div className="lg:col-span-5">
          <div className="lg:sticky lg:top-24 bg-[#0D2226] text-[#FAF8F5] p-6 rounded-xs border border-[#C9A96A]/40">
            <h3 className="font-serif text-2xl font-bold text-[#FAF8F5]">Schedule a Showing</h3>
            <p className="text-xs text-[#A8B2A1] mt-1">Reach out directly to Kyle Friedman to arrange a tour of this property.</p>

            {showingSubmitted ? (
              <div className="my-8 p-6 bg-[#0F5C63] border border-[#C9A96A] rounded-xs text-center space-y-3 animate-fadeIn">
                <CheckCircle2 className="w-12 h-12 text-[#C9A96A] mx-auto" />
                <h4 className="font-serif text-xl font-bold text-[#FAF8F5]">Showing Request Received</h4>
                <p className="text-xs text-[#FAF8F5]/90">Thank you, {visitorName}. Kyle will reach out shortly to confirm your tour of {listing.title}.</p>
              </div>
            ) : (
              <form onSubmit={handleShowingSubmit} className="mt-6 space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-[#C9A96A] uppercase mb-1">Preferred Date</label>
                  <input type="date" required value={showingDate} onChange={(e) => setShowingDate(e.target.value)} className="w-full bg-[#1A2E33] border border-[#FAF8F5]/20 p-2.5 text-xs text-[#FAF8F5] focus:border-[#C9A96A] focus:outline-none" />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-[#C9A96A] uppercase mb-1">Preferred Time of Day</label>
                  <select value={showingTime} onChange={(e) => setShowingTime(e.target.value)} className="w-full bg-[#1A2E33] border border-[#FAF8F5]/20 p-2.5 text-xs text-[#FAF8F5] focus:border-[#C9A96A] focus:outline-none">
                    <option value="Morning">Morning (9:00 AM - 12:00 PM)</option>
                    <option value="Afternoon">Afternoon (12:00 PM - 4:00 PM)</option>
                    <option value="Evening">Evening (4:00 PM - 7:00 PM)</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-[#C9A96A] uppercase mb-1">Full Name *</label>
                  <input type="text" required value={visitorName} onChange={(e) => setVisitorName(e.target.value)} placeholder="e.g. Jonathan Vance" className="w-full bg-[#1A2E33] border border-[#FAF8F5]/20 p-2.5 text-xs text-[#FAF8F5] placeholder-[#A8B2A1]/50 focus:border-[#C9A96A] focus:outline-none" />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-[#C9A96A] uppercase mb-1">Email Address *</label>
                  <input type="email" required value={visitorEmail} onChange={(e) => setVisitorEmail(e.target.value)} placeholder="j.vance@example.com" className="w-full bg-[#1A2E33] border border-[#FAF8F5]/20 p-2.5 text-xs text-[#FAF8F5] placeholder-[#A8B2A1]/50 focus:border-[#C9A96A] focus:outline-none" />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-[#C9A96A] uppercase mb-1">Phone Number *</label>
                  <input type="tel" required value={visitorPhone} onChange={(e) => setVisitorPhone(e.target.value)} placeholder="(443) 789-3101" className="w-full bg-[#1A2E33] border border-[#FAF8F5]/20 p-2.5 text-xs text-[#FAF8F5] placeholder-[#A8B2A1]/50 focus:border-[#C9A96A] focus:outline-none" />
                </div>
                <button type="submit" className="w-full py-3 bg-[#C9A96A] hover:bg-[#D4AF37] text-[#0D2226] font-bold text-xs uppercase tracking-wider rounded-xs transition-all shadow-lg flex items-center justify-center gap-2 mt-4">
                  <Calendar className="w-4 h-4" />
                  <span>Request a Tour</span>
                </button>
              </form>
            )}

            <div className="pt-6 mt-6 border-t border-[#FAF8F5]/10 flex items-center gap-3">
              <div className="w-12 h-12 rounded-full border border-[#C9A96A] overflow-hidden bg-[#0F5C63] shrink-0">
                <img src="/images/kyle-portrait.jpg" alt="Kyle Friedman" className="w-full h-full object-cover" />
              </div>
              <div className="text-xs">
                <div className="font-serif font-bold text-[#FAF8F5] text-sm">Kyle Friedman</div>
                <div className="text-[#C9A96A] font-medium">The Friedman Team, eXp Realty</div>
                <a href="tel:4437893101" className="text-[#A8B2A1] text-[10px] hover:text-[#C9A96A] transition-colors">(443) 789-3101</a>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Similar Properties */}
      {similarListings.length > 0 && (
        <div className="mt-16 pt-10 border-t border-[#C9A96A]/20">
          <h2 className="font-serif text-2xl font-bold text-[#0D2226] mb-6">Similar Properties</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {similarListings.map((l) => (
              <ListingCard
                key={l.id}
                listing={l}
                isSaved={savedListings.includes(l.id)}
                onToggleSave={onToggleSave}
                onSelectListing={(sel) => navigate(`/listings/${encodeURIComponent(sel.mlsNumber || sel.id)}`, { state: { listing: sel } })}
                onScheduleShowing={onScheduleShowing}
              />
            ))}
          </div>
        </div>
      )}

      {/* MLS disclaimer */}
      <p className="text-[10px] text-[#1C2B2E]/50 leading-relaxed mt-16 pt-6 border-t border-[#C9A96A]/10">
        The IDX display contains information sourced from Bright MLS. This data is intended solely for personal, non-commercial use and may not be used for any purpose other than identifying prospective properties for purchase. Information is deemed reliable but not guaranteed accurate by the MLS. Buyers are responsible for independently verifying all information.
      </p>

    </div>
  );
};
