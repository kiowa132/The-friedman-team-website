import React from 'react';
import { Link } from 'react-router-dom';
import { Mail, Phone, MapPin, ShieldCheck, Facebook, Instagram, Linkedin, Star, Home, Youtube } from 'lucide-react';
import { SUBSTACK_SUBDOMAIN } from '../lib/siteConfig';

interface FooterProps {
  // kept for API compatibility with App.tsx; nav is now real <Link>s
  setActiveTab?: (tab: string) => void;
  onOpenValuation: () => void;
  onOpenConsultation: () => void;
}

// Real crawlable link for footer nav. Renders <a href>, does SPA nav,
// and scrolls to top on click (matching the old goTo behavior).
const FLink: React.FC<{ to: string; className?: string; children: React.ReactNode }> = ({ to, className, children }) => (
  <Link
    to={to}
    onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
    className={className}
  >
    {children}
  </Link>
);

export const Footer: React.FC<FooterProps> = ({
  onOpenValuation,
  onOpenConsultation
}) => {

  return (
    <footer className="bg-[#0D2226] text-[#F5F1E8] border-t border-[#C9A96A]/30 pt-16 pb-8 relative overflow-hidden">
      <div className="absolute top-0 right-0 w-96 h-96 bg-[#0F5C63]/20 blur-3xl rounded-full pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">

        {/* Newsletter Banner - real Substack embed */}
        <div className="border-b border-[#FAF8F5]/10 pb-12 mb-12">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            <div className="lg:col-span-7">
              <span className="text-[#C9A96A] text-xs font-semibold tracking-widest uppercase">
                Weekly Market Newsletter
              </span>
              <h3 className="font-serif text-2xl sm:text-3xl text-[#FAF8F5] font-semibold mt-1">
                Subscribe to The Friedman Report
              </h3>
              <p className="text-[#A8B2A1] text-sm mt-2 max-w-xl">
                Local market data, new listings, and straight talk about buying and selling in Carroll, Baltimore, Howard, and Frederick counties, every week.
              </p>
            </div>

            <div className="lg:col-span-5">
              {SUBSTACK_SUBDOMAIN && SUBSTACK_SUBDOMAIN !== 'YOUR-SUBSTACK-SUBDOMAIN' ? (
                <iframe
                  src={`https://${SUBSTACK_SUBDOMAIN}.substack.com/embed`}
                  width="100%"
                  height="120"
                  style={{ background: 'transparent', border: 'none' }}
                  title="Subscribe to The Friedman Report"
                />
              ) : (
                <div className="bg-[#FAF8F5]/5 border border-[#FAF8F5]/15 rounded-xs p-4 text-center">
                  <p className="text-xs text-[#A8B2A1]">
                    Newsletter signup is almost ready — check back soon.
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Main Footer Navigation Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 pb-12 border-b border-[#FAF8F5]/10">

          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center gap-3">
              <img
                src="/images/brand/friedman-f-mark.png"
                alt="The Friedman Team"
                className="h-12 w-auto drop-shadow-[0_4px_10px_rgba(0,0,0,0.4)]"
              />
              <div>
                <h4 className="font-serif text-xl font-bold tracking-wider text-[#FAF8F5]">
                  THE FRIEDMAN TEAM
                </h4>
                <p className="text-xs text-[#C9A96A] uppercase tracking-widest font-medium">
                  More Strategy. Better Outcomes.
                </p>
              </div>
            </div>

            <p className="text-xs text-[#A8B2A1] leading-relaxed max-w-sm">
              The Friedman Team is a Maryland real estate team serving Carroll, Howard, Frederick, and Baltimore County. Licensed with eXp Realty.
            </p>

            <div className="pt-2 text-xs text-[#FAF8F5]/80 space-y-1.5">
              <div className="flex items-center gap-2 text-xs">
                <Phone className="w-3.5 h-3.5 text-[#C9A96A]" />
                <span>Direct / Advisory: (443) 789-3101</span>
              </div>
              <div className="flex items-center gap-2 text-xs">
                <Mail className="w-3.5 h-3.5 text-[#C9A96A]" />
                <span>kyle@friedmanreteam.com</span>
              </div>
              <div className="flex items-center gap-2 text-xs">
                <MapPin className="w-3.5 h-3.5 text-[#C9A96A]" />
                <span>Serving Carroll, Baltimore, Howard & Frederick Counties</span>
              </div>
            </div>

            {/* Social icons + eXp logo */}
            <div className="flex items-center gap-3 pt-3">
              <a href="https://www.facebook.com/kyle.friedman132" target="_blank" rel="noopener noreferrer" aria-label="Facebook" className="w-8 h-8 rounded-full border border-[#FAF8F5]/20 flex items-center justify-center text-[#FAF8F5]/70 hover:border-[#C9A96A] hover:text-[#C9A96A] transition-colors">
                <Facebook className="w-3.5 h-3.5" />
              </a>
              <a href="https://www.instagram.com/keysbykyle/" target="_blank" rel="noopener noreferrer" aria-label="Instagram" className="w-8 h-8 rounded-full border border-[#FAF8F5]/20 flex items-center justify-center text-[#FAF8F5]/70 hover:border-[#C9A96A] hover:text-[#C9A96A] transition-colors">
                <Instagram className="w-3.5 h-3.5" />
              </a>
              <a href="https://www.linkedin.com/in/kyle-friedman-415029168/?skipRedirect=true" target="_blank" rel="noopener noreferrer" aria-label="LinkedIn" className="w-8 h-8 rounded-full border border-[#FAF8F5]/20 flex items-center justify-center text-[#FAF8F5]/70 hover:border-[#C9A96A] hover:text-[#C9A96A] transition-colors">
                <Linkedin className="w-3.5 h-3.5" />
              </a>
              <a href="https://share.google/fH72jPIgQXjEImIHG" target="_blank" rel="noopener noreferrer" aria-label="Google Reviews" className="w-8 h-8 rounded-full border border-[#FAF8F5]/20 flex items-center justify-center text-[#FAF8F5]/70 hover:border-[#C9A96A] hover:text-[#C9A96A] transition-colors">
                <Star className="w-3.5 h-3.5" />
              </a>
              <a href="https://www.zillow.com/profile/Kyle%20Friedman%20Team" target="_blank" rel="noopener noreferrer" aria-label="Zillow" className="w-8 h-8 rounded-full border border-[#FAF8F5]/20 flex items-center justify-center text-[#FAF8F5]/70 hover:border-[#C9A96A] hover:text-[#C9A96A] transition-colors">
                <Home className="w-3.5 h-3.5" />
              </a>
              <a href="https://www.youtube.com/@SimplyFriedman/shorts" target="_blank" rel="noopener noreferrer" aria-label="YouTube" className="w-8 h-8 rounded-full border border-[#FAF8F5]/20 flex items-center justify-center text-[#FAF8F5]/70 hover:border-[#C9A96A] hover:text-[#C9A96A] transition-colors">
                <Youtube className="w-3.5 h-3.5" />
              </a>
            </div>

            <img
              src="/images/brand/exp-realty-logo.png"
              alt="eXp Realty"
              className="h-9 w-auto object-contain brightness-0 invert opacity-90 pt-2"
            />
          </div>

          {/* Navigation Links */}
          <div className="space-y-3">
            <h5 className="text-xs font-bold uppercase tracking-widest text-[#C9A96A]">
              Navigation
            </h5>
            <ul className="space-y-2 text-xs text-[#FAF8F5]/80">
              <li><FLink to="/" className="hover:text-[#C9A96A] transition-colors">Home</FLink></li>
              <li><FLink to="/about" className="hover:text-[#C9A96A] transition-colors">About Kyle Friedman</FLink></li>
              <li><FLink to="/sell" className="hover:text-[#C9A96A] transition-colors">Sell Your Home</FLink></li>
              <li><FLink to="/buy" className="hover:text-[#C9A96A] transition-colors">Buyers Strategy</FLink></li>
              <li><FLink to="/listings" className="hover:text-[#C9A96A] transition-colors">Featured Listings</FLink></li>
              <li><FLink to="/blog" className="hover:text-[#C9A96A] transition-colors">Market Intelligence Report</FLink></li>
              <li><FLink to="/team" className="hover:text-[#C9A96A] transition-colors">Meet the Team</FLink></li>
            </ul>
          </div>

          {/* Key Markets */}
          <div className="space-y-3">
            <h5 className="text-xs font-bold uppercase tracking-widest text-[#C9A96A]">
              Key Markets
            </h5>
            <ul className="space-y-2 text-xs text-[#FAF8F5]/80">
              <li><FLink to="/neighborhoods" className="hover:text-[#C9A96A] transition-colors">Carroll County Real Estate</FLink></li>
              <li><FLink to="/neighborhoods" className="hover:text-[#C9A96A] transition-colors">Baltimore County Valleys</FLink></li>
              <li><FLink to="/neighborhoods" className="hover:text-[#C9A96A] transition-colors">Howard County Estates</FLink></li>
              <li><FLink to="/neighborhoods" className="hover:text-[#C9A96A] transition-colors">Frederick County Homes</FLink></li>
              <li><FLink to="/neighborhoods" className="hover:text-[#C9A96A] transition-colors">Fulton & Maple Lawn</FLink></li>
              <li><FLink to="/neighborhoods" className="hover:text-[#C9A96A] transition-colors">Eldersburg & Sykesville</FLink></li>
              <li><FLink to="/neighborhoods" className="hover:text-[#C9A96A] transition-colors">Mount Airy Farms</FLink></li>
              <li><FLink to="/luxury" className="hover:text-[#C9A96A] transition-colors">Fine Homes & Estates</FLink></li>
            </ul>
          </div>

          {/* Strategic Tools */}
          <div className="space-y-3">
            <h5 className="text-xs font-bold uppercase tracking-widest text-[#C9A96A]">
              Strategic Tools
            </h5>
            <div className="space-y-2">
              <button
                onClick={onOpenValuation}
                className="w-full text-left bg-[#1A2E33] border border-[#C9A96A]/40 hover:border-[#C9A96A] p-2.5 rounded-xs transition-colors text-xs font-semibold text-[#C9A96A] block"
              >
                Complimentary Home Valuation
              </button>
              <button
                onClick={onOpenConsultation}
                className="w-full text-left bg-[#0F5C63] hover:bg-[#0F5C63]/80 p-2.5 rounded-xs transition-colors text-xs font-semibold text-[#FAF8F5] block"
              >
                Schedule Consultation
              </button>
              <FLink
                to="/contact"
                className="w-full text-left text-xs text-[#A8B2A1] hover:text-[#C9A96A] pt-1 block"
              >
                Confidential Lead Office
              </FLink>
            </div>
          </div>

        </div>

        {/* Bottom Disclaimers & Licensing */}
        <div className="pt-8 text-[11px] text-[#A8B2A1] space-y-4">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-[#C9A96A]" />
              <span>Kyle Friedman | Licensed Real Estate Advisor | eXp Realty LLC</span>
            </div>
            <div className="flex items-center space-x-4 text-[11px]">
              <span>Equal Housing Opportunity</span>
              <span>•</span>
              <span>Realtor® Member</span>
              <span>•</span>
              <span>Bright MLS IDX Participant</span>
            </div>
          </div>

          <p className="leading-relaxed opacity-75">
            Disclaimer: The Friedman Team is affiliated with eXp Realty. All material presented herein is intended for information purposes only. Information is compiled from sources deemed reliable but is subject to errors, omissions, changes in price, condition, sale, or withdrawal without notice. No statement is made as to accuracy of any description. All measurements and square footages are approximate. Equal Housing Opportunity.
          </p>

          <div className="text-center md:text-left text-[10px] text-[#A8B2A1]/60 pt-2 border-t border-[#FAF8F5]/5">
            © {new Date().getFullYear()} The Friedman Team | eXp Realty. All Rights Reserved.
            {' · '}
            <FLink to="/privacy-policy" className="hover:text-[#C9A96A] transition-colors underline">Privacy Policy</FLink>
            {' · '}
            <FLink to="/terms-of-use" className="hover:text-[#C9A96A] transition-colors underline">Terms of Use</FLink>
          </div>

          {/* Bottom mini nav row */}
          <div className="flex flex-wrap items-center justify-center gap-x-8 gap-y-2 pt-4 border-t border-[#FAF8F5]/5 text-[11px] font-semibold uppercase tracking-widest text-[#FAF8F5]/60">
            <FLink to="/" className="hover:text-[#C9A96A] transition-colors">Home</FLink>
            <FLink to="/team" className="hover:text-[#C9A96A] transition-colors">Meet the Team</FLink>
            <FLink to="/listings" className="hover:text-[#C9A96A] transition-colors">Featured Properties</FLink>
            <FLink to="/testimonials" className="hover:text-[#C9A96A] transition-colors">Testimonials</FLink>
            <FLink to="/contact" className="hover:text-[#C9A96A] transition-colors">Let's Connect</FLink>
          </div>
        </div>

      </div>
    </footer>
  );
};
