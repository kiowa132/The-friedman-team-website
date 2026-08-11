import React from 'react';
import { usePageMeta } from '../lib/usePageMeta';
import { VIDEOS } from '../data/videos';
import { Youtube, Instagram } from 'lucide-react';
import { formatDisplayDate } from '../lib/formatDate';

export const VideosPage: React.FC = () => {
  usePageMeta(
    'Videos | The Friedman Team',
    "Market updates, neighborhood tours, and real talk about buying and selling in Maryland from Kyle Friedman."
  );

  return (
    <div className="pt-28 pb-20 bg-[#FAF8F5]">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="mb-12 text-center">
          <span className="text-[11px] uppercase tracking-[0.25em] text-[#C9A96A] font-bold">Watch</span>
          <h1 className="font-serif text-4xl sm:text-5xl font-bold text-[#0D2226] mt-2">Videos</h1>
          <p className="text-sm text-[#1C2B2E]/70 mt-3 max-w-2xl mx-auto">
            Market updates, neighborhood tours, and real talk about buying and selling in Carroll, Baltimore, Howard, and Frederick counties.
          </p>
        </div>

        {VIDEOS.length === 0 ? (
          <div className="max-w-xl mx-auto text-center border border-[#C9A96A]/30 bg-white p-10">
            <p className="text-sm text-[#1C2B2E]/70 mb-6">
              Video library coming soon. In the meantime, catch Kyle Friedman's latest market updates on Instagram and YouTube.
            </p>
            <div className="flex items-center justify-center gap-4">
              <a href="#" className="inline-flex items-center gap-2 px-6 py-2.5 border border-[#0D2226]/20 hover:border-[#0F5C63] text-[#0D2226] font-bold text-xs uppercase tracking-widest transition-colors">
                <Instagram className="w-4 h-4" /> Instagram
              </a>
              <a href="#" className="inline-flex items-center gap-2 px-6 py-2.5 border border-[#0D2226]/20 hover:border-[#0F5C63] text-[#0D2226] font-bold text-xs uppercase tracking-widest transition-colors">
                <Youtube className="w-4 h-4" /> YouTube
              </a>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {VIDEOS.map((v, i) => (
              <div key={i} className="bg-white border border-[#C9A96A]/25 overflow-hidden shadow-md">
                <div className={v.isShort ? 'aspect-[9/16] max-w-[280px] mx-auto' : 'aspect-video'}>
                  <iframe
                    className="w-full h-full"
                    src={`https://www.youtube.com/embed/${v.youtubeId}`}
                    title={v.title}
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  />
                </div>
                <div className="p-5">
                  <div className="font-serif text-lg font-bold text-[#0D2226] leading-snug">{v.title}</div>
                  <p className="text-xs text-[#1C2B2E]/70 mt-1.5 leading-relaxed">{v.description}</p>
                  <div className="text-[11px] text-[#1C2B2E]/50 mt-3">{formatDisplayDate(v.publishDate)}</div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
