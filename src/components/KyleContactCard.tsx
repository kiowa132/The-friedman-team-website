import React from 'react';
import { Facebook, Instagram, Linkedin } from 'lucide-react';

interface KyleContactCardProps {
  ctaHref?: string; // where the button links/scrolls to
  ctaLabel?: string;
  onCtaClick?: () => void;
  dealContextText?: string; // optional per-transaction attribution note
}

// Kyle's real contact card - photo, name, title, real phone/email/office/
// license, and the social links actually live in the footer. Used for
// lead capture on any page, including ones showing another agent's
// listing or transaction, which is completely standard real estate
// practice - the same way IDX search results across the industry let a
// different agent capture the buyer-side inquiry. Kept as its own
// component so it's identical everywhere it appears rather than
// duplicated and potentially drifting between pages.
export const KyleContactCard: React.FC<KyleContactCardProps> = ({ ctaHref = '#', ctaLabel = 'Contact Kyle', onCtaClick, dealContextText }) => {
  const Cta = onCtaClick ? (
    <button
      onClick={onCtaClick}
      className="inline-flex items-center gap-2 px-8 py-3 bg-[#C9A96A] hover:bg-[#D4AF37] text-[#0D2226] font-bold text-xs uppercase tracking-widest transition-colors"
    >
      {ctaLabel}
    </button>
  ) : (
    <a
      href={ctaHref}
      className="inline-flex items-center gap-2 px-8 py-3 bg-[#C9A96A] hover:bg-[#D4AF37] text-[#0D2226] font-bold text-xs uppercase tracking-widest transition-colors"
    >
      {ctaLabel}
    </a>
  );

  return (
    <div className="bg-[#0D2226] overflow-hidden grid grid-cols-1 sm:grid-cols-[320px_1fr]">
      <div className="relative bg-gradient-to-b from-[#0F5C63] to-[#0D2226] flex items-end justify-center pt-8 overflow-hidden">
        <img src="/images/kyle-cutout.png" alt="Kyle Friedman" className="w-auto h-[340px] sm:h-[420px] object-contain object-bottom" />
      </div>
      <div className="p-8 sm:p-10 text-[#FAF8F5]">
        <span className="text-[11px] uppercase tracking-widest text-[#C9A96A] font-bold">Talk to a Real Advisor</span>
        <h2 className="font-serif text-4xl font-bold mt-2">Kyle Friedman</h2>
        <p className="text-sm text-[#A8B2A1] font-semibold mt-1 mb-6">Principal Advisor, The Friedman Team</p>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-4 text-sm mb-8">
          <div>
            <div className="text-[10px] uppercase tracking-widest text-[#A8B2A1] font-bold mb-1">Phone</div>
            <a href="tel:4437893101" className="hover:text-[#C9A96A] transition-colors">(443) 789-3101</a>
          </div>
          <div>
            <div className="text-[10px] uppercase tracking-widest text-[#A8B2A1] font-bold mb-1">Email</div>
            <a href="mailto:kyle@friedmanreteam.com" className="hover:text-[#C9A96A] transition-colors">kyle@friedmanreteam.com</a>
          </div>
          <div>
            <div className="text-[10px] uppercase tracking-widest text-[#A8B2A1] font-bold mb-1">Office</div>
            <span>8115 Maple Lawn Blvd #350, Fulton, MD 20759</span>
          </div>
          <div>
            <div className="text-[10px] uppercase tracking-widest text-[#A8B2A1] font-bold mb-1">Maryland License</div>
            <span>3264576</span>
          </div>
        </div>

        <div className="flex items-center gap-3 mb-8">
          <a href="https://www.facebook.com/kyle.friedman132" target="_blank" rel="noopener noreferrer" aria-label="Facebook" className="w-9 h-9 rounded-full border border-[#FAF8F5]/25 flex items-center justify-center hover:border-[#C9A96A] hover:text-[#C9A96A] transition-colors">
            <Facebook className="w-4 h-4" />
          </a>
          <a href="https://www.instagram.com/keysbykyle/" target="_blank" rel="noopener noreferrer" aria-label="Instagram" className="w-9 h-9 rounded-full border border-[#FAF8F5]/25 flex items-center justify-center hover:border-[#C9A96A] hover:text-[#C9A96A] transition-colors">
            <Instagram className="w-4 h-4" />
          </a>
          <a href="https://www.linkedin.com/in/kyle-friedman-415029168/?skipRedirect=true" target="_blank" rel="noopener noreferrer" aria-label="LinkedIn" className="w-9 h-9 rounded-full border border-[#FAF8F5]/25 flex items-center justify-center hover:border-[#C9A96A] hover:text-[#C9A96A] transition-colors">
            <Linkedin className="w-4 h-4" />
          </a>
        </div>

        {dealContextText && (
          <div className="border border-[#C9A96A]/30 bg-[#FAF8F5]/5 p-4 mb-8">
            <div className="text-[10px] uppercase tracking-widest text-[#C9A96A] font-bold mb-1.5">Deal Context</div>
            <p className="text-xs text-[#A8B2A1] leading-relaxed">{dealContextText}</p>
          </div>
        )}

        {Cta}
      </div>
    </div>
  );
};
