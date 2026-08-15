// The Friedman Market Momentum Index (FMMI) - real weekly scores, sourced
// directly from the Friedman Report blog posts where each was published.
//
// IMPORTANT: only add entries here with a real, published score. Never
// interpolate or estimate a missing week's number - if a week wasn't
// published, it just isn't in this array.
//
// `label` and `signal` are Kyle's own published wording for that week,
// copied verbatim - not our own interpretation of what the score means.
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
  },
];

export function getLatestFmmi(): FmmiEntry {
  return FMMI_HISTORY[FMMI_HISTORY.length - 1];
}

/** Most recent entry with a real week-over-week comparison available. */
export function getPreviousFmmi(): FmmiEntry | null {
  return FMMI_HISTORY.length > 1 ? FMMI_HISTORY[FMMI_HISTORY.length - 2] : null;
}
