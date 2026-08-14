import React from 'react';
import { Link } from 'react-router-dom';
import { usePageMeta } from '../lib/usePageMeta';

export const NetworkAboutPage: React.FC = () => {
  usePageMeta(
    'About | Maryland Professional Network',
    'About The Maryland Professional Network, a curated group of trusted Maryland professionals founded by Kyle Friedman.'
  );

  return (
    <div className="bg-[#FAF8F5] pt-32 pb-24">
      <div className="max-w-2xl mx-auto px-4 sm:px-6">
        <h1 className="font-serif text-4xl font-bold text-[#0D2226] text-center">About the Network</h1>

        <div className="space-y-5 mt-10 text-sm text-[#1C2B2E]/80 leading-relaxed">
          <p>
            The Maryland Professional Network exists for one reason: the best referrals come from real relationships, not a directory of strangers. This is a curated group of Maryland professionals who take those relationships seriously - people who want to meet other trusted professionals, understand what they do, and make genuine introductions when it makes sense.
          </p>
          <p>
            It's intentionally small right now. Growth will come from adding professionals who are actually worth introducing to the rest of the network, not from opening the doors to everyone. The long-term vision is a real professional network across Maryland, and eventually the broader DMV - a place where members know not just who's in the network, but what each person does, who they're looking to meet, and who they can confidently introduce.
          </p>
          <p>Founded by Kyle Friedman.</p>
        </div>

        <div className="text-center mt-12">
          <Link
            to="/network/join"
            className="inline-flex items-center gap-2 px-8 py-3.5 bg-[#0D2226] hover:bg-[#0F5C63] text-[#FAF8F5] font-bold text-xs uppercase tracking-widest rounded-xs transition-colors"
          >
            Apply to Join
          </Link>
        </div>
      </div>
    </div>
  );
};
