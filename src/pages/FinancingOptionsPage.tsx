import React from 'react';
import { Link } from 'react-router-dom';
import { usePageMeta } from '../lib/usePageMeta';
import { Phone, Calculator, ArrowRight } from 'lucide-react';

interface FinancingOptionsPageProps {
  onOpenConsultation: () => void;
}

interface LoanProgram {
  name: string;
  bestFor: string;
  downPayment: string;
  details: string;
}

const PROGRAMS: LoanProgram[] = [
  {
    name: 'Conventional Loan',
    bestFor: 'Buyers with steady income and a credit score in the mid 600s or above',
    downPayment: 'As low as 3% for first time buyers, 5% otherwise',
    details: "Not backed by a government agency, so requirements are set by the lender within guidelines from Fannie Mae and Freddie Mac. Private mortgage insurance (PMI) applies below 20% down but cancels once you reach 20% equity, unlike some government backed loans.",
  },
  {
    name: 'FHA Loan',
    bestFor: 'Buyers with a lower credit score or limited savings for a down payment',
    downPayment: 'As low as 3.5% with a qualifying credit score',
    details: "Backed by the Federal Housing Administration, with more flexible credit and debt to income requirements than conventional loans. Requires mortgage insurance for the life of the loan in most cases, which is a real tradeoff worth discussing with a loan officer.",
  },
  {
    name: 'VA Loan',
    bestFor: 'Eligible active duty service members, veterans, and some surviving spouses',
    downPayment: '0% down for eligible borrowers',
    details: "Backed by the Department of Veterans Affairs. No down payment or PMI required for eligible borrowers, and often competitive interest rates. Requires a VA funding fee in most cases, which can be rolled into the loan.",
  },
  {
    name: 'USDA Loan',
    bestFor: 'Buyers purchasing in an eligible rural or suburban area, within income limits',
    downPayment: '0% down for eligible borrowers',
    details: "Backed by the U.S. Department of Agriculture for eligible rural and some suburban areas, which covers meaningful parts of Carroll and Frederick counties. Income limits apply based on household size and county.",
  },
  {
    name: 'Maryland Mortgage Program',
    bestFor: 'Maryland buyers who qualify for state backed down payment and closing cost assistance',
    downPayment: 'Can be paired with as little as 0-3% down depending on the loan',
    details: "The State of Maryland's homeownership program, offering below market interest rates and down payment/closing cost assistance for eligible buyers, often paired with first time buyer benefits like Maryland's reduced state transfer tax.",
  },
];

export const FinancingOptionsPage: React.FC<FinancingOptionsPageProps> = ({ onOpenConsultation }) => {
  usePageMeta(
    'Financing Options | The Friedman Team',
    'A real, plain-language overview of conventional, FHA, VA, USDA, and Maryland Mortgage Program loans.'
  );

  return (
    <div className="pt-28 pb-20 bg-[#FAF8F5]">
      <div className="max-w-4xl mx-auto px-4 sm:px-6">
        <div className="mb-12 text-center">
          <span className="text-[11px] uppercase tracking-[0.25em] text-[#C9A96A] font-bold">Financing</span>
          <h1 className="font-serif text-4xl sm:text-5xl font-bold text-[#0D2226] mt-2">Financing Options</h1>
          <p className="text-sm text-[#1C2B2E]/70 mt-3 max-w-2xl mx-auto">
            A plain language overview of the loan programs Maryland buyers actually use. This isn't loan advice. Think of it as a starting point before you talk to a licensed loan officer.
          </p>
        </div>

        <div className="space-y-5">
          {PROGRAMS.map((p) => (
            <div key={p.name} className="bg-white border border-[#C9A96A]/30 p-6 sm:p-8">
              <div className="flex flex-wrap items-baseline justify-between gap-2 mb-2">
                <h2 className="font-serif text-2xl font-bold text-[#0D2226]">{p.name}</h2>
                <span className="text-xs font-bold uppercase tracking-widest text-[#0F5C63]">{p.downPayment} down</span>
              </div>
              <p className="text-xs uppercase tracking-widest text-[#C9A96A] font-bold mb-3">Best for: {p.bestFor}</p>
              <p className="text-sm text-[#1C2B2E]/80 leading-relaxed">{p.details}</p>
            </div>
          ))}
        </div>

        <div className="mt-12 bg-[#0D2226] text-[#FAF8F5] p-8 sm:p-10 text-center">
          <div className="flex items-center justify-center gap-2 mb-4">
            <img src="/images/brand/friedman-f-mark.png" alt="" className="h-6 w-auto" />
            <span className="text-xs uppercase tracking-widest text-[#A8B2A1] font-semibold">The Friedman Team</span>
          </div>
          <h2 className="font-serif text-2xl sm:text-3xl font-bold mb-3">See What You Could Qualify For</h2>
          <p className="text-sm text-[#A8B2A1] max-w-xl mx-auto mb-6">
            Run your own numbers with the affordability calculator, including a first-time buyer toggle for Maryland-specific savings, or talk to Kyle Friedman directly about which program fits your situation.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-4">
            <Link
              to="/calculators/affordability"
              className="inline-flex items-center gap-2 px-6 py-3 border border-[#FAF8F5]/60 hover:border-[#C9A96A] text-[#FAF8F5] hover:text-[#C9A96A] font-bold text-xs uppercase tracking-widest transition-colors"
            >
              <Calculator className="w-4 h-4" />
              Affordability Calculator
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
            <button
              onClick={onOpenConsultation}
              className="inline-flex items-center gap-2 px-6 py-3 bg-[#C9A96A] hover:bg-[#D4AF37] text-[#0D2226] font-bold text-xs uppercase tracking-widest transition-colors"
            >
              <Phone className="w-4 h-4" />
              Talk to Kyle Friedman
            </button>
          </div>
        </div>

        <p className="text-xs text-[#1C2B2E]/50 text-center mt-8">
          Loan programs, eligibility, and terms change and vary by lender. This page is educational only, not a loan offer, pre-approval, or guarantee of eligibility. Talk to a licensed loan officer for your specific situation.
        </p>
      </div>
    </div>
  );
};
