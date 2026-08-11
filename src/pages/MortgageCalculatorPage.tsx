import React, { useMemo, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Phone, RotateCcw } from 'lucide-react';
import { usePageMeta } from '../lib/usePageMeta';
import { formatCurrency, monthlyPrincipalAndInterest, totalInterestPaid, estimateMonthlyPmi } from '../lib/calculators';
import { PaymentBreakdownChart } from '../components/PaymentBreakdownChart';

interface MortgageCalculatorPageProps {
  onOpenConsultation: () => void;
}

const inputClass = 'w-full bg-[#FAF8F5] border border-[#0D2226]/20 p-2.5 text-sm text-[#0D2226] focus:border-[#C9A96A] focus:outline-none';
const labelClass = 'flex items-center gap-1.5 text-xs font-bold uppercase tracking-widest text-[#1C2B2E]/70 mb-1.5';

// Small "(i)" info dot with a native title tooltip - no extra JS/positioning
// logic needed, and it's keyboard/screen-reader accessible for free since
// it's just a title attribute on a real element.
const InfoDot: React.FC<{ text: string }> = ({ text }) => (
  <span
    title={text}
    className="inline-flex items-center justify-center w-3.5 h-3.5 rounded-full border border-[#1C2B2E]/30 text-[9px] text-[#1C2B2E]/50 cursor-help shrink-0 normal-case font-normal"
  >
    i
  </span>
);

const DEFAULTS = {
  homePrice: 450000,
  downPayment: 90000,
  rate: 6.5,
  termYears: 30,
  annualPropertyTax: 4500,
  annualInsurance: 1500,
  monthlyHoa: 0,
};

