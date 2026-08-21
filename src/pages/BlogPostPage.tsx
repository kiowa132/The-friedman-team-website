import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { Calendar, ArrowRight, Calculator, Phone, FileText, Facebook, Linkedin, Twitter, Star, ShieldCheck, Home, Youtube } from 'lucide-react';
import { BLOG_POSTS } from '../lib/content';
import { getHandbookGuide } from '../data/guides';
import { NEIGHBORHOODS } from '../data/mockData';
import { SUBSTACK_SUBDOMAIN } from '../lib/siteConfig';
import { formatDisplayDate } from '../lib/formatDate';
import { BlogScrollGate } from '../components/BlogScrollGate';

interface BlogPostPageProps {
  onOpenConsultation: () => void;
  onOpenValuation: () => void;
}

export const BlogPostPage: React.FC<BlogPostPageProps> = ({ onOpenConsultation, onOpenValuation }) => {
  const { slug } = useParams<{ slug: string }>();
  const post = BLOG_POSTS.find((p) => p.slug === slug);

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

  const relatedGuide = post.relatedGuideSlug ? getHandbookGuide(post.relatedGuideSlug) : undefined;
  const relatedArea = NEIGHBORHOODS.find((n) => n.id === post.relatedAreaSlug);
  const hasSubstack = SUBSTACK_SUBDOMAIN && SUBSTACK_SUBDOMAIN !== 'YOUR-SUBSTACK-SUBDOMAIN';

  // Same category first, then most recent, filling in from the rest of
  // the archive if there aren't enough same-category posts - always shows
  // 3 real posts rather than sometimes showing 1 or 2.
  const sameCategory = BLOG_POSTS.filter((p) => p.slug !== post.slug && p.category === post.category);
  const others = BLOG_POSTS.filter((p) => p.slug !== post.slug && p.category !== post.category);
  const relatedPosts = [...sameCategory, ...others].slice(0, 3);

  const shareUrl = typeof window !== 'undefined' ? window.location.href : `https://www.friedmanreteam.com/blog/${post.slug}`;
  const shareLinks = {
    facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`,
    twitter: `https://twitter.com/intent/tweet?url=${encodeURIComponent(shareUrl)}&text=${encodeURIComponent(post.title)}`,
    linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(shareUrl)}`,
  };

  // Category label links back to its corresponding page on the site.
  const CATEGORY_LINKS: Record<string, string> = {
    'Market Reports': '/blog',
    'Sell Your Home': '/sell',
    'Buy a Home': '/buy',
  };
  const categoryLink = CATEGORY_LINKS[post.category] || '/blog';

  // Auto-distribute carousel images evenly through the article body, rather
  // than clumping them all in one scrolling row at the end - this is what
  // actually matches how the Substack version looks, without requiring
  // manually inserting images into the markdown text.
  const bodyBlocks = post.bodyHtml.split(/(?<=<\/(?:p|h2|h3|h4|ul|ol|blockquote)>)/).filter((b) => b.trim());
  const images = post.carouselImages || [];
  const interleavedContent: { type: 'html' | 'image'; value: string }[] = [];

  if (images.length > 0 && bodyBlocks.length > 0) {
    const spacing = Math.max(2, Math.ceil(bodyBlocks.length / (images.length + 1)));
    let imageIndex = 0;
    bodyBlocks.forEach((block, i) => {
      interleavedContent.push({ type: 'html', value: block });
      const isInsertionPoint = (i + 1) % spacing === 0 && imageIndex < images.length && i !== bodyBlocks.length - 1;
      if (isInsertionPoint) {
        interleavedContent.push({ type: 'image', value: images[imageIndex] });
        imageIndex++;
      }
    });
    // Any leftover images (e.g. more photos than natural gaps) go at the end.
    while (imageIndex < images.length) {
      interleavedContent.push({ type: 'image', value: images[imageIndex] });
      imageIndex++;
    }
  } else {
    bodyBlocks.forEach((block) => interleavedContent.push({ type: 'html', value: block }));
  }

  // BlogPosting + VideoObject schema markup - this is what makes the post
  // eligible for rich results in Google, including video thumbnails
  // showing up directly in search results. BlogPosting (not the more
  // generic Article) is the correct, more precise type for this content,
  // and publisher.logo is required by Google's own guidelines for rich
  // result eligibility - it was missing before.
  const canonicalUrl = `https://www.friedmanreteam.com/blog/${post.slug}`;
  const schema = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'BlogPosting',
        headline: post.title,
        description: post.metaDescription,
        datePublished: post.publishDate,
        dateModified: post.publishDate,
        url: canonicalUrl,
        mainEntityOfPage: { '@type': 'WebPage', '@id': canonicalUrl },
        image: post.heroImage.startsWith('http') ? post.heroImage : `https://www.friedmanreteam.com${post.heroImage}`,
        author: {
          '@type': 'Person',
          name: 'Kyle Friedman',
          url: 'https://www.friedmanreteam.com/about',
        },
        publisher: {
          '@type': 'Organization',
          name: 'The Friedman Team',
          logo: {
            '@type': 'ImageObject',
            url: 'https://www.friedmanreteam.com/favicon-192.png',
          },
        },
      },
      ...[post.youtubeVideoId, post.youtubeVideoId2]
        .filter((id): id is string => !!id)
        .map((id) => ({
          '@type': 'VideoObject',
          name: post.title,
          description: post.metaDescription,
          thumbnailUrl: post.heroImage.startsWith('http') ? post.heroImage : `https://www.friedmanreteam.com${post.heroImage}`,
          uploadDate: post.publishDate,
          embedUrl: `https://www.youtube.com/embed/${id}`,
          publisher: {
            '@type': 'Organization',
            name: 'The Friedman Team',
            logo: {
              '@type': 'ImageObject',
              url: 'https://www.friedmanreteam.com/favicon-192.png',
            },
          },
        })),
    ],
  };

  return (
    <div className="pt-20 pb-20">
      <script type="application/ld+json">{JSON.stringify(schema)}</script>


      {/* Masthead - real branded image */}
      <div className="bg-[#0D2226] py-4 border-b-4 border-[#C9A96A]">
        <div className="max-w-2xl mx-auto px-4">
          <img
            src="/images/friedman-report-masthead.png"
            alt="The Friedman Report"
            className="w-full h-auto max-w-md mx-auto"
          />
          <p className="text-[10px] uppercase tracking-[0.3em] text-[#C9A96A] text-center mt-2">
            Weekly Market Intelligence · eXp Realty
          </p>
        </div>
      </div>

      <div className="max-w-2xl mx-auto px-4 sm:px-6">

        {/* Meta strip - category now links back to its corresponding page */}
        <div className="flex items-center justify-between text-[11px] uppercase tracking-widest text-[#1C2B2E]/60 border-b border-[#C9A96A]/30 py-3">
          <Link to={categoryLink} className="font-bold text-[#0F5C63] hover:text-[#C9A96A] transition-colors">
            {post.category}
          </Link>
          <span className="flex items-center gap-1.5">
            <Calendar className="w-3 h-3" />
            {formatDisplayDate(post.publishDate)}
          </span>
        </div>

        {/* Subscribe utility row - same position as the reference's top link row */}
        <a
          href={hasSubstack ? `https://${SUBSTACK_SUBDOMAIN}.substack.com` : '/blog'}
          target={hasSubstack ? '_blank' : undefined}
          rel={hasSubstack ? 'noopener noreferrer' : undefined}
          className="flex items-center justify-center gap-2 py-3 border-b border-[#C9A96A]/30 hover:opacity-80 transition-opacity"
        >
          <img src="/images/subscribe-bell-badge.webp" alt="Subscribe to stay in the loop" className="h-10 w-auto mx-auto" />
        </a>

        <div className="space-y-4 pt-8 pb-6">
          <h1 className="font-serif text-3xl sm:text-5xl font-bold text-[#0D2226] leading-tight">
            {post.title}
          </h1>
          <p className="text-base text-[#1C2B2E]/70 leading-relaxed font-light">
            {post.metaDescription}
          </p>
          <div className="flex items-center gap-3">
            <img src="/images/kyle-portrait.jpg" alt="Kyle Friedman" className="w-9 h-9 rounded-full object-cover object-top" />
            <div>
              <p className="text-xs font-bold uppercase tracking-widest text-[#C9A96A]">Kyle Friedman</p>
              <p className="text-[10px] text-[#1C2B2E]/50">The Friedman Team</p>
            </div>
          </div>
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

        {/* Lead paragraph gets its own larger, lighter treatment - a
            common magazine convention that gives the reader an easy
            on-ramp before the body settles into normal size. */}
        <BlogScrollGate>
        <div className="prose prose-sm max-w-none pt-10
          [&>*+*]:mt-6
          [&_p]:text-[15px] [&_p]:sm:text-lg [&_p]:text-[#1C2B2E]/85 [&_p]:leading-[1.8] [&_p]:font-light
          [&>p:first-of-type]:text-lg [&>p:first-of-type]:sm:text-xl [&>p:first-of-type]:text-[#1C2B2E] [&>p:first-of-type]:leading-[1.7]
          [&_h2]:font-serif [&_h2]:text-2xl [&_h2]:sm:text-3xl [&_h2]:font-bold [&_h2]:text-[#0D2226] [&_h2]:mt-14 [&_h2]:pt-6 [&_h2]:border-t [&_h2]:border-[#C9A96A]/25
          [&_h3]:font-serif [&_h3]:text-xl [&_h3]:sm:text-2xl [&_h3]:font-bold [&_h3]:text-[#0D2226] [&_h3]:mt-10
          [&_a]:text-[#0F5C63] [&_a]:font-semibold [&_a]:underline [&_a]:decoration-[#C9A96A] [&_a]:decoration-2 [&_a]:underline-offset-2 [&_a]:transition-colors hover:[&_a]:text-[#C9A96A] hover:[&_a]:decoration-[#0F5C63]
          [&_strong]:font-bold [&_strong]:text-[#0D2226]
          [&_em]:italic
          [&_ul]:space-y-2.5 [&_ul]:my-6 [&_ul]:pl-0 [&_ul]:list-none
          [&_ul_li]:relative [&_ul_li]:pl-7 [&_ul_li]:text-[15px] [&_ul_li]:sm:text-base [&_ul_li]:text-[#1C2B2E]/85 [&_ul_li]:leading-relaxed
          [&_ul_li:before]:content-[''] [&_ul_li:before]:absolute [&_ul_li:before]:left-0 [&_ul_li:before]:top-[0.6em] [&_ul_li:before]:w-2.5 [&_ul_li:before]:h-2.5 [&_ul_li:before]:rounded-full [&_ul_li:before]:bg-[#C9A96A]
          [&_ol]:space-y-2.5 [&_ol]:my-6 [&_ol]:pl-6 [&_ol]:marker:text-[#C9A96A] [&_ol]:marker:font-bold
          [&_ol_li]:text-[15px] [&_ol_li]:sm:text-base [&_ol_li]:text-[#1C2B2E]/85 [&_ol_li]:leading-relaxed [&_ol_li]:pl-1
          [&_blockquote]:my-8 [&_blockquote]:border-l-[3px] [&_blockquote]:border-[#C9A96A] [&_blockquote]:pl-6 [&_blockquote]:py-1 [&_blockquote]:font-serif [&_blockquote]:text-xl [&_blockquote]:sm:text-2xl [&_blockquote]:italic [&_blockquote]:text-[#0D2226] [&_blockquote]:leading-snug
          [&_hr]:border-[#C9A96A]/30 [&_hr]:my-10
          [&_table]:w-full [&_table]:my-8 [&_table]:border-collapse [&_table]:text-sm [&_table]:block [&_table]:overflow-x-auto [&_table]:whitespace-nowrap
          [&_thead]:bg-[#0D2226]
          [&_th]:text-[#C9A96A] [&_th]:text-left [&_th]:font-bold [&_th]:uppercase [&_th]:tracking-wider [&_th]:text-[11px] [&_th]:px-4 [&_th]:py-3
          [&_td]:px-4 [&_td]:py-3 [&_td]:text-[#1C2B2E]/85 [&_td]:border-b [&_td]:border-[#C9A96A]/15
          [&_tbody_tr:nth-child(even)]:bg-[#EFEBE2]/50
          [&_tbody_tr:hover]:bg-[#C9A96A]/10
          [&_img]:rounded-xs
        ">
          {interleavedContent.map((block, i) =>
            block.type === 'html' ? (
              <div key={i} dangerouslySetInnerHTML={{ __html: block.value }} />
            ) : (
              <img
                key={i}
                src={block.value}
                alt={`${post.title} photo`}
                className="w-full rounded-xs my-2"
              />
            )
          )}
        </div>
        </BlogScrollGate>

        {/* Share buttons - right after the body, matching the reference
            pattern, since these only get used if someone finished
            reading and is still engaged. */}
        <div className="flex items-center justify-center gap-3 mt-10 pt-6 border-t border-[#C9A96A]/20">
          <span className="text-[11px] font-bold uppercase tracking-widest text-[#1C2B2E]/50 mr-1">Share</span>
          <a href={shareLinks.facebook} target="_blank" rel="noopener noreferrer" aria-label="Share on Facebook" className="w-9 h-9 rounded-full border border-[#C9A96A]/40 flex items-center justify-center text-[#0F5C63] hover:bg-[#0D2226] hover:text-[#C9A96A] hover:border-[#0D2226] transition-colors">
            <Facebook className="w-4 h-4" />
          </a>
          <a href={shareLinks.twitter} target="_blank" rel="noopener noreferrer" aria-label="Share on X" className="w-9 h-9 rounded-full border border-[#C9A96A]/40 flex items-center justify-center text-[#0F5C63] hover:bg-[#0D2226] hover:text-[#C9A96A] hover:border-[#0D2226] transition-colors">
            <Twitter className="w-4 h-4" />
          </a>
          <a href={shareLinks.linkedin} target="_blank" rel="noopener noreferrer" aria-label="Share on LinkedIn" className="w-9 h-9 rounded-full border border-[#C9A96A]/40 flex items-center justify-center text-[#0F5C63] hover:bg-[#0D2226] hover:text-[#C9A96A] hover:border-[#0D2226] transition-colors">
            <Linkedin className="w-4 h-4" />
          </a>
        </div>

        {/* Real branded valuation banner, clickable - opens the same valuation
            tool as the navbar's "Home Value" button */}
        <button
          onClick={onOpenValuation}
          className="w-full mt-8 mb-1 block hover:opacity-90 transition-opacity"
        >
          <img
            src="/images/know-your-home-value-banner.webp"
            alt="Know your home's value, free valuation"
            className="w-full h-auto"
          />
        </button>

        {/* Embedded YouTube video - at the bottom, and completely absent
            (not even a placeholder) unless a real video was actually added.
            Shorts are vertical (9:16) - full-width 16:9 would badly
            letterbox/distort them, so they get a narrower, centered,
            portrait-shaped player instead. Supports up to two videos per
            post - most posts have zero or one, but this post has two. */}
        {[
          { id: post.youtubeVideoId, isShort: post.youtubeIsShort },
          { id: post.youtubeVideoId2, isShort: post.youtubeIsShort2 },
        ].filter((v) => v.id).map((v, i) => (
          v.isShort ? (
            <div key={i} className="flex justify-center mb-8">
              <div className="w-full max-w-[280px] aspect-[9/16] rounded-xs overflow-hidden border border-[#C9A96A]/30">
                <iframe
                  className="w-full h-full"
                  src={`https://www.youtube.com/embed/${v.id}`}
                  title={post.title}
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              </div>
            </div>
          ) : (
            <div key={i} className="aspect-video rounded-xs overflow-hidden border border-[#C9A96A]/30 mb-8">
              <iframe
                className="w-full h-full"
                src={`https://www.youtube.com/embed/${v.id}`}
                title={post.title}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            </div>
          )
        ))}

        <div className="text-center text-[11px] uppercase tracking-[0.3em] text-[#1C2B2E]/40 py-1">
          Or
        </div>

        {/* Two-card CTA row - same visual pattern as a subscription-tier
            block, but both options are free actions instead of paid tiers. */}
        <div className="text-center space-y-3 mb-6">
          <img
            src="/images/subscribe-bell-badge.webp"
            alt="Subscribe to stay in the loop"
            className="h-8 w-auto mx-auto"
          />
          <h3 className="font-serif text-2xl font-bold text-[#0D2226]">
            Stay Ahead of the Market
          </h3>
          <p className="text-xs text-[#1C2B2E]/60">Two ways to get real, local insight, both completely free.</p>
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
            <p className="text-[11px] text-[#A8B2A1]">Kyle Friedman personally reviews your property. No automated guess.</p>
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

        {/* Meet the Author - a real credibility block, not just the small
            byline near the title. This is what search engines and AI
            answer engines increasingly check before trusting or citing a
            post (Google's E-E-A-T framework), and it's also just good
            practice for a reader deciding whether to trust the advice. */}
        <div className="bg-[#0D2226] text-[#FAF8F5] rounded-xs p-6 sm:p-8 mb-10">
          <span className="text-[10px] font-bold uppercase tracking-widest text-[#C9A96A]">Meet the Author</span>
          <div className="flex flex-col sm:flex-row items-center sm:items-start gap-5 mt-4">
            <img src="/images/kyle-portrait.jpg" alt="Kyle Friedman" className="w-20 h-20 rounded-full object-cover object-top border-2 border-[#C9A96A] shrink-0" />
            <div className="text-center sm:text-left">
              <h3 className="font-serif text-xl font-bold">Kyle Friedman</h3>
              <p className="text-xs text-[#A8B2A1] mb-3">Licensed REALTOR® & Expert Negotiator, The Friedman Team at eXp Realty</p>
              <p className="text-sm text-[#FAF8F5]/80 leading-relaxed max-w-lg">
                Kyle Friedman serves buyers and sellers across Carroll, Howard, Frederick, and Baltimore counties, with a strategy-first, data-driven approach to pricing and negotiation.
              </p>
              <div className="flex items-center justify-center sm:justify-start gap-4 mt-4">
                <a
                  href="https://share.google/fH72jPIgQXjEImIHG"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 text-xs font-bold text-[#C9A96A] hover:text-[#FAF8F5] transition-colors"
                >
                  <Star className="w-3.5 h-3.5" />
                  Google Reviews
                </a>
                <a
                  href="https://www.zillow.com/profile/Kyle%20Friedman%20Team"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 text-xs font-bold text-[#C9A96A] hover:text-[#FAF8F5] transition-colors"
                >
                  <Home className="w-3.5 h-3.5" />
                  Zillow
                </a>
                <a
                  href="https://www.youtube.com/@SimplyFriedman/shorts"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 text-xs font-bold text-[#C9A96A] hover:text-[#FAF8F5] transition-colors"
                >
                  <Youtube className="w-3.5 h-3.5" />
                  YouTube
                </a>
                <button onClick={onOpenConsultation} className="inline-flex items-center gap-1.5 text-xs font-bold text-[#C9A96A] hover:text-[#FAF8F5] transition-colors">
                  <Phone className="w-3.5 h-3.5" />
                  Contact Kyle Friedman
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Related Articles - real posts, placed at the end of the
            article rather than a sidebar, matching current UX guidance
            that secondary content performs better here than competing
            for attention beside the article. */}
        {relatedPosts.length > 0 && (
          <div className="mb-10">
            <h3 className="font-serif text-xl font-bold text-[#0D2226] mb-5 text-center">More From The Friedman Report</h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-x-1 gap-y-6">
              {relatedPosts.map((p) => (
                <Link key={p.slug} to={`/blog/${p.slug}`} className="group block relative h-[220px] overflow-hidden">
                  <img src={p.heroImage} alt={p.title} className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
                  <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/90 via-black/50 to-transparent px-4 py-4">
                    <span className="text-[9px] font-bold uppercase tracking-widest text-[#C9A96A]">{formatDisplayDate(p.publishDate)}</span>
                    <h4 className="font-serif text-sm font-bold text-white leading-snug mt-1 line-clamp-2">{p.title}</h4>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}

        <div className="text-center pt-8 border-t border-[#C9A96A]/20 space-y-4">
          <h3 className="font-serif text-2xl font-bold text-[#0D2226]">
            Have Questions? Let's Talk.
          </h3>
          <div className="text-xs text-[#1C2B2E]/70 space-y-1">
            <p className="flex items-center justify-center gap-2">
              <Phone className="w-3.5 h-3.5 text-[#C9A96A]" />
              <a href="tel:4437893101" className="hover:text-[#0F5C63]">443-789-3101</a>
              <span>|</span>
              <a href="mailto:kyle@friedmanreteam.com" className="hover:text-[#0F5C63] underline">kyle@friedmanreteam.com</a>
            </p>
            <p>8115 Maple Lawn Blvd. #350, Fulton, MD 20759</p>
          </div>
          <img src="/images/kyle-signature.png" alt="Kyle Friedman, The Friedman Team, eXp Realty" className="w-40 h-40 object-contain mx-auto" />
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
