import React, { useEffect, useRef, useState } from 'react';
import { Star, ExternalLink, ChevronLeft, ChevronRight } from 'lucide-react';
import { fetchGoogleReviews, ReviewsResult } from '../lib/reviewsApi';

function StarRow({ rating }: { rating: number }) {
  return (
    <div className="flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map((n) => (
        <Star
          key={n}
          className={`w-4 h-4 ${n <= Math.round(rating) ? 'fill-[#C9A96A] text-[#C9A96A]' : 'text-[#C9A96A]/20'}`}
        />
      ))}
    </div>
  );
}

export const ReviewsSection: React.FC = () => {
  const [result, setResult] = useState<ReviewsResult | null>(null);
  const scrollerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    fetchGoogleReviews().then(setResult);
  }, []);

  const scrollByCard = (direction: 'left' | 'right') => {
    const el = scrollerRef.current;
    if (!el) return;
    const cardWidth = el.querySelector('[data-review-card]')?.clientWidth || 320;
    el.scrollBy({ left: direction === 'left' ? -(cardWidth + 24) : cardWidth + 24, behavior: 'smooth' });
  };

  // Intentionally render nothing until reviews are confirmed real and
  // loaded - a public homepage shouldn't show a "reviews not connected"
  // placeholder to visitors. (If you're testing this yourself, check the
  // browser console/network tab for the /api/reviews response instead.)
  if (!result || result.status !== 'ok' || result.reviews.length === 0) {
    return null;
  }

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="text-center max-w-2xl mx-auto space-y-3 mb-10">
        <span className="text-xs font-bold uppercase tracking-[0.25em] text-[#0F5C63]">
          What Clients Say
        </span>
        <h2 className="font-serif text-3xl sm:text-4xl font-bold text-[#0D2226]">
          Real Reviews from Google
        </h2>
        <div className="flex items-center justify-center gap-2">
          <StarRow rating={result.overallRating} />
          <span className="text-sm font-bold text-[#0D2226]">{result.overallRating.toFixed(1)}</span>
          <span className="text-xs text-[#1C2B2E]/60">
            ({result.totalReviewCount} review{result.totalReviewCount === 1 ? '' : 's'})
          </span>
        </div>
      </div>

      <div className="relative">
        {/* Left/right arrows - hidden on small screens, where swipe works natively */}
        {result.reviews.length > 1 && (
          <>
            <button
              onClick={() => scrollByCard('left')}
              aria-label="Previous review"
              className="hidden sm:flex absolute -left-4 top-1/2 -translate-y-1/2 z-10 w-9 h-9 rounded-full bg-[#0D2226] text-[#C9A96A] items-center justify-center shadow-lg hover:bg-[#0F5C63] transition-colors"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <button
              onClick={() => scrollByCard('right')}
              aria-label="Next review"
              className="hidden sm:flex absolute -right-4 top-1/2 -translate-y-1/2 z-10 w-9 h-9 rounded-full bg-[#0D2226] text-[#C9A96A] items-center justify-center shadow-lg hover:bg-[#0F5C63] transition-colors"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </>
        )}

        {/* Horizontal scrolling row - swipeable on mobile, arrow-driven on desktop */}
        <div
          ref={scrollerRef}
          className="flex gap-6 overflow-x-auto snap-x snap-mandatory scroll-smooth pb-2 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
        >
          {result.reviews.map((review) => (
            <div
              key={`${review.authorName}-${review.time}`}
              data-review-card
              className="snap-start shrink-0 w-[85%] sm:w-[360px] bg-[#FAF8F5] border border-[#C9A96A]/30 p-6 rounded-xs shadow-sm space-y-3"
            >
              <StarRow rating={review.rating} />
              <p className="text-xs text-[#1C2B2E]/80 leading-relaxed line-clamp-6">
                {review.text}
              </p>
              <div className="flex items-center gap-2 pt-2 border-t border-[#C9A96A]/20">
                {review.authorPhotoUrl && (
                  <img src={review.authorPhotoUrl} alt={review.authorName} className="w-7 h-7 rounded-full" />
                )}
                <div>
                  <div className="text-xs font-bold text-[#0D2226]">{review.authorName}</div>
                  <div className="text-[10px] text-[#1C2B2E]/50">{review.relativeTime} via Google</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {result.googleMapsUrl && (
        <div className="text-center pt-8">
          <a
            href={result.googleMapsUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-[#0F5C63] hover:text-[#C9A96A]"
          >
            <span>See All Reviews on Google</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </a>
        </div>
      )}
    </section>
  );
};
