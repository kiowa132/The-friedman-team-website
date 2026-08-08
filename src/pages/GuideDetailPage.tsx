import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { getHandbookGuide } from '../data/guides';
import { HandbookLandingPage } from '../components/HandbookLandingPage';

export const GuideDetailPage: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const guide = slug ? getHandbookGuide(slug) : undefined;

  if (!guide) {
    return (
      <div className="pt-32 pb-20 text-center max-w-2xl mx-auto px-4">
        <h1 className="font-serif text-3xl font-bold text-[#0D2226] mb-3">Guide Not Found</h1>
        <Link to="/guides" className="inline-block px-6 py-3 bg-[#0D2226] text-[#FAF8F5] font-bold text-xs uppercase tracking-widest rounded-xs">
          View All Guides
        </Link>
      </div>
    );
  }

  return <HandbookLandingPage guide={guide} />;
};
