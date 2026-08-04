import React, { useState, useEffect, useMemo } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { getTownBySlug } from '../data/towns';
import { fetchNeighborhoodData, schoolLevelLabel, NeighborhoodDataResult } from '../lib/neighborhoodDataApi';
import { fetchMlsListings } from '../lib/mlsApi';
import { Listing } from '../types';
import { ListingCard } from '../components/ListingCard';
import { usePageMeta } from '../lib/usePageMeta';
import { ChevronRight, Users, DollarSign, GraduationCap, ExternalLink } from 'lucide-react';

interface NeighborhoodDetailPageProps {
  savedListings: string[];
  onToggleSave: (id: string) => void;
  onScheduleShowing: (listing: Listing) => void;
}

// Buckets Google Places' raw "types" array into simple, Canopy-style
// filter categories. Falls back to "Other" rather than guessing wrong.
function categorizePlace(types: string[]): string {
  const t = types.join(',');
  if (/restaurant|food|cafe|bakery|meal_/.test(t)) return 'Dining';
  if (/store|shopping_mall|clothing|shoe|furniture|electronics|supermarket|department_store/.test(t)) return 'Shopping';
  if (/gym|park|stadium|fitness/.test(t)) return 'Active';
  if (/spa|hair_care|beauty_salon/.test(t)) return 'Beauty';
  if (/bar|night_club/.test(t)) return 'Nightlife';
  return 'Other';
}

