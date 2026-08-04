import React, { useState, useEffect, useMemo } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { getTownBySlug } from '../data/towns';
import { fetchNeighborhoodData, schoolLevelLabel, NeighborhoodDataResult } from '../lib/neighborhoodDataApi';
import { fetchMlsListings } from '../lib/mlsApi';
import { Listing } from '../types';
import { ListingCard } from '../components/ListingCard';
import { usePageMeta } from '../lib/usePageMeta';
import { ChevronRight, MapPin, ExternalLink, Compass, UtensilsCrossed, Bus, GraduationCap } from 'lucide-react';

interface NeighborhoodDetailPageProps {
  savedListings: string[];
  onToggleSave: (id: string) => void;
  onScheduleShowing: (listing: Listing) => void;
}

// Circular ring score badge, matching the reference's exact pattern
const ScoreRing: React.FC<{ score: number; label: string; sublabel: string }> = ({ score, label, sublabel }) => {
  const radius = 32;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (score / 100) * circumference;
  return (
    <div className="flex items-center gap-4">
      <div className="relative w-20 h-20 shrink-0">
        <svg className="w-20 h-20 -rotate-90" viewBox="0 0 80 80">
          <circle cx="40" cy="40" r={radius} fill="none" stroke="#C9A96A33" strokeWidth="5" />
          <circle
            cx="40" cy="40" r={radius} fill="none" stroke="#0F5C63" strokeWidth="5"
            strokeDasharray={circumference} strokeDashoffset={offset} strokeLinecap="round"
          />
        </svg>
        <span className="absolute inset-0 flex items-center justify-center font-serif text-xl font-bold text-[#0D2226]">
          {score}
        </span>
      </div>
      <div>
        <div className="text-sm font-semibold text-[#0D2226]">{sublabel}</div>
        <div className="text-[10px] uppercase tracking-widest text-[#1C2B2E]/50">{label}</div>
      </div>
    </div>
  );
};

const POI_CATEGORIES = ['All', 'Restaurants', 'Shopping', 'Health', 'Lodging'] as const;
type PoiCategory = (typeof POI_CATEGORIES)[number];

