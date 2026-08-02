export interface BlogPost {
  slug: string;
  title: string;
  metaDescription: string;
  category: string;
  publishDate: string; // ISO format, e.g. "2026-07-30"
  heroImage: string;
  youtubeVideoId?: string; // just the ID, e.g. "dQw4w9WgXcQ"
  carouselImages?: string[];
  bodyHtml: string; // rendered from markdown
  relatedGuideSlug?: string;
  relatedAreaSlug?: string; // links to a neighborhood/county id
}

export interface Guide {
  slug: string;
  title: string;
  description: string;
  coverImage: string;
  pdfUrl?: string; // optional - if set, also offers a real PDF download alongside on-page content
  relatedPostSlug?: string;
  previewPoints: string[]; // short "what's inside" bullets, shown before the form
  fullContentHtml: string; // the real guide content, unlocked after someone submits their info
  publuuEmbedUrl?: string; // optional - if set, shows a Publuu flipbook instead of plain text
  flipbookPages?: string[]; // optional - pre-converted page images for the free in-house flipbook viewer
}

export interface Listing {
  id: string;
  title: string;
  price: number;
  formattedPrice: string;
  address: string;
  city: string;
  county: string;
  zip: string;
  beds: number;
  baths: number;
  sqft: number;
  acres: number;
  propertyType: string;
  status: 'Active' | 'Pending' | 'Private Placement' | 'Sold';
  heroImage: string;
  gallery: string[];
  description: string;
  highlights: string[];
  yearBuilt: number;
  mlsNumber: string;
  virtualTourUrl?: string;
  featured?: boolean;
  // Additional detail-page fields - all optional since availability
  // depends on what Lofty's feed actually returns (see server/mlsClient.js
  // for the field-name caveats). UI should only render these when present,
  // never show a placeholder as if it were real data.
  taxAnnualAmount?: number;
  daysOnMarket?: number;
  garageSpaces?: number;
  subdivisionName?: string;
  associationFee?: number;
  architecturalStyle?: string;
  waterSource?: string;
  sewer?: string;
  zoning?: string;
  listAgentName?: string;
  listOfficeName?: string;
}

export interface Neighborhood {
  id: string;
  name: string;
  county: 'Carroll County' | 'Baltimore County' | 'Howard County' | 'Frederick County';
  tagline: string;
  avgHomeValue: string;
  medianDaysOnMarket: number;
  heroImage: string;
  galleryImages: string[];
  marketOverview: string;
  lifestyle: string;
  localAttractions: string[];
  schoolsRating: string;
  featuredListingIds: string[];
  seoKeywords: string[];
}

export interface MarketStat {
  county: string;
  avgPrice: string;
  yoyGrowth: string;
  inventoryLevel: string;
  avgDaysOnMarket: number;
}

export interface MarketTrendData {
  month: string;
  carrollAvgPrice: number;
  baltimoreAvgPrice: number;
  howardAvgPrice: number;
  activeListings: number;
}

export interface EditorialArticle {
  id: string;
  title: string;
  date: string;
  category: 'Market Trends' | 'Seller Strategy' | 'Luxury Lifestyle' | 'Estate Management';
  readTime: string;
  summary: string;
  content: string[];
  author: string;
  image: string;
}

export interface LeadFormPayload {
  name: string;
  email: string;
  phone: string;
  interest: 'Selling' | 'Buying' | 'Investing' | 'Valuation' | 'General';
  targetCounty?: string;
  timeline?: string;
  propertyAddress?: string;
  message?: string;
}

export interface HomeValuationResult {
  estimatedLow: number;
  estimatedHigh: number;
  estimatedMid: number;
  confidenceScore: number;
  comparableCount: number;
}