export const MortgageCalculatorPage: React.FC<MortgageCalculatorPageProps> = ({ onOpenConsultation }) => {
  usePageMeta(
    'Mortgage Calculator | The Friedman Team',
    'Estimate your monthly mortgage payment, including principal, interest, taxes, and insurance.'
  );

  const [searchParams] = useSearchParams();
  const priceParam = Number(searchParams.get('price'));
  const initialHomePrice = priceParam > 0 ? priceParam : DEFAULTS.homePrice;

  const [homePrice, setHomePrice] = useState(initialHomePrice);
  const [downPayment, setDownPayment] = useState(DEFAULTS.downPayment);
  const [rate, setRate] = useState(DEFAULTS.rate);
  const [termYears, setTermYears] = useState(DEFAULTS.termYears);
  const [annualPropertyTax, setAnnualPropertyTax] = useState(DEFAULTS.annualPropertyTax);
  const [annualInsurance, setAnnualInsurance] = useState(DEFAULTS.annualInsurance);
  const [monthlyHoa, setMonthlyHoa] = useState(DEFAULTS.monthlyHoa);

  const resetDefaults = () => {
    setHomePrice(DEFAULTS.homePrice);
    setDownPayment(DEFAULTS.downPayment);
    setRate(DEFAULTS.rate);
    setTermYears(DEFAULTS.termYears);
    setAnnualPropertyTax(DEFAULTS.annualPropertyTax);
    setAnnualInsurance(DEFAULTS.annualInsurance);
    setMonthlyHoa(DEFAULTS.monthlyHoa);
  };

  const loanAmount = Math.max(homePrice - downPayment, 0);
  const downPaymentPct = homePrice > 0 ? (downPayment / homePrice) * 100 : 0;

  const monthlyPI = useMemo(() => monthlyPrincipalAndInterest(loanAmount, rate, termYears), [loanAmount, rate, termYears]);
  const monthlyTax = annualPropertyTax / 12;
  const monthlyInsurance = annualInsurance / 12;
  const monthlyPmi = estimateMonthlyPmi(loanAmount, downPaymentPct);
  const totalMonthly = monthlyPI + monthlyTax + monthlyInsurance + monthlyHoa + monthlyPmi;
  const totalInterest = useMemo(() => totalInterestPaid(monthlyPI, termYears, loanAmount), [monthlyPI, termYears, loanAmount]);

  return (
    <div className="pt-28 pb-20 bg-[#FAF8F5]">
      <div className="max-w-5xl mx-auto px-4 sm:px-6">
        <div className="mb-10 text-center">
          <div className="flex items-center justify-center gap-2 mb-4">
            <img src="/images/brand/friedman-f-mark.png" alt="" className="h-6 w-auto" />
            <span className="text-xs uppercase tracking-widest text-[#1C2B2E]/60 font-semibold">The Friedman Team</span>
          </div>
          <span className="text-[11px] uppercase tracking-[0.25em] text-[#C9A96A] font-bold">Free Tool</span>
          <h1 className="font-serif text-4xl sm:text-5xl font-bold text-[#0D2226] mt-2">Mortgage Calculator</h1>
          <p className="text-sm text-[#1C2B2E]/70 mt-3 max-w-xl mx-auto">
            Estimate your monthly payment, including principal, interest, taxes, and insurance.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Inputs */}
          <div className="bg-white border border-[#C9A96A]/30 p-6 sm:p-8 space-y-5">
            <div>
              <label className={labelClass}>Home Price <InfoDot text="The total purchase price of the home." /></label>
              <input type="number" className={inputClass} value={homePrice} onChange={(e) => setHomePrice(Number(e.target.value) || 0)} />
            </div>
            <div>
              <label className={labelClass}>Down Payment ({downPaymentPct.toFixed(1)}%) <InfoDot text="Cash paid upfront, reducing your loan amount. 20%+ avoids PMI." /></label>
              <input type="number" className={inputClass} value={downPayment} onChange={(e) => setDownPayment(Number(e.target.value) || 0)} />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className={labelClass}>Interest Rate (%) <InfoDot text="Your loan's annual interest rate, set by your lender." /></label>
                <input type="number" step="0.01" className={inputClass} value={rate} onChange={(e) => setRate(Number(e.target.value) || 0)} />
              </div>
              <div>
                <label className={labelClass}>Loan Term</label>
                <select className={inputClass} value={termYears} onChange={(e) => setTermYears(Number(e.target.value))}>
                  <option value={30}>30 years</option>
                  <option value={20}>20 years</option>
                  <option value={15}>15 years</option>
                </select>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className={labelClass}>Annual Property Tax <InfoDot text="Set by your county; varies by assessed value and local rate." /></label>
                <input type="number" className={inputClass} value={annualPropertyTax} onChange={(e) => setAnnualPropertyTax(Number(e.target.value) || 0)} />
              </div>
              <div>
                <label className={labelClass}>Annual Insurance <InfoDot text="Homeowner's insurance, required by most lenders." /></label>
                <input type="number" className={inputClass} value={annualInsurance} onChange={(e) => setAnnualInsurance(Number(e.target.value) || 0)} />
              </div>
            </div>
            <div>
              <label className={labelClass}>Monthly HOA / Condo Fee <InfoDot text="Only applies if the property is in an HOA or condo association." /></label>
              <input type="number" className={inputClass} value={monthlyHoa} onChange={(e) => setMonthlyHoa(Number(e.target.value) || 0)} />
            </div>
            <button
              onClick={resetDefaults}
              className="flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-widest text-[#1C2B2E]/50 hover:text-[#0F5C63] transition-colors"
            >
              <RotateCcw className="w-3 h-3" /> Reset
            </button>
          </div>

          {/* Results */}
          <div className="bg-[#0D2226] text-[#FAF8F5] p-6 sm:p-8 flex flex-col items-center">
            <PaymentBreakdownChart
              total={totalMonthly}
              totalLabel="Your Monthly Payment"
              slices={[
                { label: 'Principal & Interest', value: monthlyPI, color: '#0F5C63' },
                { label: 'Property Tax', value: monthlyTax, color: '#C9A96A' },
                { label: 'Insurance', value: monthlyInsurance, color: '#A8B2A1' },
                { label: 'HOA / Condo Fee', value: monthlyHoa, color: '#7A8A87' },
                { label: 'Estimated PMI', value: monthlyPmi, color: '#8B7355' },
              ]}
            />
            <div className="w-full pt-5 mt-5 border-t border-[#FAF8F5]/15 grid grid-cols-2 gap-3">
              <div className="bg-[#0F5C63]/25 border border-[#0F5C63]/50 p-3.5">
                <div className="text-[10px] uppercase tracking-widest text-[#7FBFC4] font-bold mb-1">Loan Amount</div>
                <div className="font-serif text-xl font-bold text-[#FAF8F5]">{formatCurrency(loanAmount)}</div>
              </div>
              <div className="bg-[#C9A96A]/20 border border-[#C9A96A]/50 p-3.5">
                <div className="text-[10px] uppercase tracking-widest text-[#E4CFA0] font-bold mb-1">Down Payment</div>
                <div className="font-serif text-xl font-bold text-[#FAF8F5]">{formatCurrency(downPayment)}</div>
              </div>
              <div className="bg-[#0F5C63]/25 border border-[#0F5C63]/50 p-3.5">
                <div className="text-[10px] uppercase tracking-widest text-[#7FBFC4] font-bold mb-1">Total Interest ({termYears}yr)</div>
                <div className="font-serif text-xl font-bold text-[#FAF8F5]">{formatCurrency(totalInterest)}</div>
              </div>
              <div className="bg-[#C9A96A]/20 border border-[#C9A96A]/50 p-3.5">
                <div className="text-[10px] uppercase tracking-widest text-[#E4CFA0] font-bold mb-1">Total Cost of Loan</div>
                <div className="font-serif text-xl font-bold text-[#FAF8F5]">{formatCurrency(loanAmount + totalInterest)}</div>
              </div>
            </div>
<div className="flex items-center gap-3 mt-6 mb-3">
              <img src="/images/kyle-portrait.jpg" alt="Kyle Friedman" className="w-11 h-11 rounded-full object-cover object-top border-2 border-[#C9A96A]" />
              <div>
                <div className="text-sm font-bold text-[#FAF8F5] leading-tight">Kyle Friedman</div>
                <div className="text-[11px] text-[#A8B2A1]">The Friedman Team, eXp Realty</div>
              </div>
            </div>
            <button
              onClick={onOpenConsultation}
              className="w-full py-3.5 bg-[#C9A96A] hover:bg-[#D4AF37] text-[#0D2226] font-bold text-xs uppercase tracking-widest rounded-xs shadow-lg transition-all flex items-center justify-center gap-2"
            >
              <Phone className="w-4 h-4" />
              Talk to Kyle Friedman About Financing
            </button>
          </div>
        </div>

        <p className="text-xs text-[#1C2B2E]/50 text-center mt-8 max-w-xl mx-auto">
          This is an estimate for general informational purposes only, not a loan offer or pre-approval. PMI is auto-estimated at a common rate when your down payment is under 20% and removed automatically at 20%+; actual PMI varies by lender, credit score, and loan type. Actual rates, taxes, and insurance also vary by lender and property. Talk to a licensed loan officer for exact figures.
        </p>
      </div>
    </div>
  );
};
