import React, { useState, useEffect, useRef } from 'react';
import { Building2, Phone, Menu, X, Heart, Calculator, ChevronRight, ChevronDown, Compass, ShieldCheck } from 'lucide-react';

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
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [openDesktopGroup, setOpenDesktopGroup] = useState<string | null>(null);
  const [openMobileGroup, setOpenMobileGroup] = useState<string | null>(null);
  const closeTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const goTo = (tab: string) => {
    setActiveTab(tab);
    setMobileMenuOpen(false);
    setOpenDesktopGroup(null);
    setOpenMobileGroup(null);
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
          </div>

          {/* Mobile Menu Toggle Button */}
          <div className="lg:hidden flex items-center gap-2">
            <button
              onClick={onOpenConsultation}
              className="px-3 py-1.5 text-xs font-bold uppercase tracking-wider text-[#0D2226] bg-[#C9A96A] rounded-xs"
            >
              Consult
            </button>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 text-[#FAF8F5] focus:outline-none"
              id="nav-mobile-toggle"
              aria-label="Toggle navigation menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6 text-[#C9A96A]" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>

        </div>
      </div>

      {/* Mobile Menu Drawer - same grouped structure, expandable sections */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-[#0D2226] border-b border-[#C9A96A]/30 px-6 py-6 space-y-1 animate-fadeIn shadow-2xl max-h-[calc(100vh-80px)] overflow-y-auto">
          {navGroups.map((group) => {
            const hasDropdown = Boolean(group.items?.length);
            const isOpen = openMobileGroup === group.id;
            const isActive = activeGroupId === group.id;

            if (!hasDropdown) {
              return (
                <button
                  key={group.id}
                  onClick={group.action}
                  className={`w-full text-left text-sm uppercase tracking-widest py-3 border-b border-[#FAF8F5]/10 flex items-center justify-between ${
                    isActive ? 'text-[#C9A96A] font-bold' : 'text-[#FAF8F5]/80'
                  }`}
                >
                  <span>{group.label}</span>
                  <ChevronRight className="w-4 h-4 text-[#C9A96A]/60" />
                </button>
              );
            }

            return (
              <div key={group.id} className="border-b border-[#FAF8F5]/10">
                <button
                  onClick={() => setOpenMobileGroup(isOpen ? null : group.id)}
                  className={`w-full text-left text-sm uppercase tracking-widest py-3 flex items-center justify-between ${
                    isActive ? 'text-[#C9A96A] font-bold' : 'text-[#FAF8F5]/80'
                  }`}
                >
                  <span>{group.label}</span>
                  <ChevronDown className={`w-4 h-4 text-[#C9A96A]/60 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
                </button>
                {isOpen && (
                  <div className="pb-2 pl-4 space-y-1">
                    {group.items!.map((item) => (
                      <button
                        key={item.label}
                        onClick={item.action}
                        className="w-full text-left text-xs uppercase tracking-wider py-2.5 text-[#FAF8F5]/70 hover:text-[#C9A96A]"
                      >
                        {item.label}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            );
          })}

          <div className="pt-4 space-y-3">
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                onOpenValuation();
              }}
              className="w-full py-3 text-xs uppercase tracking-wider font-bold text-[#C9A96A] border border-[#C9A96A] rounded-xs flex items-center justify-center gap-2"
            >
              <Calculator className="w-4 h-4" />
              <span>Discover Your Home Value</span>
            </button>
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                onOpenConsultation();
              }}
              className="w-full py-3 text-xs uppercase tracking-wider font-bold text-[#0D2226] bg-[#C9A96A] rounded-xs flex items-center justify-center gap-2"
            >
              <Phone className="w-4 h-4" />
              <span>Schedule Strategy Call</span>
            </button>
          </div>

          <div className="pt-2 text-center text-[11px] text-[#A8B2A1] flex items-center justify-center gap-2">
            <ShieldCheck className="w-3.5 h-3.5 text-[#C9A96A]" />
            <span>The Friedman Team | eXp Realty Maryland</span>
          </div>
        </div>
      )}
    </header>
  );
};
