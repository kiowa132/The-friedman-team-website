// The Friedman Market Momentum Index (FMMI) - real weekly scores.
//
// HOW THIS STAYS CURRENT AUTOMATICALLY: every time you publish a Market
// Report blog post with the "Friedman Market Momentum Index" section
// filled in (in the CMS, or as frontmatter directly), scripts/
// generate-fmmi-data.mjs picks it up at build time and regenerates
// fmmi.generated.json. This file just imports that JSON - there is
// nothing to manually edit for a normal weekly report.
//
// The only reason to ever touch this file by hand is MANUAL_HISTORY below.
import generated from './fmmi.generated.json';

export interface FmmiSubScore {
  name: string;
  score: number;
  previousScore: number | null;
  note: string;
}

export interface FmmiEntry {
  date: string;
  score: number;
  label: string | null;
  signal: string | null;
  sourceSlug: string | null;
  subScores?: FmmiSubScore[];
  inferredDate?: boolean;
}

// Weeks that are only known because a LATER post referenced them as
// "down from X" - they never got their own dedicated post, so
// generate-fmmi-data.mjs can never find them. Add to this list by hand
// only in that specific situation; every normal week should come from a
// real published post instead, automatically.
const MANUAL_HISTORY: FmmiEntry[] = [
  {
    date: '2026-07-19',
    score: 62,
    label: null,
    signal: null,
    sourceSlug: null,
    inferredDate: true,
  },
  {
    date: '2026-08-02',
    score: 55,
    label: null,
    signal: null,
    sourceSlug: null,
    inferredDate: true,
  },
];

export const FMMI_HISTORY: FmmiEntry[] = [...MANUAL_HISTORY, ...(generated as FmmiEntry[])].sort((a, b) =>
  a.date < b.date ? -1 : a.date > b.date ? 1 : 0
);

export function getLatestFmmi(): FmmiEntry {
  return FMMI_HISTORY[FMMI_HISTORY.length - 1];
}

export function getPreviousFmmi(): FmmiEntry | null {
  return FMMI_HISTORY.length > 1 ? FMMI_HISTORY[FMMI_HISTORY.length - 2] : null;
}
