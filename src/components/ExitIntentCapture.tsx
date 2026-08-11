import React, { useEffect, useState } from 'react';
import { X, Mail, ArrowRight, Loader2, CheckCircle2 } from 'lucide-react';
import { submitLead } from '../lib/leads';

const SHOWN_KEY = 'friedman_scroll_subscribe_dismissed'; // shared with
// ScrollSubscribePrompt on purpose - whichever of the two fires first
// this session, the other stays quiet. One soft interruption per
// session, not two competing ones.
const EXIT_SHOWN_KEY = 'friedman_exit_intent_shown';

// Fires once, only on desktop (mouse-leave-to-top is meaningless on a
// touchscreen), only if the scroll-triggered prompt hasn't already
// appeared this session, and only for someone who's actually read some
// of the article - not someone who just landed and immediately moved
// their mouse toward the tab bar. Captures a real lead via submitLead,
// rather than just linking out, since this is the last real chance to
// catch someone before they leave.
export const ExitIntentCapture: React.FC = () => {
  const [visible, setVisible] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    if (sessionStorage.getItem(SHOWN_KEY) === 'true' || sessionStorage.getItem(EXIT_SHOWN_KEY) === 'true') {
      return;
    }

    let hasScrolledEnough = false;
    const handleScroll = () => {
      if (window.scrollY > 400) hasScrolledEnough = true;
    };

    const handleMouseLeave = (e: MouseEvent) => {
      if (e.clientY > 0 || !hasScrolledEnough) return;
      if (sessionStorage.getItem(SHOWN_KEY) === 'true') return; // scroll prompt won the race
      setVisible(true);
      sessionStorage.setItem(EXIT_SHOWN_KEY, 'true');
      document.removeEventListener('mouseleave', handleMouseLeave);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    document.addEventListener('mouseleave', handleMouseLeave);
    return () => {
      window.removeEventListener('scroll', handleScroll);
      document.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, []);

  const handleClose = () => setVisible(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setError(null);

    const { ok, error: err } = await submitLead({
      name,
      email,
      type: 'Registration',
      message: 'Subscribed to the Friedman Report via exit-intent prompt on a blog post.',
    });

    setSubmitting(false);

    if (!ok) {
      setError(err || 'Something went wrong. Please try again.');
      return;
    }

    setSuccess(true);
    setTimeout(handleClose, 2500);
  };

  if (!visible) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#0D2226]/70 animate-[fadeIn_0.25s_ease]">
      <div className="relative w-full max-w-sm bg-[#FAF8F5] shadow-2xl p-7">
        <button onClick={handleClose} aria-label="Close" className="absolute top-3 right-3 text-[#1C2B2E]/40 hover:text-[#1C2B2E] transition-colors">
          <X className="w-4 h-4" />
        </button>

        {success ? (
          <div className="text-center py-4">
            <CheckCircle2 className="w-8 h-8 text-[#0F5C63] mx-auto mb-3" />
            <p className="font-serif text-lg font-bold text-[#0D2226]">You're In</p>
            <p className="text-xs text-[#1C2B2E]/70 mt-1">Next week's report lands straight in your inbox.</p>
          </div>
        ) : (
          <>
            <div className="text-center mb-5">
              <Mail className="w-6 h-6 text-[#C9A96A] mx-auto mb-2" />
              <p className="font-serif text-xl font-bold text-[#0D2226]">Before You Go</p>
              <p className="text-xs text-[#1C2B2E]/70 mt-1.5">Get next week's Maryland market report free, straight to your inbox.</p>
            </div>
            <form onSubmit={handleSubmit} className="space-y-2.5">
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="First name"
                className="w-full border border-[#0D2226]/20 p-2.5 text-xs bg-white focus:border-[#0F5C63] focus:outline-none"
              />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Email address"
                className="w-full border border-[#0D2226]/20 p-2.5 text-xs bg-white focus:border-[#0F5C63] focus:outline-none"
              />
              {error && <p className="text-[11px] text-red-600">{error}</p>}
              <button
                type="submit"
                disabled={submitting}
                className="w-full py-2.5 bg-[#0D2226] hover:bg-[#0F5C63] text-[#FAF8F5] font-bold text-xs uppercase tracking-widest transition-colors flex items-center justify-center gap-2 disabled:opacity-60"
              >
                {submitting ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <ArrowRight className="w-3.5 h-3.5" />}
                {submitting ? 'Subscribing...' : 'Subscribe Free'}
              </button>
            </form>
            <button onClick={handleClose} className="w-full text-center text-[11px] text-[#1C2B2E]/40 hover:text-[#1C2B2E]/60 mt-3 transition-colors">
              No thanks, just reading
            </button>
          </>
        )}
      </div>
    </div>
  );
};
