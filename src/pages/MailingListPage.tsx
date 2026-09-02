import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { m } from 'motion/react';
import { CheckCircle2, Loader2, Mail, Sparkles, PenLine, MailPlus, CalendarClock, ZoomIn, X, Check, Plus } from 'lucide-react';
import { submitLead } from '../lib/leads';
import { usePageMeta } from '../lib/usePageMeta';
import { Reveal, RevealItem } from '../components/Reveal';
import { ReviewsSection } from '../components/ReviewsSection';

const IMG = {
  hero: '/images/mailing-list/hero.jpg',
  football: '/images/mailing-list/football-schedule.jpg',
  baseball: '/images/mailing-list/baseball-schedule.jpg',
  amCard: '/images/mailing-list/am-card.jpg',
};

const GIFT_OPTIONS = [
  { id: 'football', label: 'Baltimore Football schedule magnet' },
  { id: 'baseball', label: 'Baltimore Baseball schedule magnet' },
  { id: 'card', label: 'The monthly "3% Smarter" card' },
];

// A few real blurbs from the actual card, cycled in the "peek inside" panel.
const CARD_PEEKS = [
  {
    tag: 'Astonishing fact',
    text: 'An octopus has three hearts and blue blood. Two pump blood to the gills; the third pumps it to the rest of the body, and it stops beating when the octopus swims, which is why they prefer to crawl.',
  },
  {
    tag: 'Life hack',
    text: 'Stretch a rubber band across the open top of a paint can and wipe your brush on the band instead of the rim. No drips, and the lid seals clean when you’re done.',
  },
  {
    tag: 'This day in history',
    text: 'September 9, 1776: the Continental Congress officially renamed the colonies the "United States" of America, replacing "United Colonies."',
  },
  { tag: 'Riddle', text: '"What has hands but can’t clap?" (Answer’s on the back of the card.)' },
];

// Loads an image; if the file isn't in the repo yet, shows a clean
// placeholder instead of a broken image.
const Figure: React.FC<{
  src: string;
  alt: string;
  label: string;
  className?: string;
  ratio?: string;
  hideOnError?: boolean;
}> = ({ src, alt, label, className = '', ratio = 'aspect-[5/7]', hideOnError = false }) => {
  const [errored, setErrored] = useState(false);
  if (errored) {
    if (hideOnError) return null;
    return (
      <div className={`${ratio} bg-[#EFEBE2] border border-[#C9A96A]/40 flex items-center justify-center text-center px-6 ${className}`}>
        <span className="text-[11px] uppercase tracking-widest text-[#1C2B2E]/45">{label} image coming soon</span>
      </div>
    );
  }
  return <img src={src} alt={alt} loading="lazy" onError={() => setErrored(true)} className={`w-full h-auto ${className}`} />;
};

