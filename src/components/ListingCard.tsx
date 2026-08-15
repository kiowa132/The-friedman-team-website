import React, { useEffect, useRef, useState } from 'react';
import { m } from 'motion/react';
import { Listing } from '../types';
import { Heart, Bed, Bath, Maximize2, Calendar } from 'lucide-react';
import { DURATION, EASE_PREMIUM } from '../lib/motion';

interface ListingCardProps {
  listing: Listing;
  isSaved: boolean;
  onToggleSave: (id: string) => void;
  onSelectListing: (listing: Listing) => void;
  onScheduleShowing: (listing: Listing) => void;
}

export const ListingCard: React.FC<ListingCardProps> = ({
  listing,
  isSaved,
  onToggleSave,
  onSelectListing,
  onScheduleShowing
}) => {
  // Real MLS gallery photos (never more than what's actually in the feed) -
  // hovering cycles through them like Zillow/Redfin, instead of showing a
  // single static hero shot the whole time.
  const photos = listing.gallery && listing.gallery.length > 0 ? listing.gallery.slice(0, 6) : [listing.heroImage];
  const [photoIndex, setPhotoIndex] = useState(0);
  const [hovering, setHovering] = useState(false);
  const [imgLoaded, setImgLoaded] = useState(false);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    if (hovering && photos.length > 1) {
      intervalRef.current = setInterval(() => {
        setPhotoIndex((i) => (i + 1) % photos.length);
      }, 1100);
    } else {
      if (intervalRef.current) clearInterval(intervalRef.current);
      setPhotoIndex(0);
    }
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [hovering, photos.length]);

  return (
    <m.div
      className="bg-[#FAF8F5] border border-[#C9A96A]/25 rounded-xs overflow-hidden shadow-md group flex flex-col h-full"
      onHoverStart={() => setHovering(true)}
      onHoverEnd={() => setHovering(false)}
      whileHover={{ y: -4 }}
      animate={{ boxShadow: hovering ? '0 20px 40px -12px rgba(13,34,38,0.35)' : '0 4px 10px -4px rgba(13,34,38,0.15)' }}
      transition={{ duration: DURATION.fast, ease: EASE_PREMIUM }}
    >

      {/* Whole image area is clickable - opens the listing, matching
          Canopy's pattern instead of requiring a small button click. */}
      <button
        onClick={() => onSelectListing(listing)}
        className="relative aspect-[16/10] overflow-hidden bg-[#0D2226] block w-full text-left"
      >
        {/* Skeleton shimmer while the hero photo loads, instead of a blank
            dark rectangle popping straight to the image. */}
        {!imgLoaded && (
          <div className="absolute inset-0 bg-gradient-to-r from-[#0D2226] via-[#16363B] to-[#0D2226] bg-[length:200%_100%] animate-[shimmer_1.6s_ease-in-out_infinite]" />
        )}

        {photos.map((src, i) => (
          <img
            key={src + i}
            src={src}
            alt={listing.title}
            loading="lazy"
            onLoad={i === 0 ? () => setImgLoaded(true) : undefined}
            className="absolute inset-0 w-full h-full object-cover transition-opacity duration-500"
            style={{
              opacity: i === photoIndex ? 1 : 0,
              transform: i === photoIndex && !hovering ? undefined : 'scale(1.001)',
            }}
          />
        ))}

        {/* Darkens on hover, revealing the centered "VIEW DETAILS" prompt */}
        <div className="absolute inset-0 bg-[#0D2226]/0 group-hover:bg-[#0D2226]/40 transition-colors duration-300 flex items-center justify-center">
          <span className="opacity-0 group-hover:opacity-100 transition-opacity duration-300 px-6 py-2.5 border border-[#FAF8F5] text-[#FAF8F5] text-xs font-bold uppercase tracking-widest">
            View Details
          </span>
        </div>

        {/* Photo position dots - only shown when there's more than one real
            photo to cycle through. Click a dot to jump straight to it. */}
        {photos.length > 1 && (
          <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex items-center gap-1.5 z-10">
            {photos.map((_, i) => (
              <span
                key={i}
                role="button"
                tabIndex={-1}
                onClick={(e) => {
                  e.stopPropagation();
                  setPhotoIndex(i);
                }}
                className={`h-1.5 rounded-full transition-all duration-300 ${
                  i === photoIndex ? 'w-4 bg-[#FAF8F5]' : 'w-1.5 bg-[#FAF8F5]/50'
                }`}
              />
            ))}
          </div>
        )}

        {/* Status Badge */}
        <div className="absolute top-4 left-4 flex items-center gap-2">
          <span
            className={`px-3 py-1 text-[10px] font-bold uppercase tracking-widest rounded-xs shadow-md ${
              listing.status === 'Active'
                ? 'bg-[#0F5C63] text-[#FAF8F5] border border-[#C9A96A]/40'
                : listing.status === 'Private Placement'
                ? 'bg-[#0D2226] text-[#C9A96A] border border-[#C9A96A]'
                : 'bg-[#C9A96A] text-[#0D2226]'
            }`}
          >
            {listing.status}
          </span>
        </div>

        {/* Favorite Button - stops propagation so it doesn't also open the
            listing. A quick pop animation confirms the tap registered. */}
        <m.span
          role="button"
          tabIndex={0}
          onClick={(e) => {
            e.stopPropagation();
            onToggleSave(listing.id);
          }}
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') {
              e.stopPropagation();
              onToggleSave(listing.id);
            }
          }}
          whileTap={{ scale: 0.8 }}
          animate={isSaved ? { scale: [1, 1.25, 1] } : { scale: 1 }}
          transition={{ duration: DURATION.fast, ease: EASE_PREMIUM }}
          className={`absolute top-4 right-4 p-2.5 rounded-full backdrop-blur-md shadow-md ${
            isSaved ? 'bg-[#C9A96A] text-[#0D2226]' : 'bg-[#0D2226]/70 text-[#FAF8F5] hover:text-[#C9A96A]'
          }`}
          aria-label="Save listing"
        >
          <Heart className={`w-4 h-4 ${isSaved ? 'fill-current' : ''}`} />
        </m.span>
      </button>

      {/* Details below image - simplified to match Canopy's pattern:
          address, price, address line, then beds|baths|sqft. */}
      <button
        onClick={() => onSelectListing(listing)}
        className="p-6 flex-1 flex flex-col gap-3 text-left"
      >
        <div>
          <h3 className="font-serif text-lg sm:text-xl uppercase tracking-wide text-[#0D2226] group-hover:text-[#0F5C63] transition-colors leading-snug">
            {listing.title}
          </h3>
          <div className="text-xl font-serif font-bold text-[#0D2226] mt-1">
            {listing.formattedPrice}
          </div>
          <p className="text-xs text-[#1C2B2E]/60 mt-1">
            {listing.city}, {listing.county === 'Carroll County' || listing.county === 'Baltimore County' || listing.county === 'Howard County' || listing.county === 'Frederick County' ? 'MD' : listing.county}
          </p>
        </div>

        <div className="flex items-center gap-4 text-xs text-[#1C2B2E]/80 font-medium pt-2 border-t border-[#C9A96A]/20">
          <span className="flex items-center gap-1">
            <Bed className="w-3.5 h-3.5 text-[#C9A96A]" /> {listing.beds} Beds
          </span>
          <span className="flex items-center gap-1">
            <Bath className="w-3.5 h-3.5 text-[#C9A96A]" /> {listing.baths} Baths
          </span>
          <span className="flex items-center gap-1">
            <Maximize2 className="w-3.5 h-3.5 text-[#C9A96A]" /> {listing.sqft.toLocaleString()} Sq.Ft.
          </span>
        </div>
      </button>

      {/* Secondary action - kept, but de-emphasized compared to the main
          click-through, matching how Canopy treats this as a minor action */}
      <div className="px-6 pb-5">
        <m.span
          role="button"
          tabIndex={0}
          onClick={(e) => {
            e.stopPropagation();
            onScheduleShowing(listing);
          }}
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') {
              e.stopPropagation();
              onScheduleShowing(listing);
            }
          }}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.97 }}
          transition={{ duration: DURATION.fast, ease: EASE_PREMIUM }}
          className="w-full py-2.5 px-3 text-xs font-bold uppercase tracking-wider text-[#0D2226] bg-[#C9A96A] hover:bg-[#D4AF37] transition-colors rounded-xs flex items-center justify-center gap-1.5 cursor-pointer"
        >
          <Calendar className="w-3.5 h-3.5" />
          <span>Schedule Showing</span>
        </m.span>
      </div>

    </m.div>
  );
};
