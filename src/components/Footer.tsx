import React from 'react';
import { Mail, Phone, MapPin, ShieldCheck, Facebook, Instagram, Linkedin } from 'lucide-react';

interface FooterProps {
  setActiveTab: (tab: string) => void;
  onOpenValuation: () => void;
  onOpenConsultation: () => void;
}

export const Footer: React.FC<FooterProps> = ({
  setActiveTab,
}) => {
  const goTo = (tab: string) => {
    setActiveTab(tab);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="bg-[#FAF8F5] text-[#0D2226] border-t border-[#0D2226]/10 pt-16 pb-8">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* eXp Realty logo, matching Canopy's prominent footer treatment */}
        <div className="flex justify-center sm:justify-start pb-8">
          <img
            src="/images/brand/exp-realty-logo.png"
            alt="eXp Realty"
            className="h-14 w-auto object-contain"
          />
        </div>

        {/* Top row: brand mark + address + contact details, matching
            Canopy's 3-part footer header */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-10 pb-10">
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-[#0F5C63] border border-[#C9A96A] flex items-center justify-center text-[#C9A96A] font-serif font-bold text-xl">
                F
              </div>
              <div>
                <h4 className="font-serif text-lg font-bold tracking-wider text-[#0D2226]">
                  THE FRIEDMAN TEAM
                </h4>
                <p className="text-[10px] text-[#0F5C63] uppercase tracking-widest font-bold">
                  eXp Realty
                </p>
              </div>
            </div>
            <p className="text-xs text-[#1C2B2E]/70 leading-relaxed max-w-xs">
              A reputation for unrelenting work ethic, integrity, and honesty, backed by real local market knowledge.
            </p>
          </div>

          <div className="space-y-2">
            <h5 className="text-[11px] font-bold uppercase tracking-widest text-[#0F5C63]">Address</h5>
            <div className="flex items-start gap-2 text-xs text-[#1C2B2E]/80">
              <MapPin className="w-3.5 h-3.5 text-[#C9A96A] mt-0.5 shrink-0" />
              <span>8115 Maple Lawn Blvd, Suite 350<br />Fulton, MD 20759</span>
            </div>
          </div>

          <div className="space-y-2">
            <h5 className="text-[11px] font-bold uppercase tracking-widest text-[#0F5C63]">Contact Details</h5>
            <div className="space-y-1.5 text-xs text-[#1C2B2E]/80">
              <a href="tel:4437893101" className="flex items-center gap-2 hover:text-[#0F5C63] transition-colors">
                <Phone className="w-3.5 h-3.5 text-[#C9A96A]" />
                <span>(443) 789-3101</span>
              </a>
              <a href="mailto:kyle@friedmanreteam.com" className="flex items-center gap-2 hover:text-[#0F5C63] transition-colors">
                <Mail className="w-3.5 h-3.5 text-[#C9A96A]" />
                <span>kyle@friedmanreteam.com</span>
              </a>
            </div>
          </div>
        </div>

        {/* Connect With Us */}
        <div className="flex items-center justify-center sm:justify-start gap-3 py-6 border-t border-[#0D2226]/10">
          <span className="text-[11px] font-bold uppercase tracking-widest text-[#0F5C63] mr-2">Connect With Us</span>
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

        {/* Licensing badges + copyright row, matching Canopy's bottom bar */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 py-6 border-t border-[#0D2226]/10 text-[11px] text-[#1C2B2E]/60">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-1.5" title="Equal Housing Opportunity">
              <ShieldCheck className="w-4 h-4 text-[#0F5C63]" />
              <span className="font-semibold">Equal Housing Opportunity</span>
            </div>
            <span>•</span>
            <span className="font-semibold">Realtor® Member</span>
          </div>
          <span>© {new Date().getFullYear()} The Friedman Team | eXp Realty. All Rights Reserved.</span>
        </div>

        {/* MLS / general disclaimer */}
        <p className="text-[10px] text-[#1C2B2E]/50 leading-relaxed pb-8 text-center sm:text-left">
          All information is deemed reliable but not guaranteed and should be independently reviewed and verified. Kyle Friedman is a licensed real estate salesperson in the state of Maryland, affiliated with eXp Realty. This is not intended to solicit property already listed.
        </p>

        {/* Bottom mini nav row, matching Canopy's exact pattern */}
        <div className="flex flex-wrap items-center justify-center gap-x-8 gap-y-2 pt-6 border-t border-[#0D2226]/10 text-[11px] font-semibold uppercase tracking-widest text-[#0D2226]/70">
          <button onClick={() => goTo('home')} className="hover:text-[#0F5C63] transition-colors">Home</button>
          <button onClick={() => goTo('team')} className="hover:text-[#0F5C63] transition-colors">Meet the Team</button>
          <button onClick={() => goTo('listings')} className="hover:text-[#0F5C63] transition-colors">Featured Properties</button>
          <button onClick={() => goTo('home')} className="hover:text-[#0F5C63] transition-colors">Testimonials</button>
          <button onClick={() => goTo('contact')} className="hover:text-[#0F5C63] transition-colors">Let's Connect</button>
        </div>

      </div>
    </footer>
  );
};
