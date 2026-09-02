import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Bed, Bath, Maximize2, Trees, CalendarClock, MapPin, Phone, MessageSquareText, Mail, Play } from 'lucide-react';
import { SignListing, Listing } from '../types';
import { usePageMeta } from '../lib/usePageMeta';
import { fetchMlsListings, fetchMlsListingDetails } from '../lib/mlsApi';

const PHONE = '4437893101';
const PHONE_DISPLAY = '443-789-3101';
const EMAIL = 'kyle@friedmanreteam.com';

interface Props {
  listing?: SignListing;
}

// The page a For Sale sign's QR code lands on. Data comes from three
// sources, in this priority order:
//   1. Whatever Kyle typed into the CMS entry (content/listings/<slug>.md)
//   2. A live Lofty lookup by MLS number (fills every blank text field)
//   3. Batch-uploaded photos in public/images/listings/<slug>/
// So the normal workflow is: set `active`, paste the MLS number, drop the
// photos in the folder - and everything else fills itself in.
export const SignListingPage: React.FC<Props> = ({ listing }) => {
  const [mls, setMls] = useState<Listing | null>(null);
  const [mlsExtra, setMlsExtra] = useState<{ gallery: string[]; description: string } | null>(null);
  const [mlsState, setMlsState] = useState<'idle' | 'loading' | 'ok' | 'not_connected' | 'not_found'>('idle');

  // Live Lofty pull by MLS number - same /api/mls endpoints the IDX pages
  // use. Two calls: /search finds the listing (address, price, beds...),
  // then /details tries to get the full photo gallery + remarks. Fails
  // quietly: if Lofty isn't connected (LOFTY_API_KEY not set in Vercel) the
  // page just uses whatever's in the CMS entry.
  useEffect(() => {
    const id = listing?.mlsId?.trim();
    if (!id) return;
    let cancelled = false;
    setMlsState('loading');
    fetchMlsListings({ q: id, top: 12 })
      .then(async (res) => {
        if (cancelled) return;
        if (res.status === 'not_configured') { setMlsState('not_connected'); return; }
        if (res.status !== 'ok' || !res.listings.length) { setMlsState('not_found'); return; }
        const hit =
          res.listings.find((l) => (l.mlsNumber || '').toLowerCase() === id.toLowerCase()) || res.listings[0];
        if (!hit) { setMlsState('not_found'); return; }
        setMls(hit);
        setMlsState('ok');
        const det = await fetchMlsListingDetails(hit.id || hit.mlsNumber || id);
        if (!cancelled && det.status === 'ok' && (det.gallery.length || det.description)) {
          setMlsExtra({ gallery: det.gallery, description: det.description });
        }
      })
      .catch(() => { if (!cancelled) setMlsState('not_found'); });
    return () => {
      cancelled = true;
    };
  }, [listing?.mlsId]);

  // Merge: CMS value if set, otherwise the Lofty value. All null-safe so
  // this can run before the "no listing" guard below (hooks stay
  // unconditional).
  const v = {
    status: listing?.status || mls?.status || 'For Sale',
    streetAddress: listing?.streetAddress || mls?.address || '',
    cityStateZip:
      listing?.cityStateZip ||
      (mls ? [mls.city, `MD ${mls.zip}`.trim()].filter((s) => s && s !== 'MD').join(', ') : ''),
    listPrice: listing?.listPrice || mls?.formattedPrice || '',
    beds: listing?.beds || (mls?.beds ? String(mls.beds) : ''),
    baths: listing?.baths || (mls?.baths ? String(mls.baths) : ''),
    sqft: listing?.sqft || (mls?.sqft ? mls.sqft.toLocaleString() : ''),
    lotSize: listing?.lotSize || (mls?.acres ? `${mls.acres} acres` : ''),
    yearBuilt: listing?.yearBuilt || (mls?.yearBuilt ? String(mls.yearBuilt) : ''),
    tourUrl: listing?.tourUrl || mls?.virtualTourUrl || '',
  };

  // Photos: CMS gallery -> photo folder -> Lofty full gallery -> Lofty preview pic.
  const photos = listing?.photos?.length
    ? listing.photos
    : mlsExtra?.gallery?.length
    ? mlsExtra.gallery
    : mls?.gallery || [];
  const heroImage = listing?.heroImage || photos[0] || mls?.heroImage || '';
  const loftyDescription = mlsExtra?.description || mls?.description || '';
  const highlightsHtml =
    listing?.highlightsHtml || (loftyDescription ? `<p>${loftyDescription}</p>` : '');

  const addressLine = [v.streetAddress, v.cityStateZip].filter(Boolean).join(', ');

  usePageMeta(
    `${v.streetAddress || 'Featured Listing'}${v.cityStateZip ? `, ${v.cityStateZip}` : ''} | The Friedman Team`,
    [
      v.status,
      v.listPrice,
      [v.beds && `${v.beds} bed`, v.baths && `${v.baths} bath`, v.sqft && `${v.sqft} sq ft`].filter(Boolean).join(' / '),
    ]
      .filter(Boolean)
      .join(' · ') + ' — presented by Kyle Friedman, The Friedman Team.'
  );

  if (!listing) {
    return (
      <div className="pt-32 pb-20 text-center max-w-2xl mx-auto px-4">
        <h1 className="font-serif text-3xl font-bold text-[#0D2226] mb-3">No Featured Listing Right Now</h1>
        <p className="text-sm text-[#1C2B2E]/70 mb-6">
          Check back soon, or reach out and Kyle will send you what's active.
        </p>
        <Link to="/listings" className="px-6 py-3 bg-[#0D2226] text-[#FAF8F5] font-bold text-xs uppercase tracking-widest rounded-xs">
          See All Homes for Sale
        </Link>
      </div>
    );
  }

  const stats = [
    v.beds && { icon: Bed, label: 'Bedrooms', value: v.beds },
    v.baths && { icon: Bath, label: 'Bathrooms', value: v.baths },
    v.sqft && { icon: Maximize2, label: 'Sq Ft', value: v.sqft },
    v.lotSize && { icon: Trees, label: 'Lot', value: v.lotSize },
    v.yearBuilt && { icon: CalendarClock, label: 'Year Built', value: v.yearBuilt },
  ].filter(Boolean) as { icon: React.ElementType; label: string; value: string }[];

  const mapsUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(addressLine)}`;
  const smsBody = `Hi Kyle, I scanned the sign at ${addressLine || 'your listing'} and would like more info.`;
  const smsUrl = `sms:${PHONE}?&body=${encodeURIComponent(smsBody)}`;
  const mailUrl = `mailto:${EMAIL}?subject=${encodeURIComponent(`Question about ${addressLine || 'your listing'}`)}`;

  const schema = {
    '@context': 'https://schema.org',
    '@type': 'SingleFamilyResidence',
    name: addressLine || 'Featured Listing',
    url: `https://www.friedmanreteam.com/listings/${listing.slug}`,
    ...(heroImage
      ? { image: heroImage.startsWith('http') ? heroImage : `https://www.friedmanreteam.com${heroImage}` }
      : {}),
    address: {
      '@type': 'PostalAddress',
      streetAddress: v.streetAddress,
      addressRegion: 'MD',
      addressCountry: 'US',
    },
    ...(v.sqft ? { floorSize: { '@type': 'QuantitativeValue', value: v.sqft.replace(/[^\d.]/g, ''), unitCode: 'FTK' } } : {}),
    ...(v.beds ? { numberOfBedrooms: v.beds } : {}),
    broker: {
      '@type': 'RealEstateAgent',
      name: 'The Friedman Team by Kyle Friedman',
      telephone: '+1-443-789-3101',
      url: 'https://www.friedmanreteam.com',
    },
  };

  return (
    <div className="pt-20 pb-20 bg-[#FAF8F5]">
      <script type="application/ld+json">{JSON.stringify(schema)}</script>

      <div className="max-w-3xl mx-auto px-4 sm:px-6">
        {/* Header */}
        <div className="pt-8 pb-6 space-y-3">
          <span className="inline-block text-[11px] font-bold uppercase tracking-widest text-[#0F5C63] border border-[#0F5C63]/40 rounded-full px-3 py-1">
            {v.status}
          </span>
          <h1 className="font-serif text-3xl sm:text-4xl font-bold text-[#0D2226] leading-tight">
            {v.streetAddress || 'Featured Listing'}
          </h1>
          {v.cityStateZip && <p className="text-base text-[#1C2B2E]/70">{v.cityStateZip}</p>}
          {v.listPrice && <p className="font-serif text-2xl sm:text-3xl font-bold text-[#0F5C63]">{v.listPrice}</p>}
          {listing.mlsId && mlsState === 'loading' && !mls && (
            <p className="text-[11px] uppercase tracking-widest text-[#1C2B2E]/40">Pulling the latest details…</p>
          )}
        </div>

        {/* Hero image */}
        {heroImage ? (
          <div className="aspect-[16/9] max-h-[460px] overflow-hidden rounded-xs mb-6">
            <img src={heroImage} alt={addressLine} className="w-full h-full object-cover" />
          </div>
        ) : (
          <div className="aspect-[16/9] max-h-[380px] rounded-xs mb-6 border border-[#C9A96A]/40 bg-[#EFEBE2] flex items-center justify-center text-center px-6">
            <p className="text-xs uppercase tracking-widest text-[#1C2B2E]/50">Photos coming soon</p>
          </div>
        )}

        {/* Stat row */}
        {stats.length > 0 && (
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mb-8">
            {stats.map((s) => (
              <div key={s.label} className="border border-[#C9A96A]/40 rounded-xs bg-white px-4 py-3 flex items-center gap-3">
                <s.icon className="w-5 h-5 text-[#C9A96A] shrink-0" />
                <div>
                  <div className="font-serif text-lg font-bold text-[#0D2226] leading-none">{s.value}</div>
                  <div className="text-[10px] uppercase tracking-widest text-[#1C2B2E]/50 mt-1">{s.label}</div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Virtual tour */}
        {v.tourUrl && (
          <a
            href={v.tourUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center gap-2 w-full py-3 mb-8 bg-[#0D2226] text-[#FAF8F5] font-bold text-xs uppercase tracking-widest rounded-xs hover:bg-[#0F5C63] transition-colors"
          >
            <Play className="w-4 h-4" />
            Watch the Virtual Tour
          </a>
        )}

        {/* Highlights / description */}
        {highlightsHtml && (
          <div
            className="prose prose-sm max-w-none mb-10
              [&>*+*]:mt-4
              [&_p]:text-[15px] [&_p]:text-[#1C2B2E]/85 [&_p]:leading-[1.8] [&_p]:font-light
              [&_h2]:font-serif [&_h2]:text-2xl [&_h2]:font-bold [&_h2]:text-[#0D2226] [&_h2]:mt-8
              [&_h3]:font-serif [&_h3]:text-xl [&_h3]:font-bold [&_h3]:text-[#0D2226] [&_h3]:mt-6
              [&_a]:text-[#0F5C63] [&_a]:font-semibold [&_a]:underline [&_a]:decoration-[#C9A96A] [&_a]:decoration-2 [&_a]:underline-offset-2
              [&_strong]:font-bold [&_strong]:text-[#0D2226]
              [&_ul]:space-y-2 [&_ul]:my-4 [&_ul]:pl-0 [&_ul]:list-none
              [&_ul_li]:relative [&_ul_li]:pl-7 [&_ul_li]:text-[15px] [&_ul_li]:text-[#1C2B2E]/85 [&_ul_li]:leading-relaxed
              [&_ul_li:before]:content-[''] [&_ul_li:before]:absolute [&_ul_li:before]:left-0 [&_ul_li:before]:top-[0.6em] [&_ul_li:before]:w-2.5 [&_ul_li:before]:h-2.5 [&_ul_li:before]:rounded-full [&_ul_li:before]:bg-[#C9A96A]
              [&_ol]:space-y-2 [&_ol]:my-4 [&_ol]:pl-6 [&_ol]:marker:text-[#C9A96A] [&_ol]:marker:font-bold
              [&_img]:rounded-xs [&_img]:my-4
            "
            dangerouslySetInnerHTML={{ __html: highlightsHtml }}
          />
        )}

        {/* Photo gallery (everything except the one already shown as the hero) */}
        {photos.filter((p) => p !== heroImage).length > 0 && (
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 mb-10">
            {photos.filter((p) => p !== heroImage).map((src, i) => (
              <a key={i} href={src} target="_blank" rel="noopener noreferrer" className="block aspect-[4/3] overflow-hidden rounded-xs">
                <img
                  src={src}
                  alt={`${addressLine || 'Listing'} photo ${i + 1}`}
                  loading="lazy"
                  className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
                />
              </a>
            ))}
          </div>
        )}

        {/* Contact CTA */}
        <div className="bg-[#0D2226] text-[#FAF8F5] rounded-xs p-6 sm:p-8 text-center space-y-4 mb-8">
          <h2 className="font-serif text-2xl font-bold">Want the details or a private showing?</h2>
          <p className="text-sm text-[#A8B2A1]">
            Kyle Friedman is the listing agent. Text, call, or email for disclosures, comps, and a walkthrough.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
            <a href={smsUrl} className="flex items-center justify-center gap-2 py-3 bg-[#C9A96A] text-[#0D2226] font-bold text-xs uppercase tracking-widest rounded-xs hover:bg-[#D4AF37] transition-colors">
              <MessageSquareText className="w-4 h-4" /> Text Kyle
            </a>
            <a href={`tel:${PHONE}`} className="flex items-center justify-center gap-2 py-3 border border-[#C9A96A] text-[#C9A96A] font-bold text-xs uppercase tracking-widest rounded-xs hover:bg-[#C9A96A] hover:text-[#0D2226] transition-colors">
              <Phone className="w-4 h-4" /> Call
            </a>
            <a href={mailUrl} className="flex items-center justify-center gap-2 py-3 border border-[#C9A96A] text-[#C9A96A] font-bold text-xs uppercase tracking-widest rounded-xs hover:bg-[#C9A96A] hover:text-[#0D2226] transition-colors">
              <Mail className="w-4 h-4" /> Email
            </a>
          </div>
          <p className="text-[11px] text-[#A8B2A1] pt-1">
            {PHONE_DISPLAY} &nbsp;|&nbsp; {EMAIL}
          </p>
          {addressLine && (
            <a href={mapsUrl} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1.5 text-xs font-bold text-[#C9A96A] hover:text-[#FAF8F5] transition-colors">
              <MapPin className="w-3.5 h-3.5" /> Map it
            </a>
          )}
        </div>

        {/* Cross-links */}
        <div className="flex flex-col sm:flex-row gap-3">
          <Link to="/listings" className="flex-1 text-center py-3 border border-[#C9A96A]/50 rounded-xs text-xs font-bold uppercase tracking-widest text-[#0F5C63] hover:border-[#C9A96A] transition-colors">
            See All Homes for Sale
          </Link>
          <Link to="/sell" className="flex-1 text-center py-3 border border-[#C9A96A]/50 rounded-xs text-xs font-bold uppercase tracking-widest text-[#0F5C63] hover:border-[#C9A96A] transition-colors">
            What's Your Home Worth?
          </Link>
        </div>

        <p className="text-[10px] text-[#1C2B2E]/40 text-center mt-8 leading-relaxed">
          Presented by Kyle Friedman, The Friedman Team, brokered by eXp Realty. Information deemed reliable
          but not guaranteed. If your home is currently listed with another broker, this is not a solicitation.
        </p>
      </div>
    </div>
  );
};
