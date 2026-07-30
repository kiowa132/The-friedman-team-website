import React, { useState, useEffect } from 'react';
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
import { MarketReportPage } from './pages/MarketReportPage';
import { ContactPage } from './pages/ContactPage';

import { FEATURED_LISTINGS, NEIGHBORHOODS } from './data/mockData';
import { Listing } from './types';

export default function App() {
  const [activeTab, setActiveTab] = useState<string>('home');
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

  // Save/Unsave Handler
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
      
      {/* Fixed Luxury Navigation Bar */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        savedCount={savedListings.length}
        onOpenValuation={() => setIsValuationOpen(true)}
        onOpenConsultation={() => setIsConsultationOpen(true)}
        onSelectNeighborhood={(id) => setSelectedNeighborhoodId(id)}
      />

      {/* Main Dynamic View Area */}
      <main className="flex-1">
        {activeTab === 'home' && (
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
        )}

        {activeTab === 'about' && (
          <AboutPage
            onOpenConsultation={() => setIsConsultationOpen(true)}
            setActiveTab={setActiveTab}
          />
        )}

        {activeTab === 'sell' && (
          <SellPage
            onOpenValuation={() => setIsValuationOpen(true)}
            onOpenConsultation={() => setIsConsultationOpen(true)}
          />
        )}

        {activeTab === 'buy' && (
          <BuyersPage
            onOpenConsultation={() => setIsConsultationOpen(true)}
            setActiveTab={setActiveTab}
          />
        )}

        {activeTab === 'neighborhoods' && (
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
        )}

        {activeTab === 'listings' && (
          <ListingsPage
            savedListings={savedListings}
            onToggleSave={handleToggleSave}
            onSelectListing={(l) => setSelectedListing(l)}
            onScheduleShowing={handleScheduleShowing}
            onOpenConsultation={() => setIsConsultationOpen(true)}
          />
        )}

        {activeTab === 'market-report' && (
          <MarketReportPage
            onOpenConsultation={() => setIsConsultationOpen(true)}
          />
        )}

        {activeTab === 'contact' && (
          <ContactPage
            onOpenValuation={() => setIsValuationOpen(true)}
          />
        )}
      </main>

      {/* Editorial Footer */}
      <Footer
        setActiveTab={setActiveTab}
        onOpenValuation={() => setIsValuationOpen(true)}
        onOpenConsultation={() => setIsConsultationOpen(true)}
      />

      {/* Listing Details Slide-Over / Modal */}
      <ListingDetailModal
        listing={selectedListing}
        onClose={() => setSelectedListing(null)}
        isSaved={selectedListing ? savedListings.includes(selectedListing.id) : false}
        onToggleSave={handleToggleSave}
        onScheduleConsultation={() => setIsConsultationOpen(true)}
      />

      {/* Complimentary Home Valuation Calculator Modal */}
      <HomeValuationModal
        isOpen={isValuationOpen}
        onClose={() => setIsValuationOpen(false)}
        onSelectConsultation={() => {
          setIsValuationOpen(false);
          setIsConsultationOpen(true);
        }}
      />

      {/* Strategy Consultation Booking Modal */}
      <StrategyConsultationModal
        isOpen={isConsultationOpen}
        onClose={() => setIsConsultationOpen(false)}
      />

      {/* RealEstateAgent Schema & SEO Inspector */}
      <SEOMetaDrawer />

    </div>
  );
}
