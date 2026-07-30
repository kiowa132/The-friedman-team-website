import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { FileText, Download, AlertCircle, CheckCircle2 } from 'lucide-react';
import { GUIDES, BLOG_POSTS } from '../lib/content';
import { submitLead } from '../lib/leads';

export const GuideDetailPage: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const guide = GUIDES.find((g) => g.slug === slug);

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [downloaded, setDownloaded] = useState(false);

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

    // Tagged with the specific guide name so it's clear in Follow Up Boss
    // exactly which lead magnet this person downloaded.
    const { ok, error } = await submitLead({
      name,
      email,
      phone,
      type: 'General Inquiry',
      message: `Downloaded guide: "${guide.title}"`,
    });

    setIsSubmitting(false);

    if (!ok) {
      setSubmitError(error || 'Something went wrong. Please try again or contact Kyle directly.');
      return;
    }

    setDownloaded(true);
  };

  return (
    <div className="pt-28 pb-20 max-w-3xl mx-auto px-4 sm:px-6 space-y-8">
      <div className="text-center space-y-4">
        <div className="aspect-[16/9] rounded-xs overflow-hidden">
          <img src={guide.coverImage} alt={guide.title} className="w-full h-full object-cover" />
        </div>
        <span className="text-xs font-bold uppercase tracking-widest text-[#C9A96A] flex items-center justify-center gap-2">
          <FileText className="w-4 h-4" /> Free Guide
        </span>
        <h1 className="font-serif text-3xl sm:text-4xl font-bold text-[#0D2226]">{guide.title}</h1>
        <p className="text-sm text-[#1C2B2E]/80 max-w-xl mx-auto">{guide.description}</p>
      </div>

      {!downloaded ? (
        <form onSubmit={handleSubmit} className="bg-[#FAF8F5] border border-[#C9A96A]/40 p-6 sm:p-8 rounded-xs space-y-4 max-w-md mx-auto">
          <h2 className="font-serif text-lg font-bold text-[#0D2226] text-center">Enter your info to get instant access</h2>

          <input
            type="text"
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Full Name"
            className="w-full bg-white border border-[#C9A96A]/30 px-4 py-3 text-sm rounded-xs focus:outline-none focus:border-[#C9A96A]"
          />
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Email"
            className="w-full bg-white border border-[#C9A96A]/30 px-4 py-3 text-sm rounded-xs focus:outline-none focus:border-[#C9A96A]"
          />
          <input
            type="tel"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            placeholder="Phone (optional)"
            className="w-full bg-white border border-[#C9A96A]/30 px-4 py-3 text-sm rounded-xs focus:outline-none focus:border-[#C9A96A]"
          />

          {submitError && (
            <div className="bg-red-900/10 border border-red-500/40 p-3 text-left rounded-xs flex items-start gap-2">
              <AlertCircle className="w-4 h-4 text-red-500 shrink-0 mt-0.5" />
              <p className="text-xs text-red-700">{submitError}</p>
            </div>
          )}

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full py-3.5 bg-[#C9A96A] hover:bg-[#D4AF37] text-[#0D2226] font-bold text-xs uppercase tracking-widest rounded-xs shadow-lg transition-all disabled:opacity-60 flex items-center justify-center gap-2"
          >
            <Download className="w-4 h-4" />
            {isSubmitting ? 'Sending...' : 'Get Instant Access'}
          </button>
        </form>
      ) : (
        <div className="bg-[#0D2226] text-[#FAF8F5] border border-[#C9A96A] p-8 rounded-xs text-center space-y-4 max-w-md mx-auto">
          <CheckCircle2 className="w-8 h-8 text-[#C9A96A] mx-auto" />
          <h2 className="font-serif text-xl font-bold">You're In!</h2>
          {guide.pdfUrl ? (
            <a
              href={guide.pdfUrl}
              download
              className="inline-flex items-center gap-2 px-6 py-3 bg-[#C9A96A] text-[#0D2226] font-bold text-xs uppercase tracking-widest rounded-xs"
            >
              <Download className="w-4 h-4" />
              Download Your Guide
            </a>
          ) : (
            <p className="text-xs text-[#A8B2A1]">
              Thanks! Kyle will send this guide directly to your email shortly.
            </p>
          )}
        </div>
      )}

      {relatedPost && (
        <div className="text-center text-xs text-[#1C2B2E]/60">
          Related: <Link to={`/blog/${relatedPost.slug}`} className="font-bold text-[#0F5C63] hover:text-[#C9A96A]">{relatedPost.title}</Link>
        </div>
      )}
    </div>
  );
};
