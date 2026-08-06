import React, { useMemo, useState } from 'react';
import { formatCurrency, MARYLAND_COUNTIES, calculateDeedTax } from '../lib/calculators';
import { PaymentBreakdownChart } from './PaymentBreakdownChart';

interface EmbeddedNetProceedsEstimateProps {
  initialPrice: number;
  countyName: string; // must match a name in MARYLAND_COUNTIES
}

// Maryland-only, same reasoning as the standalone Net Proceeds calculator:
// transfer/recordation tax data here is specific to Maryland counties, so
// this widget should never render for a Virginia or DC property - the
// parent component is responsible for only mounting this when the
// property's county actually matches a Maryland county.
export const EmbeddedNetProceedsEstimate: React.FC<EmbeddedNetProceedsEstimateProps> = ({ initialPrice, countyName }) => {
  const county = MARYLAND_COUNTIES.find((c) => c.name === countyName) || MARYLAND_COUNTIES[0];
  const [salePrice, setSalePrice] = useState(initialPrice);
  const [commissionPct, setCommissionPct] = useState(5.5);
  const [mortgagePayoff, setMortgagePayoff] = useState(0);

  const result = useMemo(() => {
    const commission = salePrice * (commissionPct / 100);
    const deedTax = calculateDeedTax(county, salePrice);
    const sellerTaxShare = deedTax.total * 0.5;
    const netProceeds = salePrice - commission - sellerTaxShare - mortgagePayoff;
    return { commission, sellerTaxShare, netProceeds };
  }, [salePrice, county, commissionPct, mortgagePayoff]);

  const inputClass = 'w-full bg-white border border-[#0D2226]/20 p-2 text-sm text-[#0D2226] focus:border-[#C9A96A] focus:outline-none';
  const labelClass = 'block text-[10px] font-bold uppercase tracking-widest text-[#1C2B2E]/60 mb-1';

  return (
    <div className="bg-[#FAF8F5] border border-[#C9A96A]/30 p-6 sm:p-8 mt-6">
      <h3 className="text-[11px] uppercase tracking-widest text-[#C9A96A] font-bold mb-1">Net Proceeds Calculator</h3>
      <p className="text-sm font-semibold text-[#0D2226] mb-5">What could a seller walk away with at this price in {county.name}?</p>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        <div className="space-y-4">
          <div>
            <label className={labelClass}>Sale Price</label>
            <input type="number" className={inputClass} value={salePrice} onChange={(e) => setSalePrice(Number(e.target.value) || 0)} />
          </div>
          <div>
            <label className={labelClass}>Remaining Mortgage Payoff</label>
            <input type="number" className={inputClass} value={mortgagePayoff} onChange={(e) => setMortgagePayoff(Number(e.target.value) || 0)} />
          </div>
          <div>
            <label className={labelClass}>Agent Commission (%)</label>
            <input type="number" step="0.1" className={inputClass} value={commissionPct} onChange={(e) => setCommissionPct(Number(e.target.value) || 0)} />
          </div>
        </div>
        <div className="bg-[#0D2226] p-5 flex flex-col items-center justify-center">
          <PaymentBreakdownChart
            total={salePrice}
            totalLabel="Sale Price"
            slices={[
              { label: 'Net Proceeds', value: Math.max(result.netProceeds, 0), color: '#0F5C63' },
              { label: 'Mortgage Payoff', value: mortgagePayoff, color: '#8B7355' },
              { label: 'Commission', value: result.commission, color: '#C9A96A' },
              { label: 'Transfer/Recordation Tax', value: result.sellerTaxShare, color: '#A8B2A1' },
            ]}
          />
        </div>
      </div>
      <p className="text-[11px] text-[#1C2B2E]/50 mt-4">
        Uses real {county.name} transfer and recordation tax rates. For the full breakdown, try the <a href={`/calculators/net-proceeds?price=${salePrice}`} className="underline hover:text-[#0F5C63]">full net proceeds calculator</a>.
      </p>
    </div>
  );
};
