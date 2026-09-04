// Thin wrapper around gtag (GA4, loaded in index.html with
// send_page_view: false — this file is what actually sends page views and
// events, so it works with client-side routing instead of only firing once
// on the initial full-page load).
//
// Safe to call anywhere: no-ops instead of throwing if gtag hasn't loaded
// yet (slow network, an ad blocker, or local dev without the script).

declare global {
  interface Window {
    dataLayer?: unknown[];
    gtag?: (...args: unknown[]) => void;
  }
}

export function trackPageview(path: string, title?: string): void {
  if (typeof window === 'undefined' || typeof window.gtag !== 'function') return;
  window.gtag('event', 'page_view', {
    page_path: path,
    page_title: title || document.title,
    page_location: window.location.href,
  });
}

export function trackEvent(name: string, params: Record<string, unknown> = {}): void {
  if (typeof window === 'undefined' || typeof window.gtag !== 'function') return;
  window.gtag('event', name, params);
}
