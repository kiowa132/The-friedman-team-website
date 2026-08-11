import React, { useState } from 'react';
import { MARKET_TRENDS, MARKET_STATS, EDITORIAL_ARTICLES } from '../data/mockData';
import { EditorialArticle } from '../types';
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip, CartesianGrid, Legend, BarChart, Bar } from 'recharts';
import { TrendingUp, FileText, ArrowRight, ShieldCheck, Mail, CheckCircle2, Download, BookOpen, X } from 'lucide-react';
import { submitLead } from '../lib/leads';
import { usePageMeta } from '../lib/usePageMeta';

interface MarketReportPageProps {
  onOpenConsultation: () => void;
}

export const MarketReportPage: React.FC<MarketReportPageProps> = ({
  onOpenConsultation
}) => {
  usePageMeta(
    'The Friedman Report | Maryland Market Intelligence',
    'Weekly, data-driven Maryland real estate market analysis for Carroll, Baltimore, Howard, and Frederick County from The Friedman Team.'
  );
  const [selectedArticle, setSelectedArticle] = useState<EditorialArticle | null>(null);
  const [emailSub, setEmailSub] = useState('');
  const [subSuccess, setSubSuccess] = useState(false);
  const [subSubmitting, setSubSubmitting] = useState(false);
  const [subError, setSubError] = useState<string | null>(null);

  const handleSubscribe = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!emailSub) return;

    setSubSubmitting(true);
    setSubError(null);

    const { ok, error } = await submitLead({
      name: emailSub.split('@')[0], // FUB requires a name - best available signal from an email-only form
      email: emailSub,
      type: 'Registration',
      message: 'Subscribed to the Friedman Market Report via the Market Report page.',
    });

    setSubSubmitting(false);

    if (!ok) {
      setSubError(error || 'Something went wrong. Please try again.');
      return;
    }

    setSubSuccess(true);
    setTimeout(() => {
      setEmailSub('');
      setSubSuccess(false);
    }, 5000);
  };

  return (
    <div className="pt-28 pb-20 space-y-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      
      {/* Editorial WSJ-Style Header */}
      <div className="border-b-4 border-[#0D2226] pb-6 space-y-4 text-center">
        <div className="flex items-center justify-between text-[11px] font-bold uppercase tracking-widest text-[#0F5C63] border-b border-[#0D2226]/20 pb-2">
          <span>Vol. VIII • Issue 30</span>
          <span>The Friedman Real Estate Intelligence Brief</span>
          <span>Maryland Edition • 2026</span>
        </div>

        <h1 className="font-serif text-4xl sm:text-7xl font-bold text-[#0D2226] tracking-tight uppercase">
          The Friedman Report
        </h1>

        <p className="font-serif italic text-base sm:text-lg text-[#1C2B2E]/80 max-w-2xl mx-auto font-normal">
          Clear, data-driven analysis of Maryland's housing market, week by week, for buyers and sellers who want the real numbers.
        </p>
      </div>

      {/* Market Statistics Bar */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {MARKET_STATS.map((stat, idx) => (
          <div key={idx} className="bg-[#FAF8F5] border-2 border-[#0D2226] p-6 rounded-xs space-y-2 shadow-sm">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-[#0F5C63]">
                {stat.county}
              </span>
              <span className="text-xs font-bold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-xs">
                YoY {stat.yoyGrowth}
              </span>
            </div>

            <div className="text-3xl font-serif font-bold text-[#0D2226]">
              {stat.avgPrice}
            </div>

            <div className="text-[11px] text-[#1C2B2E]/80 pt-1 border-t border-[#0D2226]/10 flex justify-between">
              <span>Avg Days on Market: <strong>{stat.avgDaysOnMarket} Days</strong></span>
              <span>Inventory: <strong>{stat.inventoryLevel}</strong></span>
            </div>
          </div>
        ))}
      </div>

      {/* Interactive Charts Section */}
      <div className="bg-[#0D2226] text-[#FAF8F5] p-6 sm:p-10 rounded-xs border border-[#C9A96A] shadow-2xl space-y-8">
        
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-[#FAF8F5]/10 pb-4">
          <div>
            <span className="text-xs font-bold uppercase tracking-widest text-[#C9A96A]">
              Macro Trend Analysis
            </span>
            <h2 className="font-serif text-2xl sm:text-3xl font-bold text-[#FAF8F5] mt-1">
              Average Luxury Home Valuation Trends by County
            </h2>
          </div>

          <button
            onClick={onOpenConsultation}
            className="px-4 py-2 bg-[#C9A96A] text-[#0D2226] font-bold text-xs uppercase tracking-wider rounded-xs"
          >
            Request County Market Briefing
          </button>
        </div>

        {/* Recharts Area Chart */}
        <div className="h-80 w-full pt-4">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={MARKET_TRENDS} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
              <defs>
                <linearGradient id="baltimoreColor" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#C9A96A" stopOpacity={0.8}/>
                  <stop offset="95%" stopColor="#C9A96A" stopOpacity={0}/>
                </linearGradient>
                <linearGradient id="carrollColor" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#0F5C63" stopOpacity={0.8}/>
                  <stop offset="95%" stopColor="#0F5C63" stopOpacity={0}/>
                </linearGradient>
                <linearGradient id="howardColor" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#A8B2A1" stopOpacity={0.8}/>
                  <stop offset="95%" stopColor="#A8B2A1" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#1A2E33" />
              <XAxis dataKey="month" stroke="#A8B2A1" tick={{ fontSize: 11 }} />
              <YAxis
                stroke="#A8B2A1"
                tick={{ fontSize: 11 }}
                tickFormatter={(value) => `$${(value / 1000).toFixed(0)}k`}
              />
              <Tooltip
                contentStyle={{ backgroundColor: '#0D2226', borderColor: '#C9A96A', color: '#FAF8F5', fontSize: '12px' }}
                formatter={(value: any) => [`$${value.toLocaleString()}`, 'Avg Price']}
              />
              <Legend wrapperStyle={{ paddingTop: '10px', fontSize: '12px' }} />
              <Area type="monotone" dataKey="baltimoreAvgPrice" name="Baltimore County ($1.3M+)" stroke="#C9A96A" fillOpacity={1} fill="url(#baltimoreColor)" />
              <Area type="monotone" dataKey="howardAvgPrice" name="Howard County ($1.0M+)" stroke="#A8B2A1" fillOpacity={1} fill="url(#howardColor)" />
              <Area type="monotone" dataKey="carrollAvgPrice" name="Carroll County ($895k+)" stroke="#0F5C63" fillOpacity={1} fill="url(#carrollColor)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>

      </div>

      {/* Editorial Articles Section */}
      <div className="space-y-8">
        <div className="border-b-2 border-[#0D2226] pb-3 flex items-center justify-between">
          <h2 className="font-serif text-3xl font-bold text-[#0D2226]">
            Featured Market Intelligence Articles
          </h2>
          <span className="text-xs font-bold uppercase tracking-wider text-[#0F5C63]">
            Edited by Kyle Friedman
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {EDITORIAL_ARTICLES.map((article) => (
            <div
              key={article.id}
              className="bg-[#FAF8F5] border border-[#C9A96A]/30 rounded-xs overflow-hidden shadow-md flex flex-col justify-between group hover:border-[#0D2226] transition-all"
            >
              <div>
                <div className="relative aspect-[16/10] overflow-hidden bg-[#0D2226]">
                  <img
                    src={article.image}
                    alt={article.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute top-3 left-3 bg-[#0D2226] text-[#C9A96A] text-[10px] font-bold uppercase px-2.5 py-1">
                    {article.category}
                  </div>
                </div>

                <div className="p-6 space-y-3">
                  <div className="text-[11px] text-[#0F5C63] font-bold uppercase tracking-wider flex items-center justify-between">
                    <span>{article.date}</span>
                    <span>{article.readTime}</span>
                  </div>

                  <h3 className="font-serif text-xl font-bold text-[#0D2226] group-hover:text-[#0F5C63] transition-colors leading-snug">
                    {article.title}
                  </h3>

                  <p className="text-xs text-[#1C2B2E]/80 line-clamp-3 leading-relaxed">
                    {article.summary}
                  </p>
                </div>
              </div>

              <div className="p-6 pt-0">
                <button
                  onClick={() => setSelectedArticle(article)}
                  className="w-full py-2.5 bg-[#0D2226] hover:bg-[#0F5C63] text-[#FAF8F5] font-bold text-xs uppercase tracking-wider rounded-xs transition-colors flex items-center justify-center gap-1.5"
                >
                  <BookOpen className="w-3.5 h-3.5 text-[#C9A96A]" />
                  <span>Read Full Article</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* PDF Download / Weekly Subscription Section */}
      <div className="bg-[#FAF8F5] border-2 border-[#0D2226] p-8 sm:p-12 rounded-xs shadow-xl space-y-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          <div className="lg:col-span-8 space-y-3">
            <span className="text-xs font-bold uppercase tracking-widest text-[#0F5C63]">
              Weekly Executive Subscription
            </span>
            <h2 className="font-serif text-3xl font-bold text-[#0D2226]">
              Get The Friedman Report Delivered Directly to Your Inbox
            </h2>
            <p className="text-xs sm:text-sm text-[#1C2B2E]/80 max-w-xl">
              Receive private off-market transaction summaries, regional pricing metrics, and agricultural land preservation alerts before standard news release.
            </p>
          </div>

          <div className="lg:col-span-4">
            {subSuccess ? (
              <div className="bg-[#0F5C63] text-[#FAF8F5] p-4 rounded-xs text-xs font-bold flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5 text-[#C9A96A]" />
                <span>Subscription Confirmed! You are on the VIP Report List.</span>
              </div>
            ) : (
              <form onSubmit={handleSubscribe} className="space-y-3">
                <input
                  type="email"
                  required
                  value={emailSub}
                  onChange={(e) => setEmailSub(e.target.value)}
                  placeholder="Enter your email address..."
                  className="w-full bg-[#FAF8F5] border border-[#0D2226] p-3 text-xs text-[#0D2226] focus:border-[#C9A96A] focus:outline-none"
                />
                <button
                  type="submit"
                  disabled={subSubmitting}
                  className="w-full py-3 bg-[#0D2226] hover:bg-[#0F5C63] text-[#FAF8F5] font-bold text-xs uppercase tracking-widest transition-colors flex items-center justify-center gap-2 disabled:opacity-60"
                >
                  <Download className="w-4 h-4 text-[#C9A96A]" />
                  <span>{subSubmitting ? 'Submitting...' : 'Subscribe & Download Latest Issue'}</span>
                </button>
                {subError && (
                  <p className="text-xs text-red-600">{subError}</p>
                )}
              </form>
            )}
          </div>
        </div>
      </div>

      {/* Article Drawer / Modal */}
      {selectedArticle && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-[#0D2226]/85 backdrop-blur-md flex items-center justify-center p-4 animate-fadeIn">
          <div className="bg-[#FAF8F5] border border-[#C9A96A] rounded-xs w-full max-w-3xl max-h-[90vh] overflow-y-auto p-6 sm:p-10 shadow-2xl relative space-y-6 text-[#1C2B2E]">
            <button
              onClick={() => setSelectedArticle(null)}
              className="absolute top-4 right-4 p-2 text-[#0D2226] hover:text-[#0F5C63]"
            >
              <X className="w-6 h-6" />
            </button>

            <div className="space-y-2 border-b border-[#C9A96A]/30 pb-4">
              <span className="text-xs font-bold uppercase tracking-widest text-[#0F5C63]">
                {selectedArticle.category} • {selectedArticle.date}
              </span>
              <h2 className="font-serif text-2xl sm:text-4xl font-bold text-[#0D2226]">
                {selectedArticle.title}
              </h2>
              <div className="text-xs text-[#0F5C63] font-bold">By {selectedArticle.author}</div>
            </div>

            <div className="space-y-4 text-sm leading-relaxed text-[#1C2B2E]">
              {selectedArticle.content.map((p, i) => (
                <p key={i}>{p}</p>
              ))}
            </div>

            <div className="pt-4 border-t border-[#C9A96A]/30 flex justify-between items-center">
              <button
                onClick={() => setSelectedArticle(null)}
                className="px-6 py-2 bg-[#0D2226] text-[#FAF8F5] text-xs font-bold uppercase"
              >
                Close Article
              </button>
              <button
                onClick={() => {
                  setSelectedArticle(null);
                  onOpenConsultation();
                }}
                className="px-6 py-2 bg-[#C9A96A] text-[#0D2226] text-xs font-bold uppercase"
              >
                Discuss Article Insights with Kyle Friedman
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
