import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { BLOG_POSTS } from '../lib/content';
import { formatDisplayDate } from '../lib/formatDate';
import { usePageMeta } from '../lib/usePageMeta';

interface BlogListPageProps {
  setActiveTab: (tab: string) => void;
}

// Matches the exact category values used in the CMS (public/admin/config.yml)
// and set on individual posts - keep these in sync if categories ever change.
const FILTERS = ['All', 'Market Reports', 'Sell Your Home', 'Buy a Home'] as const;
type Filter = (typeof FILTERS)[number];

export const BlogListPage: React.FC<BlogListPageProps> = () => {
  const [activeFilter, setActiveFilter] = useState<Filter>('All');

  usePageMeta(
    'The Friedman Report | Market Reports & Local Insights | The Friedman Team',
    'Weekly, straight-talk market data and real estate insights for Carroll, Baltimore, Howard, and Frederick County, Maryland.'
  );

  const filteredPosts = activeFilter === 'All'
    ? BLOG_POSTS
    : BLOG_POSTS.filter((post) => post.category === activeFilter);

  return (
    <div className="pt-28 pb-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
      <div className="text-center space-y-3">
        <span className="text-xs font-bold uppercase tracking-[0.25em] text-[#0F5C63] bg-[#0F5C63]/10 px-4 py-1.5 border border-[#0F5C63]/30 inline-block">
          The Friedman Report
        </span>
        <h1 className="font-serif text-4xl sm:text-6xl font-bold text-[#0D2226]">
          Market Reports & Local Insights
        </h1>
        <p className="text-sm text-[#1C2B2E]/80 max-w-2xl mx-auto">
          Weekly, straight-talk market data for Carroll, Baltimore, Howard, and Frederick County, no fluff, no generic national trends that don't apply here.
        </p>
      </div>

      {/* Filter tabs */}
      <div className="flex flex-wrap items-center justify-center gap-2">
        {FILTERS.map((filter) => (
          <button
            key={filter}
            onClick={() => setActiveFilter(filter)}
            className={`px-5 py-2 text-xs font-bold uppercase tracking-widest rounded-full border transition-colors ${
              activeFilter === filter
                ? 'bg-[#0D2226] text-[#FAF8F5] border-[#0D2226]'
                : 'bg-transparent text-[#0D2226]/70 border-[#C9A96A]/40 hover:border-[#0F5C63] hover:text-[#0F5C63]'
            }`}
          >
            {filter}
          </button>
        ))}
      </div>

      {filteredPosts.length === 0 ? (
        <div className="text-center py-20 text-sm text-[#1C2B2E]/60">
          No posts in this category yet. Check back soon.
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredPosts.map((post) => (
            <Link
              key={post.slug}
              to={`/blog/${post.slug}`}
              className="group flex flex-col overflow-hidden bg-white ring-1 ring-[#0D2226]/5"
            >
              {/* Full 16:9 hero - shown whole, never side-cropped, so any
                  headline text baked into the image stays readable. */}
              <div className="overflow-hidden">
                <img
                  src={post.heroImage}
                  alt={post.title}
                  loading="lazy"
                  className="w-full aspect-[16/9] object-cover transition-transform duration-500 group-hover:scale-105"
                />
              </div>
              <div className="flex flex-1 flex-col px-5 py-4">
                <span className="text-[10px] font-bold uppercase tracking-widest text-[#C9A96A]">
                  {formatDisplayDate(post.publishDate)} | {post.category}
                </span>
                <h2 className="font-serif text-lg font-bold text-[#0D2226] group-hover:text-[#0F5C63] transition-colors leading-snug mt-1 line-clamp-2">
                  {post.title}
                </h2>
                <p className="text-xs text-[#1C2B2E]/60 line-clamp-2 mt-2">
                  {post.metaDescription}
                </p>
                <div className="mt-auto flex items-center justify-end pt-3">
                  <span className="text-xs font-bold text-[#0F5C63] flex items-center gap-1">
                    Read <ArrowRight className="w-3 h-3" />
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
};
