// Shared math and formatting for the site's calculator pages. Keeping the
// actual formulas here (rather than duplicated in each page) means the
// mortgage math backing the affordability calculator and the payment
// calculator can never drift apart.

export function formatCurrency(value: number, opts: { decimals?: number } = {}): string {
  if (!isFinite(value)) return '$0';
  return value.toLocaleString('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: opts.decimals ?? 0,
    minimumFractionDigits: opts.decimals ?? 0,
  });
}

// Standard mortgage amortization formula. Returns 0 if the rate is 0 (an
// interest-free loan is just principal / number of payments).
export function monthlyPrincipalAndInterest(loanAmount: number, annualRatePct: number, termYears: number): number {
  const n = termYears * 12;
  if (n <= 0 || loanAmount <= 0) return 0;
  const r = annualRatePct / 100 / 12;
  if (r === 0) return loanAmount / n;
  const factor = Math.pow(1 + r, n);
  return (loanAmount * r * factor) / (factor - 1);
}

export function totalInterestPaid(monthlyPI: number, termYears: number, loanAmount: number): number {
  return Math.max(monthlyPI * termYears * 12 - loanAmount, 0);
}

// ---------------------------------------------------------------------------
// Maryland transfer & recordation tax rates, by county, verified directly
// against each county's own government site (not a third-party aggregator)
// as of August 2026:
//   - Carroll County recordation tax: carrollcountymd.gov (official PDF)
//   - Howard County recordation + transfer tax: howardcountymd.gov/finance,
//     courts.state.md.us/clerks/howard
//   - Frederick County recordation tax: frederickcountymd.gov/7861,
//     courts.state.md.us/clerks/frederick (also confirms 0% county transfer)
//   - Baltimore County: multiple corroborating sources (1.5% county
//     transfer tax, $2.50/$500 recordation) - Baltimore County doesn't
//     publish as clean a single citable page as the other three, so this
//     one is the least directly-primary-sourced of the four; worth a
//     spot-check against a Baltimore County title company if precision on
//     a specific deal matters.
//
// These rates change on their own budget cycles - re-verify periodically,
// and always tell clients to confirm the exact split and rate with their
// title/settlement company before relying on this for a real transaction.
// ---------------------------------------------------------------------------
export interface CountyTaxRates {
  county: string;
  countyTransferTaxPct: number; // county transfer tax, % of sale price
  recordationTaxPerFiveHundred: number; // $ per $500 of consideration
}

export const MARYLAND_COUNTY_TAX_RATES: CountyTaxRates[] = [
  { county: 'Carroll County', countyTransferTaxPct: 0, recordationTaxPerFiveHundred: 6.5 },
  { county: 'Baltimore County', countyTransferTaxPct: 1.5, recordationTaxPerFiveHundred: 2.5 },
  { county: 'Howard County', countyTransferTaxPct: 1.25, recordationTaxPerFiveHundred: 2.5 },
  { county: 'Frederick County', countyTransferTaxPct: 0, recordationTaxPerFiveHundred: 7.0 },
];

export const MD_STATE_TRANSFER_TAX_PCT = 0.5;

// Combined transfer + recordation tax on the deed itself, as a percentage
// of sale price. This is customarily split 50/50 between buyer and seller
// in most of Maryland (negotiable, and recordation tax on the buyer's
// mortgage/loan amount is a separate, buyer-only cost not included here,
// since a seller has no new loan on the sale).
export function combinedDeedTaxPct(rates: CountyTaxRates): number {
  const recordationPct = (rates.recordationTaxPerFiveHundred / 500) * 100;
  return MD_STATE_TRANSFER_TAX_PCT + rates.countyTransferTaxPct + recordationPct;
}
