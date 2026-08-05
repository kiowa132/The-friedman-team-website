import React, { useState, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { Building2, Phone, Menu, X, Heart, Calculator, ChevronRight, ChevronDown, Compass, ShieldCheck, Grid2x2, Facebook, Instagram, Linkedin } from 'lucide-react';

interface NavDropdownItem {
  label: string;
  action: () => void;
}

interface NavGroup {
  id: string;
  label: string;
  action?: () => void; // for a plain link with no dropdown (e.g. Home)
  items?: NavDropdownItem[];
}

interface NavbarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  savedCount: number;
  onOpenValuation: () => void;
  onOpenConsultation: () => void;
  onSelectNeighborhood?: (id: string) => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  setActiveTab,
  savedCount,
  onOpenValuation,
  onOpenConsultation,
  onSelectNeighborhood,
}) => {
  const [isScrolled, setIsScrolled] = useState(false);
  // Two states, not one: fullMenuMounted controls whether the overlay
  // exists in the DOM at all, fullMenuVisible controls the actual
  // opacity/transform transition. Using just one boolean meant the overlay
  // could only snap instantly in and out - React unmounts the element the
  // same render it disappears, so there's no chance for a CSS transition
  // to play on the way out. Splitting them gives a brief window where the
  // element is still mounted but transitioning to its closed state.
  const [fullMenuMounted, setFullMenuMounted] = useState(false);
  const [fullMenuVisible, setFullMenuVisible] = useState(false);
  const [expandedFullMenuGroup, setExpandedFullMenuGroup] = useState<string | null>(null);
  const [openDesktopGroup, setOpenDesktopGroup] = useState<string | null>(null);
  const closeTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const openFullMenu = () => {
    setFullMenuMounted(true);
    // Mount first with visible=false, then flip to true on the next frame
    // so the browser actually registers the "before" state and animates
    // to the "after" state, instead of both happening in the same paint.
    requestAnimationFrame(() => {
      requestAnimationFrame(() => setFullMenuVisible(true));
    });
  };

  const closeFullMenu = () => {
    setFullMenuVisible(false);
    setTimeout(() => setFullMenuMounted(false), 300);
  };

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const goTo = (tab: string) => {
    setActiveTab(tab);
    closeFullMenu();
    setExpandedFullMenuGroup(null);
    setOpenDesktopGroup(null);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const goToNeighborhood = (neighborhoodId: string) => {
    onSelectNeighborhood?.(neighborhoodId);
    goTo('neighborhoods');
  };

  // Restructured to mirror Canopy's top nav bar: Properties | Neighborhoods |
  // Home Search | Home Valuation | Contact Us | phone number. Everything
  // that existed before (Buy/Sell strategy pages, Blog, Guides, About,
  // Luxury) still lives on the site - tucked into Properties/Resources
  // dropdowns rather than deleted, so nothing built tonight becomes a dead
  // link.
  const navGroups: NavGroup[] = [
    {
      id: 'properties',
      label: 'Properties',
      items: [
        { label: 'Featured Properties', action: () => goTo('listings') },
        { label: 'Home Search', action: () => goTo('listings') },
        { label: "Mentor's and Team's Transactions", action: () => goTo('past-transactions') },
        { label: "Buyer's Strategy", action: () => goTo('buy') },
        { label: "Seller's Strategy", action: () => goTo('sell') },
      ],
    },
    { id: 'neighborhoods', label: 'Neighborhoods', action: () => goTo('neighborhoods') },
    { id: 'home-valuation', label: 'Home Valuation', action: () => onOpenValuation() },
    {
      id: 'calculators',
      label: 'Calculators',
      items: [
        { label: 'Mortgage Calculator', action: () => goTo('calculators-mortgage') },
        { label: 'Affordability Calculator', action: () => goTo('calculators-affordability') },
        { label: 'Net Proceeds Calculator', action: () => goTo('calculators-net-proceeds') },
      ],
    },
    {
      id: 'resources',
      label: 'Resources',
      items: [
        { label: 'Meet the Team', action: () => goTo('team') },
        { label: "The Friedman Report", action: () => goTo('blog') },
        { label: 'Free Guides', action: () => goTo('guides') },
        { label: 'Videos', action: () => goTo('videos') },
        { label: 'Financing Options', action: () => goTo('financing-options') },
        { label: 'Giving Back', action: () => goTo('giving-back') },
        { label: 'Fine Homes & Estates', action: () => goTo('luxury') },
        { label: 'About Kyle', action: () => goTo('about') },
      ],
    },
    { id: 'contact', label: 'Contact Us', action: () => goTo('contact') },
  ];

  // Which top-level group should show as "active" (for the underline/highlight)
  const groupForTab: Record<string, string> = {
    home: 'home',
    listings: 'properties',
    buy: 'properties',
    sell: 'properties',
    'past-transactions': 'properties',
    neighborhoods: 'neighborhoods',
    team: 'resources',
    blog: 'resources',
    guides: 'resources',
    videos: 'resources',
    'financing-options': 'resources',
    'giving-back': 'resources',
    luxury: 'resources',
    about: 'resources',
    calculators: 'calculators',
    'calculators-mortgage': 'calculators',
    'calculators-affordability': 'calculators',
    'calculators-net-proceeds': 'calculators',
    contact: 'contact',
  };
  const activeGroupId = groupForTab[activeTab] || 'home';

  // Two-column structure for the full-screen overlay menu (triggered by the
  // square icon on desktop, or the hamburger on mobile) - matches Canopy's
  // exact pattern: plain links plus a couple of "+" expandable groups,
  // laid out in two columns with a thin rule and social icons at the
  // bottom. This is separate from the compact dropdown-based top bar above.
  const fullMenuColumns: NavGroup[][] = [
    [
      { id: 'home', label: 'Home', action: () => goTo('home') },
      { id: 'team', label: 'Meet the Team', action: () => goTo('team') },
      { id: 'home-valuation-full', label: 'Home Valuation', action: () => { onOpenValuation(); closeFullMenu(); } },
      { id: 'neighborhoods-full', label: 'Neighborhoods', action: () => goTo('neighborhoods') },
      { id: 'blog-full', label: 'The Friedman Report', action: () => goTo('blog') },
      { id: 'giving-back-full', label: 'Giving Back', action: () => goTo('giving-back') },
    ],
    [
      {
        id: 'properties-full',
        label: 'Properties',
        items: [
          { label: 'Featured Properties', action: () => goTo('listings') },
          { label: 'Home Search', action: () => goTo('listings') },
          { label: "Mentor's and Team's Transactions", action: () => goTo('past-transactions') },
          { label: "Buyer's Strategy", action: () => goTo('buy') },
          { label: "Seller's Strategy", action: () => goTo('sell') },
        ],
      },
      {
        id: 'calculators-full',
        label: 'Calculators',
        items: [
          { label: 'Mortgage Calculator', action: () => goTo('calculators-mortgage') },
          { label: 'Affordability Calculator', action: () => goTo('calculators-affordability') },
          { label: 'Net Proceeds Calculator', action: () => goTo('calculators-net-proceeds') },
        ],
      },
      {
        id: 'resources-full',
        label: 'Resources',
        items: [
          { label: 'Free Guides', action: () => goTo('guides') },
          { label: 'Videos', action: () => goTo('videos') },
          { label: 'Financing Options', action: () => goTo('financing-options') },
          { label: 'Fine Homes & Estates', action: () => goTo('luxury') },
          { label: 'About Kyle', action: () => goTo('about') },
        ],
      },
      { id: 'contact-full', label: 'Contact Us', action: () => goTo('contact') },
    ],
  ];

  const handleDesktopEnter = (id: string) => {
    if (closeTimer.current) clearTimeout(closeTimer.current);
    setOpenDesktopGroup(id);
  };
  const handleDesktopLeave = () => {
    closeTimer.current = setTimeout(() => setOpenDesktopGroup(null), 150);
  };

  return (
    <>
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        isScrolled
          ? 'bg-[#0D2226]/95 backdrop-blur-md shadow-2xl py-3 border-b border-[#C9A96A]/30 text-[#F5F1E8]'
          : 'bg-gradient-to-b from-[#0D2226]/90 via-[#0D2226]/60 to-transparent py-5 text-[#F5F1E8]'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between">

          {/* Logo Branding */}
          <button
            onClick={() => goTo('home')}
            className="flex items-center gap-3 text-left group focus:outline-none"
            id="nav-logo-btn"
          >
            <img
              src="/images/brand/friedman-f-mark.png"
              alt="The Friedman Team"
              className="h-11 w-auto drop-shadow-[0_4px_10px_rgba(0,0,0,0.35)] group-hover:drop-shadow-[0_4px_14px_rgba(201,169,106,0.45)] transition-all"
            />
            <div>
              <div className="font-serif text-lg sm:text-xl font-bold tracking-wider text-[#FAF8F5] uppercase group-hover:text-[#C9A96A] transition-colors leading-tight">
                Friedman
              </div>
              <div className="text-[10px] sm:text-xs font-medium tracking-[0.25em] text-[#C9A96A] uppercase flex items-center gap-1.5">
                <span>The Friedman Team</span>
                <span className="inline-block w-1 h-1 rounded-full bg-[#A8B2A1]"></span>
                <span className="text-[#A8B2A1]/90">eXp Realty</span>
              </div>
            </div>
          </button>

          {/* Desktop Navigation - grouped by buyer/seller intent */}
          <nav className="hidden lg:flex items-center space-x-1 xl:space-x-2">
            {navGroups.map((group) => {
              const isActive = activeGroupId === group.id;
              const hasDropdown = Boolean(group.items?.length);

              return (
                <div
                  key={group.id}
                  className="relative"
                  onMouseEnter={() => hasDropdown && handleDesktopEnter(group.id)}
                  onMouseLeave={() => hasDropdown && handleDesktopLeave()}
                >
                  <button
                    onClick={() => (group.action ? group.action() : handleDesktopEnter(group.id))}
                    id={`nav-link-${group.id}`}
                    className={`px-3 py-2 text-xs xl:text-sm uppercase tracking-widest font-medium transition-all relative flex items-center gap-1 ${
                      isActive ? 'text-[#C9A96A] font-semibold' : 'text-[#FAF8F5]/85 hover:text-[#C9A96A]'
                    }`}
                  >
                    {group.label}
                    {hasDropdown && <ChevronDown className="w-3 h-3" />}
                    {isActive && (
                      <span className="absolute bottom-0 left-3 right-3 h-[2px] bg-[#C9A96A] rounded-full shadow-[0_0_8px_#C9A96A]" />
                    )}
                  </button>

                  {hasDropdown && openDesktopGroup === group.id && (
                    <div className="absolute top-full left-0 pt-2 min-w-[220px] z-30">
                      <div className="bg-[#0D2226] border border-[#C9A96A]/40 rounded-xs shadow-2xl overflow-hidden">
                        {group.items!.map((item) => (
                          <button
                            key={item.label}
                            onClick={item.action}
                            className="w-full text-left px-4 py-3 text-xs uppercase tracking-wider text-[#FAF8F5]/90 hover:bg-[#0F5C63] hover:text-[#C9A96A] transition-colors border-b border-[#FAF8F5]/5 last:border-b-0"
                          >
                            {item.label}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </nav>

          {/* Actions - simplified to match Canopy's minimal style: a
              favorites icon and the phone number displayed directly, no
              large button-styled CTAs cluttering the header. */}
          <div className="hidden lg:flex items-center space-x-5">
            <button
              onClick={() => goTo('listings')}
              className="relative p-1 text-[#FAF8F5]/80 hover:text-[#C9A96A] transition-colors focus:outline-none"
              title="Saved Properties"
              id="nav-saved-btn"
            >
              <Heart className="w-5 h-5" />
              {savedCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-[#C9A96A] text-[#0D2226] font-bold text-[10px] w-4 h-4 rounded-full flex items-center justify-center">
                  {savedCount}
                </span>
              )}
            </button>

            <a
              href="tel:4437893101"
              id="nav-phone-link"
              className="text-xs xl:text-sm font-semibold tracking-wide text-[#FAF8F5]/90 hover:text-[#C9A96A] transition-colors"
            >
              (443) 789-3101
            </a>

            <button
              onClick={openFullMenu}
              className="p-1.5 border border-[#FAF8F5]/30 hover:border-[#C9A96A] text-[#FAF8F5]/80 hover:text-[#C9A96A] transition-colors focus:outline-none"
              aria-label="Open full menu"
              id="nav-full-menu-btn"
            >
              <Grid2x2 className="w-4 h-4" />
            </button>
          </div>

          {/* Mobile Menu Toggle Button - opens the same full-screen overlay as desktop */}
          <div className="lg:hidden flex items-center gap-2">
            <button
              onClick={onOpenConsultation}
              className="px-3 py-1.5 text-xs font-bold uppercase tracking-wider text-[#0D2226] bg-[#C9A96A] rounded-xs"
            >
              Consult
            </button>
            <button
              onClick={openFullMenu}
              className="p-2 text-[#FAF8F5] focus:outline-none"
              id="nav-mobile-toggle"
              aria-label="Toggle navigation menu"
            >
              <Menu className="w-6 h-6" />
            </button>
          </div>

        </div>
      </div>
    </header>

    {/* Full-screen overlay menu - light theme, two-column link grid,
        matches Canopy's exact pattern. Used by both the desktop square
        icon and the mobile hamburger, so there's one menu to maintain
        instead of two different navigation experiences.

        Rendered via a portal directly into document.body, NOT nested
        inside <header> - the header gets a backdrop-blur effect once
        scrolled, and CSS backdrop-filter creates a new containing block
        for any fixed-position descendants. That was silently trapping
        this "fixed inset-0" overlay inside the header's own small box
        instead of the full viewport whenever the page was scrolled,
        which is exactly why it only worked correctly at the top of the
        page. Portaling it out avoids that entirely. */}
    {fullMenuMounted && createPortal(
      (
        <div
          className={`fixed inset-0 z-[60] bg-[#FAF8F5] overflow-y-auto transition-opacity duration-300 ease-out ${
            fullMenuVisible ? 'opacity-100' : 'opacity-0'
          }`}
          onClick={(e) => e.target === e.currentTarget && closeFullMenu()}
        >
          <div
            className={`max-w-5xl mx-auto px-6 sm:px-10 py-8 transition-all duration-300 ease-out ${
              fullMenuVisible ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-4'
            }`}
          >
            <div className="flex items-center justify-between pb-6 border-b border-[#0D2226]/15">
              <button
                onClick={() => goTo('home')}
                className="flex items-center gap-2 text-left"
              >
                <div className="w-9 h-9 rounded-sm bg-[#0F5C63] border border-[#C9A96A] flex items-center justify-center text-[#C9A96A] font-serif font-bold text-lg">
                  F
                </div>
                <span className="font-serif text-lg font-bold tracking-wider text-[#0D2226] uppercase">
                  Friedman
                </span>
              </button>
              <button
                onClick={closeFullMenu}
                aria-label="Close menu"
                className="p-2 text-[#0D2226] hover:text-[#0F5C63] transition-colors"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-16 gap-y-2 py-10">
              {fullMenuColumns.map((column, colIndex) => (
                <div key={colIndex} className="space-y-7">
                  {column.map((group) => {
                    const hasDropdown = Boolean(group.items?.length);
                    const isExpanded = expandedFullMenuGroup === group.id;

                    if (!hasDropdown) {
                      return (
                        <button
                          key={group.id}
                          onClick={group.action}
                          className="block text-left text-lg sm:text-xl uppercase tracking-wide text-[#0D2226] hover:text-[#0F5C63] transition-colors"
                        >
                          {group.label}
                        </button>
                      );
                    }

                    return (
                      <div key={group.id}>
                        <button
                          onClick={() => setExpandedFullMenuGroup(isExpanded ? null : group.id)}
                          className="flex items-center gap-2 text-lg sm:text-xl uppercase tracking-wide text-[#0D2226] hover:text-[#0F5C63] transition-colors border-b border-[#0D2226] pb-0.5"
                        >
                          <span>{group.label}</span>
                          <span className="text-base">{isExpanded ? '−' : '+'}</span>
                        </button>
                        {isExpanded && (
                          <div className="pt-3 pl-2 space-y-2.5">
                            {group.items!.map((item) => (
                              <button
                                key={item.label}
                                onClick={item.action}
                                className="block text-left text-sm uppercase tracking-wider text-[#1C2B2E]/70 hover:text-[#0F5C63] transition-colors"
                              >
                                {item.label}
                              </button>
                            ))}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              ))}
            </div>

            <div className="flex items-center justify-center sm:justify-end gap-3 pt-6 border-t border-[#0D2226]/10">
              <a href="https://www.facebook.com/kyle.friedman132" target="_blank" rel="noopener noreferrer" aria-label="Facebook" className="w-9 h-9 rounded-full border border-[#0D2226]/20 flex items-center justify-center text-[#0D2226]/60 hover:border-[#0F5C63] hover:text-[#0F5C63] transition-colors">
                <Facebook className="w-4 h-4" />
              </a>
              <a href="https://www.instagram.com/keysbykyle/" target="_blank" rel="noopener noreferrer" aria-label="Instagram" className="w-9 h-9 rounded-full border border-[#0D2226]/20 flex items-center justify-center text-[#0D2226]/60 hover:border-[#0F5C63] hover:text-[#0F5C63] transition-colors">
                <Instagram className="w-4 h-4" />
              </a>
              <a href="https://www.linkedin.com/in/kyle-friedman-415029168/?skipRedirect=true" target="_blank" rel="noopener noreferrer" aria-label="LinkedIn" className="w-9 h-9 rounded-full border border-[#0D2226]/20 flex items-center justify-center text-[#0D2226]/60 hover:border-[#0F5C63] hover:text-[#0F5C63] transition-colors">
                <Linkedin className="w-4 h-4" />
              </a>
            </div>
          </div>
        </div>
      ),
      document.body
    )}
    </>
  );
};
