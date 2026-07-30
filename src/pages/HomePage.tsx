import React from 'react';
import { Listing, Neighborhood } from '../types';
import { ListingCard } from '../components/ListingCard';
import {
  ArrowRight, ShieldCheck, TrendingUp, Calculator, Phone, CheckCircle2,
  ChevronRight, Search, Home as HomeIcon, TreePine, Building2, MapPinned, LineChart
} from 'lucide-react';

interface HomePageProps {
  listings: Listing[];
  neighborhoods: Neighborhood[];
  savedListings: string[];
  onToggleSave: (id: string) => void;
  onSelectListing: (listing: Listing) => void;
  onScheduleShowing: (listing: Listing) => void;
  onOpenValuation: () => void;
  onOpenConsultation: () => void;
  setActiveTab: (tab: string) => void;
  onSelectNeighborhood: (id: string) => void;
}

export const HomePage: React.FC<HomePageProps> = ({
  listings,
  neighborhoods,
  savedListings,
  onToggleSave,
  onSelectListing,
  onScheduleShowing,
  onOpenValuation,
  onOpenConsultation,
  setActiveTab,
  onSelectNeighborhood,
}) => {
  const featuredListings = listings.filter((l) => l.featured).slice(0, 3);

  const specialties = [
    { icon: TreePine, label: 'Farms & Equestrian', desc: 'Acreage, outbuildings, agricultural preservation' },
    { icon: HomeIcon, label: 'Luxury Residences', desc: 'Estate homes across Carroll, Baltimore & Howard' },
    { icon: Building2, label: 'Country Estates', desc: 'Privacy, land, and long-term value' },
    { icon: MapPinned, label: 'Land & Acreage', desc: 'Zoning, easements, and future potential' },
  ];

  return (
    <div className="space-y-24 pb-20">

      {/* 1. HERO */}
      <section className="relative h-screen min-h-[700px] w-full overflow-hidden flex items-center justify-center text-[#FAF8F5]">
        <div className="absolute inset-0 bg-[#0D2226]">
          <img
            src="https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=2000&q=80"
            alt="Maryland Luxury Estate - The Friedman Team"
            className="w-full h-full object-cover animate-kenburns opacity-70"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0D2226] via-[#0D2226]/40 to-[#0D2226]/60" />
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-transparent via-[#0D2226]/30 to-[#0D2226]" />
        </div>

        <div className="relative z-10 max-w-5xl mx-auto px-4 text-center space-y-6 pt-20">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#0D2226]/80 backdrop-blur-md border border-[#C9A96A]/50 text-[#C9A96A] text-xs uppercase tracking-[0.25em] font-semibold animate-fadeIn">
            <ShieldCheck className="w-4 h-4 text-[#C9A96A]" />
            <span>The Friedman Team • eXp Realty</span>
          </div>

          <div className="space-y-3">
            <h2 className="text-xs sm:text-sm uppercase tracking-[0.35em] text-[#C9A96A] font-bold">
              The Friedman Team
            </h2>
            <h1 className="font-serif text-4xl sm:text-6xl md:text-7xl lg:text-8xl font-bold tracking-tight text-[#FAF8F5] leading-none">
              More Than a Listing.<br />
              <span className="italic font-normal gold-gradient-text">A Strategy.</span>
            </h1>
          </div>

          <p className="max-w-2xl mx-auto text-sm sm:text-base md:text-lg text-[#F5F1E8]/90 font-light leading-relaxed">
            Strategic real estate representation for Maryland homeowners who expect exceptional results. Specializing in luxury homes, farms, estates, and distinctive properties in Carroll, Baltimore, and Howard counties.
          </p>

          <div className="pt-6 flex flex-col sm:flex-row items-center justify-center gap-4">
            <button
              onClick={() => setActiveTab('listings')}
              id="hero-search-btn"
              className="w-full sm:w-auto px-8 py-4 bg-[#C9A96A] hover:bg-[#D4AF37] text-[#0D2226] font-bold text-xs uppercase tracking-[0.2em] rounded-xs shadow-2xl transition-all hover:scale-105 flex items-center justify-center gap-2"
            >
              <Search className="w-4 h-4" />
              <span>Search Homes</span>
            </button>

            <button
              onClick={onOpenValuation}
              id="hero-valuation-btn"
              className="w-full sm:w-auto px-8 py-4 bg-[#0F5C63]/90 hover:bg-[#0F5C63] text-[#FAF8F5] font-bold text-xs uppercase tracking-[0.2em] border border-[#C9A96A]/60 rounded-xs shadow-2xl transition-all hover:scale-105 flex items-center justify-center gap-2 backdrop-blur-md"
            >
              <Calculator className="w-4 h-4 text-[#C9A96A]" />
              <span>What's Your Home Worth?</span>
            </button>
          </div>

          <div className="pt-12 text-[10px] uppercase tracking-[0.3em] text-[#A8B2A1] flex items-center justify-center gap-2">
            <span>Explore Maryland Luxury Estates</span>
            <span className="w-1.5 h-1.5 rounded-full bg-[#C9A96A] animate-ping" />
          </div>
        </div>
      </section>

      {/* 2. VALUE PROPS
          Replaced fabricated stats ("$150M+ career sales," "99.4% list-to-sale
          ratio," etc.) with honest, non-numeric value props. If you have real
          verified numbers you want to show here instead, send them over and
          I'll swap these back to numbers. */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-12 relative z-20">
        <div className="bg-[#0D2226] border border-[#C9A96A]/40 text-[#FAF8F5] p-8 rounded-xs shadow-2xl grid grid-cols-1 sm:grid-cols-3 gap-6 text-center">
          <div>
            <ShieldCheck className="w-6 h-6 text-[#C9A96A] mx-auto mb-2" />
            <div className="text-sm font-serif font-bold text-[#FAF8F5]">Real Comps, Real Numbers</div>
            <div className="text-[11px] uppercase tracking-wider text-[#A8B2A1] mt-1">Priced from live MLS data, not guesswork</div>
          </div>
          <div className="border-l-0 sm:border-l border-[#FAF8F5]/10">
            <TreePine className="w-6 h-6 text-[#C9A96A] mx-auto mb-2" />
            <div className="text-sm font-serif font-bold text-[#FAF8F5]">Farm & Land Expertise</div>
            <div className="text-[11px] uppercase tracking-wider text-[#A8B2A1] mt-1">Acreage, zoning, and agricultural preservation</div>
          </div>
          <div className="border-l-0 sm:border-l border-[#FAF8F5]/10">
            <LineChart className="w-6 h-6 text-[#C9A96A] mx-auto mb-2" />
            <div className="text-sm font-serif font-bold text-[#FAF8F5]">Investor's Perspective</div>
            <div className="text-[11px] uppercase tracking-wider text-[#A8B2A1] mt-1">A wholesaling background applied to every deal</div>
          </div>
        </div>
      </section>

      {/* 3. FEATURED LISTINGS
          Curated set, not live search results - full live MLS search lives
          on the Listings page. */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row items-start md:items-end justify-between gap-4 mb-10 pb-4 border-b border-[#C9A96A]/30">
          <div>
            <span className="text-xs font-bold uppercase tracking-widest text-[#0F5C63]">
              Curated Maryland Estates
            </span>
            <h2 className="font-serif text-3xl sm:text-4xl font-bold text-[#0D2226] mt-1">
              Featured Luxury Properties
            </h2>
          </div>

          <button
            onClick={() => setActiveTab('listings')}
            className="text-xs font-bold uppercase tracking-widest text-[#0F5C63] hover:text-[#C9A96A] flex items-center gap-1.5 transition-colors"
          >
            <span>Search All Live Listings</span>
            <ArrowRight className="w-4 h-4 text-[#C9A96A]" />
          </button>
        </div>

        {featuredListings.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {featuredListings.map((listing) => (
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
          <div className="text-center py-12 border border-[#C9A96A]/30 bg-[#FAF8F5]">
            <p className="text-sm text-[#1C2B2E]/70 mb-4">See the full, live inventory on the Listings page.</p>
            <button
              onClick={() => setActiveTab('listings')}
              className="px-6 py-3 bg-[#0D2226] text-[#FAF8F5] font-bold text-xs uppercase tracking-widest rounded-xs"
            >
              Search Live Listings
            </button>
          </div>
        )}
      </section>

      {/* 4. SPECIALTIES GRID */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto space-y-3 mb-10">
          <span className="text-xs font-bold uppercase tracking-[0.25em] text-[#0F5C63]">
            What Kyle Specializes In
          </span>
          <h2 className="font-serif text-3xl sm:text-4xl font-bold text-[#0D2226]">
            Not Just Homes — Land, Farms & Estates
          </h2>
        </div>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
          {specialties.map((s) => (
            <div key={s.label} className="bg-[#FAF8F5] border border-[#C9A96A]/30 p-6 text-center space-y-2 rounded-xs shadow-sm">
              <s.icon className="w-7 h-7 text-[#C9A96A] mx-auto" />
              <h3 className="font-serif font-bold text-[#0D2226] text-sm">{s.label}</h3>
              <p className="text-[11px] text-[#1C2B2E]/70 leading-snug">{s.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* 5. WHY CHOOSE THE FRIEDMAN TEAM (Kyle bio) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-[#FAF8F5] border border-[#C9A96A]/30 p-8 sm:p-12 rounded-xs shadow-lg grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
          <div className="lg:col-span-5 relative">
            <div className="relative rounded-xs overflow-hidden border-2 border-[#C9A96A] aspect-[4/5]">
              <img
                src="/images/kyle-portrait.jpg"
                alt="Kyle Friedman Real Estate Advisor"
                className="w-full h-full object-cover"
              />
              <div className="absolute bottom-4 left-4 right-4 bg-[#0D2226]/90 p-4 border border-[#C9A96A]/40 text-[#FAF8F5]">
                <div className="font-serif font-bold text-lg">Kyle Friedman</div>
                <div className="text-xs text-[#C9A96A] font-semibold uppercase tracking-wider">
                  Principal Advisor • eXp Realty
                </div>
              </div>
            </div>
          </div>

          <div className="lg:col-span-7 space-y-6">
            <span className="text-xs font-bold uppercase tracking-widest text-[#0F5C63]">
              Why Choose The Friedman Team
            </span>

            <h2 className="font-serif text-3xl sm:text-4xl font-bold text-[#0D2226]">
              A Wholesaler's Instincts, Now Working for You as a Buyer or Seller.
            </h2>

            <p className="text-sm text-[#1C2B2E]/80 leading-relaxed font-normal">
              Kyle Friedman started in door-to-door sales, then spent years wholesaling deals across Baltimore and Carroll County before becoming a REALTOR®. That means every listing gets priced off real comps and real numbers — not a guess — and every deal gets negotiated by someone who's actually sat across the table from motivated sellers and serious investors alike.
            </p>

            <div className="grid grid-cols-2 gap-4 text-xs font-semibold text-[#0D2226]">
              <div className="p-3 bg-[#FAF8F5] border border-[#C9A96A]/30">
                <span className="text-[#0F5C63] block font-bold">Specialization:</span>
                Farms, Estates & Luxury Residences
              </div>
              <div className="p-3 bg-[#FAF8F5] border border-[#C9A96A]/30">
                <span className="text-[#0F5C63] block font-bold">Market Reach:</span>
                Carroll, Baltimore & Howard Counties
              </div>
            </div>

            <div className="pt-2 flex items-center gap-4">
              <button
                onClick={() => setActiveTab('about')}
                className="px-6 py-3 bg-[#0F5C63] hover:bg-[#0D2226] text-[#FAF8F5] font-bold text-xs uppercase tracking-wider rounded-xs transition-colors"
              >
                Read Full Advisory Bio
              </button>
              <button
                onClick={onOpenConsultation}
                className="px-6 py-3 bg-[#C9A96A] hover:bg-[#D4AF37] text-[#0D2226] font-bold text-xs uppercase tracking-wider rounded-xs transition-colors"
              >
                Schedule Private Call
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* 6. SELLER STRATEGY CTA */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-gradient-to-r from-[#0F5C63] via-[#0D2226] to-[#0F5C63] text-[#FAF8F5] border border-[#C9A96A]/50 p-8 sm:p-12 rounded-xs shadow-2xl relative overflow-hidden">
          <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            <div className="lg:col-span-8 space-y-4">
              <span className="text-xs font-bold uppercase tracking-widest text-[#C9A96A] bg-[#0D2226] px-3 py-1 border border-[#C9A96A]/30">
                Thinking of Selling?
              </span>
              <h2 className="font-serif text-3xl sm:text-4xl font-bold">
                Get a Real Read on Your Property's Value
              </h2>
              <p className="text-sm text-[#FAF8F5]/90 max-w-2xl leading-relaxed">
                Tell Kyle a bit about your property, and he'll personally follow up with a comparative market analysis built from real, current comps — not an automated guess.
              </p>
            </div>

            <div className="lg:col-span-4 flex flex-col gap-3 items-start lg:items-end">
              <button
                onClick={onOpenValuation}
                id="seller-strategy-valuation-btn"
                className="px-8 py-4 bg-[#C9A96A] hover:bg-[#D4AF37] text-[#0D2226] font-bold text-xs uppercase tracking-widest rounded-xs shadow-xl transition-all hover:scale-105 flex items-center gap-2"
              >
                <Calculator className="w-4 h-4" />
                <span>Get Your Home Value</span>
              </button>
              <button
                onClick={() => setActiveTab('sell')}
                className="text-xs font-bold uppercase tracking-wider text-[#FAF8F5]/80 hover:text-[#C9A96A] border-b border-[#FAF8F5]/40 pb-1"
              >
                See Full Seller Strategy
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* 7. BUYER RESOURCES CTA */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-[#FAF8F5] border border-[#C9A96A]/40 p-8 sm:p-12 rounded-xs shadow-lg relative overflow-hidden">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            <div className="lg:col-span-8 space-y-4">
              <span className="text-xs font-bold uppercase tracking-widest text-[#0F5C63] bg-[#0F5C63]/10 px-3 py-1 border border-[#0F5C63]/30 inline-block">
                Thinking of Buying?
              </span>
              <h2 className="font-serif text-3xl sm:text-4xl font-bold text-[#0D2226]">
                Find the Right Property, With Someone Who Knows Land
              </h2>
              <p className="text-sm text-[#1C2B2E]/80 max-w-2xl leading-relaxed">
                From first homes to farms and investment properties, Kyle helps you understand real comps, real risk, and real opportunity before you make an offer.
              </p>
            </div>
            <div className="lg:col-span-4 flex flex-col gap-3 items-start lg:items-end">
              <button
                onClick={() => setActiveTab('listings')}
                className="px-8 py-4 bg-[#0D2226] hover:bg-[#0F5C63] text-[#FAF8F5] font-bold text-xs uppercase tracking-widest rounded-xs shadow-xl transition-all hover:scale-105 flex items-center gap-2"
              >
                <Search className="w-4 h-4" />
                <span>Search Homes</span>
              </button>
              <button
                onClick={() => setActiveTab('buy')}
                className="text-xs font-bold uppercase tracking-wider text-[#0D2226] hover:text-[#C9A96A] border-b border-[#0D2226] pb-1"
              >
                See Buyer's Strategy
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* 8. NEIGHBORHOOD GUIDES */}
      <section className="bg-[#0D2226] text-[#FAF8F5] py-20 border-y border-[#C9A96A]/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          <div className="text-center max-w-3xl mx-auto space-y-3">
            <span className="text-xs font-bold uppercase tracking-[0.25em] text-[#C9A96A]">
              Maryland Enclaves & Valleys
            </span>
            <h2 className="font-serif text-3xl sm:text-5xl font-bold text-[#FAF8F5]">
              Explore Distinctive Neighborhoods
            </h2>
            <p className="text-sm text-[#A8B2A1] font-light">
              Deep local roots across Carroll County, Baltimore County, and Howard County's most prestigious communities.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {neighborhoods.slice(0, 3).map((n) => (
              <div
                key={n.id}
                onClick={() => {
                  onSelectNeighborhood(n.id);
                  setActiveTab('neighborhoods');
                }}
                className="group relative h-96 rounded-xs overflow-hidden cursor-pointer border border-[#C9A96A]/30 shadow-xl"
              >
                <img
                  src={n.heroImage}
                  alt={n.name}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110 opacity-80"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#0D2226] via-[#0D2226]/40 to-transparent" />

                <div className="absolute bottom-6 left-6 right-6 space-y-2">
                  <span className="text-[10px] uppercase font-bold text-[#C9A96A] tracking-widest">
                    {n.county}
                  </span>
                  <h3 className="font-serif text-2xl font-bold text-[#FAF8F5]">
                    {n.name}
                  </h3>
                  <p className="text-xs text-[#FAF8F5]/80 line-clamp-2">
                    {n.tagline}
                  </p>
                  <div className="pt-2 text-xs font-bold uppercase tracking-wider text-[#C9A96A] flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                    <span>Explore Market Guide</span>
                    <ChevronRight className="w-4 h-4" />
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="text-center pt-4">
            <button
              onClick={() => setActiveTab('neighborhoods')}
              className="px-8 py-3.5 bg-[#C9A96A] hover:bg-[#D4AF37] text-[#0D2226] font-bold text-xs uppercase tracking-widest rounded-xs transition-colors"
            >
              View All Neighborhood Guides
            </button>
          </div>
        </div>
      </section>

      {/* 9. MARKET REPORTS CTA */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center bg-[#FAF8F5] border border-[#C9A96A]/30 p-8 sm:p-10 rounded-xs shadow-md">
          <div className="lg:col-span-8 space-y-2">
            <span className="text-xs font-bold uppercase tracking-widest text-[#0F5C63]">
              Stay Informed
            </span>
            <h2 className="font-serif text-2xl sm:text-3xl font-bold text-[#0D2226]">
              Weekly Market Reports for Carroll, Baltimore & Howard Counties
            </h2>
            <p className="text-sm text-[#1C2B2E]/70">
              Local pricing trends, inventory data, and straight talk — no fluff.
            </p>
          </div>
          <div className="lg:col-span-4 flex lg:justify-end">
            <button
              onClick={() => setActiveTab('market-report')}
              className="px-8 py-3.5 bg-[#0D2226] hover:bg-[#0F5C63] text-[#FAF8F5] font-bold text-xs uppercase tracking-widest rounded-xs shadow-md transition-all flex items-center gap-2"
            >
              <span>See Market Reports</span>
              <ArrowRight className="w-4 h-4 text-[#C9A96A]" />
            </button>
          </div>
        </div>
      </section>

      {/* 10. FINAL CONTACT CTA
          Note: a "Reviews" section was intentionally left out here - the
          mock data included three testimonials with named clients and
          specific dollar figures, but they're fabricated, not real reviews.
          Once you have real ones (Google/Zillow), this is the natural spot
          to add them back in. */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-[#0D2226] border border-[#C9A96A] text-[#FAF8F5] p-10 sm:p-14 rounded-xs text-center space-y-5 shadow-2xl">
          <ShieldCheck className="w-8 h-8 text-[#C9A96A] mx-auto" />
          <h2 className="font-serif text-3xl sm:text-4xl font-bold">
            Let's Talk Strategy — No Pressure, Just a Plan.
          </h2>
          <p className="text-sm text-[#A8B2A1] max-w-xl mx-auto">
            Whether you're buying, selling, or just curious what your options look like, Kyle will give you a straight answer.
          </p>
          <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-4">
            <button
              onClick={onOpenConsultation}
              className="px-8 py-4 bg-[#C9A96A] hover:bg-[#D4AF37] text-[#0D2226] font-bold text-xs uppercase tracking-widest rounded-xs shadow-lg flex items-center gap-2"
            >
              <Phone className="w-4 h-4" />
              <span>Schedule a Consultation</span>
            </button>
            <button
              onClick={() => setActiveTab('contact')}
              className="px-8 py-4 border border-[#C9A96A] text-[#C9A96A] font-bold text-xs uppercase tracking-widest rounded-xs hover:bg-[#C9A96A]/10 transition-colors"
            >
              Contact Kyle Directly
            </button>
          </div>
        </div>
      </section>

    </div>
  );
};
