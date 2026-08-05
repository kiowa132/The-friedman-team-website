import React, { useMemo, useState } from 'react';
import { Phone } from 'lucide-react';
import { usePageMeta } from '../lib/usePageMeta';
import { formatCurrency, MARYLAND_COUNTIES, calculateDeedTax } from '../lib/calculators';

interface NetProceedsCalculatorPageProps {
  onOpenConsultation: () => void;
}

const inputClass = 'w-full bg-[#FAF8F5] border border-[#0D2226]/20 p-2.5 text-sm text-[#0D2226] focus:border-[#C9A96A] focus:outline-none';
const labelClass = 'block text-xs font-bold uppercase tracking-widest text-[#1C2B2E]/70 mb-1.5';

export const NetProceedsCalculatorPage: React.FC<NetProceedsCalculatorPageProps> = ({ onOpenConsultation }) => {
  usePageMeta(
    'Home Sale Net Proceeds Calculator | The Friedman Team',
    'Estimate what you could walk away with after selling your Maryland home, in any county.'
  );

  const [salePrice, setSalePrice] = useState(500000);
  const [countyIndex, setCountyIndex] = useState(() => MARYLAND_COUNTIES.findIndex((c) => c.name === 'Carroll County'));
  const [mortgagePayoff, setMortgagePayoff] = useState(250000);
  const [commissionPct, setCommissionPct] = useState(5.5);
  const [sellerTaxSharePct, setSellerTaxSharePct] = useState(50); // customary 50/50 split, editable
  const [otherClosingCosts, setOtherClosingCosts] = useState(2500);

  const county = MARYLAND_COUNTIES[countyIndex];

  const result = useMemo(() => {
    const commission = salePrice * (commissionPct / 100);
    const deedTax = calculateDeedTax(county, salePrice);
    const sellerTaxShare = deedTax.total * (sellerTaxSharePct / 100);
    const totalCosts = commission + sellerTaxShare + otherClosingCosts + mortgagePayoff;
    const netProceeds = salePrice - totalCosts;
    return { commission, deedTax, sellerTaxShare, netProceeds };
  }, [salePrice, county, commissionPct, sellerTaxSharePct, otherClosingCosts, mortgagePayoff]);

  return (
    <div className="pt-28 pb-20 bg-[#FAF8F5]">
      <div className="max-w-5xl mx-auto px-4 sm:px-6">
        <div className="mb-10 text-center">
          <span className="text-[11px] uppercase tracking-[0.25em] text-[#C9A96A] font-bold">Free Tool</span>
          <h1 className="font-serif text-4xl sm:text-5xl font-bold text-[#0D2226] mt-2">Home Sale Net Proceeds Calculator</h1>
          <p className="text-sm text-[#1C2B2E]/70 mt-3 max-w-xl mx-auto">
            Estimate what you could walk away with, using real transfer and recordation tax rates for all 23 Maryland counties and Baltimore City.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Inputs */}
          <div className="bg-white border border-[#C9A96A]/30 p-6 sm:p-8 space-y-5">
            <div>
              <label className={labelClass}>Expected Sale Price</label>
              <input type="number" className={inputClass} value={salePrice} onChange={(e) => setSalePrice(Number(e.target.value) || 0)} />
            </div>
            <div>
              <label className={labelClass}>County</label>
              <select className={inputClass} value={countyIndex} onChange={(e) => setCountyIndex(Number(e.target.value))}>
                {MARYLAND_COUNTIES.map((c, i) => (
                  <option key={c.name} value={i}>{c.name}</option>
                ))}
              </select>
            </div>
            <div>
              <label className={labelClass}>Remaining Mortgage Payoff</label>
              <input type="number" className={inputClass} value={mortgagePayoff} onChange={(e) => setMortgagePayoff(Number(e.target.value) || 0)} />
            </div>
            <div>
              <label className={labelClass}>Total Agent Commission (%)</label>
              <input type="number" step="0.1" className={inputClass} value={commissionPct} onChange={(e) => setCommissionPct(Number(e.target.value) || 0)} />
            </div>
            <div>
              <label className={labelClass}>Your Share of Transfer/Recordation Tax (%)</label>
              <input type="number" step="1" className={inputClass} value={sellerTaxSharePct} onChange={(e) => setSellerTaxSharePct(Number(e.target.value) || 0)} />
              <p className="text-[11px] text-[#1C2B2E]/50 mt-1">
                Customarily split 50/50 with the buyer in most Maryland counties, but this is negotiable per contract (Montgomery County commonly shifts more of this to the buyer).
              </p>
            </div>
            <div>
              <label className={labelClass}>Other Estimated Closing Costs</label>
              <input type="number" className={inputClass} value={otherClosingCosts} onChange={(e) => setOtherClosingCosts(Number(e.target.value) || 0)} />
              <p className="text-[11px] text-[#1C2B2E]/50 mt-1">Title/settlement fees, home warranty, prorated costs, etc.</p>
            </div>
          </div>

          {/* Results */}
          <div className="bg-[#0D2226] text-[#FAF8F5] p-6 sm:p-8 space-y-6">
            <div className="text-center pb-6 border-b border-[#FAF8F5]/15">
              <div className="text-[11px] uppercase tracking-widest text-[#C9A96A] font-bold mb-1">Estimated Net Proceeds</div>
              <div className="font-serif text-4xl sm:text-5xl font-bold">{formatCurrency(result.netProceeds)}</div>
            </div>
            <div className="space-y-3 text-sm">
              <div className="flex justify-between"><span className="text-[#A8B2A1]">Sale Price</span><span className="font-semibold">{formatCurrency(salePrice)}</span></div>
              <div className="flex justify-between"><span className="text-[#A8B2A1]">Mortgage Payoff</span><span className="font-semibold">−{formatCurrency(mortgagePayoff)}</span></div>
              <div className="flex justify-between"><span className="text-[#A8B2A1]">Agent Commission</span><span className="font-semibold">−{formatCurrency(result.commission)}</span></div>
              <div className="flex justify-between"><span className="text-[#A8B2A1]">Transfer/Recordation Tax (your share)</span><span className="font-semibold">−{formatCurrency(result.sellerTaxShare)}</span></div>
              <div className="flex justify-between"><span className="text-[#A8B2A1]">Other Closing Costs</span><span className="font-semibold">−{formatCurrency(otherClosingCosts)}</span></div>
            </div>
            <div className="pt-4 border-t border-[#FAF8F5]/15 space-y-1 text-xs text-[#A8B2A1]">
              <div className="font-bold text-[#C9A96A] uppercase tracking-widest text-[10px] mb-1">{county.name} Tax Detail</div>
              <div className="flex justify-between"><span>State transfer tax (0.5%)</span><span>{formatCurrency(result.deedTax.stateTransferTax)}</span></div>
              <div className="flex justify-between"><span>County transfer tax</span><span>{formatCurrency(result.deedTax.localTransferTax)}</span></div>
              <div className="flex justify-between"><span>Recordation tax</span><span>{formatCurrency(result.deedTax.recordationTax)}</span></div>
              <div className="flex justify-between font-semibold text-[#FAF8F5]"><span>Total (before split)</span><span>{formatCurrency(result.deedTax.total)}</span></div>
            </div>
            <button
              onClick={onOpenConsultation}
              className="w-full py-3.5 bg-[#C9A96A] hover:bg-[#D4AF37] text-[#0D2226] font-bold text-xs uppercase tracking-widest rounded-xs shadow-lg transition-all flex items-center justify-center gap-2"
            >
              <Phone className="w-4 h-4" />
              Get a Real Net Proceeds Estimate
            </button>
          </div>
        </div>

        <p className="text-xs text-[#1C2B2E]/50 text-center mt-8 max-w-xl mx-auto">
          This is an estimate for general informational purposes only, not a guarantee of proceeds or a substitute for a real settlement statement. Maryland transfer/recordation tax rates and customary splits vary and are negotiable per contract; confirm exact figures with your title/settlement company before relying on this for a real transaction.
        </p>
      </div>
    </div>
  );
};
