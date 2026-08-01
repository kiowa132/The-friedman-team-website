import React, { useState } from 'react';
import { Neighborhood, Listing } from '../types';
import { ListingCard } from '../components/ListingCard';
import { MapPin, TrendingUp, Compass, Award, Building2, CheckCircle2, ChevronRight, Phone } from 'lucide-react';

interface NeighborhoodsPageProps {
  neighborhoods: Neighborhood[];
  listings: Listing[];
  selectedNeighborhoodId: string;
  setSelectedNeighborhoodId: (id: string) => void;
  savedListings: string[];
  onToggleSave: (id: string) => void;
  onSelectListing: (listing: Listing) => void;
  onScheduleShowing: (listing: Listing) => void;
  onOpenConsultation: () => void;
}

export const NeighborhoodsPage: React.FC<NeighborhoodsPageProps> = ({
  neighborhoods,
  listings,
  selectedNeighborhoodId,
  setSelectedNeighborhoodId,
  savedListings,
  onToggleSave,
  onSelectListing,
  onScheduleShowing,
  onOpenConsultation
}) => {
  const currentNeighborhood =
    neighborhoods.find((n) => n.id === selectedNeighborhoodId) || neighborhoods[0];

  const featuredListingsForArea = listings.filter((l) =>
    currentNeighborhood.featuredListingIds.includes(l.id) || l.county === currentNeighborhood.county
  );

  return (
    <div className="pt-28 pb-20 space-y-16">
      
      {/* Header */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-4">
        <span className="text-xs font-bold uppercase tracking-[0.25em] text-[#0F5C63] bg-[#0F5C63]/10 px-4 py-1.5 border border-[#0F5C63]/30 inline-block">
          Local Market Intelligence
        </span>
        <h1 className="font-serif text-4xl sm:text-6xl font-bold text-[#0D2226]">
          Maryland Luxury Enclaves & Communities
        </h1>
        <p className="text-sm text-[#1C2B2E]/80 max-w-2xl mx-auto font-normal">
          Explore hyper-local market profiles, lifestyle guides, average home values, and featured listings across Carroll, Baltimore, Howard, and Frederick Counties.
        </p>

        {/* Neighborhood Filter Buttons Horizontal Strip */}
        <div className="flex items-center justify-center gap-2 flex-wrap pt-4">
          {neighborhoods.map((n) => (
            <button
              key={n.id}
              onClick={() => setSelectedNeighborhoodId(n.id)}
              className={`px-4 py-2.5 text-xs uppercase tracking-wider font-bold rounded-xs transition-all ${
                currentNeighborhood.id === n.id
                  ? 'bg-[#0F5C63] text-[#FAF8F5] border-2 border-[#C9A96A] shadow-md'
                  : 'bg-[#FAF8F5] text-[#0D2226] border border-[#0D2226]/20 hover:border-[#C9A96A]'
              }`}
            >
              {n.name}
            </button>
          ))}
        </div>
      </section>

      {/* Selected Neighborhood Hero Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-[#0D2226] text-[#FAF8F5] border border-[#C9A96A]/40 rounded-xs overflow-hidden shadow-2xl grid grid-cols-1 lg:grid-cols-12">
          
          {/* Image */}
          <div className="lg:col-span-6 relative h-80 lg:h-auto min-h-[350px]">
            <img
              src={currentNeighborhood.heroImage}
              alt={currentNeighborhood.name}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#0D2226] via-transparent to-transparent opacity-80" />
            <div className="absolute top-4 left-4 bg-[#C9A96A] text-[#0D2226] text-[10px] font-bold uppercase tracking-widest px-3 py-1">
              {currentNeighborhood.county}
            </div>
          </div>

          {/* Details */}
          <div className="lg:col-span-6 p-8 sm:p-10 space-y-6 flex flex-col justify-between">
            <div className="space-y-3">
              <span className="text-xs font-bold uppercase tracking-widest text-[#C9A96A]">
                Market Spotlight Guide
              </span>
              <h2 className="font-serif text-3xl sm:text-4xl font-bold text-[#FAF8F5]">
                {currentNeighborhood.name}
              </h2>
              <p className="text-xs text-[#C9A96A] font-medium tracking-wide italic">
                "{currentNeighborhood.tagline}"
              </p>
              <p className="text-xs sm:text-sm text-[#A8B2A1] leading-relaxed pt-2">
                {currentNeighborhood.marketOverview}
              </p>
            </div>

            {/* Quick Stats Grid */}
            <div className="grid grid-cols-2 gap-4 py-4 border-y border-[#FAF8F5]/10 text-xs">
              <div>
                <span className="text-[#C9A96A] font-bold uppercase block text-[10px]">Average Estate Value</span>
                <span className="text-sm font-serif font-bold text-[#FAF8F5]">{currentNeighborhood.avgHomeValue}</span>
              </div>
              <div>
                <span className="text-[#C9A96A] font-bold uppercase block text-[10px]">Median Days On Market</span>
                <span className="text-sm font-serif font-bold text-[#FAF8F5]">{currentNeighborhood.medianDaysOnMarket} Days</span>
              </div>
              <div className="col-span-2">
                <span className="text-[#C9A96A] font-bold uppercase block text-[10px]">School Rating Profile</span>
                <span className="text-xs text-[#FAF8F5]">{currentNeighborhood.schoolsRating}</span>
              </div>
            </div>

            <button
              onClick={onOpenConsultation}
              className="w-full py-3 bg-[#C9A96A] hover:bg-[#D4AF37] text-[#0D2226] font-bold text-xs uppercase tracking-widest rounded-xs transition-colors flex items-center justify-center gap-2"
            >
              <Phone className="w-4 h-4" />
              <span>Inquire About Off-Market Properties in {currentNeighborhood.name}</span>
            </button>
          </div>

        </div>
      </section>

      {/* Lifestyle & Local Attractions */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          
          <div className="bg-[#FAF8F5] border border-[#C9A96A]/30 p-8 rounded-xs space-y-3">
            <h3 className="font-serif text-2xl font-bold text-[#0D2226] flex items-center gap-2">
              <Compass className="w-5 h-5 text-[#0F5C63]" />
              <span>Lifestyle & Environment</span>
            </h3>
            <p className="text-xs text-[#1C2B2E]/80 leading-relaxed font-normal">
              {currentNeighborhood.lifestyle}
            </p>
          </div>

          <div className="bg-[#FAF8F5] border border-[#C9A96A]/30 p-8 rounded-xs space-y-3">
            <h3 className="font-serif text-2xl font-bold text-[#0D2226] flex items-center gap-2">
              <MapPin className="w-5 h-5 text-[#0F5C63]" />
              <span>Key Local Attractions & Landmarks</span>
            </h3>
            <ul className="space-y-2 text-xs text-[#1C2B2E]">
              {currentNeighborhood.localAttractions.map((att, idx) => (
                <li key={idx} className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-[#C9A96A] shrink-0" />
                  <span>{att}</span>
                </li>
              ))}
            </ul>
          </div>

        </div>
      </section>

      {/* Featured Properties in this Neighborhood */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="border-b border-[#C9A96A]/30 pb-4 flex items-center justify-between">
          <div>
            <span className="text-xs font-bold uppercase tracking-widest text-[#0F5C63]">
              Active Listings
            </span>
            <h2 className="font-serif text-3xl font-bold text-[#0D2226]">
              Properties in {currentNeighborhood.name} & {currentNeighborhood.county}
            </h2>
          </div>
        </div>

        {featuredListingsForArea.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {featuredListingsForArea.map((listing) => (
              <ListingCard
                key={listing.id}
                listing={listing}
                isSaved={savedListings.includes(listing.id)}
                onToggleSave={onToggleSave}
                onSelectListing={onSelectListing}
                onScheduleShowing={onScheduleShowing}
              />
            ))}
          </div>
        ) : (
          <div className="bg-[#FAF8F5] border border-[#C9A96A]/30 p-8 text-center text-xs text-[#1C2B2E]/70">
            No public active MLS listings in this specific enclave today. Contact Kyle Friedman for confidential off-market options.
          </div>
        )}
      </section>

      {/* Local SEO Keywords Tag Cloud */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-[#0D2226] p-6 rounded-xs border border-[#C9A96A]/30 text-xs text-[#A8B2A1] space-y-2">
          <span className="text-[#C9A96A] font-bold uppercase text-[10px] tracking-wider block">
            Maryland SEO & Local Market Metadata
          </span>
          <div className="flex flex-wrap gap-2 pt-1">
            {currentNeighborhood.seoKeywords.map((kw, i) => (
              <span key={i} className="bg-[#1A2E33] text-[#FAF8F5] px-2.5 py-1 text-[11px] border border-[#FAF8F5]/10">
                #{kw}
              </span>
            ))}
          </div>
        </div>
      </section>

    </div>
  );
};
