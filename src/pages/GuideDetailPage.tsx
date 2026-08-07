import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { FileText, Download, AlertCircle, CheckCircle2, ShieldCheck, Clock, Layers } from 'lucide-react';
import { GUIDES, BLOG_POSTS } from '../lib/content';
import { getStructuredGuide } from '../data/guides';
import { buyerHandbook } from '../data/guides/buyer-handbook-2026';
import { HandbookLandingPage } from '../components/HandbookLandingPage';
import { submitLead } from '../lib/leads';
import { FlipbookViewer } from '../components/FlipbookViewer';
import { GuideReader } from '../components/GuideReader';

interface GuideDetailPageProps {
  onOpenConsultation: () => void;
}

export const GuideDetailPage: React.FC<GuideDetailPageProps> = ({ onOpenConsultation }) => {
  const { slug } = useParams<{ slug: string }>();

  // The premium handbook uses its own dedicated experience entirely -
  // real page-image spreads, 3D cover, its own lead modal - since it's a
  // different content shape (real designed pages) from the structured
  // text guides below.
  if (slug === buyerHandbook.slug) {
    return <HandbookLandingPage guide={buyerHandbook} />;
  }

  const guide = GUIDES.find((g) => g.slug === slug);
  const structuredGuide = slug ? getStructuredGuide(slug) : undefined;

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [unlocked, setUnlocked] = useState(() => {
    try {
      return localStorage.getItem(`friedman_guide_unlocked_${slug}`) === 'true';
    } catch {
      return false;
    }
  });

  if (!guide) {
    return (
      <div className="pt-32 pb-20 text-center max-w-2xl mx-auto px-4">
        <h1 className="font-serif text-3xl font-bold text-[#0D2226] mb-3">Guide Not Found</h1>
        <Link to="/guides" className="px-6 py-3 bg-[#0D2226] text-[#FAF8F5] font-bold text-xs uppercase tracking-widest rounded-xs">
          View All Guides
        </Link>
      </div>
    );
  }

  const relatedPost = BLOG_POSTS.find((p) => p.slug === guide.relatedPostSlug);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitError(null);

    const { ok, error } = await submitLead({
      name,
      email,
      phone,
      type: 'General Inquiry',
      message: `Unlocked guide: "${guide.title}"`,
    });

    setIsSubmitting(false);

    if (!ok) {
      setSubmitError(error || 'Something went wrong. Please try again or contact Kyle directly.');
      return;
    }

    setUnlocked(true);
    try {
      localStorage.setItem(`friedman_guide_unlocked_${slug}`, 'true');
    } catch {
      // localStorage unavailable - not critical, unlock still works for this page view
    }
  };

  // AFTER unlocking, with structured content available: the full
  // immersive magazine-style reader, real HTML sections instead of
  // flipbook page images.
  if (unlocked && structuredGuide) {
    return <GuideReader guide={structuredGuide} onOpenConsultation={onOpenConsultation} />;
  }

  // AFTER unlocking, without structured content yet: fall back to the
  // previous flipbook/embed/html rendering, so older guides still work
  // until they're converted to the structured format too.
  if (unlocked) {
    return (
      <div className="pt-28 pb-20 max-w-[1600px] mx-auto px-4 sm:px-6 space-y-8">
        <div className="bg-[#0D2226] text-[#FAF8F5] border border-[#C9A96A] rounded-xs p-6 text-center space-y-2">
          <CheckCircle2 className="w-7 h-7 text-[#C9A96A] mx-auto" />
          <h1 className="font-serif text-2xl font-bold">You're In. Here's Your Guide</h1>
          {guide.pdfUrl && (
            <a
              href={guide.pdfUrl}
              download
              className="inline-flex items-center gap-2 mt-2 px-6 py-2.5 bg-[#C9A96A] text-[#0D2226] font-bold text-xs uppercase tracking-widest rounded-xs"
            >
              <Download className="w-4 h-4" />
              Also Download as PDF
            </a>
          )}
        </div>

        <div className="space-y-2">
          <span className="text-xs font-bold uppercase tracking-widest text-[#C9A96A] flex items-center gap-2">
            <FileText className="w-4 h-4" /> Free Guide
          </span>
          <h2 className="font-serif text-3xl font-bold text-[#0D2226]">{guide.title}</h2>
        </div>

        {guide.flipbookPages && guide.flipbookPages.length > 0 ? (
          <FlipbookViewer pages={guide.flipbookPages} title={guide.title} />
        ) : guide.publuuEmbedUrl ? (
          <div className="relative w-full" style={{ paddingBottom: '75%' }}>
            <iframe
              src={guide.publuuEmbedUrl}
              className="absolute top-0 left-0 w-full h-full rounded-xs border border-[#C9A96A]/30"
              allow="clipboard-write; fullscreen"
              allowFullScreen
              title={guide.title}
            />
          </div>
        ) : (
          <div
            className="prose prose-sm max-w-none [&_h2]:font-serif [&_h2]:text-xl [&_h2]:font-bold [&_h2]:text-[#0D2226] [&_h2]:pt-4 [&_p]:text-sm [&_p]:sm:text-base [&_p]:text-[#1C2B2E]/85 [&_p]:leading-relaxed [&_p]:mb-4"
            dangerouslySetInnerHTML={{ __html: guide.fullContentHtml }}
          />
        )}

        {relatedPost && (
          <div className="text-center text-xs text-[#1C2B2E]/60 pt-4 border-t border-[#C9A96A]/20">
            Related reading: <Link to={`/blog/${relatedPost.slug}`} className="font-bold text-[#0F5C63] hover:text-[#C9A96A]">{relatedPost.title}</Link>
          </div>
        )}

        <div className="text-center pt-2">
          <button
            onClick={onOpenConsultation}
            className="inline-flex items-center gap-2 px-8 py-3.5 bg-[#0D2226] text-[#FAF8F5] font-bold text-xs uppercase tracking-widest rounded-xs"
          >
            Talk to Kyle About Your Situation
          </button>
        </div>
      </div>
    );
  }

  // BEFORE unlocking: premium preview + lead capture form
  const pageCount = structuredGuide?.sections.length;
  const readMinutes = structuredGuide?.estimatedReadMinutes;

  return (
    <div className="pt-28 pb-20 max-w-5xl mx-auto px-4 sm:px-6">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">

        <div className="lg:col-span-7 space-y-6">
          <div className="max-h-[340px] aspect-[16/9] rounded-xs overflow-hidden shadow-lg bg-[#0D2226]">
            <img src={guide.coverImage} alt={guide.title} className="w-full h-full object-contain" />
          </div>

          <div className="space-y-3">
            <div className="flex items-center gap-4 flex-wrap">
              <span className="text-xs font-bold uppercase tracking-widest text-[#C9A96A] flex items-center gap-2">
                <FileText className="w-4 h-4" /> Free Guide
              </span>
              {readMinutes && (
                <span className="text-xs font-semibold text-[#1C2B2E]/60 flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5" /> {readMinutes} min read
                </span>
              )}
              {pageCount && (
                <span className="text-xs font-semibold text-[#1C2B2E]/60 flex items-center gap-1.5">
                  <Layers className="w-3.5 h-3.5" /> {pageCount} sections
                </span>
              )}
            </div>
            <h1 className="font-serif text-3xl sm:text-4xl font-bold text-[#0D2226] leading-tight">{guide.title}</h1>
            <p className="text-sm text-[#1C2B2E]/80 leading-relaxed">{guide.description}</p>
          </div>

          {guide.previewPoints.length > 0 && (
            <div className="bg-[#FAF8F5] border border-[#C9A96A]/30 rounded-xs p-6 space-y-3">
              <h2 className="font-serif text-lg font-bold text-[#0D2226]">What's Inside This Guide</h2>
              <ul className="space-y-2">
                {guide.previewPoints.map((point, i) => (
                  <li key={i} className="flex items-start gap-2 text-sm text-[#1C2B2E]/85">
                    <CheckCircle2 className="w-4 h-4 text-[#C9A96A] shrink-0 mt-0.5" />
                    <span>{point}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {relatedPost && (
            <div className="text-xs text-[#1C2B2E]/60">
              Related reading: <Link to={`/blog/${relatedPost.slug}`} className="font-bold text-[#0F5C63] hover:text-[#C9A96A]">{relatedPost.title}</Link>
            </div>
          )}
        </div>

        <div className="lg:col-span-5">
          <div className="lg:sticky lg:top-28">
            <form onSubmit={handleSubmit} className="bg-[#0D2226] border border-[#C9A96A] p-6 sm:p-8 rounded-xs space-y-4 shadow-xl">
              <h2 className="font-serif text-lg font-bold text-[#FAF8F5] text-center">Get Instant Access</h2>
              <p className="text-[11px] text-[#A8B2A1] text-center">Enter your info below. Unlocks immediately, no waiting.</p>

              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Full Name"
                className="w-full bg-[#FAF8F5] border border-[#C9A96A]/30 px-4 py-3 text-sm rounded-xs focus:outline-none focus:border-[#C9A96A]"
              />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Email"
                className="w-full bg-[#FAF8F5] border border-[#C9A96A]/30 px-4 py-3 text-sm rounded-xs focus:outline-none focus:border-[#C9A96A]"
              />
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="Phone (optional)"
                className="w-full bg-[#FAF8F5] border border-[#C9A96A]/30 px-4 py-3 text-sm rounded-xs focus:outline-none focus:border-[#C9A96A]"
              />

              {submitError && (
                <div className="bg-red-900/20 border border-red-500/40 p-3 text-left rounded-xs flex items-start gap-2">
                  <AlertCircle className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
                  <p className="text-xs text-red-200">{submitError}</p>
                </div>
              )}

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-3.5 bg-[#C9A96A] hover:bg-[#D4AF37] text-[#0D2226] font-bold text-xs uppercase tracking-widest rounded-xs shadow-lg transition-all disabled:opacity-60 flex items-center justify-center gap-2"
              >
                <Download className="w-4 h-4" />
                {isSubmitting ? 'Unlocking...' : 'Get Instant Access'}
              </button>

              <p className="text-[10px] text-[#A8B2A1] text-center flex items-center justify-center gap-1.5 pt-1">
                <ShieldCheck className="w-3 h-3 text-[#C9A96A]" />
                Your info goes straight to Kyle. Never sold or shared.
              </p>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};
