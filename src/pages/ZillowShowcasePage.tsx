import React from 'react';
import { Link } from 'react-router-dom';
import { Camera, Boxes, MapPinned, Users, TrendingUp, Clock3, Award, Phone, Eye, MousePointerClick, Sparkles } from 'lucide-react';
import { usePageMeta } from '../lib/usePageMeta';
import { ReviewsSection } from '../components/ReviewsSection';

interface ZillowShowcasePageProps {
  onOpenConsultation: () => void;
}

// Real, sourced content only. The stats are Zillow/ShowingTime+'s own
// published numbers (cited below), not a Friedman Team-specific result -
// Kyle Friedman doesn't have his own Showcase outcome data yet, so this
// page explains the real product rather than implying a track record
// that doesn't exist. The comparison graphic and one-pager are Kyle's
// own co-branded marketing assets. The floor plan image and videos are
// illustrative product demos of a different real listing, used to show
// what the feature looks like, not presented as one of Kyle's own
// listings.
export const ZillowShowcasePage: React.FC<ZillowShowcasePageProps> = ({ onOpenConsultation }) => {
  usePageMeta(
    'Zillow Showcase | The Friedman Team',
    'Zillow Showcase gives eligible listings premium placement, interactive floor plans, and professional media on Zillow - available for select Friedman Team listings.'
  );

  const included = [
    { icon: Camera, title: 'High-Resolution Photography', description: 'Professional photography built for the larger, more prominent hero image Showcase listings get.' },
    { icon: Boxes, title: 'Interactive Floor Plans & 3D Tours', description: 'Buyers can explore the actual layout room by room, not just scroll through static photos.' },
    { icon: MapPinned, title: 'Priority Placement', description: 'Special map callouts and prioritized position in personalized Zillow search results.' },
    { icon: Users, title: 'Direct Buyer Access', description: 'Interested buyers can contact Kyle Friedman directly from the listing, with exposure to Zillow\u2019s own user base.' },
  ];

  const whyItMatters = [
    { icon: Eye, title: 'The Thumbnail Decides Everything', description: 'Most buyers scroll through dozens of listings before ever scheduling a showing. The first photo is doing all the work, before anyone reads a single detail.' },
    { icon: MousePointerClick, title: 'Attention Is the Scarce Resource', description: 'A standard listing competes for a click on equal footing with every other home nearby. Showcase changes that competition entirely.' },
    { icon: Sparkles, title: 'Not Every Listing Qualifies, and That\u2019s the Point', description: 'Showcase is limited to roughly 10% of listings in a market. When a property is eligible, that scarcity is exactly what makes the placement valuable.' },
  ];

  const stats = [
    { icon: TrendingUp, stat: '2% higher', description: 'average sale price compared to similar non-Showcase listings' },
    { icon: Clock3, stat: '~20% more likely', description: 'to go pending within the first 14 days on market' },
    { icon: Award, stat: '20% more listings won', description: 'by agents using Showcase, compared to similar non-Showcase agents' },
    { icon: Users, stat: '75%+ average increase', description: 'in saves, shares, and page views compared to similar nearby listings' },
  ];

  const videos = [
    { src: '/videos/zillow-showcase/hero.mp4', title: 'The Showcase Listing Experience' },
    { src: '/videos/zillow-showcase/3d-home.mp4', title: 'Interactive 3D Home Tour' },
    { src: '/videos/zillow-showcase/photos.mp4', title: 'Professional Photography' },
  ];

  const faqs = [
    { q: 'Does every listing qualify for Showcase?', a: 'No. It\u2019s available to roughly 10% of listings in a given market at a time. Kyle Friedman can tell you honestly whether a specific property is likely to be eligible before you list.' },
    { q: 'Does this cost extra?', a: 'No. When a property qualifies, Showcase is included as part of the marketing plan, at no additional cost to you.' },
    { q: 'What if my home doesn\u2019t qualify?', a: 'It still gets a full, professional marketing plan, professional photography, and a strategic pricing approach. Showcase is an enhancement on top of that, not a replacement for it.' },
    { q: 'How is this different from a regular Zillow listing?', a: 'A larger hero image, interactive floor plans and 3D tours, priority placement in search and on the map, and direct alerts to interested buyers in Zillow\u2019s own user base.' },
  ];

  return (
    <div className="bg-[#FAF8F5]">

      {/* Hero */}
      <div className="pt-32 pb-12 max-w-4xl mx-auto px-4 sm:px-6 text-center">
        <span className="text-xs font-bold uppercase tracking-[0.3em] text-[#C9A96A]">The Friedman Team</span>
        <h1 className="font-serif text-4xl sm:text-6xl font-bold text-[#0D2226] leading-tight mt-3">
          Zillow Showcase
        </h1>
        <p className="text-base sm:text-lg text-[#1C2B2E]/80 leading-relaxed mt-5 max-w-2xl mx-auto font-light">
          A premium listing placement on Zillow, available to roughly 10% of listings in a given market. When a property qualifies, Kyle Friedman uses it as part of the marketing plan, at no extra cost to you.
        </p>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 pb-16">
        <img src="/images/zillow-showcase/blog-thumbnail.jpg" alt="Maximize your home's visibility with Zillow Showcase" className="w-full h-auto rounded-sm shadow-lg" />
      </div>

      {/* Why it matters */}
      <div className="max-w-5xl mx-auto px-4 sm:px-6 pb-20">
        <h2 className="font-serif text-2xl font-bold text-[#0D2226] text-center mb-3">Why Visibility Actually Matters</h2>
        <p className="text-sm text-[#1C2B2E]/65 text-center mb-10 max-w-2xl mx-auto">
          Before a buyer ever walks through the door, they've already made a decision about your home online.
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-8">
          {whyItMatters.map((w) => (
            <div key={w.title} className="bg-white border border-[#C9A96A]/25 p-7 text-center">
              <div className="w-12 h-12 rounded-full border border-[#C9A96A]/40 flex items-center justify-center mx-auto text-[#0F5C63]">
                <w.icon className="w-5 h-5" />
              </div>
              <h3 className="font-serif text-base font-bold text-[#0D2226] mt-4">{w.title}</h3>
              <p className="text-xs text-[#1C2B2E]/65 leading-relaxed mt-2">{w.description}</p>
            </div>
          ))}
        </div>
      </div>

      {/* What's included */}
      <div className="bg-white py-20">
        <div className="max-w-5xl mx-auto px-4 sm:px-6">
          <h2 className="font-serif text-2xl font-bold text-[#0D2226] text-center mb-10">What Showcase Includes</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-10 gap-y-8">
            {included.map((item) => (
              <div key={item.title} className="flex gap-4">
                <div className="w-11 h-11 rounded-full border border-[#C9A96A]/40 flex items-center justify-center shrink-0 text-[#0F5C63]">
                  <item.icon className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-serif text-lg font-bold text-[#0D2226]">{item.title}</h3>
                  <p className="text-sm text-[#1C2B2E]/70 leading-relaxed mt-1">{item.description}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-14">
            <img src="/images/zillow-showcase/floorplan-demo.jpg" alt="Example of the interactive floor plan feature on a Zillow Showcase listing" className="w-full rounded-sm shadow-lg" />
            <p className="text-xs text-[#1C2B2E]/50 text-center mt-3">
              Example of the interactive floor plan experience buyers get on a Showcase listing.
            </p>
          </div>
        </div>
      </div>

      {/* See it in action */}
      <div className="bg-[#0D2226] py-20">
        <div className="max-w-5xl mx-auto px-4 sm:px-6">
          <h2 className="font-serif text-2xl sm:text-3xl font-bold text-[#FAF8F5] text-center mb-3">See Showcase In Action</h2>
          <p className="text-xs text-[#A8B2A1] text-center mb-10">A look at the real Showcase experience on Zillow</p>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            {videos.map((v) => (
              <div key={v.src}>
                <video controls preload="metadata" className="w-full rounded-sm border border-[#FAF8F5]/10 shadow-lg bg-black">
                  <source src={v.src} type="video/mp4" />
                </video>
                <p className="text-xs text-[#F5F1E8]/70 text-center mt-3">{v.title}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Standard vs Showcase */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-20">
        <h2 className="font-serif text-2xl sm:text-3xl font-bold text-[#0D2226] text-center mb-10">
          Standard Listing vs. Showcase
        </h2>
        <img src="/images/zillow-showcase/comparison-graphic.jpg" alt="Regular Zillow listing versus Zillow Showcase comparison" className="w-full rounded-sm shadow-lg" />
      </div>

      {/* Real, sourced stats */}
      <div className="max-w-5xl mx-auto px-4 sm:px-6 pb-20">
        <h2 className="font-serif text-2xl font-bold text-[#0D2226] text-center mb-2">The Real Numbers</h2>
        <p className="text-xs text-[#1C2B2E]/50 text-center mb-10">
          Published Zillow / ShowingTime+ data, compared to similar non-Showcase listings - not a Friedman Team-specific result.
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-10">
          {stats.map((s) => (
            <div key={s.description} className="bg-white border border-[#C9A96A]/25 p-6 flex gap-4 items-start">
              <s.icon className="w-6 h-6 text-[#0F5C63] shrink-0 mt-0.5" />
              <div>
                <div className="font-serif text-xl font-bold text-[#0D2226]">{s.stat}</div>
                <p className="text-xs text-[#1C2B2E]/70 mt-1">{s.description}</p>
              </div>
            </div>
          ))}
        </div>
        <img src="/images/zillow-showcase/stats-graphic.jpg" alt="Zillow Showcase listing statistics" className="w-full rounded-sm shadow-lg" />
        <p className="text-[11px] text-[#1C2B2E]/45 text-center mt-4">
          Source:{' '}
          <a href="https://showingtimeplus.com/solutions/listing-showcase-facts" target="_blank" rel="noopener noreferrer" className="underline hover:text-[#0F5C63]">
            showingtimeplus.com/solutions/listing-showcase-facts
          </a>
        </p>
      </div>

      {/* FAQ */}
      <div className="max-w-3xl mx-auto px-4 sm:px-6 pb-20">
        <h2 className="font-serif text-2xl font-bold text-[#0D2226] text-center mb-10">Common Questions</h2>
        <div className="space-y-6">
          {faqs.map((f) => (
            <div key={f.q} className="border-b border-[#C9A96A]/20 pb-6">
              <h3 className="font-serif text-base font-bold text-[#0D2226]">{f.q}</h3>
              <p className="text-sm text-[#1C2B2E]/70 leading-relaxed mt-2">{f.a}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Real reviews - same genuine Google reviews shown elsewhere on the
          site, not written specifically for this page. */}
      <ReviewsSection />

      {/* CTA */}
      <div className="max-w-3xl mx-auto px-4 sm:px-6 pt-20 pb-24 text-center">
        <h2 className="font-serif text-2xl font-bold text-[#0D2226]">See If Your Home Qualifies</h2>
        <p className="text-sm text-[#1C2B2E]/70 mt-3 max-w-lg mx-auto">
          Not every listing is eligible for Showcase, but if yours is, it's included in the marketing plan. Let's talk about your property.
        </p>
        <button
          onClick={onOpenConsultation}
          className="inline-flex items-center gap-2 mt-7 px-10 py-4 bg-[#0D2226] hover:bg-[#0F5C63] text-[#FAF8F5] font-bold text-xs uppercase tracking-widest rounded-xs shadow-lg transition-colors"
        >
          <Phone className="w-4 h-4" />
          Talk to Kyle Friedman
        </button>
        <div className="mt-6">
          <Link to="/luxury" className="text-xs text-[#0F5C63] hover:text-[#C9A96A] font-bold underline">
            Back to Fine Homes & Estate Properties
          </Link>
        </div>
      </div>

    </div>
  );
};
