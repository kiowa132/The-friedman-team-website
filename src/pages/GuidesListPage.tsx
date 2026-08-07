import React from 'react';
import { Link } from 'react-router-dom';
import { BookOpen, Clock, Layers, ArrowRight, Download } from 'lucide-react';
import { GUIDES } from '../lib/content';
import { getStructuredGuide } from '../data/guides';

export const GuidesListPage: React.FC = () => {
  return (
    <div className="pt-28 pb-24 bg-[#FAF8F5]">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <span className="text-xs font-bold uppercase tracking-[0.3em] text-[#C9A96A]">
            The Friedman Team Library
          </span>
          <h1 className="font-serif text-5xl sm:text-6xl font-bold text-[#0D2226] mt-3">
            Guides
          </h1>
          <p className="text-base text-[#1C2B2E]/70 mt-4">
            Real, local resources built around how buying and selling actually works in Carroll, Baltimore, and Howard County, not generic national advice.
          </p>
        </div>

        {GUIDES.length === 0 ? (
          <div className="text-center py-20 text-sm text-[#1C2B2E]/60">
            New guides coming soon.
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-1 gap-y-12">
            {GUIDES.map((guide) => {
              const structured = getStructuredGuide(guide.slug);
              return (
                <Link
                  key={guide.slug}
                  to={`/guides/${guide.slug}`}
                  className="group block relative h-[440px] overflow-hidden"
                >
                  <img
                    src={guide.coverImage}
                    alt={guide.title}
                    className="absolute inset-0 w-full h-full object-cover transition-all duration-500 group-hover:scale-105 group-hover:brightness-[0.5]"
                  />
                  <div className="absolute top-4 left-4 flex items-center gap-1.5 px-2.5 py-1 bg-[#0D2226] text-[#C9A96A] text-[10px] font-bold uppercase tracking-widest">
                    <BookOpen className="w-3 h-3" /> {structured?.category || 'Free Guide'}
                  </div>

                  {/* Caption overlay - fixed card height, image always full
                      size, caption grows and darkens on hover. Never a
                      collapsing box, never a gap. */}
                  <div className="absolute inset-x-0 bottom-0 bg-white group-hover:bg-transparent group-hover:bg-gradient-to-t group-hover:from-black/92 group-hover:via-black/60 group-hover:to-transparent px-5 py-5 group-hover:pt-24 transition-all duration-300">
                    <h2 className="font-serif text-lg font-bold text-[#0D2226] group-hover:text-white transition-colors leading-snug">
                      {guide.title}
                    </h2>
                    <p className="hidden group-hover:block text-xs text-white/70 line-clamp-2 mt-2">
                      {guide.description}
                    </p>

                    <div className="flex items-center gap-3 mt-2 group-hover:mt-3 text-[11px] text-[#1C2B2E]/50 group-hover:text-white/70 transition-colors">
                      {structured?.estimatedReadMinutes && (
                        <span className="flex items-center gap-1"><Clock className="w-3 h-3" /> {structured.estimatedReadMinutes} min</span>
                      )}
                      {structured?.sections?.length && (
                        <span className="flex items-center gap-1"><Layers className="w-3 h-3" /> {structured.sections.length} sections</span>
                      )}
                      {structured?.lastUpdated && (
                        <span className="hidden sm:inline">Updated {structured.lastUpdated}</span>
                      )}
                    </div>

                    <div className="hidden group-hover:flex items-center gap-3 mt-4">
                      <span className="inline-flex items-center gap-1.5 px-4 py-2 bg-white text-[#0D2226] text-[11px] font-bold uppercase tracking-widest">
                        Read Online <ArrowRight className="w-3 h-3" />
                      </span>
                      {guide.pdfUrl && (
                        <span className="inline-flex items-center gap-1.5 px-4 py-2 border border-white/50 text-white text-[11px] font-bold uppercase tracking-widest">
                          <Download className="w-3 h-3" /> PDF
                        </span>
                      )}
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};
