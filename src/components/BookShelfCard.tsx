import React from 'react';
import { Link } from 'react-router-dom';
import { Clock, Layers } from 'lucide-react';

interface BookShelfCardProps {
  slug: string;
  coverImage: string;
  title: string;
  edition: string;
  pageCount: number;
  readMinutes: number;
  badge?: string;
}

// A book cover standing upright on a dark shelf - real A4-ish proportions,
// a faked page-edge on the right side, a soft ambient shadow beneath, and
// a 3D tilt-forward lift on hover (as if being pulled off the shelf).
export const BookShelfCard: React.FC<BookShelfCardProps> = ({ slug, coverImage, title, edition, pageCount, readMinutes, badge }) => {
  return (
    <Link to={`/guides/${slug}`} className="group flex flex-col items-center" style={{ perspective: '1200px' }}>
      <div
        className="relative w-full max-w-[240px] aspect-[707/1000] transition-transform duration-500 ease-out group-hover:-translate-y-3"
        style={{ transformStyle: 'preserve-3d' }}
      >
        <div
          className="absolute inset-0 rounded-sm overflow-hidden shadow-[0_20px_40px_rgba(0,0,0,0.5)] transition-transform duration-500 ease-out group-hover:shadow-[0_30px_60px_rgba(0,0,0,0.65)]"
          style={{ transform: 'rotateY(0deg)', transformOrigin: 'left center', transition: 'transform 0.5s ease' }}
        >
          <img src={coverImage} alt={title} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-[1.02]" />
          {/* Faked page-edge / spine highlight along the right side */}
          <div className="absolute inset-y-0 right-0 w-2 bg-gradient-to-l from-black/25 to-transparent" />
          <div className="absolute inset-y-0 left-0 w-1 bg-gradient-to-r from-white/20 to-transparent" />
        </div>
        {badge && (
          <div className="absolute -top-2.5 -right-2.5 px-2.5 py-1 bg-[#C9A96A] text-[#0D2226] text-[9px] font-bold uppercase tracking-widest rounded-full shadow-lg z-10">
            {badge}
          </div>
        )}
      </div>
      {/* Ambient shadow puddle beneath the book */}
      <div className="w-3/4 h-3 mt-2 rounded-full bg-black/40 blur-md transition-all duration-500 group-hover:w-1/2 group-hover:bg-black/55" />

      <div className="text-center mt-5 max-w-[240px]">
        <span className="text-[10px] font-bold uppercase tracking-widest text-[#C9A96A]">{edition}</span>
        <h3 className="font-serif text-base font-bold text-[#0D2226] mt-1 leading-snug group-hover:text-[#0F5C63] transition-colors">{title}</h3>
        <div className="flex items-center justify-center gap-3 mt-2 text-[11px] text-[#1C2B2E]/55">
          <span className="flex items-center gap-1"><Layers className="w-3 h-3" /> {pageCount} pages</span>
          <span className="flex items-center gap-1"><Clock className="w-3 h-3" /> {readMinutes} min</span>
        </div>
      </div>
    </Link>
  );
};
