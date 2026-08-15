// domAnimation covers everything used site-wide: enter/exit animations,
// AnimatePresence, hover/tap/focus gestures, and viewport (whileInView)
// detection. It deliberately excludes drag & layout animations (domMax),
// which we don't use and which roughly double the engine's size.
export { domAnimation as default } from 'motion/react';
