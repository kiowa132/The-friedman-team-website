import React from 'react';

export interface RoomGroup {
  room: string;
  photos: string[];
}

interface Props {
  groups: RoomGroup[];
  alt: string;
  onExpand: (photoIndex: number) => void;
  resolvePhotoIndex: (src: string) => number;
}

// Zillow-Showcase-style "sorted by room" gallery: a heading per room, one
// large lead photo, then the rest of that room's shots in a 2-up grid,
// divided from the next room. Replaces the flat bento gallery when the
// listing has room-labeled photo groups.
export const RoomGallery: React.FC<Props> = ({ groups, alt, onExpand, resolvePhotoIndex }) => {
  return (
    <div className="mb-10">
      {groups.map((group, gi) => {
        if (group.photos.length === 0) return null;
        const [lead, ...rest] = group.photos;
        return (
          <div key={group.room} className={gi > 0 ? 'mt-10 pt-10 border-t border-[#0D2226]/10' : ''}>
            <h3 className="font-serif text-xl font-bold text-[#0D2226] mb-4">{group.room}</h3>
            <button
              type="button"
              onClick={() => onExpand(resolvePhotoIndex(lead))}
              className="block w-full aspect-[16/10] overflow-hidden rounded-xs group cursor-zoom-in mb-2"
            >
              <img
                src={lead}
                alt={`${alt} - ${group.room}`}
                loading="lazy"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
            </button>
            {rest.length > 0 && (
              <div className="grid grid-cols-2 gap-2">
                {rest.map((src, i) => (
                  <button
                    key={src}
                    type="button"
                    onClick={() => onExpand(resolvePhotoIndex(src))}
                    className="block aspect-[4/3] overflow-hidden rounded-xs group cursor-zoom-in"
                  >
                    <img
                      src={src}
                      alt={`${alt} - ${group.room} ${i + 2}`}
                      loading="lazy"
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
};
