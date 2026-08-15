// The Friedman Market Momentum Index (FMMI) - real weekly scores, sourced
// directly from the Friedman Report blog posts where each was published.
//
// IMPORTANT: only add entries here with a real, published score. Never
// interpolate or estimate a missing week's number - if a week wasn't
// published, it just isn't in this array. Same rule for subScores: only
// include them when the source post actually broke them out.
//
// `label`, `signal`, and every subScore `note` are Kyle's own published
// wording for that week, copied from the source post - not our own
// interpretation of what the numbers mean.
export interface FmmiSubScore {
  name: string;
  score: number;
  previousScore: number | null;
  /** Kyle's own one-line explanation of this component, from the source post. */
  note: string;
}

export interface FmmiEntry {
  /** ISO date the score was reported for (the report's publish date). */
  date: string;
  /** 0-100 FMMI score as published. */
  score: number;
  /**
   * Published headline label for this week (e.g. "Balanced Market, Cooling
   * Momentum"). Null when a week's score is known only as a "down from X"
   * comparison inside a later post, and its own headline label was never
   * independently published on-site.
   */
  label: string | null;
  /** The Friedman Signal(tm) for this week, when published (e.g. "Cooling"). */
  signal: string | null;
  /** Slug of the blog post this score was published in, if it has its own post. */
  sourceSlug: string | null;
  /** Real sub-component breakdown, when the source post published one. */
  subScores?: FmmiSubScore[];
  /**
   * True when `date` is inferred (one week before a later post that
   * referenced this score as "down from X") rather than an independently
   * confirmed publish date for this exact score.
   */
  inferredDate?: boolean;
}

export const FMMI_HISTORY: FmmiEntry[] = [
  {
    date: '2026-07-19',
    score: 62,
    label: null,
    signal: null,
    sourceSlug: null,
    inferredDate: true,
  },
  {
    date: '2026-07-26',
    score: 50,
    label: 'Balanced Market, Cooling Momentum',
    signal: 'Cooling',
    sourceSlug: 'the-most-important-number-this-week-wasnt-a-home-price',
    subScores: [
      {
        name: 'Demand',
        score: 45,
        previousScore: 65,
        note: 'Closings fell 9.6% and pending contracts dropped 11%, the clearest signs of softening buyer momentum this week.',
      },
      {
        name: 'Seller Strength',
        score: 52,
        previousScore: 55,
        note: 'The average sold-to-list ratio actually strengthened to 104.8%, but 1,101 active listings still carry a price cut, keeping this component in check.',
      },
      {
        name: 'Market Speed',
        score: 60,
        previousScore: 75,
        note: 'Average days on market rose from 28 to 31, a real, if modest, slowdown in pace.',
      },
      {
        name: 'Rate Environment',
        score: 35,
        previousScore: 40,
        note: 'The 30-year fixed hit 6.58%, a fourth consecutive weekly increase and the highest level since August 2025.',
      },
    ],
  },
  {
    date: '2026-08-02',
    score: 55,
    label: null,
    signal: null,
    sourceSlug: null,
    inferredDate: true,
  },
  {
    date: '2026-08-09',
    score: 43,
    label: 'Balanced Market, Cooling Again',
    signal: 'Cooling',
    sourceSlug: 'maryland-housing-market-update-week-of-august-3-9-2026',
    subScores: [
      {
        name: 'Demand',
        score: 40,
        previousScore: 70,
        note: "Closings fell 32.2% week over week, though pending contracts held essentially flat, suggesting this is a closings pipeline correction rather than a genuine drop in Maryland buyer activity.",
      },
      {
        name: 'Seller Strength',
        score: 45,
        previousScore: 58,
        note: 'Median sold price fell 8.0% to $405,000, though homes are still closing at roughly 100% of list price on a median basis.',
      },
      {
        name: 'Market Speed',
        score: 63,
        previousScore: 63,
        note: 'Average days on market held exactly steady at 30, the calmest reading of any component this week.',
      },
      {
        name: 'Rate Environment',
        score: 24,
        previousScore: 28,
        note: 'The 30-year fixed hit 6.69%, a sixth consecutive weekly increase.',
      },
    ],
  },
];

export function getLatestFmmi(): FmmiEntry {
  return FMMI_HISTORY[FMMI_HISTORY.length - 1];
}

/** Most recent entry with a real week-over-week comparison available. */
export function getPreviousFmmi(): FmmiEntry | null {
  return FMMI_HISTORY.length > 1 ? FMMI_HISTORY[FMMI_HISTORY.length - 2] : null;
}
