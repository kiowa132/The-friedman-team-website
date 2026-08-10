import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Phone, ShieldCheck, Globe2, Camera, Clock } from 'lucide-react';
import { usePageMeta } from '../lib/usePageMeta';
import { ReviewsSection } from '../components/ReviewsSection';
import { submitLead } from '../lib/leads';

interface LuxuryPageProps {
  onOpenConsultation: () => void;
}

// Deliberately quieter, more understated tone than the rest of the site -
// per the brand doc, no "data-driven" or "strategy" language here, since
// that's the main site's vocabulary and mixing the two dilutes both.
//
// Content note: this page intentionally doesn't cite specific past sales
// or production numbers. Kyle's own closed-transaction history isn't
// built out yet, and his mentor James Buckley's real transactions are
// deliberately kept in a separate, clearly-labeled context elsewhere on
// the site rather than presented here as Kyle's own credentials. Every
// claim below is about the process and representation itself, not a
// fabricated or borrowed track record.
export const LuxuryPage: React.FC<LuxuryPageProps> = ({ onOpenConsultation }) => {
  usePageMeta(
    'Fine Homes & Estate Properties | The Friedman Team',
    'Distinctive homes and estate properties across Carroll, Howard, Frederick, and Baltimore County, marketed and represented with the presentation they deserve.'
  );

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [message, setMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitError(null);

    const { ok, error } = await submitLead({
      name,
      email,
      phone,
      type: 'Seller Inquiry',
      message: message || 'Private conversation requested via the Fine Homes & Estate Properties page.',
    });

    setIsSubmitting(false);

    if (!ok) {
      setSubmitError(error || 'Something went wrong. Please try again or reach Kyle directly.');
      return;
    }

    setSuccess(true);
  };

  const differentiators = [
    {
      icon: ShieldCheck,
      title: 'Discretion, By Default',
      description: 'Off-market conversations, quiet showings, and marketing paced to the property, not a template timeline.',
    },
    {
      icon: Camera,
      title: 'Presentation That Matches the Property',
      description: 'Professional photography and a marketing plan built around what actually makes each home distinctive.',
    },
    {
      icon: Globe2,
      title: 'Reach Beyond the Local Market',
      description: 'Backed by eXp Realty\u2019s global agent network, extending a listing\u2019s visibility well past Maryland.',
    },
    {
      icon: Clock,
      title: 'A Patient, Considered Process',
      description: 'No rush to list before it\u2019s ready. The right buyer is worth waiting for.',
    },
  ];

  return (
    <div className="bg-[#FAF8F5]">

      {/* Hero */}
      <div className="relative min-h-[520px] w-full overflow-hidden flex items-end">
        <img
          src="https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=1800&q=80"
          alt="Distinctive Maryland estate property"
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0D2226] via-[#0D2226]/60 to-[#0D2226]/25" />
        <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 pt-32 pb-16 w-full text-center">
          <span className="text-xs font-bold uppercase tracking-[0.35em] text-[#C9A96A]">
            The Friedman Team
          </span>
          <h1 className="font-serif text-4xl sm:text-6xl font-bold text-[#FAF8F5] leading-tight mt-3">
            Fine Homes &amp; Estate Properties
          </h1>
          <p className="font-serif italic text-lg text-[#F5F1E8]/90 mt-4">
            Distinctive Properties. Deliberate Representation.
          </p>
        </div>
      </div>

      {/* Intro */}
      <div className="max-w-3xl mx-auto px-4 sm:px-6 pt-16">
        <p className="text-base sm:text-lg text-[#1C2B2E]/80 leading-relaxed text-center font-light">
          A different kind of property calls for a different kind of representation. The Friedman Team's estate division is built for distinctive homes across Carroll, Howard, Frederick, and Baltimore County - properties with architectural character, acreage, equestrian facilities, or simply more to offer. Every listing is presented with the photography, marketing, and discretion it deserves.
        </p>
      </div>

      {/* What Sets This Apart */}
      <div className="max-w-5xl mx-auto px-4 sm:px-6 pt-20">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-10 gap-y-10">
          {differentiators.map((d) => (
            <div key={d.title} className="flex gap-4">
              <div className="w-11 h-11 rounded-full border border-[#C9A96A]/40 flex items-center justify-center shrink-0 text-[#0F5C63]">
                <d.icon className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-serif text-lg font-bold text-[#0D2226]">{d.title}</h3>
                <p className="text-sm text-[#1C2B2E]/70 leading-relaxed mt-1">{d.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Zillow Showcase - a real differentiator Kyle offers, given real
          prominence here per his direction, with its own full page for
          the complete explanation and sourced stats. */}
      <div className="max-w-5xl mx-auto px-4 sm:px-6 pt-24">
        <div className="bg-[#0D2226] p-10 sm:p-14 text-center">
          <span className="text-xs font-bold uppercase tracking-[0.3em] text-[#C9A96A]">A Real Difference</span>
          <h2 className="font-serif text-3xl sm:text-4xl font-bold text-[#FAF8F5] mt-3">Zillow Showcase</h2>
          <p className="text-sm sm:text-base text-[#F5F1E8]/85 leading-relaxed max-w-2xl mx-auto mt-5 font-light">
            A premium listing placement available to roughly 10% of listings in a market - interactive floor plans, 3D tours, and priority visibility on Zillow. When a property qualifies, it's part of the marketing plan, at no extra cost.
          </p>
          <Link
            to="/zillow-showcase"
            className="inline-flex items-center gap-2 mt-8 px-8 py-3.5 bg-[#C9A96A] hover:bg-[#D4AF37] text-[#0D2226] font-bold text-xs uppercase tracking-widest rounded-xs transition-colors"
          >
            Learn More About Showcase
          </Link>
        </div>
      </div>

      {/* Downsizing & Senior Relocation Support - real, commissioned
          graphic leading into its own dedicated page, matching the
          Showcase section's pattern. Given real prominence here per
          Kyle's direction - bigger than the other sections on this
          page on purpose. */}
      <div className="max-w-5xl mx-auto px-4 sm:px-6 pt-20">
        <div className="border border-[#C9A96A]/30 shadow-xl overflow-hidden">
          <img src="/images/senior-relocation/banner-crop.jpg" alt="Senior Relocation Services - The Friedman Team" className="w-full h-[220px] sm:h-[320px] object-cover" />
          <div className="bg-white p-10 sm:p-14 text-center">
            <span className="text-xs font-bold uppercase tracking-[0.3em] text-[#C9A96A]">A Different Kind of Move</span>
            <h2 className="font-serif text-3xl sm:text-5xl font-bold text-[#0D2226] mt-3">Senior Relocation Services</h2>
            <p className="text-base sm:text-lg text-[#1C2B2E]/75 leading-relaxed mt-5 font-light max-w-2xl mx-auto">
              Leaving a longtime home is rarely just a transaction. From right-sizing decisions through a coordinated move, Kyle works at a pace that respects what this transition actually is, for the homeowner and their whole family.
            </p>
            <Link
              to="/senior-relocation"
              className="inline-flex items-center gap-2 mt-8 px-8 py-3.5 bg-[#0D2226] hover:bg-[#0F5C63] text-[#FAF8F5] font-bold text-xs uppercase tracking-widest rounded-xs transition-colors"
            >
              Learn More About Senior Relocation Services
            </Link>
          </div>
        </div>
      </div>

      {/* Real reviews - the same genuine Google reviews shown elsewhere on
          the site, not something written specifically for this page. */}
      <div className="pt-24">
        <ReviewsSection />
      </div>

      {/* Quiet, dedicated inquiry - inline rather than a popup modal, on
          purpose, to match the unhurried tone of this page. Separate from
          the site's general consultation modal so an estate inquiry
          arrives with its own framing. */}
      <div className="max-w-xl mx-auto px-4 sm:px-6 py-24">
        <div className="text-center mb-10">
          <h2 className="font-serif text-3xl font-bold text-[#0D2226]">Arrange a Private Conversation</h2>
          <p className="text-sm text-[#1C2B2E]/70 mt-3">
            Whether you're considering a sale or simply exploring what's possible, this starts as a conversation, not a commitment.
          </p>
        </div>

        {success ? (
          <div className="text-center border border-[#C9A96A]/40 bg-white p-10">
            <p className="font-serif text-xl font-bold text-[#0D2226]">Thank You</p>
            <p className="text-sm text-[#1C2B2E]/70 mt-2">Kyle will be in touch personally, shortly.</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Full Name"
              className="w-full border border-[#0D2226]/20 p-3.5 text-sm bg-white focus:border-[#0F5C63] focus:outline-none"
            />
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Email"
                className="w-full border border-[#0D2226]/20 p-3.5 text-sm bg-white focus:border-[#0F5C63] focus:outline-none"
              />
              <input
                type="tel"
                required
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="Phone"
                className="w-full border border-[#0D2226]/20 p-3.5 text-sm bg-white focus:border-[#0F5C63] focus:outline-none"
              />
            </div>
            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Share a little about the property or what you're exploring (optional)"
              rows={4}
              className="w-full border border-[#0D2226]/20 p-3.5 text-sm bg-white focus:border-[#0F5C63] focus:outline-none resize-none"
            />
            {submitError && (
              <p className="text-xs text-red-600">{submitError} You can also reach Kyle directly at (443) 789-3101.</p>
            )}
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full inline-flex items-center justify-center gap-2 px-10 py-4 bg-[#0D2226] hover:bg-[#0F5C63] text-[#FAF8F5] font-bold text-xs uppercase tracking-widest rounded-xs shadow-lg transition-colors disabled:opacity-60"
            >
              <Phone className="w-4 h-4" />
              {isSubmitting ? 'Sending...' : 'Arrange a Private Conversation'}
            </button>
          </form>
        )}
      </div>
    </div>
  );
};
