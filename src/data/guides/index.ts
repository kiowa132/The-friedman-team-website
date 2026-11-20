import { HandbookGuide } from '../../types/handbook';
import { buyerHandbook } from './buyer-handbook-2026';
import { sellerGuide } from './seller-guide-2026';
import { homeValuationGuide } from './home-valuation-guide';
import { relocationGuide } from './relocation-guide';
import { carrollCountyBuyerGuide } from './carroll-county-buyer-guide';
import { buyAndSellAtTheSameTimeGuide } from './buy-and-sell-at-the-same-time-guide';

// The complete guide library. Adding a new guide later is just writing a
// new data file matching HandbookGuide and adding it here.
export const HANDBOOK_GUIDES: HandbookGuide[] = [
  buyerHandbook,
  sellerGuide,
  homeValuationGuide,
  relocationGuide,
  carrollCountyBuyerGuide,
  buyAndSellAtTheSameTimeGuide,
];

export function getHandbookGuide(slug: string): HandbookGuide | undefined {
  return HANDBOOK_GUIDES.find((g) => g.slug === slug);
}
