import React from 'react';
import { Phone } from 'lucide-react';
import { usePageMeta } from '../lib/usePageMeta';

interface LuxuryPageProps {
  onOpenConsultation: () => void;
}

// Deliberately quieter, more understated tone than the rest of the site -
// per the brand doc, no "data-driven" or "strategy" language here, since
// that's the main site's vocabulary and mixing the two dilutes both.
export const LuxuryPage: React.FC<LuxuryPageProps> = ({ onOpenConsultation }) => {
  usePageMeta(
    'Fine Homes & Estate Properties | The Friedman Team',
    'Distinctive homes and estate properties across Carroll, Howard, Frederick, and Baltimore County - marketed and represented with the presentation they deserve.'
  );

  return (
    <div className="pt-28 pb-24 bg-[#FAF8F5]">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 text-center space-y-6">
        <span className="text-xs font-bold uppercase tracking-[0.3em] text-[#C9A96A]">
          The Friedman Team
        </span>
        <h1 className="font-serif text-4xl sm:text-6xl font-bold text-[#0D2226] leading-tight">
          Fine Homes & Estate Properties
        </h1>
        <p className="font-serif italic text-lg text-[#0F5C63]">
          Distinctive Properties. Deliberate Representation.
        </p>
      </div>

      <div className="max-w-3xl mx-auto px-4 sm:px-6 pt-12">
        <p className="text-base sm:text-lg text-[#1C2B2E]/80 leading-relaxed text-center font-light">
          A different kind of property calls for a different kind of representation. The Friedman Team's estate division is built for distinctive homes across Carroll, Howard, Frederick, and Baltimore County - properties with architectural character, acreage, equestrian facilities, or simply more to offer. Every listing is presented with the photography, marketing, and discretion it deserves.
        </p>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 pt-16 text-center">
        <button
          onClick={onOpenConsultation}
          className="inline-flex items-center gap-2 px-10 py-4 bg-[#0D2226] hover:bg-[#0F5C63] text-[#FAF8F5] font-bold text-xs uppercase tracking-widest rounded-xs shadow-lg transition-colors"
        >
          <Phone className="w-4 h-4" />
          Arrange a Private Conversation
        </button>
      </div>
    </div>
  );
};
