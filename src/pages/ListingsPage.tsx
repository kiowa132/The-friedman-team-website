import React, { useState, useEffect, useCallback } from 'react';
import { Listing } from '../types';
import { ListingCard } from '../components/ListingCard';
import { IDXSearchHeader } from '../components/IDXSearchHeader';
import { Building2, SearchX, Phone, Loader2, WifiOff, AlertTriangle } from 'lucide-react';
import { fetchMlsListings } from '../lib/mlsApi';

interface ListingsPageProps {
  savedListings: string[];
  onToggleSave: (id: string) => void;
  onSelectListing: (listing: Listing) => void;
  onScheduleShowing: (listing: Listing) => void;
  onOpenConsultation: () => void;
  initialCountyFilter?: string;
}

type LoadState = 'loading' | 'ok' | 'not_configured' | 'error';

export const ListingsPage: React.FC<ListingsPageProps> = ({
  savedListings,
  onToggleSave,
  onSelectListing,
  onScheduleShowing,
  onOpenConsultation,
  initialCountyFilter = 'All'
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCounty, setSelectedCounty] = useState(initialCountyFilter);
  const [selectedType, setSelectedType] = useState('All');
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 6000000]);
  const [minBeds, setMinBeds] = useState(0);

  const [loadState, setLoadState] = useState<LoadState>('loading');
  const [errorMessage, setErrorMessage] = useState('');
  const [listings, setListings] = useState<Listing[]>([]);
  const [total, setTotal] = useState(0);
  const [debugInfo, setDebugInfo] = useState<any>(undefined);
  const [hasMore, setHasMore] = useState(false);
  const [nextSkip, setNextSkip] = useState(0);
  const [isLoadingMore, setIsLoadingMore] = useState(false);

  const runSearch = useCallback(async () => {
    setLoadState('loading');
    const result = await fetchMlsListings({
      county: selectedCounty !== 'All' ? selectedCounty : undefined,
      propertyType: selectedType !== 'All' ? selectedType : undefined,
      maxPrice: priceRange[1],
      minBeds: minBeds > 0 ? minBeds : undefined,
      q: searchQuery.trim() || undefined,
      top: 50,
    });

    setDebugInfo((result as any).debugInfo);

    if (result.status === 'ok') {
      setListings(result.listings);
      setTotal(result.total);
      setHasMore(Boolean(result.hasMore));
      setNextSkip(result.nextSkip || 0);
      setLoadState('ok');
    } else if (result.status === 'not_configured') {
      setLoadState('not_configured');
      setErrorMessage(result.message);
    } else {
      setLoadState('error');
      setErrorMessage(result.message);
    }
  }, [searchQuery, selectedCounty, selectedType, priceRange, minBeds]);

  const loadMore = useCallback(async () => {
    setIsLoadingMore(true);
    const result = await fetchMlsListings({
      county: selectedCounty !== 'All' ? selectedCounty : undefined,
      propertyType: selectedType !== 'All' ? selectedType : undefined,
      maxPrice: priceRange[1],
      minBeds: minBeds > 0 ? minBeds : undefined,
      q: searchQuery.trim() || undefined,
      top: 50,
      skip: nextSkip,
    });

    if (result.status === 'ok') {
      // Append, and de-dupe in case the same listing shows up across pages.
      setListings((prev) => {
        const existingIds = new Set(prev.map((l) => l.id));
        const merged = [...prev, ...result.listings.filter((l) => !existingIds.has(l.id))];
        return merged;
      });
      setHasMore(Boolean(result.hasMore));
      setNextSkip(result.nextSkip || nextSkip);
    }
    setIsLoadingMore(false);
  }, [searchQuery, selectedCounty, selectedType, priceRange, minBeds, nextSkip]);

  // Debounce so we don't fire a request on every keystroke / slider tick.
  useEffect(() => {
    const handle = setTimeout(runSearch, 400);
    return () => clearTimeout(handle);
  }, [runSearch]);

  const handleResetFilters = () => {
    setSearchQuery('');
    setSelectedCounty('All');
    setSelectedType('All');
    setPriceRange([0, 6000000]);
    setMinBeds(0);
  };

  return (
    <div className="pt-28 pb-20 space-y-12 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

      {/* Page Header */}
      <div className="text-center space-y-3">
        <span className="text-xs font-bold uppercase tracking-[0.25em] text-[#0F5C63] bg-[#0F5C63]/10 px-4 py-1.5 border border-[#0F5C63]/30 inline-block">
          Maryland Estate Portfolio
        </span>
        <h1 className="font-serif text-4xl sm:text-6xl font-bold text-[#0D2226]">
          Luxury Homes, Farms & Estates
        </h1>
        <p className="text-sm text-[#1C2B2E]/80 max-w-2xl mx-auto font-normal">
          Search live listings across Carroll, Baltimore, Howard, and Frederick County.
        </p>
      </div>

      {/* Concierge banner - frames direct contact as the premium, complete
          path (which is genuinely true: search here only reflects a
          portion of live inventory), rather than looking like an apology
          for a limited feature. */}
      <div className="bg-[#0D2226] border border-[#C9A96A]/40 rounded-xs px-6 py-5 flex flex-col sm:flex-row items-center justify-between gap-4 max-w-4xl mx-auto text-center sm:text-left">
        <div>
          <p className="text-xs font-bold uppercase tracking-widest text-[#C9A96A] mb-1">
            White Glove Search
          </p>
          <p className="text-sm text-[#FAF8F5]/90">
            Reach out to Kyle Friedman directly for the most current inventory across Carroll, Baltimore, Howard & Frederick County, including opportunities not publicly listed below.
          </p>
        </div>
        <button
          onClick={onOpenConsultation}
          className="shrink-0 px-6 py-3 bg-[#C9A96A] hover:bg-[#D4AF37] text-[#0D2226] font-bold text-xs uppercase tracking-widest rounded-xs transition-colors whitespace-nowrap"
        >
          Talk to Kyle Friedman
        </button>
      </div>

      {/* IDX Search Header Filter Bar */}
      <IDXSearchHeader
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        selectedCounty={selectedCounty}
        setSelectedCounty={setSelectedCounty}
        selectedType={selectedType}
        setSelectedType={setSelectedType}
        priceRange={priceRange}
        setPriceRange={setPriceRange}
        minBeds={minBeds}
        setMinBeds={setMinBeds}
        onResetFilters={handleResetFilters}
        totalResultsCount={loadState === 'ok' ? total : 0}
        suggestions={loadState === 'ok' ? listings : []}
        onSelectSuggestion={onSelectListing}
      />

      {/* Loading state */}
      {loadState === 'loading' && (
        <div className="py-20 flex flex-col items-center justify-center gap-3 text-[#0F5C63]">
          <Loader2 className="w-8 h-8 animate-spin" />
          <p className="text-xs font-semibold uppercase tracking-widest">Searching Live MLS...</p>
        </div>
      )}

      {/* MLS not connected yet - honest placeholder, not fake data */}
      {loadState === 'not_configured' && (
        <div className="bg-[#FAF8F5] border border-[#C9A96A]/40 p-12 text-center rounded-xs space-y-4">
          <WifiOff className="w-12 h-12 text-[#C9A96A] mx-auto" />
          <h3 className="font-serif text-2xl font-bold text-[#0D2226]">
            Live MLS Search Isn't Connected Yet
          </h3>
          <p className="text-xs text-[#1C2B2E]/80 max-w-md mx-auto">
            This page is built and ready to show real, live listings the moment an MLS data feed (Bridge Interactive or an IDX vendor) is connected on the server. In the meantime, reach out directly and Kyle will send you current listings by hand.
          </p>
          <button
            onClick={onOpenConsultation}
            className="px-6 py-2.5 bg-[#C9A96A] text-[#0D2226] font-bold text-xs uppercase"
          >
            Get Current Listings From Kyle
          </button>
        </div>
      )}

      {/* Request failed */}
      {loadState === 'error' && (
        <div className="bg-[#FAF8F5] border border-red-400/50 p-12 text-center rounded-xs space-y-4">
          <AlertTriangle className="w-12 h-12 text-red-500 mx-auto" />
          <h3 className="font-serif text-2xl font-bold text-[#0D2226]">
            Couldn't Load Listings Right Now
          </h3>
          <p className="text-xs text-[#1C2B2E]/80 max-w-md mx-auto">{errorMessage}</p>
          <button
            onClick={runSearch}
            className="px-6 py-2.5 bg-[#FAF8F5] border border-[#0D2226] text-[#0D2226] font-bold text-xs uppercase"
          >
            Try Again
          </button>
        </div>
      )}

      {/* Results */}
      {loadState === 'ok' && (
        listings.length > 0 ? (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {listings.map((listing) => (
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

            {hasMore && (
              <div className="flex justify-center pt-4">
                <button
                  onClick={loadMore}
                  disabled={isLoadingMore}
                  className="px-8 py-3 bg-[#0D2226] hover:bg-[#0F5C63] text-[#FAF8F5] font-bold text-xs uppercase tracking-widest rounded-xs shadow-lg transition-all disabled:opacity-60 flex items-center gap-2"
                >
                  {isLoadingMore ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>Loading More...</span>
                    </>
                  ) : (
                    <span>Load More Listings ({listings.length.toLocaleString()} of {total.toLocaleString()} shown)</span>
                  )}
                </button>
              </div>
            )}
          </>
        ) : (
          <div className="bg-[#FAF8F5] border border-[#C9A96A]/40 p-12 text-center rounded-xs space-y-4">
            <SearchX className="w-12 h-12 text-[#C9A96A] mx-auto" />
            <h3 className="font-serif text-2xl font-bold text-[#0D2226]">
              No Listings Match Your Criteria
            </h3>
            <p className="text-xs text-[#1C2B2E]/80 max-w-md mx-auto">
              Try adjusting your search filters, or contact Kyle directly — he has access to off-market opportunities not shown in public search.
            </p>
            <div className="pt-2 flex flex-wrap items-center justify-center gap-3">
              <button
                onClick={handleResetFilters}
                className="px-6 py-2.5 bg-[#FAF8F5] border border-[#0D2226] text-[#0D2226] font-bold text-xs uppercase"
              >
                Reset All Filters
              </button>
              <button
                onClick={onOpenConsultation}
                className="px-6 py-2.5 bg-[#C9A96A] text-[#0D2226] font-bold text-xs uppercase"
              >
                Inquire Off-Market Options
              </button>
            </div>
          </div>
        )
      )}

      {/* Bottom Off-Market Advisory Banner */}
      <div className="bg-[#0D2226] border border-[#C9A96A] text-[#FAF8F5] p-8 rounded-xs text-center space-y-4">
        <h3 className="font-serif text-2xl font-bold text-[#FAF8F5]">
          Looking for Something Specific?
        </h3>
        <p className="text-xs text-[#A8B2A1] max-w-xl mx-auto">
          Nearly 30% of high-end estates in Green Spring Valley and Carroll County trade confidentially without public MLS marketing. Share your criteria with Kyle Friedman.
        </p>
        <button
          onClick={onOpenConsultation}
          className="px-8 py-3 bg-[#C9A96A] hover:bg-[#D4AF37] text-[#0D2226] font-bold text-xs uppercase tracking-widest rounded-xs"
        >
          Submit Confidential Buyer Criteria
        </button>
      </div>

      {/* DEBUG PANEL - only appears when DEBUG_MLS=true on the server.
          Shows exactly what Lofty's API returned so field-mapping issues
          can be diagnosed by screenshotting this box directly. Remove or
          set DEBUG_MLS=false once search is confirmed working. */}
      {debugInfo && (
        <div className="bg-yellow-50 border-2 border-yellow-500 rounded-xs p-4 space-y-2">
          <h4 className="font-bold text-xs uppercase tracking-widest text-yellow-800">
            Debug Info (DEBUG_MLS is on)
          </h4>
          <pre className="text-[10px] leading-relaxed text-yellow-900 whitespace-pre-wrap break-all bg-white p-3 rounded border border-yellow-300 max-h-96 overflow-y-auto">
            {JSON.stringify(debugInfo, null, 2)}
          </pre>
        </div>
      )}

    </div>
  );
};
