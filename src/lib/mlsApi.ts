import { Listing } from '../types';

export interface MlsSearchParams {
  county?: string;
  propertyType?: string;
  maxPrice?: number;
  minPrice?: number;
  minBeds?: number;
  q?: string;
  skip?: number;
  top?: number;
}

export type MlsSearchResult =
  | { status: 'ok'; listings: Listing[]; total: number; hasMore?: boolean; nextSkip?: number; debugInfo?: any }
  | { status: 'not_configured'; message: string; debugInfo?: any }
  | { status: 'error'; message: string; debugInfo?: any };

export async function fetchMlsListings(params: MlsSearchParams): Promise<MlsSearchResult> {
  const query = new URLSearchParams();
  if (params.county) query.set('county', params.county);
  if (params.propertyType) query.set('propertyType', params.propertyType);
  if (params.maxPrice) query.set('maxPrice', String(params.maxPrice));
  if (params.minPrice) query.set('minPrice', String(params.minPrice));
  if (params.minBeds) query.set('minBeds', String(params.minBeds));
  if (params.q) query.set('q', params.q);
  if (params.skip) query.set('skip', String(params.skip));
  if (params.top) query.set('top', String(params.top));

  try {
    const res = await fetch(`/api/mls/search?${query.toString()}`);
    const data = await res.json();

    if (res.status === 501 || data?.error === 'MLS_NOT_CONFIGURED') {
      return { status: 'not_configured', message: data?.message || 'MLS feed not connected yet.', debugInfo: data?.debugInfo };
    }

    if (!res.ok || !data.ok) {
      return { status: 'error', message: data?.message || 'Could not load listings right now.', debugInfo: data?.debugInfo };
    }

    return {
      status: 'ok',
      listings: data.listings,
      total: data.total,
      hasMore: data.hasMore,
      nextSkip: data.nextSkip,
      debugInfo: data?.debugInfo,
    };
  } catch (err) {
    return { status: 'error', message: 'Could not reach the server. Please check your connection.' };
  }
}

export type MlsDetailsResult =
  | { status: 'ok'; gallery: string[]; description: string; raw?: any }
  | { status: 'not_configured'; message: string }
  | { status: 'error'; message: string };

// Fetches full listing detail (multiple photos, full description) for a
// single listing, using the /listings/details endpoint (confirmed via
// Lofty support to exist, separate from the lightweight /search endpoint).
export async function fetchMlsListingDetails(listingId: string): Promise<MlsDetailsResult> {
  try {
    const res = await fetch(`/api/mls/details?listingId=${encodeURIComponent(listingId)}`);
    const data = await res.json();

    if (res.status === 501 || data?.error === 'MLS_NOT_CONFIGURED') {
      return { status: 'not_configured', message: data?.message || 'MLS feed not connected yet.' };
    }
    if (!res.ok || !data.ok) {
      return { status: 'error', message: data?.message || 'Could not load full listing details right now.' };
    }
    return { status: 'ok', gallery: data.gallery || [], description: data.description || '', raw: data.raw };
  } catch (err) {
    return { status: 'error', message: 'Could not reach the server. Please check your connection.' };
  }
}
