// Formats a "YYYY-MM-DD" date string for display, without the classic
// timezone-shift bug: new Date("2026-08-02") parses as UTC midnight, and
// formatting that in a US timezone (anything behind UTC) can display the
// day *before* the one that was actually entered - e.g. a post dated
// August 2 showing as "August 1" for anyone in Eastern time. This parses
// the date components directly as local time instead, so the date shown
// always matches the date that was actually typed in.
export function formatDisplayDate(dateString: string): string {
  const [year, month, day] = dateString.split('-').map(Number);
  if (!year || !month || !day) return dateString; // fallback for unexpected formats
  const localDate = new Date(year, month - 1, day);
  return localDate.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });
}
