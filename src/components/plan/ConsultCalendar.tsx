import React, { useMemo, useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { CONSULT_CLOSED_DAYS, CONSULT_DAYS_AHEAD, CONSULT_SLOTS } from '../../data/marketingPlan';

interface ConsultCalendarProps {
  date: string | null; // yyyy-mm-dd
  time: string | null; // e.g. "4:00 PM"
  onDate: (d: string) => void;
  onTime: (t: string) => void;
}

const MONTHS = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
const DOW = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

export function isoDate(d: Date): string {
  const mm = String(d.getMonth() + 1).padStart(2, '0');
  const dd = String(d.getDate()).padStart(2, '0');
  return `${d.getFullYear()}-${mm}-${dd}`;
}

export function prettyDate(iso: string): string {
  const [y, m, d] = iso.split('-').map(Number);
  const dt = new Date(y, m - 1, d);
  return `${DOW[dt.getDay()]}, ${MONTHS[dt.getMonth()]} ${dt.getDate()}`;
}

export const ConsultCalendar: React.FC<ConsultCalendarProps> = ({ date, time, onDate, onTime }) => {
  const { minDate, maxDate } = useMemo(() => {
    const now = new Date();
    const min = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1);
    const max = new Date(now.getFullYear(), now.getMonth(), now.getDate() + CONSULT_DAYS_AHEAD);
    return { minDate: min, maxDate: max };
  }, []);

  const [view, setView] = useState<{ y: number; m: number }>({ y: minDate.getFullYear(), m: minDate.getMonth() });

  const first = new Date(view.y, view.m, 1);
  const daysInMonth = new Date(view.y, view.m + 1, 0).getDate();
  const cells: (Date | null)[] = [];
  for (let i = 0; i < first.getDay(); i++) cells.push(null);
  for (let d = 1; d <= daysInMonth; d++) cells.push(new Date(view.y, view.m, d));

  const available = (d: Date) => d >= minDate && d <= maxDate && !CONSULT_CLOSED_DAYS.includes(d.getDay());

  const canPrev = new Date(view.y, view.m, 1) > new Date(minDate.getFullYear(), minDate.getMonth(), 1);
  const canNext = new Date(view.y, view.m + 1, 1) <= maxDate;
  const move = (delta: number) => {
    const d = new Date(view.y, view.m + delta, 1);
    setView({ y: d.getFullYear(), m: d.getMonth() });
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
      <div className="md:col-span-3 space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="font-serif text-xl font-bold text-[#0D2226]">
            {MONTHS[view.m]} <span className="text-[#0D2226]/50">{view.y}</span>
          </h3>
          <div className="flex gap-1">
            <button type="button" onClick={() => move(-1)} disabled={!canPrev} aria-label="Previous month" className="p-2 border border-[#0D2226]/15 rounded-xs disabled:opacity-30 hover:border-[#0F5C63]">
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button type="button" onClick={() => move(1)} disabled={!canNext} aria-label="Next month" className="p-2 border border-[#0D2226]/15 rounded-xs disabled:opacity-30 hover:border-[#0F5C63]">
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
        <div className="grid grid-cols-7 gap-1.5 text-center text-[10px] font-bold uppercase tracking-wider text-[#0D2226]/45">
          {DOW.map((d) => (
            <span key={d}>{d}</span>
          ))}
        </div>
        <div className="grid grid-cols-7 gap-1.5">
          {cells.map((d, i) => {
            if (!d) return <span key={'b' + i} />;
            const ok = available(d);
            const iso = isoDate(d);
            const on = date === iso;
            return (
              <button
                key={iso}
                type="button"
                disabled={!ok}
                onClick={() => onDate(iso)}
                aria-pressed={on}
                className={
                  'aspect-square text-sm rounded-xs border transition-all duration-200 ' +
                  (on
                    ? 'bg-[#0F5C63] border-[#0F5C63] text-white font-bold shadow-md scale-105'
                    : ok
                      ? 'bg-white border-[#0F5C63] text-[#0F5C63] font-semibold hover:bg-[#0F5C63]/10'
                      : 'bg-[#0D2226]/[0.03] border-[#0D2226]/10 text-[#0D2226]/30 cursor-not-allowed')
                }
              >
                {d.getDate()}
              </button>
            );
          })}
        </div>
      </div>

      <div className="md:col-span-2 space-y-3">
        <h3 className="font-serif text-xl font-bold text-[#0D2226]">{date ? prettyDate(date) : 'Choose a day'}</h3>
        <p className="text-[11px] text-[#0D2226]/55">Times shown in Eastern Time</p>
        {date ? (
          <div className="grid grid-cols-2 gap-2">
            {CONSULT_SLOTS.map((t) => {
              const on = time === t;
              return (
                <button
                  key={t}
                  type="button"
                  onClick={() => onTime(t)}
                  aria-pressed={on}
                  className={
                    'py-2.5 text-sm rounded-xs border transition-all duration-200 ' +
                    (on ? 'bg-[#0F5C63] border-[#0F5C63] text-white font-bold' : 'bg-white border-[#0D2226]/20 text-[#0D2226] hover:border-[#0F5C63]')
                  }
                >
                  {t}
                </button>
              );
            })}
          </div>
        ) : (
          <p className="text-sm text-[#0D2226]/50 pt-4">Pick a highlighted day to see times.</p>
        )}
      </div>
    </div>
  );
};
