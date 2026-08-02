import React, { useState } from 'react';
import { Listing } from '../types';
import { X, MapPin, Bed, Bath, Maximize2, Calendar, ShieldCheck, Heart, Share2, Check, Calculator, Phone, CheckCircle2, DollarSign, Hammer } from 'lucide-react';

interface ListingDetailModalProps {
  listing: Listing | null;
  onClose: () => void;
  isSaved: boolean;
  onToggleSave: (id: string) => void;
  onScheduleConsultation: (listingTitle?: string) => void;
}

export const ListingDetailModal: React.FC<ListingDetailModalProps> = ({
  listing,
  onClose,
  isSaved,
  onToggleSave,
  onScheduleConsultation
}) => {
  if (!listing) return null;

  const [copied, setCopied] = useState(false);
  const [showMortgageCalc, setShowMortgageCalc] = useState(false);
  const [showAllPhotos, setShowAllPhotos] = useState(false);

  const [downPercent, setDownPercent] = useState(20);
  const [interestRate, setInterestRate] = useState(6.5);
  const [loanYears, setLoanYears] = useState(30);

  const [showingDate, setShowingDate] = useState('');
  const [showingTime, setShowingTime] = useState('Morning');
  const [visitorName, setVisitorName] = useState('');
  const [visitorEmail, setVisitorEmail] = useState('');
  const [visitorPhone, setVisitorPhone] = useState('');
  const [showingSubmitted, setShowingSubmitted] = useState(false);

  const downPayment = (listing.price * downPercent) / 100;
  const loanAmount = listing.price - downPayment;
  const monthlyRate = interestRate / 100 / 12;
  const totalPayments = loanYears * 12;
  const monthlyPrincipalAndInterest =
    monthlyRate > 0
      ? (loanAmount * monthlyRate * Math.pow(1 + monthlyRate, totalPayments)) /
        (Math.pow(1 + monthlyRate, totalPayments) - 1)
      : loanAmount / totalPayments;
  const estPropertyTax = (listing.price * 0.011) / 12;
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
    setTimeout(() => {
      setShowingSubmitted(false);
      onClose();
    }, 4000);
  };

  const galleryPreview = listing.gallery.slice(0, 4);

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-[#0D2226]/80 backdrop-blur-md flex items-center justify-center p-2 sm:p-4 lg:p-6 animate-fadeIn">
      <div className="bg-[#FAF8F5] border border-[#C9A96A]/40 rounded-xs w-full max-w-6xl max-h-[92vh] overflow-y-auto shadow-2xl relative flex flex-col text-[#1C2B2E]">

        <div className="sticky top-0 bg-[#0D2226] text-[#FAF8F5] px-6 py-4 flex items-center justify-between border-b border-[#C9A96A]/30 z-20">
          <div>
            <span className="text-[10px] text-[#C9A96A] font-bold uppercase tracking-widest">
              MLS #{listing.mlsNumber} • {listing.county}
            </span>
            <h2 className="font-serif text-xl sm:text-2xl font-bold tracking-tight text-[#FAF8F5]">
              {listing.title}
            </h2>
          </div>

          <div className="flex items-center gap-2">
            <button onClick={handleCopyLink} className="p-2 text-[#FAF8F5]/80 hover:text-[#C9A96A] transition-colors" title="Share Link">
              {copied ? <Check className="w-5 h-5 text-green-400" /> : <Share2 className="w-5 h-5" />}
            </button>
            <button onClick={() => onToggleSave(listing.id)} className={`p-2 transition-colors ${isSaved ? 'text-[#C9A96A]' : 'text-[#FAF8F5]/80 hover:text-[#C9A96A]'}`} title="Save Listing">
              <Heart className={`w-5 h-5 ${isSaved ? 'fill-current' : ''}`} />
            </button>
            <button onClick={onClose} className="p-2 text-[#FAF8F5]/80 hover:text-[#C9A96A] transition-colors" aria-label="Close modal" id="close-listing-modal">
              <X className="w-6 h-6" />
            </button>
          </div>
        </div>

        <div className="p-6 space-y-8">

          <div className="relative grid grid-cols-1 sm:grid-cols-2 gap-2 rounded-xs overflow-hidden">
            <div className="sm:row-span-2 aspect-[4/3] sm:aspect-auto overflow-hidden">
              <img src={listing.heroImage} alt={listing.title} className="w-full h-full object-cover" />
            </div>
            {galleryPreview.map((imgUrl, idx) => (
              <div key={idx} className="aspect-[4/3] sm:aspect-auto overflow-hidden hidden sm:block">
                <img src={imgUrl} alt={`${listing.title} ${idx + 2}`} className="w-full h-full object-cover" />
              </div>
            ))}
            {listing.gallery.length > 4 && (
              <button
                onClick={() => setShowAllPhotos(true)}
                className="absolute bottom-4 right-4 bg-white text-[#0D2226] text-xs font-bold uppercase tracking-wider px-4 py-2.5 rounded-xs shadow-lg hover:bg-[#FAF8F5] transition-colors"
              >
                All Photos ({listing.gallery.length})
              </button>
            )}
            <div className="absolute top-4 left-4 bg-[#0F5C63] text-[#FAF8F5] text-xs font-bold uppercase px-3 py-1 border border-[#C9A96A]/40">
              {listing.status}
            </div>
          </div>

          {showAllPhotos && (
            <div className="fixed inset-0 z-[70] bg-[#0D2226]/95 flex items-center justify-center p-4" onClick={() => setShowAllPhotos(false)}>
              <button onClick={() => setShowAllPhotos(false)} className="absolute top-5 right-5 text-white p-2" aria-label="Close photo gallery">
                <X className="w-7 h-7" />
              </button>
              <div className="max-w-4xl w-full max-h-[85vh] overflow-y-auto grid grid-cols-1 sm:grid-cols-2 gap-3" onClick={(e) => e.stopPropagation()}>
                {[listing.heroImage, ...listing.gallery].map((img, i) => (
                  <img key={i} src={img} alt={`${listing.title} photo ${i + 1}`} className="w-full rounded-xs" />
                ))}
              </div>
            </div>
          )}

          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-6 text-sm text-[#0D2226] font-semibold">
              <span className="flex items-center gap-1.5"><Bed className="w-4 h-4 text-[#C9A96A]" /> {listing.beds} Beds</span>
              <span className="flex items-center gap-1.5"><Bath className="w-4 h-4 text-[#C9A96A]" /> {listing.baths} Baths</span>
              <span className="flex items-center gap-1.5"><Maximize2 className="w-4 h-4 text-[#C9A96A]" /> {listing.sqft.toLocaleString()} Sq.Ft.</span>
            </div>
            <div className="text-3xl font-serif font-bold text-[#0D2226]">{listing.formattedPrice}</div>
          </div>

          <div className="grid grid-cols-3 gap-3">
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
              <Maximize2 className="w-4 h-4 text-[#C9A96A] mx-auto mb-1" />
              <div className="text-[10px] uppercase tracking-wider text-[#1C2B2E]/50">Property Size</div>
              <div className="text-sm font-bold text-[#0D2226] mt-0.5">{listing.sqft.toLocaleString()} Sq.Ft.</div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">

            <div className="lg:col-span-7 space-y-6">
              <div>
                <h3 className="text-xs font-bold uppercase tracking-widest text-[#0F5C63]">Property Overview</h3>
                <p className="text-sm text-[#1C2B2E] leading-relaxed mt-2 font-normal">{listing.description}</p>
              </div>

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

              <div className="bg-white border border-[#C9A96A]/30 p-4 rounded-xs">
                <h4 className="text-xs font-bold uppercase tracking-widest text-[#0D2226] mb-3">Property Details</h4>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-y-3 text-xs">
                  <div><span className="text-[#0F5C63] block font-semibold">City / Location:</span><span className="font-medium">{listing.city}, MD</span></div>
                  <div><span className="text-[#0F5C63] block font-semibold">County:</span><span className="font-medium">{listing.county}</span></div>
                  <div><span className="text-[#0F5C63] block font-semibold">Year Built:</span><span className="font-medium">{listing.yearBuilt}</span></div>
                  <div><span className="text-[#0F5C63] block font-semibold">Property Type:</span><span className="font-medium">{listing.propertyType}</span></div>
                  <div><span className="text-[#0F5C63] block font-semibold">MLS ID:</span><span className="font-medium">{listing.mlsNumber}</span></div>
                  <div><span className="text-[#0F5C63] block font-semibold">Status:</span><span className="font-medium">{listing.status}</span></div>
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
                      <span className="text-[10px] text-[#A8B2A1]/70 max-w-xs text-right">Includes est. principal, interest, property taxes & insurance.</span>
                    </div>
                  </div>
                )}
              </div>
            </div>

            <div className="lg:col-span-5">
              <div className="lg:sticky lg:top-24 bg-[#0D2226] text-[#FAF8F5] p-6 rounded-xs border border-[#C9A96A]/40 flex flex-col justify-between">
                <div>
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
                      <button type="submit" id="submit-showing-req" className="w-full py-3 bg-[#C9A96A] hover:bg-[#D4AF37] text-[#0D2226] font-bold text-xs uppercase tracking-wider rounded-xs transition-all shadow-lg flex items-center justify-center gap-2 mt-4">
                        <Calendar className="w-4 h-4" />
                        <span>Request a Tour</span>
                      </button>
                    </form>
                  )}
                </div>

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

        </div>

      </div>
    </div>
  );
};
