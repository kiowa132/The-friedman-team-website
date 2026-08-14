import React from 'react';
import { Phone } from 'lucide-react';

interface FloatingContactButtonProps {
  onOpenConsultation: () => void;
}

// A persistent, site-wide contact entry point - stays fixed on screen
// through scroll, reachable from anywhere on the site regardless of what
// page section someone's looking at. Never blocks content, just sits in
// the corner as a quiet, always-available option.
export const FloatingContactButton: React.FC<FloatingContactButtonProps> = ({ onOpenConsultation }) => {
  return (
    <button
      onClick={onOpenConsultation}
      className="fixed bottom-5 left-5 z-40 inline-flex items-center gap-2 pl-4 pr-5 py-3 bg-[#C9A96A] hover:bg-[#D4AF37] text-[#0D2226] font-bold text-xs uppercase tracking-widest rounded-full shadow-xl transition-colors"
    >
      <Phone className="w-3.5 h-3.5" />
      Contact Us
    </button>
  );
};
