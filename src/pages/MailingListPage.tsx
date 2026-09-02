import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { CalendarDays, Sparkles, Newspaper, CheckCircle2, Loader2, Mail } from 'lucide-react';
import { submitLead } from '../lib/leads';
import { usePageMeta } from '../lib/usePageMeta';

const PERKS = [
  {
    icon: CalendarDays,
    title: 'Free Baltimore Football Schedule',
    body: 'A pocket-size magnet with the full 2026 season — game days, times, home and away. Sent to your mailbox.',
  },
  {
    icon: CalendarDays,
    title: 'Free Baltimore Baseball Schedule',
    body: 'The complete 2026 baseball schedule on a fridge magnet — every series, first pitch times, home and away.',
  },
  {
    icon: Sparkles,
    title: 'The Monthly "3% Smarter" Card',
    body: 'A card in your mailbox every month: this day in history, a life hack, an astonishing fact, and a riddle. No sales pitch.',
  },
  {
    icon: Newspaper,
    title: 'Local Market Updates',
    body: 'Once a month by email: what homes are actually doing in Carroll, Baltimore, Howard, and Frederick County, plus local news worth knowing.',
  },
];

const GIFT_OPTIONS = [
  { id: 'football', label: 'Baltimore Football schedule magnet' },
  { id: 'baseball', label: 'Baltimore Baseball schedule magnet' },
  { id: 'card', label: 'The monthly "3% Smarter" card' },
];

