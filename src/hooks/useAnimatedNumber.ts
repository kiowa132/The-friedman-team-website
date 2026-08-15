import { useEffect, useRef, useState } from 'react';
import { animate } from 'motion/react';
import { DURATION, EASE_PREMIUM } from '../lib/motion';

/**
 * Smoothly counts a displayed number toward `value` whenever it changes,
 * instead of the UI just snapping to the new figure. Uses the same motion
 * engine already loaded elsewhere on the page (no extra bundle cost).
 *
 * First render shows the real value immediately (no count-up from zero on
 * page load) - only subsequent changes animate.
 */
export function useAnimatedNumber(value: number, duration: number = DURATION.slow): number {
  const [display, setDisplay] = useState(value);
  const first = useRef(true);
  const prev = useRef(value);

  useEffect(() => {
    if (first.current) {
      first.current = false;
      prev.current = value;
      return;
    }
    const controls = animate(prev.current, value, {
      duration,
      ease: EASE_PREMIUM,
      onUpdate: (v) => setDisplay(v),
    });
    prev.current = value;
    return () => controls.stop();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value]);

  return display;
}
