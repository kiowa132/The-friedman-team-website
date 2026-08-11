import { useEffect } from 'react';

// Lightweight per-page <title>, meta description, and canonical link
// setter - no extra dependency needed (like react-helmet) for a site
// this size. Just updates the document head directly.
//
// Canonical tags previously only existed via middleware.ts, which only
// covers a handful of route patterns (/, /neighborhoods, /blog/:slug,
// /guides/:slug). Every other page - listings, calculators, about,
// contact, luxury pages, and more - had no canonical tag at all. This
// gives every page using this hook a real canonical tag too, as a
// client-side fallback (Google's crawler does execute JS reliably) for
// the routes middleware.ts doesn't reach.
export function usePageMeta(title: string, description: string) {
  useEffect(() => {
    const prevTitle = document.title;
    document.title = title;

    let meta = document.querySelector('meta[name="description"]');
    const prevDescription = meta?.getAttribute('content') || '';
    if (!meta) {
      meta = document.createElement('meta');
      meta.setAttribute('name', 'description');
      document.head.appendChild(meta);
    }
    meta.setAttribute('content', description);

    let canonical = document.querySelector('link[rel="canonical"]');
    const prevCanonical = canonical?.getAttribute('href') || null;
    const canonicalUrl = `https://www.friedmanreteam.com${window.location.pathname}`;
    if (!canonical) {
      canonical = document.createElement('link');
      canonical.setAttribute('rel', 'canonical');
      document.head.appendChild(canonical);
    }
    canonical.setAttribute('href', canonicalUrl);

    return () => {
      document.title = prevTitle;
      meta?.setAttribute('content', prevDescription);
      if (prevCanonical) {
        canonical?.setAttribute('href', prevCanonical);
      }
    };
  }, [title, description]);
}
