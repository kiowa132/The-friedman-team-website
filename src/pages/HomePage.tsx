import React, { useState, useEffect } from 'react';
import { Listing, Neighborhood } from '../types';
import { ListingCard } from '../components/ListingCard';
import { ReviewsSection } from '../components/ReviewsSection';
import { usePageMeta } from '../lib/usePageMeta';
import { submitLead } from '../lib/leads';
import { fetchMlsListings } from '../lib/mlsApi';
import {
  ArrowRight, ShieldCheck, Calculator, Phone, Search
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
  usePageMeta(
    'The Friedman Team | Carroll & Baltimore County Realtor | Homes & Estates',
    'Buying or selling in Carroll, Howard, Frederick, or Baltimore County? The Friedman Team combines local expertise and data-driven pricing to get results. Homes, estates, and everything between.'
  );

  // Live Carroll County, $1M+ listings for the Featured Properties section -
  // real MLS data, not the static mock listings. Falls back to a friendly
  // "not configured" or "no matches right now" state rather than silently
  // showing nothing or fabricating listings.
  const [featuredListings, setFeaturedListings] = useState<Listing[]>([]);
  const [featuredStatus, setFeaturedStatus] = useState<'loading' | 'ok' | 'empty' | 'not_configured' | 'error'>('loading');

  useEffect(() => {
    let cancelled = false;
    (async () => {
      const result = await fetchMlsListings({ county: 'Carroll County', minPrice: 1000000, top: 3 });
      if (cancelled) return;
      if (result.status === 'ok') {
        setFeaturedListings(result.listings);
        setFeaturedStatus(result.listings.length > 0 ? 'ok' : 'empty');
      } else if (result.status === 'not_configured') {
        setFeaturedStatus('not_configured');
      } else {
        setFeaturedStatus('error');
      }
    })();
    return () => { cancelled = true; };
  }, []);

  const [worthAddress, setWorthAddress] = useState('');
  const [worthSubmitting, setWorthSubmitting] = useState(false);
  const [worthSubmitted, setWorthSubmitted] = useState(false);

  const [newsName, setNewsName] = useState('');
  const [newsEmail, setNewsEmail] = useState('');
  const [newsSubmitting, setNewsSubmitting] = useState(false);
  const [newsSubmitted, setNewsSubmitted] = useState(false);

  const handleWorthSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!worthAddress.trim()) return;
    setWorthSubmitting(true);
    await submitLead({
      name: 'Homepage Property Worth Lead',
      email: '',
      phone: '',
      type: 'Seller Inquiry',
      message: `Asked "What's your property worth?" for: ${worthAddress}`,
    });
    setWorthSubmitting(false);
    setWorthSubmitted(true);
    onOpenValuation();
  };

  const handleNewsletterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newsEmail.trim()) return;
    setNewsSubmitting(true);
    await submitLead({
      name: newsName || 'Newsletter Signup',
      email: newsEmail,
      phone: '',
      type: 'General Inquiry',
      message: 'Subscribed via homepage "Get Exclusive Access" newsletter form',
    });
    setNewsSubmitting(false);
    setNewsSubmitted(true);
  };

  const neighborhoodScrollItems = [...neighborhoods.slice(0, 4), ...neighborhoods.slice(0, 4)];

  return (
    <div className="pb-0">

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
            The Friedman Team helps buyers and sellers across Carroll, Howard, Frederick, and Baltimore County move with confidence - from first homes to estate properties - backed by real market data and a strategy built around your goals.
          </p>

          <div className="pt-6 flex flex-col sm:flex-row items-center justify-center gap-4">
            <button
              onClick={() => setActiveTab('listings')}
              id="hero-search-btn"
              className="w-full sm:w-auto px-8 py-4 bg-[#C9A96A] hover:bg-[#D4AF37] text-[#0D2226] font-bold text-xs uppercase tracking-[0.2em] rounded-xs shadow-2xl transition-all hover:scale-105 flex items-center justify-center gap-2"
            >
              <Search className="w-4 h-4" />
              <span>Start Your Search</span>
            </button>

            <button
              onClick={onOpenValuation}
              id="hero-valuation-btn"
              className="w-full sm:w-auto px-8 py-4 bg-[#0F5C63]/90 hover:bg-[#0F5C63] text-[#FAF8F5] font-bold text-xs uppercase tracking-[0.2em] border border-[#C9A96A]/60 rounded-xs shadow-2xl transition-all hover:scale-105 flex items-center justify-center gap-2 backdrop-blur-md"
            >
              <Calculator className="w-4 h-4 text-[#C9A96A]" />
              <span>Get Your Home's Value</span>
            </button>
          </div>

          <div className="pt-12 text-[10px] uppercase tracking-[0.3em] text-[#A8B2A1] flex items-center justify-center gap-2">
            <span>Carroll · Baltimore · Howard · Frederick County</span>
            <span className="w-1.5 h-1.5 rounded-full bg-[#C9A96A] animate-ping" />
          </div>
        </div>
      </section>

      {/* 2. DATA-DRIVEN REAL ESTATE SOLUTIONS - 3-tile grid, matches Canopy's
          exact pattern: three labeled photo tiles linking to Search, Valuation,
          and Contact. */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-24 text-center space-y-12">
        <div className="space-y-5">
          <h2 className="font-serif text-3xl sm:text-5xl font-light uppercase tracking-[0.15em] text-[#0D2226]">
            Data-Driven Real Estate Solutions
          </h2>
          <p className="text-sm sm:text-base text-[#1C2B2E]/70 max-w-2xl mx-auto leading-relaxed">
            Our team leverages real market data alongside hands-on local experience to guide buyers and sellers across Carroll, Howard, Frederick, and Baltimore County. Discover a smarter approach to real estate, where data-driven insight meets trusted expertise.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-1">
          <button
            onClick={() => setActiveTab('listings')}
            className="group relative aspect-[4/3] overflow-hidden"
          >
            <img
              src="https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=90"
              alt="Home Search"
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#0D2226]/70 via-[#0D2226]/10 to-transparent group-hover:from-[#0D2226]/80 transition-colors" />
            <span className="absolute bottom-5 left-5 text-white text-sm sm:text-base font-semibold uppercase tracking-widest">
              Home Search
            </span>
          </button>

          <button
            onClick={onOpenValuation}
            className="group relative aspect-[4/3] overflow-hidden"
          >
            <img
              src="https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&w=1200&q=90"
              alt="Home Valuation"
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#0D2226]/70 via-[#0D2226]/10 to-transparent group-hover:from-[#0D2226]/80 transition-colors" />
            <span className="absolute bottom-5 left-5 text-white text-sm sm:text-base font-semibold uppercase tracking-widest">
              Home Valuation
            </span>
          </button>

          <button
            onClick={() => setActiveTab('contact')}
            className="group relative aspect-[4/3] overflow-hidden"
          >
            <img
              src="https://images.unsplash.com/photo-1600880292203-757bb62b4baf?auto=format&fit=crop&w=1200&q=90"
              alt="Contact Us"
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#0D2226]/70 via-[#0D2226]/10 to-transparent group-hover:from-[#0D2226]/80 transition-colors" />
            <span className="absolute bottom-5 left-5 text-white text-sm sm:text-base font-semibold uppercase tracking-widest">
              Contact Us
            </span>
          </button>
        </div>

        {/* 3. AGENT INTRO STRIP - tan/beige, photo-left, matches Canopy's
            exact layout. */}
        <div className="grid grid-cols-1 sm:grid-cols-2 border border-[#C9A96A]/30 text-left sm:h-[560px]">
          <div className="h-64 sm:h-full overflow-hidden">
            <img
              src="/images/kyle-portrait.jpg"
              alt="Kyle Friedman"
              className="w-full h-full object-cover"
            />
          </div>
          <div className="bg-[#C9A96A]/20 p-10 sm:p-16 flex flex-col justify-center space-y-6">
            <h3 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold text-[#0D2226] leading-tight">
              The Friedman<br />Team at eXp Realty
            </h3>
            <p className="text-sm sm:text-base text-[#1C2B2E]/80 leading-relaxed">
              The Friedman Team at eXp Realty, led by Kyle Friedman, gives you access to a real, data-driven strategy for buying or selling - from your first home to a multi-acre property. Every client gets the same level of preparation and care.
            </p>
            <button
              onClick={() => setActiveTab('team')}
              className="self-start px-7 py-3.5 bg-[#0D2226] hover:bg-[#0F5C63] text-[#FAF8F5] font-bold text-xs uppercase tracking-widest rounded-xs transition-colors"
            >
              Meet the Team
            </button>
          </div>
        </div>
      </section>

      {/* 4. WHAT OUR CLIENTS SAY - full-bleed moody carousel, built into the
          component itself now. */}
      <ReviewsSection />

      {/* 5. FEATURED PROPERTIES - real live Carroll County $1M+ listings */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="flex flex-col md:flex-row items-start md:items-end justify-between gap-4 mb-10 pb-4 border-b border-[#C9A96A]/30">
          <div>
            <span className="text-xs font-bold uppercase tracking-widest text-[#0F5C63]">
              Carroll County, $1M+
            </span>
            <h2 className="font-serif text-3xl sm:text-4xl font-bold text-[#0D2226] mt-1">
              Featured Properties
            </h2>
          </div>

          <button
            onClick={() => setActiveTab('listings')}
            className="text-xs font-bold uppercase tracking-widest text-[#0F5C63] hover:text-[#C9A96A] flex items-center gap-1.5 transition-colors"
          >
            <span>View All</span>
            <ArrowRight className="w-4 h-4 text-[#C9A96A]" />
          </button>
        </div>

        {featuredStatus === 'loading' && (
          <div className="text-center py-12 text-sm text-[#1C2B2E]/60">Loading live listings...</div>
        )}

        {featuredStatus === 'ok' && (
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
        )}

        {featuredStatus === 'empty' && (
          <div className="text-center py-12 border border-[#C9A96A]/30 bg-[#FAF8F5]">
            <p className="text-sm text-[#1C2B2E]/70 mb-4">No Carroll County listings over $1M are currently live - check back soon, or search all live inventory now.</p>
            <button
              onClick={() => setActiveTab('listings')}
              className="px-6 py-3 bg-[#0D2226] text-[#FAF8F5] font-bold text-xs uppercase tracking-widest rounded-xs"
            >
              Search Live Listings
            </button>
          </div>
        )}

        {(featuredStatus === 'not_configured' || featuredStatus === 'error') && (
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

      {/* 6. WHAT'S YOUR PROPERTY WORTH? - banner over a repeating background,
          direct address input matching Canopy's exact widget pattern. */}
      <section className="relative py-24 overflow-hidden">
        <div className="absolute inset-0">
          <img
            src="https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=1600&q=80"
            alt=""
            className="w-full h-full object-cover opacity-30"
          />
          <div className="absolute inset-0 bg-[#FAF8F5]/70" />
        </div>
        <div className="relative max-w-2xl mx-auto px-4 text-center space-y-6">
          <h2 className="font-serif text-3xl sm:text-4xl font-bold text-[#0D2226] uppercase tracking-wide">
            What's Your Property Worth?
          </h2>
          {!worthSubmitted ? (
            <form onSubmit={handleWorthSubmit} className="flex flex-col sm:flex-row gap-3 max-w-lg mx-auto">
              <input
                type="text"
                required
                value={worthAddress}
                onChange={(e) => setWorthAddress(e.target.value)}
                placeholder="Enter your address"
                className="flex-1 bg-white border border-[#0D2226]/20 px-4 py-3.5 text-sm rounded-xs focus:outline-none focus:border-[#C9A96A]"
              />
              <button
                type="submit"
                disabled={worthSubmitting}
                className="px-8 py-3.5 bg-[#C9A96A] hover:bg-[#D4AF37] text-[#0D2226] font-bold text-xs uppercase tracking-widest rounded-xs shadow-lg transition-colors disabled:opacity-60"
              >
                {worthSubmitting ? 'Sending...' : 'Get Started'}
              </button>
            </form>
          ) : (
            <p className="text-sm text-[#0F5C63] font-semibold">
              Thanks! Kyle will follow up personally with a real comparative market analysis.
            </p>
          )}
        </div>
      </section>

      {/* 7. NEIGHBORHOODS - dark background, auto-scrolling strip matching
          Canopy's marquee pattern. */}
      <section className="bg-[#0D2226] text-[#FAF8F5] py-20 border-y border-[#C9A96A]/30">
        <div className="text-center mb-12 px-4">
          <span className="text-xs font-bold uppercase tracking-[0.25em] text-[#C9A96A]">
            Maryland Enclaves & Valleys
          </span>
          <h2 className="font-serif text-3xl sm:text-5xl font-bold text-[#FAF8F5] mt-2">
            Neighborhoods
          </h2>
        </div>

        <style>{`
          @keyframes neighborhood-scroll {
            from { transform: translateX(0); }
            to { transform: translateX(-50%); }
          }
          .neighborhood-track {
            animation: neighborhood-scroll 40s linear infinite;
          }
          .neighborhood-track:hover {
            animation-play-state: paused;
          }
        `}</style>
        <div className="overflow-hidden">
          <div className="flex neighborhood-track w-max gap-6 px-6">
            {neighborhoodScrollItems.map((n, i) => (
              <div
                key={`${n.id}-${i}`}
                onClick={() => {
                  onSelectNeighborhood(n.id);
                  setActiveTab('neighborhoods');
                }}
                className="group relative w-72 h-80 shrink-0 rounded-xs overflow-hidden cursor-pointer border border-[#C9A96A]/30 shadow-xl"
              >
                <img
                  src={n.heroImage}
                  alt={n.name}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110 opacity-80"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#0D2226] via-[#0D2226]/40 to-transparent" />
                <div className="absolute bottom-5 left-5 right-5 space-y-1">
                  <span className="text-[10px] uppercase font-bold text-[#C9A96A] tracking-widest">
                    {n.county}
                  </span>
                  <h3 className="font-serif text-xl font-bold text-[#FAF8F5]">
                    {n.name}
                  </h3>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="text-center pt-10">
          <button
            onClick={() => setActiveTab('neighborhoods')}
            className="px-8 py-3.5 bg-[#C9A96A] hover:bg-[#D4AF37] text-[#0D2226] font-bold text-xs uppercase tracking-widest rounded-xs transition-colors"
          >
            View All Neighborhoods
          </button>
        </div>
      </section>

      {/* 8. GET EXCLUSIVE ACCESS - newsletter, matches Canopy's opt-in
          consent pattern (standard for real estate lead-gen forms). */}
      <section className="bg-[#C9A96A]/25 py-16">
        <div className="max-w-xl mx-auto px-4 text-center space-y-5">
          <h2 className="font-serif text-2xl sm:text-3xl font-bold text-[#0D2226] uppercase tracking-wide">
            Get Exclusive Access
          </h2>
          <p className="text-xs sm:text-sm text-[#1C2B2E]/70">
            Don't let your dream home slip away. Subscribe today to receive curated listings, market updates, and insider tips straight to your inbox.
          </p>

          {!newsSubmitted ? (
            <form onSubmit={handleNewsletterSubmit} className="space-y-3">
              <div className="flex flex-col sm:flex-row gap-3">
                <input
                  type="text"
                  value={newsName}
                  onChange={(e) => setNewsName(e.target.value)}
                  placeholder="Name"
                  className="flex-1 bg-white border border-[#0D2226]/20 px-4 py-3 text-sm rounded-xs focus:outline-none focus:border-[#C9A96A]"
                />
                <input
                  type="email"
                  required
                  value={newsEmail}
                  onChange={(e) => setNewsEmail(e.target.value)}
                  placeholder="Email"
                  className="flex-1 bg-white border border-[#0D2226]/20 px-4 py-3 text-sm rounded-xs focus:outline-none focus:border-[#C9A96A]"
                />
                <button
                  type="submit"
                  disabled={newsSubmitting}
                  className="px-6 py-3 bg-[#0D2226] hover:bg-[#0F5C63] text-[#FAF8F5] font-bold text-xs uppercase tracking-widest rounded-xs transition-colors disabled:opacity-60"
                >
                  {newsSubmitting ? '...' : 'Submit'}
                </button>
              </div>
              <p className="text-[10px] text-[#1C2B2E]/60 leading-relaxed">
                I agree to be contacted by Kyle Friedman via call, email, and text for real estate services. To opt out, you can reply "stop" at any time or reply "help" for assistance. Message and data rates may apply. Message frequency may vary.
              </p>
            </form>
          ) : (
            <p className="text-sm text-[#0F5C63] font-semibold">You're subscribed! Watch your inbox for The Friedman Report.</p>
          )}
        </div>
      </section>

      {/* 9. YOUR JOURNEY STARTS HERE - closing CTA over a photo */}
      <section className="relative py-28 overflow-hidden">
        <div className="absolute inset-0">
          <img
            src="https://images.unsplash.com/photo-1600566753086-00f18fb6b3ea?auto=format&fit=crop&w=1600&q=80"
            alt=""
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-[#0D2226]/70" />
        </div>
        <div className="relative max-w-2xl mx-auto px-4 text-center space-y-6">
          <h2 className="font-serif text-3xl sm:text-5xl font-bold text-[#FAF8F5] uppercase tracking-wide">
            Your Journey Starts Here
          </h2>
          <p className="text-sm text-[#F5F1E8]/90 max-w-md mx-auto leading-relaxed">
            Collaboration is at the heart of everything we do. By working together, we bring clarity, strategy, and precision to your home journey.
          </p>
          <button
            onClick={onOpenConsultation}
            className="px-8 py-4 bg-[#C9A96A] hover:bg-[#D4AF37] text-[#0D2226] font-bold text-xs uppercase tracking-widest rounded-xs shadow-lg transition-colors flex items-center gap-2 mx-auto"
          >
            <Phone className="w-4 h-4" />
            Reach Out Today
          </button>
        </div>
      </section>

    </div>
  );
};
