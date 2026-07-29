// Shared helper for sending form submissions to the backend, which forwards
// them to Follow Up Boss. See server.js for the actual FUB integration.

export type LeadType = 'Seller Inquiry' | 'General Inquiry' | 'Property Inquiry' | 'Registration';

export interface LeadSubmission {
  name: string;
  email: string;
  phone?: string;
  type: LeadType;
  message?: string;
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

    return { ok: true };
  } catch (err) {
    return { ok: false, error: 'Could not reach the server. Please check your connection and try again.' };
  }
}
