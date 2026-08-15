import React, { useState } from 'react';
import { m, AnimatePresence } from 'motion/react';
import { DURATION, EASE_PREMIUM } from '../lib/motion';

interface SliderInputProps {
  label: React.ReactNode;
  value: number;
  min: number;
  max: number;
  step?: number;
  onChange: (v: number) => void;
  /** Format the value for the number field and the live drag tooltip. */
  format?: (v: number) => string;
  /** Parse a typed number-field value back to a raw number. Defaults to Number(). */
  parse?: (raw: string) => number;
}

/**
 * A range slider and a plain number input, kept in sync, for calculator
 * fields someone is likely to "feel out" (home price, down payment, rate)
 * rather than type an exact figure. Dragging shows a live gold tooltip
 * above the thumb with the current formatted value.
 */
export const SliderInput: React.FC<SliderInputProps> = ({
  label,
  value,
  min,
  max,
  step = 1,
  onChange,
  format = (v) => String(v),
  parse = (raw) => Number(raw) || 0,
}) => {
  const [dragging, setDragging] = useState(false);
  const pct = max > min ? ((value - min) / (max - min)) * 100 : 0;

  return (
    <div>
      <div className="flex items-center justify-between mb-1.5">
        <label className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-widest text-[#1C2B2E]/70">
          {label}
        </label>
        <input
          type="text"
          inputMode="decimal"
          value={format(value)}
          onChange={(e) => onChange(parse(e.target.value.replace(/[^0-9.]/g, '')))}
          className="w-28 bg-[#FAF8F5] border border-[#0D2226]/20 px-2 py-1 text-sm text-right text-[#0D2226] focus:border-[#C9A96A] focus:outline-none"
        />
      </div>

      <div className="relative pt-3">
        <AnimatePresence>
          {dragging && (
            <m.div
              initial={{ opacity: 0, y: 4, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 4, scale: 0.9 }}
              transition={{ duration: DURATION.fast, ease: EASE_PREMIUM }}
              className="absolute -top-1 px-2 py-1 rounded bg-[#0D2226] text-[#FAF8F5] text-[11px] font-bold whitespace-nowrap pointer-events-none -translate-x-1/2"
              style={{ left: `${pct}%` }}
            >
              {format(value)}
            </m.div>
          )}
        </AnimatePresence>

        <input
          type="range"
          className="premium-slider"
          style={{
            background: `linear-gradient(to right, #C9A96A ${pct}%, #E5DFD3 ${pct}%)`,
          }}
          min={min}
          max={max}
          step={step}
          value={value}
          onChange={(e) => onChange(Number(e.target.value))}
          onPointerDown={() => setDragging(true)}
          onPointerUp={() => setDragging(false)}
          onKeyDown={() => setDragging(true)}
          onKeyUp={() => setDragging(false)}
          onBlur={() => setDragging(false)}
        />
      </div>
    </div>
  );
};