export const MailingListPage: React.FC = () => {
  usePageMeta(
    'Join the Mailing List | Free Baltimore Sports Schedules | The Friedman Team',
    'Join Kyle Friedman\'s mailing list for a free 2026 Baltimore football schedule magnet, a free baseball schedule magnet, a monthly "3% Smarter" card, and local Maryland market updates.'
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

  const [peek, setPeek] = useState(0);
  const [peekPaused, setPeekPaused] = useState(false);
  const [zoom, setZoom] = useState<{ src: string; alt: string } | null>(null);

  useEffect(() => {
    if (peekPaused) return;
    const t = setInterval(() => setPeek((p) => (p + 1) % CARD_PEEKS.length), 5000);
    return () => clearInterval(t);
  }, [peekPaused]);

  useEffect(() => {
    if (!zoom) return;
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && setZoom(null);
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [zoom]);

  const pickPeek = (i: number) => {
    setPeek(i);
    setPeekPaused(true);
  };

  const toggleGift = (id: string) =>
    setGifts((prev) => (prev.includes(id) ? prev.filter((g) => g !== id) : [...prev, id]));

  const selectedLabels = GIFT_OPTIONS.filter((g) => gifts.includes(g.id)).map((g) => g.label);
  const hasAddress = street.trim() !== '' && zip.trim() !== '';
  const wantsMailedGift = gifts.length > 0;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (firstName.trim() === '') {
      setError('Please add your first name.');
      return;
    }
    if (email.trim() === '' && phone.trim() === '' && !hasAddress) {
      setError('Add at least one of: email, phone, or a full mailing address so we can reach you.');
      return;
    }

    setSubmitting(true);
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
      message: hasAddress
        ? `Mailing list signup. Send: ${wants}. Mailing address: ${street}, ${city}, ${state} ${zip}.`
        : `Mailing list signup. Wants: ${wants}. NO MAILING ADDRESS PROVIDED - follow up for an address before sending anything physical.`,
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
    'w-full border border-[#0D2226]/20 p-3.5 text-sm bg-white focus:border-[#0F5C63] focus:outline-none placeholder:text-[#1C2B2E]/40';

  // "Add to my list" chip that syncs with the form's gift checkboxes.
  const addChip = (id: string) => {
    const on = gifts.includes(id);
    return (
      <button
        type="button"
        onClick={() => toggleGift(id)}
        className={`inline-flex items-center gap-1.5 mt-4 px-4 py-2 text-[11px] font-bold uppercase tracking-widest rounded-xs border transition-colors ${
          on ? 'bg-[#0F5C63] border-[#0F5C63] text-[#FAF8F5]' : 'border-[#C9A96A] text-[#0F5C63] hover:bg-[#C9A96A]/10'
        }`}
      >
        {on ? <Check className="w-3.5 h-3.5" /> : <Plus className="w-3.5 h-3.5" />}
        {on ? 'On my list' : 'Add to my list'}
      </button>
    );
  };

  // Product image wrapped as a click-to-zoom button.
  const zoomable = (src: string, alt: string, label: string, wrapClass: string, ratio: string) => (
    <button
      type="button"
      onClick={() => setZoom({ src, alt })}
      className={`relative block cursor-zoom-in group/z ${wrapClass}`}
    >
      <Figure src={src} alt={alt} label={label} ratio={ratio} />
      <span className="absolute inset-0 flex items-center justify-center bg-[#0D2226]/0 group-hover/z:bg-[#0D2226]/20 transition-colors">
        <ZoomIn className="w-6 h-6 text-white opacity-0 group-hover/z:opacity-100 transition-opacity drop-shadow" />
      </span>
    </button>
  );

  return (
    <div className="bg-[#FAF8F5]">
      {/* HERO - solid brand color, no photo */}
      <div className="relative w-full bg-[#0D2226] border-b-4 border-[#C9A96A]">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 pt-36 pb-20 w-full text-center">
          <span className="text-xs font-bold uppercase tracking-[0.35em] text-[#C9A96A]">
            The Friedman Team · Free for the Neighborhood
          </span>
          <div className="w-12 h-px bg-[#C9A96A]/60 mx-auto mt-6" />
          <h1 className="font-serif text-5xl sm:text-7xl font-bold text-[#FAF8F5] leading-[1.03] mt-6">
            Good Mail Still Exists
          </h1>
          <p className="text-sm sm:text-base text-[#F5F1E8]/80 mt-6 max-w-xl mx-auto font-light leading-relaxed">
            Free Baltimore sports schedule magnets, a card that makes you 3% smarter every month, and a
            once-a-month read on the local market. No spam, opt out anytime.
          </p>
          <a
            href="#signup"
            className="inline-flex items-center gap-2 mt-9 px-8 py-3.5 bg-[#C9A96A] hover:bg-[#D4AF37] text-[#0D2226] font-bold text-xs uppercase tracking-widest rounded-xs transition-colors"
          >
            Claim Your Free Schedules
          </a>
        </div>
      </div>

      {/* WHAT ARRIVES */}
      <div className="max-w-5xl mx-auto px-4 sm:px-6 pt-20">
        <Reveal className="text-center mb-12">
          <span className="text-xs font-bold uppercase tracking-[0.3em] text-[#C9A96A]">In Your Mailbox</span>
          <h2 className="font-serif text-3xl sm:text-4xl font-bold text-[#0D2226] mt-3">
            Real things, actually mailed
          </h2>
          <p className="text-sm sm:text-base text-[#1C2B2E]/70 mt-4 max-w-2xl mx-auto font-light">
            Not another email list. Physical pieces you’ll actually keep on the fridge, plus the local
            market context most people never get.
          </p>
        </Reveal>

        <Reveal stagger className="grid grid-cols-1 sm:grid-cols-2 gap-8">
          <RevealItem className="group">
            <div className="border border-[#C9A96A]/30 bg-white shadow-xl overflow-hidden transition-transform duration-500 group-hover:-translate-y-1">
              <div className="p-6 sm:p-8 flex justify-center bg-[#F4F1EA]">
                {zoomable(IMG.football, 'Free 2026 Baltimore football schedule magnet', 'Football schedule', 'w-2/3 rotate-[-3deg] shadow-2xl', 'aspect-[5/12]')}
              </div>
              <div className="p-6 sm:p-7 text-center border-t border-[#C9A96A]/20">
                <h3 className="font-serif text-xl font-bold text-[#0D2226]">Baltimore Football Schedule</h3>
                <p className="text-xs text-[#1C2B2E]/65 mt-2 leading-relaxed">
                  Every 2026 game on a fridge magnet. Dates, kickoff times, home and away. Tap to enlarge.
                </p>
                {addChip('football')}
              </div>
            </div>
          </RevealItem>

          <RevealItem className="group">
            <div className="border border-[#C9A96A]/30 bg-white shadow-xl overflow-hidden transition-transform duration-500 group-hover:-translate-y-1">
              <div className="p-6 sm:p-8 flex justify-center bg-[#F4F1EA]">
                {zoomable(IMG.baseball, 'Free 2026 Baltimore baseball schedule magnet', 'Baseball schedule', 'w-2/3 rotate-[3deg] shadow-2xl', 'aspect-[5/12]')}
              </div>
              <div className="p-6 sm:p-7 text-center border-t border-[#C9A96A]/20">
                <h3 className="font-serif text-xl font-bold text-[#0D2226]">Baltimore Baseball Schedule</h3>
                <p className="text-xs text-[#1C2B2E]/65 mt-2 leading-relaxed">
                  The full 2026 season on a magnet. Every series, first-pitch times, home and away. Tap to enlarge.
                </p>
                {addChip('baseball')}
              </div>
            </div>
          </RevealItem>
        </Reveal>
      </div>

      {/* THE AM CARD + PEEK INSIDE */}
      <div className="max-w-5xl mx-auto px-4 sm:px-6 pt-20">
        <Reveal className="border border-[#C9A96A]/30 bg-white shadow-xl overflow-hidden">
          <div className="grid grid-cols-1 lg:grid-cols-2">
            <div className="p-6 sm:p-10 bg-[#F4F1EA] flex items-center justify-center">
              {zoomable(IMG.amCard, 'The monthly 3% Smarter card from The Friedman Team', 'The monthly card', 'w-full shadow-2xl', 'aspect-[4/3]')}
            </div>
            <div className="p-8 sm:p-12 flex flex-col justify-center">
              <span className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-[0.3em] text-[#C9A96A]">
                <Sparkles className="w-3.5 h-3.5" /> Every Month
              </span>
              <h2 className="font-serif text-3xl sm:text-4xl font-bold text-[#0D2226] mt-3">
                The "3% Smarter" Card
              </h2>
              <p className="text-sm text-[#1C2B2E]/70 mt-4 leading-relaxed font-light">
                One card in your mailbox a month: this day in history, a genuinely useful life hack, an
                astonishing fact, and a riddle. No pitch, no ask, just a reason to smile at the mail.
              </p>

              <div className="flex flex-wrap gap-2 mt-6">
                {CARD_PEEKS.map((c, i) => (
                  <button
                    key={i}
                    type="button"
                    onClick={() => pickPeek(i)}
                    className={`px-3 py-1.5 text-[10px] font-bold uppercase tracking-widest rounded-xs border transition-colors ${
                      i === peek
                        ? 'bg-[#0F5C63] border-[#0F5C63] text-[#FAF8F5]'
                        : 'border-[#C9A96A]/50 text-[#0F5C63] hover:border-[#C9A96A]'
                    }`}
                  >
                    {c.tag}
                  </button>
                ))}
              </div>
              <div className="mt-4 border-l-[3px] border-[#C9A96A] pl-5 min-h-[120px]">
                <m.div key={peek} initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
                  <p className="text-sm text-[#0D2226]/90 leading-relaxed italic font-serif">
                    {CARD_PEEKS[peek].text}
                  </p>
                </m.div>
              </div>
              {addChip('card')}
            </div>
          </div>
        </Reveal>
      </div>

      {/* HOW IT WORKS */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 pt-24">
        <Reveal className="text-center mb-10">
          <span className="text-xs font-bold uppercase tracking-[0.3em] text-[#C9A96A]">Simple</span>
          <h2 className="font-serif text-3xl sm:text-4xl font-bold text-[#0D2226] mt-3">How it works</h2>
        </Reveal>
        <Reveal stagger className="grid grid-cols-1 sm:grid-cols-3 gap-8">
          {[
            { icon: PenLine, step: '01', title: 'Sign up', body: 'Your name and one way to reach you. Add a mailing address for the magnets.' },
            { icon: MailPlus, step: '02', title: 'Check the mail', body: 'Your schedule magnets go out in the next batch, straight to your door.' },
            { icon: CalendarClock, step: '03', title: 'Every month after', body: 'A "3% Smarter" card by mail and one local market update by email.' },
          ].map((s) => (
            <RevealItem key={s.step} className="text-center">
              <div className="w-12 h-12 rounded-full border border-[#C9A96A]/40 flex items-center justify-center mx-auto text-[#0F5C63]">
                <s.icon className="w-5 h-5" />
              </div>
              <div className="text-[11px] font-bold tracking-widest text-[#C9A96A] mt-4">{s.step}</div>
              <h3 className="font-serif text-lg font-bold text-[#0D2226] mt-1">{s.title}</h3>
              <p className="text-xs text-[#1C2B2E]/65 mt-2 leading-relaxed">{s.body}</p>
            </RevealItem>
          ))}
        </Reveal>
      </div>

      {/* THE MONTHLY READ */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 pt-24">
        <Reveal className="bg-[#0D2226] text-[#FAF8F5] p-10 sm:p-14 text-center">
          <span className="text-xs font-bold uppercase tracking-[0.3em] text-[#C9A96A]">Also Included</span>
          <h2 className="font-serif text-2xl sm:text-3xl font-bold mt-3">The monthly market read</h2>
          <p className="text-sm text-[#F5F1E8]/85 mt-4 max-w-2xl mx-auto font-light leading-relaxed">
            Once a month by email: what homes are actually doing in Carroll, Baltimore, Howard, and
            Frederick County: prices, days on market, what it means if you’re thinking about a move,
            plus local news worth knowing.
          </p>
          <Link
            to="/blog"
            className="inline-block mt-7 px-7 py-3 border border-[#C9A96A] text-[#C9A96A] hover:bg-[#C9A96A] hover:text-[#0D2226] font-bold text-xs uppercase tracking-widest rounded-xs transition-colors"
          >
            See a Recent Report
          </Link>
        </Reveal>
      </div>

      {/* SIGNUP FORM */}
      <div id="signup" className="max-w-2xl mx-auto px-4 sm:px-6 pt-24 pb-4 scroll-mt-24">
        <div className="text-center mb-8">
          <div className="w-12 h-12 rounded-full border border-[#0F5C63]/40 flex items-center justify-center mx-auto text-[#0F5C63] mb-4">
            <Mail className="w-5 h-5" />
          </div>
          <h2 className="font-serif text-3xl sm:text-4xl font-bold text-[#0D2226]">Join the Mailing List</h2>
          <p className="text-sm text-[#1C2B2E]/65 mt-3">
            Free, and you can opt out anytime. Never shared or sold.
          </p>
        </div>

        {success ? (
          <div className="border border-[#0F5C63]/30 bg-white shadow-xl p-10 text-center space-y-3">
            <CheckCircle2 className="w-10 h-10 text-[#0F5C63] mx-auto" />
            <h3 className="font-serif text-2xl font-bold text-[#0D2226]">You’re on the list.</h3>
            <p className="text-sm text-[#1C2B2E]/70 max-w-md mx-auto">
              {selectedLabels.length > 0 ? `Your ${selectedLabels.join(', ')} will go out in the mail. ` : ''}
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
          <form onSubmit={handleSubmit} className="border border-[#0D2226]/15 bg-white shadow-xl p-6 sm:p-9 space-y-5">
            <div>
              <h3 className="font-serif text-xl font-bold text-[#0D2226]">Your details</h3>
              <p className="text-xs text-[#1C2B2E]/55 mt-1">
                Just your name and one way to reach you: email, phone, or a mailing address.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <input className={inputClass} type="text" required placeholder="First name" value={firstName} onChange={(e) => setFirstName(e.target.value)} />
              <input className={inputClass} type="text" placeholder="Last name (optional)" value={lastName} onChange={(e) => setLastName(e.target.value)} />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <input className={inputClass} type="email" placeholder="Email address" value={email} onChange={(e) => setEmail(e.target.value)} />
              <input className={inputClass} type="tel" placeholder="Phone" value={phone} onChange={(e) => setPhone(e.target.value)} />
            </div>

            <div className="pt-1">
              <p className="text-[11px] font-bold uppercase tracking-widest text-[#0F5C63] mb-2">
                Mailing address
                {wantsMailedGift && !hasAddress && (
                  <span className="text-[#B5544A] normal-case font-normal tracking-normal"> (needed to mail the magnets or card)</span>
                )}
              </p>
              <input className={`${inputClass} mb-3`} type="text" placeholder="Street address" value={street} onChange={(e) => setStreet(e.target.value)} />
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                <input className={`${inputClass} col-span-2 sm:col-span-1`} type="text" placeholder="City" value={city} onChange={(e) => setCity(e.target.value)} />
                <input className={inputClass} type="text" placeholder="State" value={state} onChange={(e) => setState(e.target.value)} maxLength={2} />
                <input className={inputClass} type="text" placeholder="ZIP" value={zip} onChange={(e) => setZip(e.target.value)} inputMode="numeric" />
              </div>
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
              <p className="text-[11px] text-[#1C2B2E]/50 mt-2">Leave all unchecked to get the monthly email only.</p>
            </fieldset>

            {error && <p className="text-xs text-red-600">{error}</p>}

            <button
              type="submit"
              disabled={submitting}
              className="w-full py-4 bg-[#0D2226] hover:bg-[#0F5C63] text-[#FAF8F5] font-bold text-xs uppercase tracking-widest transition-colors rounded-xs shadow-lg flex items-center justify-center gap-2 disabled:opacity-60"
            >
              {submitting ? <Loader2 className="w-4 h-4 animate-spin" /> : null}
              {submitting ? 'Sending…' : wantsMailedGift ? 'Get My Free Schedules' : 'Join the List'}
            </button>

            <p className="text-[11px] text-[#1C2B2E]/45 leading-relaxed text-center">
              Team names are the trademarks of their respective owners, who do not sponsor, endorse, or have
              any connection with this mailing. By signing up you agree to receive occasional email and mail
              from The Friedman Team; opt out anytime.
            </p>
          </form>
        )}
      </div>

      {/* SOCIAL PROOF */}
      <div className="pt-16">
        <ReviewsSection />
      </div>

      {/* LIGHTBOX */}
      {zoom && (
        <m.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.2 }}
          onClick={() => setZoom(null)}
          className="fixed inset-0 z-[100] bg-[#0D2226]/92 flex items-center justify-center p-4 sm:p-10 cursor-zoom-out"
        >
          <button
            type="button"
            aria-label="Close"
            onClick={() => setZoom(null)}
            className="absolute top-4 right-4 text-white/80 hover:text-white"
          >
            <X className="w-7 h-7" />
          </button>
          <img
            src={zoom.src}
            alt={zoom.alt}
            onClick={(e) => e.stopPropagation()}
            className="max-h-full max-w-full object-contain shadow-2xl cursor-default"
          />
        </m.div>
      )}
    </div>
  );
};
