import React, { useEffect, useRef, useState } from 'react';
import { Box, MapPin, Image as ImageIcon, ChevronLeft, ChevronRight, Camera } from 'lucide-react';
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
  floorPlanPins?: { photo: string; x: number; y: number; floor: number }[]; // dots at each photo's spot per floor
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
  floorPlanPins = [],
}) => {
  const [floorIdx, setFloorIdx] = useState(0);
  const floorPlanBoxRef = useRef<HTMLDivElement>(null);
  const floorPlanImgRef = useRef<HTMLImageElement>(null);
  // The rendered pixel box the floor plan image actually occupies inside
  // its container (object-contain fits it, letterboxing one axis). Pins
  // are positioned by percentage of THIS box, computed manually, because
  // an object-contain <img>'s own bounding box is the full container, not
  // its visible letterboxed content area.
  const [floorPlanBox, setFloorPlanBox] = useState({ width: 0, height: 0, left: 0, top: 0 });

  useEffect(() => {
    const recompute = () => {
      const container = floorPlanBoxRef.current;
      const img = floorPlanImgRef.current;
      if (!container || !img || !img.naturalWidth || !img.naturalHeight) return;
      const cw = container.clientWidth;
      const ch = container.clientHeight;
      const containerRatio = cw / ch;
      const imgRatio = img.naturalWidth / img.naturalHeight;
      const width = imgRatio > containerRatio ? cw : ch * imgRatio;
      const height = imgRatio > containerRatio ? cw / imgRatio : ch;
      setFloorPlanBox({ width, height, left: (cw - width) / 2, top: (ch - height) / 2 });
    };
    recompute();
    window.addEventListener('resize', recompute);
    return () => window.removeEventListener('resize', recompute);
  }, [floorIdx]);

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
        <div ref={floorPlanBoxRef} className="absolute inset-0 bg-[#F5F1E8] flex items-center justify-center p-4 sm:p-8">
          <img
            ref={floorPlanImgRef}
            src={floorPlanImages[floorIdx]}
            alt={`${address} floor plan ${floorIdx + 1}`}
            className="max-w-full max-h-full object-contain"
            onLoad={() => window.dispatchEvent(new Event('resize'))}
          />

          {/* Makes the floor plan interactive the way Zillow Showcase's is:
              a dot at each photo's actual spot in the room, not just a
              static image. Positioned by percentage of the image's actual
              rendered box (measured above), not the padded container it
              sits in. Each floor plan image has its own pin set. */}
          {floorPlanBox.width > 0 && (
            <div
              className="absolute pointer-events-none"
              style={{ width: floorPlanBox.width, height: floorPlanBox.height, left: floorPlanBox.left, top: floorPlanBox.top }}
            >
              {floorPlanPins
                .filter((pin) => pin.floor === floorIdx)
                .map((pin, i) => (
                <button
                  key={i}
                  type="button"
                  aria-label="View photo taken here"
                  onClick={() => onExpand(resolvePhotoIndex(pin.photo))}
                  style={{ left: `${pin.x}%`, top: `${pin.y}%` }}
                  className="absolute -translate-x-1/2 -translate-y-1/2 z-20 w-6 h-6 sm:w-7 sm:h-7 rounded-full bg-[#0F5C63] border-2 border-white shadow-md flex items-center justify-center hover:scale-110 hover:bg-[#C9A96A] transition-transform pointer-events-auto"
                >
                  <Camera className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-white" />
                </button>
              ))}
            </div>
          )}

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
