// Past transactions Kyle personally represented (buyer or seller side) as
// the licensed agent of record. This is a real credibility/trust signal,
// so it should only ever contain deals Kyle actually closed himself -
// never another agent's production, even with permission, since a
// visitor (and Maryland's real estate license law) will read this page as
// Kyle's own track record.
//
// To add a real closed transaction, add an entry below. Photos should be
// real photos of the property (a listing photo you have rights to use,
// since you represented the deal). Keep priceDisplay approximate/rounded
// if you'd rather not publish an exact sale price.

export interface PastTransaction {
  address: string;
  city: string;
  county: 'Carroll County' | 'Baltimore County' | 'Howard County' | 'Frederick County' | string;
  priceDisplay: string;
  soldDate: string; // "Month YYYY"
  role: 'Listing Agent' | "Buyer's Agent" | 'Dual Agent';
  image?: string;
  beds?: number;
  baths?: number;
  sqft?: number;
}

export const PAST_TRANSACTIONS: PastTransaction[] = [
  {
    address: '147 Union Bridge Rd',
    city: 'Union Bridge',
    county: 'Carroll County',
    priceDisplay: '$285,900',
    soldDate: 'February 2026',
    role: "Buyer's Agent",
    beds: 2,
    baths: 2,
    sqft: 1464,
    // No photo yet - send a real listing photo you have rights to use and
    // I'll add it. The page shows a neutral placeholder until then.
  },
];
