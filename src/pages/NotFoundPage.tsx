import React from 'react';
import { Link } from 'react-router-dom';
import { usePageMeta } from '../lib/usePageMeta';

// Catch-all for any URL that doesn't match a real route (typo, stale
// bookmark, broken link from somewhere else). Without this, an unmatched
// path rendered nothing at all inside the layout - just the header and
// footer around a blank content area, with no indication anything was
// wrong and no way back.
export const NotFoundPage: React.FC = () => {
  usePageMeta(
    'Page Not Found | The Friedman Team',
    'The page you were looking for could not be found.'
  );

  return (
    <div className="pt-32 pb-24 text-center max-w-2xl mx-auto px-4">
      <p className="text-xs font-bold uppercase tracking-[0.25em] text-[#0F5C63] mb-4">404</p>
      <h1 className="font-serif text-3xl sm:text-4xl font-bold text-[#0D2226] mb-3">Page Not Found</h1>
      <p className="text-sm text-[#1C2B2E]/70 mb-8">
        The page you're looking for may have moved or no longer exists. Here are a few places to go instead.
      </p>
      <div className="flex flex-wrap items-center justify-center gap-3">
        <Link to="/" className="px-6 py-3 bg-[#0D2226] text-[#FAF8F5] font-bold text-xs uppercase tracking-widest rounded-xs">
          Back to Home
        </Link>
        <Link to="/listings" className="px-6 py-3 border border-[#0D2226] text-[#0D2226] font-bold text-xs uppercase tracking-widest rounded-xs">
          View Listings
        </Link>
        <Link to="/contact" className="px-6 py-3 border border-[#0D2226] text-[#0D2226] font-bold text-xs uppercase tracking-widest rounded-xs">
          Contact Kyle Friedman
        </Link>
      </div>
    </div>
  );
};
