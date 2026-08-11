import React, { useMemo, useRef, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Phone } from 'lucide-react';
import { usePageMeta } from '../lib/usePageMeta';
import { formatCurrency, MARYLAND_COUNTIES, calculateDeedTax } from '../lib/calculators';
import { PaymentBreakdownChart } from '../components/PaymentBreakdownChart';
import { GatedResults } from '../components/GatedResults';

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

  const [searchParams] = useSearchParams();
  const priceParam = Number(searchParams.get('price'));

  const [salePrice, setSalePrice] = useState(priceParam > 0 ? priceParam : 500000);
  const [countyIndex, setCountyIndex] = useState(() => MARYLAND_COUNTIES.findIndex((c) => c.name === 'Carroll County'));
  const [mortgagePayoff, setMortgagePayoff] = useState(250000);
  const [commissionPct, setCommissionPct] = useState(5.5);
  const [sellerTaxSharePct, setSellerTaxSharePct] = useState(50); // customary 50/50 split, editable
  const [otherClosingCosts, setOtherClosingCosts] = useState(2500);

  // Captures the true starting values once (including any ?price= from
  // the URL), then flags interaction the moment anything actually changes.
  const initialSnapshot = useRef(JSON.stringify([priceParam > 0 ? priceParam : 500000, MARYLAND_COUNTIES.findIndex((c) => c.name === 'Carroll County'), 250000, 5.5, 50, 2500]));
  const hasInteracted = JSON.stringify([salePrice, countyIndex, mortgagePayoff, commissionPct, sellerTaxSharePct, otherClosingCosts]) !== initialSnapshot.current;

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
          <div className="flex items-center justify-center gap-2 mb-4">
            <img src="/images/brand/friedman-f-mark.png" alt="" className="h-6 w-auto" />
            <span className="text-xs uppercase tracking-widest text-[#1C2B2E]/60 font-semibold">The Friedman Team</span>
          </div>
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
          <div className="bg-[#0D2226] text-[#FAF8F5] p-6 sm:p-8 flex flex-col items-center">
            <GatedResults
              calculatorName="Net Proceeds Calculator"
              hasInteracted={hasInteracted}
              resultsSummary={`Sale Price: ${formatCurrency(salePrice)}\nEstimated Net Proceeds: ${formatCurrency(result.netProceeds)}\nAgent Commission: ${formatCurrency(result.commission)}\nTransfer/Recordation Tax: ${formatCurrency(result.sellerTaxShare)}`}
            >
            <div className="w-full flex flex-col items-center">
            <div className="text-center pb-6 border-b border-[#FAF8F5]/15 w-full">
              <div className="text-[11px] uppercase tracking-widest text-[#C9A96A] font-bold mb-1">Estimated Net Proceeds</div>
              <div className="font-serif text-4xl sm:text-5xl font-bold">{formatCurrency(result.netProceeds)}</div>
            </div>
            <div className="pt-4 w-full">
              <PaymentBreakdownChart
                total={salePrice}
                totalLabel="Sale Price"
                slices={[
                  { label: 'Net Proceeds (You Keep)', value: Math.max(result.netProceeds, 0), color: '#0F5C63' },
                  { label: 'Mortgage Payoff', value: mortgagePayoff, color: '#8B7355' },
                  { label: 'Agent Commission', value: result.commission, color: '#C9A96A' },
                  { label: 'Transfer/Recordation Tax', value: result.sellerTaxShare, color: '#A8B2A1' },
                  { label: 'Other Closing Costs', value: otherClosingCosts, color: '#7A8A87' },
                ]}
              />
            </div>
            <div className="pt-5 mt-5 border-t border-[#FAF8F5]/15 w-full space-y-3">
              <div className="text-[11px] uppercase tracking-widest text-[#C9A96A] font-bold">{county.name} Tax Detail</div>
              <div className="grid grid-cols-2 gap-3">
                <div className="bg-[#0F5C63]/25 border border-[#0F5C63]/50 p-3.5">
                  <div className="text-[10px] uppercase tracking-widest text-[#7FBFC4] font-bold mb-1">State Transfer Tax</div>
                  <div className="font-serif text-xl font-bold text-[#FAF8F5]">{formatCurrency(result.deedTax.stateTransferTax)}</div>
                </div>
                <div className="bg-[#0F5C63]/25 border border-[#0F5C63]/50 p-3.5">
                  <div className="text-[10px] uppercase tracking-widest text-[#7FBFC4] font-bold mb-1">County Transfer Tax</div>
                  <div className="font-serif text-xl font-bold text-[#FAF8F5]">{formatCurrency(result.deedTax.localTransferTax)}</div>
                </div>
                <div className="bg-[#0F5C63]/25 border border-[#0F5C63]/50 p-3.5">
                  <div className="text-[10px] uppercase tracking-widest text-[#7FBFC4] font-bold mb-1">Recordation Tax</div>
                  <div className="font-serif text-xl font-bold text-[#FAF8F5]">{formatCurrency(result.deedTax.recordationTax)}</div>
                </div>
                <div className="bg-[#C9A96A]/25 border border-[#C9A96A]/60 p-3.5">
                  <div className="text-[10px] uppercase tracking-widest text-[#E4CFA0] font-bold mb-1">Total (Before Split)</div>
                  <div className="font-serif text-xl font-bold text-[#FAF8F5]">{formatCurrency(result.deedTax.total)}</div>
                </div>
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
              Get a Real Net Proceeds Estimate
            </button>
            </div>
            </GatedResults>
          </div>
        </div>

        <p className="text-xs text-[#1C2B2E]/50 text-center mt-8 max-w-xl mx-auto">
          This is an estimate for general informational purposes only, not a guarantee of proceeds or a substitute for a real settlement statement. Maryland transfer/recordation tax rates and customary splits vary and are negotiable per contract; confirm exact figures with your title/settlement company before relying on this for a real transaction.
        </p>
      </div>
    </div>
  );
};
