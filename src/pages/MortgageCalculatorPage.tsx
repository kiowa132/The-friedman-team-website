import React, { useMemo, useState } from 'react';
import { Calculator, Phone } from 'lucide-react';
import { usePageMeta } from '../lib/usePageMeta';
import { formatCurrency, monthlyPrincipalAndInterest, totalInterestPaid } from '../lib/calculators';

interface MortgageCalculatorPageProps {
  onOpenConsultation: () => void;
}

const inputClass = 'w-full bg-[#FAF8F5] border border-[#0D2226]/20 p-2.5 text-sm text-[#0D2226] focus:border-[#C9A96A] focus:outline-none';
const labelClass = 'block text-xs font-bold uppercase tracking-widest text-[#1C2B2E]/70 mb-1.5';

export const MortgageCalculatorPage: React.FC<MortgageCalculatorPageProps> = ({ onOpenConsultation }) => {
  usePageMeta(
    'Mortgage Calculator | The Friedman Team',
    'Estimate your monthly mortgage payment, including principal, interest, taxes, and insurance.'
  );

  const [homePrice, setHomePrice] = useState(450000);
  const [downPayment, setDownPayment] = useState(90000);
  const [rate, setRate] = useState(6.5);
  const [termYears, setTermYears] = useState(30);
  const [annualPropertyTax, setAnnualPropertyTax] = useState(4500);
  const [annualInsurance, setAnnualInsurance] = useState(1500);
  const [monthlyHoa, setMonthlyHoa] = useState(0);

  const loanAmount = Math.max(homePrice - downPayment, 0);
  const downPaymentPct = homePrice > 0 ? (downPayment / homePrice) * 100 : 0;

  const monthlyPI = useMemo(() => monthlyPrincipalAndInterest(loanAmount, rate, termYears), [loanAmount, rate, termYears]);
  const monthlyTax = annualPropertyTax / 12;
  const monthlyInsurance = annualInsurance / 12;
  const totalMonthly = monthlyPI + monthlyTax + monthlyInsurance + monthlyHoa;
  const totalInterest = useMemo(() => totalInterestPaid(monthlyPI, termYears, loanAmount), [monthlyPI, termYears, loanAmount]);

  return (
    <div className="pt-28 pb-20 bg-[#FAF8F5]">
      <div className="max-w-5xl mx-auto px-4 sm:px-6">
        <div className="mb-10 text-center">
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
              <label className={labelClass}>Home Price</label>
              <input type="number" className={inputClass} value={homePrice} onChange={(e) => setHomePrice(Number(e.target.value) || 0)} />
            </div>
            <div>
              <label className={labelClass}>Down Payment ({downPaymentPct.toFixed(1)}%)</label>
              <input type="number" className={inputClass} value={downPayment} onChange={(e) => setDownPayment(Number(e.target.value) || 0)} />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className={labelClass}>Interest Rate (%)</label>
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
                <label className={labelClass}>Annual Property Tax</label>
                <input type="number" className={inputClass} value={annualPropertyTax} onChange={(e) => setAnnualPropertyTax(Number(e.target.value) || 0)} />
              </div>
              <div>
                <label className={labelClass}>Annual Insurance</label>
                <input type="number" className={inputClass} value={annualInsurance} onChange={(e) => setAnnualInsurance(Number(e.target.value) || 0)} />
              </div>
            </div>
            <div>
              <label className={labelClass}>Monthly HOA / Condo Fee</label>
              <input type="number" className={inputClass} value={monthlyHoa} onChange={(e) => setMonthlyHoa(Number(e.target.value) || 0)} />
            </div>
          </div>

          {/* Results */}
          <div className="bg-[#0D2226] text-[#FAF8F5] p-6 sm:p-8 space-y-6">
            <div className="text-center pb-6 border-b border-[#FAF8F5]/15">
              <div className="text-[11px] uppercase tracking-widest text-[#C9A96A] font-bold mb-1">Estimated Monthly Payment</div>
              <div className="font-serif text-4xl sm:text-5xl font-bold">{formatCurrency(totalMonthly)}</div>
            </div>
            <div className="space-y-3 text-sm">
              <div className="flex justify-between"><span className="text-[#A8B2A1]">Principal & Interest</span><span className="font-semibold">{formatCurrency(monthlyPI)}</span></div>
              <div className="flex justify-between"><span className="text-[#A8B2A1]">Property Tax</span><span className="font-semibold">{formatCurrency(monthlyTax)}</span></div>
              <div className="flex justify-between"><span className="text-[#A8B2A1]">Insurance</span><span className="font-semibold">{formatCurrency(monthlyInsurance)}</span></div>
              {monthlyHoa > 0 && (
                <div className="flex justify-between"><span className="text-[#A8B2A1]">HOA / Condo Fee</span><span className="font-semibold">{formatCurrency(monthlyHoa)}</span></div>
              )}
            </div>
            <div className="pt-4 border-t border-[#FAF8F5]/15 space-y-2 text-sm">
              <div className="flex justify-between"><span className="text-[#A8B2A1]">Loan Amount</span><span className="font-semibold">{formatCurrency(loanAmount)}</span></div>
              <div className="flex justify-between"><span className="text-[#A8B2A1]">Total Interest Over {termYears} Years</span><span className="font-semibold">{formatCurrency(totalInterest)}</span></div>
            </div>
            <button
              onClick={onOpenConsultation}
              className="w-full py-3.5 bg-[#C9A96A] hover:bg-[#D4AF37] text-[#0D2226] font-bold text-xs uppercase tracking-widest rounded-xs shadow-lg transition-all flex items-center justify-center gap-2"
            >
              <Phone className="w-4 h-4" />
              Talk to Kyle About Financing
            </button>
          </div>
        </div>

        <p className="text-xs text-[#1C2B2E]/50 text-center mt-8 max-w-xl mx-auto">
          This is an estimate for general informational purposes only, not a loan offer or pre-approval. Actual rates, taxes, insurance, and PMI vary by lender, property, and buyer. Talk to a licensed loan officer for exact figures.
        </p>
      </div>
    </div>
  );
};
