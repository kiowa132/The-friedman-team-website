import React, { useState, useEffect, useMemo } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { getTownBySlug, TOWNS } from '../data/towns';
import { fetchNeighborhoodData, schoolLevelLabel, NeighborhoodDataResult } from '../lib/neighborhoodDataApi';
import { fetchMlsListings } from '../lib/mlsApi';
import { Listing } from '../types';
import { ListingCard } from '../components/ListingCard';
import { usePageMeta } from '../lib/usePageMeta';
import { TownAlertSignup } from '../components/TownAlertSignup';
import {
  ChevronRight, MapPin, ExternalLink, Compass, UtensilsCrossed, Bus,
  GraduationCap, Users, Calendar, DollarSign, Footprints, Bike, TrainFront,
  ArrowRight, Phone, Home, Facebook, Instagram, Linkedin, Star, Youtube,
} from 'lucide-react';

interface NeighborhoodDetailPageProps {
  savedListings: string[];
  onToggleSave: (id: string) => void;
  onScheduleShowing: (listing: Listing) => void;
  onOpenConsultation: () => void;
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

// Compact stat card used in the "Market Snapshot" strip
const SnapshotStat: React.FC<{ icon: React.ReactNode; value: string; label: string }> = ({ icon, value, label }) => (
  <div className="flex items-center gap-3">
    <div className="w-10 h-10 rounded-full bg-[#C9A96A]/15 flex items-center justify-center text-[#C9A96A] shrink-0">
      {icon}
    </div>
    <div>
      <div className="font-serif text-xl font-bold text-[#FAF8F5] leading-none">{value}</div>
      <div className="text-[10px] uppercase tracking-widest text-[#A8B2A1] mt-1">{label}</div>
    </div>
  </div>
);

const POI_CATEGORIES = ['All', 'Restaurants', 'Shopping', 'Health', 'Lodging'] as const;
type PoiCategory = (typeof POI_CATEGORIES)[number];

const SCHOOL_LEVEL_CATEGORIES = ['All', 'Elementary', 'Middle', 'High'] as const;
type SchoolLevelCategory = (typeof SCHOOL_LEVEL_CATEGORIES)[number];

export const NeighborhoodDetailPage: React.FC<NeighborhoodDetailPageProps> = ({
  savedListings,
  onToggleSave,
  onScheduleShowing,
  onOpenConsultation,
}) => {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const town = slug ? getTownBySlug(slug) : undefined;

  const [data, setData] = useState<NeighborhoodDataResult | null>(null);
  const [dataLoading, setDataLoading] = useState(true);
  const [listings, setListings] = useState<Listing[]>([]);
  const [listingsStatus, setListingsStatus] = useState<'loading' | 'ok' | 'empty' | 'unavailable'>('loading');
  const [poiCategory, setPoiCategory] = useState<PoiCategory>('All');
  const [schoolLevel, setSchoolLevel] = useState<SchoolLevelCategory>('All');

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
    setListingsStatus('loading');
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
    if (poiCategory === 'All') return places;
    return places.filter((p) => p.category === poiCategory);
  }, [data, poiCategory]);

  const filteredSchools = useMemo(() => {
    const schools = data?.schools?.status === 'ok' ? data.schools.data?.schools || [] : [];
    if (schoolLevel === 'All') return schools;
    return schools.filter((s) => schoolLevelLabel(s.level) === schoolLevel);
  }, [data, schoolLevel]);

  const similarTowns = useMemo(() => {
    if (!town) return [];
    return TOWNS.filter((t) => t.county === town.county && t.slug !== town.slug).slice(0, 3);
  }, [town]);

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
  const hasCensusStats = !dataLoading && census?.status === 'ok' && census.data && (
    typeof census.data.population === 'number' ||
    typeof census.data.medianAge === 'number' ||
    typeof census.data.medianHouseholdIncome === 'number'
  );

  // Place + BreadcrumbList schema, built from the same real town data
  // (name, county, lat/lng, image, overview) the page itself renders from,
  // so the two can never drift out of sync. This is genuinely new
  // structured data going live on the site: the "SEO & Schema Inspector"
  // drawer elsewhere in the app displays a RealEstateAgent schema in a
  // copyable text box, but never actually injects it into the page as a
  // real <script> tag, so nothing schema-wise has been live before this.
  const SITE_URL = 'https://www.friedmanreteam.com';
  const pageUrl = `${SITE_URL}/neighborhoods/${town.slug}`;
  const schema = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'BreadcrumbList',
        itemListElement: [
          { '@type': 'ListItem', position: 1, name: 'Neighborhoods', item: `${SITE_URL}/neighborhoods` },
          { '@type': 'ListItem', position: 2, name: town.name, item: pageUrl },
        ],
      },
      {
        '@type': 'Place',
        name: `${town.name}, MD`,
        description: content
          ? content.overview
          : `Real estate, demographics, walkability, and schools information for ${town.name}, ${town.county}, Maryland.`,
        url: pageUrl,
        image: town.image.startsWith('http') ? town.image : `${SITE_URL}${town.image}`,
        address: {
          '@type': 'PostalAddress',
          addressLocality: town.name,
          addressRegion: 'MD',
          addressCountry: 'US',
        },
        geo: {
          '@type': 'GeoCoordinates',
          latitude: town.lat,
          longitude: town.lng,
        },
        containedInPlace: {
          '@type': 'AdministrativeArea',
          name: town.county,
        },
      },
    ],
  };

  return (
    <div>
      <script type="application/ld+json">{JSON.stringify(schema)}</script>
      {/* Hero - min-height (not fixed height) with generous top padding
          guarantees the content block never gets crowded under the fixed
          nav, regardless of how many lines the title/overview wrap to for
          a given town name/viewport width. */}
      <div className="relative min-h-[540px] w-full overflow-hidden flex items-end">
        <img src={town.image} alt={town.name} className="absolute inset-0 w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0D2226] via-[#0D2226]/55 to-[#0D2226]/20" />
        <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 pt-32 pb-10 w-full">
          <div className="flex items-center gap-2 text-xs text-[#FAF8F5]/70 mb-3">
            <Link to="/neighborhoods" className="hover:text-[#C9A96A] transition-colors">Neighborhoods</Link>
            <ChevronRight className="w-3 h-3" />
            <span>{town.name}</span>
          </div>
          <div className="text-[11px] uppercase tracking-[0.25em] text-[#C9A96A] font-semibold mb-2">
            {town.county}, Maryland
          </div>
          <h1 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold text-[#FAF8F5] uppercase tracking-wide max-w-3xl">
            {town.name} Real Estate &amp; Neighborhood Guide
          </h1>
          <p className="text-sm text-[#F5F1E8]/90 max-w-2xl mt-4 leading-relaxed">
            {content
              ? content.overview
              : `Real, local data on ${town.name}, including live listings, demographics, walkability, and schools, for buyers and sellers evaluating ${town.county}.`}
          </p>
          <div className="flex flex-wrap items-center gap-3 mt-6">
            <a href="#listings" className="inline-flex items-center gap-2 px-6 py-3 bg-[#C9A96A] hover:bg-[#D4AF37] text-[#0D2226] font-bold text-xs uppercase tracking-widest rounded-xs transition-colors">
              <Home className="w-4 h-4" />
              View Homes for Sale
            </a>
            <button
              onClick={onOpenConsultation}
              className="inline-flex items-center gap-2 px-6 py-3 border border-[#FAF8F5]/60 hover:border-[#C9A96A] text-[#FAF8F5] hover:text-[#C9A96A] font-bold text-xs uppercase tracking-widest rounded-xs transition-colors"
            >
              <Phone className="w-4 h-4" />
              Talk to Kyle Friedman
            </button>
          </div>
          <div className="flex items-center gap-2.5 mt-6">
            <a href="https://www.facebook.com/kyle.friedman132" target="_blank" rel="noopener noreferrer" aria-label="Facebook" className="w-8 h-8 rounded-full border border-[#FAF8F5]/25 flex items-center justify-center text-[#FAF8F5]/70 hover:border-[#C9A96A] hover:text-[#C9A96A] transition-colors">
              <Facebook className="w-3.5 h-3.5" />
            </a>
            <a href="https://www.instagram.com/keysbykyle" target="_blank" rel="noopener noreferrer" aria-label="Instagram" className="w-8 h-8 rounded-full border border-[#FAF8F5]/25 flex items-center justify-center text-[#FAF8F5]/70 hover:border-[#C9A96A] hover:text-[#C9A96A] transition-colors">
              <Instagram className="w-3.5 h-3.5" />
            </a>
            <a href="https://www.linkedin.com/in/kyle-friedman-415029168/?skipRedirect=true" target="_blank" rel="noopener noreferrer" aria-label="LinkedIn" className="w-8 h-8 rounded-full border border-[#FAF8F5]/25 flex items-center justify-center text-[#FAF8F5]/70 hover:border-[#C9A96A] hover:text-[#C9A96A] transition-colors">
              <Linkedin className="w-3.5 h-3.5" />
            </a>
            <a href="https://share.google/fH72jPIgQXjEImIHG" target="_blank" rel="noopener noreferrer" aria-label="Google Reviews" className="w-8 h-8 rounded-full border border-[#FAF8F5]/25 flex items-center justify-center text-[#FAF8F5]/70 hover:border-[#C9A96A] hover:text-[#C9A96A] transition-colors">
              <Star className="w-3.5 h-3.5" />
            </a>
            <a href="https://www.zillow.com/profile/Kyle%20Friedman%20Team" target="_blank" rel="noopener noreferrer" aria-label="Zillow" className="w-8 h-8 rounded-full border border-[#FAF8F5]/25 flex items-center justify-center text-[#FAF8F5]/70 hover:border-[#C9A96A] hover:text-[#C9A96A] transition-colors">
              <Home className="w-3.5 h-3.5" />
            </a>
            <a href="https://www.youtube.com/@SimplyFriedman/shorts" target="_blank" rel="noopener noreferrer" aria-label="YouTube" className="w-8 h-8 rounded-full border border-[#FAF8F5]/25 flex items-center justify-center text-[#FAF8F5]/70 hover:border-[#C9A96A] hover:text-[#C9A96A] transition-colors">
              <Youtube className="w-3.5 h-3.5" />
            </a>
          </div>
        </div>
      </div>

      {/* Market Snapshot strip - real Census data, mirrors hero-adjacent overview stats */}
      {hasCensusStats && (
        <div className="bg-[#0D2226] border-b border-[#C9A96A]/20">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 py-6">
            <div className="flex flex-wrap items-center gap-x-10 gap-y-5">
              <span className="text-[10px] uppercase tracking-[0.25em] text-[#C9A96A] font-bold shrink-0">
                Market Snapshot
              </span>
              {typeof census!.data!.population === 'number' && (
                <SnapshotStat icon={<Users className="w-4 h-4" />} value={census!.data!.population!.toLocaleString()} label="Population" />
              )}
              {typeof census!.data!.medianAge === 'number' && (
                <SnapshotStat icon={<Calendar className="w-4 h-4" />} value={String(census!.data!.medianAge)} label="Median Age" />
              )}
              {typeof census!.data!.medianHouseholdIncome === 'number' && (
                <SnapshotStat icon={<DollarSign className="w-4 h-4" />} value={`$${census!.data!.medianHouseholdIncome!.toLocaleString()}`} label="Median Household Income" />
              )}
            </div>
          </div>
        </div>
      )}

      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-14 space-y-16">

        {/* Homes for Sale */}
        <div id="listings" className="scroll-mt-24">
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
              <p className="text-sm text-[#1C2B2E]/70 mb-3">No live listings in {town.name} right now. Check back soon.</p>
              <Link to="/listings" className="inline-block px-6 py-2.5 bg-[#0D2226] text-[#FAF8F5] font-bold text-xs uppercase tracking-widest rounded-xs">
                Search Live Listings
              </Link>
            </div>
          )}
        </div>

        <TownAlertSignup townName={town.name} />

        {/* Neighborhood Guide - written narrative content */}
        {content && (
          <div>
            <div className="mb-10 max-w-3xl">
              <span className="text-[11px] uppercase tracking-[0.25em] text-[#C9A96A] font-bold">Neighborhood Guide</span>
              <h2 className="font-serif text-3xl font-bold text-[#0D2226] mt-2">
                Living in {town.name}
              </h2>
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-x-12 gap-y-10">
              <div className="space-y-3">
                <h3 className="font-serif text-xl font-bold text-[#0D2226] flex items-center gap-2">
                  <UtensilsCrossed className="w-5 h-5 text-[#0F5C63]" />
                  Restaurants, Retail &amp; Entertainment
                </h3>
                <p className="text-sm text-[#1C2B2E]/80 leading-relaxed">{content.restaurantsRetail}</p>
              </div>
              <div className="space-y-3">
                <h3 className="font-serif text-xl font-bold text-[#0D2226] flex items-center gap-2">
                  <Compass className="w-5 h-5 text-[#0F5C63]" />
                  Things To Do
                </h3>
                <ul className="space-y-3">
                  {content.thingsToDo.map((item, i) => (
                    <li key={i} className="flex items-start gap-3 text-sm text-[#1C2B2E]/80 leading-relaxed">
                      <span className="shrink-0 w-6 h-6 rounded-full border border-[#C9A96A]/50 text-[#C9A96A] text-[11px] font-bold flex items-center justify-center mt-0.5">
                        {i + 1}
                      </span>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
              <div className="space-y-3">
                <h3 className="font-serif text-xl font-bold text-[#0D2226] flex items-center gap-2">
                  <Bus className="w-5 h-5 text-[#0F5C63]" />
                  Transportation
                </h3>
                <p className="text-sm text-[#1C2B2E]/80 leading-relaxed">{content.transportation}</p>
              </div>
              {content.schoolsResourceUrl && (
                <div className="space-y-3">
                  <h3 className="font-serif text-xl font-bold text-[#0D2226] flex items-center gap-2">
                    <GraduationCap className="w-5 h-5 text-[#0F5C63]" />
                    Schools &amp; Safety
                  </h3>
                  <p className="text-sm text-[#1C2B2E]/80 leading-relaxed">
                    See the full school district directory for {town.name} area boundaries and contacts.
                  </p>
                  <a href={content.schoolsResourceUrl} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1.5 text-sm text-[#0F5C63] hover:text-[#0D2226] underline">
                    {content.schoolsResourceLabel} <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                </div>
              )}
            </div>
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

            {/* Points of Interest - table with category filters */}
            {data?.nearbyPlaces?.status === 'ok' && (data.nearbyPlaces.data?.places.length || 0) > 0 && (
              <div className="mt-10">
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
                      <a
                        key={i}
                        href={`https://www.google.com/maps/place/?q=place_id:${p.placeId}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="group flex items-center justify-between py-3 border-b border-[#C9A96A]/20 text-sm hover:bg-[#C9A96A]/5 transition-colors -mx-2 px-2"
                      >
                        <div className="flex items-center gap-2 min-w-0">
                          <MapPin className="w-3.5 h-3.5 text-[#C9A96A] shrink-0" />
                          <span className="font-semibold text-[#0D2226] group-hover:text-[#0F5C63] transition-colors truncate">{p.name}</span>
                        </div>
                        <div className="flex items-center gap-2 shrink-0">
                          <span className="text-xs text-[#1C2B2E]/60">{p.address}</span>
                          <ExternalLink className="w-3.5 h-3.5 text-[#C9A96A] opacity-0 group-hover:opacity-100 transition-opacity" />
                        </div>
                      </a>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        {/* Demographics */}
        {hasCensusStats && (
          <div>
            <h2 className="font-serif text-2xl font-bold text-[#0D2226] mb-1">
              Demographics for {town.name}, MD
            </h2>
            <p className="text-xs text-[#1C2B2E]/50 mb-6">Data provided by the U.S. Census Bureau.</p>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {typeof census!.data!.population === 'number' && (
                <div className="border border-[#C9A96A]/30 bg-white p-5 text-center">
                  <div className="text-2xl font-serif font-bold text-[#0D2226]">{census!.data!.population!.toLocaleString()}</div>
                  <div className="text-[10px] uppercase tracking-widest text-[#1C2B2E]/50 mt-1">Population</div>
                </div>
              )}
              {typeof census!.data!.medianAge === 'number' && (
                <div className="border border-[#C9A96A]/30 bg-white p-5 text-center">
                  <div className="text-2xl font-serif font-bold text-[#0D2226]">{census!.data!.medianAge}</div>
                  <div className="text-[10px] uppercase tracking-widest text-[#1C2B2E]/50 mt-1">Median Age</div>
                </div>
              )}
              {typeof census!.data!.medianHouseholdIncome === 'number' && (
                <div className="border border-[#C9A96A]/30 bg-white p-5 text-center">
                  <div className="text-2xl font-serif font-bold text-[#0D2226]">${census!.data!.medianHouseholdIncome!.toLocaleString()}</div>
                  <div className="text-[10px] uppercase tracking-widest text-[#1C2B2E]/50 mt-1">Median Household Income</div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Schools - table format with level filters */}
        {!dataLoading && schools?.status === 'ok' && (schools.data?.schools.length || 0) > 0 && (
          <div>
            <h2 className="font-serif text-2xl font-bold text-[#0D2226] mb-1">Schools Near {town.name}</h2>
            <p className="text-xs text-[#1C2B2E]/50 mb-4">
              Data provided by the U.S. Dept. of Education / Urban Institute. Enrollment shown rather than a proprietary rating score, since that data isn't part of this feed.
            </p>
            <div className="flex flex-wrap gap-2 mb-5">
              {SCHOOL_LEVEL_CATEGORIES.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setSchoolLevel(cat)}
                  className={`px-4 py-1.5 text-xs font-semibold rounded-full border transition-colors ${
                    schoolLevel === cat ? 'bg-[#0D2226] text-[#FAF8F5] border-[#0D2226]' : 'border-[#C9A96A]/40 text-[#1C2B2E]/70 hover:border-[#0F5C63]'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
            {filteredSchools.length === 0 ? (
              <p className="text-sm text-[#1C2B2E]/60">No schools in this category.</p>
            ) : (
              <div className="border-t border-[#C9A96A]/20">
                <div className="grid grid-cols-12 gap-2 py-2 text-[10px] font-bold uppercase tracking-widest text-[#1C2B2E]/50 border-b border-[#C9A96A]/20">
                  <span className="col-span-6">Name</span>
                  <span className="col-span-3">Level</span>
                  <span className="col-span-3 text-right">Enrollment</span>
                </div>
                {filteredSchools.map((s, i) => (
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
            )}
          </div>
        )}

        {/* Similar Neighborhoods - other towns in the same county */}
        {similarTowns.length > 0 && (
          <div>
            <h2 className="font-serif text-2xl font-bold text-[#0D2226] mb-6">
              Similar Neighborhoods in {town.county}
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
              {similarTowns.map((t) => (
                <Link key={t.slug} to={`/neighborhoods/${t.slug}`} className="group block">
                  <div className="relative aspect-[3/2] overflow-hidden">
                    <img
                      src={t.image}
                      alt={t.name}
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-[#0D2226]/10 group-hover:bg-[#0D2226]/25 transition-colors" />
                  </div>
                  <div className="flex items-center justify-between mt-3">
                    <h3 className="text-base font-light uppercase tracking-[0.1em] text-[#0D2226] group-hover:text-[#0F5C63] transition-colors">
                      {t.name}
                    </h3>
                    <ArrowRight className="w-4 h-4 text-[#C9A96A] opacity-0 group-hover:opacity-100 transition-opacity" />
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}

      </div>

      {/* CTA footer */}
      <section className="max-w-3xl mx-auto px-4 sm:px-6 pb-20 text-center">
        <div className="bg-[#0D2226] border border-[#C9A96A]/40 rounded-xs p-8 space-y-4">
          <h2 className="font-serif text-2xl font-bold text-[#FAF8F5]">
            Thinking About {town.name}?
          </h2>
          <p className="text-xs text-[#A8B2A1]">
            Get a real, investor-grade read on the {town.name} market, including pricing, inventory, and what's actually worth pursuing right now.
          </p>
          <button
            onClick={onOpenConsultation}
            className="px-8 py-3 bg-[#C9A96A] hover:bg-[#D4AF37] text-[#0D2226] font-bold text-xs uppercase tracking-widest rounded-xs transition-colors inline-flex items-center gap-2"
          >
            <Phone className="w-4 h-4" />
            <span>Talk to Kyle Friedman</span>
          </button>
        </div>
      </section>

    </div>
  );
};
