import React from 'react';
import { Link } from 'react-router-dom';
import { FileText, ArrowRight } from 'lucide-react';
import { GUIDES } from '../data/blogContent';

export const GuidesListPage: React.FC = () => {
  return (
    <div className="pt-28 pb-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
      <div className="text-center space-y-3">
        <span className="text-xs font-bold uppercase tracking-[0.25em] text-[#0F5C63] bg-[#0F5C63]/10 px-4 py-1.5 border border-[#0F5C63]/30 inline-block">
          Free Resources
        </span>
        <h1 className="font-serif text-4xl sm:text-6xl font-bold text-[#0D2226]">
          Buyer & Seller Guides
        </h1>
        <p className="text-sm text-[#1C2B2E]/80 max-w-2xl mx-auto">
          Real, local guides - not generic national advice.
        </p>
      </div>

      {GUIDES.length === 0 ? (
        <div className="text-center py-20 text-sm text-[#1C2B2E]/60">
          New guides coming soon.
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {GUIDES.map((guide) => (
            <Link
              key={guide.slug}
              to={`/guides/${guide.slug}`}
              className="group block bg-white border border-[#C9A96A]/30 rounded-xs overflow-hidden shadow-sm hover:shadow-lg transition-shadow"
            >
              <div className="aspect-[4/3] overflow-hidden">
                <img
                  src={guide.coverImage}
                  alt={guide.title}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
              </div>
              <div className="p-5 space-y-2">
                <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-[#C9A96A]">
                  <FileText className="w-3.5 h-3.5" />
                  Free Guide
                </div>
                <h2 className="font-serif text-lg font-bold text-[#0D2226] leading-snug">{guide.title}</h2>
                <p className="text-xs text-[#1C2B2E]/70 line-clamp-2">{guide.description}</p>
                <span className="text-xs font-bold text-[#0F5C63] flex items-center gap-1 group-hover:text-[#C9A96A] transition-colors pt-2">
                  Download <ArrowRight className="w-3 h-3" />
                </span>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
};
