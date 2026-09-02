import React, { useState, useEffect, Suspense } from 'react';
import { Routes, Route, useNavigate, useLocation } from 'react-router-dom';
import { AnimatePresence, LazyMotion, m, MotionConfig } from 'motion/react';

// Loads the actual animation engine as its own separate chunk, in parallel
// with everything else, instead of bundling it into the main entry file.
// Until it resolves, m.* components just render as plain elements - no
// blocked paint, no layout shift.
const loadMotionFeatures = () => import('./lib/motionFeatures').then((res) => res.default);
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { HomeValuationModal } from './components/HomeValuationModal';
import { StrategyConsultationModal } from './components/StrategyConsultationModal';
import { FloatingContactButton } from './components/FloatingContactButton';
import { fade } from './lib/motion';

import { HomePage } from './pages/HomePage';

import { FEATURED_LISTINGS, NEIGHBORHOODS } from './data/mockData';
import { Listing } from './types';


// Route-level code splitting - each page's JS only downloads when someone
// actually navigates to it, instead of every page shipping in one bundle.
// /listings/:mlsNumber serves both hand-curated "sign listing" pages
// (e.g. /listings/listing-1, /listings/active) and live MLS-number pages;
// ListingRouteSwitch picks which, and lazy-loads the heavy MLS page only
// when the URL isn't a curated slug.
const ListingRouteSwitch = React.lazy(() => import('./pages/ListingRouteSwitch').then(m => ({ default: m.ListingRouteSwitch })));
const AboutPage = React.lazy(() => import('./pages/AboutPage').then(m => ({ default: m.AboutPage })));
const SellPage = React.lazy(() => import('./pages/SellPage').then(m => ({ default: m.SellPage })));
const BuyersPage = React.lazy(() => import('./pages/BuyersPage').then(m => ({ default: m.BuyersPage })));
const NeighborhoodsPage = React.lazy(() => import('./pages/NeighborhoodsPage').then(m => ({ default: m.NeighborhoodsPage })));
const NeighborhoodDetailPage = React.lazy(() => import('./pages/NeighborhoodDetailPage').then(m => ({ default: m.NeighborhoodDetailPage })));
const ListingsPage = React.lazy(() => import('./pages/ListingsPage').then(m => ({ default: m.ListingsPage })));
const ContactPage = React.lazy(() => import('./pages/ContactPage').then(m => ({ default: m.ContactPage })));
const BlogListPage = React.lazy(() => import('./pages/BlogListPage').then(m => ({ default: m.BlogListPage })));
const BlogPostPage = React.lazy(() => import('./pages/BlogPostPage').then(m => ({ default: m.BlogPostPage })));
const GuidesListPage = React.lazy(() => import('./pages/GuidesListPage').then(m => ({ default: m.GuidesListPage })));
const LuxuryPage = React.lazy(() => import('./pages/LuxuryPage').then(m => ({ default: m.LuxuryPage })));
const ZillowShowcasePage = React.lazy(() => import('./pages/ZillowShowcasePage').then(m => ({ default: m.ZillowShowcasePage })));
const SeniorRelocationPage = React.lazy(() => import('./pages/SeniorRelocationPage').then(m => ({ default: m.SeniorRelocationPage })));
const NetworkLandingPage = React.lazy(() => import('./pages/NetworkLandingPage').then(m => ({ default: m.NetworkLandingPage })));
const NetworkDirectoryPage = React.lazy(() => import('./pages/NetworkDirectoryPage').then(m => ({ default: m.NetworkDirectoryPage })));
const NetworkMemberProfilePage = React.lazy(() => import('./pages/NetworkMemberProfilePage').then(m => ({ default: m.NetworkMemberProfilePage })));
const NetworkJoinPage = React.lazy(() => import('./pages/NetworkJoinPage').then(m => ({ default: m.NetworkJoinPage })));
const NetworkAboutPage = React.lazy(() => import('./pages/NetworkAboutPage').then(m => ({ default: m.NetworkAboutPage })));
const NetworkEventsPage = React.lazy(() => import('./pages/NetworkEventsPage').then(m => ({ default: m.NetworkEventsPage })));
const TeamPage = React.lazy(() => import('./pages/TeamPage').then(m => ({ default: m.TeamPage })));
const TestimonialsPage = React.lazy(() => import('./pages/TestimonialsPage').then(m => ({ default: m.TestimonialsPage })));
const GivingBackPage = React.lazy(() => import('./pages/GivingBackPage').then(m => ({ default: m.GivingBackPage })));
const PrivacyPolicyPage = React.lazy(() => import('./pages/PrivacyPolicyPage').then(m => ({ default: m.PrivacyPolicyPage })));
const TermsOfUsePage = React.lazy(() => import('./pages/TermsOfUsePage').then(m => ({ default: m.TermsOfUsePage })));
const CalculatorsPage = React.lazy(() => import('./pages/CalculatorsPage').then(m => ({ default: m.CalculatorsPage })));
const MortgageCalculatorPage = React.lazy(() => import('./pages/MortgageCalculatorPage').then(m => ({ default: m.MortgageCalculatorPage })));
const AffordabilityCalculatorPage = React.lazy(() => import('./pages/AffordabilityCalculatorPage').then(m => ({ default: m.AffordabilityCalculatorPage })));
const NetProceedsCalculatorPage = React.lazy(() => import('./pages/NetProceedsCalculatorPage').then(m => ({ default: m.NetProceedsCalculatorPage })));
const PastTransactionsPage = React.lazy(() => import('./pages/PastTransactionsPage').then(m => ({ default: m.PastTransactionsPage })));
const TransactionDetailPage = React.lazy(() => import('./pages/TransactionDetailPage').then(m => ({ default: m.TransactionDetailPage })));
const VideosPage = React.lazy(() => import('./pages/VideosPage').then(m => ({ default: m.VideosPage })));
const FinancingOptionsPage = React.lazy(() => import('./pages/FinancingOptionsPage').then(m => ({ default: m.FinancingOptionsPage })));
const SellerProcessPage = React.lazy(() => import('./pages/SellerProcessPage').then(m => ({ default: m.SellerProcessPage })));
const GuideDetailPage = React.lazy(() => import('./pages/GuideDetailPage').then(m => ({ default: m.GuideDetailPage })));
const MailingListPage = React.lazy(() => import('./pages/MailingListPage').then(m => ({ default: m.MailingListPage })));

