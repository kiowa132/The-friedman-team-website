import React, { useState } from 'react';
import { Box, MapPin, Image as ImageIcon, ChevronLeft, ChevronRight } from 'lucide-react';
import { HeroCarousel } from './HeroCarousel';

export type HeroMode = 'photos' | 'floorplan' | 'tour' | 'map';

interface Props {
  photos: string[]; // curated hero rotation
  floorPlanImages: string[];
  tourUrl: string;
  address: string;
  onExpand: (photoIndex: number) => void; // opens the full lightbox on the real photos array
  resolvePhotoIndex: (src: string) => number;
  mode: HeroMode;
  onModeChange: (mode: HeroMode) => void;
  roomGroups?: { room: string; photos: string[] }[]; // lets the floor plan jump straight to a room's photos
}

// The Zillow-Showcase-style tab strip under the hero: Photos / Floor Plan /
// 3D Tour / Map. Each tab swaps out the whole hero content area, matching
// how Showcase's own filmstrip works, rather than just being a link. Mode
// is controlled by the parent page, which also needs it to decide whether
// to show its own address/price overlay and gradient (only makes sense
// over a photo, not over a floor plan or a map).
export const HeroMedia: React.FC<Props> = ({
  photos,
  floorPlanImages,
  tourUrl,
  address,
  onExpand,
  resolvePhotoIndex,
  mode,
  onModeChange,
  roomGroups = [],
}) => {
  const [floorIdx, setFloorIdx] = useState(0);

  const tabs: { id: HeroMode; label: string; thumb?: string; icon?: React.ElementType }[] = [
    { id: 'photos', label: 'Photos', thumb: photos[0] },
    ...(floorPlanImages.length ? [{ id: 'floorplan' as HeroMode, label: 'Floor Plan', thumb: floorPlanImages[0] }] : []),
    ...(tourUrl ? [{ id: 'tour' as HeroMode, label: '3D Tour', icon: Box }] : []),
    { id: 'map', label: 'Map', icon: MapPin },
  ];

  const mapSrc = `https://www.google.com/maps?q=${encodeURIComponent(address)}&output=embed`;

  return (
    // absolute, not relative: the parent hero is a flex row (for the text
    // block that sits on top), and a `relative` div here would compete for
    // width as a flex sibling instead of just filling the background, the
    // same bug the original single <img absolute inset-0> never had.
    <div className="absolute inset-0 overflow-hidden">
      {mode === 'photos' && (
        <HeroCarousel photos={photos} alt={address} onExpand={(i) => onExpand(resolvePhotoIndex(photos[i]))} />
      )}

      {mode === 'floorplan' && floorPlanImages.length > 0 && (
        <div className="absolute inset-0 bg-[#F5F1E8] flex items-center justify-center">
          <img
            src={floorPlanImages[floorIdx]}
            alt={`${address} floor plan ${floorIdx + 1}`}
            className="max-w-full max-h-full object-contain p-4 sm:p-8"
          />
          {floorPlanImages.length > 1 && (
            <>
              <button
                type="button"
                aria-label="Previous floor"
                onClick={() => setFloorIdx((i) => (i - 1 + floorPlanImages.length) % floorPlanImages.length)}
                className="absolute left-3 top-1/2 -translate-y-1/2 z-20 w-9 h-9 rounded-full bg-[#0D2226]/40 hover:bg-[#0D2226]/70 text-[#FAF8F5] flex items-center justify-center"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              <button
                type="button"
                aria-label="Next floor"
                onClick={() => setFloorIdx((i) => (i + 1) % floorPlanImages.length)}
                className="absolute right-3 top-1/2 -translate-y-1/2 z-20 w-9 h-9 rounded-full bg-[#0D2226]/40 hover:bg-[#0D2226]/70 text-[#FAF8F5] flex items-center justify-center"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </>
          )}

          {/* Makes the floor plan interactive the way Zillow Showcase's is:
              tap a room, jump straight to that room's photos, instead of
              the floor plan being a dead static image. */}
          {roomGroups.some((g) => g.photos.length > 0) && (
            <div className="absolute bottom-3 left-1/2 -translate-x-1/2 z-20 flex flex-wrap justify-center gap-2 px-4 max-w-full">
              {roomGroups
                .filter((g) => g.photos.length > 0)
                .map((g) => (
                  <button
                    key={g.room}
                    type="button"
                    onClick={() => onExpand(resolvePhotoIndex(g.photos[0]))}
                    className="text-[10px] sm:text-[11px] font-bold uppercase tracking-wide text-[#0D2226] bg-[#FAF8F5] border border-[#0D2226]/20 hover:border-[#C9A96A] hover:bg-[#C9A96A]/20 rounded-full px-3 py-1.5 transition-colors whitespace-nowrap"
                  >
                    {g.room}
                  </button>
                ))}
            </div>
          )}
        </div>
      )}

      {/* Embedded per Kyle's request, even though Zillow's own bot-check
          blocks real visitors from getting past "Press & Hold" here - see
          git history for the new-tab version that actually works. */}
      {mode === 'tour' && tourUrl && (
        <iframe
          src={tourUrl}
          title={`${address} 3D tour`}
          className="absolute inset-0 w-full h-full border-0"
          allow="autoplay; fullscreen; picture-in-picture"
        />
      )}

      {mode === 'map' && (
        <iframe
          src={mapSrc}
          title={`${address} map`}
          className="absolute inset-0 w-full h-full border-0"
          loading="lazy"
        />
      )}

      {/* Tab strip — pinned top-left (mirrors the expand button's top-right
          offset) so it never fights the address/price stack anchored to the
          hero's bottom edge, which happened at shorter hero heights. */}
      <div className="absolute left-3 sm:left-4 top-24 sm:top-28 z-20 flex gap-2">
        {tabs.map((t) => (
          <button
            key={t.id}
            type="button"
            onClick={() => onModeChange(t.id)}
            className={`flex flex-col items-center gap-1 group ${mode === t.id ? '' : 'opacity-80 hover:opacity-100'}`}
          >
            <span
              className={`w-12 h-9 sm:w-14 sm:h-10 rounded-xs overflow-hidden border-2 flex items-center justify-center bg-[#0D2226]/60 ${
                mode === t.id ? 'border-[#C9A96A]' : 'border-[#FAF8F5]/40'
              }`}
            >
              {t.thumb ? (
                <img src={t.thumb} alt="" className="w-full h-full object-cover" />
              ) : t.icon ? (
                <t.icon className="w-4 h-4 text-[#FAF8F5]" />
              ) : (
                <ImageIcon className="w-4 h-4 text-[#FAF8F5]" />
              )}
            </span>
            <span className="text-[9px] sm:text-[10px] font-bold uppercase tracking-wide text-[#FAF8F5] drop-shadow">
              {t.label}
            </span>
          </button>
        ))}
      </div>
    </div>
  );
};
