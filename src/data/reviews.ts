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
// The overall profile rating (5.0 stars, all 7 reviews) is confirmed
// directly from Kyle's Google Business Profile page.

export interface StaticReview {
  authorName: string;
  rating: number;
  text: string;
  relativeTime: string;
}

export const GOOGLE_REVIEWS: StaticReview[] = [
  {
    authorName: 'Kelly Allen',
    rating: 5,
    text: "Kyle has been in this field for years and knows what's needed when it comes to buying a home. He always goes above and beyond to make your experience a smooth! I always found him available and informative to answer any questions.",
    relativeTime: '16 hours ago',
  },
  {
    authorName: 'Devon Depaola Kelly',
    rating: 5,
    text: 'Knowledgable, Smooth & Professional. Kyle had a call with me prior to listing to understand my needs and expectations & I felt heard. I highly recommend Kyle to anyone trying to buy or sell their home. He holds your hand through the process while still valuing me getting the most out of the sale. THANK YOU KYLE! GREAT WORK!',
    relativeTime: 'a day ago',
  },
  {
    authorName: 'Matthew Durante',
    rating: 5,
    text: "Kyle was the best! Told him what I was looking for and it's like he could see my vision!!",
    relativeTime: 'a day ago',
  },
  {
    authorName: 'H.R.',
    rating: 5,
    text: 'Had a great experience with these guys. Very helpful and professional!',
    relativeTime: 'a day ago',
  },
  {
    authorName: 'Evan Friedman',
    rating: 5,
    text: 'The Friedman Real Estate Team was absolutely fantastic to work with! They were knowledgeable, professional, responsive, and made the entire process smooth from start to finish. They truly care about their clients and go above and beyond to...',
    relativeTime: '2 days ago',
  },
  {
    authorName: 'Kimberly Gibbons',
    rating: 5,
    text: 'Kyle is a hard worker and a very nice guy.',
    relativeTime: '2 days ago',
  },
  {
    authorName: 'Aiden Amernick',
    rating: 5,
    text: '',
    relativeTime: 'a day ago',
  },
];

export const GOOGLE_OVERALL_RATING: number = 5.0;
export const GOOGLE_TOTAL_REVIEW_COUNT: number = 7;

// Confirmed real link to Kyle's actual Google Maps listing.
export const GOOGLE_MAPS_URL =
  'https://www.google.com/maps/place/The+Friedman+Team+by+Kyle+Friedman/@39.2162004,-76.9824265,15z/data=!4m6!3m5!1s0x8ab6c9d95ab33a53:0xa06f2f12d8aad23b!8m2!3d39.2162004!4d-76.9824265!16s%2Fg%2F11nr7zvk3c';
