import React, { useState, useEffect, useRef } from 'react';
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
  const [fullMenuOpen, setFullMenuOpen] = useState(false);
  const [expandedFullMenuGroup, setExpandedFullMenuGroup] = useState<string | null>(null);
  const [openDesktopGroup, setOpenDesktopGroup] = useState<string | null>(null);
  const closeTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const goTo = (tab: string) => {
    setActiveTab(tab);
    setFullMenuOpen(false);
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
        { label: "Buyer's Strategy", action: () => goTo('buy') },
        { label: "Seller's Strategy", action: () => goTo('sell') },
      ],
    },
    { id: 'neighborhoods', label: 'Neighborhoods', action: () => goTo('neighborhoods') },
    { id: 'home-search', label: 'Home Search', action: () => goTo('listings') },
    { id: 'home-valuation', label: 'Home Valuation', action: () => onOpenValuation() },
    {
      id: 'resources',
      label: 'Resources',
      items: [
        { label: 'Meet the Team', action: () => goTo('team') },
        { label: "The Friedman Report", action: () => goTo('blog') },
        { label: 'Free Guides', action: () => goTo('guides') },
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
    neighborhoods: 'neighborhoods',
    team: 'resources',
    blog: 'resources',
    guides: 'resources',
    'giving-back': 'resources',
    luxury: 'resources',
    about: 'resources',
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
      { id: 'home-valuation-full', label: 'Home Valuation', action: () => { onOpenValuation(); setFullMenuOpen(false); } },
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
          { label: "Buyer's Strategy", action: () => goTo('buy') },
          { label: "Seller's Strategy", action: () => goTo('sell') },
        ],
      },
      { id: 'home-search-full', label: 'Home Search', action: () => goTo('listings') },
      {
        id: 'resources-full',
        label: 'Resources',
        items: [
          { label: 'Free Guides', action: () => goTo('guides') },
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
            <div className="w-10 h-10 rounded-sm bg-[#0F5C63] border border-[#C9A96A] flex items-center justify-center text-[#C9A96A] font-serif font-bold text-xl shadow-lg group-hover:border-[#F5F1E8] transition-all">
              F
            </div>
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
              onClick={() => setFullMenuOpen(true)}
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
              onClick={() => setFullMenuOpen(true)}
              className="p-2 text-[#FAF8F5] focus:outline-none"
              id="nav-mobile-toggle"
              aria-label="Toggle navigation menu"
            >
              <Menu className="w-6 h-6" />
            </button>
          </div>

        </div>
      </div>

      {/* Full-screen overlay menu - light theme, two-column link grid,
          matches Canopy's exact pattern. Used by both the desktop square
          icon and the mobile hamburger, so there's one menu to maintain
          instead of two different navigation experiences. */}
      {fullMenuOpen && (
        <div className="fixed inset-0 z-[60] bg-[#FAF8F5] overflow-y-auto">
          <div className="max-w-5xl mx-auto px-6 sm:px-10 py-8">
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
                onClick={() => setFullMenuOpen(false)}
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
              <a href="#" aria-label="Facebook" className="w-9 h-9 rounded-full border border-[#0D2226]/20 flex items-center justify-center text-[#0D2226]/60 hover:border-[#0F5C63] hover:text-[#0F5C63] transition-colors">
                <Facebook className="w-4 h-4" />
              </a>
              <a href="#" aria-label="Instagram" className="w-9 h-9 rounded-full border border-[#0D2226]/20 flex items-center justify-center text-[#0D2226]/60 hover:border-[#0F5C63] hover:text-[#0F5C63] transition-colors">
                <Instagram className="w-4 h-4" />
              </a>
              <a href="#" aria-label="LinkedIn" className="w-9 h-9 rounded-full border border-[#0D2226]/20 flex items-center justify-center text-[#0D2226]/60 hover:border-[#0F5C63] hover:text-[#0F5C63] transition-colors">
                <Linkedin className="w-4 h-4" />
              </a>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};
