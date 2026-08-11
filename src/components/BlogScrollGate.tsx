import React, { useEffect, useState } from 'react';
import { Mail, ArrowRight, Loader2 } from 'lucide-react';
import { submitLead } from '../lib/leads';

const UNLOCK_KEY = 'friedman_blog_gate_unlocked'; // once unlocked, stays
// unlocked for every post for the rest of the session - a converted
// visitor doesn't get re-gated reading something else five minutes later.

// Replaces the earlier scroll-bar + exit-intent pair with a single,
// more direct mechanism: once someone's read a real amount of the post,
// the rest blurs and body scroll locks until they submit their info.
//
// SEO note: this doesn't hide the article from search engines - the
// full text stays in the page's HTML the entire time; the blur is a
// pure CSS/JS runtime effect triggered by a scroll event, and crawlers
// parse the rendered page rather than simulating a human scrolling
// partway down and stopping. That's different from actually removing
// or hiding content from the page.
export const BlogScrollGate: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [pastThreshold, setPastThreshold] = useState(false);
  const [unlocked, setUnlocked] = useState(() => sessionStorage.getItem(UNLOCK_KEY) === 'true');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (unlocked) return;
    const handleScroll = () => {
      const scrollableHeight = document.body.scrollHeight - window.innerHeight;
      if (scrollableHeight <= 0) return;
      const scrollPercent = (window.scrollY / scrollableHeight) * 100;
      if (scrollPercent > 25) setPastThreshold(true);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [unlocked]);

  const gated = pastThreshold && !unlocked;

  useEffect(() => {
    document.body.style.overflow = gated ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [gated]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setError(null);

    const { ok, error: err } = await submitLead({
      name,
      email,
      type: 'Registration',
      message: 'Unlocked a blog post via the scroll gate.',
    });

    setSubmitting(false);

    if (!ok) {
      setError(err || 'Something went wrong. Please try again.');
      return;
    }

    sessionStorage.setItem(UNLOCK_KEY, 'true');
    setUnlocked(true);
  };

  return (
    <div className="relative">
      <div className={gated ? 'blur-md select-none pointer-events-none' : ''} aria-hidden={gated}>
        {children}
      </div>

      {gated && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#0D2226]/60 animate-[fadeIn_0.25s_ease]">
          <form onSubmit={handleSubmit} className="w-full max-w-sm bg-[#FAF8F5] shadow-2xl p-7">
            <div className="text-center mb-5">
              <Mail className="w-6 h-6 text-[#C9A96A] mx-auto mb-2" />
              <p className="font-serif text-xl font-bold text-[#0D2226]">Keep Reading</p>
              <p className="text-xs text-[#1C2B2E]/70 mt-1.5">Enter your info to continue, and get next week's Maryland market report free.</p>
            </div>
            <div className="space-y-2.5">
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
                {submitting ? 'Unlocking...' : 'Continue Reading'}
              </button>
            </div>
            <p className="text-[10px] text-[#1C2B2E]/40 text-center mt-3">Never sold or shared.</p>
          </form>
        </div>
      )}
    </div>
  );
};
