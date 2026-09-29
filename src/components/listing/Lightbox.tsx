import React, { useEffect } from 'react';
import { X, ChevronLeft, ChevronRight } from 'lucide-react';

interface Props {
  photos: string[];
  index: number;
  alt: string;
  onClose: () => void;
  onIndexChange: (index: number) => void;
}

// Full-screen photo viewer. Replaces the old "opens the raw image in a new
// browser tab" behavior with an actual in-page gallery: arrow keys, click
// the edges, or swipe-style prev/next buttons, ESC or the backdrop to close.
export const Lightbox: React.FC<Props> = ({ photos, index, alt, onClose, onIndexChange }) => {
  const n = photos.length;
  const goTo = (i: number) => onIndexChange(((i % n) + n) % n);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
      if (e.key === 'ArrowLeft') goTo(index - 1);
      if (e.key === 'ArrowRight') goTo(index + 1);
    };
    window.addEventListener('keydown', onKey);
    document.body.style.overflow = 'hidden';
    return () => {
      window.removeEventListener('keydown', onKey);
      document.body.style.overflow = '';
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [index, n]);

  if (n === 0) return null;

  return (
    <div
      className="fixed inset-0 z-[100] bg-[#0D2226]/96 backdrop-blur-sm flex flex-col"
      onClick={onClose}
    >
      <div className="flex items-center justify-between px-4 sm:px-6 py-4 text-[#FAF8F5]">
        <span className="text-xs font-bold uppercase tracking-widest text-[#C9A96A]">
          {index + 1} / {n}
        </span>
        <button
          type="button"
          aria-label="Close"
          onClick={onClose}
          className="w-9 h-9 rounded-full hover:bg-[#FAF8F5]/10 flex items-center justify-center"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      <div className="relative flex-1 flex items-center justify-center px-2 sm:px-16 pb-4 min-h-0">
        {n > 1 && (
          <button
            type="button"
            aria-label="Previous photo"
            onClick={(e) => {
              e.stopPropagation();
              goTo(index - 1);
            }}
            className="absolute left-1 sm:left-4 top-1/2 -translate-y-1/2 z-10 w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-[#FAF8F5]/10 hover:bg-[#FAF8F5]/20 text-[#FAF8F5] flex items-center justify-center"
          >
            <ChevronLeft className="w-6 h-6" />
          </button>
        )}
        <img
          src={photos[index]}
          alt={`${alt} photo ${index + 1}`}
          className="max-w-full max-h-full object-contain rounded-xs shadow-2xl"
          onClick={(e) => e.stopPropagation()}
        />
        {n > 1 && (
          <button
            type="button"
            aria-label="Next photo"
            onClick={(e) => {
              e.stopPropagation();
              goTo(index + 1);
            }}
            className="absolute right-1 sm:right-4 top-1/2 -translate-y-1/2 z-10 w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-[#FAF8F5]/10 hover:bg-[#FAF8F5]/20 text-[#FAF8F5] flex items-center justify-center"
          >
            <ChevronRight className="w-6 h-6" />
          </button>
        )}
      </div>

      {n > 1 && (
        <div
          className="flex gap-1.5 overflow-x-auto px-4 pb-4 [&::-webkit-scrollbar]:hidden"
          onClick={(e) => e.stopPropagation()}
        >
          {photos.map((src, i) => (
            <button
              key={i}
              type="button"
              aria-label={`Go to photo ${i + 1}`}
              onClick={() => goTo(i)}
              className={`shrink-0 w-14 h-14 rounded-xs overflow-hidden border-2 transition-colors ${
                i === index ? 'border-[#C9A96A]' : 'border-transparent opacity-60 hover:opacity-100'
              }`}
            >
              <img src={src} alt="" className="w-full h-full object-cover" />
            </button>
          ))}
        </div>
      )}
    </div>
  );
};
