import React, { useState } from 'react';
import { BellRing, ArrowRight, Loader2, CheckCircle2 } from 'lucide-react';
import { submitLead } from '../lib/leads';
import { Listing } from '../types';

interface ListingAlertSignupProps {
  listing: Listing;
}

// A lower-commitment alternative to "Request a Tour" - for someone
// interested in this specific home but not ready to schedule a showing
// yet. Never blocks anything on the page; purely additive, sitting
// between the agent card and Similar Properties.
export const ListingAlertSignup: React.FC<ListingAlertSignupProps> = ({ listing }) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setError(null);

    const { ok, error: err } = await submitLead({
      name,
      email,
      type: 'Property Inquiry',
      message: `Wants price-change and similar-listing alerts for "${listing.title}" (${listing.address}).`,
    });

    setSubmitting(false);

    if (!ok) {
      setError(err || 'Something went wrong. Please try again.');
      return;
    }

    setSuccess(true);
  };

  return (
    <div className="mt-8 border border-[#C9A96A]/30 bg-[#FAF8F5] p-6 sm:p-7 flex flex-col sm:flex-row items-center gap-5">
      <div className="w-11 h-11 rounded-full border border-[#0F5C63]/40 flex items-center justify-center shrink-0 text-[#0F5C63]">
        <BellRing className="w-5 h-5" />
      </div>

      <div className="flex-1 text-center sm:text-left">
        <h3 className="font-serif text-base font-bold text-[#0D2226]">Not Ready for a Tour Yet?</h3>
        <p className="text-xs text-[#1C2B2E]/65 mt-1">Get alerts if the price changes on this home, plus similar and off-market opportunities.</p>
      </div>

      {success ? (
        <div className="flex items-center gap-2 text-[#0F5C63] text-xs font-bold shrink-0">
          <CheckCircle2 className="w-4 h-4" />
          You're set
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto shrink-0">
          <input
            type="text"
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="First name"
            className="w-full sm:w-28 border border-[#0D2226]/20 p-2.5 text-xs bg-white focus:border-[#0F5C63] focus:outline-none"
          />
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Email address"
            className="w-full sm:w-44 border border-[#0D2226]/20 p-2.5 text-xs bg-white focus:border-[#0F5C63] focus:outline-none"
          />
          <button
            type="submit"
            disabled={submitting}
            className="shrink-0 px-4 py-2.5 bg-[#0D2226] hover:bg-[#0F5C63] text-[#FAF8F5] font-bold text-xs uppercase tracking-widest transition-colors flex items-center justify-center gap-1.5 disabled:opacity-60"
          >
            {submitting ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <ArrowRight className="w-3.5 h-3.5" />}
            {submitting ? '' : 'Notify Me'}
          </button>
        </form>
      )}

      {error && <p className="text-[11px] text-red-600 w-full text-center sm:text-left">{error}</p>}
    </div>
  );
};
