import React, { useRef } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Calendar, ArrowRight, Calculator, Phone, FileText, ChevronLeft, ChevronRight } from 'lucide-react';
import { BLOG_POSTS, GUIDES } from '../lib/content';
import { NEIGHBORHOODS } from '../data/mockData';

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
    <div className="pt-28 pb-20 max-w-4xl mx-auto px-4 sm:px-6 space-y-10">
      <script type="application/ld+json">{JSON.stringify(schema)}</script>

      <div className="space-y-4 text-center">
        <span className="text-xs font-bold uppercase tracking-widest text-[#C9A96A]">{post.category}</span>
        <h1 className="font-serif text-3xl sm:text-5xl font-bold text-[#0D2226] leading-tight">{post.title}</h1>
        <div className="flex items-center justify-center gap-2 text-xs text-[#1C2B2E]/60">
          <Calendar className="w-3.5 h-3.5" />
          <span>{new Date(post.publishDate).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</span>
          <span>•</span>
          <span>Kyle Friedman</span>
        </div>
      </div>

      {/* Hero image - height-capped so a huge upload never blows up the layout.
          Recommended upload size: 1600x900px, under 500KB. */}
      <div className="max-h-[420px] aspect-[16/9] rounded-xs overflow-hidden">
        <img src={post.heroImage} alt={post.title} className="w-full h-full object-cover" />
      </div>

      <div className="prose prose-sm max-w-none space-y-5 [&_p]:text-sm [&_p]:sm:text-base [&_p]:text-[#1C2B2E]/85 [&_p]:leading-relaxed" dangerouslySetInnerHTML={{ __html: post.bodyHtml }} />

      {/* Soft CTA box - now sits right after the body, above the carousel */}
      <div className="bg-[#0D2226] text-[#FAF8F5] p-6 rounded-xs border border-[#C9A96A]/40 flex flex-col sm:flex-row items-center gap-4 justify-between">
        <p className="text-sm">Curious what this means for your own property?</p>
        <button
          onClick={onOpenValuation}
          className="shrink-0 px-6 py-3 bg-[#C9A96A] text-[#0D2226] font-bold text-xs uppercase tracking-widest rounded-xs flex items-center gap-2"
        >
          <Calculator className="w-4 h-4" />
          Get Your Home Value
        </button>
      </div>

      {/* Image carousel - only renders if photos were actually added.
          Recommended upload size per photo: 1000x1250px, under 400KB. */}
      {post.carouselImages && post.carouselImages.length > 0 && (
        <div className="relative">
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

      {/* Embedded YouTube video - now at the bottom, and completely absent
          (not even a placeholder) unless a real video was actually added. */}
      {post.youtubeVideoId && (
        <div className="aspect-video rounded-xs overflow-hidden border border-[#C9A96A]/30">
          <iframe
            className="w-full h-full"
            src={`https://www.youtube.com/embed/${post.youtubeVideoId}`}
            title={post.title}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          />
        </div>
      )}

      {/* Guide CTA */}
      {relatedGuide && (
        <Link
          to={`/guides/${relatedGuide.slug}`}
          className="flex items-center gap-4 bg-[#FAF8F5] border border-[#C9A96A]/40 p-5 rounded-xs hover:border-[#C9A96A] transition-colors"
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
        <div className="text-center text-xs text-[#1C2B2E]/60">
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
  );
};