// Circular score gauge, matching Canopy's Walk Score page pattern.
const ScoreGauge: React.FC<{ score: number; label: string; description: string }> = ({ score, label, description }) => {
  const radius = 32;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (score / 100) * circumference;
  return (
    <div className="flex items-center gap-4">
      <div className="relative w-20 h-20 shrink-0">
        <svg className="w-20 h-20 -rotate-90" viewBox="0 0 80 80">
          <circle cx="40" cy="40" r={radius} fill="none" stroke="#E5DFD0" strokeWidth="6" />
          <circle
            cx="40" cy="40" r={radius} fill="none"
            stroke="#0F5C63" strokeWidth="6" strokeLinecap="round"
            strokeDasharray={circumference} strokeDashoffset={offset}
          />
        </svg>
        <span className="absolute inset-0 flex items-center justify-center font-serif text-xl font-bold text-[#0D2226]">
          {score}
        </span>
      </div>
      <div>
        <div className="text-sm font-semibold text-[#0D2226]">{description}</div>
        <div className="text-[10px] uppercase tracking-widest text-[#1C2B2E]/50">{label}</div>
      </div>
    </div>
  );
};

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
  const [placeFilter, setPlaceFilter] = useState('All');

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

  const categorizedPlaces = useMemo(() => {
    const places = data?.nearbyPlaces?.data?.places || [];
    return places.map((p) => ({ ...p, category: categorizePlace(p.types) }));
  }, [data]);

  const placeCategories = useMemo(() => {
    const set = new Set(categorizedPlaces.map((p) => p.category));
    return ['All', ...Array.from(set)];
  }, [categorizedPlaces]);

  const filteredPlaces = placeFilter === 'All' ? categorizedPlaces : categorizedPlaces.filter((p) => p.category === placeFilter);

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

  return (
    <div className="pt-28 pb-20 max-w-6xl mx-auto px-4 sm:px-6">

      <div className="flex items-center gap-2 text-xs text-[#1C2B2E]/60 mb-6">
        <Link to="/neighborhoods" className="hover:text-[#0F5C63] transition-colors">Neighborhoods</Link>
        <ChevronRight className="w-3 h-3" />
        <span className="text-[#0D2226] font-medium">{town.name}</span>
      </div>

      <div className="mb-12">
        <span className="text-xs font-bold uppercase tracking-widest text-[#0F5C63]">{town.county}</span>
        <h1 className="font-serif text-4xl sm:text-5xl font-bold text-[#0D2226] uppercase tracking-wide mt-1">{town.name}, MD</h1>
      </div>

      {/* Homes for Sale */}
      <div className="mb-16">
        <h2 className="font-serif text-2xl font-bold text-[#0D2226] mb-6">Homes for Sale in {town.name}</h2>
        {listingsStatus === 'loading' && <p className="text-sm text-[#1C2B2E]/60">Loading live listings...</p>}
        {listingsStatus === 'ok' && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {listings.map((l) => (
              <ListingCard
                key={l.id} listing={l} isSaved={savedListings.includes(l.id)} onToggleSave={onToggleSave}
                onSelectListing={(sel) => navigate(`/listings/${encodeURIComponent(sel.mlsNumber || sel.id)}`, { state: { listing: sel } })}
                onScheduleShowing={onScheduleShowing}
              />
            ))}
          </div>
        )}
        {(listingsStatus === 'empty' || listingsStatus === 'unavailable') && (
          <div className="border border-[#C9A96A]/30 bg-[#FAF8F5] p-6 text-center">
            <p className="text-sm text-[#1C2B2E]/70 mb-3">No live listings in {town.name} right now.</p>
            <Link to="/listings" className="inline-block px-6 py-2.5 bg-[#0D2226] text-[#FAF8F5] font-bold text-xs uppercase tracking-widest rounded-xs">
              Search Live Listings
            </Link>
          </div>
        )}
      </div>

      {/* Overview - Census */}
      {!dataLoading && census?.status === 'ok' && census.data && (
        <div className="mb-16 border-t border-[#C9A96A]/20 pt-10">
          <h2 className="font-serif text-3xl font-bold text-[#0D2226] uppercase tracking-wide mb-2">Overview for {town.name}, MD</h2>
          <p className="text-xs text-[#1C2B2E]/50 mb-6">Data provided by the U.S. Census Bureau.</p>
          <div className="flex flex-wrap gap-10">
            {typeof census.data.population === 'number' && (
              <div className="flex items-center gap-3">
                <Users className="w-5 h-5 text-[#C9A96A]" />
                <div>
                  <div className="font-serif text-2xl font-bold text-[#0D2226]">{census.data.population.toLocaleString()}</div>
                  <div className="text-[10px] uppercase tracking-widest text-[#1C2B2E]/50">Total Population</div>
                </div>
              </div>
            )}
            {typeof census.data.medianAge === 'number' && (
              <div>
                <div className="font-serif text-2xl font-bold text-[#0D2226]">{census.data.medianAge} years</div>
                <div className="text-[10px] uppercase tracking-widest text-[#1C2B2E]/50">Median Age</div>
              </div>
            )}
            {typeof census.data.medianHouseholdIncome === 'number' && (
              <div className="flex items-center gap-3">
                <DollarSign className="w-5 h-5 text-[#C9A96A]" />
                <div>
                  <div className="font-serif text-2xl font-bold text-[#0D2226]">${census.data.medianHouseholdIncome.toLocaleString()}</div>
                  <div className="text-[10px] uppercase tracking-widest text-[#1C2B2E]/50">Median Household Income</div>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Around Town - Walk Score + Points of Interest */}
      {!dataLoading && walkScore?.status === 'ok' && walkScore.data && (
        <div className="mb-16 border-t border-[#C9A96A]/20 pt-10">
          <h2 className="font-serif text-3xl font-bold text-[#0D2226] uppercase tracking-wide mb-2">Around {town.name}, MD</h2>
          <p className="text-xs text-[#1C2B2E]/50 mb-6">There's plenty to do around {town.name}. Data provided by Walk Score and Google Places.</p>

          <div className="flex flex-wrap gap-10 pb-8">
            {typeof walkScore.data.walkScore === 'number' && (
              <ScoreGauge score={walkScore.data.walkScore} label="Walking Score" description={walkScore.data.walkDescription || ''} />
            )}
            {typeof walkScore.data.transitScore === 'number' && (
              <ScoreGauge score={walkScore.data.transitScore} label="Transit Score" description={walkScore.data.transitDescription || ''} />
            )}
            {typeof walkScore.data.bikeScore === 'number' && (
              <ScoreGauge score={walkScore.data.bikeScore} label="Bike Score" description={walkScore.data.bikeDescription || ''} />
            )}
          </div>

          {categorizedPlaces.length > 0 && (
            <>
              <h3 className="text-sm font-bold text-[#0D2226] mb-3">Points of Interest</h3>
              <div className="flex flex-wrap gap-2 mb-6">
                {placeCategories.map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setPlaceFilter(cat)}
                    className={`px-4 py-1.5 rounded-full text-xs font-semibold border transition-colors ${
                      placeFilter === cat
                        ? 'bg-[#C9A96A] border-[#C9A96A] text-[#0D2226]'
                        : 'bg-transparent border-[#0D2226]/20 text-[#0D2226]/70 hover:border-[#0F5C63]'
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>

              <div className="border-t border-[#0D2226]/10">
                <div className="grid grid-cols-[1fr_auto] gap-4 py-2 text-[10px] font-bold uppercase tracking-widest text-[#1C2B2E]/50">
                  <span>Name</span>
                  <span>Category</span>
                </div>
                {filteredPlaces.map((p, i) => (
                  <div key={i} className="grid grid-cols-[1fr_auto] gap-4 py-3 border-t border-[#0D2226]/10 items-center">
                    <div>
                      <div className="text-sm font-semibold text-[#0D2226]">{p.name}</div>
                      <div className="text-xs text-[#1C2B2E]/60">{p.address}</div>
                    </div>
                    <span className="px-3 py-1 bg-[#F5F1E8] text-[10px] font-bold uppercase tracking-wide text-[#0F5C63] rounded-xs whitespace-nowrap">
                      {p.category}
                    </span>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>
      )}

      {/* Schools */}
      {!dataLoading && schools?.status === 'ok' && schools.data && schools.data.schools.length > 0 && (
        <div className="border-t border-[#C9A96A]/20 pt-10">
          <h2 className="font-serif text-3xl font-bold text-[#0D2226] uppercase tracking-wide mb-2">Schools Near {town.name}</h2>
          <p className="text-xs text-[#1C2B2E]/50 mb-6">Data provided by the U.S. Dept. of Education (Urban Institute Education Data Portal).</p>

          <div className="border-t border-[#0D2226]/10">
            <div className="grid grid-cols-[auto_1fr_auto_auto] gap-4 py-2 text-[10px] font-bold uppercase tracking-widest text-[#1C2B2E]/50">
              <span className="w-8"></span>
              <span>Name</span>
              <span>Level</span>
              <span>Enrollment</span>
            </div>
            {schools.data.schools.map((s, i) => (
              <div key={i} className="grid grid-cols-[auto_1fr_auto_auto] gap-4 py-3 border-t border-[#0D2226]/10 items-center">
                <div className="w-8 h-8 rounded-full bg-[#F5F1E8] flex items-center justify-center">
                  <GraduationCap className="w-4 h-4 text-[#C9A96A]" />
                </div>
                <div>
                  <div className="text-sm font-semibold text-[#0D2226]">{s.name}</div>
                  <div className="text-xs text-[#1C2B2E]/60">{s.city}, MD</div>
                </div>
                <span className="px-2.5 py-1 bg-[#0F5C63]/10 text-[10px] font-bold uppercase text-[#0F5C63] rounded-xs whitespace-nowrap">
                  {schoolLevelLabel(s.level)}
                </span>
                <span className="text-sm text-[#1C2B2E]/70 whitespace-nowrap">{s.enrollment} students</span>
              </div>
            ))}
          </div>
        </div>
      )}

    </div>
  );
};
