import React, { useRef, useState } from 'react';
import { Quote, ChevronLeft, ChevronRight } from 'lucide-react';
import { GOOGLE_REVIEWS, GOOGLE_MAPS_URL } from '../data/reviews';

export const ReviewsSection: React.FC = () => {
  const scrollerRef = useRef<HTMLDivElement>(null);
  const [expandedIndex, setExpandedIndex] = useState<number | null>(null);

  if (GOOGLE_REVIEWS.length === 0) return null;

  const scrollByCard = (direction: 'left' | 'right') => {
    const el = scrollerRef.current;
    if (!el) return;
    const card = el.querySelector('[data-review-card]');
    const cardWidth = card ? card.clientWidth : 480;
    el.scrollBy({ left: direction === 'left' ? -(cardWidth + 24) : cardWidth + 24, behavior: 'smooth' });
  };

  return (
    <section className="relative py-24 overflow-hidden">
      {/* Full-bleed moody background photo, matching the reference's dark,
          textured feel rather than a plain flat color. */}
      <div className="absolute inset-0">
        <img
          src="https://images.unsplash.com/photo-1441974231531-c6227db76b6e?auto=format&fit=crop&w=1800&q=80"
          alt=""
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-[#0D2226]/80" />
      </div>

      <div className="relative max-w-[1600px] mx-auto px-6 sm:px-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">

          {/* Left column - headline + view all */}
          <div className="lg:col-span-3 space-y-6">
            <h2 className="font-serif text-3xl sm:text-4xl xl:text-5xl font-light uppercase tracking-wide text-[#FAF8F5]">
              What Our Clients Say
            </h2>
            <a
              href={GOOGLE_MAPS_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block px-7 py-3 border border-[#FAF8F5]/50 text-[#FAF8F5] text-xs font-bold uppercase tracking-widest hover:bg-[#FAF8F5]/10 transition-colors"
            >
              View All
            </a>
          </div>

          {/* Right column - carousel, showing a peek of the next card */}
          <div className="lg:col-span-9 relative">
            <div
              ref={scrollerRef}
              className="flex gap-6 overflow-x-auto snap-x snap-mandatory pb-2 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
            >
              {GOOGLE_REVIEWS.map((review, i) => {
                const isExpanded = expandedIndex === i;
                const isLong = review.text.length > 220;
                return (
                  <div
                    key={`${review.authorName}-${i}`}
                    data-review-card
                    className="snap-start shrink-0 w-[85%] sm:w-[480px] bg-[#FAF8F5] p-10 sm:p-12 flex flex-col justify-between min-h-[420px]"
                  >
                    <div>
                      <Quote className="w-10 h-10 text-[#C9A96A]/50 fill-[#C9A96A]/50 mb-4" />
                      <p className={`text-base text-[#1C2B2E]/85 leading-relaxed ${!isExpanded && isLong ? 'line-clamp-6' : ''}`}>
                        {review.text || `A ${review.rating}-star review, no written comment.`}
                      </p>
                      {isLong && (
                        <button
                          onClick={() => setExpandedIndex(isExpanded ? null : i)}
                          className="mt-2 text-xs font-bold text-[#0F5C63] underline hover:text-[#0D2226]"
                        >
                          {isExpanded ? 'Show less' : 'Read more'}
                        </button>
                      )}
                    </div>
                    <div className="pt-8 space-y-0.5">
                      <div className="text-[11px] uppercase tracking-widest text-[#1C2B2E]/50">
                        Google Review
                      </div>
                      <div className="text-sm font-bold text-[#0D2226]">
                        {review.authorName}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Prev/next square buttons, bottom-right, matching reference */}
            {GOOGLE_REVIEWS.length > 1 && (
              <div className="flex justify-end gap-0 pt-6">
                <button
                  onClick={() => scrollByCard('left')}
                  aria-label="Previous review"
                  className="w-12 h-12 border border-[#FAF8F5]/50 text-[#FAF8F5] flex items-center justify-center hover:bg-[#FAF8F5]/10 transition-colors"
                >
                  <ChevronLeft className="w-5 h-5" />
                </button>
                <button
                  onClick={() => scrollByCard('right')}
                  aria-label="Next review"
                  className="w-12 h-12 border border-[#FAF8F5]/50 border-l-0 text-[#FAF8F5] flex items-center justify-center hover:bg-[#FAF8F5]/10 transition-colors"
                >
                  <ChevronRight className="w-5 h-5" />
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};
