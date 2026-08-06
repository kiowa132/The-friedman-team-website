import React, { useMemo, useState } from 'react';
import { formatCurrency, monthlyPrincipalAndInterest, estimateMonthlyPmi } from '../lib/calculators';
import { PaymentBreakdownChart } from './PaymentBreakdownChart';

interface EmbeddedMortgageEstimateProps {
  initialPrice: number;
}

// A compact, self-contained version of the standalone mortgage calculator,
// meant to be embedded inline on a property page pre-filled with that
// property's real price - same math as the full calculator (imported from
// the same lib), just a smaller footprint of inputs.
export const EmbeddedMortgageEstimate: React.FC<EmbeddedMortgageEstimateProps> = ({ initialPrice }) => {
  const [homePrice, setHomePrice] = useState(initialPrice);
  const [downPaymentPct, setDownPaymentPct] = useState(20);
  const [rate, setRate] = useState(6.5);

  const downPayment = Math.round(homePrice * (downPaymentPct / 100));
  const loanAmount = Math.max(homePrice - downPayment, 0);
  const monthlyPI = useMemo(() => monthlyPrincipalAndInterest(loanAmount, rate, 30), [loanAmount, rate]);
  const monthlyTax = (homePrice * 0.011) / 12; // rough estimate, refined on the full calculator
  const monthlyInsurance = 125;
  const monthlyPmi = estimateMonthlyPmi(loanAmount, downPaymentPct);
  const total = monthlyPI + monthlyTax + monthlyInsurance + monthlyPmi;

  const inputClass = 'w-full bg-white border border-[#0D2226]/20 p-2 text-sm text-[#0D2226] focus:border-[#C9A96A] focus:outline-none';
  const labelClass = 'block text-[10px] font-bold uppercase tracking-widest text-[#1C2B2E]/60 mb-1';

  return (
    <div className="bg-[#FAF8F5] border border-[#C9A96A]/30 p-6 sm:p-8">
      <h3 className="text-[11px] uppercase tracking-widest text-[#C9A96A] font-bold mb-1">Home Sale Calculator</h3>
      <p className="text-sm font-semibold text-[#0D2226] mb-5">What would this cost per month today?</p>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        <div className="space-y-4">
          <div>
            <label className={labelClass}>Home Price</label>
            <input type="number" className={inputClass} value={homePrice} onChange={(e) => setHomePrice(Number(e.target.value) || 0)} />
          </div>
          <div>
            <label className={labelClass}>Down Payment ({downPaymentPct}%)</label>
            <input type="number" className={inputClass} value={downPaymentPct} onChange={(e) => setDownPaymentPct(Number(e.target.value) || 0)} />
          </div>
          <div>
            <label className={labelClass}>Interest Rate (%)</label>
            <input type="number" step="0.01" className={inputClass} value={rate} onChange={(e) => setRate(Number(e.target.value) || 0)} />
          </div>
        </div>
        <div className="bg-[#0D2226] p-5 flex flex-col items-center justify-center">
          <PaymentBreakdownChart
            total={total}
            totalLabel="Est. Monthly Payment"
            slices={[
              { label: 'Principal & Interest', value: monthlyPI, color: '#0F5C63' },
              { label: 'Property Tax (est.)', value: monthlyTax, color: '#C9A96A' },
              { label: 'Insurance (est.)', value: monthlyInsurance, color: '#A8B2A1' },
              { label: 'Est. PMI', value: monthlyPmi, color: '#8B7355' },
            ]}
          />
        </div>
      </div>
      <p className="text-[11px] text-[#1C2B2E]/50 mt-4">
        A rough estimate for a home at this price, not this specific property's actual figures. For an exact number, try the <a href={`/calculators/mortgage?price=${homePrice}`} className="underline hover:text-[#0F5C63]">full mortgage calculator</a>.
      </p>
    </div>
  );
};
