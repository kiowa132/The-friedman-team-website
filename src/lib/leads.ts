// Shared helper for sending form submissions to the backend, which forwards
// them to Follow Up Boss. See server.js for the actual FUB integration.

import { trackEvent } from './analytics';

export type LeadType =
  | 'Seller Inquiry'
  | 'General Inquiry'
  | 'Property Inquiry'
  | 'Registration'
  | 'Network Inquiry'
  | 'Mailing List';

export interface LeadAddress {
  street?: string;
  city?: string;
  state?: string;
  zip?: string;
}

export interface LeadSubmission {
  name: string;
  email: string;
  phone?: string;
  type: LeadType;
  message?: string;
  /** Physical mailing address - used for the mailing-list signup so the
   *  schedule magnets and monthly cards can actually be sent. Forwarded to
   *  Follow Up Boss as a structured person address. */
  address?: LeadAddress;
  /** FUB tags, e.g. ['Mailing List', 'Baltimore Football Schedule']. */
  tags?: string[];
  /** Optional stable name for this form (e.g. 'home-value-modal'); defaults to "<first path segment>.<type>". */
  formId?: string;
}

export interface LeadSubmissionResult {
  ok: boolean;
  error?: string;
}

export interface LeadAttribution {
  form_id?: string;
  page?: string;
  code?: string;
  utm_source?: string;
  utm_medium?: string;
  utm_campaign?: string;
  referrer?: string;
}

const ATTR_KEY = 'ft_attr';

/** Remember a campaign code (?c= or ?ref=), utm fields and the referrer host from the landing URL so they
 *  survive clicks to other pages. Call once on app start. Never throws. */
export function captureAttribution(): void {
  try {
    if (typeof window === 'undefined') return;
    const q = new URLSearchParams(window.location.search);
    const found: LeadAttribution = {};
    const code = q.get('c') || q.get('ref');
    if (code) found.code = code;
    for (const k of ['utm_source', 'utm_medium', 'utm_campaign'] as const) {
      const v = q.get(k);
      if (v) found[k] = v;
    }
    if (document.referrer) {
      try {
        const host = new URL(document.referrer).hostname;
        if (host && host !== window.location.hostname) found.referrer = host;
      } catch { /* ignore */ }
    }
    if (Object.keys(found).length) {
      // first touch wins within a session for the code and utm fields, a new code replaces an old one
      const prev = JSON.parse(sessionStorage.getItem(ATTR_KEY) || '{}');
      sessionStorage.setItem(ATTR_KEY, JSON.stringify({ ...prev, ...found }));
    }
  } catch { /* storage blocked or private mode: attribution is best effort */ }
}

function formIdFromPage(type: string): string {
  const seg = (window.location.pathname.split('/').filter(Boolean)[0] || 'home').toLowerCase();
  return `${seg}.${type.toLowerCase().replace(/[^a-z0-9]+/g, '-')}`;
}

function buildAttribution(lead: LeadSubmission): LeadAttribution | undefined {
  try {
    if (typeof window === 'undefined') return undefined;
    let stored: LeadAttribution = {};
    try { stored = JSON.parse(sessionStorage.getItem(ATTR_KEY) || '{}'); } catch { /* ignore */ }
    return {
      ...stored,
      form_id: lead.formId || formIdFromPage(lead.type),
      page: window.location.pathname,
    };
  } catch {
    return undefined;
  }
}

export async function submitLead(lead: LeadSubmission): Promise<LeadSubmissionResult> {
  try {
    const { formId: _formId, ...rest } = lead;
    const res = await fetch('/api/leads', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...rest, attribution: buildAttribution(lead) }),
    });

    const data = await res.json().catch(() => ({}));

    if (!res.ok) {
      return { ok: false, error: data?.error || 'Something went wrong submitting your request.' };
    }

    // GA4 conversion event, tagged with which page the lead came from -
    // this is what shows up in Analytics as "how did this lead find me,"
    // instead of every lead just saying "TheFriedmanTeam.com."
    trackEvent('generate_lead', {
      lead_type: lead.type,
      page_path: typeof window !== 'undefined' ? window.location.pathname : undefined,
    });

    return { ok: true };
  } catch (err) {
    return { ok: false, error: 'Could not reach the server. Please check your connection and try again.' };
  }
}
