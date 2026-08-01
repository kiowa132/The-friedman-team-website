import React from 'react';
import { Heart, Home as HomeIcon, GraduationCap, Users, PawPrint, TreePine } from 'lucide-react';
import { usePageMeta } from '../lib/usePageMeta';

// Generic placeholder charity categories, NOT real logos or real partner
// names - Kyle hasn't confirmed specific charity partnerships yet. Swap
// these for real charity names/logos once he has them; the auto-scroll
// carousel mechanics below will work the same either way.
const CHARITY_PLACEHOLDERS = [
  { icon: HomeIcon, label: 'Local Housing Charities' },
  { icon: GraduationCap, label: 'Youth Education Programs' },
  { icon: PawPrint, label: 'Animal Rescue Organizations' },
  { icon: Users, label: 'Community Support Services' },
  { icon: TreePine, label: 'Land & Conservation Groups' },
  { icon: Heart, label: 'Local Health Charities' },
];

export const GivingBackPage: React.FC = () => {
  usePageMeta(
    'Giving Back | The Friedman Team',
    'Every referral to The Friedman Team means a real donation to a cause you care about, at closing.'
  );

  // Duplicate the list once so the CSS marquee loop has no visible seam.
  const scrollItems = [...CHARITY_PLACEHOLDERS, ...CHARITY_PLACEHOLDERS];

  return (
    <div className="pt-28 pb-20 bg-[#FAF8F5]">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 text-center space-y-6">
        <h1 className="font-serif text-4xl sm:text-5xl font-bold text-[#0D2226]">
          You Can Make a Difference!
        </h1>
        <p className="text-sm sm:text-base text-[#1C2B2E]/80 leading-relaxed">
          Your referrals mean the world to us, and they also help contribute to a great local cause. For every introduction to a friend, family member, or coworker, we will make a $250 donation in your honor to the charity of your choice at closing.
        </p>

        <div className="bg-[#0D2226] text-[#FAF8F5] border border-[#C9A96A]/40 p-6 rounded-xs text-left space-y-2">
          <p className="text-xs font-bold uppercase tracking-widest text-[#C9A96A]">How to Refer Someone</p>
          <p className="text-sm text-[#A8B2A1] leading-relaxed">
            Send a 3-way text message to <a href="tel:4437893101" className="text-[#C9A96A] font-bold underline">443-789-3101</a> with something like:
          </p>
          <p className="text-sm italic text-[#FAF8F5] bg-[#1A2E33] p-4 rounded-xs">
            "Hi [Jane/John], connecting you here with The Friedman Team to chat about your real estate goals. Please donate to [charity of your choice]."
          </p>
        </div>
      </div>

      {/* Auto-scrolling charity carousel - pure CSS marquee, no library
          needed. Swap CHARITY_PLACEHOLDERS above for real charity
          names/logos once confirmed. */}
      <div className="pt-16 overflow-hidden">
        <style>{`
          @keyframes charity-scroll {
            from { transform: translateX(0); }
            to { transform: translateX(-50%); }
          }
          .charity-track {
            animation: charity-scroll 30s linear infinite;
          }
        `}</style>
        <div className="flex charity-track w-max">
          {scrollItems.map((c, i) => (
            <div
              key={i}
              className="flex flex-col items-center justify-center gap-2 w-48 shrink-0 px-6 py-8 mx-2 bg-white border border-[#C9A96A]/30 rounded-xs shadow-sm"
            >
              <c.icon className="w-8 h-8 text-[#C9A96A]" />
              <span className="text-xs font-semibold text-[#0D2226] text-center leading-tight">{c.label}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
