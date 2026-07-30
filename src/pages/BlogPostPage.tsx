import React, { useRef } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Calendar, ArrowRight, Calculator, Phone, FileText, ChevronLeft, ChevronRight } from 'lucide-react';
import { BLOG_POSTS, GUIDES } from '../lib/content';
import { NEIGHBORHOODS } from '../data/mockData';
import { SUBSTACK_SUBDOMAIN } from '../lib/siteConfig';

interface BlogPostPageProps {
  onOpenConsultation: () => void;
  onOpenValuation: () => void;
}

export const BlogPostPage: React.FC<BlogPostPageProps> = ({ onOpenConsultation, onOpenValuation }) => {
  const { slug } = useParams<{ slug: string }>();
  const post = BLOG_POSTS.find((p) => p.slug === slug);
  const carouselRef = useRef<HTMLDivElement>(null);

  if (!post) {
    return (
      <div className="pt-32 pb-20 text-center max-w-2xl mx-auto px-4">
        <h1 className="font-serif text-3xl font-bold text-[#0D2226] mb-3">Post Not Found</h1>
        <p className="text-sm text-[#1C2B2E]/70 mb-6">This article may have moved. Check the full list below.</p>
        <Link to="/blog" className="px-6 py-3 bg-[#0D2226] text-[#FAF8F5] font-bold text-xs uppercase tracking-widest rounded-xs">
          View All Reports
        </Link>
      </div>
    );
  }

  const relatedGuide = GUIDES.find((g) => g.slug === post.relatedGuideSlug);
  const relatedArea = NEIGHBORHOODS.find((n) => n.id === post.relatedAreaSlug);
  const hasSubstack = SUBSTACK_SUBDOMAIN && SUBSTACK_SUBDOMAIN !== 'YOUR-SUBSTACK-SUBDOMAIN';

  const scrollCarousel = (direction: 'left' | 'right') => {
    const el = carouselRef.current;
    if (!el) return;
    const cardWidth = el.querySelector('[data-carousel-slide]')?.clientWidth || 380;
    el.scrollBy({ left: direction === 'left' ? -(cardWidth + 16) : cardWidth + 16, behavior: 'smooth' });
  };

  // Article + VideoObject schema markup - this is what makes the post
  // eligible for rich results in Google, including video thumbnails
  // showing up directly in search results.
  const schema = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'Article',
        headline: post.title,
        description: post.metaDescription,
        datePublished: post.publishDate,
        image: post.heroImage,
        author: { '@type': 'Person', name: 'Kyle Friedman' },
        publisher: { '@type': 'Organization', name: 'The Friedman Team' },
      },
      ...(post.youtubeVideoId
        ? [{
            '@type': 'VideoObject',
            name: post.title,
            description: post.metaDescription,
            thumbnailUrl: post.heroImage,
            uploadDate: post.publishDate,
            embedUrl: `https://www.youtube.com/embed/${post.youtubeVideoId}`,
          }]
        : []),
    ],
  };

  return (
    <div className="pt-20 pb-20">
      <script type="application/ld+json">{JSON.stringify(schema)}</script>

      {/* Masthead - real branded image */}
      <div className="bg-[#0D2226] py-4 border-b-4 border-[#C9A96A]">
        <div className="max-w-2xl mx-auto px-4">
          <img
            src="/images/blog/friedman-report-masthead.png"
            alt="The Friedman Report"
            className="w-full h-auto max-w-md mx-auto"
          />
          <p className="text-[10px] uppercase tracking-[0.3em] text-[#C9A96A] text-center mt-2">
            Weekly Market Intelligence · eXp Realty
          </p>
        </div>
      </div>

      <div className="max-w-2xl mx-auto px-4 sm:px-6">

        {/* Meta strip */}
        <div className="flex items-center justify-between text-[11px] uppercase tracking-widest text-[#1C2B2E]/60 border-b border-[#C9A96A]/30 py-3">
          <span className="font-bold text-[#0F5C63]">{post.category}</span>
          <span className="flex items-center gap-1.5">
            <Calendar className="w-3 h-3" />
            {new Date(post.publishDate).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
          </span>
        </div>

        <div className="space-y-4 pt-8 pb-6">
          <h1 className="font-serif text-3xl sm:text-5xl font-bold text-[#0D2226] leading-tight">
            {post.title}
          </h1>
          <p className="text-base text-[#1C2B2E]/70 leading-relaxed font-light">
            {post.metaDescription}
          </p>
          <p className="text-xs font-bold uppercase tracking-widest text-[#C9A96A]">
            By Kyle Friedman
          </p>
        </div>

        {/* Hero image - height-capped so a huge upload never blows up the layout.
            Recommended upload size: 1600x900px, under 500KB. */}
        <figure className="space-y-2">
          <div className="max-h-[420px] aspect-[16/9] overflow-hidden">
            <img src={post.heroImage} alt={post.title} className="w-full h-full object-cover" />
          </div>
          <figcaption className="text-[11px] italic text-[#1C2B2E]/50 text-center uppercase tracking-wide">
            {post.category} · The Friedman Team
          </figcaption>
        </figure>

        <div className="prose prose-sm max-w-none space-y-5 pt-8 [&_p]:text-sm [&_p]:sm:text-base [&_p]:text-[#1C2B2E]/85 [&_p]:leading-relaxed [&_p]:font-light" dangerouslySetInnerHTML={{ __html: post.bodyHtml }} />

        {/* Real branded valuation banner, clickable */}
        <button
          onClick={onOpenValuation}
          className="w-full my-8 block hover:opacity-90 transition-opacity"
        >
          <img
            src="/images/blog/know-your-home-value-banner.webp"
            alt="Know your home's value - free valuation"
            className="w-full h-auto"
          />
        </button>

        {/* Image carousel - only renders if photos were actually added.
            Recommended upload size per photo: 1000x1250px, under 400KB. */}
        {post.carouselImages && post.carouselImages.length > 0 && (
          <div className="relative pb-8">
            {post.carouselImages.length > 1 && (
              <>
                <button
                  onClick={() => scrollCarousel('left')}
                  aria-label="Previous image"
                  className="hidden sm:flex absolute -left-4 top-1/2 -translate-y-1/2 z-10 w-9 h-9 rounded-full bg-[#0D2226] text-[#C9A96A] items-center justify-center shadow-lg hover:bg-[#0F5C63] transition-colors"
                >
                  <ChevronLeft className="w-5 h-5" />
                </button>
                <button
                  onClick={() => scrollCarousel('right')}
                  aria-label="Next image"
                  className="hidden sm:flex absolute -right-4 top-1/2 -translate-y-1/2 z-10 w-9 h-9 rounded-full bg-[#0D2226] text-[#C9A96A] items-center justify-center shadow-lg hover:bg-[#0F5C63] transition-colors"
                >
                  <ChevronRight className="w-5 h-5" />
                </button>
              </>
            )}
            <div
              ref={carouselRef}
              className="flex gap-4 overflow-x-auto snap-x snap-mandatory pb-2 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
            >
              {post.carouselImages.map((img, i) => (
                <img
                  key={i}
                  data-carousel-slide
                  src={img}
                  alt={`${post.title} - slide ${i + 1}`}
                  className="snap-start shrink-0 w-[70%] sm:w-[380px] aspect-[4/5] object-cover rounded-xs"
                />
              ))}
            </div>
          </div>
        )}

        {/* Embedded YouTube video - at the bottom, and completely absent
            (not even a placeholder) unless a real video was actually added. */}
        {post.youtubeVideoId && (
          <div className="aspect-video rounded-xs overflow-hidden border border-[#C9A96A]/30 mb-8">
            <iframe
              className="w-full h-full"
              src={`https://www.youtube.com/embed/${post.youtubeVideoId}`}
              title={post.title}
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          </div>
        )}

        <div className="text-center text-[11px] uppercase tracking-[0.3em] text-[#1C2B2E]/40 py-6">
          Or
        </div>

        {/* Two-card CTA row - same visual pattern as a subscription-tier
            block, but both options are free actions instead of paid tiers. */}
        <div className="text-center space-y-3 mb-6">
          <img
            src="/images/blog/subscribe-bell-badge.webp"
            alt="Subscribe to stay in the loop"
            className="h-8 w-auto mx-auto"
          />
          <h3 className="font-serif text-2xl font-bold text-[#0D2226]">
            Stay Ahead of the Market
          </h3>
          <p className="text-xs text-[#1C2B2E]/60">Two ways to get real, local insight - both completely free.</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-10">
          <div className="border border-[#C9A96A]/40 rounded-xs p-6 text-center space-y-3 bg-[#FAF8F5]">
            <div className="text-xs font-bold uppercase tracking-widest text-[#0F5C63]">Weekly Newsletter</div>
            <div className="font-serif text-lg font-bold text-[#0D2226]">The Friedman Report</div>
            <p className="text-[11px] text-[#1C2B2E]/60">Local market data, every week, straight to your inbox.</p>
            {hasSubstack ? (
              <a
                href={`https://${SUBSTACK_SUBDOMAIN}.substack.com`}
                target="_blank"
                rel="noopener noreferrer"
                className="block w-full py-3 bg-[#0D2226] text-[#FAF8F5] font-bold text-xs uppercase tracking-widest rounded-xs hover:bg-[#0F5C63] transition-colors"
              >
                Subscribe Free
              </a>
            ) : (
              <Link
                to="/blog"
                className="block w-full py-3 bg-[#0D2226] text-[#FAF8F5] font-bold text-xs uppercase tracking-widest rounded-xs hover:bg-[#0F5C63] transition-colors"
              >
                Subscribe Free
              </Link>
            )}
          </div>

          <div className="border border-[#C9A96A] rounded-xs p-6 text-center space-y-3 bg-[#0D2226] text-[#FAF8F5]">
            <div className="text-xs font-bold uppercase tracking-widest text-[#C9A96A]">Thinking of Selling?</div>
            <div className="font-serif text-lg font-bold">Free Market Evaluation</div>
            <p className="text-[11px] text-[#A8B2A1]">Kyle personally reviews your property - no automated guess.</p>
            <button
              onClick={onOpenValuation}
              className="w-full py-3 bg-[#C9A96A] text-[#0D2226] font-bold text-xs uppercase tracking-widest rounded-xs hover:bg-[#D4AF37] transition-colors flex items-center justify-center gap-2"
            >
              <Calculator className="w-4 h-4" />
              Get My Free Evaluation
            </button>
          </div>
        </div>

        {/* Guide CTA */}
        {relatedGuide && (
          <Link
            to={`/guides/${relatedGuide.slug}`}
            className="flex items-center gap-4 bg-[#FAF8F5] border border-[#C9A96A]/40 p-5 rounded-xs hover:border-[#C9A96A] transition-colors mb-8"
          >
            <FileText className="w-8 h-8 text-[#C9A96A] shrink-0" />
            <div className="flex-1">
              <div className="text-xs font-bold uppercase tracking-widest text-[#0F5C63]">Free Guide</div>
              <div className="font-serif font-bold text-[#0D2226]">{relatedGuide.title}</div>
            </div>
            <ArrowRight className="w-5 h-5 text-[#C9A96A]" />
          </Link>
        )}

        {/* Related area link */}
        {relatedArea && (
          <div className="text-center text-xs text-[#1C2B2E]/60 mb-8">
            More about <Link to="/neighborhoods" className="font-bold text-[#0F5C63] hover:text-[#C9A96A]">{relatedArea.name}</Link>
          </div>
        )}

        <div className="text-center pt-4 border-t border-[#C9A96A]/20">
          <button
            onClick={onOpenConsultation}
            className="px-8 py-3.5 bg-[#0D2226] text-[#FAF8F5] font-bold text-xs uppercase tracking-widest rounded-xs flex items-center gap-2 mx-auto"
          >
            <Phone className="w-4 h-4" />
            Schedule a Consultation
          </button>
        </div>
      </div>
    </div>
  );
};
