import React from 'react';
import { Listing } from '../types';
import { Heart, MapPin, Bed, Bath, Maximize2, Sparkles, ChevronRight } from 'lucide-react';

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
      
      {/* Image Container */}
      <div className="relative aspect-[16/10] overflow-hidden bg-[#0D2226]">
        <img
          src={listing.heroImage}
          alt={listing.title}
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
          loading="lazy"
        />

        {/* Overlay Dark Gradient */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#0D2226]/80 via-transparent to-transparent opacity-60 group-hover:opacity-40 transition-opacity" />

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
          <span className="bg-[#0D2226]/80 text-[#FAF8F5] backdrop-blur-md px-2.5 py-1 text-[10px] uppercase font-semibold border border-[#FAF8F5]/20">
            {listing.propertyType}
          </span>
        </div>

        {/* Favorite Button */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            onToggleSave(listing.id);
          }}
          id={`save-btn-${listing.id}`}
          className={`absolute top-4 right-4 p-2.5 rounded-full backdrop-blur-md transition-all shadow-md ${
            isSaved
              ? 'bg-[#C9A96A] text-[#0D2226]'
              : 'bg-[#0D2226]/70 text-[#FAF8F5] hover:text-[#C9A96A]'
          }`}
          aria-label="Save listing"
        >
          <Heart className={`w-4 h-4 ${isSaved ? 'fill-current' : ''}`} />
        </button>

        {/* Price Tag Overlay */}
        <div className="absolute bottom-4 left-4 right-4 flex items-end justify-between text-[#FAF8F5]">
          <div>
            <div className="text-2xl sm:text-3xl font-serif font-bold text-[#FAF8F5] tracking-tight">
              {listing.formattedPrice}
            </div>
            <div className="text-xs text-[#C9A96A] font-medium flex items-center gap-1">
              <MapPin className="w-3 h-3" />
              <span>{listing.city}, {listing.county}</span>
            </div>
          </div>
        </div>

      </div>

      {/* Details Container */}
      <div className="p-6 flex-1 flex flex-col justify-between space-y-4">
        <div>
          <h3 className="font-serif text-xl font-semibold text-[#0D2226] group-hover:text-[#0F5C63] transition-colors leading-snug">
            {listing.title}
          </h3>
          <p className="text-xs text-[#1C2B2E]/70 mt-1 line-clamp-2 leading-relaxed">
            {listing.description}
          </p>
        </div>

        {/* Specs Ribbon */}
        <div className="grid grid-cols-4 gap-2 py-3 border-y border-[#C9A96A]/20 text-center text-[#0D2226]">
          <div className="flex flex-col items-center">
            <span className="text-[10px] text-[#0F5C63] font-bold uppercase">Beds</span>
            <span className="text-xs font-semibold flex items-center gap-1">
              <Bed className="w-3 h-3 text-[#C9A96A]" /> {listing.beds}
            </span>
          </div>
          <div className="flex flex-col items-center border-l border-[#C9A96A]/20">
            <span className="text-[10px] text-[#0F5C63] font-bold uppercase">Baths</span>
            <span className="text-xs font-semibold flex items-center gap-1">
              <Bath className="w-3 h-3 text-[#C9A96A]" /> {listing.baths}
            </span>
          </div>
          <div className="flex flex-col items-center border-l border-[#C9A96A]/20">
            <span className="text-[10px] text-[#0F5C63] font-bold uppercase">Sq Ft</span>
            <span className="text-xs font-semibold flex items-center gap-1">
              <Maximize2 className="w-3 h-3 text-[#C9A96A]" /> {listing.sqft.toLocaleString()}
            </span>
          </div>
          <div className="flex flex-col items-center border-l border-[#C9A96A]/20">
            <span className="text-[10px] text-[#0F5C63] font-bold uppercase">Acres</span>
            <span className="text-xs font-semibold text-[#0F5C63]">
              {listing.acres} AC
            </span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="grid grid-cols-2 gap-2 pt-1">
          <button
            onClick={() => onSelectListing(listing)}
            id={`view-listing-${listing.id}`}
            className="w-full py-2.5 px-3 text-xs font-semibold uppercase tracking-wider text-[#0D2226] border border-[#0D2226]/40 hover:bg-[#0D2226] hover:text-[#FAF8F5] transition-all rounded-xs flex items-center justify-center gap-1"
          >
            <span>Explore Estate</span>
          </button>
          <button
            onClick={() => onScheduleShowing(listing)}
            id={`schedule-showing-${listing.id}`}
            className="w-full py-2.5 px-3 text-xs font-bold uppercase tracking-wider text-[#0D2226] bg-[#C9A96A] hover:bg-[#D4AF37] transition-all rounded-xs flex items-center justify-center gap-1"
          >
            <span>Private Showing</span>
          </button>
        </div>

      </div>

    </div>
  );
};
