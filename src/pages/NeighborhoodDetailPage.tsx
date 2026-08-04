import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { getTownBySlug } from '../data/towns';
import { fetchNeighborhoodData, schoolLevelLabel, NeighborhoodDataResult } from '../lib/neighborhoodDataApi';
import { fetchMlsListings } from '../lib/mlsApi';
import { Listing } from '../types';
import { ListingCard } from '../components/ListingCard';
import { usePageMeta } from '../lib/usePageMeta';
import { ChevronRight, Users, TrendingUp, DollarSign, Footprints, Bus, Bike, MapPin, GraduationCap } from 'lucide-react';

interface NeighborhoodDetailPageProps {
  savedListings: string[];
  onToggleSave: (id: string) => void;
  onScheduleShowing: (listing: Listing) => void;
}

export const NeighborhoodDetailPage: React.FC<NeighborhoodDetailPageProps> = ({
  savedListings,
  onToggleSave,
  onScheduleShowing,
}) => {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const town = slug ? getTownBySlug(slug) : undefined;

  const [data, setData] = useState<NeighborhoodDataResult | null>(null);
  const [dataLoading, setDataLoading] = useState(true);
  const [listings, setListings] = useState<Listing[]>([]);
  const [listingsStatus, setListingsStatus] = useState<'loading' | 'ok' | 'empty' | 'unavailable'>('loading');

  usePageMeta(
    town ? `${town.name}, MD Real Estate & Neighborhood Guide | The Friedman Team` : 'Neighborhood Guide | The Friedman Team',
    town ? `Homes for sale, local demographics, walkability, and schools in ${town.name}, MD - part of The Friedman Team's ${town.county} coverage.` : ''
  );

  useEffect(() => {
    if (!town) return;
    let cancelled = false;
    setDataLoading(true);
    (async () => {
      const result = await fetchNeighborhoodData(town.name, town.lat, town.lng, town.countyFips);
      if (!cancelled) {
        setData(result);
        setDataLoading(false);
      }
    })();
    return () => { cancelled = true; };
  }, [town?.slug]);

  useEffect(() => {
    if (!town) return;
    let cancelled = false;
    (async () => {
      const result = await fetchMlsListings({ q: town.name, top: 6 });
      if (cancelled) return;
      if (result.status === 'ok') {
        const matches = result.listings.filter((l) => l.city.toLowerCase() === town.name.toLowerCase());
        setListings(matches);
        setListingsStatus(matches.length > 0 ? 'ok' : 'empty');
      } else {
        setListingsStatus('unavailable');
      }
    })();
    return () => { cancelled = true; };
  }, [town?.slug]);

  if (!town) {
    return (
      <div className="pt-32 pb-20 text-center space-y-4">
        <p className="text-sm text-[#1C2B2E]/70">We couldn't find that neighborhood.</p>
        <Link to="/neighborhoods" className="inline-block px-6 py-3 bg-[#0D2226] text-[#FAF8F5] font-bold text-xs uppercase tracking-widest rounded-xs">
          View All Neighborhoods
        </Link>
      </div>
    );
  }

  const census = data?.census;
  const walkScore = data?.walkScore;
  const places = data?.nearbyPlaces;
  const schools = data?.schools;

  return (
    <div className="pt-28 pb-20 max-w-6xl mx-auto px-4 sm:px-6">

      <div className="flex items-center gap-2 text-xs text-[#1C2B2E]/60 mb-6">
        <Link to="/neighborhoods" className="hover:text-[#0F5C63] transition-colors">Neighborhoods</Link>
        <ChevronRight className="w-3 h-3" />
        <span className="text-[#0D2226] font-medium">{town.name}</span>
      </div>

      <div className="mb-10">
        <span className="text-xs font-bold uppercase tracking-widest text-[#0F5C63]">{town.county}</span>
        <h1 className="font-serif text-4xl sm:text-5xl font-bold text-[#0D2226] mt-1">{town.name}, MD</h1>
        <p className="text-sm text-[#1C2B2E]/70 mt-3 max-w-2xl">
          Local real estate, demographics, walkability, and schools for {town.name} - part of The Friedman Team's {town.county} coverage.
        </p>
      </div>

      <div className="mb-16">
        <h2 className="font-serif text-2xl font-bold text-[#0D2226] mb-6">Homes for Sale in {town.name}</h2>
        {listingsStatus === 'loading' && (
          <p className="text-sm text-[#1C2B2E]/60">Loading live listings...</p>
        )}
        {listingsStatus === 'ok' && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {listings.map((l) => (
              <ListingCard
                key={l.id}
                listing={l}
                isSaved={savedListings.includes(l.id)}
                onToggleSave={onToggleSave}
                onSelectListing={(sel) => navigate(`/listings/${encodeURIComponent(sel.mlsNumber || sel.id)}`, { state: { listing: sel } })}
                onScheduleShowing={onScheduleShowing}
              />
            ))}
          </div>
        )}
        {(listingsStatus === 'empty' || listingsStatus === 'unavailable') && (
          <div className="border border-[#C9A96A]/30 bg-[#FAF8F5] p-6 text-center">
            <p className="text-sm text-[#1C2B2E]/70 mb-3">No live listings in {town.name} right now - check back soon, or search all live inventory.</p>
            <Link to="/listings" className="inline-block px-6 py-2.5 bg-[#0D2226] text-[#FAF8F5] font-bold text-xs uppercase tracking-widest rounded-xs">
              Search Live Listings
            </Link>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">

        {dataLoading ? (
          <div className="text-sm text-[#1C2B2E]/60">Loading area data...</div>
        ) : (
          <>
            {census?.status === 'ok' && census.data && (
              <div>
                <h2 className="font-serif text-xl font-bold text-[#0D2226] mb-4">Overview for {town.name}, MD</h2>
                <p className="text-xs text-[#1C2B2E]/50 mb-4">Data provided by the U.S. Census Bureau.</p>
                <div className="grid grid-cols-3 gap-3">
                  {typeof census.data.population === 'number' && (
                    <div className="border border-[#C9A96A]/30 bg-white p-4 text-center">
                      <Users className="w-4 h-4 text-[#C9A96A] mx-auto mb-1" />
                      <div className="text-lg font-bold text-[#0D2226]">{census.data.population.toLocaleString()}</div>
                      <div className="text-[10px] uppercase tracking-wide text-[#1C2B2E]/50">Population</div>
                    </div>
                  )}
                  {typeof census.data.medianAge === 'number' && (
                    <div className="border border-[#C9A96A]/30 bg-white p-4 text-center">
                      <TrendingUp className="w-4 h-4 text-[#C9A96A] mx-auto mb-1" />
                      <div className="text-lg font-bold text-[#0D2226]">{census.data.medianAge}</div>
                      <div className="text-[10px] uppercase tracking-wide text-[#1C2B2E]/50">Median Age</div>
                    </div>
                  )}
                  {typeof census.data.medianHouseholdIncome === 'number' && (
                    <div className="border border-[#C9A96A]/30 bg-white p-4 text-center">
                      <DollarSign className="w-4 h-4 text-[#C9A96A] mx-auto mb-1" />
                      <div className="text-lg font-bold text-[#0D2226]">${census.data.medianHouseholdIncome.toLocaleString()}</div>
                      <div className="text-[10px] uppercase tracking-wide text-[#1C2B2E]/50">Median Income</div>
                    </div>
                  )}
                </div>
              </div>
            )}

            {walkScore?.status === 'ok' && walkScore.data && (
              <div>
                <h2 className="font-serif text-xl font-bold text-[#0D2226] mb-4">Around {town.name}, MD</h2>
                <p className="text-xs text-[#1C2B2E]/50 mb-4">Data provided by Walk Score.</p>
                <div className="grid grid-cols-3 gap-3">
                  {typeof walkScore.data.walkScore === 'number' && (
                    <div className="border border-[#C9A96A]/30 bg-white p-4 text-center">
                      <Footprints className="w-4 h-4 text-[#C9A96A] mx-auto mb-1" />
                      <div className="text-lg font-bold text-[#0D2226]">{walkScore.data.walkScore}</div>
                      <div className="text-[10px] uppercase tracking-wide text-[#1C2B2E]/50">{walkScore.data.walkDescription}</div>
                    </div>
                  )}
                  {typeof walkScore.data.transitScore === 'number' && (
                    <div className="border border-[#C9A96A]/30 bg-white p-4 text-center">
                      <Bus className="w-4 h-4 text-[#C9A96A] mx-auto mb-1" />
                      <div className="text-lg font-bold text-[#0D2226]">{walkScore.data.transitScore}</div>
                      <div className="text-[10px] uppercase tracking-wide text-[#1C2B2E]/50">{walkScore.data.transitDescription}</div>
                    </div>
                  )}
                  {typeof walkScore.data.bikeScore === 'number' && (
                    <div className="border border-[#C9A96A]/30 bg-white p-4 text-center">
                      <Bike className="w-4 h-4 text-[#C9A96A] mx-auto mb-1" />
                      <div className="text-lg font-bold text-[#0D2226]">{walkScore.data.bikeScore}</div>
                      <div className="text-[10px] uppercase tracking-wide text-[#1C2B2E]/50">{walkScore.data.bikeDescription}</div>
                    </div>
                  )}
                </div>
              </div>
            )}
          </>
        )}

        {!dataLoading && places?.status === 'ok' && places.data && places.data.places.length > 0 && (
          <div>
            <h2 className="font-serif text-xl font-bold text-[#0D2226] mb-4">Nearby in {town.name}</h2>
            <div className="space-y-2">
              {places.data.places.slice(0, 8).map((p, i) => (
                <div key={i} className="flex items-start gap-2 text-xs bg-white border border-[#C9A96A]/20 p-2.5">
                  <MapPin className="w-3.5 h-3.5 text-[#C9A96A] shrink-0 mt-0.5" />
                  <div>
                    <div className="font-semibold text-[#0D2226]">{p.name}</div>
                    <div className="text-[#1C2B2E]/60">{p.address}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {!dataLoading && schools?.status === 'ok' && schools.data && schools.data.schools.length > 0 && (
          <div>
            <h2 className="font-serif text-xl font-bold text-[#0D2226] mb-4">Schools Near {town.name}</h2>
            <p className="text-xs text-[#1C2B2E]/50 mb-4">Data provided by the U.S. Dept. of Education / Urban Institute.</p>
            <div className="space-y-2">
              {schools.data.schools.map((s, i) => (
                <div key={i} className="flex items-center justify-between text-xs bg-white border border-[#C9A96A]/20 p-2.5">
                  <div className="flex items-center gap-2">
                    <GraduationCap className="w-3.5 h-3.5 text-[#C9A96A] shrink-0" />
                    <div>
                      <div className="font-semibold text-[#0D2226]">{s.name}</div>
                      <div className="text-[#1C2B2E]/60">{s.city}, MD - {schoolLevelLabel(s.level)}</div>
                    </div>
                  </div>
                  <span className="text-[#1C2B2E]/50">{s.enrollment} students</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

    </div>
  );
};