export const MailingListPage: React.FC = () => {
  usePageMeta(
    'Join the Mailing List | Free Baltimore Sports Schedules | The Friedman Team',
    'Join Kyle Friedman\'s mailing list and get a free 2026 Baltimore football schedule magnet, a free baseball schedule magnet, a monthly "3% Smarter" card, and local Maryland market updates.'
  );

  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [street, setStreet] = useState('');
  const [city, setCity] = useState('');
  const [state, setState] = useState('MD');
  const [zip, setZip] = useState('');
  const [gifts, setGifts] = useState<string[]>(GIFT_OPTIONS.map((g) => g.id));
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const toggleGift = (id: string) =>
    setGifts((prev) => (prev.includes(id) ? prev.filter((g) => g !== id) : [...prev, id]));

  const selectedLabels = GIFT_OPTIONS.filter((g) => gifts.includes(g.id)).map((g) => g.label);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setError(null);

    const wants = selectedLabels.length ? selectedLabels.join('; ') : 'Email updates only';
    const { ok, error: err } = await submitLead({
      name: `${firstName} ${lastName}`.trim(),
      email,
      phone: phone || undefined,
      type: 'Mailing List',
      address: { street, city, state, zip },
      tags: [
        'Mailing List',
        ...(gifts.includes('football') ? ['Baltimore Football Schedule'] : []),
        ...(gifts.includes('baseball') ? ['Baltimore Baseball Schedule'] : []),
        ...(gifts.includes('card') ? ['Monthly Card'] : []),
      ],
      message: `Mailing list signup. Send: ${wants}. Mailing address: ${street}, ${city}, ${state} ${zip}.`,
    });

    setSubmitting(false);
    if (!ok) {
      setError(err || 'Something went wrong. Please try again.');
      return;
    }
    setSuccess(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const inputClass =
    'w-full border border-[#0D2226]/20 p-3 text-sm bg-white focus:border-[#0F5C63] focus:outline-none placeholder:text-[#1C2B2E]/40';

  return (
    <div className="pt-20 pb-20 bg-[#FAF8F5]">
      <div className="max-w-3xl mx-auto px-4 sm:px-6">
        {/* Hero */}
        <div className="pt-10 pb-8 text-center">
          <div className="w-12 h-12 rounded-full border border-[#0F5C63]/40 flex items-center justify-center mx-auto text-[#0F5C63] mb-4">
            <Mail className="w-5 h-5" />
          </div>
          <h1 className="font-serif text-3xl sm:text-4xl font-bold text-[#0D2226] leading-tight">
            Join the Mailing List
          </h1>
          <p className="mt-3 text-[15px] text-[#1C2B2E]/70 max-w-xl mx-auto leading-relaxed">
            Free Baltimore sports schedule magnets, a monthly card that makes you 3% smarter, and a
            once-a-month read on the local market. No spam, and you can opt out anytime.
          </p>
        </div>

        {success ? (
          <div className="border border-[#0F5C63]/30 bg-white rounded-xs p-8 text-center space-y-3">
            <CheckCircle2 className="w-10 h-10 text-[#0F5C63] mx-auto" />
            <h2 className="font-serif text-2xl font-bold text-[#0D2226]">You're on the list.</h2>
            <p className="text-sm text-[#1C2B2E]/70 max-w-md mx-auto">
              {selectedLabels.length > 0
                ? `Your ${selectedLabels.join(', ')} will go out in the mail. `
                : ''}
              Keep an eye on your inbox for the first market update.
            </p>
            <Link
              to="/blog"
              className="inline-block mt-2 px-6 py-3 bg-[#0D2226] text-[#FAF8F5] font-bold text-xs uppercase tracking-widest rounded-xs hover:bg-[#0F5C63] transition-colors"
            >
              Read the Latest Report
            </Link>
          </div>
        ) : (
          <>
            {/* Perks */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-10">
              {PERKS.map((p) => (
                <div key={p.title} className="border border-[#C9A96A]/40 bg-white rounded-xs p-5 flex gap-3">
                  <p.icon className="w-5 h-5 text-[#C9A96A] shrink-0 mt-0.5" />
                  <div>
                    <h3 className="font-serif text-base font-bold text-[#0D2226] leading-snug">{p.title}</h3>
                    <p className="text-xs text-[#1C2B2E]/65 mt-1 leading-relaxed">{p.body}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="border border-[#0D2226]/15 bg-white rounded-xs p-6 sm:p-8 space-y-5">
              <div>
                <h2 className="font-serif text-xl font-bold text-[#0D2226]">Where should we send it?</h2>
                <p className="text-xs text-[#1C2B2E]/55 mt-1">
                  The magnets and cards are mailed, so we need a real address. It's never shared or sold.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <input className={inputClass} type="text" required placeholder="First name" value={firstName} onChange={(e) => setFirstName(e.target.value)} />
                <input className={inputClass} type="text" required placeholder="Last name" value={lastName} onChange={(e) => setLastName(e.target.value)} />
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <input className={inputClass} type="email" required placeholder="Email address" value={email} onChange={(e) => setEmail(e.target.value)} />
                <input className={inputClass} type="tel" placeholder="Phone (optional)" value={phone} onChange={(e) => setPhone(e.target.value)} />
              </div>
              <input className={inputClass} type="text" required placeholder="Street address" value={street} onChange={(e) => setStreet(e.target.value)} />
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                <input className={`${inputClass} col-span-2 sm:col-span-1`} type="text" required placeholder="City" value={city} onChange={(e) => setCity(e.target.value)} />
                <input className={inputClass} type="text" required placeholder="State" value={state} onChange={(e) => setState(e.target.value)} maxLength={2} />
                <input className={inputClass} type="text" required placeholder="ZIP" value={zip} onChange={(e) => setZip(e.target.value)} inputMode="numeric" />
              </div>

              <fieldset className="pt-1">
                <legend className="text-xs font-bold uppercase tracking-widest text-[#0F5C63] mb-2">Send me</legend>
                <div className="space-y-2">
                  {GIFT_OPTIONS.map((g) => (
                    <label key={g.id} className="flex items-center gap-3 text-sm text-[#0D2226] cursor-pointer">
                      <input
                        type="checkbox"
                        checked={gifts.includes(g.id)}
                        onChange={() => toggleGift(g.id)}
                        className="w-4 h-4 accent-[#0F5C63]"
                      />
                      {g.label}
                    </label>
                  ))}
                </div>
                <p className="text-[11px] text-[#1C2B2E]/50 mt-2">
                  Leave all unchecked to get the monthly email only.
                </p>
              </fieldset>

              {error && <p className="text-xs text-red-600">{error}</p>}

              <button
                type="submit"
                disabled={submitting}
                className="w-full py-3.5 bg-[#0D2226] hover:bg-[#0F5C63] text-[#FAF8F5] font-bold text-xs uppercase tracking-widest transition-colors rounded-xs flex items-center justify-center gap-2 disabled:opacity-60"
              >
                {submitting ? <Loader2 className="w-4 h-4 animate-spin" /> : null}
                {submitting ? 'Sending…' : 'Get My Free Schedules'}
              </button>

              <p className="text-[11px] text-[#1C2B2E]/45 leading-relaxed text-center">
                Team names are the trademarks of their respective owners, who do not sponsor, endorse, or
                have any connection with this mailing. By signing up you agree to receive occasional email
                and mail from The Friedman Team; opt out anytime.
              </p>
            </form>
          </>
        )}
      </div>
    </div>
  );
};
