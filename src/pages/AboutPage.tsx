import React from 'react';
import { ShieldCheck, Award, CheckCircle2, Phone, Calendar, ArrowRight, Compass, MapPin, Building2, Landmark, GraduationCap } from 'lucide-react';
import { ReviewsSection } from '../components/ReviewsSection';
import { usePageMeta } from '../lib/usePageMeta';

interface AboutPageProps {
  onOpenConsultation: () => void;
  setActiveTab: (tab: string) => void;
}

export const AboutPage: React.FC<AboutPageProps> = ({
  onOpenConsultation,
  setActiveTab
}) => {
  usePageMeta(
    'Kyle Friedman | Realtor, The Friedman Team | Carroll County, MD',
    'Meet Kyle Friedman, Real Estate Professional & Expert Negotiator with The Friedman Team at eXp Realty, serving Carroll, Baltimore, Howard, and Frederick County, Maryland.'
  );

  // Page-level Person entity for the "Kyle Friedman" branded search / Google
  // Knowledge Panel. index.html carries the RealEstateAgent schema with Kyle
  // nested as `founder`; this is the standalone Person with mainEntityOfPage
  // pointing at /about, which is what Google keys a person entity off of.
  // TODO: add the Google Business Profile URL to `sameAs`, and the REALTOR
  // license number as a `hasCredential` block, once Kyle provides them.
  const personSchema = {
    '@context': 'https://schema.org',
    '@type': 'Person',
    '@id': 'https://www.friedmanreteam.com/about#kyle-friedman',
    name: 'Kyle Friedman',
    jobTitle: 'Real Estate Professional & Expert Negotiator',
    description:
      'Kyle Friedman is the founder of The Friedman Team at eXp Realty, serving buyers and sellers across Carroll, Baltimore, Howard, and Frederick County, Maryland with a data-driven approach to pricing and negotiation.',
    url: 'https://www.friedmanreteam.com/about',
    image: 'https://www.friedmanreteam.com/images/kyle-portrait.jpg',
    mainEntityOfPage: 'https://www.friedmanreteam.com/about',
    telephone: '+1-443-789-3101',
    email: 'kyle@friedmanreteam.com',
    worksFor: {
      '@type': 'RealEstateAgent',
      name: 'The Friedman Team by Kyle Friedman',
      url: 'https://www.friedmanreteam.com/',
      telephone: '+1-443-789-3101',
      address: {
        '@type': 'PostalAddress',
        streetAddress: '8115 Maple Lawn Blvd Suite 350',
        addressLocality: 'Fulton',
        addressRegion: 'MD',
        postalCode: '20759',
        addressCountry: 'US',
      },
    },
    areaServed: [
      { '@type': 'AdministrativeArea', name: 'Carroll County, MD' },
      { '@type': 'AdministrativeArea', name: 'Baltimore County, MD' },
      { '@type': 'AdministrativeArea', name: 'Howard County, MD' },
      { '@type': 'AdministrativeArea', name: 'Frederick County, MD' },
    ],
    knowsAbout: [
      'Residential Real Estate',
      'Farm & Land Sales',
      'Data-Driven Pricing Strategy',
      'Real Estate Negotiation',
      'Maryland Housing Market',
    ],
    memberOf: { '@type': 'Organization', name: 'National Association of REALTORS' },
    sameAs: [
      'https://share.google/q91ZdJrdKqZ3o5NUd',
      'https://share.google/fH72jPIgQXjEImIHG',
      'https://www.zillow.com/profile/Kyle%20Friedman%20Team',
      'https://www.facebook.com/kyle.friedman132',
      'https://www.instagram.com/keysbykyle',
      'https://www.linkedin.com/in/kyle-friedman-415029168',
      'https://www.youtube.com/@SimplyFriedman/shorts',
    ],
  };

  const specializations = [
    {
      title: 'First-Time & Move-Up Buyers',
      description: 'Clear, step-by-step guidance from pre-approval through closing, whether it\u2019s a first home or an upgrade.'
    },
    {
      title: 'Local County Expertise',
      description: 'Deep knowledge of Carroll, Howard, Frederick, and Baltimore County, from HOA nuances to well and septic considerations.'
    },
    {
      title: 'Strategic Marketing',
      description: 'Professional photography, targeted digital exposure, and a clear plan for where today\u2019s buyers are actually looking.'
    },
    {
      title: 'Data-Driven Negotiation',
      description: 'Protecting your equity through real comparable data, disciplined offer structures, and clear communication at every step.'
    },
    {
      title: 'Discreet Off-Market Placement',
      description: 'Private listing distribution to ultra-high-net-worth buyer networks without public MLS broadcasting when desired.'
    }
  ];

  return (
    <div className="pt-28 pb-20 space-y-20">

      <script type="application/ld+json">{JSON.stringify(personSchema)}</script>

      {/* Hero Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-[#0D2226] text-[#FAF8F5] border border-[#C9A96A]/40 p-8 sm:p-14 rounded-xs shadow-2xl grid grid-cols-1 lg:grid-cols-12 gap-10 items-center relative overflow-hidden">
          
          <div className="lg:col-span-7 space-y-6 z-10">
            <span className="text-xs font-bold uppercase tracking-[0.25em] text-[#C9A96A] bg-[#0F5C63] px-3.5 py-1 border border-[#C9A96A]/30 inline-block">
              Carroll, Howard, Frederick & Baltimore County Real Estate
            </span>

            <h1 className="font-serif text-4xl sm:text-6xl font-bold tracking-tight text-[#FAF8F5]">
              Kyle Friedman
            </h1>

            <p className="text-sm sm:text-base text-[#A8B2A1] font-light leading-relaxed">
              Real Estate Professional & Expert Negotiator • The Friedman Team • eXp Realty
            </p>

            <p className="text-xs sm:text-sm text-[#FAF8F5]/90 leading-relaxed font-normal pt-2">
              Kyle Friedman founded The Friedman Team on a simple idea: every client deserves the same level of preparation, whether they're buying a starter home or selling a long-time family property. Kyle Friedman's background is in direct sales and property transactions, which shaped a practical, detail-driven approach to pricing and negotiation that's become the foundation of how the team operates today. Based in Taneytown and serving Carroll, Howard, Frederick, and Baltimore County, The Friedman Team works with first-time buyers, growing families, and move-up sellers, all getting the same strategy and standard of service at every price point.
            </p>

            <p className="text-xs text-[#A8B2A1] leading-relaxed">
              Trained under his mentor James Buckley, part of Buckley's eXp Realty sponsorship network.
            </p>

            <div className="pt-4 flex flex-wrap items-center gap-4">
              <button
                onClick={onOpenConsultation}
                id="about-consult-btn"
                className="px-8 py-3.5 bg-[#C9A96A] hover:bg-[#D4AF37] text-[#0D2226] font-bold text-xs uppercase tracking-widest rounded-xs transition-all shadow-lg flex items-center gap-2"
              >
                <Phone className="w-4 h-4" />
                <span>Schedule a Private Consultation</span>
              </button>
            </div>
          </div>

          <div className="lg:col-span-5 relative z-10">
            <div className="relative rounded-xs overflow-hidden border-2 border-[#C9A96A] aspect-[4/5] shadow-2xl">
              <img
                src="/images/kyle-portrait.jpg"
                alt="Kyle Friedman Real Estate Advisor"
                className="w-full h-full object-cover object-top"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#0D2226]/80 via-transparent to-transparent" />
            </div>
          </div>

        </div>
      </section>

      {/* Specialization Areas */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        <div className="text-center max-w-3xl mx-auto space-y-3">
          <span className="text-xs font-bold uppercase tracking-widest text-[#0F5C63]">
            Core Competencies
          </span>
          <h2 className="font-serif text-3xl sm:text-4xl font-bold text-[#0D2226]">
            Areas of Strategic Advisory Specialization
          </h2>
          <p className="text-sm text-[#1C2B2E]/80">
            Expertise tailored specifically for high-net-worth residential and agricultural markets in Maryland.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {specializations.map((spec, i) => (
            <div
              key={i}
              className="bg-[#FAF8F5] border border-[#C9A96A]/30 p-6 rounded-xs shadow-md space-y-3 hover:border-[#0F5C63] transition-colors"
            >
              <div className="w-10 h-10 bg-[#0F5C63] text-[#C9A96A] flex items-center justify-center rounded-xs font-serif font-bold">
                0{i + 1}
              </div>
              <h3 className="font-serif text-xl font-bold text-[#0D2226]">
                {spec.title}
              </h3>
              <p className="text-xs text-[#1C2B2E]/80 leading-relaxed">
                {spec.description}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Mission Statement & Values */}
      <section className="bg-[#0D2226] text-[#FAF8F5] py-16 border-y border-[#C9A96A]/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          
          <div className="max-w-4xl mx-auto text-center space-y-4">
            <span className="text-xs font-bold uppercase tracking-[0.25em] text-[#C9A96A]">
              Our Guiding Principles
            </span>
            <h2 className="font-serif text-3xl sm:text-5xl font-bold text-[#FAF8F5]">
              Strategy First. Results That Follow.
            </h2>
            <p className="text-sm sm:text-base text-[#A8B2A1] font-light leading-relaxed">
              Every client, whether it's their first home or a multi-acre property, gets the same level of preparation, strategy, and care.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 text-center">
            <div className="p-6 bg-[#1A2E33] border border-[#FAF8F5]/10 rounded-xs space-y-2">
              <ShieldCheck className="w-8 h-8 text-[#C9A96A] mx-auto" />
              <h4 className="font-serif font-bold text-lg text-[#FAF8F5]">Numbers Over Guesswork</h4>
              <p className="text-xs text-[#A8B2A1]">Backed by real comps and demand data, not a gut feeling.</p>
            </div>

            <div className="p-6 bg-[#1A2E33] border border-[#FAF8F5]/10 rounded-xs space-y-2">
              <Landmark className="w-8 h-8 text-[#C9A96A] mx-auto" />
              <h4 className="font-serif font-bold text-lg text-[#FAF8F5]">Marketing That Sells</h4>
              <p className="text-xs text-[#A8B2A1]">A clear story for every listing, built for where buyers look.</p>
            </div>

            <div className="p-6 bg-[#1A2E33] border border-[#FAF8F5]/10 rounded-xs space-y-2">
              <Award className="w-8 h-8 text-[#C9A96A] mx-auto" />
              <h4 className="font-serif font-bold text-lg text-[#FAF8F5]">Negotiation That Protects</h4>
              <p className="text-xs text-[#A8B2A1]">Every point of the contract, negotiated with your outcome in mind.</p>
            </div>

            <div className="p-6 bg-[#1A2E33] border border-[#FAF8F5]/10 rounded-xs space-y-2">
              <Compass className="w-8 h-8 text-[#C9A96A] mx-auto" />
              <h4 className="font-serif font-bold text-lg text-[#FAF8F5]">Local, Not General</h4>
              <p className="text-xs text-[#A8B2A1]">Deep ties to Carroll, Baltimore, Howard, and Frederick County.</p>
            </div>
          </div>

        </div>
      </section>

      {/* Real Client Reviews */}
      <ReviewsSection />

      {/* CTA Footer Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <div className="bg-[#0F5C63] text-[#FAF8F5] p-10 rounded-xs shadow-2xl space-y-4 border border-[#C9A96A]/40">
          <h2 className="font-serif text-3xl font-bold">
            Ready to Discuss Your Maryland Real Estate Goals?
          </h2>
          <p className="text-xs sm:text-sm text-[#FAF8F5]/90 max-w-xl mx-auto">
            Schedule a 1-on-1 confidential strategy session with Kyle Friedman to analyze your home valuation or discuss property purchasing options.
          </p>
          <button
            onClick={onOpenConsultation}
            className="px-8 py-3.5 bg-[#C9A96A] hover:bg-[#D4AF37] text-[#0D2226] font-bold text-xs uppercase tracking-widest rounded-xs transition-colors"
          >
            Request Private Advisory Session
          </button>
        </div>
      </section>

    </div>
  );
};
