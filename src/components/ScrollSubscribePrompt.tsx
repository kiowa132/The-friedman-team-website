import React, { useEffect, useState } from 'react';
import { X } from 'lucide-react';
import { SUBSTACK_SUBDOMAIN } from '../lib/siteConfig';

const DISMISS_KEY = 'friedman_scroll_subscribe_dismissed';
const EXIT_SHOWN_KEY = 'friedman_exit_intent_shown'; // shared with
// ExitIntentCapture - if that already fired this session, this bar stays
// quiet too. One soft interruption per session, not two.

// A slide-in bar (not a blocking overlay) that appears once someone has
// scrolled about halfway through an article - real engagement signal that
// they're actually reading, not just landing on the page. Never blocks
// content, and once dismissed it won't reappear again this browser session.
export const ScrollSubscribePrompt: React.FC = () => {
  const [visible, setVisible] = useState(false);
  const [dismissed, setDismissed] = useState(false);
  const hasSubstack = SUBSTACK_SUBDOMAIN && SUBSTACK_SUBDOMAIN !== 'YOUR-SUBSTACK-SUBDOMAIN';

  useEffect(() => {
    // Don't show again this session if already dismissed once, or if
    // the exit-intent modal already caught this visitor.
    if (sessionStorage.getItem(DISMISS_KEY) === 'true' || sessionStorage.getItem(EXIT_SHOWN_KEY) === 'true') {
      setDismissed(true);
      return;
    }

    const handleScroll = () => {
      const scrollableHeight = document.body.scrollHeight - window.innerHeight;
      if (scrollableHeight <= 0) return;
      const scrollPercent = (window.scrollY / scrollableHeight) * 100;
      if (scrollPercent > 50) {
        setVisible(true);
        // Marked as "shown" the moment it appears, not just on dismiss -
        // this is what ExitIntentCapture checks to avoid popping up on
        // top of this bar if both would otherwise fire around the same
        // time.
        sessionStorage.setItem(DISMISS_KEY, 'true');
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleDismiss = () => {
    setVisible(false);
    setDismissed(true);
    sessionStorage.setItem(DISMISS_KEY, 'true');
  };

  if (!hasSubstack || dismissed) return null;

  return (
    <div
      className={`fixed bottom-0 left-0 right-0 z-40 transition-transform duration-500 ${
        visible ? 'translate-y-0' : 'translate-y-full'
      }`}
    >
      <div className="max-w-2xl mx-auto m-3 bg-[#0D2226] border border-[#C9A96A] rounded-xs shadow-2xl p-4 flex items-center gap-4">
        <img src="/images/subscribe-bell-badge-white.png" alt="" className="h-7 w-auto shrink-0 hidden sm:block" />
        <p className="text-xs text-[#FAF8F5] flex-1">
          Enjoying this? Get next week's report free, straight to your inbox.
        </p>
        <a
          href={`https://${SUBSTACK_SUBDOMAIN}.substack.com`}
          target="_blank"
          rel="noopener noreferrer"
          className="shrink-0 px-4 py-2 bg-[#C9A96A] text-[#0D2226] font-bold text-xs uppercase tracking-wider rounded-xs hover:bg-[#D4AF37] transition-colors"
        >
          Subscribe
        </a>
        <button
          onClick={handleDismiss}
          aria-label="Dismiss"
          className="shrink-0 text-[#A8B2A1] hover:text-[#FAF8F5] transition-colors"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
