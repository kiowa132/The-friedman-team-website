import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { BLOG_POSTS } from '../lib/content';
import { formatDisplayDate } from '../lib/formatDate';

interface BlogListPageProps {
  setActiveTab: (tab: string) => void;
}

// Matches the exact category values used in the CMS (public/admin/config.yml)
// and set on individual posts - keep these in sync if categories ever change.
const FILTERS = ['All', 'Market Reports', 'Sell Your Home', 'Buy a Home'] as const;
type Filter = (typeof FILTERS)[number];

export const BlogListPage: React.FC<BlogListPageProps> = () => {
  const [activeFilter, setActiveFilter] = useState<Filter>('All');

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
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-1 gap-y-10">
          {filteredPosts.map((post) => (
            <Link
              key={post.slug}
              to={`/blog/${post.slug}`}
              className="group block relative h-[420px] overflow-hidden"
            >
              <img
                src={post.heroImage}
                alt={post.title}
                loading="lazy"
                className="absolute inset-0 w-full h-full object-cover transition-all duration-500 group-hover:scale-105 group-hover:brightness-[0.5]"
              />
              {/* Caption overlay - always covers the bottom of the image,
                  small and white by default, grows taller with a dark
                  scrim and reveals the excerpt plus a Read Article button
                  on hover. Card height never changes, so there's never a
                  gap of bare image or blank space either way. */}
              <div className="absolute inset-x-0 bottom-0 bg-white group-hover:bg-transparent group-hover:bg-gradient-to-t group-hover:from-black/90 group-hover:via-black/60 group-hover:to-transparent px-5 py-5 group-hover:pt-24 transition-all duration-300">
                <span className="text-[10px] font-bold uppercase tracking-widest text-[#C9A96A]">
                  {formatDisplayDate(post.publishDate)} | {post.category}
                </span>
                <h2 className="font-serif text-lg font-bold text-[#0D2226] group-hover:text-white transition-colors leading-snug mt-1">
                  {post.title}
                </h2>
                <p className="hidden group-hover:block text-xs text-white/70 line-clamp-2 mt-2">
                  {post.metaDescription}
                </p>
                <div className="flex items-center justify-end pt-2 group-hover:hidden">
                  <span className="text-xs font-bold text-[#0F5C63] flex items-center gap-1">
                    Read <ArrowRight className="w-3 h-3" />
                  </span>
                </div>
                <span className="hidden group-hover:inline-block mt-4 px-5 py-2 bg-white text-[#0D2226] text-[11px] font-bold uppercase tracking-widest">
                  Read Article
                </span>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
};
