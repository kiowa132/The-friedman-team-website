import React, { useState } from 'react';
import { X, Calculator, ShieldCheck, Sparkles, CheckCircle2, ArrowRight, Building2, MapPin, DollarSign, AlertCircle } from 'lucide-react';
import { submitLead } from '../lib/leads';

interface HomeValuationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectConsultation: () => void;
}

export const HomeValuationModal: React.FC<HomeValuationModalProps> = ({
  isOpen,
  onClose,
  onSelectConsultation
}) => {
  if (!isOpen) return null;

  const [step, setStep] = useState(1);
  const [address, setAddress] = useState('');
  const [city, setCity] = useState('');
  const [county, setCounty] = useState('Carroll County');
  const [propertyType, setPropertyType] = useState('Single-Family Home');
  const [sqft, setSqft] = useState(2200);
  const [acreage, setAcreage] = useState(0.25);
  const [upgrades, setUpgrades] = useState<string[]>([]);
  
  // Owner details
  const [ownerName, setOwnerName] = useState('');
  const [ownerEmail, setOwnerEmail] = useState('');
  const [ownerPhone, setOwnerPhone] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const upgradeOptions = [
    'Renovated Kitchen',
    'Finished Basement',
    'New Roof (within 5 years)',
    'Updated HVAC System',
    'Deck / Patio',
    'Swimming Pool',
    'Attached Garage',
    'Solar Panels'
  ];

  const toggleUpgrade = (item: string) => {
    if (upgrades.includes(item)) {
      setUpgrades(upgrades.filter((u) => u !== item));
    } else {
      setUpgrades([...upgrades, item]);
    }
  };

  const submitValuationRequest = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitError(null);

    // No price estimate is calculated or shown here, on purpose. A $/sqft
    // formula was tested and produced a wildly wrong number (a $1.6M estimate
    // on an actual $375K property) - there's no safe way to calibrate a
    // generic formula to every property, so this now only collects details
    // and routes them to Kyle for a real, comp-based valuation.
    const details = [
      `Property: ${address}, ${city}, ${county}`,
      `Type: ${propertyType} | ${sqft} sqft | ${acreage} acres`,
      upgrades.length ? `Notable features: ${upgrades.join(', ')}` : null,
    ].filter(Boolean).join('\n');

    const { ok, error } = await submitLead({
      name: ownerName,
      email: ownerEmail,
      phone: ownerPhone,
      type: 'Seller Inquiry',
      message: details,
    });

    setIsSubmitting(false);

    if (!ok) {
      setSubmitError(error || 'Something went wrong sending your request. Please call or email Kyle directly.');
      return;
    }

    setStep(3);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-[#0D2226]/85 backdrop-blur-md flex items-center justify-center p-4 animate-fadeIn">
      <div className="bg-[#FAF8F5] border border-[#C9A96A] rounded-xs w-full max-w-2xl shadow-2xl relative overflow-hidden text-[#1C2B2E]">
        
        {/* Header */}
        <div className="bg-[#0D2226] text-[#FAF8F5] px-6 py-5 flex items-center justify-between border-b border-[#C9A96A]/30">
          <div className="flex items-center gap-2">
            <Calculator className="w-5 h-5 text-[#C9A96A]" />
            <h3 className="font-serif text-xl font-bold tracking-wide text-[#FAF8F5]">
              What's Your Home Worth?
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-[#FAF8F5]/80 hover:text-[#C9A96A] transition-colors"
            id="close-valuation-modal"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Modal Content Container */}
        <div className="p-6 sm:p-8 space-y-6">
          
          {/* Progress Indicator */}
          <div className="flex items-center justify-between text-xs font-semibold text-[#0F5C63] border-b border-[#C9A96A]/20 pb-3">
            <span className={step >= 1 ? 'text-[#0F5C63] font-bold' : 'text-[#A8B2A1]'}>
              1. Property Specs
            </span>
            <span className={step >= 2 ? 'text-[#0F5C63] font-bold' : 'text-[#A8B2A1]'}>
              2. Features & Contact
            </span>
            <span className={step >= 3 ? 'text-[#C9A96A] font-bold' : 'text-[#A8B2A1]'}>
              3. Confirmation
            </span>
          </div>

          {/* STEP 1: Address & Specs */}
          {step === 1 && (
            <div className="space-y-4 animate-fadeIn">
              <div className="text-center space-y-1">
                <h4 className="font-serif text-2xl font-bold text-[#0D2226]">
                  Where is your Maryland property located?
                </h4>
                <p className="text-xs text-[#1C2B2E]/70 max-w-md mx-auto">
                  Tell Kyle a bit about your property below — he'll follow up personally with a full comparative market analysis built from live MLS comps in Carroll, Baltimore, Howard, and Frederick counties.
                </p>
              </div>

              <div className="space-y-3 pt-2">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-[#0F5C63] mb-1">
                    Street Address
                  </label>
                  <input
                    type="text"
                    required
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    placeholder="e.g. 11200 Falls Road or 2840 Sykesville Road"
                    className="w-full bg-[#FAF8F5] border border-[#0D2226]/20 p-3 text-xs text-[#0D2226] focus:border-[#C9A96A] focus:outline-none rounded-xs"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-[#0F5C63] mb-1">
                      City / Town
                    </label>
                    <input
                      type="text"
                      required
                      value={city}
                      onChange={(e) => setCity(e.target.value)}
                      placeholder="e.g. Eldersburg or Lutherville"
                      className="w-full bg-[#FAF8F5] border border-[#0D2226]/20 p-3 text-xs text-[#0D2226] focus:border-[#C9A96A] focus:outline-none rounded-xs"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-[#0F5C63] mb-1">
                      County
                    </label>
                    <select
                      value={county}
                      onChange={(e) => setCounty(e.target.value)}
                      className="w-full bg-[#FAF8F5] border border-[#0D2226]/20 p-3 text-xs text-[#0D2226] focus:border-[#C9A96A] focus:outline-none rounded-xs"
                    >
                      <option value="Carroll County">Carroll County</option>
                      <option value="Baltimore County">Baltimore County</option>
                      <option value="Howard County">Howard County</option>
                      <option value="Frederick County">Frederick / Other County</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-3">
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-[#0F5C63] mb-1">
                      Property Category
                    </label>
                    <select
                      value={propertyType}
                      onChange={(e) => setPropertyType(e.target.value)}
                      className="w-full bg-[#FAF8F5] border border-[#0D2226]/20 p-3 text-xs text-[#0D2226] focus:border-[#C9A96A] focus:outline-none rounded-xs"
                    >
                      <option value="Single-Family Home">Single-Family Home</option>
                      <option value="Townhome">Townhome / Rowhome</option>
                      <option value="Condo">Condo</option>
                      <option value="Farm / Land">Farm / Land</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-[#0F5C63] mb-1">
                      Approx SqFt
                    </label>
                    <input
                      type="number"
                      value={sqft}
                      onChange={(e) => setSqft(Number(e.target.value))}
                      className="w-full bg-[#FAF8F5] border border-[#0D2226]/20 p-3 text-xs text-[#0D2226] focus:border-[#C9A96A] focus:outline-none rounded-xs"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-[#0F5C63] mb-1">
                      Acres
                    </label>
                    <input
                      type="number"
                      step="0.5"
                      value={acreage}
                      onChange={(e) => setAcreage(Number(e.target.value))}
                      className="w-full bg-[#FAF8F5] border border-[#0D2226]/20 p-3 text-xs text-[#0D2226] focus:border-[#C9A96A] focus:outline-none rounded-xs"
                    />
                  </div>
                </div>

                <button
                  type="button"
                  disabled={!address || !city}
                  onClick={() => setStep(2)}
                  className="w-full py-3 bg-[#0F5C63] hover:bg-[#0D2226] text-[#FAF8F5] font-bold text-xs uppercase tracking-widest rounded-xs transition-all disabled:opacity-50 flex items-center justify-center gap-2 mt-4"
                >
                  <span>Next: Custom Upgrades</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {/* STEP 2: Upgrades & Contact Form */}
          {step === 2 && (
            <form onSubmit={submitValuationRequest} className="space-y-4 animate-fadeIn">
              <div className="text-center space-y-1">
                <h4 className="font-serif text-2xl font-bold text-[#0D2226]">
                  Select Your Home's Features
                </h4>
                <p className="text-xs text-[#1C2B2E]/70 max-w-md mx-auto">
                  These help refine your estimate beyond base square footage.
                </p>
              </div>

              {/* Upgrades checklist */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 max-h-40 overflow-y-auto p-1 border border-[#C9A96A]/30">
                {upgradeOptions.map((opt, i) => {
                  const checked = upgrades.includes(opt);
                  return (
                    <button
                      type="button"
                      key={i}
                      onClick={() => toggleUpgrade(opt)}
                      className={`p-2.5 text-left text-xs rounded-xs border transition-all flex items-center justify-between ${
                        checked
                          ? 'bg-[#0F5C63] text-[#FAF8F5] border-[#C9A96A]'
                          : 'bg-[#FAF8F5] text-[#0D2226] border-[#0D2226]/20 hover:border-[#C9A96A]'
                      }`}
                    >
                      <span className="font-medium">{opt}</span>
                      {checked && <CheckCircle2 className="w-4 h-4 text-[#C9A96A] shrink-0" />}
                    </button>
                  );
                })}
              </div>

              {/* Contact Information */}
              <div className="pt-2 border-t border-[#C9A96A]/20 space-y-3">
                <span className="text-xs font-bold uppercase tracking-wider text-[#0F5C63] block">
                  Where should we send your full analysis?
                </span>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                  <input
                    type="text"
                    required
                    value={ownerName}
                    onChange={(e) => setOwnerName(e.target.value)}
                    placeholder="Full Name *"
                    className="bg-[#FAF8F5] border border-[#0D2226]/20 p-2.5 text-xs text-[#0D2226] focus:border-[#C9A96A] focus:outline-none"
                  />
                  <input
                    type="email"
                    required
                    value={ownerEmail}
                    onChange={(e) => setOwnerEmail(e.target.value)}
                    placeholder="Email Address *"
                    className="bg-[#FAF8F5] border border-[#0D2226]/20 p-2.5 text-xs text-[#0D2226] focus:border-[#C9A96A] focus:outline-none"
                  />
                  <input
                    type="tel"
                    required
                    value={ownerPhone}
                    onChange={(e) => setOwnerPhone(e.target.value)}
                    placeholder="Phone Number *"
                    className="bg-[#FAF8F5] border border-[#0D2226]/20 p-2.5 text-xs text-[#0D2226] focus:border-[#C9A96A] focus:outline-none"
                  />
                </div>
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setStep(1)}
                  className="px-4 py-3 bg-[#FAF8F5] border border-[#0D2226]/30 text-[#0D2226] font-bold text-xs uppercase"
                >
                  Back
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting || !ownerEmail || !ownerName}
                  className="flex-1 py-3 bg-[#C9A96A] hover:bg-[#D4AF37] text-[#0D2226] font-bold text-xs uppercase tracking-widest rounded-xs transition-all flex items-center justify-center gap-2"
                >
                  {isSubmitting ? (
                    <span>Calculating Market Model...</span>
                  ) : (
                    <>
                      <Sparkles className="w-4 h-4" />
                      <span>Reveal Preliminary Valuation</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          )}

          {/* STEP 3: Confirmation - no computed number, ever */}
          {step === 3 && (
            <div className="space-y-6 text-center animate-fadeIn">

              <div className="bg-[#0D2226] text-[#FAF8F5] p-6 rounded-xs border border-[#C9A96A] space-y-4">
                <div className="text-xs uppercase tracking-widest text-[#C9A96A] font-bold flex items-center justify-center gap-2">
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Request Received</span>
                </div>

                <div className="text-[#FAF8F5]">
                  <span className="text-xs text-[#A8B2A1] block">For {address || 'Your Property'}</span>
                  <p className="text-sm sm:text-base mt-2 max-w-md mx-auto">
                    Kyle will personally review your property details and prepare a real valuation using current comparable sales and local market data — not an automated guess.
                  </p>
                </div>

                <div className="pt-2 border-t border-[#FAF8F5]/10 text-[11px] text-[#A8B2A1] leading-relaxed">
                  Expect to hear back within 1 business day.
                </div>
              </div>

              {submitError && (
                <div className="bg-red-900/10 border border-red-500/40 p-3 text-left rounded-xs flex items-start gap-2">
                  <AlertCircle className="w-4 h-4 text-red-500 shrink-0 mt-0.5" />
                  <p className="text-xs text-red-700">
                    {submitError} You can also reach Kyle directly at kyle@friedmanreteam.com or (443) 789-3101.
                  </p>
                </div>
              )}

              <div className="space-y-3">
                <button
                  onClick={() => {
                    onClose();
                    onSelectConsultation();
                  }}
                  className="w-full py-3.5 bg-[#C9A96A] hover:bg-[#D4AF37] text-[#0D2226] font-bold text-xs uppercase tracking-wider rounded-xs shadow-lg transition-all flex items-center justify-center gap-2"
                >
                  <DollarSign className="w-4 h-4" />
                  <span>Request Full Strategic Appraisal & Marketing Plan</span>
                </button>
                
                <button
                  onClick={onClose}
                  className="text-xs text-[#0D2226]/70 hover:text-[#0D2226] font-medium"
                >
                  Close Valuation Window
                </button>
              </div>

            </div>
          )}

        </div>

      </div>
    </div>
  );
};
