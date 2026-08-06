import React, { useMemo, useState } from 'react';
import { formatCurrency, monthlyPrincipalAndInterest } from '../lib/calculators';
import { PaymentBreakdownChart } from './PaymentBreakdownChart';

const FRONT_END_RATIO = 0.28;
const BACK_END_RATIO = 0.36;

// Compact embeddable version of the standalone affordability calculator -
// same conservative 28%/36% guideline, same underlying math, just a
// smaller footprint meant to sit on a property page.
export const EmbeddedAffordabilityEstimate: React.FC = () => {
  const [annualIncome, setAnnualIncome] = useState(150000);
  const [monthlyDebts, setMonthlyDebts] = useState(500);
  const [downPaymentPct, setDownPaymentPct] = useState(20);

  const result = useMemo(() => {
    const monthlyIncome = annualIncome / 12;
    const maxFrontEnd = monthlyIncome * FRONT_END_RATIO;
    const maxBackEnd = monthlyIncome * BACK_END_RATIO - monthlyDebts;
    const maxHousingPayment = Math.max(Math.min(maxFrontEnd, maxBackEnd), 0);

    let low = 0;
    let high = 3000000;
    for (let i = 0; i < 40; i++) {
      const mid = (low + high) / 2;
      const loan = Math.max(mid * (1 - downPaymentPct / 100), 0);
      const pi = monthlyPrincipalAndInterest(loan, 6.5, 30);
      const tax = (mid * 0.011) / 12;
      const insurance = 125;
      const total = pi + tax + insurance;
      if (total > maxHousingPayment) high = mid; else low = mid;
    }
    const maxHomePrice = low;
    const downPayment = maxHomePrice * (downPaymentPct / 100);
    const loanAmount = maxHomePrice - downPayment;
    const monthlyPI = monthlyPrincipalAndInterest(loanAmount, 6.5, 30);
    const monthlyTax = (maxHomePrice * 0.011) / 12;
    const monthlyInsurance = 125;

    return { maxHomePrice, maxHousingPayment, monthlyPI, monthlyTax, monthlyInsurance };
  }, [annualIncome, monthlyDebts, downPaymentPct]);

  const inputClass = 'w-full bg-white border border-[#0D2226]/20 p-2 text-sm text-[#0D2226] focus:border-[#C9A96A] focus:outline-none';
  const labelClass = 'block text-[10px] font-bold uppercase tracking-widest text-[#1C2B2E]/60 mb-1';

  return (
    <div className="bg-[#FAF8F5] border border-[#C9A96A]/30 p-6 sm:p-8 mt-6">
      <h3 className="text-[11px] uppercase tracking-widest text-[#C9A96A] font-bold mb-1">Affordability Calculator</h3>
      <p className="text-sm font-semibold text-[#0D2226] mb-5">How much house could you afford?</p>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        <div className="space-y-4">
          <div>
            <label className={labelClass}>Annual Income</label>
            <input type="number" className={inputClass} value={annualIncome} onChange={(e) => setAnnualIncome(Number(e.target.value) || 0)} />
          </div>
          <div>
            <label className={labelClass}>Monthly Debts</label>
            <input type="number" className={inputClass} value={monthlyDebts} onChange={(e) => setMonthlyDebts(Number(e.target.value) || 0)} />
          </div>
          <div>
            <label className={labelClass}>Down Payment (%)</label>
            <input type="number" className={inputClass} value={downPaymentPct} onChange={(e) => setDownPaymentPct(Number(e.target.value) || 0)} />
          </div>
        </div>
        <div className="bg-[#0D2226] p-5 flex flex-col items-center justify-center">
          <PaymentBreakdownChart
            total={result.maxHousingPayment}
            totalLabel="Max Monthly Payment"
            slices={[
              { label: 'Principal & Interest', value: result.monthlyPI, color: '#0F5C63' },
              { label: 'Property Tax (est.)', value: result.monthlyTax, color: '#C9A96A' },
              { label: 'Insurance (est.)', value: result.monthlyInsurance, color: '#A8B2A1' },
            ]}
          />
        </div>
      </div>
      <div className="mt-4 pt-4 border-t border-[#C9A96A]/20 flex items-center justify-between">
        <span className="text-xs uppercase tracking-widest text-[#1C2B2E]/60 font-bold">You could afford about</span>
        <span className="font-serif text-xl font-bold text-[#0F5C63]">{formatCurrency(result.maxHomePrice)}</span>
      </div>
      <p className="text-[11px] text-[#1C2B2E]/50 mt-4">
        A conservative estimate using standard 28%/36% income ratios. For the full version with a first-time buyer toggle, try the <a href="/calculators/affordability" className="underline hover:text-[#0F5C63]">full affordability calculator</a>.
      </p>
    </div>
  );
};
