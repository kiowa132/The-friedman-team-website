import React from 'react';
import { Star, Quote, ExternalLink, Phone } from 'lucide-react';
import { GOOGLE_REVIEWS, GOOGLE_OVERALL_RATING, GOOGLE_TOTAL_REVIEW_COUNT, GOOGLE_MAPS_URL } from '../data/reviews';

interface TestimonialsPageProps {
  onOpenConsultation: () => void;
}

export const TestimonialsPage: React.FC<TestimonialsPageProps> = ({ onOpenConsultation }) => {
  // Some Google reviews are star-only with no written text - still real,
  // still worth showing, just without a quote.
  const withText = GOOGLE_REVIEWS.filter((r) => r.text.trim().length > 0);
  const starsOnly = GOOGLE_REVIEWS.filter((r) => r.text.trim().length === 0);

  return (
    <div className="pt-28 pb-20 bg-[#FAF8F5]">
      <div className="max-w-5xl mx-auto px-4 sm:px-6">

        <div className="text-center max-w-2xl mx-auto mb-16">
          <span className="text-xs font-bold uppercase tracking-[0.3em] text-[#C9A96A]">Client Success Stories</span>
          <h1 className="font-serif text-5xl sm:text-6xl font-bold text-[#0D2226] mt-3">Testimonials</h1>
          <div className="flex items-center justify-center gap-2 mt-5">
            {Array.from({ length: 5 }).map((_, i) => (
              <Star key={i} className={`w-5 h-5 ${i < Math.round(GOOGLE_OVERALL_RATING) ? 'fill-[#C9A96A] text-[#C9A96A]' : 'text-[#C9A96A]/30'}`} />
            ))}
          </div>
          <p className="text-sm text-[#1C2B2E]/70 mt-3">
            <span className="font-bold text-[#0D2226]">{GOOGLE_OVERALL_RATING.toFixed(1)}</span> average from {GOOGLE_TOTAL_REVIEW_COUNT} real Google reviews
          </p>
          <a
            href={GOOGLE_MAPS_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 mt-4 text-xs font-bold text-[#0F5C63] hover:text-[#C9A96A] transition-colors"
          >
            View all reviews on Google <ExternalLink className="w-3.5 h-3.5" />
          </a>
        </div>

        {/* Reviews with real written text */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-10">
          {withText.map((review, i) => (
            <div key={i} className="bg-white border border-[#C9A96A]/25 p-6 flex flex-col">
              <Quote className="w-6 h-6 text-[#C9A96A]/40 mb-3 shrink-0" />
              <div className="flex items-center gap-1 mb-3">
                {Array.from({ length: 5 }).map((_, j) => (
                  <Star key={j} className={`w-3.5 h-3.5 ${j < review.rating ? 'fill-[#C9A96A] text-[#C9A96A]' : 'text-[#C9A96A]/30'}`} />
                ))}
              </div>
              <p className="text-sm text-[#1C2B2E]/85 leading-relaxed flex-1 whitespace-pre-line">{review.text}</p>
              <div className="flex items-center justify-between mt-5 pt-4 border-t border-[#C9A96A]/15">
                <span className="text-xs font-bold text-[#0D2226]">{review.authorName}</span>
                <span className="text-[10px] text-[#1C2B2E]/45">{review.relativeTime}</span>
              </div>
            </div>
          ))}
        </div>

        {/* Star-only reviews - real, just no written text, shown as a
            simpler compact row rather than a big empty-feeling card. */}
        {starsOnly.length > 0 && (
          <div className="bg-white border border-[#C9A96A]/25 p-6 mb-16">
            <h2 className="text-xs font-bold uppercase tracking-widest text-[#C9A96A] mb-4">Also Rated 5 Stars On Google</h2>
            <div className="flex flex-wrap gap-x-8 gap-y-3">
              {starsOnly.map((review, i) => (
                <div key={i} className="flex items-center gap-2">
                  <div className="flex items-center gap-0.5">
                    {Array.from({ length: 5 }).map((_, j) => (
                      <Star key={j} className={`w-3 h-3 ${j < review.rating ? 'fill-[#C9A96A] text-[#C9A96A]' : 'text-[#C9A96A]/30'}`} />
                    ))}
                  </div>
                  <span className="text-xs font-semibold text-[#0D2226]">{review.authorName}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="bg-[#0D2226] text-[#FAF8F5] p-8 sm:p-10 text-center">
          <h2 className="font-serif text-2xl font-bold mb-3">Ready for This Kind of Experience?</h2>
          <p className="text-sm text-[#A8B2A1] max-w-lg mx-auto mb-6">
            Whether you're buying, selling, or just exploring your options, let's talk about your goals.
          </p>
          <button
            onClick={onOpenConsultation}
            className="inline-flex items-center gap-2 px-8 py-3 bg-[#C9A96A] hover:bg-[#D4AF37] text-[#0D2226] font-bold text-xs uppercase tracking-widest transition-colors"
          >
            <Phone className="w-4 h-4" />
            Schedule a Consultation
          </button>
        </div>

      </div>
    </div>
  );
};
