import React from 'react';
import { Listing } from '../types';
import { Heart, Bed, Bath, Maximize2, Calendar } from 'lucide-react';

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
  return (
    <div className="bg-[#FAF8F5] border border-[#C9A96A]/25 rounded-xs overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 group flex flex-col h-full">

      {/* Whole image area is clickable - opens the listing, matching
          Canopy's pattern instead of requiring a small button click. */}
      <button
        onClick={() => onSelectListing(listing)}
        className="relative aspect-[16/10] overflow-hidden bg-[#0D2226] block w-full text-left"
      >
        <img
          src={listing.heroImage}
          alt={listing.title}
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
          loading="lazy"
        />

        {/* Darkens on hover, revealing the centered "VIEW DETAILS" prompt */}
        <div className="absolute inset-0 bg-[#0D2226]/0 group-hover:bg-[#0D2226]/50 transition-colors duration-300 flex items-center justify-center">
          <span className="opacity-0 group-hover:opacity-100 transition-opacity duration-300 px-6 py-2.5 border border-[#FAF8F5] text-[#FAF8F5] text-xs font-bold uppercase tracking-widest">
            View Details
          </span>
        </div>

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

        {/* Favorite Button - stops propagation so it doesn't also open the listing */}
        <span
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
          className={`absolute top-4 right-4 p-2.5 rounded-full backdrop-blur-md transition-all shadow-md ${
            isSaved ? 'bg-[#C9A96A] text-[#0D2226]' : 'bg-[#0D2226]/70 text-[#FAF8F5] hover:text-[#C9A96A]'
          }`}
          aria-label="Save listing"
        >
          <Heart className={`w-4 h-4 ${isSaved ? 'fill-current' : ''}`} />
        </span>
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
        <span
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
          className="w-full py-2.5 px-3 text-xs font-bold uppercase tracking-wider text-[#0D2226] bg-[#C9A96A] hover:bg-[#D4AF37] transition-all rounded-xs flex items-center justify-center gap-1.5 cursor-pointer"
        >
          <Calendar className="w-3.5 h-3.5" />
          <span>Schedule Showing</span>
        </span>
      </div>

    </div>
  );
};
