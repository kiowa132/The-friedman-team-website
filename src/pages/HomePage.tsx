import React from 'react';
import { Listing, Neighborhood } from '../types';
import { ListingCard } from '../components/ListingCard';
import { ArrowRight, ShieldCheck, Award, TrendingUp, Compass, Calculator, Calendar, Phone, CheckCircle2, ChevronRight, MapPin, Sparkles } from 'lucide-react';

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
  onSelectNeighborhood
}) => {
  const featuredListings = listings.filter((l) => l.featured).slice(0, 3);

  return (
    <div className="space-y-24 pb-20">
      
      {/* 1. HERO SECTION */}
      <section className="relative h-screen min-h-[700px] w-full overflow-hidden flex items-center justify-center text-[#FAF8F5]">
        
        {/* Background Image with Slow Kenburns Zoom Animation */}
        <div className="absolute inset-0 bg-[#0D2226]">
          <img
            src="https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=2000&q=80"
            alt="Maryland Luxury Estate - The Friedman Team"
            className="w-full h-full object-cover animate-kenburns opacity-70"
          />
          {/* Editorial Dark Gradient Overlays */}
          <div className="absolute inset-0 bg-gradient-to-t from-[#0D2226] via-[#0D2226]/40 to-[#0D2226]/60" />
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-transparent via-[#0D2226]/30 to-[#0D2226]" />
        </div>

        {/* Hero Overlay Content */}
        <div className="relative z-10 max-w-5xl mx-auto px-4 text-center space-y-6 pt-20">
          
          {/* Eyebrow Label */}
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#0D2226]/80 backdrop-blur-md border border-[#C9A96A]/50 text-[#C9A96A] text-xs uppercase tracking-[0.25em] font-semibold animate-fadeIn">
            <ShieldCheck className="w-4 h-4 text-[#C9A96A]" />
            <span>The Friedman Team • eXp Realty</span>
          </div>

          {/* Headline */}
          <div className="space-y-3">
            <h2 className="text-xs sm:text-sm uppercase tracking-[0.35em] text-[#C9A96A] font-bold">
              The Friedman Team
            </h2>
            <h1 className="font-serif text-4xl sm:text-6xl md:text-7xl lg:text-8xl font-bold tracking-tight text-[#FAF8F5] leading-none">
              More Than a Listing.<br />
              <span className="italic font-normal gold-gradient-text">A Strategy.</span>
            </h1>
          </div>

          {/* Subheadline */}
          <p className="max-w-2xl mx-auto text-sm sm:text-base md:text-lg text-[#F5F1E8]/90 font-light leading-relaxed">
            Strategic real estate representation for Maryland homeowners who expect exceptional results. Specializing in luxury homes, farms, estates, and distinctive properties in Carroll, Baltimore, and Howard counties.
          </p>

          {/* Action Buttons */}
          <div className="pt-6 flex flex-col sm:flex-row items-center justify-center gap-4">
            <button
              onClick={onOpenValuation}
              id="hero-valuation-btn"
              className="w-full sm:w-auto px-8 py-4 bg-[#C9A96A] hover:bg-[#D4AF37] text-[#0D2226] font-bold text-xs uppercase tracking-[0.2em] rounded-xs shadow-2xl transition-all hover:scale-105 flex items-center justify-center gap-2"
            >
              <Calculator className="w-4 h-4" />
              <span>Discover Your Home Value</span>
            </button>

            <button
              onClick={onOpenConsultation}
              id="hero-consult-btn"
              className="w-full sm:w-auto px-8 py-4 bg-[#0F5C63]/90 hover:bg-[#0F5C63] text-[#FAF8F5] font-bold text-xs uppercase tracking-[0.2em] border border-[#C9A96A]/60 rounded-xs shadow-2xl transition-all hover:scale-105 flex items-center justify-center gap-2 backdrop-blur-md"
            >
              <Phone className="w-4 h-4 text-[#C9A96A]" />
              <span>Schedule a Consultation</span>
            </button>
          </div>

          {/* Scroll Down Indicator */}
          <div className="pt-12 text-[10px] uppercase tracking-[0.3em] text-[#A8B2A1] flex items-center justify-center gap-2">
            <span>Explore Maryland Luxury Estates</span>
            <span className="w-1.5 h-1.5 rounded-full bg-[#C9A96A] animate-ping" />
          </div>

        </div>

      </section>

      {/* 2. AUTHORITY PROOF STRIP */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-12 relative z-20">
        <div className="bg-[#0D2226] border border-[#C9A96A]/40 text-[#FAF8F5] p-8 rounded-xs shadow-2xl grid grid-cols-2 lg:grid-cols-4 gap-6 text-center">
          <div>
            <div className="text-3xl sm:text-4xl font-serif font-bold text-[#C9A96A]">$150M+</div>
            <div className="text-[11px] uppercase tracking-wider text-[#A8B2A1] mt-1">Career Sales Volume</div>
          </div>
          <div className="border-l border-[#FAF8F5]/10">
            <div className="text-3xl sm:text-4xl font-serif font-bold text-[#C9A96A]">99.4%</div>
            <div className="text-[11px] uppercase tracking-wider text-[#A8B2A1] mt-1">List-to-Sale Ratio</div>
          </div>
          <div className="border-l border-[#FAF8F5]/10">
            <div className="text-3xl sm:text-4xl font-serif font-bold text-[#C9A96A]">14 Days</div>
            <div className="text-[11px] uppercase tracking-wider text-[#A8B2A1] mt-1">Avg Days On Market</div>
          </div>
          <div className="border-l border-[#FAF8F5]/10">
            <div className="text-3xl sm:text-4xl font-serif font-bold text-[#C9A96A]">Top 1%</div>
            <div className="text-[11px] uppercase tracking-wider text-[#A8B2A1] mt-1">eXp Realty Advisory</div>
          </div>
        </div>
      </section>

      {/* 3. STRATEGIC POSITIONING SECTION */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          <div className="lg:col-span-6 space-y-6">
            <div className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-[#0F5C63]">
              <TrendingUp className="w-4 h-4 text-[#C9A96A]" />
              <span>Old Money Luxury • Unmatched Strategy</span>
            </div>

            <h2 className="font-serif text-3xl sm:text-5xl font-bold text-[#0D2226] leading-tight">
              The Difference Between Listing a Home and Selling It Strategically.
            </h2>

            <p className="text-sm sm:text-base text-[#1C2B2E]/80 leading-relaxed font-normal">
              In Maryland’s premier markets—from Green Spring Valley in Baltimore County to the equestrian compounds of Carroll County and modern sanctuaries in Howard County—exceptional properties require far more than standard MLS entry.
            </p>

            <div className="space-y-3 pt-2">
              <div className="flex items-start gap-3 p-3 bg-[#FAF8F5] border-l-2 border-[#C9A96A] shadow-sm">
                <CheckCircle2 className="w-5 h-5 text-[#0F5C63] shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-serif font-bold text-[#0D2226] text-base">Targeted High-Net-Worth Placement</h4>
                  <p className="text-xs text-[#1C2B2E]/70 mt-0.5">Discreet exposure to pre-vetted private capital networks before public broadcast.</p>
                </div>
              </div>

              <div className="flex items-start gap-3 p-3 bg-[#FAF8F5] border-l-2 border-[#C9A96A] shadow-sm">
                <CheckCircle2 className="w-5 h-5 text-[#0F5C63] shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-serif font-bold text-[#0D2226] text-base">Equestrian & Agricultural Expertise</h4>
                  <p className="text-xs text-[#1C2B2E]/70 mt-0.5">Specialized marketing for farms, preserved land, and tax easement advantages.</p>
                </div>
              </div>

              <div className="flex items-start gap-3 p-3 bg-[#FAF8F5] border-l-2 border-[#C9A96A] shadow-sm">
                <CheckCircle2 className="w-5 h-5 text-[#0F5C63] shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-serif font-bold text-[#0D2226] text-base">Fiduciary Negotiation Protection</h4>
                  <p className="text-xs text-[#1C2B2E]/70 mt-0.5">Relentless advocacy focused on protecting equity, timeline, and confidentiality.</p>
                </div>
              </div>
            </div>

            <div className="pt-4 flex items-center gap-4">
              <button
                onClick={() => setActiveTab('sell')}
                className="px-6 py-3.5 bg-[#0F5C63] hover:bg-[#0D2226] text-[#FAF8F5] font-bold text-xs uppercase tracking-wider rounded-xs transition-colors shadow-md flex items-center gap-2"
              >
                <span>Learn Seller Strategy</span>
                <ArrowRight className="w-4 h-4 text-[#C9A96A]" />
              </button>
              <button
                onClick={() => setActiveTab('about')}
                className="text-xs font-bold uppercase tracking-wider text-[#0D2226] hover:text-[#C9A96A] border-b border-[#0D2226] pb-1 transition-colors"
              >
                Meet Kyle Friedman
              </button>
            </div>

          </div>

          <div className="lg:col-span-6 relative">
            <div className="relative rounded-xs overflow-hidden shadow-2xl border-4 border-[#FAF8F5]">
              <img
                src="https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80"
                alt="Maryland Luxury Residence"
                className="w-full h-[500px] object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#0D2226]/80 via-transparent to-transparent" />
              
              <div className="absolute bottom-6 left-6 right-6 p-6 bg-[#0D2226]/90 backdrop-blur-md border border-[#C9A96A]/40 text-[#FAF8F5] rounded-xs">
                <div className="text-xs uppercase tracking-widest text-[#C9A96A] font-bold">
                  Featured Strategic Sale Case Study
                </div>
                <div className="font-serif text-2xl font-bold mt-1">
                  $3,850,000 • Green Spring Valley Estate
                </div>
                <p className="text-xs text-[#A8B2A1] mt-1">
                  Placed off-market in 11 days via Kyle Friedman’s high-net-worth private network.
                </p>
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* 4. FEATURED MARYLAND LUXURY LISTINGS */}
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
            <span>View All Properties ({listings.length})</span>
            <ArrowRight className="w-4 h-4 text-[#C9A96A]" />
          </button>
        </div>

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
      </section>

      {/* 5. LUXURY NEIGHBORHOOD ENCLAVES */}
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
              Deep local roots across Carroll County, Baltimore County, and Howard County’s most prestigious communities.
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
              View All 8 Neighborhood Guides
            </button>
          </div>

        </div>
      </section>

      {/* 6. COMPLIMENTARY HOME VALUATION BANNER */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-gradient-to-r from-[#0F5C63] via-[#0D2226] to-[#0F5C63] text-[#FAF8F5] border border-[#C9A96A]/50 p-8 sm:p-12 rounded-xs shadow-2xl relative overflow-hidden">
          
          <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            <div className="lg:col-span-8 space-y-4">
              <span className="text-xs font-bold uppercase tracking-widest text-[#C9A96A] bg-[#0D2226] px-3 py-1 border border-[#C9A96A]/30">
                Direct Fiduciary Appraisal
              </span>
              <h2 className="font-serif text-3xl sm:text-4xl font-bold">
                Curious About Your Property’s Current Strategic Value?
              </h2>
              <p className="text-sm text-[#FAF8F5]/90 max-w-2xl leading-relaxed">
                Receive an algorithmic instant equity estimate alongside a personalized strategic market valuation report from Kyle Friedman.
              </p>
            </div>

            <div className="lg:col-span-4 flex justify-start lg:justify-end">
              <button
                onClick={onOpenValuation}
                id="valuation-banner-btn"
                className="px-8 py-4 bg-[#C9A96A] hover:bg-[#D4AF37] text-[#0D2226] font-bold text-xs uppercase tracking-widest rounded-xs shadow-xl transition-all hover:scale-105 flex items-center gap-2"
              >
                <Calculator className="w-4 h-4" />
                <span>Calculate Your Home Value</span>
              </button>
            </div>
          </div>

        </div>
      </section>

      {/* 7. KYLE FRIEDMAN BIOGRAPHY & AUTHORITY SUMMARY */}
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
                  Principal Luxury Advisor • eXp Realty
                </div>
              </div>
            </div>
          </div>

          <div className="lg:col-span-7 space-y-6">
            <span className="text-xs font-bold uppercase tracking-widest text-[#0F5C63]">
              Meet Your Agent
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

    </div>
  );
};
