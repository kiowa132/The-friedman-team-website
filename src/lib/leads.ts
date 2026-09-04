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
}

export interface LeadSubmissionResult {
  ok: boolean;
  error?: string;
}

export async function submitLead(lead: LeadSubmission): Promise<LeadSubmissionResult> {
  try {
    const res = await fetch('/api/leads', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(lead),
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
