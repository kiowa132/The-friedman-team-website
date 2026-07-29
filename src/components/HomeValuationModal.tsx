import React, { useState } from 'react';
import { X, Calculator, ShieldCheck, Sparkles, CheckCircle2, ArrowRight, Building2, MapPin, DollarSign, AlertCircle } from 'lucide-react';
import { HomeValuationResult } from '../types';
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
  const [propertyType, setPropertyType] = useState('Luxury Residence');
  const [sqft, setSqft] = useState(4500);
  const [acreage, setAcreage] = useState(2.5);
  const [upgrades, setUpgrades] = useState<string[]>([]);
  
  // Owner details
  const [ownerName, setOwnerName] = useState('');
  const [ownerEmail, setOwnerEmail] = useState('');
  const [ownerPhone, setOwnerPhone] = useState('');
  const [result, setResult] = useState<HomeValuationResult | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const upgradeOptions = [
    'Custom Equestrian Barn / Paddocks',
    'Saltwater Pool / Outdoor Kitchen',
    'Climate-Controlled Wine Cellar',
    'Geothermal / Solar Infrastructure',
    'Gated Private Motor Court',
    'Main-Floor Primary Luxury Suite',
    'Historic Preservation Status'
  ];

  const toggleUpgrade = (item: string) => {
    if (upgrades.includes(item)) {
      setUpgrades(upgrades.filter((u) => u !== item));
    } else {
      setUpgrades([...upgrades, item]);
    }
  };

  const calculateEstimate = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitError(null);

    // Rough, non-appraisal estimate for engagement purposes only. This is NOT
    // pulling live comps - it's a simple $/sqft heuristic to give the visitor
    // a ballpark while Kyle prepares a real CMA from actual MLS data.
    let basePricePerSqft = county === 'Baltimore County' ? 380 : county === 'Howard County' ? 350 : 310;
    let calculatedMid = sqft * basePricePerSqft + acreage * 45000 + upgrades.length * 75000;

    const calculatedLow = Math.round(calculatedMid * 0.9);
    const calculatedHigh = Math.round(calculatedMid * 1.1);
    calculatedMid = Math.round(calculatedMid);

    const details = [
      `Property: ${address}, ${city}, ${county}`,
      `Type: ${propertyType} | ${sqft} sqft | ${acreage} acres`,
      upgrades.length ? `Notable features: ${upgrades.join(', ')}` : null,
      `Rough self-service estimate shown to lead: $${calculatedLow.toLocaleString()} - $${calculatedHigh.toLocaleString()} (heuristic only, not a CMA)`,
    ].filter(Boolean).join('\n');

    const { ok, error } = await submitLead({
      name: ownerName,
      email: ownerEmail,
      phone: ownerPhone,
      type: 'Seller Inquiry',
      message: details,
    });

    if (!ok) {
      setSubmitError(error || 'Something went wrong sending your request. Please call or email Kyle directly.');
    }

    setResult({
      estimatedLow: calculatedLow,
      estimatedHigh: calculatedHigh,
      estimatedMid: calculatedMid,
      confidenceScore: 0,
      comparableCount: 0
    });
    setIsSubmitting(false);
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
              Strategic Home Valuation Engine
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
              3. Strategic Estimate
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
                  Get a quick, rough estimate below — then Kyle will follow up personally with a full comparative market analysis built from live MLS comps in Carroll, Baltimore, and Howard counties.
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
                      <option value="Luxury Residence">Luxury Single Family</option>
                      <option value="Equestrian Farm">Equestrian Farm</option>
                      <option value="Historic Manor">Historic Stone Manor</option>
                      <option value="Land / Acreage">Land / Acreage Compound</option>
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
            <form onSubmit={calculateEstimate} className="space-y-4 animate-fadeIn">
              <div className="text-center space-y-1">
                <h4 className="font-serif text-2xl font-bold text-[#0D2226]">
                  Select Custom Estate Features
                </h4>
                <p className="text-xs text-[#1C2B2E]/70 max-w-md mx-auto">
                  High-end luxury features add significant strategic market value beyond base square footage.
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

          {/* STEP 3: Results & CTA */}
          {step === 3 && result && (
            <div className="space-y-6 text-center animate-fadeIn">
              
              <div className="bg-[#0D2226] text-[#FAF8F5] p-6 rounded-xs border border-[#C9A96A] space-y-4">
                <div className="text-xs uppercase tracking-widest text-[#C9A96A] font-bold flex items-center justify-center gap-2">
                  <ShieldCheck className="w-4 h-4" />
                  <span>Preliminary Valuation Model Result</span>
                </div>

                <div className="text-[#FAF8F5]">
                  <span className="text-xs text-[#A8B2A1] block">Preliminary Range for {address || 'Your Property'}</span>
                  <div className="text-3xl sm:text-4xl font-serif font-bold text-[#C9A96A] mt-1">
                    ${result.estimatedLow.toLocaleString()} – ${result.estimatedHigh.toLocaleString()}
                  </div>
                  <div className="text-xs text-[#FAF8F5]/80 mt-1">
                    Midpoint: <strong className="text-[#FAF8F5]">${result.estimatedMid.toLocaleString()}</strong>
                  </div>
                </div>

                <div className="pt-2 border-t border-[#FAF8F5]/10 text-[11px] text-[#A8B2A1] leading-relaxed">
                  This is a rough, self-service estimate based on general price-per-square-foot data — not a formal appraisal or a comparative market analysis pulled from live MLS comps.
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

              <div className="bg-[#0F5C63]/10 border border-[#0F5C63] p-4 text-left space-y-2 rounded-xs">
                <h5 className="font-serif font-bold text-[#0F5C63] text-base">
                  Why Strategic Representation Outperforms Generic Automated Estimates
                </h5>
                <p className="text-xs text-[#1C2B2E] leading-relaxed">
                  Algorithmic estimates like Zillow Zestimates cannot factor in custom equestrian amenities, private pond valuations, or high-net-worth relocation buyer demand. Kyle Friedman conducts custom in-person appraisals, using live MLS comps, to unlock maximum sale proceeds.
                </p>
              </div>

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
