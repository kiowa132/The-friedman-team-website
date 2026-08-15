import React from 'react';
import { m } from 'motion/react';
import { fadeUp, staggerContainer, revealViewport } from '../lib/motion';

interface RevealProps {
  children: React.ReactNode;
  className?: string;
  /** Stagger direct children in on scroll instead of animating as one block. */
  stagger?: boolean;
  /** Extra delay before this reveal starts, in seconds. */
  delay?: number;
  as?: 'div' | 'section';
}

/**
 * Fades + rises content in as it scrolls into view. Animates once per page
 * load (never re-triggers), and automatically respects the user's OS-level
 * "reduce motion" preference via the global MotionConfig in App.tsx.
 *
 * Usage:
 *   <Reveal><h2>Section title</h2></Reveal>
 *
 *   <Reveal stagger className="grid grid-cols-3 gap-4">
 *     <RevealItem>Card 1</RevealItem>
 *     <RevealItem>Card 2</RevealItem>
 *   </Reveal>
 */
export const Reveal: React.FC<RevealProps> = ({ children, className, stagger, delay, as = 'div' }) => {
  const Component = m[as];
  return (
    <Component
      className={className}
      initial="hidden"
      whileInView="visible"
      viewport={revealViewport}
      variants={stagger ? staggerContainer : fadeUp}
      transition={delay ? { delayChildren: delay } : undefined}
    >
      {children}
    </Component>
  );
};

/** Use inside a <Reveal stagger> as each staggered child. */
export const RevealItem: React.FC<{ children: React.ReactNode; className?: string }> = ({
  children,
  className,
}) => (
  <m.div className={className} variants={fadeUp}>
    {children}
  </m.div>
);
