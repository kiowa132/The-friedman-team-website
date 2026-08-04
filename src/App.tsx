import React, { useState, useEffect } from 'react';
import { Routes, Route, useNavigate, useLocation } from 'react-router-dom';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { ListingDetailPage } from './pages/ListingDetailPage';
import { HomeValuationModal } from './components/HomeValuationModal';
import { StrategyConsultationModal } from './components/StrategyConsultationModal';
import { SEOMetaDrawer } from './components/SEOMetaDrawer';

import { HomePage } from './pages/HomePage';
import { AboutPage } from './pages/AboutPage';
import { SellPage } from './pages/SellPage';
import { BuyersPage } from './pages/BuyersPage';
import { NeighborhoodsPage } from './pages/NeighborhoodsPage';
import { NeighborhoodDetailPage } from './pages/NeighborhoodDetailPage';
import { ListingsPage } from './pages/ListingsPage';
import { ContactPage } from './pages/ContactPage';
import { BlogListPage } from './pages/BlogListPage';
import { BlogPostPage } from './pages/BlogPostPage';
import { GuidesListPage } from './pages/GuidesListPage';
import { LuxuryPage } from './pages/LuxuryPage';
import { TeamPage } from './pages/TeamPage';
import { GivingBackPage } from './pages/GivingBackPage';
import { SellerProcessPage } from './pages/SellerProcessPage';
import { GuideDetailPage } from './pages/GuideDetailPage';

import { FEATURED_LISTINGS, NEIGHBORHOODS } from './data/mockData';
import { Listing } from './types';

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
  '/team': 'team',
  '/giving-back': 'giving-back',
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
  team: '/team',
  'giving-back': '/giving-back',
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
            <ListingDetailPage
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

          <Route path="/team" element={
            <TeamPage
              onOpenConsultation={() => setIsConsultationOpen(true)}
            />
          } />

          <Route path="/giving-back" element={
            <GivingBackPage />
          } />
        </Routes>
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

      <SEOMetaDrawer />

    </div>
  );
}
