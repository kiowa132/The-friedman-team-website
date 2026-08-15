import React, { useState } from 'react';
import { PieChart, Pie, Cell } from 'recharts';
import { m } from 'motion/react';
import { formatCurrency } from '../lib/calculators';
import { useAnimatedNumber } from '../hooks/useAnimatedNumber';

export interface BreakdownSlice {
  label: string;
  value: number;
  color: string;
}

interface PaymentBreakdownChartProps {
  total: number;
  totalLabel: string;
  slices: BreakdownSlice[];
}

// Matches the donut-plus-legend pattern common on comparable real estate
// sites: a ring chart with the total centered inside it, and a legend below
// listing each slice's color, label, dollar amount, and share of the total.
// Hovering a slice (or its legend row) lifts it slightly and highlights the
// matching legend row, so the chart reads as a live instrument rather than
// a static image.
export const PaymentBreakdownChart: React.FC<PaymentBreakdownChartProps> = ({ total, totalLabel, slices }) => {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const visibleSlices = slices.filter((s) => s.value > 0);
  const data = visibleSlices.map((s) => ({ name: s.label, value: s.value }));
  const animatedTotal = useAnimatedNumber(total);

  return (
    <div className="flex flex-col items-center w-full">
      <div className="relative w-[220px] h-[220px]">
        <PieChart width={220} height={220}>
          <Pie
            data={data}
            dataKey="value"
            innerRadius={70}
            outerRadius={100}
            paddingAngle={data.length > 1 ? 2 : 0}
            startAngle={90}
            endAngle={-270}
            stroke="none"
            isAnimationActive
            animationDuration={600}
            animationEasing="ease-out"
            onMouseEnter={(_, i) => setActiveIndex(i)}
            onMouseLeave={() => setActiveIndex(null)}
          >
            {visibleSlices.map((slice, i) => (
              <Cell
                key={i}
                fill={slice.color}
                style={{
                  filter: activeIndex === i ? 'brightness(1.18)' : 'none',
                  transformOrigin: '110px 110px',
                  transform: activeIndex === i ? 'scale(1.035)' : 'scale(1)',
                  transition: 'transform 0.2s ease, filter 0.2s ease',
                  cursor: 'pointer',
                }}
              />
            ))}
          </Pie>
        </PieChart>
        <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none px-2">
          {activeIndex !== null && visibleSlices[activeIndex] ? (
            <m.div
              key={visibleSlices[activeIndex].label}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center"
            >
              <span className="font-serif text-lg font-bold text-[#FAF8F5] text-center leading-tight">
                {formatCurrency(visibleSlices[activeIndex].value)}
              </span>
              <span className="block text-[9px] uppercase tracking-wide text-[#A8B2A1] mt-1.5 text-center leading-tight max-w-[100px]">
                {visibleSlices[activeIndex].label}
              </span>
            </m.div>
          ) : (
            <>
              <span className="font-serif text-xl font-bold text-[#FAF8F5] text-center leading-tight tabular-nums">
                {formatCurrency(Math.round(animatedTotal))}
              </span>
              <span className="text-[9px] uppercase tracking-wide text-[#A8B2A1] mt-1.5 text-center leading-tight max-w-[100px]">{totalLabel}</span>
            </>
          )}
        </div>
      </div>
      <div className="w-full mt-6 space-y-2.5">
        {visibleSlices.map((slice, i) => (
          <div
            key={i}
            onMouseEnter={() => setActiveIndex(i)}
            onMouseLeave={() => setActiveIndex(null)}
            className={`flex items-center justify-between text-sm px-1.5 py-1 rounded transition-colors cursor-default ${
              activeIndex === i ? 'bg-[#FAF8F5]/10' : ''
            }`}
          >
            <div className="flex items-center gap-2 min-w-0">
              <span className="w-2.5 h-2.5 rounded-full shrink-0" style={{ backgroundColor: slice.color }} />
              <span className="text-[#A8B2A1] truncate">{slice.label}</span>
            </div>
            <div className="flex items-center gap-2 shrink-0">
              <span className="font-semibold text-[#FAF8F5]">{formatCurrency(slice.value)}</span>
              <span className="text-[11px] text-[#A8B2A1] w-10 text-right">{total > 0 ? Math.round((slice.value / total) * 100) : 0}%</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
