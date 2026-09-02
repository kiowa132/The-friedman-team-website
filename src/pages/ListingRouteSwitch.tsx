import React, { Suspense } from 'react';
import { useParams, Navigate } from 'react-router-dom';
import { SIGN_LISTINGS } from '../lib/content';
import { SignListingPage } from './SignListingPage';
import { Listing } from '../types';

// The IDX/MLS detail page is heavy (live API client, gallery, etc.) - keep
// it lazy so a hand-curated /listings/<slug> hit never downloads it.
const ListingDetailPage = React.lazy(() =>
  import('./ListingDetailPage').then((m) => ({ default: m.ListingDetailPage }))
);

interface Props {
  savedListings: string[];
  onToggleSave: (id: string) => void;
  onScheduleShowing: (listing: Listing) => void;
}

// /listings/:mlsNumber serves two different things off the same URL shape:
//   - a hand-curated sign listing  (e.g. /listings/listing-1)  -> SignListingPage
//   - a live MLS listing by number (e.g. /listings/MDBC2157082) -> ListingDetailPage
// The curated slugs are a tiny known set from content/listings/, so we
// check those first and fall through to the MLS page for everything else.
export const ListingRouteSwitch: React.FC<Props> = (props) => {
  const { mlsNumber } = useParams<{ mlsNumber: string }>();

  if (mlsNumber === 'active') {
    return <ActiveListingRedirect />;
  }

  const curated = SIGN_LISTINGS.find((l) => l.slug === mlsNumber);
  if (curated) {
    return <SignListingPage listing={curated} />;
  }

  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center bg-[#FAF8F5]">
          <div className="w-10 h-10 border-2 border-[#C9A96A] border-t-transparent rounded-full animate-spin" />
        </div>
      }
    >
      <ListingDetailPage {...props} />
    </Suspense>
  );
};

// /listings/active -> redirect to whichever curated listing is flagged
// active: true (falling back to the first one). This is the URL the For
// Sale sign's QR code should encode, so it never needs reprinting.
export const ActiveListingRedirect: React.FC = () => {
  const active = SIGN_LISTINGS.find((l) => l.active) || SIGN_LISTINGS[0];
  return <Navigate to={active ? `/listings/${active.slug}` : '/listings'} replace />;
};
