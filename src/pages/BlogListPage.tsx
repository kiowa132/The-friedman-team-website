import React from 'react';
import { Link } from 'react-router-dom';
import { Calendar, ArrowRight } from 'lucide-react';
import { BLOG_POSTS } from '../lib/content';

interface BlogListPageProps {
  setActiveTab: (tab: string) => void;
}

export const BlogListPage: React.FC<BlogListPageProps> = () => {
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
          Weekly, straight-talk market data for Carroll County, Baltimore County, and Howard County - no fluff, no generic national trends that don't apply here.
        </p>
      </div>

      {BLOG_POSTS.length === 0 ? (
        <div className="text-center py-20 text-sm text-[#1C2B2E]/60">
          New posts coming soon.
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {BLOG_POSTS.map((post) => (
            <Link
              key={post.slug}
              to={`/blog/${post.slug}`}
              className="group block bg-white border border-[#C9A96A]/30 rounded-xs overflow-hidden shadow-sm hover:shadow-lg transition-shadow"
            >
              <div className="aspect-[16/10] overflow-hidden">
                <img
                  src={post.heroImage}
                  alt={post.title}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
              </div>
              <div className="p-5 space-y-2">
                <span className="text-[10px] font-bold uppercase tracking-widest text-[#C9A96A]">
                  {post.category}
                </span>
                <h2 className="font-serif text-lg font-bold text-[#0D2226] leading-snug">
                  {post.title}
                </h2>
                <p className="text-xs text-[#1C2B2E]/70 line-clamp-2">
                  {post.metaDescription}
                </p>
                <div className="flex items-center justify-between pt-2">
                  <span className="text-[10px] text-[#1C2B2E]/50 flex items-center gap-1">
                    <Calendar className="w-3 h-3" />
                    {new Date(post.publishDate).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
                  </span>
                  <span className="text-xs font-bold text-[#0F5C63] flex items-center gap-1 group-hover:text-[#C9A96A] transition-colors">
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
