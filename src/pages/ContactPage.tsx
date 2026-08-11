import React, { useState } from 'react';
import { Phone, Mail, MapPin, ShieldCheck, CheckCircle2, Clock, Building2, Calendar, AlertCircle } from 'lucide-react';
import { LeadFormPayload } from '../types';
import { submitLead } from '../lib/leads';
import { usePageMeta } from '../lib/usePageMeta';

interface ContactPageProps {
  onOpenValuation: () => void;
}

export const ContactPage: React.FC<ContactPageProps> = ({ onOpenValuation }) => {
  usePageMeta(
    'Contact The Friedman Team | Kyle Friedman, eXp Realty',
    'Get in touch with Kyle Friedman and The Friedman Team - buying, selling, or just exploring your options in Carroll, Baltimore, Howard, or Frederick County, Maryland.'
  );
  const [form, setForm] = useState<LeadFormPayload>({
    name: '',
    email: '',
    phone: '',
    interest: 'Selling',
    targetCounty: 'Carroll County',
    timeline: '1-3 Months',
    message: ''
  });

  const [submitted, setSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitError(null);

    const details = [
      `Interest: ${form.interest}`,
      `Target county: ${form.targetCounty}`,
      `Timeline: ${form.timeline}`,
      form.message ? `Notes: ${form.message}` : null,
    ].filter(Boolean).join('\n');

    const leadType = form.interest === 'Selling' || form.interest === 'Valuation' ? 'Seller Inquiry' : 'General Inquiry';

    const { ok, error } = await submitLead({
      name: form.name,
      email: form.email,
      phone: form.phone,
      type: leadType,
      message: details,
    });

    setIsSubmitting(false);

    if (!ok) {
      setSubmitError(error || 'Something went wrong sending your request. Please call or email Kyle Friedman directly.');
      return;
    }

    setSubmitted(true);
  };

  return (
    <div className="pt-28 pb-20 space-y-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      
      {/* Header */}
      <div className="text-center space-y-3">
        <span className="text-xs font-bold uppercase tracking-[0.25em] text-[#0F5C63] bg-[#0F5C63]/10 px-4 py-1.5 border border-[#0F5C63]/30 inline-block">
          Get In Touch
        </span>
        <h1 className="font-serif text-4xl sm:text-6xl font-bold text-[#0D2226]">
          Let's Talk About Your Goals
        </h1>
        <p className="text-sm text-[#1C2B2E]/80 max-w-2xl mx-auto font-normal">
          Whether you're buying, selling, or just exploring your options, Kyle Friedman and The Friedman Team are here to help, no pressure, no obligation.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
        
        {/* Left Column: Form */}
        <div className="lg:col-span-7 bg-[#FAF8F5] border border-[#C9A96A]/40 p-8 sm:p-10 rounded-xs shadow-xl space-y-6">
          
          <div>
            <span className="text-xs font-bold uppercase tracking-widest text-[#0F5C63]">
              Direct Inquiries
            </span>
            <h2 className="font-serif text-2xl font-bold text-[#0D2226] mt-1">
              Luxury Strategy Consultation Request
            </h2>
          </div>

          {submitted ? (
            <div className="p-8 bg-[#0F5C63] text-[#FAF8F5] rounded-xs text-center space-y-4 border border-[#C9A96A] animate-fadeIn">
              <CheckCircle2 className="w-16 h-16 text-[#C9A96A] mx-auto" />
              <h3 className="font-serif text-2xl font-bold">Inquiry Successfully Received</h3>
              <p className="text-xs text-[#FAF8F5]/90 max-w-md mx-auto leading-relaxed">
                Thank you, {form.name}. Kyle Friedman’s office has received your request and will contact you directly within 2 hours.
              </p>
              <button
                onClick={() => setSubmitted(false)}
                className="px-6 py-2 bg-[#C9A96A] text-[#0D2226] font-bold text-xs uppercase"
              >
                Submit Another Message
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-[#0F5C63] mb-1">
                  What Can We Help With? *
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {(['Selling', 'Buying', 'Investing', 'Valuation'] as const).map((item) => (
                    <button
                      type="button"
                      key={item}
                      onClick={() => setForm({ ...form, interest: item })}
                      className={`p-2.5 text-xs font-semibold rounded-xs border transition-all ${
                        form.interest === item
                          ? 'bg-[#0F5C63] text-[#FAF8F5] border-[#C9A96A]'
                          : 'bg-[#FAF8F5] text-[#0D2226] border-[#0D2226]/20 hover:border-[#C9A96A]'
                      }`}
                    >
                      {item === 'Selling' && 'Selling a Home'}
                      {item === 'Buying' && 'Buying a Maryland Property'}
                      {item === 'Investing' && 'Investment Property'}
                      {item === 'Valuation' && 'Home Valuation Request'}
                    </button>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-[#0F5C63] mb-1">
                    Full Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    placeholder="e.g. Kyle Friedman"
                    className="w-full bg-[#FAF8F5] border border-[#0D2226]/20 p-3 text-xs text-[#0D2226] focus:border-[#C9A96A] focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-[#0F5C63] mb-1">
                    Phone Number *
                  </label>
                  <input
                    type="tel"
                    required
                    value={form.phone}
                    onChange={(e) => setForm({ ...form, phone: e.target.value })}
                    placeholder="(443) 789-3101"
                    className="w-full bg-[#FAF8F5] border border-[#0D2226]/20 p-3 text-xs text-[#0D2226] focus:border-[#C9A96A] focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-[#0F5C63] mb-1">
                  Email Address *
                </label>
                <input
                  type="email"
                  required
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  placeholder="name@domain.com"
                  className="w-full bg-[#FAF8F5] border border-[#0D2226]/20 p-3 text-xs text-[#0D2226] focus:border-[#C9A96A] focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-[#0F5C63] mb-1">
                    Primary County
                  </label>
                  <select
                    value={form.targetCounty}
                    onChange={(e) => setForm({ ...form, targetCounty: e.target.value })}
                    className="w-full bg-[#FAF8F5] border border-[#0D2226]/20 p-3 text-xs text-[#0D2226] focus:border-[#C9A96A] focus:outline-none"
                  >
                    <option value="Carroll County">Carroll County</option>
                    <option value="Baltimore County">Baltimore County</option>
                    <option value="Howard County">Howard County</option>
                    <option value="Other Market">Other Maryland Market</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-[#0F5C63] mb-1">
                    Timeline
                  </label>
                  <select
                    value={form.timeline}
                    onChange={(e) => setForm({ ...form, timeline: e.target.value })}
                    className="w-full bg-[#FAF8F5] border border-[#0D2226]/20 p-3 text-xs text-[#0D2226] focus:border-[#C9A96A] focus:outline-none"
                  >
                    <option value="Immediate">Immediate / Under 30 Days</option>
                    <option value="1-3 Months">1 to 3 Months</option>
                    <option value="3-6 Months">3 to 6 Months</option>
                    <option value="Planning">Planning Phase</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-[#0F5C63] mb-1">
                  Message / Property Details
                </label>
                <textarea
                  rows={4}
                  value={form.message}
                  onChange={(e) => setForm({ ...form, message: e.target.value })}
                  placeholder="Tell us a bit about your property or what you're looking for..."
                  className="w-full bg-[#FAF8F5] border border-[#0D2226]/20 p-3 text-xs text-[#0D2226] focus:border-[#C9A96A] focus:outline-none"
                />
              </div>

              {submitError && (
                <div className="bg-red-900/10 border border-red-500/40 p-3 text-left rounded-xs flex items-start gap-2">
                  <AlertCircle className="w-4 h-4 text-red-500 shrink-0 mt-0.5" />
                  <p className="text-xs text-red-700">
                    {submitError} You can also reach Kyle Friedman directly at kyle@friedmanreteam.com or (443) 789-3101.
                  </p>
                </div>
              )}

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-4 bg-[#C9A96A] hover:bg-[#D4AF37] text-[#0D2226] font-bold text-xs uppercase tracking-widest rounded-xs shadow-lg transition-all flex items-center justify-center gap-2 disabled:opacity-60"
              >
                {isSubmitting ? (
                  <span>Transmitting confidential inquiry...</span>
                ) : (
                  <>
                    <Calendar className="w-4 h-4" />
                    <span>Send Message</span>
                  </>
                )}
              </button>

            </form>
          )}

        </div>

        {/* Right Column: Contact Details & Office Coverage */}
        <div className="lg:col-span-5 space-y-8">
          
          <div className="bg-[#0D2226] text-[#FAF8F5] p-8 rounded-xs border border-[#C9A96A]/40 space-y-6 shadow-xl">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-[#0F5C63] border border-[#C9A96A] flex items-center justify-center font-serif font-bold text-xl text-[#C9A96A]">
                F
              </div>
              <div>
                <h3 className="font-serif text-xl font-bold text-[#FAF8F5]">
                  The Friedman Team
                </h3>
                <p className="text-xs text-[#C9A96A] uppercase font-medium tracking-widest">
                  eXp Realty Maryland
                </p>
              </div>
            </div>

            <p className="text-xs text-[#A8B2A1] leading-relaxed">
              "The trusted advisor for strategic home sales, luxury properties, farms, estates, and distinctive Maryland homes."
            </p>

            <div className="space-y-4 pt-2 text-xs text-[#FAF8F5]">
              <div className="flex items-start gap-3">
                <Phone className="w-4 h-4 text-[#C9A96A] shrink-0 mt-0.5" />
                <div>
                  <span className="text-[#A8B2A1] block text-[10px] font-bold uppercase">Direct Advisory Line</span>
                  <span className="font-semibold text-sm">(443) 789-3101</span>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Mail className="w-4 h-4 text-[#C9A96A] shrink-0 mt-0.5" />
                <div>
                  <span className="text-[#A8B2A1] block text-[10px] font-bold uppercase">Confidential Email</span>
                  <span className="font-semibold text-xs">kyle@friedmanreteam.com</span>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <MapPin className="w-4 h-4 text-[#C9A96A] shrink-0 mt-0.5" />
                <div>
                  <span className="text-[#A8B2A1] block text-[10px] font-bold uppercase">Office</span>
                  <span className="font-semibold text-xs">8115 Maple Lawn Blvd #350, Fulton, MD 20759</span>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Building2 className="w-4 h-4 text-[#C9A96A] shrink-0 mt-0.5" />
                <div>
                  <span className="text-[#A8B2A1] block text-[10px] font-bold uppercase">Primary Service Markets</span>
                  <span className="font-semibold text-xs">Carroll County • Baltimore County • Howard County • Frederick County</span>
                </div>
              </div>
            </div>
          </div>

          {/* Home Valuation Quick Card */}
          <div className="bg-[#0F5C63] text-[#FAF8F5] p-6 rounded-xs border border-[#C9A96A]/30 space-y-3">
            <h4 className="font-serif font-bold text-xl text-[#FAF8F5]">
              Instant Home Valuation Tool
            </h4>
            <p className="text-xs text-[#FAF8F5]/90">
              Get a preliminary estimate of your Maryland home's value in under 60 seconds.
            </p>
            <button
              onClick={onOpenValuation}
              className="w-full py-2.5 bg-[#C9A96A] text-[#0D2226] font-bold text-xs uppercase tracking-wider rounded-xs"
            >
              Launch Valuation Tool
            </button>
          </div>

        </div>

      </div>

    </div>
  );
};
