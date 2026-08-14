import React from 'react';
import { isPlaceholder, displayValue } from '../data/network';

interface FieldValueProps {
  value?: string;
  className?: string;
}

// Renders a member field with honest, visible styling depending on
// whether it's real, confirmed information or a placeholder Kyle hasn't
// filled in yet. Never lets a placeholder look like real content.
export const FieldValue: React.FC<FieldValueProps> = ({ value, className = '' }) => {
  if (!value) return null;
  const placeholder = isPlaceholder(value);
  return (
    <span className={`${className} ${placeholder ? 'italic text-[#1C2B2E]/40' : ''}`}>
      {displayValue(value)}
    </span>
  );
};