function matchesPoiCategory(types: string[], category: PoiCategory): boolean {
  if (category === 'All') return true;
  const map: Record<Exclude<PoiCategory, 'All'>, string[]> = {
    Restaurants: ['restaurant', 'food', 'cafe', 'bakery'],
    Shopping: ['store', 'shopping_mall', 'clothing_store', 'department_store', 'home_goods_store', 'furniture_store', 'electronics_store'],
    Health: ['hospital', 'doctor', 'health', 'pharmacy'],
    Lodging: ['lodging'],
  };
  return types.some((t) => map[category as Exclude<PoiCategory, 'All'>]?.includes(t));
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
  const [poiCategory, setPoiCategory] = useState<PoiCategory>('All');

  usePageMeta(
    town ? `${town.name}, MD Real Estate & Neighborhood Guide | The Friedman Team` : 'Neighborhood Guide | The Friedman Team',
    town ? `Homes for sale, local demographics, walkability, and schools in ${town.name}, MD.` : ''
  );

  useEffect(() => {
    if (!town) return;
    let cancelled = false;
    setDataLoading(true);
    (async () => {
      const result = await fetchNeighborhoodData(town.name, town.lat, town.lng, town.countyFips);
      if (!cancelled) { setData(result); setDataLoading(false); }
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

  const filteredPlaces = useMemo(() => {
    const places = data?.nearbyPlaces?.status === 'ok' ? data.nearbyPlaces.data?.places || [] : [];
    return places.filter((p) => matchesPoiCategory(p.types, poiCategory));
  }, [data, poiCategory]);

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
  const schools = data?.schools;
  const content = town.content;

  return (
    <div>
      {/* Hero */}
      <div className="relative h-[380px] w-full overflow-hidden flex items-end">
        <img src={town.image} alt={town.name} className="absolute inset-0 w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0D2226] via-[#0D2226]/50 to-[#0D2226]/20" />
        <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 pb-8 w-full">
          <div className="flex items-center gap-2 text-xs text-[#FAF8F5]/70 mb-3">
            <Link to="/neighborhoods" className="hover:text-[#C9A96A] transition-colors">Neighborhoods</Link>
            <ChevronRight className="w-3 h-3" />
            <span>{town.name}</span>
          </div>
          <h1 className="font-serif text-3xl sm:text-5xl font-bold text-[#FAF8F5] uppercase tracking-wide">
            {town.name}, MD Real Estate & Neighborhood Guide
          </h1>
          {content && <p className="text-sm text-[#F5F1E8]/90 max-w-2xl mt-3">{content.overview}</p>}
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-14 space-y-16">

        {/* Homes for Sale */}
        <div>
          <h2 className="font-serif text-2xl font-bold text-[#0D2226] mb-6">Homes for Sale in {town.name}</h2>
          {listingsStatus === 'loading' && <p className="text-sm text-[#1C2B2E]/60">Loading live listings...</p>}
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
              <p className="text-sm text-[#1C2B2E]/70 mb-3">No live listings in {town.name} right now - check back soon.</p>
              <Link to="/listings" className="inline-block px-6 py-2.5 bg-[#0D2226] text-[#FAF8F5] font-bold text-xs uppercase tracking-widest rounded-xs">
                Search Live Listings
              </Link>
            </div>
          )}
        </div>

        {/* Written narrative content */}
        {content && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
            <div className="space-y-3">
              <h2 className="font-serif text-xl font-bold text-[#0D2226] flex items-center gap-2">
                <UtensilsCrossed className="w-5 h-5 text-[#0F5C63]" />
                Restaurants, Retail & Entertainment
              </h2>
              <p className="text-sm text-[#1C2B2E]/80 leading-relaxed">{content.restaurantsRetail}</p>
            </div>
            <div className="space-y-3">
              <h2 className="font-serif text-xl font-bold text-[#0D2226] flex items-center gap-2">
                <Compass className="w-5 h-5 text-[#0F5C63]" />
                Things To Do
              </h2>
              <ul className="space-y-1.5 text-sm text-[#1C2B2E]/80">
                {content.thingsToDo.map((item, i) => (
                  <li key={i} className="flex items-start gap-2">
                    <span className="text-[#C9A96A] mt-1">•</span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div className="space-y-3">
              <h2 className="font-serif text-xl font-bold text-[#0D2226] flex items-center gap-2">
                <Bus className="w-5 h-5 text-[#0F5C63]" />
                Transportation
              </h2>
              <p className="text-sm text-[#1C2B2E]/80 leading-relaxed">{content.transportation}</p>
            </div>
            {content.schoolsResourceUrl && (
              <div className="space-y-3">
                <h2 className="font-serif text-xl font-bold text-[#0D2226] flex items-center gap-2">
                  <GraduationCap className="w-5 h-5 text-[#0F5C63]" />
                  Schools & Safety
                </h2>
                <a href={content.schoolsResourceUrl} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1.5 text-sm text-[#0F5C63] hover:text-[#0D2226] underline">
                  {content.schoolsResourceLabel} <ExternalLink className="w-3.5 h-3.5" />
                </a>
              </div>
            )}
          </div>
        )}

        {/* Around [Town] - Walk/Transit scores */}
        {!dataLoading && walkScore?.status === 'ok' && walkScore.data && (
          <div>
            <h2 className="font-serif text-2xl font-bold text-[#0D2226] mb-1">Around {town.name}, MD</h2>
            <p className="text-xs text-[#1C2B2E]/50 mb-6">Data provided by Walk Score.</p>
            <div className="flex flex-wrap gap-x-12 gap-y-6">
              {typeof walkScore.data.walkScore === 'number' && (
                <ScoreRing score={walkScore.data.walkScore} label="Walking Score" sublabel={walkScore.data.walkDescription || ''} />
              )}
              {typeof walkScore.data.transitScore === 'number' && (
                <ScoreRing score={walkScore.data.transitScore} label="Transit Score" sublabel={walkScore.data.transitDescription || ''} />
              )}
              {typeof walkScore.data.bikeScore === 'number' && (
                <ScoreRing score={walkScore.data.bikeScore} label="Bike Score" sublabel={walkScore.data.bikeDescription || ''} />
              )}
            </div>
          </div>
        )}

        {/* Points of Interest - table with category filters */}
        {!dataLoading && data?.nearbyPlaces?.status === 'ok' && (data.nearbyPlaces.data?.places.length || 0) > 0 && (
          <div>
            <h3 className="text-sm font-bold text-[#0D2226] mb-1">Points of Interest</h3>
            <p className="text-xs text-[#1C2B2E]/50 mb-4">Data provided by Google Places.</p>
            <div className="flex flex-wrap gap-2 mb-5">
              {POI_CATEGORIES.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setPoiCategory(cat)}
                  className={`px-4 py-1.5 text-xs font-semibold rounded-full border transition-colors ${
                    poiCategory === cat ? 'bg-[#0D2226] text-[#FAF8F5] border-[#0D2226]' : 'border-[#C9A96A]/40 text-[#1C2B2E]/70 hover:border-[#0F5C63]'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
            {filteredPlaces.length === 0 ? (
              <p className="text-sm text-[#1C2B2E]/60">No results in this category.</p>
            ) : (
              <div className="border-t border-[#C9A96A]/20">
                {filteredPlaces.map((p, i) => (
                  <div key={i} className="flex items-center justify-between py-3 border-b border-[#C9A96A]/20 text-sm">
                    <div className="flex items-center gap-2">
                      <MapPin className="w-3.5 h-3.5 text-[#C9A96A] shrink-0" />
                      <span className="font-semibold text-[#0D2226]">{p.name}</span>
                    </div>
                    <span className="text-xs text-[#1C2B2E]/60">{p.address}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Demographics */}
        {!dataLoading && census?.status === 'ok' && census.data && (
          <div>
            <h2 className="font-serif text-2xl font-bold text-[#0D2226] mb-1">
              Demographics for {town.name}, MD
            </h2>
            <p className="text-xs text-[#1C2B2E]/50 mb-6">Data provided by the U.S. Census Bureau.</p>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {typeof census.data.population === 'number' && (
                <div className="border border-[#C9A96A]/30 bg-white p-5 text-center">
                  <div className="text-2xl font-serif font-bold text-[#0D2226]">{census.data.population.toLocaleString()}</div>
                  <div className="text-[10px] uppercase tracking-widest text-[#1C2B2E]/50 mt-1">Population</div>
                </div>
              )}
              {typeof census.data.medianAge === 'number' && (
                <div className="border border-[#C9A96A]/30 bg-white p-5 text-center">
                  <div className="text-2xl font-serif font-bold text-[#0D2226]">{census.data.medianAge}</div>
                  <div className="text-[10px] uppercase tracking-widest text-[#1C2B2E]/50 mt-1">Median Age</div>
                </div>
              )}
              {typeof census.data.medianHouseholdIncome === 'number' && (
                <div className="border border-[#C9A96A]/30 bg-white p-5 text-center">
                  <div className="text-2xl font-serif font-bold text-[#0D2226]">${census.data.medianHouseholdIncome.toLocaleString()}</div>
                  <div className="text-[10px] uppercase tracking-widest text-[#1C2B2E]/50 mt-1">Median Household Income</div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Schools - table format */}
        {!dataLoading && schools?.status === 'ok' && (schools.data?.schools.length || 0) > 0 && (
          <div>
            <h2 className="font-serif text-2xl font-bold text-[#0D2226] mb-1">Schools Near {town.name}</h2>
            <p className="text-xs text-[#1C2B2E]/50 mb-6">
              Data provided by the U.S. Dept. of Education / Urban Institute. Enrollment shown rather than a proprietary rating score, since that data isn't part of this feed.
            </p>
            <div className="border-t border-[#C9A96A]/20">
              <div className="grid grid-cols-12 gap-2 py-2 text-[10px] font-bold uppercase tracking-widest text-[#1C2B2E]/50 border-b border-[#C9A96A]/20">
                <span className="col-span-6">Name</span>
                <span className="col-span-3">Level</span>
                <span className="col-span-3 text-right">Enrollment</span>
              </div>
              {schools.data!.schools.map((s, i) => (
                <div key={i} className="grid grid-cols-12 gap-2 py-3 border-b border-[#C9A96A]/20 text-sm items-center">
                  <div className="col-span-6">
                    <div className="font-semibold text-[#0D2226]">{s.name}</div>
                    <div className="text-xs text-[#1C2B2E]/50">{s.city}, MD</div>
                  </div>
                  <span className="col-span-3 text-xs text-[#1C2B2E]/70">{schoolLevelLabel(s.level)}</span>
                  <span className="col-span-3 text-right text-xs text-[#1C2B2E]/70">{s.enrollment} students</span>
                </div>
              ))}
            </div>
          </div>
        )}

      </div>
    </div>
  );
};
