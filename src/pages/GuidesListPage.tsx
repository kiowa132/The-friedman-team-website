import React from 'react';
import { GUIDES } from '../lib/content';
import { getStructuredGuide } from '../data/guides';
import { buyerHandbook } from '../data/guides/buyer-handbook-2026';
import { BookShelfCard } from '../components/BookShelfCard';

export const GuidesListPage: React.FC = () => {
  const otherGuides = GUIDES.filter((g) => g.slug !== buyerHandbook.slug);

  return (
    <div className="pt-28 pb-24 bg-[#FAF8F5]">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="text-center max-w-2xl mx-auto mb-20">
          <span className="text-xs font-bold uppercase tracking-[0.3em] text-[#C9A96A]">
            The Friedman Team Library
          </span>
          <h1 className="font-serif text-5xl sm:text-6xl font-bold text-[#0D2226] mt-3">
            Guides
          </h1>
          <p className="text-base text-[#1C2B2E]/70 mt-4">
            Real, local resources built around how buying and selling actually works in Carroll, Baltimore, and Howard County.
          </p>
        </div>

        <div className="flex flex-wrap justify-center gap-x-12 gap-y-16">
          <BookShelfCard
            slug={buyerHandbook.slug}
            coverImage={buyerHandbook.coverImage}
            title={buyerHandbook.title}
            edition={buyerHandbook.edition}
            pageCount={buyerHandbook.pageCount}
            readMinutes={buyerHandbook.estimatedReadMinutes}
            badge="Most Popular"
          />

          {otherGuides.map((guide) => {
            const structured = getStructuredGuide(guide.slug);
            return (
              <BookShelfCard
                key={guide.slug}
                slug={guide.slug}
                coverImage={guide.coverImage}
                title={guide.title}
                edition={structured?.lastUpdated ? `Updated ${structured.lastUpdated}` : 'Free Guide'}
                pageCount={structured?.sections.length || 0}
                readMinutes={structured?.estimatedReadMinutes || 5}
              />
            );
          })}
        </div>
      </div>
    </div>
  );
};
