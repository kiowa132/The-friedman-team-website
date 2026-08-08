import React from 'react';
import { HANDBOOK_GUIDES } from '../data/guides';
import { BookShelfCard } from '../components/BookShelfCard';

export const GuidesListPage: React.FC = () => {
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
          {HANDBOOK_GUIDES.map((guide, i) => (
            <BookShelfCard
              key={guide.slug}
              slug={guide.slug}
              coverImage={guide.coverImage}
              title={guide.title}
              edition={guide.edition}
              pageCount={guide.pageCount}
              readMinutes={guide.estimatedReadMinutes}
              badge={i === 0 ? 'Most Popular' : undefined}
            />
          ))}
        </div>
      </div>
    </div>
  );
};
