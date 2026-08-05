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
  image: string;
  beds?: number;
  baths?: number;
  sqft?: number;
}

export const PAST_TRANSACTIONS: PastTransaction[] = [
  // Add real closed transactions here, e.g.:
  // {
  //   address: '123 Main St',
  //   city: 'Westminster',
  //   county: 'Carroll County',
  //   priceDisplay: '$450,000',
  //   soldDate: 'June 2026',
  //   role: 'Listing Agent',
  //   image: '/images/transactions/123-main-st.jpg',
  //   beds: 4,
  //   baths: 2.5,
  //   sqft: 2400,
  // },
];
