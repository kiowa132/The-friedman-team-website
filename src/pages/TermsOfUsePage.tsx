import React from 'react';
import { usePageMeta } from '../lib/usePageMeta';

// LEGAL REVIEW NOTE (remove this comment once reviewed): drafted to
// reflect what this site actually does (Bright MLS-sourced listing data
// via Lofty, valuation/CMA estimates, downloadable guides). Not reviewed
// by an attorney or eXp Realty's compliance team - have it reviewed before
// treating it as final, especially the MLS disclaimer language, which
// brokerages sometimes have specific required wording for.

export const TermsOfUsePage: React.FC = () => {
  usePageMeta(
    'Terms of Use | The Friedman Team',
    'The terms governing your use of The Friedman Team website.'
  );

  return (
    <div className="pt-28 pb-20 bg-[#FAF8F5]">
      <div className="max-w-3xl mx-auto px-4 sm:px-6">
        <div className="mb-10">
          <span className="text-[11px] uppercase tracking-[0.25em] text-[#C9A96A] font-bold">Legal</span>
          <h1 className="font-serif text-4xl sm:text-5xl font-bold text-[#0D2226] mt-2">Terms of Use</h1>
          <p className="text-sm text-[#1C2B2E]/60 mt-3">Last updated: August 2026</p>
        </div>

        <div className="prose prose-sm max-w-none space-y-6 [&_p]:text-sm [&_p]:sm:text-base [&_p]:text-[#1C2B2E]/85 [&_p]:leading-relaxed [&_p]:font-light [&_h2]:font-serif [&_h2]:text-xl [&_h2]:font-bold [&_h2]:text-[#0D2226] [&_h2]:pt-4 [&_li]:text-sm [&_li]:sm:text-base [&_li]:text-[#1C2B2E]/85 [&_li]:leading-relaxed [&_li]:font-light">

          <p>
            These Terms of Use govern your access to and use of friedmanreteam.com (the "Site"), operated by Kyle Friedman
            and The Friedman Team at eXp Realty ("we," "us," or "our"). By using the Site, you agree to these terms. If you
            don't agree, please don't use the Site.
          </p>

          <h2>Use of the Site</h2>
          <p>
            You may view and use the Site for your own personal, non-commercial purpose of researching real estate and
            contacting us. You may not copy, scrape, republish, or use any part of the Site's content for commercial purposes
            without our written permission.
          </p>

          <h2>Real Estate Listing Information</h2>
          <p>
            Property listing data displayed on the Site is sourced from Bright MLS and is deemed reliable but is not
            guaranteed accurate. Listing details, including price, availability, and condition, are subject to change,
            error, or omission, and should be independently verified before you rely on them for any decision. A listing's
            presence on the Site does not guarantee its continued availability.
          </p>
          <p>The Friedman Team and eXp Realty are committed to Equal Housing Opportunity.</p>

          <h2>Not Professional Advice</h2>
          <p>
            Home valuation estimates, comparative market analyses, calculators, and similar tools on the Site are estimates
            for general informational purposes only. They are not appraisals, and they are not a substitute for a licensed
            appraiser, attorney, accountant, lender, inspector, or other professional. You should not rely on them as the
            sole basis for a financial or legal decision.
          </p>

          <h2>Downloadable Guides</h2>
          <p>
            Guides and other downloadable content are provided for general informational purposes and reflect Maryland real
            estate practices as we understand them at the time of writing. They are not legal or financial advice, and
            requirements can change; verify current details for your specific situation before relying on them.
          </p>

          <h2>Intellectual Property</h2>
          <p>
            The Site's content, including text, photography, graphics, logos, and design, is owned by us or licensed to us,
            and is protected by copyright and other intellectual property laws. You may not use it without our permission,
            except as necessary to view the Site in a standard web browser.
          </p>

          <h2>Third-Party Links &amp; Services</h2>
          <p>
            The Site links to and integrates with third-party services we don't control, including Bright MLS data feeds,
            Substack, and social media platforms. We aren't responsible for the content, accuracy, or practices of those
            third parties.
          </p>

          <h2>No Warranty</h2>
          <p>
            The Site is provided "as is," without warranties of any kind, express or implied. We don't guarantee the Site
            will be uninterrupted, error-free, or completely secure.
          </p>

          <h2>Limitation of Liability</h2>
          <p>
            To the fullest extent permitted by law, The Friedman Team and eXp Realty aren't liable for any indirect,
            incidental, or consequential damages arising from your use of the Site or reliance on its content.
          </p>

          <h2>Governing Law</h2>
          <p>These terms are governed by the laws of the State of Maryland, without regard to conflict-of-law principles.</p>

          <h2>Changes to These Terms</h2>
          <p>We may update these Terms of Use from time to time. The "Last updated" date at the top reflects the most recent revision. Continued use of the Site after a change means you accept the updated terms.</p>

          <h2>Contact Us</h2>
          <p>
            Questions about these terms? Contact Kyle Friedman at{' '}
            <a href="mailto:kyle@friedmanreteam.com" className="text-[#0F5C63] hover:text-[#C9A96A] underline">kyle@friedmanreteam.com</a>{' '}
            or (443) 789-3101.
          </p>

        </div>
      </div>
    </div>
  );
};
