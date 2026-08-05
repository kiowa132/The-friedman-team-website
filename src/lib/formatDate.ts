// Formats a date string for display, without the classic timezone-shift
// bug: new Date("2026-08-02") parses as UTC midnight, and formatting that
// in a US timezone (anything behind UTC) can display the day *before* the
// one that was actually entered - e.g. a post dated August 2 showing as
// "August 1" for anyone in Eastern time. This parses the date components
// directly as local time instead, so the date shown always matches the
// date that was actually typed in.
//
// Also tolerant of a full ISO timestamp (e.g. "2026-08-05T00:00:00.000Z")
// rather than a plain "YYYY-MM-DD" string - Decap CMS's date widget can
// write either depending on its config, and this just reads the leading
// date portion off whichever one it gets rather than breaking.
export function formatDisplayDate(dateString: string): string {
  const match = dateString?.match(/^(\d{4})-(\d{2})-(\d{2})/);
  if (!match) return dateString; // fallback for truly unexpected formats
  const [, y, m, d] = match;
  const localDate = new Date(Number(y), Number(m) - 1, Number(d));
  return localDate.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });
}

// Extracts a clean, sortable "YYYY-MM-DD" from any date-ish string Decap
// CMS or a manually-edited file might contain (plain date, full ISO
// timestamp, or otherwise) so downstream code (sorting, schema.org dates)
// never has to deal with a malformed value directly.
export function normalizePublishDate(dateString: string | undefined): string {
  const match = dateString?.match(/^(\d{4})-(\d{2})-(\d{2})/);
  if (match) return `${match[1]}-${match[2]}-${match[3]}`;
  return new Date().toISOString().slice(0, 10);
}
