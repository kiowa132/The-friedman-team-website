// Structured content model for the Guides reading experience. Each guide
// is a typed array of sections - real HTML/text content, not flipbook
// page images or a PDF - rendered by GuideReader.tsx. This means every
// word is real, indexable text (good for SEO and accessibility), the
// reading experience is fast (no giant page images to load), and adding a
// new guide later is just writing a new data file against these same
// section types - no new component work in the common case.

export interface GuideCoverSection {
  type: 'cover';
  eyebrow: string;
  title: string;
  subtitle: string;
  meta: string; // e.g. "Kyle Friedman | The Friedman Team | eXp Realty"
}

export interface GuideOverviewSection {
  type: 'overview';
  title: string;
  body: string;
  phases: { icon: string; label: string }[];
}

export interface GuidePhaseStep {
  number: number;
  title: string;
  body: string;
}

export interface GuidePhaseSection {
  type: 'phase';
  phaseLabel: string; // "Phase 1"
  phaseIcon: string;
  title: string;
  steps: GuidePhaseStep[];
  layout: 'featured' | 'list' | 'cards' | 'columns'; // visual treatment
}

export interface GuideStatItem {
  icon: string;
  label: string;
  body: string;
}

export interface GuideProfileSection {
  type: 'profile';
  title: string;
  body: string;
  stats: GuideStatItem[];
  disclosure?: string;
}

export interface GuideCalloutSection {
  type: 'callout';
  icon: string;
  body: string;
}

export type GuideSection =
  | GuideCoverSection
  | GuideOverviewSection
  | GuidePhaseSection
  | GuideProfileSection
  | GuideCalloutSection;

// Optional contextual CTA slotted after a specific section index - subtle,
// not a "contact me" wall on every screen.
export interface GuideCta {
  afterSectionIndex: number;
  label: string;
  description: string;
  buttonLabel: string;
  action: 'consultation' | 'mortgage-calculator' | 'affordability-calculator' | 'listings';
}

export interface GuideContent {
  slug: string;
  title: string;
  description: string;
  category: string;
  estimatedReadMinutes: number;
  lastUpdated: string; // "Month YYYY"
  coverImage: string;
  pdfUrl?: string;
  sections: GuideSection[];
  ctas: GuideCta[];
}
