import React, { useState } from 'react';
import { Lock, ArrowRight, Loader2 } from 'lucide-react';
import { submitLead } from '../lib/leads';

interface GatedResultsProps {
  calculatorName: string;
  resultsSummary: string; // plain-text snapshot of the live numbers at
  // the moment of unlock, sent as real context in the lead message.
  children: React.ReactNode; // the actual results panel content - stays
  // live-computed underneath the blur the whole time, so the reveal on
  // unlock is instant with correct numbers, not a second load.
}

// Blurs the results panel until a real name + email is submitted. This is
// a deliberate exception to "never gate content" - the calculator inputs,
// labels, and surrounding page text all stay fully open and indexable
// regardless (that's what protects SEO), but a specific numeric result
// computed from whatever a visitor typed in was never something Google
// could index anyway, since it can't fill in the form itself. Gating
// just that output costs nothing on the SEO side.
export const GatedResults: React.FC<GatedResultsProps> = ({ calculatorName, resultsSummary, children }) => {
  const [unlocked, setUnlocked] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setError(null);

    const { ok, error: err } = await submitLead({
      name,
      email,
      type: 'Registration',
      message: `Unlocked their ${calculatorName} results.\n\n${resultsSummary}`,
    });

    setSubmitting(false);

    if (!ok) {
      setError(err || 'Something went wrong. Please try again.');
      return;
    }

    setUnlocked(true);
  };

  return (
    <div className="relative w-full">
      {/* Real, live-computed results - always rendered, just visually
          obscured until unlocked, so the reveal is instant and correct
          the moment someone submits, not a second fetch or recompute. */}
      <div className={unlocked ? 'transition-all duration-500' : 'blur-md select-none pointer-events-none transition-all duration-500'} aria-hidden={!unlocked}>
        {children}
      </div>

      {!unlocked && (
        <div className="absolute inset-0 flex items-center justify-center p-4">
          <form
            onSubmit={handleSubmit}
            className="w-full max-w-xs bg-[#0D2226] border border-[#C9A96A]/50 shadow-2xl p-5 space-y-3 animate-[fadeIn_0.3s_ease]"
          >
            <div className="text-center mb-1">
              <Lock className="w-5 h-5 text-[#C9A96A] mx-auto mb-2" />
              <p className="text-xs font-bold uppercase tracking-widest text-[#FAF8F5]">Unlock Your Results</p>
              <p className="text-[11px] text-[#A8B2A1] mt-1">Enter your info to see your numbers, instantly.</p>
            </div>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="First name"
              className="w-full bg-[#FAF8F5] border border-[#FAF8F5]/20 p-2.5 text-xs text-[#0D2226] placeholder-[#1C2B2E]/50 focus:border-[#C9A96A] focus:outline-none"
            />
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Email address"
              className="w-full bg-[#FAF8F5] border border-[#FAF8F5]/20 p-2.5 text-xs text-[#0D2226] placeholder-[#1C2B2E]/50 focus:border-[#C9A96A] focus:outline-none"
            />
            {error && <p className="text-[11px] text-red-300">{error}</p>}
            <button
              type="submit"
              disabled={submitting}
              className="w-full py-2.5 bg-[#C9A96A] hover:bg-[#D4AF37] text-[#0D2226] font-bold text-xs uppercase tracking-widest transition-colors flex items-center justify-center gap-2 disabled:opacity-60"
            >
              {submitting ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <ArrowRight className="w-3.5 h-3.5" />}
              {submitting ? 'Unlocking...' : 'Show My Results'}
            </button>
            <p className="text-[10px] text-[#A8B2A1] text-center">Never sold or shared.</p>
          </form>
        </div>
      )}
    </div>
  );
};
