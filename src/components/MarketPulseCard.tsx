import React, { useState } from 'react';
import { m, AnimatePresence } from 'motion/react';
import { Link } from 'react-router-dom';
import { TrendingDown, TrendingUp, Minus, ChevronDown } from 'lucide-react';
import { FMMI_HISTORY, getLatestFmmi, getPreviousFmmi } from '../data/fmmi';
import { revealViewport, DURATION, EASE_PREMIUM } from '../lib/motion';

// ---------- Gauge geometry (semicircle, 180deg sweep) ----------
const GAUGE = { width: 280, height: 170 };
const CENTER = { x: 140, y: 148 };
const RADIUS = 112;
const STROKE = 18;

function arcPath() {
  const start = { x: CENTER.x - RADIUS, y: CENTER.y };
  const end = { x: CENTER.x + RADIUS, y: CENTER.y };
  return `M ${start.x},${start.y} A ${RADIUS},${RADIUS} 0 0 1 ${end.x},${end.y}`;
}

function scoreColor(score: number) {
  if (score < 40) return '#5B8A8F';
  if (score < 60) return '#C9A96A';
  return '#D4AF37';
}

function formatWeekOf(iso: string) {
  const d = new Date(iso + 'T00:00:00');
  return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
}

// ---------- Real historical sparkline (only as many points as we have) ----------
const Sparkline: React.FC = () => {
  const points = FMMI_HISTORY;
  const w = 220;
  const h = 56;
  const pad = 6;
  const max = 100;
  const min = 0;
  const stepX = (w - pad * 2) / (points.length - 1);
  const coords = points.map((p, i) => {
    const x = pad + i * stepX;
    const y = pad + (1 - (p.score - min) / (max - min)) * (h - pad * 2);
    return { x, y, entry: p };
  });
  const linePath = coords.map((c, i) => `${i === 0 ? 'M' : 'L'} ${c.x},${c.y}`).join(' ');
  const areaPath = `${linePath} L ${coords[coords.length - 1].x},${h} L ${coords[0].x},${h} Z`;

  return (
    <svg width={w} height={h} viewBox={`0 0 ${w} ${h}`} className="overflow-visible">
      <defs>
        <linearGradient id="sparklineFill" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#C9A96A" stopOpacity="0.35" />
          <stop offset="100%" stopColor="#C9A96A" stopOpacity="0" />
        </linearGradient>
      </defs>
      <m.path
        d={areaPath}
        fill="url(#sparklineFill)"
        stroke="none"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={revealViewport}
        transition={{ duration: DURATION.slow, delay: 0.6 }}
      />
      <m.path
        d={linePath}
        fill="none"
        stroke="#C9A96A"
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
        initial={{ pathLength: 0 }}
        whileInView={{ pathLength: 1 }}
        viewport={revealViewport}
        transition={{ duration: DURATION.slow, ease: EASE_PREMIUM, delay: 0.3 }}
      />
      {coords.map((c, i) => (
        <m.circle
          key={points[i].date}
          cx={c.x}
          cy={c.y}
          r={i === coords.length - 1 ? 4 : 2.5}
          fill={i === coords.length - 1 ? '#D4AF37' : '#C9A96A'}
          initial={{ opacity: 0, scale: 0 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={revealViewport}
          transition={{ duration: DURATION.fast, delay: 0.9 + i * 0.08 }}
        />
      ))}
    </svg>
  );
};

// ---------- Sub-score bar, tap/click to expand real explanation ----------
const SubScoreBar: React.FC<{
  name: string;
  score: number;
  previousScore: number | null;
  note: string;
  index: number;
}> = ({ name, score, previousScore, note, index }) => {
  const [open, setOpen] = useState(false);
  const delta = previousScore !== null ? score - previousScore : null;

  return (
    <div className="border-b border-[#FAF8F5]/10 last:border-b-0">
      <button
        onClick={() => setOpen((o) => !o)}
        className="w-full flex items-center gap-3 py-3 text-left group"
      >
        <span className="text-xs font-semibold uppercase tracking-wider text-[#FAF8F5]/70 w-32 shrink-0">
          {name}
        </span>
        <span className="relative flex-1 h-1.5 rounded-full bg-[#FAF8F5]/10 overflow-hidden">
          <m.span
            className="absolute inset-y-0 left-0 rounded-full"
            style={{ background: 'linear-gradient(90deg, #5B8A8F, #C9A96A)' }}
            initial={{ width: 0 }}
            whileInView={{ width: `${score}%` }}
            viewport={revealViewport}
            transition={{ duration: DURATION.slow, ease: EASE_PREMIUM, delay: 0.2 + index * 0.1 }}
          />
        </span>
        <span className="text-sm font-bold text-[#FAF8F5] w-8 text-right tabular-nums">
          {score}
        </span>
        {delta !== null && (
          <span
            className={`text-xs font-medium w-12 text-right tabular-nums ${
              delta > 0 ? 'text-[#8FBFAE]' : delta < 0 ? 'text-[#D89A8A]' : 'text-[#FAF8F5]/50'
            }`}
          >
            {delta === 0 ? '—' : `${delta > 0 ? '+' : ''}${delta}`}
          </span>
        )}
        <ChevronDown
          className={`w-3.5 h-3.5 text-[#FAF8F5]/40 transition-transform shrink-0 ${open ? 'rotate-180' : ''}`}
        />
      </button>
      <AnimatePresence initial={false}>
        {open && (
          <m.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: DURATION.fast, ease: EASE_PREMIUM }}
            className="overflow-hidden"
          >
            <p className="text-xs text-[#FAF8F5]/60 leading-relaxed pb-3 pl-0 sm:pl-32">{note}</p>
          </m.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export const MarketPulseCard: React.FC<{ reportHref: string }> = ({ reportHref }) => {
  const latest = getLatestFmmi();
  const previous = getPreviousFmmi();
  const pct = Math.max(0, Math.min(100, latest.score)) / 100;
  const delta = previous ? latest.score - previous.score : 0;

  const TrendIcon = delta > 0 ? TrendingUp : delta < 0 ? TrendingDown : Minus;

  return (
    <div className="relative rounded-lg overflow-hidden border border-[#C9A96A]/25 shadow-2xl">
      {/* Ambient gold glow, purely decorative */}
      <div
        className="absolute -top-32 -right-32 w-96 h-96 rounded-full opacity-20 blur-3xl pointer-events-none"
        style={{ background: 'radial-gradient(circle, #C9A96A, transparent 70%)' }}
      />
      <div
        className="absolute -bottom-24 -left-24 w-72 h-72 rounded-full opacity-10 blur-3xl pointer-events-none"
        style={{ background: 'radial-gradient(circle, #5B8A8F, transparent 70%)' }}
      />

      <div className="relative bg-gradient-to-b from-[#0F2A2E] to-[#0D2226] px-6 sm:px-10 py-10 sm:py-12">
        {/* Header row */}
        <div className="flex flex-wrap items-center justify-between gap-4 mb-8">
          <div className="flex items-center gap-2.5">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#8FBFAE] opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-[#8FBFAE]" />
            </span>
            <span className="text-[11px] font-bold uppercase tracking-[0.2em] text-[#FAF8F5]/60">
              Live &middot; Week of {formatWeekOf(latest.date)}
            </span>
          </div>
          {latest.signal && (
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#FAF8F5]/5 border border-[#FAF8F5]/10 text-xs font-bold uppercase tracking-wider text-[#C9A96A]">
              <TrendIcon className="w-3.5 h-3.5" />
              The Friedman Signal&trade;: {latest.signal}
            </span>
          )}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-[280px_1fr] gap-10 lg:gap-14 items-center">
          {/* Gauge */}
          <div className="flex flex-col items-center">
            <div className="relative" style={{ width: GAUGE.width, height: GAUGE.height }}>
              <svg width={GAUGE.width} height={GAUGE.height} viewBox={`0 0 ${GAUGE.width} ${GAUGE.height}`}>
                <path d={arcPath()} fill="none" stroke="#FAF8F5" strokeOpacity={0.08} strokeWidth={STROKE} strokeLinecap="round" />
                <m.path
                  d={arcPath()}
                  fill="none"
                  stroke={scoreColor(latest.score)}
                  strokeWidth={STROKE}
                  strokeLinecap="round"
                  initial={{ pathLength: 0 }}
                  whileInView={{ pathLength: pct }}
                  viewport={revealViewport}
                  transition={{ duration: DURATION.slow * 2, ease: EASE_PREMIUM, delay: 0.15 }}
                />
              </svg>
              <m.div
                className="absolute inset-0 flex flex-col items-center justify-end pb-1 text-center"
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={revealViewport}
                transition={{ duration: DURATION.base, delay: 0.5 }}
              >
                <span className="font-serif text-6xl font-bold text-[#FAF8F5] leading-none">
                  {latest.score}
                </span>
                <span className="text-xs text-[#FAF8F5]/40 uppercase tracking-widest mt-1">/ 100</span>
              </m.div>
            </div>

            {latest.label && (
              <p className="mt-1 text-base font-semibold text-[#FAF8F5] text-center">{latest.label}</p>
            )}
            {previous && (
              <p className="mt-1 text-xs text-[#FAF8F5]/50">
                {delta === 0 ? 'Unchanged' : `${delta > 0 ? '+' : ''}${delta} pts`} vs. last week ({previous.score})
              </p>
            )}

            <div className="mt-6 w-full">
              <p className="text-[10px] uppercase tracking-widest text-[#FAF8F5]/40 mb-1 text-center">
                {FMMI_HISTORY.length}-Week Trend
              </p>
              <div className="flex justify-center">
                <Sparkline />
              </div>
            </div>
          </div>

          {/* Sub-scores */}
          <div>
            <p className="text-[11px] uppercase tracking-widest text-[#FAF8F5]/40 mb-1">
              What's Driving the Score
            </p>
            {latest.subScores ? (
              latest.subScores.map((s, i) => (
                <SubScoreBar
                  key={s.name}
                  name={s.name}
                  score={s.score}
                  previousScore={s.previousScore}
                  note={s.note}
                  index={i}
                />
              ))
            ) : (
              <p className="text-sm text-[#FAF8F5]/50 py-4">
                Full component breakdown available in this week's report.
              </p>
            )}

            <Link
              to={reportHref}
              className="mt-6 inline-block w-full sm:w-auto text-center px-7 py-3.5 bg-[#C9A96A] hover:bg-[#D4AF37] text-[#0D2226] font-bold text-xs uppercase tracking-widest rounded-xs shadow-lg transition-colors"
            >
              Read This Week's Full Report
            </Link>
          </div>
        </div>

        <p className="mt-8 pt-6 border-t border-[#FAF8F5]/10 text-xs text-[#FAF8F5]/40 max-w-2xl leading-relaxed">
          The Friedman Market Momentum Index is our proprietary weekly read on Maryland market
          conditions, blending buyer demand, seller strength, market pace, and the rate
          environment into a single 0-100 score. Tap any component above for the story behind it.
        </p>
      </div>
    </div>
  );
};
