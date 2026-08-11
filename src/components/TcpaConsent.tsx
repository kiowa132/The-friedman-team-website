import React from 'react';
import { Link } from 'react-router-dom';

interface TcpaConsentProps {
  dark?: boolean; // matches the surrounding form's background (some
  // modals are dark, some are light) so the text reads correctly either way
}

// Standard TCPA (Telephone Consumer Protection Act) consent language -
// required whenever a form collects a phone number and the business
// intends to call or text that number, not just a style choice. Shared
// here so the wording stays identical across every form rather than
// drifting slightly each time it's added by hand.
export const TcpaConsent: React.FC<TcpaConsentProps> = ({ dark = false }) => {
  const textColor = dark ? 'text-[#A8B2A1]' : 'text-[#1C2B2E]/60';
  const linkColor = dark ? 'text-[#C9A96A] hover:text-[#FAF8F5]' : 'text-[#0F5C63] hover:text-[#C9A96A]';

  return (
    <p className={`text-[10px] leading-relaxed ${textColor}`}>
      By submitting, you agree to be contacted by Kyle Friedman via call, email, and text regarding your real estate needs. Message and data rates may apply. Message frequency may vary. Reply STOP to opt out at any time.{' '}
      <Link to="/privacy-policy" className={`underline transition-colors ${linkColor}`}>Privacy Policy</Link>.
    </p>
  );
};
