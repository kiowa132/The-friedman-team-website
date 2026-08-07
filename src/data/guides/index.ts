import { GuideContent } from '../../types/guide';
import { firstTimeBuyerGuide } from './first-time-buyer-checklist';

// Registry of all structured guides. Adding a new guide later means
// writing a new data file matching GuideContent and adding it here - no
// new reader/component work required for the common section types.
export const STRUCTURED_GUIDES: GuideContent[] = [
  firstTimeBuyerGuide,
];

export function getStructuredGuide(slug: string): GuideContent | undefined {
  return STRUCTURED_GUIDES.find((g) => g.slug === slug);
}
