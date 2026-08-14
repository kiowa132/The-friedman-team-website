import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Globe, Linkedin, ShieldCheck, ArrowRight, Loader2, CheckCircle2, Phone, Mail } from 'lucide-react';
import { usePageMeta } from '../lib/usePageMeta';
import { getNetworkMember, isPlaceholder } from '../data/network';
import { FieldValue } from '../components/FieldValue';
import { submitLead } from '../lib/leads';

export const NetworkMemberProfilePage: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const member = slug ? getNetworkMember(slug) : undefined;

  usePageMeta(
    member ? `${member.name} | Maryland Professional Network` : 'Member Not Found | Maryland Professional Network',
    member ? `${member.name}, ${member.industry} - Maryland Professional Network.` : 'This member could not be found.'
  );

  const [requesterName, setRequesterName] = useState('');
  const [requesterEmail, setRequesterEmail] = useState('');
  const [reason, setReason] = useState('');
  const [message, setMessage] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  if (!member) {
    return (
      <div className="pt-40 pb-24 text-center">
        <p className="font-serif text-2xl font-bold text-[#0D2226]">Member Not Found</p>
        <Link to="/network/directory" className="text-sm text-[#0F5C63] underline mt-4 inline-block">Back to the Directory</Link>
      </div>
    );
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setError(null);

    const { ok, error: err } = await submitLead({
      name: requesterName,
      email: requesterEmail,
      type: 'Network Inquiry',
      message: `Requested an introduction to ${member.name} (${member.industry}).\n\nWho they want to meet: ${reason}\n\n${message ? `Message: ${message}` : ''}`,
    });

    setSubmitting(false);

    if (!ok) {
      setError(err || 'Something went wrong. Please try again.');
      return;
    }

    setSuccess(true);
  };

  const hasRealList = (list?: string[]) => list && list.length > 0 && !isPlaceholder(list[0]);

  return (
    <div className="bg-[#FAF8F5] pt-32 pb-24">
      <div className="max-w-3xl mx-auto px-4 sm:px-6">

        <Link to="/network/directory" className="text-xs text-[#0F5C63] hover:text-[#C9A96A] font-bold uppercase tracking-wider">
          &larr; Back to Directory
        </Link>

        <div className="flex flex-col sm:flex-row items-start gap-6 mt-6">
          <div className="w-24 h-24 rounded-full bg-[#0F5C63]/10 flex items-center justify-center shrink-0 text-[#0F5C63] font-serif text-3xl font-bold overflow-hidden">
            {isPlaceholder(member.headshot) ? member.name.split(' ').map((n) => n[0]).join('') : (
              <img src={member.headshot} alt={member.name} className="w-full h-full object-cover object-[center_15%]" />
            )}
          </div>
          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-[#C9A96A]">{member.status}</span>
            <h1 className="font-serif text-3xl font-bold text-[#0D2226] mt-1">{member.name}</h1>
            <FieldValue value={member.title} className="text-sm text-[#1C2B2E]/70 block mt-1" />
            <FieldValue value={member.company} className="text-sm text-[#1C2B2E]/70 block" />
            <p className="text-xs text-[#0F5C63] font-bold mt-2">{member.industry}</p>
          </div>
        </div>

        {!isPlaceholder(member.bio) && (
          <div className="text-sm text-[#1C2B2E]/80 leading-relaxed mt-8 whitespace-pre-line">
            {member.bio}
          </div>
        )}
        {isPlaceholder(member.bio) && (
          <p className="text-sm text-[#1C2B2E]/40 italic mt-8">Bio not yet supplied.</p>
        )}

        {member.certifications && member.certifications.length > 0 && (
          <div className="border border-[#C9A96A]/25 bg-white p-6 mt-8">
            <h3 className="font-serif text-sm font-bold text-[#0D2226] uppercase tracking-wide">Certifications</h3>
            <ul className="mt-3 space-y-1.5">
              {member.certifications.map((cert) => (
                <li key={cert} className="text-xs text-[#1C2B2E]/70">&bull; {cert}</li>
              ))}
            </ul>
          </div>
        )}

        {member.videoUrl && (
          member.videoIsShort ? (
            <div className="flex justify-center mt-8">
              <div className="w-full max-w-[280px] aspect-[9/16] rounded-xs overflow-hidden border border-[#C9A96A]/30">
                <video controls preload="metadata" className="w-full h-full bg-black">
                  <source src={member.videoUrl} type="video/mp4" />
                </video>
              </div>
            </div>
          ) : (
            <div className="aspect-video rounded-xs overflow-hidden border border-[#C9A96A]/30 mt-8">
              <video controls preload="metadata" className="w-full h-full bg-black">
                <source src={member.videoUrl} type="video/mp4" />
              </video>
            </div>
          )
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mt-10">
          {hasRealList(member.lookingToMeet) && (
            <div className="border border-[#C9A96A]/25 bg-white p-6">
              <h3 className="font-serif text-sm font-bold text-[#0D2226] uppercase tracking-wide">Looking to Meet</h3>
              <ul className="mt-3 space-y-1.5">
                {member.lookingToMeet.map((item) => (
                  <li key={item} className="text-xs text-[#1C2B2E]/70">&bull; {item}</li>
                ))}
              </ul>
            </div>
          )}
          {hasRealList(member.canHelpWith) && (
            <div className="border border-[#C9A96A]/25 bg-white p-6">
              <h3 className="font-serif text-sm font-bold text-[#0D2226] uppercase tracking-wide">Can Help With</h3>
              <ul className="mt-3 space-y-1.5">
                {member.canHelpWith.map((item) => (
                  <li key={item} className="text-xs text-[#1C2B2E]/70">&bull; {item}</li>
                ))}
              </ul>
            </div>
          )}
        </div>

        {(member.website || member.linkedin || member.phone || member.email) && (
          <div className="flex flex-wrap gap-4 mt-6">
            {member.website && (
              <a href={member.website} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1.5 text-xs text-[#0F5C63] hover:text-[#C9A96A]">
                <Globe className="w-3.5 h-3.5" /> Website
              </a>
            )}
            {member.linkedin && (
              <a href={member.linkedin} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1.5 text-xs text-[#0F5C63] hover:text-[#C9A96A]">
                <Linkedin className="w-3.5 h-3.5" /> LinkedIn
              </a>
            )}
            {member.phone && (
              <a href={`tel:${member.phone.replace(/[^0-9+]/g, '')}`} className="inline-flex items-center gap-1.5 text-xs text-[#0F5C63] hover:text-[#C9A96A]">
                <Phone className="w-3.5 h-3.5" /> {member.phone}
              </a>
            )}
            {member.email && (
              <a href={`mailto:${member.email}`} className="inline-flex items-center gap-1.5 text-xs text-[#0F5C63] hover:text-[#C9A96A]">
                <Mail className="w-3.5 h-3.5" /> {member.email}
              </a>
            )}
          </div>
        )}

        {/* Request Introduction */}
        <div className="mt-14 border border-[#C9A96A]/30 bg-white p-8">
          <h2 className="font-serif text-xl font-bold text-[#0D2226]">Request an Introduction</h2>
          <p className="text-xs text-[#1C2B2E]/60 mt-1.5 mb-6">
            Kyle personally connects members for now - tell us a bit about what you're looking for.
          </p>

          {success ? (
            <div className="flex items-center gap-2 text-[#0F5C63] text-sm font-bold py-4">
              <CheckCircle2 className="w-5 h-5" />
              Request sent. Kyle will follow up personally.
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-3">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <input
                  type="text" required value={requesterName} onChange={(e) => setRequesterName(e.target.value)}
                  placeholder="Your Name"
                  className="w-full border border-[#0D2226]/20 p-2.5 text-xs focus:border-[#0F5C63] focus:outline-none"
                />
                <input
                  type="email" required value={requesterEmail} onChange={(e) => setRequesterEmail(e.target.value)}
                  placeholder="Your Email"
                  className="w-full border border-[#0D2226]/20 p-2.5 text-xs focus:border-[#0F5C63] focus:outline-none"
                />
              </div>
              <input
                type="text" required value={reason} onChange={(e) => setReason(e.target.value)}
                placeholder={`Why would you like to be introduced to ${member.name}?`}
                className="w-full border border-[#0D2226]/20 p-2.5 text-xs focus:border-[#0F5C63] focus:outline-none"
              />
              <textarea
                rows={3} value={message} onChange={(e) => setMessage(e.target.value)}
                placeholder="Optional message"
                className="w-full border border-[#0D2226]/20 p-2.5 text-xs focus:border-[#0F5C63] focus:outline-none resize-none"
              />
              {error && <p className="text-[11px] text-red-600">{error}</p>}
              <button
                type="submit" disabled={submitting}
                className="w-full py-3 bg-[#0D2226] hover:bg-[#0F5C63] text-[#FAF8F5] font-bold text-xs uppercase tracking-widest transition-colors flex items-center justify-center gap-2 disabled:opacity-60"
              >
                {submitting ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <ArrowRight className="w-3.5 h-3.5" />}
                {submitting ? 'Sending...' : 'Request Introduction'}
              </button>
            </form>
          )}
        </div>

        <div className="flex items-center gap-1.5 text-[11px] text-[#1C2B2E]/40 mt-4">
          <ShieldCheck className="w-3.5 h-3.5" />
          Your info is never shared without your permission.
        </div>

      </div>
    </div>
  );
};
