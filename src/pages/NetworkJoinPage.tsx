import React, { useState } from 'react';
import { ArrowRight, Loader2, CheckCircle2 } from 'lucide-react';
import { usePageMeta } from '../lib/usePageMeta';
import { submitLead } from '../lib/leads';
import { TcpaConsent } from '../components/TcpaConsent';

const MARYLAND_COUNTIES = ['Carroll County', 'Baltimore County', 'Howard County', 'Frederick County', 'Other Maryland County'];

export const NetworkJoinPage: React.FC = () => {
  usePageMeta(
    'Apply to Join | Maryland Professional Network',
    'Apply to join The Maryland Professional Network, a curated group of Maryland professionals building meaningful relationships and referring business.'
  );

  const [form, setForm] = useState({
    name: '', email: '', phone: '', company: '', title: '', industry: '',
    county: MARYLAND_COUNTIES[0], website: '', linkedin: '',
    clientsServed: '', lookingToMeet: '', canHelpWith: '', canIntroduce: '',
    referredBy: '', whyJoin: '',
  });
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const set = (field: string) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) =>
    setForm({ ...form, [field]: e.target.value });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setError(null);

    const details = [
      `Company: ${form.company || '(not provided)'}`,
      `Title: ${form.title || '(not provided)'}`,
      `Industry: ${form.industry || '(not provided)'}`,
      `County: ${form.county}`,
      `Website: ${form.website || '(not provided)'}`,
      `LinkedIn: ${form.linkedin || '(not provided)'}`,
      `Clients served: ${form.clientsServed || '(not provided)'}`,
      `Looking to meet: ${form.lookingToMeet || '(not provided)'}`,
      `Can help with: ${form.canHelpWith || '(not provided)'}`,
      `Can introduce: ${form.canIntroduce || '(not provided)'}`,
      `Referred by: ${form.referredBy || '(not provided)'}`,
      `Why join: ${form.whyJoin || '(not provided)'}`,
    ].join('\n');

    const { ok, error: err } = await submitLead({
      name: form.name,
      email: form.email,
      phone: form.phone || undefined,
      type: 'Network Inquiry',
      message: `Maryland Professional Network application (pending review).\n\n${details}`,
    });

    setSubmitting(false);

    if (!ok) {
      setError(err || 'Something went wrong. Please try again.');
      return;
    }

    setSuccess(true);
  };

  if (success) {
    return (
      <div className="pt-40 pb-24 max-w-lg mx-auto px-4 sm:px-6 text-center">
        <CheckCircle2 className="w-10 h-10 text-[#0F5C63] mx-auto mb-4" />
        <h1 className="font-serif text-2xl font-bold text-[#0D2226]">Application Received</h1>
        <p className="text-sm text-[#1C2B2E]/70 mt-3">
          Thank you, {form.name.split(' ')[0]}. Every application is reviewed personally by Kyle Friedman - we'll follow up if it's a good fit for the network.
        </p>
      </div>
    );
  }

  return (
    <div className="bg-[#FAF8F5] pt-32 pb-24">
      <div className="max-w-2xl mx-auto px-4 sm:px-6">

        <div className="text-center mb-10">
          <h1 className="font-serif text-4xl font-bold text-[#0D2226]">Apply to Join the Network</h1>
          <p className="text-sm text-[#1C2B2E]/70 mt-4 max-w-lg mx-auto">
            We're intentionally building this network around quality relationships rather than quantity. Tell us a little about yourself and the professionals you want to meet.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <input required value={form.name} onChange={set('name')} placeholder="Full Name *" className="w-full border border-[#0D2226]/20 bg-white p-3 text-sm focus:border-[#0F5C63] focus:outline-none" />
            <input required type="email" value={form.email} onChange={set('email')} placeholder="Email *" className="w-full border border-[#0D2226]/20 bg-white p-3 text-sm focus:border-[#0F5C63] focus:outline-none" />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <input type="tel" value={form.phone} onChange={set('phone')} placeholder="Phone (optional)" className="w-full border border-[#0D2226]/20 bg-white p-3 text-sm focus:border-[#0F5C63] focus:outline-none" />
            <select value={form.county} onChange={set('county')} className="w-full border border-[#0D2226]/20 bg-white p-3 text-sm focus:border-[#0F5C63] focus:outline-none">
              {MARYLAND_COUNTIES.map((c) => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <input value={form.company} onChange={set('company')} placeholder="Company" className="w-full border border-[#0D2226]/20 bg-white p-3 text-sm focus:border-[#0F5C63] focus:outline-none" />
            <input value={form.title} onChange={set('title')} placeholder="Professional Title" className="w-full border border-[#0D2226]/20 bg-white p-3 text-sm focus:border-[#0F5C63] focus:outline-none" />
          </div>
          <input value={form.industry} onChange={set('industry')} placeholder="Industry" className="w-full border border-[#0D2226]/20 bg-white p-3 text-sm focus:border-[#0F5C63] focus:outline-none" />
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <input value={form.website} onChange={set('website')} placeholder="Website (optional)" className="w-full border border-[#0D2226]/20 bg-white p-3 text-sm focus:border-[#0F5C63] focus:outline-none" />
            <input value={form.linkedin} onChange={set('linkedin')} placeholder="LinkedIn (optional)" className="w-full border border-[#0D2226]/20 bg-white p-3 text-sm focus:border-[#0F5C63] focus:outline-none" />
          </div>
          <textarea rows={2} value={form.clientsServed} onChange={set('clientsServed')} placeholder="What type of clients do you serve?" className="w-full border border-[#0D2226]/20 bg-white p-3 text-sm focus:border-[#0F5C63] focus:outline-none resize-none" />
          <textarea rows={2} value={form.lookingToMeet} onChange={set('lookingToMeet')} placeholder="What professionals are you looking to meet?" className="w-full border border-[#0D2226]/20 bg-white p-3 text-sm focus:border-[#0F5C63] focus:outline-none resize-none" />
          <textarea rows={2} value={form.canHelpWith} onChange={set('canHelpWith')} placeholder="What can you help other members with?" className="w-full border border-[#0D2226]/20 bg-white p-3 text-sm focus:border-[#0F5C63] focus:outline-none resize-none" />
          <textarea rows={2} value={form.canIntroduce} onChange={set('canIntroduce')} placeholder="What professionals can you introduce?" className="w-full border border-[#0D2226]/20 bg-white p-3 text-sm focus:border-[#0F5C63] focus:outline-none resize-none" />
          <input value={form.referredBy} onChange={set('referredBy')} placeholder="Who referred you? (optional)" className="w-full border border-[#0D2226]/20 bg-white p-3 text-sm focus:border-[#0F5C63] focus:outline-none" />
          <textarea rows={3} required value={form.whyJoin} onChange={set('whyJoin')} placeholder="Why do you want to join? *" className="w-full border border-[#0D2226]/20 bg-white p-3 text-sm focus:border-[#0F5C63] focus:outline-none resize-none" />

          {error && <p className="text-xs text-red-600">{error}</p>}

          {form.phone && <TcpaConsent />}

          <button
            type="submit" disabled={submitting}
            className="w-full py-3.5 bg-[#0D2226] hover:bg-[#0F5C63] text-[#FAF8F5] font-bold text-xs uppercase tracking-widest transition-colors flex items-center justify-center gap-2 disabled:opacity-60"
          >
            {submitting ? <Loader2 className="w-4 h-4 animate-spin" /> : <ArrowRight className="w-4 h-4" />}
            {submitting ? 'Submitting...' : 'Submit Application'}
          </button>
          <p className="text-[11px] text-[#1C2B2E]/40 text-center">
            Applications are reviewed personally - submitting doesn't guarantee membership.
          </p>
        </form>

      </div>
    </div>
  );
};
