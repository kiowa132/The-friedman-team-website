import React from 'react';
import { Search, Filter, RefreshCw, SlidersHorizontal, MapPin, Building2, DollarSign } from 'lucide-react';

interface IDXSearchHeaderProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  selectedCounty: string;
  setSelectedCounty: (county: string) => void;
  selectedType: string;
  setSelectedType: (type: string) => void;
  priceRange: [number, number];
  setPriceRange: (range: [number, number]) => void;
  minBeds: number;
  setMinBeds: (beds: number) => void;
  onResetFilters: () => void;
  totalResultsCount: number;
}

export const IDXSearchHeader: React.FC<IDXSearchHeaderProps> = ({
  searchQuery,
  setSearchQuery,
  selectedCounty,
  setSelectedCounty,
  selectedType,
  setSelectedType,
  priceRange,
  setPriceRange,
  minBeds,
  setMinBeds,
  onResetFilters,
  totalResultsCount
}) => {
  return (
    <div className="bg-[#0D2226] border border-[#C9A96A]/40 p-4 sm:p-6 rounded-xs text-[#FAF8F5] shadow-xl space-y-4">
      
      {/* Top Search & County Filters */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-3 items-center">
        
        {/* Search Input */}
        <div className="md:col-span-5 relative">
          <Search className="w-4 h-4 text-[#C9A96A] absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search city, MLS #, street or features (e.g. Falls Road)..."
            className="w-full bg-[#1A2E33] border border-[#FAF8F5]/20 pl-10 pr-4 py-2.5 text-xs text-[#FAF8F5] placeholder-[#A8B2A1] focus:border-[#C9A96A] focus:outline-none rounded-xs"
          />
        </div>

        {/* County Selector */}
        <div className="md:col-span-3">
          <select
            value={selectedCounty}
            onChange={(e) => setSelectedCounty(e.target.value)}
            className="w-full bg-[#1A2E33] border border-[#FAF8F5]/20 px-3 py-2.5 text-xs text-[#FAF8F5] focus:border-[#C9A96A] focus:outline-none rounded-xs font-medium"
          >
            <option value="All">All Maryland Counties</option>
            <option value="Carroll County">Carroll County</option>
            <option value="Baltimore County">Baltimore County</option>
            <option value="Howard County">Howard County</option>
          </select>
        </div>

        {/* Property Category
            NOTE: values below match Lofty's documented propertyType filter
            examples ("Single Family", "Condo", "Townhouse"). Lofty's own
            IDX site search likely has a fuller list (e.g. Farm, Land) -
            check your live Lofty site's search filters and add matching
            options here if you want to search those categories too. */}
        <div className="md:col-span-3">
          <select
            value={selectedType}
            onChange={(e) => setSelectedType(e.target.value)}
            className="w-full bg-[#1A2E33] border border-[#FAF8F5]/20 px-3 py-2.5 text-xs text-[#FAF8F5] focus:border-[#C9A96A] focus:outline-none rounded-xs font-medium"
          >
            <option value="All">All Property Types</option>
            <option value="Single Family">Single Family / Luxury Estate</option>
            <option value="Condo">Condo</option>
            <option value="Townhouse">Townhouse</option>
          </select>
        </div>

        {/* Reset Button */}
        <div className="md:col-span-1 flex justify-end">
          <button
            onClick={onResetFilters}
            className="p-2.5 bg-[#1A2E33] border border-[#FAF8F5]/20 hover:border-[#C9A96A] text-[#C9A96A] rounded-xs transition-colors"
            title="Reset Search Filters"
          >
            <RefreshCw className="w-4 h-4" />
          </button>
        </div>

      </div>

      {/* Secondary Controls: Price Slider & Bedrooms */}
      <div className="pt-3 border-t border-[#FAF8F5]/10 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs">
        
        {/* Price Filter */}
        <div className="flex items-center gap-3 w-full sm:w-auto">
          <span className="text-[#C9A96A] font-bold uppercase tracking-wider text-[10px] shrink-0">
            Max Price:
          </span>
          <input
            type="range"
            min="1000000"
            max="6000000"
            step="250000"
            value={priceRange[1]}
            onChange={(e) => setPriceRange([priceRange[0], Number(e.target.value)])}
            className="w-36 accent-[#C9A96A]"
          />
          <span className="font-serif font-bold text-[#FAF8F5]">
            Up to ${(priceRange[1] / 1000000).toFixed(2)}M
          </span>
        </div>

        {/* Bedrooms selector buttons */}
        <div className="flex items-center gap-2">
          <span className="text-[#C9A96A] font-bold uppercase tracking-wider text-[10px]">
            Min Beds:
          </span>
          {[0, 4, 5, 6].map((num) => (
            <button
              key={num}
              onClick={() => setMinBeds(num)}
              className={`px-2.5 py-1 text-[10px] font-bold uppercase rounded-xs transition-colors ${
                minBeds === num
                  ? 'bg-[#C9A96A] text-[#0D2226]'
                  : 'bg-[#1A2E33] text-[#FAF8F5] hover:text-[#C9A96A]'
              }`}
            >
              {num === 0 ? 'Any' : `${num}+`}
            </button>
          ))}
        </div>

        {/* Live Counter Badge */}
        <div className="text-[11px] text-[#A8B2A1] font-medium flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full bg-[#C9A96A] animate-pulse"></span>
          <span>Showing <strong className="text-[#FAF8F5]">{totalResultsCount}</strong> Luxury Properties</span>
        </div>

      </div>

    </div>
  );
};
