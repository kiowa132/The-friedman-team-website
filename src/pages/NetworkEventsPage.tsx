import React from 'react';
import { Calendar } from 'lucide-react';
import { usePageMeta } from '../lib/usePageMeta';

export const NetworkEventsPage: React.FC = () => {
  usePageMeta(
    'Events | Maryland Professional Network',
    'Small, curated events and roundtables for members of The Maryland Professional Network - coming soon.'
  );

  return (
    <div className="bg-[#FAF8F5] pt-32 pb-32 text-center">
      <div className="max-w-lg mx-auto px-4 sm:px-6">
        <Calendar className="w-10 h-10 text-[#C9A96A] mx-auto mb-5" />
        <h1 className="font-serif text-3xl font-bold text-[#0D2226]">Events - Coming Soon</h1>
        <p className="text-sm text-[#1C2B2E]/70 leading-relaxed mt-4">
          The network will host small, curated events and roundtables - groups of complementary professionals rather than large generic networking events. Think a Realtor, a CFP, a CPA, a lender, and an attorney around the same table, not a room of 200 strangers.
        </p>
      </div>
    </div>
  );
};
