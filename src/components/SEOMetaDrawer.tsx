import React, { useState } from 'react';
import { ShieldCheck, Code, Globe, Search, Check, Copy } from 'lucide-react';

export const SEOMetaDrawer: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [copied, setCopied] = useState(false);

  const schemaData = {
    "@context": "https://schema.org",
    "@type": "RealEstateAgent",
    "name": "The Friedman Team | eXp Realty",
    "image": "https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&w=800&q=80",
    "url": "https://REPLACE-WITH-YOUR-DOMAIN.com/", // TODO: set this to your live domain once deployed
    "telephone": "+1-443-789-3101",
    "priceRange": "$$$$",
    "address": {
      "@type": "PostalAddress",
      "streetAddress": "8115 Maple Lawn Blvd #350",
      "addressLocality": "Fulton",
      "addressRegion": "MD",
      "postalCode": "20759",
      "addressCountry": "US"
    },
    "areaServed": [
      { "@type": "AdministrativeArea", "name": "Carroll County, MD" },
      { "@type": "AdministrativeArea", "name": "Baltimore County, MD" },
      { "@type": "AdministrativeArea", "name": "Howard County, MD" },
      { "@type": "City", "name": "Fulton" },
      { "@type": "City", "name": "Westminster" },
      { "@type": "City", "name": "Sykesville" },
      { "@type": "City", "name": "Mount Airy" }
    ],
    "founder": {
      "@type": "Person",
      "name": "Kyle Friedman",
      "jobTitle": "Principal Luxury Real Estate Advisor"
    },
    "knowsAbout": [
      "Luxury Home Representation",
      "Equestrian Farms & Land Preservation",
      "Strategic Pricing Analysis",
      "Off-Market Private Placements"
    ]
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(JSON.stringify(schemaData, null, 2));
    setCopied(true);
    setTimeout(() => setCopied(false), 3000);
  };

  return (
    <div className="fixed bottom-4 right-4 z-40">
      {!isOpen ? (
        <button
          onClick={() => setIsOpen(true)}
          id="seo-drawer-toggle"
          className="bg-[#0D2226] border border-[#C9A96A] text-[#C9A96A] text-[10px] font-bold uppercase tracking-wider px-3 py-2 rounded-full shadow-2xl flex items-center gap-1.5 hover:bg-[#0F5C63] transition-colors"
        >
          <Code className="w-3.5 h-3.5" />
          <span>SEO & Schema Inspector</span>
        </button>
      ) : (
        <div className="bg-[#0D2226] text-[#FAF8F5] border border-[#C9A96A] p-4 rounded-xs shadow-2xl max-w-sm w-80 text-xs space-y-3 animate-fadeIn">
          <div className="flex items-center justify-between border-b border-[#FAF8F5]/10 pb-2">
            <div className="flex items-center gap-1.5 text-[#C9A96A] font-bold uppercase text-[10px]">
              <Globe className="w-3.5 h-3.5" />
              <span>RealEstateAgent Schema</span>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="text-[#FAF8F5]/60 hover:text-[#FAF8F5]"
            >
              ✕
            </button>
          </div>

          <p className="text-[11px] text-[#A8B2A1]">
            Active JSON-LD Schema markup configured for Google Local SEO & Bright MLS indexing.
          </p>

          <div className="bg-[#1A2E33] p-2.5 rounded-xs max-h-40 overflow-y-auto font-mono text-[10px] text-[#A8B2A1] border border-[#FAF8F5]/10 leading-tight">
            <pre>{JSON.stringify(schemaData, null, 2)}</pre>
          </div>

          <button
            onClick={handleCopy}
            className="w-full py-2 bg-[#0F5C63] hover:bg-[#C9A96A] hover:text-[#0D2226] text-[#FAF8F5] text-[10px] font-bold uppercase tracking-wider rounded-xs transition-colors flex items-center justify-center gap-1"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-green-400" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{copied ? 'Copied to Clipboard' : 'Copy Schema JSON'}</span>
          </button>
        </div>
      )}
    </div>
  );
};
