// src/lib/neighborhoodDataApi.ts
//
// Client-side fetch helper for the real neighborhood data endpoint.
// Every field is optional/nullable on purpose - the UI must only display
// what actually came back, never a placeholder standing in for missing
// real data.

export interface NeighborhoodDataResult {
  town: string;
  census: {
    status: 'ok' | 'error' | 'not_configured';
    data?: {
      population?: number;
      medianAge?: number;
      medianHouseholdIncome?: number;
    };
  };
  walkScore: {
    status: 'ok' | 'error' | 'not_configured';
    data?: {
      walkScore?: number;
      walkDescription?: string;
      transitScore?: number;
      transitDescription?: string;
      bikeScore?: number;
      bikeDescription?: string;
    };
  };
  nearbyPlaces: {
    status: 'ok' | 'error' | 'not_configured';
    data?: {
      places: Array<{
        placeId: string;
        name: string;
        address: string;
        category: 'Restaurants' | 'Shopping' | 'Health' | 'Lodging';
      }>;
    };
  };
  schools: {
    status: 'ok' | 'error';
    data?: {
      schools: Array<{ name: string; city: string; level: number; enrollment: number }>;
    };
  };
}

export async function fetchNeighborhoodData(
  town: string,
  lat: number,
  lng: number,
  countyFips: string
): Promise<NeighborhoodDataResult | null> {
  try {
    const url = `/api/neighborhood-data?town=${encodeURIComponent(town)}&lat=${lat}&lng=${lng}&countyFips=${encodeURIComponent(countyFips)}`;
    const res = await fetch(url);
    if (!res.ok) return null;
    const json = await res.json();
    if (!json.ok) return null;
    return { town: json.town, ...json.results };
  } catch {
    return null;
  }
}

const SCHOOL_LEVEL_LABELS: Record<number, string> = {
  1: 'Elementary',
  2: 'Middle',
  3: 'High',
  4: 'Other',
};

export function schoolLevelLabel(level: number): string {
  return SCHOOL_LEVEL_LABELS[level] || 'School';
}
