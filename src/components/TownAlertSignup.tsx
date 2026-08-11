import React, { useState } from 'react';
import { Bell, ArrowRight, Loader2, CheckCircle2 } from 'lucide-react';
import { submitLead } from '../lib/leads';

interface TownAlertSignupProps {
  townName: string;
}

// A quiet, additive capture - the page and its listings stay fully open
// either way, this just offers to notify someone when something new
// comes up. Never blocks anything, which is deliberate: these are core
// SEO pages (30 of them), so nothing here should risk that.
export const TownAlertSignup: React.FC<TownAlertSignupProps> = ({ townName }) => {
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
      type: 'Registration',
      message: `Wants to be notified about new listings in ${townName}.`,
    });

    setSubmitting(false);

    if (!ok) {
      setError(err || 'Something went wrong. Please try again.');
      return;
    }

    setSuccess(true);
  };

  return (
    <div className="bg-[#0D2226] p-7 sm:p-9 flex flex-col sm:flex-row items-center gap-6">
      <div className="w-12 h-12 rounded-full border border-[#C9A96A]/50 flex items-center justify-center shrink-0 text-[#C9A96A]">
        <Bell className="w-5 h-5" />
      </div>

      <div className="flex-1 text-center sm:text-left">
        <h3 className="font-serif text-lg font-bold text-[#FAF8F5]">Get Notified About New Listings in {townName}</h3>
        <p className="text-xs text-[#A8B2A1] mt-1">The moment something new hits the market here, you'll know first.</p>
      </div>

      {success ? (
        <div className="flex items-center gap-2 text-[#C9A96A] text-xs font-bold shrink-0">
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
            className="w-full sm:w-32 bg-[#FAF8F5] border border-[#FAF8F5]/20 p-2.5 text-xs text-[#0D2226] placeholder-[#1C2B2E]/50 focus:border-[#C9A96A] focus:outline-none"
          />
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Email address"
            className="w-full sm:w-48 bg-[#FAF8F5] border border-[#FAF8F5]/20 p-2.5 text-xs text-[#0D2226] placeholder-[#1C2B2E]/50 focus:border-[#C9A96A] focus:outline-none"
          />
          <button
            type="submit"
            disabled={submitting}
            className="shrink-0 px-5 py-2.5 bg-[#C9A96A] hover:bg-[#D4AF37] text-[#0D2226] font-bold text-xs uppercase tracking-widest transition-colors flex items-center justify-center gap-1.5 disabled:opacity-60"
          >
            {submitting ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <ArrowRight className="w-3.5 h-3.5" />}
            {submitting ? '' : 'Notify Me'}
          </button>
        </form>
      )}

      {error && <p className="text-[11px] text-red-300 w-full text-center sm:text-left">{error}</p>}
    </div>
  );
};
