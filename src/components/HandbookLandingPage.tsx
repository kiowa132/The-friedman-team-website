import React, { useState } from 'react';
import { CheckCircle2, Download, BookOpen } from 'lucide-react';
import { HandbookGuide } from '../data/guides/buyer-handbook-2026';
import { HandbookLeadModal } from './HandbookLeadModal';
import { HandbookReader } from './HandbookReader';

interface HandbookLandingPageProps {
  guide: HandbookGuide;
}

export const HandbookLandingPage: React.FC<HandbookLandingPageProps> = ({ guide }) => {
  const [modalOpen, setModalOpen] = useState(false);
  const [unlocked, setUnlocked] = useState(() => {
    try {
      return localStorage.getItem(`friedman_guide_unlocked_${guide.slug}`) === 'true';
    } catch {
      return false;
    }
  });

  const handleUnlocked = () => {
    setUnlocked(true);
    setModalOpen(false);
    try {
      localStorage.setItem(`friedman_guide_unlocked_${guide.slug}`, 'true');
    } catch {
      // not critical
    }
  };

  if (unlocked) {
    return <HandbookReader guide={guide} />;
  }

  return (
    <div className="pt-28 pb-24 bg-[#FAF8F5]">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          {/* Left: 3D book mockup */}
          <div className="flex justify-center" style={{ perspective: '1400px' }}>
            <div
              className="relative w-full max-w-sm"
              style={{ transform: 'rotateY(18deg) rotateX(2deg)', transformStyle: 'preserve-3d' }}
            >
              <img
                src={guide.coverImage}
                alt={guide.title}
                className="w-full rounded-sm shadow-[0_50px_100px_rgba(13,34,38,0.35)]"
              />
              <div className="absolute inset-y-0 right-0 w-3 bg-gradient-to-l from-black/20 to-transparent" />
              {/* Ambient shadow */}
              <div className="absolute -bottom-6 left-1/2 -translate-x-1/2 w-3/4 h-6 rounded-full bg-black/20 blur-xl" />
            </div>
          </div>

          {/* Right: product details */}
          <div>
            <span className="text-xs font-bold uppercase tracking-[0.3em] text-[#C9A96A]">{guide.edition}</span>
            <h1 className="font-serif text-3xl sm:text-4xl font-bold text-[#0D2226] mt-3 leading-tight">{guide.title}</h1>
            <p className="text-base text-[#1C2B2E]/70 mt-4">{guide.subtitle}</p>

            <ul className="mt-8 space-y-3">
              {guide.whatsInside.map((point, i) => (
                <li key={i} className="flex items-start gap-3 text-sm text-[#1C2B2E]/85">
                  <CheckCircle2 className="w-5 h-5 text-[#C9A96A] shrink-0 mt-0.5" />
                  <span>{point}</span>
                </li>
              ))}
            </ul>

            <div className="flex flex-wrap gap-4 mt-10">
              <button
                type="button"
                disabled={modalOpen}
                onClick={() => setModalOpen(true)}
                className="inline-flex items-center gap-2 px-8 py-4 bg-[#0D2226] hover:bg-[#0F5C63] text-white font-bold text-xs uppercase tracking-widest transition-colors disabled:opacity-70"
              >
                <Download className="w-4 h-4" /> Unlock My Free Copy
              </button>
              <button
                type="button"
                disabled={modalOpen}
                onClick={() => setModalOpen(true)}
                className="inline-flex items-center gap-2 px-8 py-4 border border-[#0D2226]/20 hover:border-[#0F5C63] text-[#0D2226] font-bold text-xs uppercase tracking-widest transition-colors disabled:opacity-70"
              >
                <BookOpen className="w-4 h-4" /> Read Online
              </button>
            </div>
          </div>
        </div>

        {/* Inside the guide - preview spreads */}
        <div className="mt-24">
          <div className="text-center mb-10">
            <span className="text-xs font-bold uppercase tracking-widest text-[#C9A96A]">Inside the Guide</span>
            <h2 className="font-serif text-3xl font-bold text-[#0D2226] mt-2">A Look Inside</h2>
          </div>
          <div className="flex flex-wrap justify-center gap-6">
            {[guide.pages[2], guide.pages[3], guide.pages[6]].map((p, i) => (
              <div
                key={i}
                className="w-40 sm:w-48 rounded-sm overflow-hidden shadow-[0_20px_40px_rgba(13,34,38,0.2)] transition-transform duration-300 hover:-translate-y-2"
                style={{ transform: `rotate(${i === 0 ? -4 : i === 2 ? 4 : 0}deg)` }}
              >
                <img src={p.image} alt={p.label} className="w-full h-auto" />
              </div>
            ))}
          </div>
        </div>
      </div>

      {modalOpen && (
        <HandbookLeadModal
          coverImage={guide.coverImage}
          title={guide.title}
          onClose={() => setModalOpen(false)}
          onUnlocked={handleUnlocked}
        />
      )}
    </div>
  );
};