// Maps a URL path to the tab name every existing page component already
// expects (e.g. "/about" -> "about"). This lets every page keep using the
// exact same activeTab/setActiveTab props they always have - only the
// underlying navigation mechanism changed (real URLs instead of state).
const PATH_TO_TAB: Record<string, string> = {
  '/': 'home',
  '/about': 'about',
  '/sell': 'sell',
  '/sell/marketing-strategy': 'sell',
  '/buy': 'buy',
  '/neighborhoods': 'neighborhoods',
  '/listings': 'listings',
  '/contact': 'contact',
  '/blog': 'blog',
  '/guides': 'guides',
  '/luxury': 'luxury',
  '/zillow-showcase': 'zillow-showcase',
  '/senior-relocation': 'senior-relocation',
  '/network': 'network',
  '/network/directory': 'network-directory',
  '/network/join': 'network-join',
  '/network/about': 'network-about',
  '/network/events': 'network-events',
  '/team': 'team',
  '/testimonials': 'testimonials',
  '/giving-back': 'giving-back',
  '/privacy-policy': 'privacy-policy',
  '/terms-of-use': 'terms-of-use',
  '/calculators': 'calculators',
  '/calculators/mortgage': 'calculators-mortgage',
  '/calculators/affordability': 'calculators-affordability',
  '/calculators/net-proceeds': 'calculators-net-proceeds',
  '/past-transactions': 'past-transactions',
  '/videos': 'videos',
  '/financing-options': 'financing-options',
};

const TAB_TO_PATH: Record<string, string> = {
  home: '/',
  about: '/about',
  sell: '/sell',
  buy: '/buy',
  neighborhoods: '/neighborhoods',
  listings: '/listings',
  contact: '/contact',
  blog: '/blog',
  guides: '/guides',
  luxury: '/luxury',
  'zillow-showcase': '/zillow-showcase',
  'senior-relocation': '/senior-relocation',
  'network': '/network',
  'network-directory': '/network/directory',
  'network-join': '/network/join',
  'network-about': '/network/about',
  'network-events': '/network/events',
  team: '/team',
  testimonials: '/testimonials',
  'giving-back': '/giving-back',
  'privacy-policy': '/privacy-policy',
  'terms-of-use': '/terms-of-use',
  'calculators': '/calculators',
  'calculators-mortgage': '/calculators/mortgage',
  'calculators-affordability': '/calculators/affordability',
  'calculators-net-proceeds': '/calculators/net-proceeds',
  'past-transactions': '/past-transactions',
  'videos': '/videos',
  'financing-options': '/financing-options',
};

