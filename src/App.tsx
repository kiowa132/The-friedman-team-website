import React, { useState } from 'react';
import { Routes, Route, useNavigate, useLocation } from 'react-router-dom';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { ListingDetailModal } from './components/ListingDetailModal';
import { HomeValuationModal } from './components/HomeValuationModal';
import { StrategyConsultationModal } from './components/StrategyConsultationModal';
import { SEOMetaDrawer } from './components/SEOMetaDrawer';

import { HomePage } from './pages/HomePage';
import { AboutPage } from './pages/AboutPage';
import { SellPage } from './pages/SellPage';
import { BuyersPage } from './pages/BuyersPage';
import { NeighborhoodsPage } from './pages/NeighborhoodsPage';
import { ListingsPage } from './pages/ListingsPage';
import { ContactPage } from './pages/ContactPage';
import { BlogListPage } from './pages/BlogListPage';
import { BlogPostPage } from './pages/BlogPostPage';
import { GuidesListPage } from './pages/GuidesListPage';
import { LuxuryPage } from './pages/LuxuryPage';
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
};

export default function App() {
  const navigate = useNavigate();
  const location = useLocation();
  const activeTab = PATH_TO_TAB[location.pathname] || 'home';

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

  const [selectedListing, setSelectedListing] = useState<Listing | null>(null);
  const [isValuationOpen, setIsValuationOpen] = useState(false);
  const [isConsultationOpen, setIsConsultationOpen] = useState(false);
  const [selectedNeighborhoodId, setSelectedNeighborhoodId] = useState('carroll-county');

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
    setSelectedListing(listing);
  };

  return (
    <div className="min-h-screen bg-[#F5F1E8] text-[#1C2B2E] font-sans flex flex-col justify-between selection:bg-[#C9A96A] selection:text-[#0D2226]">

      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        savedCount={savedListings.length}
        onOpenValuation={() => setIsValuationOpen(true)}
        onOpenConsultation={() => setIsConsultationOpen(true)}
        onSelectNeighborhood={(id) => setSelectedNeighborhoodId(id)}
      />

      <main className="flex-1">
        <Routes>
          <Route path="/" element={
            <HomePage
              listings={FEATURED_LISTINGS}
              neighborhoods={NEIGHBORHOODS}
              savedListings={savedListings}
              onToggleSave={handleToggleSave}
              onSelectListing={(l) => setSelectedListing(l)}
              onScheduleShowing={handleScheduleShowing}
              onOpenValuation={() => setIsValuationOpen(true)}
              onOpenConsultation={() => setIsConsultationOpen(true)}
              setActiveTab={setActiveTab}
              onSelectNeighborhood={(id) => setSelectedNeighborhoodId(id)}
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
              neighborhoods={NEIGHBORHOODS}
              listings={FEATURED_LISTINGS}
              selectedNeighborhoodId={selectedNeighborhoodId}
              setSelectedNeighborhoodId={setSelectedNeighborhoodId}
              savedListings={savedListings}
              onToggleSave={handleToggleSave}
              onSelectListing={(l) => setSelectedListing(l)}
              onScheduleShowing={handleScheduleShowing}
              onOpenConsultation={() => setIsConsultationOpen(true)}
            />
          } />

          <Route path="/listings" element={
            <ListingsPage
              savedListings={savedListings}
              onToggleSave={handleToggleSave}
              onSelectListing={(l) => setSelectedListing(l)}
              onScheduleShowing={handleScheduleShowing}
              onOpenConsultation={() => setIsConsultationOpen(true)}
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
        </Routes>
      </main>

      <Footer
        setActiveTab={setActiveTab}
        onOpenValuation={() => setIsValuationOpen(true)}
        onOpenConsultation={() => setIsConsultationOpen(true)}
      />

      <ListingDetailModal
        listing={selectedListing}
        onClose={() => setSelectedListing(null)}
        isSaved={selectedListing ? savedListings.includes(selectedListing.id) : false}
        onToggleSave={handleToggleSave}
        onScheduleConsultation={() => setIsConsultationOpen(true)}
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
