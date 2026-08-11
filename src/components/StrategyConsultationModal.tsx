import React, { useState } from 'react';
import { X, Phone, Calendar, ShieldCheck, CheckCircle2, AlertCircle, ArrowRight, Loader2 } from 'lucide-react';
import { LeadFormPayload } from '../types';
import { TcpaConsent } from './TcpaConsent';
import { submitLead } from '../lib/leads';

interface StrategyConsultationModalProps {
  isOpen: boolean;
  onClose: () => void;
  prefillInterest?: 'Selling' | 'Buying' | 'Investing' | 'Valuation' | 'General';
}

// Progressive profiling: stage 1 asks for the minimum (interest, name,
// email) and submits immediately - so someone who closes the modal right
// after still leaves a real lead behind, instead of nothing. Stage 2
// reveals in place (no second popup) asking for the rest (phone, county,
// timeline, notes), submitted as a follow-up under the same email so it
// enriches the same contact in Follow Up Boss rather than creating a
// duplicate. "Skip for now" is always available, on purpose - the whole
// point of asking less upfront is that more isn't required to count as
// a real lead.
export const StrategyConsultationModal: React.FC<StrategyConsultationModalProps> = ({
  isOpen,
  onClose,
  prefillInterest = 'Selling'
}) => {
  if (!isOpen) return null;

  const [form, setForm] = useState<LeadFormPayload>({
    name: '',
    email: '',
    phone: '',
    interest: prefillInterest,
    targetCounty: 'Carroll County',
    timeline: '1-3 Months',
    message: ''
  });

  const [stage, setStage] = useState<'initial' | 'enrich' | 'done'>('initial');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const leadType = form.interest === 'Selling' || form.interest === 'Valuation' ? 'Seller Inquiry' : 'General Inquiry';

  const handleInitialSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitError(null);

    const { ok, error } = await submitLead({
      name: form.name,
      email: form.email,
      type: leadType,
      message: `Interest: ${form.interest}`,
    });

    setIsSubmitting(false);

    if (!ok) {
      setSubmitError(error || 'Something went wrong sending your request. Please call or email Kyle Friedman directly.');
      return;
    }

    setStage('enrich');
  };

  const handleEnrichSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitError(null);

    const details = [
      `Interest: ${form.interest}`,
      `Target county: ${form.targetCounty}`,
      `Timeline: ${form.timeline}`,
      form.message ? `Notes: ${form.message}` : null,
    ].filter(Boolean).join('\n');

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

    finishUp();
  };

  const finishUp = () => {
    setStage('done');
    setTimeout(() => {
      setStage('initial');
      onClose();
    }, 4500);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-[#0D2226]/85 backdrop-blur-md flex items-center justify-center p-4 animate-fadeIn">
      <div className="bg-[#FAF8F5] border border-[#C9A96A] rounded-xs w-full max-w-xl shadow-2xl relative overflow-hidden text-[#1C2B2E]">

        {/* Modal Header */}
        <div className="bg-[#0D2226] text-[#FAF8F5] px-6 py-5 flex items-center justify-between border-b border-[#C9A96A]/30">
          <div className="flex items-center gap-2">
            <Phone className="w-5 h-5 text-[#C9A96A]" />
            <h3 className="font-serif text-xl font-bold tracking-wide text-[#FAF8F5]">
              Schedule a Strategy Call
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-[#FAF8F5]/80 hover:text-[#C9A96A] transition-colors"
            id="close-consult-modal"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 sm:p-8 space-y-6">

          {stage === 'done' && (
            <div className="py-8 text-center space-y-4 animate-fadeIn">
              <CheckCircle2 className="w-16 h-16 text-[#C9A96A] mx-auto" />
              <h4 className="font-serif text-2xl font-bold text-[#0D2226]">
                Strategy Session Confirmed
              </h4>
              <p className="text-xs text-[#1C2B2E] max-w-md mx-auto leading-relaxed">
                Thank you, {form.name}. Kyle Friedman has received your request and will contact you directly at {form.phone || form.email} to confirm your appointment time.
              </p>
              <div className="pt-2 text-xs text-[#0F5C63] font-bold">
                The Friedman Team • eXp Realty Maryland
              </div>
            </div>
          )}

          {stage === 'initial' && (
            <form onSubmit={handleInitialSubmit} className="space-y-4">

              <div className="text-center space-y-1">
                <p className="text-xs text-[#0F5C63] font-bold uppercase tracking-wider">
                  Free, No-Obligation Consultation
                </p>
                <h4 className="font-serif text-2xl font-bold text-[#0D2226]">
                  Let's Talk About Your Goals
                </h4>
              </div>

              {/* Interest Selector */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-[#0F5C63] mb-1">
                  I'm Interested In:
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
                      {item === 'Buying' && 'Buying a Home'}
                      {item === 'Investing' && 'Investment Property'}
                      {item === 'Valuation' && 'Home Valuation'}
                    </button>
                  ))}
                </div>
              </div>

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
                  className="w-full bg-[#FAF8F5] border border-[#0D2226]/20 p-2.5 text-xs text-[#0D2226] focus:border-[#C9A96A] focus:outline-none"
                />
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
                  className="w-full bg-[#FAF8F5] border border-[#0D2226]/20 p-2.5 text-xs text-[#0D2226] focus:border-[#C9A96A] focus:outline-none"
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
                className="w-full py-3.5 bg-[#C9A96A] hover:bg-[#D4AF37] text-[#0D2226] font-bold text-xs uppercase tracking-widest rounded-xs shadow-lg transition-all flex items-center justify-center gap-2 mt-2 disabled:opacity-60"
              >
                {isSubmitting ? <Loader2 className="w-4 h-4 animate-spin" /> : <ArrowRight className="w-4 h-4" />}
                <span>{isSubmitting ? 'Sending...' : 'Continue'}</span>
              </button>

              <div className="flex items-center justify-center gap-1 text-[11px] text-[#A8B2A1] pt-1">
                <ShieldCheck className="w-3.5 h-3.5 text-[#C9A96A]" />
                <span>Strict Client Confidentiality Guaranteed • eXp Realty</span>
              </div>

            </form>
          )}

          {stage === 'enrich' && (
            <form onSubmit={handleEnrichSubmit} className="space-y-4 animate-fadeIn">

              <div className="text-center space-y-1">
                <CheckCircle2 className="w-8 h-8 text-[#0F5C63] mx-auto mb-1" />
                <h4 className="font-serif text-2xl font-bold text-[#0D2226]">
                  Thanks, {form.name.split(' ')[0]}
                </h4>
                <p className="text-xs text-[#1C2B2E]/70 max-w-md mx-auto">
                  A few more details help Kyle Friedman prepare before you talk - totally optional.
                </p>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-[#0F5C63] mb-1">
                  Phone Number
                </label>
                <input
                  type="tel"
                  value={form.phone}
                  onChange={(e) => setForm({ ...form, phone: e.target.value })}
                  placeholder="(443) 789-3101"
                  className="w-full bg-[#FAF8F5] border border-[#0D2226]/20 p-2.5 text-xs text-[#0D2226] focus:border-[#C9A96A] focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-[#0F5C63] mb-1">
                    Primary County
                  </label>
                  <select
                    value={form.targetCounty}
                    onChange={(e) => setForm({ ...form, targetCounty: e.target.value })}
                    className="w-full bg-[#FAF8F5] border border-[#0D2226]/20 p-2.5 text-xs text-[#0D2226] focus:border-[#C9A96A] focus:outline-none"
                  >
                    <option value="Carroll County">Carroll County</option>
                    <option value="Baltimore County">Baltimore County</option>
                    <option value="Howard County">Howard County</option>
                    <option value="Other Market">Other Maryland Market</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-[#0F5C63] mb-1">
                    Expected Timeline
                  </label>
                  <select
                    value={form.timeline}
                    onChange={(e) => setForm({ ...form, timeline: e.target.value })}
                    className="w-full bg-[#FAF8F5] border border-[#0D2226]/20 p-2.5 text-xs text-[#0D2226] focus:border-[#C9A96A] focus:outline-none"
                  >
                    <option value="Immediate">Immediate / Under 30 Days</option>
                    <option value="1-3 Months">1 to 3 Months</option>
                    <option value="3-6 Months">3 to 6 Months</option>
                    <option value="Planning">Planning Phase / Curious</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-[#0F5C63] mb-1">
                  Additional Details / Property Address
                </label>
                <textarea
                  rows={3}
                  value={form.message}
                  onChange={(e) => setForm({ ...form, message: e.target.value })}
                  placeholder="Share a few details about your property or what you're looking for..."
                  className="w-full bg-[#FAF8F5] border border-[#0D2226]/20 p-2.5 text-xs text-[#0D2226] focus:border-[#C9A96A] focus:outline-none"
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

              {form.phone && <TcpaConsent />}

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-3.5 bg-[#C9A96A] hover:bg-[#D4AF37] text-[#0D2226] font-bold text-xs uppercase tracking-widest rounded-xs shadow-lg transition-all flex items-center justify-center gap-2 mt-2 disabled:opacity-60"
              >
                {isSubmitting ? (
                  <span>Sending...</span>
                ) : (
                  <>
                    <Calendar className="w-4 h-4" />
                    <span>Complete My Request</span>
                  </>
                )}
              </button>

              <button
                type="button"
                onClick={finishUp}
                className="w-full text-center text-[11px] text-[#1C2B2E]/50 hover:text-[#1C2B2E]/70 transition-colors"
              >
                Skip for now, that's all I wanted to share
              </button>

            </form>
          )}

        </div>

      </div>
    </div>
  );
};
