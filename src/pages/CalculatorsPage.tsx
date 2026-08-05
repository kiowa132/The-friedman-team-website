import React from 'react';
import { Link } from 'react-router-dom';
import { Calculator, TrendingUp, DollarSign, ArrowRight } from 'lucide-react';
import { usePageMeta } from '../lib/usePageMeta';

const TOOLS = [
  {
    icon: Calculator,
    title: 'Mortgage Calculator',
    description: 'Estimate your monthly payment, including principal, interest, taxes, and insurance.',
    path: '/calculators/mortgage',
  },
  {
    icon: TrendingUp,
    title: 'Affordability Calculator',
    description: 'See what you can afford based on your income, debts, and down payment.',
    path: '/calculators/affordability',
  },
  {
    icon: DollarSign,
    title: 'Net Proceeds Calculator',
    description: 'Estimate what you could walk away with, using real Maryland county tax rates.',
    path: '/calculators/net-proceeds',
  },
];

export const CalculatorsPage: React.FC = () => {
  usePageMeta(
    'Real Estate Calculators | The Friedman Team',
    'Free mortgage, affordability, and net proceeds calculators for Maryland buyers and sellers.'
  );

  return (
    <div className="pt-28 pb-20 bg-[#FAF8F5]">
      <div className="max-w-5xl mx-auto px-4 sm:px-6">
        <div className="mb-12 text-center">
          <div className="flex items-center justify-center gap-2 mb-4">
            <img src="/images/brand/friedman-f-mark.png" alt="" className="h-6 w-auto" />
            <span className="text-xs uppercase tracking-widest text-[#1C2B2E]/60 font-semibold">The Friedman Team</span>
          </div>
          <span className="text-[11px] uppercase tracking-[0.25em] text-[#C9A96A] font-bold">Free Tools</span>
          <h1 className="font-serif text-4xl sm:text-5xl font-bold text-[#0D2226] mt-2">Calculators</h1>
          <p className="text-sm text-[#1C2B2E]/70 mt-3 max-w-xl mx-auto">
            Real numbers, not guesswork. Three free tools to help you plan your next move.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          {TOOLS.map((tool) => (
            <Link key={tool.path} to={tool.path} className="group bg-white border border-[#C9A96A]/30 p-6 flex flex-col hover:border-[#0F5C63] transition-colors">
              <div className="w-12 h-12 rounded-full bg-[#0F5C63]/10 flex items-center justify-center text-[#0F5C63] mb-4">
                <tool.icon className="w-6 h-6" />
              </div>
              <h2 className="font-serif text-xl font-bold text-[#0D2226] mb-2">{tool.title}</h2>
              <p className="text-sm text-[#1C2B2E]/70 leading-relaxed flex-1">{tool.description}</p>
              <div className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-widest text-[#0F5C63] mt-4 group-hover:text-[#C9A96A] transition-colors">
                Open Calculator <ArrowRight className="w-3.5 h-3.5" />
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
};
