import React, { useMemo, useState } from 'react';
import { formatCurrency, MARYLAND_COUNTIES, calculateDeedTax } from '../lib/calculators';
import { PaymentBreakdownChart } from './PaymentBreakdownChart';

interface EmbeddedHomeSaleEstimateProps {
  initialPrice: number;
  mdCountyName?: string; // only set when the property is actually in Maryland
}

// "What could a seller walk away with?" - uses real Maryland transfer and
// recordation tax rates when the property is actually in Maryland (the
// only state this site has real per-county tax data for). For a Virginia
// or DC property, it falls back to a plain, clearly-labeled editable
// percentage instead of applying Maryland's rates somewhere they don't
// apply, or silently hiding the tool altogether.
export const EmbeddedHomeSaleEstimate: React.FC<EmbeddedHomeSaleEstimateProps> = ({ initialPrice, mdCountyName }) => {
  const county = mdCountyName ? MARYLAND_COUNTIES.find((c) => c.name === mdCountyName) : undefined;

  const [salePrice, setSalePrice] = useState(initialPrice);
  const [commissionPct, setCommissionPct] = useState(5.5);
  const [mortgagePayoff, setMortgagePayoff] = useState(0);
  const [genericTaxPct, setGenericTaxPct] = useState(1.5); // editable, used only when not in Maryland

  const result = useMemo(() => {
    const commission = salePrice * (commissionPct / 100);
    let sellerTaxShare: number;
    if (county) {
      const deedTax = calculateDeedTax(county, salePrice);
      sellerTaxShare = deedTax.total * 0.5;
    } else {
      sellerTaxShare = salePrice * (genericTaxPct / 100);
    }
    const netProceeds = salePrice - commission - sellerTaxShare - mortgagePayoff;
    return { commission, sellerTaxShare, netProceeds };
  }, [salePrice, county, commissionPct, mortgagePayoff, genericTaxPct]);

  const inputClass = 'w-full bg-white border border-[#0D2226]/20 p-2 text-sm text-[#0D2226] focus:border-[#C9A96A] focus:outline-none';
  const labelClass = 'block text-[10px] font-bold uppercase tracking-widest text-[#1C2B2E]/60 mb-1';

  return (
    <div className="bg-[#FAF8F5] border border-[#C9A96A]/30 p-6 sm:p-8">
      <h3 className="text-[11px] uppercase tracking-widest text-[#C9A96A] font-bold mb-1">Home Sale Calculator</h3>
      <p className="text-sm font-semibold text-[#0D2226] mb-5">
        {county ? `What could a seller walk away with at this price in ${county.name}?` : 'What could a seller walk away with at this price?'}
      </p>
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
          {!county && (
            <div>
              <label className={labelClass}>Transfer/Closing Tax (%, editable estimate)</label>
              <input type="number" step="0.1" className={inputClass} value={genericTaxPct} onChange={(e) => setGenericTaxPct(Number(e.target.value) || 0)} />
            </div>
          )}
        </div>
        <div className="bg-[#0D2226] p-5 flex flex-col items-center justify-center">
          <PaymentBreakdownChart
            total={salePrice}
            totalLabel="Sale Price"
            slices={[
              { label: 'Net Proceeds', value: Math.max(result.netProceeds, 0), color: '#0F5C63' },
              { label: 'Mortgage Payoff', value: mortgagePayoff, color: '#8B7355' },
              { label: 'Commission', value: result.commission, color: '#C9A96A' },
              { label: county ? 'Transfer/Recordation Tax' : 'Transfer/Closing Tax (est.)', value: result.sellerTaxShare, color: '#A8B2A1' },
            ]}
          />
        </div>
      </div>
      <p className="text-[11px] text-[#1C2B2E]/50 mt-4">
        {county
          ? `Uses real ${county.name} transfer and recordation tax rates. For the full breakdown, try the `
          : "Virginia and DC have their own transfer tax rules this site doesn't have exact rates for yet, so that figure above is a plain editable estimate, not a precise calculation. For an exact number, confirm with a title company, or try the "}
        <a href={`/calculators/net-proceeds?price=${salePrice}`} className="underline hover:text-[#0F5C63]">full net proceeds calculator</a>{county ? '.' : ' for Maryland properties.'}
      </p>
    </div>
  );
};
