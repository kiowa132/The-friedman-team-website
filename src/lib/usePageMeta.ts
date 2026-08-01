import { useEffect } from 'react';

// Lightweight per-page <title> and meta description setter - no extra
// dependency needed (like react-helmet) for a site this size. Just updates
// the document head directly.
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

    return () => {
      document.title = prevTitle;
      meta?.setAttribute('content', prevDescription);
    };
  }, [title, description]);
}
