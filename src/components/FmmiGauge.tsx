import React from 'react';
import { m } from 'motion/react';
import { TrendingDown, TrendingUp, Minus } from 'lucide-react';
import { getLatestFmmi, getPreviousFmmi } from '../data/fmmi';
import { revealViewport, DURATION, EASE_PREMIUM } from '../lib/motion';

// Semicircle gauge geometry - a 180deg arc from the 9-o'clock to 3-o'clock
// position, drawn with a large radius so the stroke reads clearly at
// homepage-hero scale.
const SIZE = { width: 320, height: 200 };
const CENTER = { x: 160, y: 170 };
const RADIUS = 130;
const STROKE = 22;

function arcPath() {
  const start = { x: CENTER.x - RADIUS, y: CENTER.y };
  const end = { x: CENTER.x + RADIUS, y: CENTER.y };
  return `M ${start.x},${start.y} A ${RADIUS},${RADIUS} 0 0 1 ${end.x},${end.y}`;
}

// Continuous color read (not a claim about market condition boundaries -
// purely a visual cue from cool/blue-teal to warm/gold as the score rises).
function scoreColor(score: number) {
  if (score < 40) return '#0F5C63';
  if (score < 60) return '#8B9A6E';
  return '#C9A96A';
}

export const FmmiGauge: React.FC = () => {
  const latest = getLatestFmmi();
  const previous = getPreviousFmmi();
  const pct = Math.max(0, Math.min(100, latest.score)) / 100;
  const delta = previous ? latest.score - previous.score : 0;

  const TrendIcon = delta > 0 ? TrendingUp : delta < 0 ? TrendingDown : Minus;
  const trendColor = delta > 0 ? '#0F5C63' : delta < 0 ? '#B5533C' : '#8A8A8A';

  return (
    <div className="flex flex-col items-center">
      <div className="relative" style={{ width: SIZE.width, height: SIZE.height }}>
        <svg width={SIZE.width} height={SIZE.height} viewBox={`0 0 ${SIZE.width} ${SIZE.height}`}>
          {/* Track */}
          <path
            d={arcPath()}
            fill="none"
            stroke="#E5DFD3"
            strokeWidth={STROKE}
            strokeLinecap="round"
          />
          {/* Animated fill - pathLength sweeps from 0 to the real score as
              this gauge scrolls into view. Runs once; never re-triggers. */}
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

        {/* Score readout, centered under the arc */}
        <m.div
          className="absolute inset-0 flex flex-col items-center justify-end pb-1 text-center"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={revealViewport}
          transition={{ duration: DURATION.base, delay: 0.5 }}
        >
          <span className="font-serif text-5xl sm:text-6xl font-bold text-[#0D2226] leading-none">
            {latest.score}
          </span>
          <span className="text-xs text-[#1C2B2E]/50 uppercase tracking-widest mt-1">/ 100</span>
        </m.div>
      </div>

      {latest.label && (
        <p className="mt-2 text-base sm:text-lg font-semibold text-[#0D2226] text-center">
          {latest.label}
        </p>
      )}

      {previous && (
        <div
          className="mt-2 inline-flex items-center gap-1.5 text-sm font-medium"
          style={{ color: trendColor }}
        >
          <TrendIcon className="w-4 h-4" />
          <span>
            {delta === 0 ? 'Unchanged' : `${delta > 0 ? '+' : ''}${delta} pts`} vs. last week
            ({previous.score})
          </span>
        </div>
      )}

      <p className="mt-3 text-xs text-[#1C2B2E]/50 max-w-xs text-center leading-relaxed">
        Our proprietary weekly read on Maryland market momentum, blending demand, seller
        strength, pace, and rate environment into one score.
      </p>
    </div>
  );
};
