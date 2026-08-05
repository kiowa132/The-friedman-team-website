import React from 'react';
import { PieChart, Pie, Cell } from 'recharts';
import { formatCurrency } from '../lib/calculators';

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
export const PaymentBreakdownChart: React.FC<PaymentBreakdownChartProps> = ({ total, totalLabel, slices }) => {
  const visibleSlices = slices.filter((s) => s.value > 0);
  const data = visibleSlices.map((s) => ({ name: s.label, value: s.value }));

  return (
    <div className="flex flex-col items-center w-full">
      <div className="relative w-[200px] h-[200px]">
        <PieChart width={200} height={200}>
          <Pie
            data={data}
            dataKey="value"
            innerRadius={62}
            outerRadius={92}
            paddingAngle={data.length > 1 ? 2 : 0}
            startAngle={90}
            endAngle={-270}
            stroke="none"
          >
            {visibleSlices.map((slice, i) => (
              <Cell key={i} fill={slice.color} />
            ))}
          </Pie>
        </PieChart>
        <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
          <span className="font-serif text-2xl font-bold text-[#FAF8F5]">{formatCurrency(total)}</span>
          <span className="text-[10px] uppercase tracking-widest text-[#A8B2A1] mt-1 text-center px-4">{totalLabel}</span>
        </div>
      </div>
      <div className="w-full mt-6 space-y-2.5">
        {visibleSlices.map((slice, i) => (
          <div key={i} className="flex items-center justify-between text-sm">
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
