import React, { useState } from 'react';
import { X, ShieldCheck, AlertCircle, Download, CheckCircle2 } from 'lucide-react';
import { submitLead } from '../lib/leads';

interface HandbookLeadModalProps {
  coverImage: string;
  title: string;
  onClose: () => void;
  onUnlocked: () => void;
}

export const HandbookLeadModal: React.FC<HandbookLeadModalProps> = ({ coverImage, title, onClose, onUnlocked }) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [timeframe, setTimeframe] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    const { ok, error: err } = await submitLead({
      name,
      email,
      phone,
      type: 'General Inquiry',
      message: `Unlocked guide: "${title}"${timeframe ? ` | Timeframe: ${timeframe}` : ''}`,
    });

    setIsSubmitting(false);

    if (!ok) {
      setError(err || 'Something went wrong. Please try again or contact Kyle directly.');
      return;
    }

    setSuccess(true);
    setTimeout(onUnlocked, 900);
  };

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4" style={{ backdropFilter: 'blur(8px)' }}>
      <div className="absolute inset-0 bg-[#0D2226]/80" onClick={onClose} />
      <div className="relative w-full max-w-sm bg-[#FAF8F5] rounded-lg overflow-hidden shadow-2xl">
        <button onClick={onClose} className="absolute top-3 right-3 z-10 w-8 h-8 rounded-full bg-[#0D2226]/40 hover:bg-[#0D2226]/60 flex items-center justify-center transition-colors">
          <X className="w-4 h-4 text-white" />
        </button>

        {success ? (
          <div className="py-16 px-8 text-center">
            <CheckCircle2 className="w-12 h-12 text-[#0F5C63] mx-auto mb-4" />
            <h2 className="font-serif text-xl font-bold text-[#0D2226]">You're in</h2>
            <p className="text-sm text-[#1C2B2E]/60 mt-2">Opening your copy now...</p>
          </div>
        ) : (
          <>
            <div className="relative h-32 bg-[#0D2226] flex items-end justify-center overflow-hidden">
              <img src={coverImage} alt={title} className="h-40 w-auto -mb-4 shadow-[0_10px_30px_rgba(0,0,0,0.5)] rounded-sm" />
              <div className="absolute top-3 left-3 px-2.5 py-1 bg-[#C9A96A] text-[#0D2226] text-[9px] font-bold uppercase tracking-widest rounded-full">
                Instant Access
              </div>
            </div>

            <form onSubmit={handleSubmit} className="px-6 sm:px-8 pt-8 pb-6 space-y-3.5">
              <p className="text-center text-sm text-[#1C2B2E]/70 mb-1">
                Enter your info below to unlock your free copy of <span className="font-semibold text-[#0D2226]">{title}</span>, instantly.
              </p>

              <input
                type="text" required value={name} onChange={(e) => setName(e.target.value)}
                placeholder="First name"
                className="w-full bg-white border border-[#C9A96A]/30 px-4 py-2.5 text-sm rounded-xs focus:outline-none focus:border-[#C9A96A]"
              />
              <input
                type="email" required value={email} onChange={(e) => setEmail(e.target.value)}
                placeholder="Email"
                className="w-full bg-white border border-[#C9A96A]/30 px-4 py-2.5 text-sm rounded-xs focus:outline-none focus:border-[#C9A96A]"
              />
              <input
                type="tel" value={phone} onChange={(e) => setPhone(e.target.value)}
                placeholder="Phone (optional)"
                className="w-full bg-white border border-[#C9A96A]/30 px-4 py-2.5 text-sm rounded-xs focus:outline-none focus:border-[#C9A96A]"
              />
              <select
                value={timeframe} onChange={(e) => setTimeframe(e.target.value)}
                className="w-full bg-white border border-[#C9A96A]/30 px-4 py-2.5 text-sm rounded-xs focus:outline-none focus:border-[#C9A96A] text-[#1C2B2E]/70"
              >
                <option value="">Buying timeframe (optional)</option>
                <option value="0-3 Months">0 to 3 months</option>
                <option value="3-6 Months">3 to 6 months</option>
                <option value="6-12 Months">6 to 12 months</option>
                <option value="Just Researching">Just researching</option>
              </select>

              {error && (
                <div className="bg-red-900/10 border border-red-500/30 p-3 rounded-xs flex items-start gap-2">
                  <AlertCircle className="w-4 h-4 text-red-500 shrink-0 mt-0.5" />
                  <p className="text-xs text-red-700">{error}</p>
                </div>
              )}

              <button
                type="submit" disabled={isSubmitting}
                className="w-full py-3.5 bg-[#C9A96A] hover:bg-[#D4AF37] text-[#0D2226] font-bold text-xs uppercase tracking-widest rounded-xs shadow-lg transition-all disabled:opacity-60 flex items-center justify-center gap-2"
              >
                <Download className="w-4 h-4" />
                {isSubmitting ? 'Unlocking...' : 'Unlock My Free Copy'}
              </button>

              <p className="text-[10px] text-[#1C2B2E]/50 text-center flex items-center justify-center gap-1.5">
                <ShieldCheck className="w-3 h-3 text-[#C9A96A]" />
                Your info goes straight to Kyle. Never sold or shared.
              </p>
            </form>
          </>
        )}
      </div>
    </div>
  );
};
