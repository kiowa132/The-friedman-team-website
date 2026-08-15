import React, { useState } from 'react';
import { Lock, ArrowRight, Loader2, CheckCircle2 } from 'lucide-react';
import { m, AnimatePresence } from 'motion/react';
import { DURATION, EASE_PREMIUM } from '../lib/motion';
import { submitLead } from '../lib/leads';

interface GatedResultsProps {
  calculatorName: string;
  resultsSummary: string; // plain-text snapshot of the live numbers at
  // the moment of unlock, sent as real context in the lead message.
  hasInteracted: boolean; // true once any input has changed from its
  // starting value - results show clearly (a taste, using the starting
  // numbers) until this flips true, at which point the blur kicks in.
  // This lets someone see the tool actually works before asking for
  // anything, then gates the moment they customize it to their own
  // situation - the exact number they actually came for.
  children: React.ReactNode; // the actual results panel content - stays
  // live-computed underneath the blur the whole time, so the reveal on
  // unlock is instant with correct numbers, not a second load.
}

// Blurs the results panel once someone starts customizing the inputs to
// their own situation, until a real name + email is submitted. Shows the
// results clearly at first (using whatever starting numbers are already
// filled in) so a visitor can see the tool actually works before being
// asked for anything - the gate only kicks in the moment they change
// something, which is also the exact moment the number on screen becomes
// personal enough to be worth capturing.
//
// This is a deliberate exception to "never gate content" - the calculator
// inputs, labels, and surrounding page text all stay fully open and
// indexable regardless (that's what protects SEO), but a specific numeric
// result computed from whatever a visitor typed in was never something
// Google could index anyway, since it can't fill in the form itself.
// Gating just that output costs nothing on the SEO side.
export const GatedResults: React.FC<GatedResultsProps> = ({ calculatorName, resultsSummary, hasInteracted, children }) => {
  const [unlocked, setUnlocked] = useState(false);
  const [justUnlocked, setJustUnlocked] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const gated = hasInteracted && !unlocked;

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

    // Brief success checkmark before the overlay clears, so the unlock
    // feels like a confirmed action rather than the form just vanishing.
    setJustUnlocked(true);
    setTimeout(() => {
      setUnlocked(true);
    }, 700);
  };

  return (
    <div className="relative w-full">
      {/* Real, live-computed results - always rendered, just visually
          obscured once gated, so the reveal is instant and correct the
          moment someone submits, not a second fetch or recompute. */}
      <m.div
        animate={{
          filter: gated ? 'blur(8px)' : 'blur(0px)',
          scale: gated ? 0.98 : 1,
        }}
        transition={{ duration: DURATION.slow, ease: EASE_PREMIUM }}
        className={gated ? 'select-none pointer-events-none' : ''}
        aria-hidden={gated}
      >
        {children}
      </m.div>

      <AnimatePresence>
        {gated && (
          <m.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, transition: { duration: DURATION.fast } }}
            className="absolute inset-0 flex items-center justify-center p-4"
          >
            <AnimatePresence mode="wait">
              {justUnlocked ? (
                <m.div
                  key="success"
                  initial={{ opacity: 0, scale: 0.85 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: DURATION.fast, ease: EASE_PREMIUM }}
                  className="w-full max-w-xs bg-[#0D2226] border border-[#C9A96A]/50 shadow-2xl p-6 flex flex-col items-center gap-2"
                >
                  <m.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ duration: DURATION.base, ease: EASE_PREMIUM, delay: 0.05 }}
                  >
                    <CheckCircle2 className="w-8 h-8 text-[#8FBFAE]" />
                  </m.div>
                  <p className="text-xs font-bold uppercase tracking-widest text-[#FAF8F5]">Unlocked</p>
                </m.div>
              ) : (
                <m.form
                  key="form"
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  transition={{ duration: DURATION.base, ease: EASE_PREMIUM }}
                  onSubmit={handleSubmit}
                  className="w-full max-w-xs bg-[#0D2226] border border-[#C9A96A]/50 shadow-2xl p-5 space-y-3"
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
                </m.form>
              )}
            </AnimatePresence>
          </m.div>
        )}
      </AnimatePresence>
    </div>
  );
};
