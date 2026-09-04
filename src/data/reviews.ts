// src/data/reviews.ts
//
// Real reviews, manually copied from Kyle's actual Google Business Profile
// ("The Friedman Team by Kyle Friedman") on 2026-07-30, since the automated
// Google Places API integration couldn't reliably resolve this specific
// listing (it's a Service Area Business without a fixed address, which
// Google's location-based search APIs handle poorly - see server/reviewsClient.js
// for the full history of that attempt).
//
// These are 100% real - just manually entered instead of live-fetched.
// To add a new review later: copy the reviewer name and review text from
// your Google Business Profile dashboard and add a new entry below.
//
// The overall profile rating (5.0 stars, 9 reviews as of 2026-08-01) is
// confirmed directly from Kyle's Google Business Profile page.
//
// relativeTime is an absolute "Month Year" label, not a live relative
// timestamp - these were originally copied from Google as "4 hours ago",
// "a day ago", etc., which was accurate on 2026-07-30 but reads as false
// freshness the moment time passes (a review frozen at "4 hours ago" is
// still just as stale a year from now). Update the label when you copy in
// new reviews with a real post date.

export interface StaticReview {
  authorName: string;
  rating: number;
  text: string;
  relativeTime: string;
}

export const GOOGLE_REVIEWS: StaticReview[] = [
  {
    authorName: 'Jess P.',
    rating: 5,
    text: "Working with Kyle was such a great experience. He made the whole buying/selling process so much easier than I expected. He was always quick to respond, kept me updated every step of the way, and was happy to answer all of my questions.\n\nKyle really knows the Maryland real estate market, and his knowledge gave me a lot of confidence throughout the process. I never felt pressured, and he always took the time to explain my options and make sure I was comfortable with every decision.\n\nIf you're looking to buy or sell a home, I definitely recommend Kyle. He's easy to work with, communicates well, and genuinely cares about helping his clients. I'd happily work with him again and wouldn't hesitate to recommend him to family and friends.",
    relativeTime: 'July 2026',
  },
  {
    authorName: 'Troy Godwin',
    rating: 5,
    text: '',
    relativeTime: 'July 2026',
  },
  {
    authorName: 'Kelly Allen',
    rating: 5,
    text: "Kyle has been in this field for years and knows what's needed when it comes to buying a home. He always goes above and beyond to make your experience a smooth! I always found him available and informative to answer any questions.",
    relativeTime: 'July 2026',
  },
  {
    authorName: 'Devon Depaola Kelly',
    rating: 5,
    text: 'Knowledgable, Smooth & Professional. Kyle had a call with me prior to listing to understand my needs and expectations & I felt heard. I highly recommend Kyle to anyone trying to buy or sell their home. He holds your hand through the process while still valuing me getting the most out of the sale. THANK YOU KYLE! GREAT WORK!',
    relativeTime: 'July 2026',
  },
  {
    authorName: 'Matthew Durante',
    rating: 5,
    text: "Kyle was the best! Told him what I was looking for and it's like he could see my vision!!",
    relativeTime: 'July 2026',
  },
  {
    authorName: 'H.R.',
    rating: 5,
    text: 'Had a great experience with these guys. Very helpful and professional!',
    relativeTime: 'July 2026',
  },
  {
    authorName: 'Evan Friedman',
    rating: 5,
    text: 'The Friedman Real Estate Team was absolutely fantastic to work with! They were knowledgeable, professional, responsive, and made the entire process smooth from start to finish. They truly care about their clients and go above and beyond to...',
    relativeTime: 'July 2026',
  },
  {
    authorName: 'Kimberly Gibbons',
    rating: 5,
    text: 'Kyle is a hard worker and a very nice guy.',
    relativeTime: 'July 2026',
  },
  {
    authorName: 'Aiden Amernick',
    rating: 5,
    text: '',
    relativeTime: 'July 2026',
  },
];

export const GOOGLE_OVERALL_RATING: number = 5.0;
export const GOOGLE_TOTAL_REVIEW_COUNT: number = 9;

// Confirmed real link to Kyle's actual Google Maps listing.
export const GOOGLE_MAPS_URL =
  'https://www.google.com/maps/place/The+Friedman+Team+by+Kyle+Friedman/@39.2162004,-76.9824265,15z/data=!4m6!3m5!1s0x8ab6c9d95ab33a53:0xa06f2f12d8aad23b!8m2!3d39.2162004!4d-76.9824265!16s%2Fg%2F11nr7zvk3c';
