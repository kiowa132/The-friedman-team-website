import React, { useMemo, useState } from 'react';
import { Phone } from 'lucide-react';
import { usePageMeta } from '../lib/usePageMeta';
import { formatCurrency, monthlyPrincipalAndInterest } from '../lib/calculators';

interface AffordabilityCalculatorPageProps {
  onOpenConsultation: () => void;
}

const inputClass = 'w-full bg-[#FAF8F5] border border-[#0D2226]/20 p-2.5 text-sm text-[#0D2226] focus:border-[#C9A96A] focus:outline-none';
const labelClass = 'block text-xs font-bold uppercase tracking-widest text-[#1C2B2E]/70 mb-1.5';

// Conservative, conventional-loan-style guideline: no more than 28% of
// gross monthly income toward housing (front-end ratio), and no more than
// 36% of gross monthly income toward all debt including housing (back-end
// ratio). Real lenders and programs vary a lot from this - FHA and some
// down-payment-assistance programs allow meaningfully higher back-end
// ratios (43% and above) - so this is a deliberately conservative estimate,
// not a program-specific pre-approval number.
const FRONT_END_RATIO = 0.28;
const BACK_END_RATIO = 0.36;

export const AffordabilityCalculatorPage: React.FC<AffordabilityCalculatorPageProps> = ({ onOpenConsultation }) => {
  usePageMeta(
    'Affordability Calculator | The Friedman Team',
    'Estimate how much home you can afford based on your income, debts, and down payment.'
  );

  const [annualIncome, setAnnualIncome] = useState(120000);
  const [monthlyDebts, setMonthlyDebts] = useState(500);
  const [downPayment, setDownPayment] = useState(60000);
  const [rate, setRate] = useState(6.5);
  const [termYears, setTermYears] = useState(30);
  const [annualPropertyTaxRatePct, setAnnualPropertyTaxRatePct] = useState(1.1);
  const [annualInsurance, setAnnualInsurance] = useState(1500);

  const result = useMemo(() => {
    const monthlyIncome = annualIncome / 12;
    const maxFrontEnd = monthlyIncome * FRONT_END_RATIO;
    const maxBackEnd = monthlyIncome * BACK_END_RATIO - monthlyDebts;
    const maxHousingPayment = Math.max(Math.min(maxFrontEnd, maxBackEnd), 0);

    // Back out an affordable home price: maxHousingPayment covers P&I + tax
    // + insurance. Solve iteratively since property tax depends on price.
    let low = 0;
    let high = 3000000;
    for (let i = 0; i < 40; i++) {
      const mid = (low + high) / 2;
      const loan = Math.max(mid - downPayment, 0);
      const pi = monthlyPrincipalAndInterest(loan, rate, termYears);
      const tax = (mid * (annualPropertyTaxRatePct / 100)) / 12;
      const insurance = annualInsurance / 12;
      const total = pi + tax + insurance;
      if (total > maxHousingPayment) {
        high = mid;
      } else {
        low = mid;
      }
    }
    const maxHomePrice = low;
    const loanAmount = Math.max(maxHomePrice - downPayment, 0);
    const monthlyPI = monthlyPrincipalAndInterest(loanAmount, rate, termYears);
    const monthlyTax = (maxHomePrice * (annualPropertyTaxRatePct / 100)) / 12;
    const monthlyInsurance = annualInsurance / 12;

    return {
      maxHomePrice,
      maxHousingPayment,
      monthlyPI,
      monthlyTax,
      monthlyInsurance,
    };
  }, [annualIncome, monthlyDebts, downPayment, rate, termYears, annualPropertyTaxRatePct, annualInsurance]);

  return (
    <div className="pt-28 pb-20 bg-[#FAF8F5]">
      <div className="max-w-5xl mx-auto px-4 sm:px-6">
        <div className="mb-10 text-center">
          <span className="text-[11px] uppercase tracking-[0.25em] text-[#C9A96A] font-bold">Free Tool</span>
          <h1 className="font-serif text-4xl sm:text-5xl font-bold text-[#0D2226] mt-2">Affordability Calculator</h1>
          <p className="text-sm text-[#1C2B2E]/70 mt-3 max-w-xl mx-auto">
            A conservative estimate of what you can afford, based on your income, debts, and down payment.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Inputs */}
          <div className="bg-white border border-[#C9A96A]/30 p-6 sm:p-8 space-y-5">
            <div>
              <label className={labelClass}>Annual Gross Household Income</label>
              <input type="number" className={inputClass} value={annualIncome} onChange={(e) => setAnnualIncome(Number(e.target.value) || 0)} />
            </div>
            <div>
              <label className={labelClass}>Other Monthly Debt Payments</label>
              <input type="number" className={inputClass} value={monthlyDebts} onChange={(e) => setMonthlyDebts(Number(e.target.value) || 0)} />
              <p className="text-[11px] text-[#1C2B2E]/50 mt-1">Car loans, student loans, credit cards, and any other minimum monthly payments.</p>
            </div>
            <div>
              <label className={labelClass}>Available Down Payment</label>
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
                <label className={labelClass}>Property Tax Rate (%)</label>
                <input type="number" step="0.01" className={inputClass} value={annualPropertyTaxRatePct} onChange={(e) => setAnnualPropertyTaxRatePct(Number(e.target.value) || 0)} />
              </div>
              <div>
                <label className={labelClass}>Annual Insurance</label>
                <input type="number" className={inputClass} value={annualInsurance} onChange={(e) => setAnnualInsurance(Number(e.target.value) || 0)} />
              </div>
            </div>
          </div>

          {/* Results */}
          <div className="bg-[#0D2226] text-[#FAF8F5] p-6 sm:p-8 space-y-6">
            <div className="text-center pb-6 border-b border-[#FAF8F5]/15">
              <div className="text-[11px] uppercase tracking-widest text-[#C9A96A] font-bold mb-1">Estimated Affordable Home Price</div>
              <div className="font-serif text-4xl sm:text-5xl font-bold">{formatCurrency(result.maxHomePrice)}</div>
            </div>
            <div className="space-y-3 text-sm">
              <div className="flex justify-between"><span className="text-[#A8B2A1]">Max Monthly Housing Payment</span><span className="font-semibold">{formatCurrency(result.maxHousingPayment)}</span></div>
              <div className="flex justify-between"><span className="text-[#A8B2A1]">Principal & Interest</span><span className="font-semibold">{formatCurrency(result.monthlyPI)}</span></div>
              <div className="flex justify-between"><span className="text-[#A8B2A1]">Property Tax</span><span className="font-semibold">{formatCurrency(result.monthlyTax)}</span></div>
              <div className="flex justify-between"><span className="text-[#A8B2A1]">Insurance</span><span className="font-semibold">{formatCurrency(result.monthlyInsurance)}</span></div>
            </div>
            <button
              onClick={onOpenConsultation}
              className="w-full py-3.5 bg-[#C9A96A] hover:bg-[#D4AF37] text-[#0D2226] font-bold text-xs uppercase tracking-widest rounded-xs shadow-lg transition-all flex items-center justify-center gap-2"
            >
              <Phone className="w-4 h-4" />
              Talk to Kyle About Buying
            </button>
          </div>
        </div>

        <p className="text-xs text-[#1C2B2E]/50 text-center mt-8 max-w-xl mx-auto">
          This is a conservative estimate for general informational purposes only, using standard 28%/36% income ratios, not a pre-approval or loan offer. Actual approval amounts vary by lender, credit profile, and loan program; some programs (FHA, VA, Maryland Mortgage Program) allow different ratios. Talk to a licensed loan officer for exact figures.
        </p>
      </div>
    </div>
  );
};
