// Shared math and formatting for the site's calculator pages. Keeping the
// actual formulas here (rather than duplicated in each page) means the
// mortgage math backing multiple calculators can never drift apart.

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

// Rough, commonly-cited PMI estimate for a down payment under 20% on a
// conventional loan. Actual PMI varies by lender, credit score, and loan
// type (FHA's mortgage insurance premium works differently and doesn't
// cancel the same way) - this is a placeholder for "budget roughly this
// much," not a quote.
const ESTIMATED_PMI_ANNUAL_PCT = 0.75;

export function estimateMonthlyPmi(loanAmount: number, downPaymentPct: number): number {
  if (downPaymentPct >= 20) return 0;
  return (loanAmount * (ESTIMATED_PMI_ANNUAL_PCT / 100)) / 12;
}

// ---------------------------------------------------------------------------
// Maryland transfer & recordation tax rates, all 23 counties + Baltimore
// City, sourced from Gordon Feinblatt LLC's published attorney table
// ("Recordation and Transfer Tax Rates in Maryland Explained," accurate as
// of October 1, 2025 per that firm), cross-checked against each of
// Carroll, Baltimore, Howard, and Frederick counties' own government sites
// directly (all four matched exactly).
//
// These rates change on their own local budget cycles - re-verify
// periodically, and always tell clients to confirm the exact rate and the
// buyer/seller split with their title/settlement company before relying on
// this for a real transaction. Every jurisdiction here uses a flat
// percentage of sale price EXCEPT Montgomery County, whose recordation tax
// is a marginal bracket structure (handled separately below), and Anne
// Arundel County / Baltimore City, which step up to a higher rate once the
// sale price crosses $1 million (also handled below).
// ---------------------------------------------------------------------------
export interface CountyTaxInfo {
  name: string;
  recordationPct: number;
  localTransferPct: number;
  highValueThreshold?: number;
  highValueRecordationPct?: number;
  highValueLocalTransferPct?: number;
  isMontgomery?: boolean;
}

export const MD_STATE_TRANSFER_TAX_PCT = 0.5;
// First-time Maryland homebuyers (occupying as principal residence) get a
// reduced 0.25% state transfer tax rate, paid entirely by the seller
// instead of the usual split.
export const MD_FIRST_TIME_BUYER_STATE_TRANSFER_TAX_PCT = 0.25;

export const MARYLAND_COUNTIES: CountyTaxInfo[] = [
  { name: 'Allegany County', recordationPct: 0.7, localTransferPct: 0.5 },
  { name: 'Anne Arundel County', recordationPct: 0.7, localTransferPct: 1.0, highValueThreshold: 1_000_000, highValueLocalTransferPct: 1.5 },
  { name: 'Baltimore City', recordationPct: 1.0, localTransferPct: 1.5, highValueThreshold: 1_000_000, highValueRecordationPct: 1.15, highValueLocalTransferPct: 2.1 },
  { name: 'Baltimore County', recordationPct: 0.5, localTransferPct: 1.5 },
  { name: 'Calvert County', recordationPct: 1.0, localTransferPct: 0 },
  { name: 'Caroline County', recordationPct: 1.05, localTransferPct: 0.5 },
  { name: 'Carroll County', recordationPct: 1.3, localTransferPct: 0 },
  { name: 'Cecil County', recordationPct: 0.82, localTransferPct: 0.5 },
  { name: 'Charles County', recordationPct: 1.4, localTransferPct: 0.5 },
  { name: 'Dorchester County', recordationPct: 1.0, localTransferPct: 0.75 },
  { name: 'Frederick County', recordationPct: 1.4, localTransferPct: 0 },
  { name: 'Garrett County', recordationPct: 0.7, localTransferPct: 1.0 },
  { name: 'Harford County', recordationPct: 0.66, localTransferPct: 1.0 },
  { name: 'Howard County', recordationPct: 0.5, localTransferPct: 1.25 },
  { name: 'Kent County', recordationPct: 0.66, localTransferPct: 0.5 },
  { name: 'Montgomery County', recordationPct: 0, localTransferPct: 1.0, isMontgomery: true },
  { name: "Prince George's County", recordationPct: 0.55, localTransferPct: 1.4 },
  { name: "Queen Anne's County", recordationPct: 0.99, localTransferPct: 0.5 },
  { name: "St. Mary's County", recordationPct: 0.8, localTransferPct: 1.0 },
  { name: 'Somerset County', recordationPct: 0.66, localTransferPct: 0 },
  { name: 'Talbot County', recordationPct: 1.2, localTransferPct: 1.0 },
  { name: 'Washington County', recordationPct: 0.76, localTransferPct: 0.5 },
  { name: 'Wicomico County', recordationPct: 0.7, localTransferPct: 0 },
  { name: 'Worcester County', recordationPct: 0.66, localTransferPct: 0.5 },
];

// Montgomery County's recordation tax is a marginal bracket structure
// (like income tax brackets), effective since Bill 17-23 (Oct 1, 2023).
const MONTGOMERY_RECORDATION_BRACKETS: { upTo: number; ratePct: number }[] = [
  { upTo: 500_000, ratePct: 0.89 },
  { upTo: 600_000, ratePct: 1.35 },
  { upTo: 750_000, ratePct: 2.04 },
  { upTo: 1_000_000, ratePct: 2.156 },
  { upTo: Infinity, ratePct: 2.27 },
];

function montgomeryRecordationTax(salePrice: number): number {
  let tax = 0;
  let lowerBound = 0;
  for (const bracket of MONTGOMERY_RECORDATION_BRACKETS) {
    const upperBound = Math.min(salePrice, bracket.upTo);
    if (upperBound > lowerBound) {
      tax += (upperBound - lowerBound) * (bracket.ratePct / 100);
    }
    lowerBound = bracket.upTo;
    if (salePrice <= bracket.upTo) break;
  }
  return tax;
}

export interface DeedTaxBreakdown {
  recordationTax: number;
  localTransferTax: number;
  stateTransferTax: number;
  total: number;
}

export function calculateDeedTax(county: CountyTaxInfo, salePrice: number, isFirstTimeBuyer = false): DeedTaxBreakdown {
  const stateTransferPct = isFirstTimeBuyer ? MD_FIRST_TIME_BUYER_STATE_TRANSFER_TAX_PCT : MD_STATE_TRANSFER_TAX_PCT;
  const stateTransferTax = salePrice * (stateTransferPct / 100);

  if (county.isMontgomery) {
    const recordationTax = montgomeryRecordationTax(salePrice);
    const localTransferTax = salePrice * (county.localTransferPct / 100);
    return { recordationTax, localTransferTax, stateTransferTax, total: recordationTax + localTransferTax + stateTransferTax };
  }

  const useHighRate = county.highValueThreshold != null && salePrice >= county.highValueThreshold;
  const recordationPct = (useHighRate && county.highValueRecordationPct != null) ? county.highValueRecordationPct : county.recordationPct;
  const localTransferPct = (useHighRate && county.highValueLocalTransferPct != null) ? county.highValueLocalTransferPct : county.localTransferPct;

  const recordationTax = salePrice * (recordationPct / 100);
  const localTransferTax = salePrice * (localTransferPct / 100);
  return { recordationTax, localTransferTax, stateTransferTax, total: recordationTax + localTransferTax + stateTransferTax };
}
