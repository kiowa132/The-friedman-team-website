import React from 'react';
import { usePageMeta } from '../lib/usePageMeta';

// LEGAL REVIEW NOTE (remove this comment once reviewed): this policy was
// drafted to accurately describe what this specific site actually does -
// the real forms, the real Follow Up Boss CRM integration, the real
// localStorage usage, no hidden ad trackers - rather than being generic
// boilerplate. It has not been reviewed by an attorney or by eXp Realty's
// compliance team. Have it reviewed before treating it as final, especially
// the TCPA/text-messaging consent language and the California resident
// rights section, since requirements there can change.

export const PrivacyPolicyPage: React.FC = () => {
  usePageMeta(
    'Privacy Policy | The Friedman Team',
    'How The Friedman Team collects, uses, and protects your information.'
  );

  return (
    <div className="pt-28 pb-20 bg-[#FAF8F5]">
      <div className="max-w-3xl mx-auto px-4 sm:px-6">
        <div className="mb-10">
          <span className="text-[11px] uppercase tracking-[0.25em] text-[#C9A96A] font-bold">Legal</span>
          <h1 className="font-serif text-4xl sm:text-5xl font-bold text-[#0D2226] mt-2">Privacy Policy</h1>
          <p className="text-sm text-[#1C2B2E]/60 mt-3">Last updated: August 2026</p>
        </div>

        <div className="prose prose-sm max-w-none space-y-6 [&_p]:text-sm [&_p]:sm:text-base [&_p]:text-[#1C2B2E]/85 [&_p]:leading-relaxed [&_p]:font-light [&_h2]:font-serif [&_h2]:text-xl [&_h2]:font-bold [&_h2]:text-[#0D2226] [&_h2]:pt-4 [&_li]:text-sm [&_li]:sm:text-base [&_li]:text-[#1C2B2E]/85 [&_li]:leading-relaxed [&_li]:font-light">

          <p>
            The Friedman Team, operating under eXp Realty ("The Friedman Team," "we," "us," or "our"), respects your privacy.
            This Privacy Policy explains what information we collect through friedmanreteam.com (the "Site"), how we use it,
            and the choices you have. By using the Site, you agree to the practices described here.
          </p>

          <h2>Information We Collect</h2>
          <p><strong>Information you give us directly.</strong> When you use a form on the Site, such as a home valuation request, a strategy consultation request, a showing request on a listing, a general contact inquiry, or a guide download, we collect what you enter: typically your name, email address, phone number, property address (where relevant), and any message or details you include.</p>
          <p><strong>Newsletter subscriptions.</strong> If you subscribe to The Friedman Report, that subscription is handled directly by Substack, not by us. Substack's own privacy policy governs how they handle your email address for that purpose.</p>
          <p><strong>Information collected automatically.</strong> Like most websites, our hosting and infrastructure providers automatically log standard technical information when you visit, such as your IP address, browser type, device type, and pages viewed. We use this only in aggregate, to understand site usage and for security purposes, not to identify individual visitors.</p>
          <p><strong>Local browser storage.</strong> The Site uses your browser's local storage (not cookies) to remember which listings you've saved as favorites and whether you've already unlocked a downloadable guide. This information stays in your browser and is not transmitted to us or to any third party.</p>

          <h2>How We Use Your Information</h2>
          <ul>
            <li>To respond to inquiries you submit, including valuation requests, showing requests, and consultation requests</li>
            <li>To provide the specific information you asked for, such as a comparative market analysis or a downloadable guide</li>
            <li>To follow up about buying or selling real estate, by phone, text, or email, consistent with the consent described below</li>
            <li>To maintain records of client and prospect communications in our customer relationship management (CRM) system</li>
            <li>To improve the Site and understand, in aggregate, how visitors use it</li>
          </ul>

          <h2>How We Share Your Information</h2>
          <p>
            We do not sell your personal information. Information submitted through our forms is sent to Follow Up Boss, the
            customer relationship management platform we use to track and follow up on inquiries. Follow Up Boss acts as our
            service provider and is contractually restricted from using your information for its own purposes.
          </p>
          <p>
            Property listing data displayed on the Site is sourced from Bright MLS through our IDX/API provider (Lofty). That
            data flow doesn't involve your personal information; it's how listings get onto the Site in the first place.
          </p>
          <p>
            We may also share information if required by law, to protect our legal rights, or in connection with a business
            transfer such as a sale or merger, in which case this policy would continue to apply to your information under the
            new ownership.
          </p>

          <h2>Text Messages &amp; Phone Calls</h2>
          <p>
            If you provide your phone number, you agree that The Friedman Team may contact you by phone or text message,
            including by automated means, about your real estate inquiry. Message and data rates may apply. Message frequency
            varies. You can opt out of text messages at any time by replying STOP, or opt out of calls by telling us directly.
            Consent to receive texts or calls is not a condition of using our services.
          </p>

          <h2>Your Choices</h2>
          <ul>
            <li>You can decline to submit a form; the Site's listings and neighborhood content are viewable without providing any personal information</li>
            <li>You can unsubscribe from The Friedman Report at any time using the unsubscribe link in any email, or by replying STOP</li>
            <li>You can ask us to access, correct, or delete personal information we hold about you by contacting us using the information below</li>
          </ul>
          <p>
            If you are a California resident, you may have additional rights under California law regarding your personal
            information, including the right to request disclosure of what we collect and the right to request deletion.
            Contact us using the information below to make a request.
          </p>

          <h2>Third-Party Links</h2>
          <p>
            The Site links to third-party services we don't control, including Bright MLS listing data, Substack, and our
            social media profiles. Those services have their own privacy practices, and this policy doesn't cover them.
          </p>

          <h2>Children's Privacy</h2>
          <p>The Site is not directed at children under 13, and we do not knowingly collect personal information from children under 13.</p>

          <h2>Data Security</h2>
          <p>
            We use reasonable measures to protect the information you provide, but no method of transmission or storage is
            completely secure, and we cannot guarantee absolute security.
          </p>

          <h2>Changes to This Policy</h2>
          <p>We may update this Privacy Policy from time to time. The "Last updated" date at the top reflects the most recent revision.</p>

          <h2>Contact Us</h2>
          <p>
            Questions about this policy or your information? Contact Kyle Friedman at{' '}
            <a href="mailto:kyle@friedmanreteam.com" className="text-[#0F5C63] hover:text-[#C9A96A] underline">kyle@friedmanreteam.com</a>{' '}
            or (443) 789-3101.
          </p>

        </div>
      </div>
    </div>
  );
};
