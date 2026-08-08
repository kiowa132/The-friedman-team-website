// Shared types for the real-page-image guide system (as opposed to the
// old structured-text GuideContent system, which has been retired - all
// three current guides are real designed page images, not re-transcribed
// HTML content).

export interface HandbookPage {
  image: string;
  label: string; // shown in the table of contents
}

export interface HandbookGuide {
  slug: string;
  title: string;
  subtitle: string;
  edition: string;
  description: string;
  category: string;
  estimatedReadMinutes: number;
  lastUpdated: string;
  pageCount: number;
  coverImage: string;
  pdfUrl: string;
  pages: HandbookPage[];
  whatsInside: string[];
}
