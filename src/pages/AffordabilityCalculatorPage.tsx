import React, { useMemo, useRef, useState } from 'react';
import { Phone, Info } from 'lucide-react';
import { usePageMeta } from '../lib/usePageMeta';
import { formatCurrency, monthlyPrincipalAndInterest, MARYLAND_COUNTIES, calculateDeedTax } from '../lib/calculators';
import { PaymentBreakdownChart } from '../components/PaymentBreakdownChart';
import { GatedResults } from '../components/GatedResults';

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

// Typical minimum down payment for a first-time buyer using a conventional
// 97% LTV program or FHA (3-3.5%). Not universal - just a reasonable
// starting point to quick-fill for someone exploring the low end.
const FIRST_TIME_BUYER_TYPICAL_DOWN_PCT = 3;

export const AffordabilityCalculatorPage: React.FC<AffordabilityCalculatorPageProps> = ({ onOpenConsultation }) => {
  usePageMeta(
    'Affordability Calculator | The Friedman Team',
    'Estimate how much home you can afford, including real cash-to-close costs for Maryland first-time homebuyers.'
  );

  const [annualIncome, setAnnualIncome] = useState(120000);
  const [monthlyDebts, setMonthlyDebts] = useState(500);
  const [downPayment, setDownPayment] = useState(60000);
  const [rate, setRate] = useState(6.5);
  const [termYears, setTermYears] = useState(30);
  const [annualPropertyTaxRatePct, setAnnualPropertyTaxRatePct] = useState(1.1);
  const [annualInsurance, setAnnualInsurance] = useState(1500);
  const [isFirstTimeBuyer, setIsFirstTimeBuyer] = useState(false);
  const [countyIndex, setCountyIndex] = useState(() => MARYLAND_COUNTIES.findIndex((c) => c.name === 'Carroll County'));
  const [lenderTitleFees, setLenderTitleFees] = useState(4000);

  // Captures the true starting values once, then flags interaction the
  // moment anything actually changes.
  const initialSnapshot = useRef(JSON.stringify([120000, 500, 60000, 6.5, 30, 1.1, 1500, false, MARYLAND_COUNTIES.findIndex((c) => c.name === 'Carroll County'), 4000]));
  const hasInteracted = JSON.stringify([annualIncome, monthlyDebts, downPayment, rate, termYears, annualPropertyTaxRatePct, annualInsurance, isFirstTimeBuyer, countyIndex, lenderTitleFees]) !== initialSnapshot.current;

  const county = MARYLAND_COUNTIES[countyIndex];

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

    // Cash needed to close, using the affordable price as the basis. A
    // first-time buyer pays no state transfer tax at all (the seller pays
    // the full, reduced 0.25% rate instead), so the buyer's deed-tax share
    // only applies to the county transfer + recordation tax portions.
    const deedTax = calculateDeedTax(county, maxHomePrice, isFirstTimeBuyer);
    const buyerShareOfDeedTax = isFirstTimeBuyer
      ? (deedTax.localTransferTax + deedTax.recordationTax) * 0.5
      : deedTax.total * 0.5;
    const cashToClose = downPayment + buyerShareOfDeedTax + lenderTitleFees;

    return {
      maxHomePrice,
      maxHousingPayment,
      monthlyPI,
      monthlyTax,
      monthlyInsurance,
      buyerShareOfDeedTax,
      cashToClose,
    };
  }, [annualIncome, monthlyDebts, downPayment, rate, termYears, annualPropertyTaxRatePct, annualInsurance, county, isFirstTimeBuyer, lenderTitleFees]);

  const downPaymentPct = result.maxHomePrice > 0 ? (downPayment / result.maxHomePrice) * 100 : 0;

  return (
    <div className="pt-28 pb-20 bg-[#FAF8F5]">
      <div className="max-w-5xl mx-auto px-4 sm:px-6">
        <div className="mb-10 text-center">
          <div className="flex items-center justify-center gap-2 mb-4">
            <img src="/images/brand/friedman-f-mark.png" alt="" className="h-6 w-auto" />
            <span className="text-xs uppercase tracking-widest text-[#1C2B2E]/60 font-semibold">The Friedman Team</span>
          </div>
          <span className="text-[11px] uppercase tracking-[0.25em] text-[#C9A96A] font-bold">Free Tool</span>
          <h1 className="font-serif text-4xl sm:text-5xl font-bold text-[#0D2226] mt-2">Affordability Calculator</h1>
          <p className="text-sm text-[#1C2B2E]/70 mt-3 max-w-xl mx-auto">
            A conservative estimate of what you can afford, plus real cash-to-close costs for your county.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Inputs */}
          <div className="bg-white border border-[#C9A96A]/30 p-6 sm:p-8 space-y-5">
            <label className="flex items-center gap-3 p-3 bg-[#0F5C63]/5 border border-[#0F5C63]/20 cursor-pointer">
              <input type="checkbox" checked={isFirstTimeBuyer} onChange={(e) => setIsFirstTimeBuyer(e.target.checked)} className="w-4 h-4 accent-[#0F5C63]" />
              <span className="text-sm font-semibold text-[#0D2226]">I'm a first-time Maryland homebuyer</span>
            </label>
            {isFirstTimeBuyer && (
              <div className="flex gap-2 -mt-2">
                <button
                  type="button"
                  onClick={() => setDownPayment(Math.round(result.maxHomePrice * (FIRST_TIME_BUYER_TYPICAL_DOWN_PCT / 100)) || Math.round(annualIncome * 0.03))}
                  className="text-[11px] font-bold uppercase tracking-widest text-[#0F5C63] hover:text-[#C9A96A] underline"
                >
                  Use a typical {FIRST_TIME_BUYER_TYPICAL_DOWN_PCT}% down payment
                </button>
              </div>
            )}

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
            <div>
              <label className={labelClass}>County</label>
              <select className={inputClass} value={countyIndex} onChange={(e) => setCountyIndex(Number(e.target.value))}>
                {MARYLAND_COUNTIES.map((c, i) => (
                  <option key={c.name} value={i}>{c.name}</option>
                ))}
              </select>
            </div>
            <div>
              <label className={labelClass}>Estimated Lender & Title Fees</label>
              <input type="number" className={inputClass} value={lenderTitleFees} onChange={(e) => setLenderTitleFees(Number(e.target.value) || 0)} />
              <p className="text-[11px] text-[#1C2B2E]/50 mt-1">Appraisal, credit report, title search, settlement fee, etc.</p>
            </div>
          </div>

          {/* Results */}
          <div className="bg-[#0D2226] text-[#FAF8F5] p-6 sm:p-8 flex flex-col items-center">
            <GatedResults
              calculatorName="Affordability Calculator"
              hasInteracted={hasInteracted}
              resultsSummary={`Estimated Affordable Home Price: ${formatCurrency(result.maxHomePrice)}\nMax Monthly Payment: ${formatCurrency(result.maxHousingPayment)}\nDown Payment: ${formatCurrency(downPayment)} (${downPaymentPct.toFixed(1)}%)\nEstimated Cash to Close: ${formatCurrency(result.cashToClose)}`}
            >
            <div className="w-full flex flex-col items-center">
            <div className="text-center pb-2">
              <div className="text-[11px] uppercase tracking-widest text-[#C9A96A] font-bold mb-1">Estimated Affordable Home Price</div>
              <div className="font-serif text-3xl sm:text-4xl font-bold">{formatCurrency(result.maxHomePrice)}</div>
            </div>
            <div className="w-full pt-4">
              <PaymentBreakdownChart
                total={result.maxHousingPayment}
                totalLabel="Max Monthly Payment"
                slices={[
                  { label: 'Principal & Interest', value: result.monthlyPI, color: '#0F5C63' },
                  { label: 'Property Tax', value: result.monthlyTax, color: '#C9A96A' },
                  { label: 'Insurance', value: result.monthlyInsurance, color: '#A8B2A1' },
                ]}
              />
            </div>

            <div className="w-full pt-5 mt-5 border-t border-[#FAF8F5]/15 space-y-3">
              <div className="text-[11px] uppercase tracking-widest text-[#C9A96A] font-bold">Estimated Cash Needed to Close</div>
              <div className="grid grid-cols-2 gap-3">
                <div className="bg-[#0F5C63]/25 border border-[#0F5C63]/50 p-3.5">
                  <div className="text-[10px] uppercase tracking-widest text-[#7FBFC4] font-bold mb-1">Down Payment ({downPaymentPct.toFixed(1)}%)</div>
                  <div className="font-serif text-xl font-bold text-[#FAF8F5]">{formatCurrency(downPayment)}</div>
                </div>
                <div className="bg-[#0F5C63]/25 border border-[#0F5C63]/50 p-3.5">
                  <div className="text-[10px] uppercase tracking-widest text-[#7FBFC4] font-bold mb-1">Transfer/Recordation Tax</div>
                  <div className="font-serif text-xl font-bold text-[#FAF8F5]">{formatCurrency(result.buyerShareOfDeedTax)}</div>
                </div>
                <div className="bg-[#0F5C63]/25 border border-[#0F5C63]/50 p-3.5">
                  <div className="text-[10px] uppercase tracking-widest text-[#7FBFC4] font-bold mb-1">Lender & Title Fees</div>
                  <div className="font-serif text-xl font-bold text-[#FAF8F5]">{formatCurrency(lenderTitleFees)}</div>
                </div>
                <div className="bg-[#C9A96A]/25 border border-[#C9A96A]/60 p-3.5">
                  <div className="text-[10px] uppercase tracking-widest text-[#E4CFA0] font-bold mb-1">Total Cash to Close</div>
                  <div className="font-serif text-xl font-bold text-[#FAF8F5]">{formatCurrency(result.cashToClose)}</div>
                </div>
              </div>
              {isFirstTimeBuyer && (
                <div className="flex gap-2 text-[11px] text-[#A8B2A1] bg-[#FAF8F5]/5 p-2.5">
                  <Info className="w-3.5 h-3.5 shrink-0 mt-0.5" />
                  <span>
                    As a first-time Maryland homebuyer, the seller pays the full state transfer tax (at a reduced 0.25% rate) instead of splitting it with you.
                    Maryland Mortgage Program down payment and closing cost assistance may also be available. Confirm details with a licensed loan officer.
                  </span>
                </div>
              )}
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
              Talk to Kyle Friedman About Buying
            </button>
            </div>
            </GatedResults>
          </div>
        </div>

        <p className="text-xs text-[#1C2B2E]/50 text-center mt-8 max-w-xl mx-auto">
          This is a conservative estimate for general informational purposes only, using standard 28%/36% income ratios, not a pre-approval or loan offer. Actual approval amounts vary by lender, credit profile, and loan program; some programs (FHA, VA, Maryland Mortgage Program) allow different ratios. Talk to a licensed loan officer for exact figures.
        </p>
      </div>
    </div>
  );
};