export default function App() {
  const navigate = useNavigate();
  const location = useLocation();
  const activeTab = location.pathname.startsWith('/listings/')
    ? 'listings'
    : location.pathname.startsWith('/neighborhoods/')
    ? 'neighborhoods'
    : PATH_TO_TAB[location.pathname] || 'home';

  // Scrolls to top on every route change, regardless of how navigation
  // happened - a setActiveTab() button, a direct <Link>, or the browser's
  // back/forward buttons. This is the one place that needs to handle it;
  // individual buttons and links don't need their own scrollTo calls
  // anymore, and can't forget to include one.
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location.pathname]);

  // Same function signature every page already used with local state -
  // now it navigates to a real URL instead. No page component needed to change.
  const setActiveTab = (tab: string) => {
    navigate(TAB_TO_PATH[tab] || '/');
  };

  const [savedListings, setSavedListings] = useState<string[]>(() => {
    try {
      const stored = localStorage.getItem('friedman_saved_listings');
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  });

  const [isValuationOpen, setIsValuationOpen] = useState(false);
  const [isConsultationOpen, setIsConsultationOpen] = useState(false);

  const handleToggleSave = (id: string) => {
    setSavedListings((prev) => {
      const updated = prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id];
      try {
        localStorage.setItem('friedman_saved_listings', JSON.stringify(updated));
      } catch (e) {
        console.error(e);
      }
      return updated;
    });
  };

  const handleScheduleShowing = (listing: Listing) => {
    navigate(`/listings/${encodeURIComponent(listing.mlsNumber || listing.id)}`, { state: { listing } });
  };

  return (
    // reducedMotion="user" makes every motion.* component site-wide
    // automatically honor the OS-level "reduce motion" accessibility
    // setting - no per-component opt-in needed.
    <LazyMotion features={loadMotionFeatures} strict>
    <MotionConfig reducedMotion="user">
    <div className="min-h-screen bg-[#F5F1E8] text-[#1C2B2E] font-sans flex flex-col justify-between selection:bg-[#C9A96A] selection:text-[#0D2226]">

      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        savedCount={savedListings.length}
        onOpenValuation={() => setIsValuationOpen(true)}
        onOpenConsultation={() => setIsConsultationOpen(true)}
        onSelectNeighborhood={() => navigate('/neighborhoods')}
      />

      <main className="flex-1">
        {/* Soft crossfade between pages instead of a hard cut. Keyed by
            pathname so AnimatePresence knows a "different page" mounted;
            mode="wait" fades the old page fully out before the new one
            fades in, so nothing ever overlaps or jumps. */}
        <AnimatePresence mode="wait" initial={false}>
        <m.div
          key={location.pathname}
          initial="hidden"
          animate="visible"
          exit="exit"
          variants={fade}
        >
        <Suspense fallback={
          <div className="min-h-screen flex items-center justify-center bg-[#FAF8F5]">
            <div className="w-10 h-10 border-2 border-[#C9A96A] border-t-transparent rounded-full animate-spin" />
          </div>
        }>
        <Routes>
          <Route path="/" element={
            <HomePage
              listings={FEATURED_LISTINGS}
              neighborhoods={NEIGHBORHOODS}
              savedListings={savedListings}
              onToggleSave={handleToggleSave}
              onSelectListing={(l) => navigate(`/listings/${encodeURIComponent(l.mlsNumber || l.id)}`, { state: { listing: l } })}
              onScheduleShowing={handleScheduleShowing}
              onOpenValuation={() => setIsValuationOpen(true)}
              onOpenConsultation={() => setIsConsultationOpen(true)}
              setActiveTab={setActiveTab}
              onSelectNeighborhood={() => navigate('/neighborhoods')}
            />
          } />

          <Route path="/about" element={
            <AboutPage
              onOpenConsultation={() => setIsConsultationOpen(true)}
              setActiveTab={setActiveTab}
            />
          } />

          <Route path="/sell" element={
            <SellPage
              onOpenValuation={() => setIsValuationOpen(true)}
              onOpenConsultation={() => setIsConsultationOpen(true)}
            />
          } />

          <Route path="/sell/marketing-strategy" element={
            <SellerProcessPage
              onOpenValuation={() => setIsValuationOpen(true)}
              onOpenConsultation={() => setIsConsultationOpen(true)}
            />
          } />

          <Route path="/buy" element={
            <BuyersPage
              onOpenConsultation={() => setIsConsultationOpen(true)}
              setActiveTab={setActiveTab}
            />
          } />

          <Route path="/neighborhoods" element={
            <NeighborhoodsPage
              onOpenConsultation={() => setIsConsultationOpen(true)}
            />
          } />

          <Route path="/neighborhoods/:slug" element={
            <NeighborhoodDetailPage
              savedListings={savedListings}
              onToggleSave={handleToggleSave}
              onScheduleShowing={handleScheduleShowing}
              onOpenConsultation={() => setIsConsultationOpen(true)}
            />
          } />

          <Route path="/listings" element={
            <ListingsPage
              savedListings={savedListings}
              onToggleSave={handleToggleSave}
              onSelectListing={(l) => navigate(`/listings/${encodeURIComponent(l.mlsNumber || l.id)}`, { state: { listing: l } })}
              onScheduleShowing={handleScheduleShowing}
              onOpenConsultation={() => setIsConsultationOpen(true)}
            />
          } />

          <Route path="/listings/:mlsNumber" element={
            <ListingRouteSwitch
              savedListings={savedListings}
              onToggleSave={handleToggleSave}
              onScheduleShowing={handleScheduleShowing}
            />
          } />

          <Route path="/contact" element={
            <ContactPage
              onOpenValuation={() => setIsValuationOpen(true)}
            />
          } />

          {/* Blog - The Friedman Report, now with real per-post URLs */}
          <Route path="/blog" element={
            <BlogListPage setActiveTab={setActiveTab} />
          } />
          <Route path="/blog/:slug" element={
            <BlogPostPage
              onOpenConsultation={() => setIsConsultationOpen(true)}
              onOpenValuation={() => setIsValuationOpen(true)}
            />
          } />

          {/* Guides - gated lead-magnet downloads tied to Follow Up Boss */}
          <Route path="/guides" element={
            <GuidesListPage />
          } />
          <Route path="/guides/:slug" element={
            <GuideDetailPage />
          } />

          <Route path="/luxury" element={
            <LuxuryPage
              onOpenConsultation={() => setIsConsultationOpen(true)}
            />
          } />

          <Route path="/zillow-showcase" element={
            <ZillowShowcasePage
              onOpenConsultation={() => setIsConsultationOpen(true)}
            />
          } />

          <Route path="/senior-relocation" element={
            <SeniorRelocationPage
              onOpenConsultation={() => setIsConsultationOpen(true)}
            />
          } />

          <Route path="/network" element={<NetworkLandingPage />} />
          <Route path="/network/directory" element={<NetworkDirectoryPage />} />
          <Route path="/network/members/:slug" element={<NetworkMemberProfilePage />} />
          <Route path="/network/join" element={<NetworkJoinPage />} />
          <Route path="/network/about" element={<NetworkAboutPage />} />
          <Route path="/network/events" element={<NetworkEventsPage />} />

          <Route path="/team" element={
            <TeamPage
              onOpenConsultation={() => setIsConsultationOpen(true)}
            />
          } />

          <Route path="/testimonials" element={
            <TestimonialsPage
              onOpenConsultation={() => setIsConsultationOpen(true)}
            />
          } />

          <Route path="/giving-back" element={
            <GivingBackPage />
          } />

          <Route path="/privacy-policy" element={
            <PrivacyPolicyPage />
          } />

          <Route path="/terms-of-use" element={
            <TermsOfUsePage />
          } />

          <Route path="/calculators" element={
            <CalculatorsPage />
          } />

          <Route path="/calculators/mortgage" element={
            <MortgageCalculatorPage onOpenConsultation={() => setIsConsultationOpen(true)} />
          } />

          <Route path="/calculators/affordability" element={
            <AffordabilityCalculatorPage onOpenConsultation={() => setIsConsultationOpen(true)} />
          } />

          <Route path="/calculators/net-proceeds" element={
            <NetProceedsCalculatorPage onOpenConsultation={() => setIsConsultationOpen(true)} />
          } />

          <Route path="/past-transactions" element={
            <PastTransactionsPage onOpenConsultation={() => setIsConsultationOpen(true)} />
          } />

          <Route path="/transactions/:slug" element={
            <TransactionDetailPage onOpenConsultation={() => setIsConsultationOpen(true)} />
          } />

          <Route path="/videos" element={
            <VideosPage />
          } />

          <Route path="/financing-options" element={
            <FinancingOptionsPage onOpenConsultation={() => setIsConsultationOpen(true)} />
          } />

          <Route path="/mailing-list" element={<MailingListPage />} />
        </Routes>
        </Suspense>
        </m.div>
        </AnimatePresence>
      </main>

      <Footer
        setActiveTab={setActiveTab}
        onOpenValuation={() => setIsValuationOpen(true)}
        onOpenConsultation={() => setIsConsultationOpen(true)}
      />

      <HomeValuationModal
        isOpen={isValuationOpen}
        onClose={() => setIsValuationOpen(false)}
        onSelectConsultation={() => {
          setIsValuationOpen(false);
          setIsConsultationOpen(true);
        }}
      />

      <StrategyConsultationModal
        isOpen={isConsultationOpen}
        onClose={() => setIsConsultationOpen(false)}
      />

      <FloatingContactButton onOpenConsultation={() => setIsConsultationOpen(true)} />

    </div>
    </MotionConfig>
    </LazyMotion>
  );
}
